import { useEffect, useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute, DoubleSide } from 'three';

export default function ConstructionGarment({ blueprint, wireframe }) {
  const geometry = useMemo(() => {
    const mesh = new BufferGeometry();
    mesh.setAttribute('position', new Float32BufferAttribute(blueprint.mesh.positions, 3));
    mesh.setAttribute('uv', new Float32BufferAttribute(blueprint.mesh.uv, 2));
    mesh.setIndex(blueprint.mesh.indices);
    mesh.computeVertexNormals();
    return mesh;
  }, [blueprint]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const height = blueprint.measurementsCm.height / 100;
  return <group position={[0, -height / 2, 0]}>
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#d9c9aa" roughness={0.85} side={DoubleSide} wireframe={wireframe} />
    </mesh>
    <mesh position={[0, height * 0.92, 0]} castShadow><sphereGeometry args={[0.105, 32, 24]} /><meshStandardMaterial color="#79736c" roughness={0.6} /></mesh>
    <mesh position={[0, height * 0.84, 0]}><cylinderGeometry args={[0.055, 0.06, 0.14, 32]} /><meshStandardMaterial color="#79736c" /></mesh>
    {[-1, 1].map(side => <mesh key={side} position={[side * 0.09, height * 0.19, 0]} castShadow><capsuleGeometry args={[0.065, height * 0.3, 8, 24]} /><meshStandardMaterial color="#79736c" roughness={0.6} /></mesh>)}
  </group>;
}
