import { validateMeasurements } from './sizing.js';
import { validProfile } from './referenceMapping.js';

export const defaultConstruction = { family: 'agbada', length: 125, ease: 20, spread: 90, wireframe: false };
const families = { agbada: 1, kaftan: 0.45, tunic: 0.15 };

// Stable rows and columns preserve correspondence while construction dimensions change.
// This is an open garment shell, not a sewn pattern or a physical drape solver.
export function buildConstruction(measurements, settings = defaultConstruction, references = []) {
  if (Object.keys(validateMeasurements(measurements)).length) throw new Error('Valid body measurements are required.');
  const { family, length, ease, spread } = settings;
  if (!Object.hasOwn(families, family) || !Number.isFinite(length) || length < 50 || length > 150 ||
      !Number.isFinite(ease) || ease < 0 || ease > 60 || !Number.isFinite(spread) || spread < 40 || spread > 140) {
    throw new Error('Construction dimensions are outside supported ranges.');
  }
  const rows = 32, columns = 64;
  const profile = settings.referenceProfile;
  if (profile && !validProfile(profile)) throw new Error('Invalid reference mapping. Trace the reference again.');
  const positions = [], uv = [], indices = [], vertexMap = [];
  const shoulder = Number(measurements.height) * 0.82 / 100;
  const bodySections = [[0, Number(measurements.chest)], [0.18, Number(measurements.chest)], [0.32, Number(measurements.waist)], [0.45, Number(measurements.hip)]];
  let widenedSections = 0;
  for (let row = 0; row <= rows; row++) {
    const v = row / rows;
    const drop = v * length / Number(measurements.height);
    const upperIndex = bodySections.findIndex(section => section[0] >= drop);
    const lower = bodySections[Math.max(0, upperIndex - 1)], upper = bodySections[upperIndex];
    const circumference = !upper ? Number(measurements.hip) : upperIndex === 0 ? upper[1] :
      lower[1] + (upper[1] - lower[1]) * (drop - lower[0]) / (upper[0] - lower[0]);
    const bodyRadius = (circumference + ease) / (2 * Math.PI * 100);
    const shoulderBlend = Math.min(1, v / 0.13);
    const wing = families[family] * spread / 200 * Math.sin(Math.PI * Math.min(1, v / 0.9)) ** 0.45;
    const tracedRadius = profile ? profile.widths[row] * profile.aspectRatio * length / 200 : 0;
    if (profile && row >= 4 && tracedRadius < bodyRadius * 1.2) widenedSections++;
    const width = profile ? Math.max(bodyRadius * 1.2, tracedRadius) : bodyRadius * 1.2 + wing;
    const rx = 0.085 + shoulderBlend * (width - 0.085);
    const rz = 0.075 + shoulderBlend * (bodyRadius * 0.85 - 0.075);
    for (let column = 0; column <= columns; column++) {
      const u = column / columns, angle = u * Math.PI * 2;
      // Folds are explicitly illustrative; no collision or material simulation is implied.
      const fold = 0.009 * Math.sin(angle * 12) * Math.sin(Math.PI * v);
      positions.push((rx + fold) * Math.cos(angle), shoulder - v * length / 100, (rz + fold) * Math.sin(angle));
      uv.push(u, 1 - v);
      vertexMap.push({ id: vertexMap.length, row, column, region: row < 4 ? 'neck-shoulder' : row > 28 ? 'hem' : 'body' });
      if (row < rows && column < columns) {
        const a = row * (columns + 1) + column, b = a + columns + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }
  const views = ['front', 'left', 'back', 'right'];
  const available = views.filter(role => references.some(item => item.role === role && item.file.type.startsWith('image/')));
  return {
    version: 2, analysisMethod: profile ? 'user-traced-silhouette' : 'user-controlled-parametric', simulated: false, units: 'metres',
    referenceMapping: profile ? { ...profile, widenedSections, depthSource: 'estimated from body circumferences', symmetry: 'bilateral; asymmetric details omitted' } : null,
    measurementsCm: { height: Number(measurements.height), chest: Number(measurements.chest), waist: Number(measurements.waist), hip: Number(measurements.hip) },
    constructionCm: { family, length, ease, spread },
    referenceCoverage: { available, missing: views.filter(role => !available.includes(role)), totalFiles: references.length },
    vertexCount: positions.length / 3, triangleCount: indices.length / 3,
    mesh: { positions, uv, indices }, vertexMap,
    limitations: ['No automatic image segmentation or construction inference.', 'Reference widths may be widened to accommodate estimated body dimensions; depth is not recovered from photos.', 'No sewn panels, armholes, material simulation, collision validation, or fit guarantee.', 'Tripo image generation does not consume this vertex map.'],
  };
}
