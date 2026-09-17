import { useEffect, useState } from 'react';
import { imageDataUrl } from '../lib/references';
export default function GenerationPanel({ generation, items, measurements, prompt, disabled, construction }) {
  const [consent, setConsent] = useState(false);
  const [useMask, setUseMask] = useState(false), [prepared, setPrepared] = useState(''), [prepareError, setPrepareError] = useState('');
  const selected = items.filter((item) => item.role !== 'reference' && item.file.type.startsWith('image/'));
  const outline = construction?.referenceProfile;
  const mappedImage = selected.find(item => item.id === outline?.sourceId);
  useEffect(() => {
    let cancelled = false;
    setPrepared(''); setPrepareError('');
    if (useMask && mappedImage && outline) imageDataUrl(mappedImage.file, outline).then(url => { if (!cancelled) setPrepared(url); }).catch(() => { if (!cancelled) setPrepareError('Could not prepare the mask. Review the outline or turn masking off.'); });
    return () => { cancelled = true; };
  }, [useMask, mappedImage?.file, outline]);
  const { config, job, error } = generation;
  const ready = config?.configured && config?.connected && config.availableCredits > 0;
  return <section className="generation-panel" aria-label="Garment generation">
    <h3>Generate a 3D garment</h3>
    <p>Choose views of the garment alone, without a person or background clutter. Tripo creates geometry from the selected images. Design notes stay in your brief.</p>
    <p>{selected.length ? selected.map((item) => `${item.role}: ${item.file.name}`).join(' · ') : 'Assign at least a front view above.'}</p>
    <p className="reference-help">Videos and reference-only files are not sent. Select captured video frames as generation views. Measurements are applied locally afterward as an approximate fit.</p>
    {mappedImage && <div><label><input type="checkbox" checked={useMask} onChange={event => setUseMask(event.target.checked)} /> Mask the background of {mappedImage.file.name} using my reviewed outline</label>{useMask && <p>Only the traced image is masked; other selected views remain unchanged. Check that the full garment is inside the outline.</p>}{prepared && <img className="reference-image" src={prepared} alt="Prepared garment image that will be sent to Tripo" />}{prepareError && <p role="alert">{prepareError}</p>}</div>}
    {!config?.configured && <div role="status"><p>{config ? 'Tripo is not configured yet. Add your API key to the local .env file and restart the API server.' : 'Checking the local generation API…'}</p><button type="button" onClick={generation.checkConfig}>Check connection</button></div>}
    {config?.configured && <div role="status"><p>{config.connected ? `Tripo connected · ${config.availableCredits} API credits available` : config.error || 'Could not verify Tripo access.'}</p>{config.connected && config.availableCredits <= 0 && <p>No API credits are available. Check trial credits in your <a href="https://platform.tripo3d.ai/" target="_blank" rel="noreferrer">Tripo API dashboard</a>.</p>}<button type="button" onClick={generation.checkConfig}>Refresh connection and credits</button></div>}
    <label className="fabric-option"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />Send these selected views to Tripo and use my account credits.</label>
    <button type="button" className="primary-button" disabled={disabled || !ready || !consent || !selected.some((item) => item.role === 'front') || generation.active || (useMask && mappedImage && !prepared)} onClick={() => generation.start(items, measurements, prompt, consent, useMask && mappedImage ? outline : null)}>{generation.active ? 'Generation in progress…' : 'Generate from selected views'}</button>
    {job && <div role="status"><p>{job.status} · {Math.round(job.progress || 0)}%</p><progress max="100" value={job.progress || 0} />{job.taskId && <p className="reference-help">Tripo task: {job.taskId}</p>}<button type="button" onClick={generation.refresh}>Refresh task status / model link</button></div>}
    {error && <p role="alert" className="measurement-error">{error}</p>}
    {generation.paused && <div><p className="reference-help">If the local server lost this task, check your Tripo dashboard first. Clearing local recovery does not cancel a provider task; submitting again may use more credits.</p><button type="button" onClick={() => { if (window.confirm('Have you checked the Tripo dashboard? Clear local recovery without cancelling the provider task?')) generation.clearRecovery(); }}>Clear local task recovery</button></div>}
    <p className="reference-help">A generation can take several minutes. Keep the local API running. Generated shape and fit require review; this is not sewing-pattern generation or cloth simulation.</p>
  </section>;
}
