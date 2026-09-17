import { useCallback, useEffect, useRef, useState } from 'react';
import { imageDataUrl } from './references';
import { inspectGlb } from './modelAsset';
import { validateFallbackFile } from './browserFallback';
const ACTIVE = ['uploading', 'queued', 'running'];
async function api(path, options) {
  const response = await fetch(path, { ...options, signal: AbortSignal.timeout(20000) });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error || 'Generation request failed.');
    error.status = response.status;
    throw error;
  }
  return data;
}
export function useGeneration(onResult) {
  const [importing, setImporting] = useState(false), [importError, setImportError] = useState(''), [importedName, setImportedName] = useState('');
  const importedUrl = useRef(null), importSequence = useRef(0);
  useEffect(() => () => { importSequence.current++; if (importedUrl.current) URL.revokeObjectURL(importedUrl.current); }, []);
  const [config, setConfig] = useState(null), [job, setJob] = useState(null), [error, setError] = useState('');
  const [preparing, setPreparing] = useState(false), [paused, setPaused] = useState(false);
  const busy = useRef(false), snapshot = useRef(null), delivered = useRef(null), resultCallback = useRef(onResult);
  resultCallback.current = onResult;
  const importMeshy = async (file, brief) => {
    if (busy.current || ACTIVE.includes(job?.status)) return;
    const sequence = ++importSequence.current;
    setImporting(true); setImportError(''); setImportedName('');
    try {
      validateFallbackFile(file);
      inspectGlb(await file.arrayBuffer());
      if (sequence !== importSequence.current) return;
      const modelUrl = URL.createObjectURL(file), previous = importedUrl.current;
      importedUrl.current = modelUrl;
      resultCallback.current({ modelUrl, provider: 'Meshy', name: file.name, snapshot: brief, fitApplied: false, imported: true });
      setImportedName(file.name);
      if (previous) URL.revokeObjectURL(previous);
    } catch (issue) { if (sequence === importSequence.current) setImportError(issue.message); }
    finally { if (sequence === importSequence.current) setImporting(false); }
  };
  const checkConfig = useCallback(async () => {
    try { setConfig(await api('/api/generation/config')); setError(''); }
    catch { setConfig(null); setError('Generation API is offline. Start it with npm run server.'); }
  }, []);
  useEffect(() => { checkConfig(); }, [checkConfig]);
  useEffect(() => {
    try { const saved = JSON.parse(sessionStorage.getItem('loom-generation-job')); if (saved?.id) { snapshot.current = saved.snapshot; setJob({ id: saved.id, status: 'queued', progress: 0 }); } } catch { /* Storage may be unavailable. */ }
  }, []);
  useEffect(() => {
    if (!job?.id || !ACTIVE.includes(job.status) || paused) return;
    const controller = new AbortController(); let timer;
    const poll = async () => {
      try {
        const next = await api(`/api/generation/${job.id}`);
        if (controller.signal.aborted) return;
        setJob(next);
        if (next.status === 'success') {
          if (!next.modelUrl) { setError('Tripo finished without a usable GLB URL. Check the provider dashboard.'); return; }
          if (delivered.current !== next.id) { delivered.current = next.id; resultCallback.current({ modelUrl: next.modelUrl, snapshot: snapshot.current, taskId: next.taskId }); }
        } else if (!ACTIVE.includes(next.status)) setError(next.error || `Generation ${next.status}. Check Tripo before retrying.`);
        else timer = setTimeout(poll, 4000);
      } catch (issue) { if (!controller.signal.aborted) { setError(issue.message); setPaused(true); } }
    };
    timer = setTimeout(poll, 1500);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [job?.id, job?.status, paused]);
  const start = async (items, measurements, prompt, consent, outline = null) => {
    if (busy.current || importing || ACTIVE.includes(job?.status)) return;
    busy.current = true; setPreparing(true); setError(''); setPaused(false);
    try {
      const selected = items.filter((item) => item.role !== 'reference' && item.file.type.startsWith('image/'));
      if (!selected.some((item) => item.role === 'front')) throw new Error('Assign a front view to an image or captured frame.');
      if (!consent) throw new Error('Confirm sending the selected views to Tripo.');
      const images = await Promise.all(selected.map(async (item) => ({ role: item.role, dataUrl: await imageDataUrl(item.file, item.id === outline?.sourceId ? outline : null) })));
      const id = crypto.randomUUID();
      snapshot.current = { measurements: { ...measurements }, prompt, preprocessing: outline ? { method: 'reviewed-outline-mask', sourceId: outline.sourceId, filename: outline.filename, points: outline.points } : null, references: selected.map((item) => ({ name: item.file.name, role: item.role })) };
      try { sessionStorage.setItem('loom-generation-job', JSON.stringify({ id, snapshot: snapshot.current })); } catch { /* Optional recovery. */ }
      setJob({ id, status: 'submitting', progress: 0 });
      try { setJob(await api('/api/generation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId: id, images, consent }) })); }
      catch (issue) {
        const rejected = [400, 403, 409, 413, 415, 503].includes(issue.status);
        setJob({ id, status: rejected ? 'failed' : 'uploading', progress: 0 });
        setPaused(!rejected);
        setError(`${issue.message}${rejected ? '' : ' Check status before submitting another job.'}`);
      }
    } catch (issue) { setError(issue.message); }
    finally { busy.current = false; setPreparing(false); }
  };
  const refresh = async () => {
    if (!job?.id) return;
    try {
      const next = await api(`/api/generation/${job.id}`); setJob(next); setPaused(false); setError('');
      if (next.status === 'success' && next.modelUrl) resultCallback.current({ modelUrl: next.modelUrl, snapshot: snapshot.current, taskId: next.taskId });
    } catch (issue) { setError(issue.message); }
  };
  const clearRecovery = () => {
    setJob(null); setPaused(false); setError(''); snapshot.current = null;
    try { sessionStorage.removeItem('loom-generation-job'); } catch { /* Optional recovery. */ }
  };
  return { config, checkConfig, job, error, start, refresh, clearRecovery, preparing, active: preparing || ACTIVE.includes(job?.status), paused, importMeshy, importing, importError, importedName };
}
