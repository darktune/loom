import React, { useRef, Suspense, Component } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

class MannequinErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Graceful fallback logging for missing or unpopulated GLB file
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function MixamoModel({ url, scale, materialProps }) {
  const { scene } = useGLTF(url);
  
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (materialProps) {
          child.material = new THREE.MeshStandardMaterial(materialProps);
        }
      }
    });
    return clone;
  }, [scene, materialProps]);

  return <primitive object={clonedScene} scale={scale} position={[0, -0.9, 0]} />;
}

function ProceduralMannequin({ chestScale, heightScale, waistScale, hipsScale }) {
  return (
    <>
      <meshStandardMaterial
        attach="material"
        color="#1A1A1E"
        roughness={0.25}
        metalness={0.4}
        envMapIntensity={1.2}
      />
      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.13, 32, 32]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.48, 0]}>
        <cylinderGeometry args={[0.05, 0.065, 0.12, 32]} />
      </mesh>

      {/* Shoulders / Upper Torso */}
      <mesh position={[0, 1.25, 0]} scale={[chestScale * 1.05, 1, chestScale]}>
        <cylinderGeometry args={[0.22, 0.18, 0.35, 32]} />
      </mesh>

      {/* Mid Waist */}
      <mesh position={[0, 0.95, 0]} scale={[waistScale, 1, waistScale]}>
        <cylinderGeometry args={[0.18, 0.16, 0.3, 32]} />
      </mesh>

      {/* Hips */}
      <mesh position={[0, 0.68, 0]} scale={[hipsScale, 1, hipsScale]}>
        <cylinderGeometry args={[0.17, 0.19, 0.28, 32]} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.26 * chestScale, 1.25, 0]} rotation={[0, 0, 0.1]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.045, 0.038, 0.45, 16]} />
        </mesh>
        <mesh position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.038, 0.03, 0.4, 16]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.26 * chestScale, 1.25, 0]} rotation={[0, 0, -0.1]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.045, 0.038, 0.45, 16]} />
        </mesh>
        <mesh position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.038, 0.03, 0.4, 16]} />
        </mesh>
      </group>

      {/* Left Leg */}
      <mesh position={[-0.1, 0.22, 0]}>
        <cylinderGeometry args={[0.08, 0.055, 0.7, 16]} />
      </mesh>
      {/* Right Leg */}
      <mesh position={[0.1, 0.22, 0]}>
        <cylinderGeometry args={[0.08, 0.055, 0.7, 16]} />
      </mesh>
    </>
  );
}

export function Mannequin({ measurements = { height: 180, chest: 40, waist: 32, hips: 39 }, modelUrl = '/models/mannequin.glb' }) {
  const groupRef = useRef();

  const heightScale = measurements.height / 180;
  const chestScale = measurements.chest / 40;
  const waistScale = measurements.waist / 32;
  const hipsScale = measurements.hips / 39;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.015 - 0.9;
    }
  });

  const materialProps = {
    color: '#1A1A1E',
    roughness: 0.25,
    metalness: 0.4,
  };

  const proceduralFallback = (
    <ProceduralMannequin chestScale={chestScale} heightScale={heightScale} waistScale={waistScale} hipsScale={hipsScale} />
  );

  return (
    <group ref={groupRef} scale={[chestScale, heightScale, (waistScale + hipsScale) / 2]}>
      <MannequinErrorBoundary fallback={proceduralFallback}>
        <Suspense fallback={proceduralFallback}>
          <MixamoModel url={modelUrl} scale={[1, 1, 1]} materialProps={materialProps} />
        </Suspense>
      </MannequinErrorBoundary>

      {/* Base Display Stand */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.04, 32]} />
        <meshStandardMaterial color="#800020" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
