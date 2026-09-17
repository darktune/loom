import test from 'node:test';
import assert from 'node:assert/strict';
import { buildConstruction, defaultConstruction } from './construction.js';

const measurements = { height: 176, weight: 68, chest: 94, waist: 78, hip: 96 };
test('construction exports finite geometry, valid indices and stable vertex correspondence', () => {
  const a = buildConstruction(measurements, defaultConstruction, []);
  const b = buildConstruction({ ...measurements, chest: 120 }, defaultConstruction, []);
  assert.ok(a.mesh.positions.every(Number.isFinite));
  assert.ok(a.mesh.indices.every(i => Number.isInteger(i) && i >= 0 && i < a.vertexCount));
  assert.deepEqual(a.mesh.indices, b.mesh.indices);
  assert.deepEqual(a.mesh.uv, b.mesh.uv);
  assert.notDeepEqual(a.mesh.positions, b.mesh.positions);
  assert.ok(a.triangleCount <= 4096);
  assert.equal(a.mesh.uv.length, a.vertexCount * 2);
  assert.equal(a.vertexMap.length, a.vertexCount);
});
test('length and silhouette change actual geometry without changing topology', () => {
  const a = buildConstruction(measurements, defaultConstruction);
  const b = buildConstruction(measurements, { ...defaultConstruction, family: 'tunic', length: 70 });
  assert.notDeepEqual(a.mesh.positions, b.mesh.positions);
  assert.deepEqual(a.mesh.indices, b.mesh.indices);
  const ys = b.mesh.positions.filter((_, i) => i % 3 === 1);
  assert.ok(Math.abs(Math.max(...ys) - Math.min(...ys) - 0.7) < 1e-8);
});
test('coverage distinguishes videos and images and never claims image inference', () => {
  const a = buildConstruction(measurements, defaultConstruction, [
    { role: 'front', file: { name: 'front.jpg', type: 'image/jpeg' } },
    { role: 'back', file: { name: 'walk.mp4', type: 'video/mp4' } },
  ]);
  assert.deepEqual(a.referenceCoverage.available, ['front']);
  assert.ok(a.referenceCoverage.missing.includes('back'));
  assert.equal(a.analysisMethod, 'user-controlled-parametric');
  assert.equal(a.simulated, false);
});
test('invalid body measurements and unbounded construction settings are rejected', () => {
  assert.throws(() => buildConstruction({ ...measurements, chest: '' }, defaultConstruction));
  for (const patch of [{ length: NaN }, { ease: -1 }, { spread: 1000 }, { family: 'unknown' }]) {
    assert.throws(() => buildConstruction(measurements, { ...defaultConstruction, ...patch }));
  }
});

test('chest, waist and hip each change their own measurement-driven geometry', () => {
  const a = buildConstruction(measurements, defaultConstruction);
  for (const key of ['chest', 'waist', 'hip']) {
    const b = buildConstruction({ ...measurements, [key]: measurements[key] + 5 }, defaultConstruction);
    assert.notDeepEqual(a.mesh.positions, b.mesh.positions, `${key} must affect geometry even below the largest circumference`);
  }
});
