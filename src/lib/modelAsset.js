import { Box3, Group, Vector3 } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

// Frame the asset without changing authored geometry, normals or materials.
export function prepareModel(scene) {
  const content = clone(scene);
  content.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(content);
  const size = bounds.getSize(new Vector3());
  const extent = Math.max(size.x, size.y, size.z);
  if (bounds.isEmpty() || !Number.isFinite(extent) || extent < 0.00001) throw new Error('Model has invalid dimensions.');
  const root = new Group();
  root.add(content);
  const scale = 1.8 / extent;
  root.scale.setScalar(scale);
  root.position.copy(bounds.getCenter(new Vector3())).multiplyScalar(-scale);
  const stats = { triangles: 0, meshes: 0 };
  content.traverse((node) => {
    if (!node.isMesh) return;
    stats.meshes++;
    stats.triangles += (node.geometry.index?.count ?? node.geometry.attributes.position?.count ?? 0) / 3;
  });
  return { root, stats };
}

export function inspectGlb(buffer) {
  const fail = () => { throw new Error('Choose a valid, self-contained GLB 2.0 export with embedded textures.'); };
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 20) fail();
  const view = new DataView(buffer);
  if (view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2 || view.getUint32(8, true) !== buffer.byteLength) fail();
  const length = view.getUint32(12, true);
  if (view.getUint32(16, true) !== 0x4e4f534a || length % 4 || length > buffer.byteLength - 20) fail();
  let json;
  try { json = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 20, length))); } catch { fail(); }
  if (json.asset?.version !== '2.0') fail();
  for (const item of [...(json.images ?? []), ...(json.buffers ?? [])]) {
    if (item.uri && !item.uri.startsWith('data:')) fail();
  }
  return { version: json.asset.version };
}
