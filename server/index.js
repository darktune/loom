import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createTripoClient, validateGeneration } from './tripo.js';
import { createJobStore, chooseProvider, providerCatalog } from './generationArchitecture.js';
export function createGenerationServer({ key = '', client = createTripoClient(key) } = {}) {
  const jobs = createJobStore();
  const send = (res, status, data, origin = '') => {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
    if (process.env.NODE_ENV === 'production' || process.env.ALLOWED_ORIGIN) {
      headers['Access-Control-Allow-Origin'] = process.env.ALLOWED_ORIGIN || origin || '*';
    }
    res.writeHead(status, headers);
    res.end(JSON.stringify(data));
  };
  return createServer(async (req, res) => {
    const host = req.headers.host || '', origin = req.headers.origin;
    const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.ALLOWED_ORIGIN);
    if (isProd && req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      return res.end();
    }
    if (!isProd) {
      if (!/^(localhost|127\.0\.0\.1):\d+$/.test(host) || (origin && !/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin))) return send(res, 403, { error: 'Local development requests only.' });
    }
    const path = req.url?.split('?')[0];
    if (req.method === 'GET' && path === '/api/generation/config') {
      if (!key) return send(res, 200, { provider: 'Tripo', configured: false, connected: false, maxViews: 4, providers: providerCatalog }, origin);
      try {
        const balance = await client.balance();
        return send(res, 200, { provider: 'Tripo', configured: true, connected: true, availableCredits: balance.available, frozenCredits: balance.frozen, maxViews: 4, providers: providerCatalog }, origin);
      } catch (error) { return send(res, 200, { provider: 'Tripo', configured: true, connected: false, error: error.message, maxViews: 4, providers: providerCatalog }, origin); }
    }
    if (req.method === 'POST' && path === '/api/generation') {
      if (!key) return send(res, 503, { error: 'Generation is not configured. Add TRIPO_API_KEY to .env and restart the API server.' }, origin);
      if (!req.headers['content-type']?.startsWith('application/json')) return send(res, 415, { error: 'Expected JSON.' }, origin);
      try {
        const chunks = []; let size = 0;
        for await (const chunk of req) { size += chunk.length; if (size > 9 * 1024 * 1024) { send(res, 413, { error: 'Generation images are too large.' }, origin); return; } chunks.push(chunk); }
        const input = JSON.parse(Buffer.concat(chunks).toString()); validateGeneration(input);
        const provider = chooseProvider({ requested: input.provider || 'auto', tripoConfigured: Boolean(key) });
        if (provider.id !== 'tripo-api') return send(res, 409, { error: `${provider.label} requires supervised browser handoff.` }, origin);
        const existing = jobs.get(input.requestId);
        if (existing) return send(res, 200, existing, origin);
        let job;
        try { job = jobs.create({ id: input.requestId, provider: provider.id, inputHash: input.inputHash || input.requestId }); }
        catch (error) { return send(res, 409, { error: error.message }, origin); }
        Object.assign(job, { status: 'uploading', taskId: null });
        client.create(input.images).then((taskId) => { Object.assign(job, { taskId, status: 'queued' }); }).catch((error) => { Object.assign(job, { status: 'failed', error: error.message }); });
        return send(res, 202, job, origin);
      } catch (error) { return send(res, 400, { error: error instanceof SyntaxError ? 'Invalid request JSON.' : error.message }, origin); }
    }
    if (req.method === 'GET' && path?.startsWith('/api/generation/')) {
      const job = jobs.get(path.slice('/api/generation/'.length));
      if (!job) return send(res, 404, { error: 'Job not found. The server may have restarted; check Tripo before resubmitting.' }, origin);
      if (job.taskId && !['failed', 'banned', 'expired', 'cancelled', 'unknown'].includes(job.status)) {
        try { Object.assign(job, await client.status(job.taskId)); } catch (error) { return send(res, 502, { error: error.message }, origin); }
      }
      return send(res, 200, job, origin);
    }
    send(res, 404, { error: 'Not found.' }, origin);
  });
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try { process.loadEnvFile(); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const port = Number(process.env.PORT || process.env.GENERATION_PORT || 3001);
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
  createGenerationServer({ key: process.env.TRIPO_API_KEY || '' }).listen(port, host, () => console.log(`Loom generation API: http://${host}:${port} (${process.env.TRIPO_API_KEY ? 'Tripo configured' : 'API key needed'})`));
}
