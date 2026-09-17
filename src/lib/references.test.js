import test from 'node:test';
import assert from 'node:assert/strict';
import { validateReference } from './references.js';
test('images and video have separate size limits', () => {
  assert.equal(validateReference({ type: 'image/jpeg', size: 100 }), null);
  assert.equal(validateReference({ type: 'video/mp4', size: 40 * 1024 * 1024 }), null);
  assert.match(validateReference({ type: 'image/png', size: 11 * 1024 * 1024 }), /10 MB/);
  assert.match(validateReference({ type: 'video/webm', size: 51 * 1024 * 1024 }), /50 MB/);
});
test('reject empty files and executable content', () => {
  assert.ok(validateReference({ type: 'image/png', size: 0 }));
  assert.ok(validateReference({ type: 'text/html', size: 100 }));
});
