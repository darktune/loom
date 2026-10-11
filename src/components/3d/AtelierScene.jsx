import React, { Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { Mannequin } from './Mannequin';
import { GarmentModel } from './GarmentModel';

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('⚠️ 3D Atelier Scene Fallback:', error?.message || error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export function AtelierScene({ garment, measurements, isNightLighting = false }) {
  return (
    <div
      className="w-full h-full relative"
      style={{ touchAction: 'none' }}
      aria-label="Interactive 3D Mannequin Showroom Viewport"
      role="region"
    >
      <Canvas
        camera={{ position: [0, 0.8, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('⚠️ WebGL context lost. Attempting auto-restoration...');
          }, false);
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('✅ WebGL context successfully restored.');
          }, false);
        }}
        shadows
      >
        {/* Offline High-Fidelity Studio Lighting Rig */}
        <ambientLight intensity={isNightLighting ? 0.35 : 0.75} />
        
        {/* Key Spotlight */}
        <directionalLight
          position={[4, 7, 4]}
          intensity={isNightLighting ? 0.9 : 1.9}
          color="#FFFAEF"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Luxury Gold Filigree Rim Light */}
        <spotLight
          position={[-4, 5, -2]}
          intensity={isNightLighting ? 1.5 : 1.1}
          color="#C9A96E"
          angle={0.65}
          penumbra={0.8}
        />

        {/* Deep Wine Accent Fill Light */}
        <pointLight position={[0, -1, 2.5]} intensity={0.5} color="#800020" />
        
        {/* Overhead Studio Soft Light */}
        <directionalLight position={[0, 5, -2]} intensity={0.4} color="#FFF8F0" />

        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <group position={[0, -0.2, 0]}>
              <Mannequin measurements={measurements} />
              <GarmentModel garment={garment} />
            </group>

            {/* Contact Shadow Plane */}
            <ContactShadows
              position={[0, -1.1, 0]}
              opacity={0.75}
              scale={6}
              blur={2.2}
              far={4}
              color="#800020"
            />
          </Suspense>
        </SceneErrorBoundary>

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

