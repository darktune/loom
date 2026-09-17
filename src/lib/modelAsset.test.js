import test from 'node:test';
import assert from 'node:assert/strict';
import { BoxGeometry, Mesh, Group, MeshStandardMaterial, Vector3, Box3 } from 'three';
import { prepareModel, inspectGlb } from './modelAsset.js';

test('model preparation preserves shape, normals, materials, and source transforms', () => {
  const scene = new Group(), part = new Mesh(new BoxGeometry(2,4,1), new MeshStandardMaterial({ color: '#dd8899' }));
  part.position.set(3,5,1); part.rotation.z = 0.2; scene.add(part);
  const before = Array.from(part.geometry.attributes.position.array);
  const prepared = prepareModel(scene);
  assert.deepEqual(Array.from(part.geometry.attributes.position.array), before);
  assert.equal(prepared.root.children[0].children[0].geometry, part.geometry);
  assert.equal(prepared.root.children[0].children[0].material, part.material);
  assert.equal(prepared.root.scale.x, prepared.root.scale.y);
  assert.equal(prepared.root.scale.y, prepared.root.scale.z);
  const sourceSize = new Box3().setFromObject(scene).getSize(new Vector3());
  const shownSize = new Box3().setFromObject(prepared.root).getSize(new Vector3());
  assert.ok(Math.abs(sourceSize.x/sourceSize.y - shownSize.x/shownSize.y) < 1e-6);
  assert.equal(prepared.stats.triangles,12);
});
function glb(json) {
  const content = Buffer.from(JSON.stringify(json).padEnd(Math.ceil(JSON.stringify(json).length/4)*4,' '));
  const output = Buffer.alloc(20+content.length);
  output.writeUInt32LE(0x46546c67,0); output.writeUInt32LE(2,4); output.writeUInt32LE(output.length,8);
  output.writeUInt32LE(content.length,12); output.writeUInt32LE(0x4e4f534a,16); content.copy(output,20);
  return output.buffer.slice(output.byteOffset,output.byteOffset+output.byteLength);
}
test('GLB import rejects broken headers and external dependencies', () => {
  assert.throws(() => inspectGlb(new ArrayBuffer(8)));
  assert.throws(() => inspectGlb(glb({asset:{version:'2.0'},images:[{uri:'https://example.com/photo.png'}]})));
  assert.throws(() => inspectGlb(glb({asset:{version:'2.0'},buffers:[{uri:'private.bin'}]})));
  assert.equal(inspectGlb(glb({asset:{version:'2.0'},meshes:[]})).version,'2.0');
});
