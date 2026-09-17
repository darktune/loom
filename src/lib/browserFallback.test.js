import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFallbackFile, fallbackBrief } from './browserFallback.js';

test('browser fallback rejects unsupported, empty and oversized exports before reading', () => {
  assert.throws(() => validateFallbackFile({ name: 'model.obj', size: 100 }), /GLB/);
  assert.throws(() => validateFallbackFile({ name: 'model.glb', size: 0 }), /empty/);
  assert.throws(() => validateFallbackFile({ name: 'model.glb', size: 201 * 1024 * 1024 }), /200/);
  assert.doesNotThrow(() => validateFallbackFile({ name: 'MODEL.GLB', size: 1024 }));
});

test('Meshy handoff records provenance without claiming generation or measured fitting', () => {
  const items = [{ role: 'front', file: { name: 'front.jpg', type: 'image/jpeg' } }, { role: 'reference', file: { name: 'clip.mp4', type: 'video/mp4' } }];
  const brief = fallbackBrief(items, { height: 176 }, 'Pink agbada');
  assert.equal(brief.provider, 'Meshy');
  assert.equal(brief.mode, 'supervised-browser');
  assert.equal(brief.fitApplied, false);
  assert.equal(brief.references.length, 1);
  assert.equal(brief.measurements.height, 176);
  assert.equal(brief.references[0].role, 'front');
});
