export const providerCatalog = Object.freeze({
  'tripo-api': Object.freeze({ id: 'tripo-api', label: 'Tripo API', mode: 'server', available: true, views: 4, textured: true, measurementFit: false, export: 'provider GLB URL' }),
  'meshy-browser': Object.freeze({ id: 'meshy-browser', label: 'Meshy browser', mode: 'supervised-browser', available: true, views: 4, textured: true, measurementFit: false, export: 'user downloaded GLB' }),
  'local-runtime': Object.freeze({ id: 'local-runtime', label: 'Local reconstruction runtime', mode: 'local', available: false, views: 4, textured: true, measurementFit: false, export: 'local GLB' }),
});

export function chooseProvider({ requested = 'auto', tripoConfigured = false } = {}) {
  const id = requested === 'auto' ? (tripoConfigured ? 'tripo-api' : 'meshy-browser') : requested;
  const provider = providerCatalog[id];
  if (!provider) throw new Error(`Unknown generation provider: ${id}`);
  if (!provider.available) throw new Error(`${provider.label} is unavailable in this installation.`);
  return provider;
}

export function createJobStore({ now = Date.now, retentionMs = 24 * 60 * 60 * 1000 } = {}) {
  const jobs = new Map();
  function prune() { for (const [id, job] of jobs) if (now() - job.createdAt > retentionMs) jobs.delete(id); }
  return {
    create(input) {
      prune();
      if (jobs.has(input.id)) return jobs.get(input.id);
      if ([...jobs.values()].some(job => ['queued', 'running', 'uploading'].includes(job.status))) throw new Error('A generation job is already active.');
      const job = { id: input.id, provider: input.provider, inputHash: input.inputHash, createdAt: now(), status: 'queued', progress: 0, modelUrl: null };
      jobs.set(job.id, job); return job;
    },
    get(id) { prune(); return jobs.get(id) || null; },
    update(id, patch) { const job = jobs.get(id); if (!job) return null; Object.assign(job, patch); return job; },
    active() { prune(); return [...jobs.values()].find(job => ['queued', 'running', 'uploading'].includes(job.status)) || null; },
  };
}
