import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Hotspots } from './Hotspots';

export function GarmentModel({ garment }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.012;
    }
  });

  if (!garment) return null;

  const garmentColor = garment?.colorHex || '#800020';
  const modelType = garment?.modelType || 'agbada';

  return (
    <group ref={meshRef}>
      {modelType === 'agbada' && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.55, 0.72, 1.25, 32]} />
            <meshStandardMaterial color={garmentColor} roughness={0.4} metalness={0.15} />
          </mesh>

          <mesh position={[0, 0.96, 0.28]} rotation={[0.4, 0, 0]}>
            <torusGeometry args={[0.18, 0.035, 16, 32]} />
            <meshStandardMaterial color="#C9A96E" metalness={0.9} roughness={0.1} />
          </mesh>

          <mesh position={[-0.55, 0.4, 0]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[0.3, 1.1, 0.65]} />
            <meshStandardMaterial color={garmentColor} roughness={0.35} />
          </mesh>

          <mesh position={[0.55, 0.4, 0]} rotation={[0, 0, -0.35]}>
            <boxGeometry args={[0.3, 1.1, 0.65]} />
            <meshStandardMaterial color={garmentColor} roughness={0.35} />
          </mesh>
        </group>
      )}

      {modelType === 'kaftan' && (
        <group position={[0, 0.1, 0]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.32, 0.38, 1.35, 32]} />
            <meshStandardMaterial color={garmentColor} roughness={0.2} metalness={0.1} />
          </mesh>

          <mesh position={[0, 0.4, 0.19]}>
            <boxGeometry args={[0.04, 1.2, 0.02]} />
            <meshStandardMaterial color="#800020" metalness={0.5} roughness={0.2} />
          </mesh>
        </group>
      )}

      {modelType === 'tuxedo' && (
        <group position={[0, 0.1, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.34, 0.36, 0.95, 32]} />
            <meshStandardMaterial color={garmentColor} roughness={0.5} metalness={0.05} />
          </mesh>

          <mesh position={[-0.12, 0.65, 0.17]} rotation={[0.2, 0.2, -0.3]}>
            <boxGeometry args={[0.12, 0.45, 0.03]} />
            <meshStandardMaterial color="#111115" roughness={0.1} metalness={0.8} />
          </mesh>

          <mesh position={[0.12, 0.65, 0.17]} rotation={[0.2, -0.2, 0.3]}>
            <boxGeometry args={[0.12, 0.45, 0.03]} />
            <meshStandardMaterial color="#111115" roughness={0.1} metalness={0.8} />
          </mesh>
        </group>
      )}

      <Hotspots hotspots={garment?.hotspots} />
    </group>
  );
}
