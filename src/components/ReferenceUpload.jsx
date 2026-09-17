import { useEffect, useRef, useState } from 'react';
import { REFERENCE_LIMIT, VIEW_ROLES, validateReference } from '../lib/references';
export function usePhotoUrl(file) {
  const [url, setUrl] = useState('');
  useEffect(() => { if (!file) { setUrl(''); return; } const next = URL.createObjectURL(file); setUrl(next); return () => URL.revokeObjectURL(next); }, [file]);
  return url;
}
export function ReferenceCard({ item, onRemove, onRole, onFrame }) {
  const url = usePhotoUrl(item.file), video = useRef();
  const [error, setError] = useState(''), [ready, setReady] = useState(false);
  const isVideo = item.file.type.startsWith('video/');
  const capture = () => {
    const player = video.current;
    if (!player?.videoWidth || player.readyState < 2) { setError('Wait for a frame to load.'); return; }
    player.pause(); const time = player.currentTime;
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 1024 / Math.max(player.videoWidth, player.videoHeight));
    canvas.width = Math.round(player.videoWidth * scale); canvas.height = Math.round(player.videoHeight * scale);
    canvas.getContext('2d').drawImage(player, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => { if (blob) onFrame(new File([blob], `${item.file.name}-frame-${time.toFixed(1)}s.jpg`, { type: 'image/jpeg' })); }, 'image/jpeg', 0.9);
  };
  return <article className="reference-card">
    {isVideo ? <video ref={video} src={url} controls playsInline preload="metadata" onLoadedData={() => setReady(true)} onError={() => setError('This video codec is not supported. Try MP4/H.264 or WebM.')} /> : <img src={url} alt={item.file.name} />}
    <small className="reference-name">{item.file.name}</small>
    {onRole && !isVideo && <label>Generation view<select aria-label={`View for ${item.file.name}`} value={item.role} onChange={(event) => onRole(item.id, event.target.value)}>{VIEW_ROLES.map((role) => <option key={role} value={role}>{role === 'reference' ? 'Reference only' : role}</option>)}</select></label>}
    {isVideo && onFrame && <button type="button" disabled={!ready} onClick={capture}>Capture current frame</button>}
    {onRemove && <button type="button" onClick={() => onRemove(item.id)}>Remove {isVideo ? 'video' : 'image'}</button>}
    {error && <p role="alert">{error}</p>}
  </article>;
}
export default function ReferenceUpload({ items, onChange, onBusyChange }) {
  const input = useRef(), latest = useRef(items), request = useRef(0); latest.current = items;
  const [errors, setErrors] = useState([]), [busy, setBusy] = useState(false);
  useEffect(() => () => { request.current++; onBusyChange?.(false); }, [onBusyChange]);
  async function accept(files) {
    if (busy) return;
    const id = ++request.current; setErrors([]); setBusy(true); onBusyChange?.(true);
    const added = [], failures = [];
    try {
      for (const file of files) {
        if (latest.current.length + added.length >= REFERENCE_LIMIT) { failures.push(`Maximum ${REFERENCE_LIMIT} references. Remove an item before adding more.`); break; }
        const invalid = validateReference(file);
        if (invalid) { failures.push(`${file.name}: ${invalid}`); continue; }
        if (file.type.startsWith('image/')) {
          try { const bitmap = await createImageBitmap(file); const pixels = bitmap.width * bitmap.height; bitmap.close(); if (pixels > 40000000) throw new Error(); }
          catch { failures.push(`${file.name}: Image could not be decoded or is over 40 megapixels.`); continue; }
        }
        added.push({ id: crypto.randomUUID(), file, role: 'reference' });
      }
      if (request.current === id) { onChange([...latest.current, ...added]); setErrors(failures); }
    } finally { if (request.current === id) { setBusy(false); onBusyChange?.(false); } }
  }
  const remove = (id) => onChange(items.filter((item) => item.id !== id));
  const setRole = (id, role) => onChange(items.map((item) => ({ ...item, role: item.id === id ? role : role !== 'reference' && item.role === role ? 'reference' : item.role })));
  return <div>
    <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" hidden aria-label="Reference images and videos" onChange={(event) => { accept(Array.from(event.target.files)); event.target.value = ''; }} />
    <button type="button" className="upload-area reference-drop" disabled={busy} onClick={() => input.current.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); accept(Array.from(event.dataTransfer.files)); }}><span>{busy ? 'Checking references…' : 'Add images or videos'}</span><small>Choose several files or drop them here · {items.length}/{REFERENCE_LIMIT}</small></button>
    <p className="reference-help">Images up to 10 MB; videos up to 50 MB. Scrub a video and capture a frame. Assign front, left, back, and right views of the same garment. Files stay local until you explicitly generate.</p>
    <div className="reference-grid">{items.map((item) => <ReferenceCard key={item.id} item={item} onRemove={remove} onRole={setRole} onFrame={(file) => accept([file])} />)}</div>
    {errors.map((error) => <p key={error} role="alert" className="measurement-error">{error}</p>)}
  </div>;
}
