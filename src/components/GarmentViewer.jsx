import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, Clone, Environment, Lightformer, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { SRGBColorSpace, TextureLoader } from 'three';
import ConstructionGarment from './ConstructionGarment';
import { buildConstruction, defaultConstruction } from '../lib/construction';
import StudioMannequin from './StudioMannequin';
import GeneratedGarment from './GeneratedGarment';
import { getProportions } from '../lib/sizing';
import './GarmentViewer.css';
import { inspectGlb } from '../lib/modelAsset';

class ViewerBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p role="status" className="viewer-fallback">3D preview unavailable. Please reload or try a WebGL-enabled browser. Your garment selection is still available.</p> : this.props.children;
  }
}

// Authored assets should be centered, in metres, and include their textures.
function GarmentAsset({ url }) {
  const { scene } = useGLTF(url, true);
  return <Center><Clone object={scene} /></Center>;
}

function BodyPart({ position, scale, color, rotation = [0, 0, 0] }) {
  return <mesh position={position} scale={scale} rotation={rotation} castShadow>
    <sphereGeometry args={[1, 32, 24]} />
    <meshStandardMaterial color={color} roughness={0.85} />
  </mesh>;
}

function ProceduralGarment({ garment, proportions, onDetail }) {
  const p = proportions;
  const wide = garment.color === 'Ash';
  const color = { Ivory: '#e8dfca', Ash: '#a6a39c', Cinder: '#373139' }[garment.color];
  return <group scale={[1, p.height, 1]} position={[0, -0.85 * p.height, 0]}>
    <BodyPart position={[0, 1.65, 0]} scale={[0.115, 0.15, 0.115]} color="#b78e75" />
    <BodyPart position={[0, 1.47, 0]} scale={[0.065, 0.1, 0.065]} color="#b78e75" />
    <BodyPart position={[0, 1.17, 0]} scale={[0.24 * p.chest, 0.31, 0.14 * p.chest]} color={color} />
    <BodyPart position={[0, 0.92, 0]} scale={[0.21 * p.waist, 0.2, 0.135 * p.waist]} color={color} />
    <mesh position={[0, 0.57, 0]} scale={[p.hip, 1, p.hip]} castShadow>
      <cylinderGeometry args={[0.22, wide ? 0.43 : 0.29, 0.75, 48]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
    {[-1, 1].map((side) => <group key={side}>
      <BodyPart position={[side * (wide ? 0.32 : 0.28) * p.chest, 1.13, 0]} scale={[wide ? 0.19 : 0.09, 0.31, 0.12]} rotation={[0, 0, side * 0.2]} color={color} />
      <BodyPart position={[side * 0.12, 0.16, 0]} scale={[0.075, 0.2, 0.075]} color={color} />
    </group>)}
    <mesh position={[0, 1.18, 0.145 * p.chest]}>
      <boxGeometry args={[0.018, 0.33, 0.012]} /><meshStandardMaterial color="#C9A96E" metalness={0.4} roughness={0.5} />
    </mesh>
    {[
      ['Chest', [0.12 * p.chest, 1.27, 0.15 * p.chest]],
      ['Sleeve', [0.32 * p.chest, 1.1, 0.14]],
      ['Drape', [0.12 * p.hip, 0.57, 0.3 * p.hip]],
    ].map(([name, position]) => <Html key={name} position={position} center zIndexRange={[2, 0]}>
      <button className="garment-hotspot" aria-label={`Inspect ${name.toLowerCase()}`} onClick={() => onDetail(name)}>+</button>
    </Html>)}
  </group>;
}

export default function GarmentViewer({ garment, measurements, compact = false, fabricUrl = '', generated = null, construction = defaultConstruction }) {
  const blueprint = useMemo(() => { try { return buildConstruction(measurements, construction); } catch { return null; } }, [measurements, construction]);
  const controls = useRef();
  const [localModel, setLocalModel] = useState(null);
  const [importError, setImportError] = useState('');
  const [importing, setImporting] = useState(false);
  const importSequence = useRef(0);
  const activeModel = localModel || generated;
  useEffect(() => () => { importSequence.current++; }, []);
  useEffect(() => () => { if (localModel) URL.revokeObjectURL(localModel.modelUrl); }, [localModel]);
  async function importModel(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const sequence = ++importSequence.current;
    setImportError(''); setImporting(true);
    try {
      if (!file.name.toLowerCase().endsWith('.glb') || file.size > 200 * 1024 * 1024) throw new Error('Choose a GLB file under 200 MB.');
      inspectGlb(await file.arrayBuffer());
      if (sequence !== importSequence.current) return;
      setLocalModel({ modelUrl: URL.createObjectURL(file), name: file.name });
      setView('generated');
    } catch (error) { if (sequence === importSequence.current) setImportError(error.message); }
    finally { if (sequence === importSequence.current) setImporting(false); }
  }
  const [view, setView] = useState('construction');
  const [fit, setFit] = useState({ rotation: 0 });
  useEffect(() => { if (generated?.modelUrl) { setLocalModel(null); setView('generated'); setFit({ rotation: 0 }); } }, [generated?.modelUrl]);
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    let cancelled = false;
    let loaded;
    setTexture(null);
    if (fabricUrl) loaded = new TextureLoader().load(fabricUrl, (result) => {
      if (cancelled) return;
      result.colorSpace = SRGBColorSpace; result.flipY = false;
      setTexture(result);
    });
    return () => { cancelled = true; loaded?.dispose(); };
  }, [fabricUrl]);
  const [detail, setDetail] = useState(null);
  const proportions = getProportions(measurements);
  if (!proportions) return <p role="status">Enter valid measurements to preview proportions.</p>;
  return <div className={`garment-viewer ${compact ? 'compact' : ''}`}>
    <ViewerBoundary key={`${view}-${activeModel?.modelUrl || garment.modelUrl || garment.title}`}>
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0.2, 3.6], fov: 42 }} fallback={<p>3D needs a WebGL-enabled browser.</p>}>
        <ambientLight intensity={0.8} />
        <spotLight position={[3, 5, 4]} angle={0.45} penumbra={0.8} intensity={65} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={2} color="#C9A96E" />
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={3} position={[-3, 2, 2]} rotation={[0, Math.PI / 4, 0]} scale={[2, 4, 1]} />
          <Lightformer intensity={2} position={[3, 1, 1]} rotation={[0, -Math.PI / 4, 0]} scale={[2, 4, 1]} />
          <Lightformer intensity={1} position={[0, 3, -3]} scale={[3, 2, 1]} />
        </Environment>
        <Suspense fallback={<Html center><span className="model-loading" role="status"><span className="loom-spinner" aria-hidden="true" />Loading model…</span></Html>}>
          {view === 'construction' && blueprint ? <ConstructionGarment blueprint={blueprint} wireframe={construction.wireframe} /> : view === 'generated' && activeModel ? <GeneratedGarment url={activeModel.modelUrl} fit={fit} /> : view === 'studio' ? <StudioMannequin proportions={proportions} texture={texture} /> : garment.modelUrl ? <GarmentAsset url={garment.modelUrl} /> : <ProceduralGarment garment={garment} proportions={proportions} onDetail={setDetail} />}
        </Suspense>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.12, 0]} receiveShadow>
          <circleGeometry args={[2.5, 64]} /><meshStandardMaterial color="#211b1d" roughness={1} />
        </mesh>
        <OrbitControls ref={controls} makeDefault enablePan={false} minDistance={2.6} maxDistance={5} minPolarAngle={0.5} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </ViewerBoundary>
    <div className="viewer-tools">
      <span>{view === 'construction' ? 'Construction study' : view === 'generated' ? `${activeModel?.provider || (activeModel?.imported || localModel ? 'Imported' : 'Tripo')} model` : view === 'studio' ? 'Studio dress form' : 'Garment sketch'}</span>
      <button type="button" onClick={() => controls.current?.reset()}>Reset view</button>
    </div>
    <div className="viewer-modes">
      <button aria-pressed={view === 'construction'} onClick={() => { setView('construction'); setDetail(null); }}>Construction</button>
      <button aria-pressed={view === 'studio'} onClick={() => { setView('studio'); setDetail(null); }}>Studio mannequin</button>
      <button aria-pressed={view === 'sketch'} onClick={() => { setView('sketch'); setDetail(null); }}>Garment sketch</button>
      {activeModel && <button aria-pressed={view === 'generated'} onClick={() => { setView('generated'); setDetail(null); }}>Generated garment</button>}
      <details className="model-import">
        <summary>Import GLB</summary>
        <div className="import-popover">
          <label>Import exported GLB<input type="file" accept=".glb" onChange={importModel} disabled={importing} /></label>
          <small>Local preview only. File stays in this session.</small>
          {importing && <span role="status">Reading model…</span>}
          {importError && <p role="alert">{importError}</p>}
          {localModel && <span>{localModel.name} <button type="button" onClick={() => { setLocalModel(null); setView(generated ? 'generated' : 'construction'); }}>Remove import</button></span>}
        </div>
      </details>
    </div>

    {view === 'generated' && <div className="fit-controls"><label>Rotation: {fit.rotation}°<input type="range" min="-180" max="180" value={fit.rotation} onChange={(event) => setFit({ rotation: Number(event.target.value) })} /></label>{activeModel?.modelUrl?.startsWith('blob:') && <a href={activeModel.modelUrl} download={activeModel.name || 'loom-model.glb'}>Download GLB</a>}<small>Original model proportions preserved. Measurements are not applied to this preview.</small></div>}
    
    <div className="viewer-bottom-bar">
      {!compact && <span className="hint-text">Drag to rotate · Scroll or pinch to zoom</span>}
      {view === 'construction' && <span className="caption-text">Measurement-driven shell · no cloth simulation</span>}
      {view === 'studio' && <span className="caption-text">{fabricUrl ? 'Your image as fabric · not outfit reconstruction' : 'Sample dress form · not the selected garment'}</span>}
    </div>
    {detail && <div className="garment-detail" role="status">
      <button type="button" onClick={() => setDetail(null)} aria-label="Close garment detail">×</button>
      <strong>{detail}</strong>
      <p>{detail === 'Chest' ? `Chest reference: ${measurements.chest} cm.` : detail === 'Sleeve' ? 'Illustrative sleeve shape. Tailor measurements are needed for sleeve length.' : `Hip reference: ${measurements.hip} cm. Fabric drape is illustrative.`}</p>
    </div>}
  </div>;
}
