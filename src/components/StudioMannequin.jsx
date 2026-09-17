import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Group, Mesh, Vector3 } from 'three';

export default function StudioMannequin({ proportions, texture }) {
  const { scene } = useGLTF('/models/atelier-dress-form.glb');
  const model = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(scene);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const factor = 1.45 / size.y;
    const group = new Group();
    scene.traverse((node) => {
      if (!node.isMesh) return;
      const geometry = node.geometry.clone().applyMatrix4(node.matrixWorld);
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const t = (positions.getY(i) - box.min.y) / size.y;
        const width = t < 0.4
          ? proportions.hip + (proportions.waist - proportions.hip) * Math.max(0, t / 0.4)
          : t < 0.75 ? proportions.waist + (proportions.chest - proportions.waist) * (t - 0.4) / 0.35 : proportions.chest;
        positions.setXYZ(i, (positions.getX(i) - center.x) * factor * width,
          (positions.getY(i) - box.min.y) * factor * proportions.height - 0.45,
          (positions.getZ(i) - center.z) * factor * width);
      }
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      const materials = (Array.isArray(node.material) ? node.material : [node.material]).map((source) => {
        const material = source.clone();
        // Preserve normal/roughness maps from the authored asset.
        if (texture && /corset/i.test(source.name)) {
          // This sample uses one atlas for both the linen form and red corset.
          // Restrict the swatch to the burgundy area instead of painting over the form.
          material.onBeforeCompile = (shader) => {
            shader.uniforms.loomFabric = { value: texture };
            shader.fragmentShader = 'uniform sampler2D loomFabric;\n' + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
              #ifdef USE_MAP
                vec4 sampledDiffuseColor = texture2D(map, vMapUv);
                float redArea = sampledDiffuseColor.r - max(sampledDiffuseColor.g, sampledDiffuseColor.b);
                float redRatio = sampledDiffuseColor.r / max(0.001, max(sampledDiffuseColor.g, sampledDiffuseColor.b));
                float fabricMask = smoothstep(0.015, 0.07, redArea) * smoothstep(1.6, 2.4, redRatio);
                vec3 swatch = texture2D(loomFabric, fract(vMapUv * 4.0)).rgb;
                sampledDiffuseColor.rgb = mix(sampledDiffuseColor.rgb, swatch, fabricMask);
                diffuseColor *= sampledDiffuseColor;
              #endif
            `);
          };
          material.customProgramCacheKey = () => 'loom-fabric-v1';
        }
        material.envMapIntensity = 0.7;
        material.needsUpdate = true;
        return material;
      });
      const mesh = new Mesh(geometry, Array.isArray(node.material) ? materials : materials[0]);
      mesh.castShadow = true; mesh.receiveShadow = true;
      group.add(mesh);
    });
    return group;
  }, [scene, proportions.height, proportions.chest, proportions.waist, proportions.hip, texture]);
  useEffect(() => () => model.traverse((node) => {
    if (!node.isMesh) return;
    node.geometry.dispose();
    (Array.isArray(node.material) ? node.material : [node.material]).forEach((material) => material.dispose());
  }), [model]);
  return <group>
    <primitive object={model} dispose={null} />
    <mesh position={[0, -0.76, 0]} castShadow><cylinderGeometry args={[0.025, 0.025, 0.65, 32]} /><meshStandardMaterial color="#b7a17b" metalness={0.85} roughness={0.25} /></mesh>
    <mesh position={[0, -1.09, 0]} receiveShadow castShadow><cylinderGeometry args={[0.4, 0.42, 0.055, 64]} /><meshStandardMaterial color="#242024" metalness={0.65} roughness={0.28} /></mesh>
  </group>;
}
