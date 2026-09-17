import test from 'node:test';
import assert from 'node:assert/strict';
import { traceProfile } from './referenceMapping.js';
import { buildConstruction, defaultConstruction } from './construction.js';

test('traced outline produces stable normalized sections independent of image resolution', () => {
  const points = [[0.3, 0.1], [0.7, 0.1], [0.9, 0.5], [0.7, 0.9], [0.3, 0.9], [0.1, 0.5]];
  const profile = traceProfile(points, 800, 1000);
  assert.equal(profile.widths.length, 33);
  assert.ok(profile.widths[16] > profile.widths[0]);
  assert.deepEqual(profile, traceProfile(points, 1600, 2000));
  assert.ok(Math.abs(profile.aspectRatio - 0.8) < 1e-8);
});
test('invalid and self-intersecting traces are rejected', () => {
  for (const points of [[], [[0,0],[1,1],[0,1],[1,0]], [[0,0],[0,0],[0,0]], [[0,0],[2,0],[0,1]]]) {
    assert.throws(() => traceProfile(points, 800, 1000));
  }
});

test('outline at the photo boundary is flagged as potentially cropped', () => {
  assert.equal(traceProfile([[0.2,0.1],[0.8,0.1],[0.8,1],[0.2,1]],800,1000).touchesImageEdge, true);
  assert.equal(traceProfile([[0.2,0.1],[0.8,0.1],[0.8,0.9],[0.2,0.9]],800,1000).touchesImageEdge, false);
});
test('accepted reference outline changes mesh and appears in blueprint provenance', () => {
  const profile = { ...traceProfile([[0.1,0.1],[0.9,0.1],[0.7,0.9],[0.3,0.9]], 800, 1000), sourceId: 'ref-1', filename: 'front.png', role: 'front' };
  const measurements = { height: 176, weight: 68, chest: 94, waist: 78, hip: 96 };
  const original = buildConstruction(measurements, defaultConstruction);
  const mapped = buildConstruction(measurements, { ...defaultConstruction, referenceProfile: profile });
  assert.notDeepEqual(original.mesh.positions, mapped.mesh.positions);
  assert.deepEqual(original.mesh.indices, mapped.mesh.indices);
  assert.equal(mapped.referenceMapping.filename, 'front.png');
  assert.equal(mapped.analysisMethod, 'user-traced-silhouette');
});
