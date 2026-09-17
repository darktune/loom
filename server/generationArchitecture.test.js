import test from 'node:test';
import assert from 'node:assert/strict';
import { providerCatalog, createJobStore, chooseProvider } from './generationArchitecture.js';

test('catalog describes supported provider capabilities without hiding limits', () => {
  assert.deepEqual(Object.keys(providerCatalog), ['tripo-api', 'meshy-browser', 'local-runtime']);
  assert.equal(providerCatalog['tripo-api'].mode, 'server');
  assert.equal(providerCatalog['meshy-browser'].mode, 'supervised-browser');
  assert.equal(providerCatalog['local-runtime'].available, false);
  assert.equal(providerCatalog['local-runtime'].measurementFit, false);
});

test('provider choice is deterministic and rejects unavailable local runtime', () => {
  assert.equal(chooseProvider({ requested: 'tripo-api', tripoConfigured: true }).id, 'tripo-api');
  assert.equal(chooseProvider({ requested: 'meshy-browser', tripoConfigured: false }).id, 'meshy-browser');
  assert.equal(chooseProvider({ requested: 'auto', tripoConfigured: true }).id, 'tripo-api');
  assert.equal(chooseProvider({ requested: 'auto', tripoConfigured: false }).id, 'meshy-browser');
  assert.throws(() => chooseProvider({ requested: 'local-runtime', tripoConfigured: false }), /unavailable/);
});

test('job store enforces one active job and retains terminal result', () => {
  const store = createJobStore({ now: () => 1000 });
  const job = store.create({ id: 'job-1', provider: 'tripo-api', inputHash: 'abc' });
  assert.equal(job.status, 'queued');
  assert.throws(() => store.create({ id: 'job-2', provider: 'tripo-api', inputHash: 'def' }), /active/);
  store.update('job-1', { status: 'success', modelUrl: 'https://example.test/model.glb' });
  assert.equal(store.get('job-1').modelUrl, 'https://example.test/model.glb');
  assert.equal(store.active(), null);
});
