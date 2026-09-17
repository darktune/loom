const BASE_URL = 'https://api.tripo3d.ai/v2/openapi';
export const roles = ['front', 'left', 'back', 'right'];
export function validateGeneration(input) {
  if (!input || typeof input !== 'object') throw new Error('Invalid generation request.');
  if (input.consent !== true) throw new Error('Confirm sharing the selected images with Tripo.');
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(input.requestId || '')) throw new Error('Invalid request ID.');
  if (!Array.isArray(input.images) || input.images.length < 1 || input.images.length > 4) throw new Error('Select one to four views.');
  const seen = new Set();
  for (const image of input.images) {
    if (!roles.includes(image.role) || seen.has(image.role)) throw new Error('Each generation view must be unique.'); seen.add(image.role);
    if (typeof image.dataUrl !== 'string' || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(image.dataUrl) || image.dataUrl.length > 2 * 1024 * 1024) throw new Error('Invalid or oversized generation image.');
    const bytes = Buffer.from(image.dataUrl.split(',')[1], 'base64');
    if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes.at(-2) !== 0xff || bytes.at(-1) !== 0xd9) throw new Error('Expected a JPEG image.');
  }
  if (!seen.has('front')) throw new Error('Assign a front view before generating.');
}
export function generationPayload(images) {
  const common = { model_version: 'v3.1-20260211', texture: true, pbr: true, face_limit: 30000 };
  return images.length === 1 ? { ...common, type: 'image_to_model', file: { type: 'jpeg', file_token: images[0].token } }
    : { ...common, type: 'multiview_to_model', files: roles.map((role) => { const image = images.find((entry) => entry.role === role); return image ? { type: 'jpeg', file_token: image.token } : { type: 'jpeg' }; }) };
}
export function createTripoClient(key, fetchImpl = fetch) {
  async function request(path, options = {}) {
    let response;
    try { response = await fetchImpl(`${BASE_URL}${path}`, { ...options, headers: { ...options.headers, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(60000) }); }
    catch { throw new Error('Provider connection failed. If submission had started, check your Tripo dashboard before generating again.'); }
    if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? 'Tripo rejected the API key or account access.' : response.status === 429 ? 'Tripo rate limit reached. Wait before trying again.' : `Tripo request failed (${response.status}). Check your account credits and dashboard.`);
    const result = await response.json();
    if (result.code !== 0 || !result.data) throw new Error('Tripo could not complete the request. Check your account dashboard.');
    return result.data;
  }
  return {
    async balance() {
      const data = await request('/user/balance');
      return { available: Number(data.balance) || 0, frozen: Number(data.frozen) || 0 };
    },
    async create(images) {
      const account = await request('/user/balance');
      if (!(Number(account.balance) > 0)) throw new Error('No Tripo API credits available. Check trial credits in your Tripo API dashboard before generating.');
      const uploaded = [];
      for (const image of images) {
        const form = new FormData(); form.append('file', new Blob([Buffer.from(image.dataUrl.split(',')[1], 'base64')], { type: 'image/jpeg' }), `${image.role}.jpg`);
        const result = await request('/upload', { method: 'POST', body: form });
        if (typeof result.image_token !== 'string') throw new Error('Tripo did not return an upload token.');
        uploaded.push({ role: image.role, token: result.image_token });
      }
      const data = await request('/task', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(generationPayload(uploaded)) });
      if (!/^[a-zA-Z0-9-]+$/.test(data.task_id || '')) throw new Error('No task ID returned. Check Tripo before resubmitting.');
      return data.task_id;
    },
    async status(taskId) {
      const data = await request(`/task/${encodeURIComponent(taskId)}`);
      const model = data.output?.pbr_model || data.output?.model;
      const modelUrl = typeof model === 'string' && /^https:\/\//.test(model) ? model : null;
      return { status: data.status || 'unknown', progress: Math.max(0, Math.min(100, Number(data.progress) || 0)), modelUrl, credits: data.consumed_credit ?? null };
    },
  };
}
