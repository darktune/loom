import { traceProfile } from './referenceMapping.js';
export const REFERENCE_LIMIT = 12;
export const VIEW_ROLES = ['reference', 'front', 'left', 'back', 'right'];
export function validateReference(file) {
  const image = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  const video = ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type);
  if (!image && !video) return 'Use JPEG, PNG, WebP, MP4, WebM, or MOV.';
  if (!file.size || file.size > (video ? 50 : 10) * 1024 * 1024) return `${video ? 'Videos' : 'Images'} must be non-empty and under ${video ? 50 : 10} MB.`;
  return null;
}
export async function imageDataUrl(file, outline = null) {
  const image = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1024 / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height);
    if (outline) {
      traceProfile(outline.points, image.width, image.height);
      context.beginPath();
      outline.points.forEach(([x, y], i) => { if (i === 0) context.moveTo(x * canvas.width, y * canvas.height); else context.lineTo(x * canvas.width, y * canvas.height); });
      context.closePath(); context.clip();
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.9);
  } finally { image.close(); }
}
