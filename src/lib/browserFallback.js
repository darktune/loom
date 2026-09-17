export const MESHY_WORKSPACE = 'https://www.meshy.ai/workspace?page=landing#genMode-img3d';

export function validateFallbackFile(file) {
  if (!file || !file.name.toLowerCase().endsWith('.glb')) throw new Error('Export a GLB with embedded textures from Meshy.');
  if (!file.size) throw new Error('The model file is empty.');
  if (file.size > 200 * 1024 * 1024) throw new Error('Choose a GLB under 200 MB.');
}

export function fallbackBrief(items, measurements, prompt) {
  return {
    provider: 'Meshy', mode: 'supervised-browser', fitApplied: false,
    measurements: { ...measurements }, units: 'cm', prompt,
    references: items.filter(item => item.role !== 'reference' && item.file.type.startsWith('image/'))
      .map(item => ({ name: item.file.name, role: item.role })),
    note: 'Measurements are design context only. Browser generation and export happen in Meshy; import the downloaded GLB into LOOM. No generation is implied by this brief.',
  };
}
