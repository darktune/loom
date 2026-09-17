import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { prepareModel } from '../lib/modelAsset';

export default function GeneratedGarment({ url, fit }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => prepareModel(scene), [scene]);
  return <group rotation={[0, (fit?.rotation ?? 0) * Math.PI / 180, 0]}>
    <primitive object={model.root} dispose={null} />
  </group>;
}
