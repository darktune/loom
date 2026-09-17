import test from 'node:test';
import assert from 'node:assert/strict';
import { createGenerationServer } from './index.js';
import { createTripoClient, generationPayload, validateGeneration } from './tripo.js';
const image = { role: 'front', dataUrl: 'data:image/jpeg;base64,/9j/2Q==' };
const input = { requestId: '12345678-1234-1234-1234-123456789012', consent: true, images: [image] };
test('reject missing front, duplicate roles, absent consent, and oversized data', () => {
  for (const value of [{ ...input, consent: false }, { ...input, images: [{ ...image, role: 'back' }] }, { ...input, images: [image, image] }, { ...input, images: [{ ...image, dataUrl: 'x'.repeat(2100000) }] }]) assert.throws(() => validateGeneration(value));
  assert.doesNotThrow(() => validateGeneration(input));
});
test('multiview payload keeps the documented front/left/back/right ordering', () => {
  const payload = generationPayload([{ role: 'back', token: 'back-token' }, { role: 'front', token: 'front-token' }]);
  assert.equal(payload.type, 'multiview_to_model');
  assert.deepEqual(payload.files.map((file) => file.file_token), ['front-token', undefined, 'back-token', undefined]);
  assert.equal(generationPayload([{ role: 'front', token: 'front-token' }]).type, 'image_to_model');
});
test('provider uploads selected views, creates once, and reads the returned model', async () => {
  const calls = [];
  const client = createTripoClient('test-key', async (url, options) => {
    calls.push({ url, options });
    return Response.json({ code: 0, data: url.endsWith('/balance') ? { balance: 300, frozen: 0 } : url.endsWith('/upload') ? { image_token: 'image-token' } : options.method === 'POST' ? { task_id: 'provider-task' } : { status: 'success', progress: 100, output: { pbr_model: 'https://example.com/model.glb' }, consumed_credit: 30 } });
  });
  assert.equal(await client.create([image]), 'provider-task');
  assert.equal(calls.length, 3);
  assert.equal(calls[0].options.headers.Authorization, 'Bearer test-key');
  assert.equal(JSON.parse(calls[2].options.body).file.file_token, 'image-token');
  assert.equal((await client.status('provider-task')).modelUrl, 'https://example.com/model.glb');
});
async function withServer(options, run) {
  const server = createGenerationServer(options);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}
test('missing key is explicit and never reports a generated result', async () => {
  await withServer({}, async (url) => {
    const config = await (await fetch(`${url}/api/generation/config`)).json(); assert.equal(config.configured, false);
    const result = await fetch(`${url}/api/generation`, { method: 'POST' }); assert.equal(result.status, 503);
  });
});
test('job submission is idempotent, exposes status, and blocks foreign origins', async () => {
  let creations = 0;
  await withServer({ key: 'private-test-key', client: { create: async () => { creations++; return 'provider-task'; }, status: async () => ({ status: 'success', modelUrl: 'https://example.com/model.glb', progress: 100 }) } }, async (url) => {
    const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) };
    const first = await fetch(`${url}/api/generation`, options); assert.equal(first.status, 202);
    const again = await fetch(`${url}/api/generation`, options); assert.equal(again.status, 200); assert.equal(creations, 1);
    const status = await (await fetch(`${url}/api/generation/${input.requestId}`)).json(); assert.equal(status.status, 'success'); assert.equal(status.taskId, 'provider-task');
    assert.ok(!JSON.stringify(status).includes('private-test-key'));
    const rejected = await fetch(`${url}/api/generation`, { ...options, headers: { ...options.headers, Origin: 'https://foreign.example' } }); assert.equal(rejected.status, 403);
  });
});
test('failed provider request is not retried automatically', async () => {
  let calls = 0;
  const client = createTripoClient('secret', async () => { calls++; throw new Error('network'); });
  await assert.rejects(client.create([image]), /dashboard/); assert.equal(calls, 1);
});
test('zero credits prevents any upload or generation call', async () => {
  const paths = [];
  const client = createTripoClient('test', async (url) => { paths.push(url); return Response.json({ code: 0, data: { balance: 0, frozen: 0 } }); });
  await assert.rejects(client.create([image]), /No Tripo API credits/);
  assert.deepEqual(paths, ['https://api.tripo3d.ai/v2/openapi/user/balance']);
});
test('configuration reports valid account with zero credits without revealing the key', async () => {
  await withServer({ key: 'private-test-key', client: { balance: async () => ({ available: 0, frozen: 0 }) } }, async (url) => {
    const config = await (await fetch(`${url}/api/generation/config`)).json();
    assert.equal(config.connected, true); assert.equal(config.availableCredits, 0);
    assert.ok(!JSON.stringify(config).includes('private-test-key'));
  });
});
