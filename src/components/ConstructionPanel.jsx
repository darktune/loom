import { useMemo } from 'react';
import { buildConstruction } from '../lib/construction';
import ReferenceMapping from './ReferenceMapping';

export default function ConstructionPanel({ measurements, settings, onChange, references }) {
  const blueprint = useMemo(() => {
    try { return buildConstruction(measurements, settings, references); } catch { return null; }
  }, [measurements, settings, references]);
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(blueprint)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'loom-construction-blueprint.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <section className="generation-panel" aria-label="Garment construction">
    <h3>Shape your garment</h3>
    <p>Choose a silhouette, or trace a reference below to shape the garment. Measurements control its proportions.</p>
    <label>Silhouette <select disabled={!!settings.referenceProfile} value={settings.family} onChange={e => onChange({ ...settings, family: e.target.value })}><option value="agbada">Agbada study</option><option value="kaftan">Kaftan study</option><option value="tunic">Tunic study</option></select></label>
    {settings.referenceProfile && <p>The traced outline controls width. Remove the mapping to use silhouette presets and wing spread again.</p>}
    {[['length', 'Shoulder-to-hem length', 50, 150], ['ease', 'Body ease', 0, 60], ['spread', 'Wing spread control', 40, 140]].map(([key, label, min, max]) => <label className="construction-field" key={key}>{label}: {settings[key]} cm<input type="range" min={min} max={max} disabled={key === 'spread' && !!settings.referenceProfile} value={settings[key]} onChange={e => onChange({ ...settings, [key]: Number(e.target.value) })} /></label>)}
    <ReferenceMapping references={references} settings={settings} onChange={onChange} />
    <label><input type="checkbox" checked={settings.wireframe} onChange={e => onChange({ ...settings, wireframe: e.target.checked })} /> Inspect mesh edges in preview</label>
    {blueprint && <><p role="status">{blueprint.vertexCount.toLocaleString()} vertices · {blueprint.triangleCount.toLocaleString()} triangles · stable vertex IDs</p>{blueprint.referenceMapping && <p>{blueprint.referenceMapping.widenedSections} sections widened beyond the outline to accommodate body proportions. Review the result before using it.</p>}<p>Image views: {blueprint.referenceCoverage.available.join(', ') || 'none assigned'}. Missing: {blueprint.referenceCoverage.missing.join(', ') || 'none'}.</p><button type="button" onClick={download}>Download geometry blueprint</button></>}
    <p className="reference-help">Preview on the next step. This open shell studies proportions and silhouette. Sewn panels, arm openings, physical drape, and validated fit are not included. The blueprint stays local and is not sent as constraints to Tripo.</p>
  </section>;
}
