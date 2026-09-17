import { useMemo, useState } from 'react';
import { usePhotoUrl } from './ReferenceUpload';
import { traceProfile } from '../lib/referenceMapping';

function TraceEditor({ item, onApply }) {
  const url = usePhotoUrl(item.file);
  const [size, setSize] = useState(null), [points, setPoints] = useState([]);
  const [cursor, setCursor] = useState([0.5, 0.5]), [message, setMessage] = useState('');
  const result = useMemo(() => {
    if (!size || points.length < 4) return null;
    try { return { profile: traceProfile(points, size[0], size[1]) }; }
    catch (error) { return { error: error.message }; }
  }, [points, size]);
  const add = point => { if (points.length < 100) { setPoints(current => [...current, point]); setMessage(''); } };
  const keyboard = event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); add(cursor); return; }
    const shifts = { ArrowLeft: [-0.01, 0], ArrowRight: [0.01, 0], ArrowUp: [0, -0.01], ArrowDown: [0, 0.01] };
    if (shifts[event.key]) { event.preventDefault(); setCursor(cursor.map((n, i) => Math.max(0, Math.min(1, n + shifts[event.key][i])))); }
  };
  return <div>
    <p>Mark the garment’s outer edge in order, excluding the head and background. Use a straight front or back view. The last point connects to the first.</p>
    <div className="trace-image" style={size ? { aspectRatio: `${size[0]} / ${size[1]}`, maxWidth: `min(450px, ${65 * size[0] / size[1]}dvh)` } : undefined}>
      <img src={url} alt={`Trace garment boundary on ${item.file.name}`} onLoad={event => setSize([event.currentTarget.naturalWidth, event.currentTarget.naturalHeight])} onError={() => setMessage('This reference could not be loaded.')} />
      {size && <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" role="application" aria-label="Garment outline editor. Click boundary points, or use arrow keys to move the cursor and Enter to add a point." tabIndex={0} onKeyDown={keyboard} onClick={event => {
        const rect = event.currentTarget.getBoundingClientRect();
        add([Math.max(0, Math.min(1, (event.clientX-rect.left)/rect.width)), Math.max(0, Math.min(1, (event.clientY-rect.top)/rect.height))]);
      }}>
        <polygon points={points.map(p => p.map(n => n*1000).join(',')).join(' ')} fill="#c9a96e33" stroke="#f5d69b" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        {points.map((point, i) => <circle key={i} cx={point[0]*1000} cy={point[1]*1000} r="6" fill="#fff" />)}
        <path className="trace-cursor" d={`M${cursor[0]*1000-12},${cursor[1]*1000}h24 M${cursor[0]*1000},${cursor[1]*1000-12}v24`} stroke="#ffdf77" strokeWidth="2" />
      </svg>}
    </div>
    <div className="trace-actions"><button type="button" disabled={!points.length} onClick={() => { setPoints(points.slice(0,-1)); setMessage(''); }}>Undo point</button><button type="button" disabled={!points.length} onClick={() => { setPoints([]); setMessage(''); }}>Clear outline</button><button type="button" disabled={!result?.profile} onClick={() => {
      onApply({ ...result.profile, sourceId: item.id, filename: item.file.name, role: item.role });
      setMessage('Outline applied. Continue to Preview to inspect the geometry.');
    }}>Apply reviewed outline</button></div>
    <p role="status">{message || result?.error || `${points.length}/100 points · ${result?.profile ? '33 width sections ready to map' : 'Add at least four points'}`}</p>
    {result?.profile?.touchesImageEdge && <p className="measurement-error">The outline reaches an image edge. The garment may be cropped: this maps only the visible portion, not its complete length. Prefer a photo showing the full garment.</p>}
  </div>;
}

export default function ReferenceMapping({ references, settings, onChange }) {
  const candidates = references.filter(item => item.file.type.startsWith('image/') && ['front','back','reference'].includes(item.role));
  const [selectedId, setSelectedId] = useState('');
  const selected = candidates.find(item => item.id === selectedId) || candidates[0];
  return <details className="reference-mapping"><summary>Map a reference outline to the garment</summary>
    <p>This local tool measures a boundary you review. It does not automatically identify clothing, recover hidden surfaces, or simulate fabric.</p>
    {selected ? <><label>Reference to trace<select value={selected.id} onChange={event => setSelectedId(event.target.value)}>{candidates.map(item => <option value={item.id} key={item.id}>{item.file.name} ({item.role})</option>)}</select></label><TraceEditor key={selected.id} item={selected} onApply={referenceProfile => onChange({ ...settings, referenceProfile })} /></> : <p>Add a front or back image, or capture a frame from a video, to start mapping.</p>}
    {settings.referenceProfile && <p>Active outline: {settings.referenceProfile.filename}. <button type="button" onClick={() => onChange({ ...settings, referenceProfile: null })}>Remove mapping</button></p>}
    <p className="reference-help">Width follows the reviewed outline, scaled using your shoulder-to-hem length. Depth is estimated from body measurements. Narrow regions may be widened. Asymmetry, separate sleeves, holes, and folds require a later construction stage.</p>
  </details>;
}
