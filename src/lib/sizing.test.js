import test from 'node:test';
import assert from 'node:assert/strict';
import { getProportions, validateMeasurements } from './sizing.js';

const baseline = { height: '176', weight: '68', chest: '94', waist: '78', hip: '96' };
test('baseline uses neutral proportions', () => {
  assert.deepEqual(getProportions(baseline), { height: 1, chest: 1, waist: 1, hip: 1 });
});
test('invalid input never reaches geometry', () => {
  for (const value of ['', ' ', '-1', 'NaN', 'Infinity', '9999', undefined]) {
    assert.ok(validateMeasurements({ ...baseline, chest: value }).chest);
    assert.equal(getProportions({ ...baseline, chest: value }), null);
  }
});
test('circumferences scale independently; weight does not infer shape', () => {
  const actual = getProportions({ ...baseline, waist: '117', weight: '100' });
  assert.deepEqual(actual, { height: 1, chest: 1, waist: 1.5, hip: 1 });
});
