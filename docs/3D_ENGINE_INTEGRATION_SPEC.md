# 🧊 LOOM 3D Modeling Engine & Universal Logo — Integration Specification

**Audience:** 3D Lead / Codex IDE Collaborators  
**Date:** September 16, 2026  
**Target Components:** `src/components/3d/` & `src/components/ui/LoomLogo.jsx`

---

## 1. 🎯 Purpose & Scope

This specification provides the exact technical contract for seamlessly dropping in your **3D Modeling Engine** (generated via ChatGPT Astra / Codex IDE) and the **Universal LOOM Logo** into the existing frontend architecture without breaking the layout, lighting rig, or state hooks.

---

## 2. 🏛️ Universal LOOM Logo Integration

The frontend uses a single universal component:  
📍 **File Path:** [`src/components/ui/LoomLogo.jsx`](file:///c:/Users/USER/.gemini/antigravity/worktrees/tutorials/analyze-3d-fashion-software/src/components/ui/LoomLogo.jsx)

### Component Signature:
```jsx
export function LoomLogo({ size = 'default', showTagline = false, className = '' })
```

### How to Drop in Your Final Logo Asset:
When your commit with the official vector/SVG logo arrives:
1. Place your official SVG/image asset in `src/assets/loom-logo.svg` (or `public/loom-logo.svg`).
2. Open [`src/components/ui/LoomLogo.jsx`](file:///c:/Users/USER/.gemini/antigravity/worktrees/tutorials/analyze-3d-fashion-software/src/components/ui/LoomLogo.jsx).
3. Replace the placeholder monogram oval or wordmark with your asset:
   ```jsx
   <img 
     src="/loom-logo.svg" 
     alt="LOOM Haute Couture" 
     className={`object-contain ${isLarge ? 'h-12' : isSmall ? 'h-7' : 'h-9'} ${className}`} 
   />
   ```
*Because `<LoomLogo />` is imported across the Header, Salon Hero, Drawers, and Splash screens, your new logo will instantly propagate everywhere automatically.*

---

## 3. 🪞 3D Modeling Engine & Mannequin Architecture

The 3D stage is strictly decoupled into three layers:
```
┌────────────────────────────────────────────────────────┐
│                   <AtelierScene />                     │
│  (R3F Canvas, Offline 5-Point Lighting Rig, Shadows)   │
│                                                        │
│  ┌───────────────────────────┐  ┌───────────────────┐  │
│  │       <Mannequin />       │  │ <GarmentModel />  │  │
│  │ (Biometric Body Morphing) │  │ (Draped Fabrics)  │  │
│  └───────────────────────────┘  └───────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Layer A: The Stage Viewport
📍 **File Path:** [`src/components/3d/AtelierScene.jsx`](file:///c:/Users/USER/.gemini/antigravity/worktrees/tutorials/analyze-3d-fashion-software/src/components/3d/AtelierScene.jsx)
* **Contract:** Accepts `{ garment, measurements, isNightLighting }`.
* **Guarantees:**
  * Uses an offline mathematical 5-point studio lighting rig (`directionalLight` key light, gold rim `spotLight`, wine accent fill `pointLight`, and dome ambient light).
  * Automatically isolates mobile gestures via `touchAction: 'none'`.
  * Auto-recovers on `webglcontextlost` and `webglcontextrestored`.

---

### Layer B: The Mannequin (Biometric Morphing)
📍 **File Path:** [`src/components/3d/Mannequin.jsx`](file:///c:/Users/USER/.gemini/antigravity/worktrees/tutorials/analyze-3d-fashion-software/src/components/3d/Mannequin.jsx)

#### Props Contract:
```typescript
interface MannequinProps {
  measurements: {
    height: number; // Baseline: 180 cm
    chest: number;  // Baseline: 40 inches
    waist: number;  // Baseline: 32 inches
    hips: number;   // Baseline: 39 inches
    shoulder?: number;
    inseam?: number;
  };
  modelUrl?: string | null; // URL to custom Astra/Mixamo .glb
}
```

#### How to Connect Your Astra Engine:
`Mannequin.jsx` already contains a built-in `MixamoModel` hook wrapped in a safe `MannequinErrorBoundary`:
```jsx
function MixamoModel({ url, scale, materialProps }) {
  const { scene } = useGLTF(url);
  // Traverses meshes, assigns shadow flags & materials
  return <primitive object={scene} scale={scale} position={[0, -0.9, 0]} />;
}
```
* If you provide `modelUrl="/models/astra-mannequin.glb"`, it will stream and render your custom mesh.
* If the GLB is loading or missing, it will automatically fall back to the parametric `ProceduralMannequin` without throwing a WebGL context crash.

---

### Layer C: The Garments (Draped Couture Silhouettes)
📍 **File Path:** [`src/components/3d/GarmentModel.jsx`](file:///c:/Users/USER/.gemini/antigravity/worktrees/tutorials/analyze-3d-fashion-software/src/components/3d/GarmentModel.jsx)

#### Garment Data Object Schema:
```javascript
{
  id: 'agbada-01',
  name: 'The Sovereign Agbada',
  subtitle: 'Handcrafted Imperial Robe',
  modelType: 'agbada', // 'agbada' | 'kaftan' | 'senator' | 'tuxedo' | 'custom'
  colorHex: '#800020',
  fabric: 'Hand-Loomed Aso-Oke',
  hotspots: [
    { id: 'h1', position: [0, 0.96, 0.28], label: 'GOLD FILIGREE COLLAR', description: 'Metallic thread embroidery' }
  ],
  glbPath?: '/models/sovereign-agbada.glb' // Optional custom GLB mesh
}
```

---

## 4. 🚀 Verification Checklist for 3D Lead

Before committing from Codex IDE, ensure:
1. All `.glb` assets are compressed with Dracos (`gltf-pipeline -d` or `gltfpack -cc`).
2. Place all `.glb` files into the `public/models/` directory so Vite serves them statically with zero bundling overhead.
3. Keep mesh origin `(0, 0, 0)` centered at the mannequin's feet / pedestal.
4. Run `npm test` and `npm run build` locally to verify chunk size remains optimal.
