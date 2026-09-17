// Normalized image coordinates keep a reviewed trace independent of preview resolution.
export function traceProfile(points, imageWidth, imageHeight) {
  if (!Number.isFinite(imageWidth) || !Number.isFinite(imageHeight) || imageWidth <= 0 || imageHeight <= 0 ||
      !Array.isArray(points) || points.length < 4 || points.length > 100 ||
      points.some(p => !Array.isArray(p) || p.length !== 2 || p.some(n => !Number.isFinite(n) || n < 0 || n > 1))) {
    throw new Error('Mark 4–100 points around the garment boundary.');
  }
  const cross = (a, b, c) => (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i+1)%points.length];
    if (Math.hypot(a[0]-b[0],a[1]-b[1]) < 0.0001) throw new Error('Remove duplicate boundary points.');
    for (let j = i+2; j < points.length; j++) {
      if (i === 0 && j === points.length-1) continue;
      const c = points[j], d = points[(j+1)%points.length];
      if (cross(a,b,c)*cross(a,b,d) <= 0 && cross(c,d,a)*cross(c,d,b) <= 0 &&
          Math.max(Math.min(a[0],b[0]),Math.min(c[0],d[0])) <= Math.min(Math.max(a[0],b[0]),Math.max(c[0],d[0])) &&
          Math.max(Math.min(a[1],b[1]),Math.min(c[1],d[1])) <= Math.min(Math.max(a[1],b[1]),Math.max(c[1],d[1]))) {
        throw new Error('Boundary lines cross. Undo points and trace in one direction.');
      }
    }
  }
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const left = Math.min(...xs), right = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys);
  if (right-left < 0.03 || bottom-top < 0.03) throw new Error('The garment boundary is too small.');
  const widths = Array.from({ length: 33 }, (_, row) => {
    const y = top + (bottom-top) * Math.max(0.00001, Math.min(0.99999, row/32));
    const hits = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i], b = points[(i+1)%points.length];
      if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) hits.push(a[0] + (y-a[1])*(b[0]-a[0])/(b[1]-a[1]));
    }
    if (hits.length < 2) throw new Error('Boundary cannot be sampled. Trace the entire garment.');
    return (Math.max(...hits)-Math.min(...hits))/(right-left);
  });
  const aspectRatio = (right-left)*imageWidth/((bottom-top)*imageHeight);
  if (aspectRatio < 0.1 || aspectRatio > 3) throw new Error('Use a straight front or back garment view without extreme perspective.');
  return { method: 'manual-outline', widths, aspectRatio, points, bounds: { left, right, top, bottom }, touchesImageEdge: left < 0.02 || right > 0.98 || top < 0.02 || bottom > 0.98 };
}

export function validProfile(profile) {
  return profile?.method === 'manual-outline' && Array.isArray(profile.widths) && profile.widths.length === 33 &&
    profile.widths.every(n => Number.isFinite(n) && n >= 0 && n <= 1.00001) &&
    Number.isFinite(profile.aspectRatio) && profile.aspectRatio >= 0.1 && profile.aspectRatio <= 3;
}
