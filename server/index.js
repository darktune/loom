import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createTripoClient, validateGeneration } from './tripo.js';
export function createGenerationServer({ key = '', client = createTripoClient(key) } = {}) {
  const jobs = new Map();
  const send = (res, status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
  return createServer(async (req, res) => {
    const host = req.headers.host || '', origin = req.headers.origin;
    if (!/^(localhost|127\.0\.0\.1):\d+$/.test(host) || (origin && !/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin))) return send(res, 403, { error: 'Local development requests only.' });
    const path = req.url?.split('?')[0];
    if (req.method === 'GET' && path === '/api/generation/config') {
      if (!key) return send(res, 200, { provider: 'Tripo', configured: false, connected: false, maxViews: 4 });
      try {
        const balance = await client.balance();
        return send(res, 200, { provider: 'Tripo', configured: true, connected: true, availableCredits: balance.available, frozenCredits: balance.frozen, maxViews: 4 });
      } catch (error) { return send(res, 200, { provider: 'Tripo', configured: true, connected: false, error: error.message, maxViews: 4 }); }
    }
    if (req.method === 'POST' && path === '/api/generation') {
      if (!key) return send(res, 503, { error: 'Generation is not configured. Add TRIPO_API_KEY to .env and restart the API server.' });
      if (!req.headers['content-type']?.startsWith('application/json')) return send(res, 415, { error: 'Expected JSON.' });
      try {
        const chunks = []; let size = 0;
        for await (const chunk of req) { size += chunk.length; if (size > 9 * 1024 * 1024) { send(res, 413, { error: 'Generation images are too large.' }); return; } chunks.push(chunk); }
        const input = JSON.parse(Buffer.concat(chunks).toString()); validateGeneration(input);
        if (jobs.has(input.requestId)) return send(res, 200, jobs.get(input.requestId));
        for (const [id, job] of jobs) if (Date.now() - job.createdAt > 86400000) jobs.delete(id);
        if (jobs.size >= 100) return send(res, 429, { error: 'Local job limit reached. Save task IDs before restarting the server.' });
        if ([...jobs.values()].some((job) => ['uploading', 'queued', 'running'].includes(job.status))) return send(res, 409, { error: 'A generation is already active. Wait for it to finish.' });
        const job = { id: input.requestId, createdAt: Date.now(), status: 'uploading', progress: 0, taskId: null }; jobs.set(job.id, job);
        client.create(input.images).then((taskId) => { Object.assign(job, { taskId, status: 'queued' }); }).catch((error) => { Object.assign(job, { status: 'failed', error: error.message }); });
        return send(res, 202, job);
      } catch (error) { return send(res, 400, { error: error instanceof SyntaxError ? 'Invalid request JSON.' : error.message }); }
    }
    if (req.method === 'GET' && path?.startsWith('/api/generation/')) {
      const job = jobs.get(path.slice('/api/generation/'.length));
      if (!job) return send(res, 404, { error: 'Job not found. The server may have restarted; check Tripo before resubmitting.' });
      if (job.taskId && !['failed', 'banned', 'expired', 'cancelled', 'unknown'].includes(job.status)) {
        try { Object.assign(job, await client.status(job.taskId)); } catch (error) { return send(res, 502, { error: error.message }); }
      }
      return send(res, 200, job);
    }
    send(res, 404, { error: 'Not found.' });
  });
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try { process.loadEnvFile(); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const port = Number(process.env.GENERATION_PORT || 3001);
  createGenerationServer({ key: process.env.TRIPO_API_KEY || '' }).listen(port, '127.0.0.1', () => console.log(`Loom generation API: http://127.0.0.1:${port} (${process.env.TRIPO_API_KEY ? 'Tripo configured' : 'API key needed'})`));
}
