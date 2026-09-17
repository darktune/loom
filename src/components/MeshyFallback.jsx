import { useEffect, useRef, useState } from 'react';
import { fallbackBrief, MESHY_WORKSPACE } from '../lib/browserFallback';
import { imageDataUrl } from '../lib/references';

export default function MeshyFallback({ items, measurements, prompt, generation, disabled }) {
  const [prepared, setPrepared] = useState([]), [preparing, setPreparing] = useState(false), [error, setError] = useState('');
  const sequence = useRef(0);
  useEffect(() => { sequence.current++; setPrepared([]); setPreparing(false); setError(''); }, [items]);
  useEffect(() => () => { sequence.current++; }, []);
  async function prepare() {
    const id = ++sequence.current;
    setPreparing(true); setError('');
    try {
      const selected = items.filter(item => item.role !== 'reference' && item.file.type.startsWith('image/'));
      if (!selected.some(item => item.role === 'front')) throw new Error('Assign a front view first. Capture a frame if your reference is a video.');
      const files = await Promise.all(selected.map(async item => ({ role: item.role, name: item.file.name, url: await imageDataUrl(item.file) })));
      if (id === sequence.current) setPrepared(files);
    } catch (issue) { if (id === sequence.current) setError(issue.message); }
    finally { if (id === sequence.current) setPreparing(false); }
  }
  return <details className="meshy-fallback">
    <summary>Meshy browser fallback</summary>
    <p>Use when Tripo is unavailable or its result is unsuitable. Prepare views here, generate in Meshy, then import its export.</p>
    <p className="reference-help">Browser handoff: LOOM cannot monitor Meshy progress or download from your account automatically. Multi-view and exports depend on your Meshy plan.</p>
    <button type="button" onClick={prepare} disabled={disabled || preparing || generation.active}>Prepare reference images</button>
    {preparing && <p role="status"><span className="loom-spinner" aria-hidden="true" />Preparing images…</p>}
    {prepared.length > 0 && <div className="fallback-references">
      <p>Download the views you will upload. Use front only if multi-view is unavailable; the unseen back may be inaccurate.</p>
      {prepared.map(file => <a key={file.role} href={file.url} download={`loom-${file.role}.jpg`}>Download {file.role} view</a>)}
      <a href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(fallbackBrief(items, measurements, prompt), null, 2))}`} download="loom-meshy-brief.json">Download design brief</a>
    </div>}
    <p><a href={MESHY_WORKSPACE} target="_blank" rel="noreferrer">Open Meshy workspace</a></p>
    <label>Import Meshy result (GLB with textures)<input type="file" accept=".glb" disabled={generation.active || generation.importing} onChange={event => {
      const file = event.target.files?.[0]; event.target.value = '';
      if (file) generation.importMeshy(file, fallbackBrief(items, measurements, prompt));
    }} /></label>
    {generation.importing && <p role="status"><span className="loom-spinner" aria-hidden="true" />Reading Meshy export…</p>}
    {generation.importError && <p role="alert">{generation.importError}</p>}
    {generation.importedName && <p role="status">Imported {generation.importedName}. Continue to Preview to inspect the model.</p>}
    {error && <p role="alert">{error}</p>}
    <p className="reference-help">The complete model is displayed with its original proportions. Wrapping it onto another mannequin requires a separate cloth mesh and fitting.</p>
  </details>;
}
