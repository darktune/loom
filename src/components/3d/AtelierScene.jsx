import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float } from '@react-three/drei';
import { Mannequin } from './Mannequin';
import { GarmentModel } from './GarmentModel';

export function AtelierScene({ garment, measurements, isNightLighting = false }) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0.8, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        {/* Editorial Lighting Rig */}
        <ambientLight intensity={isNightLighting ? 0.3 : 0.65} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={isNightLighting ? 0.8 : 1.8}
          color="#FFFAEF"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight
          position={[-4, 6, -3]}
          intensity={isNightLighting ? 1.2 : 0.8}
          color="#C9A96E"
          angle={0.6}
          penumbra={0.8}
        />
        <pointLight position={[0, -1, 2]} intensity={0.4} color="#800020" />

        <Suspense fallback={null}>
          <group position={[0, -0.2, 0]}>
            <Mannequin measurements={measurements} />
            <GarmentModel garment={garment} />
          </group>

          {/* Contact Shadow Plane */}
          <ContactShadows
            position={[0, -1.1, 0]}
            opacity={0.7}
            scale={6}
            blur={2.5}
            far={4}
            color="#800020"
          />

          <Environment preset={isNightLighting ? 'night' : 'studio'} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={1.8}
          maxDistance={5.0}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}
