"""Bake a manually aligned rear photograph into this Meshy model's UV atlas.

This is an asset-specific texture repair, not garment reconstruction or fitting.
The source GLB and all mesh buffers remain unchanged. Run with --inspect first.
"""
import argparse
import hashlib
import io
import json
import struct
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


def read_glb(path):
    raw = Path(path).read_bytes()
    magic, version, length = struct.unpack_from('<III', raw)
    assert magic == 0x46546C67 and version == 2 and length == len(raw)
    size, kind = struct.unpack_from('<II', raw, 12)
    assert kind == 0x4E4F534A
    doc = json.loads(raw[20:20 + size])
    offset = 20 + size
    size, kind = struct.unpack_from('<II', raw, offset)
    assert kind == 0x004E4942
    return doc, raw[offset + 8:offset + 8 + size]


def accessor(doc, binary, index):
    item = doc['accessors'][index]
    view = doc['bufferViews'][item['bufferView']]
    assert 'byteStride' not in view and 'sparse' not in item
    dtype = {5126: '<f4', 5125: '<u4'}[item['componentType']]
    width = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3}[item['type']]
    return np.frombuffer(binary, dtype=dtype, count=item['count'] * width,
                         offset=view.get('byteOffset', 0) + item.get('byteOffset', 0)).reshape(-1, width)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model', required=True)
    parser.add_argument('--reference', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--inspect', action='store_true')
    args = parser.parse_args()
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    doc, binary = read_glb(args.model)
    primitive = doc['meshes'][0]['primitives'][0]
    positions = accessor(doc, binary, primitive['attributes']['POSITION'])
    uv = accessor(doc, binary, primitive['attributes']['TEXCOORD_0'])
    indices = accessor(doc, binary, primitive['indices']).reshape(-1, 3)
    image_view = doc['bufferViews'][doc['images'][0]['bufferView']]
    image_start = image_view.get('byteOffset', 0)
    texture = Image.open(io.BytesIO(binary[image_start:image_start + image_view['byteLength']])).convert('RGB')
    if args.inspect:
        # Rear view: negative Z toward the camera, negative X on screen right.
        canvas = Image.new('RGB', (1100, 1200), '#222222')
        pixels = np.asarray(texture)
        colors = pixels[np.clip((uv[:, 1] * (texture.height - 1)).astype(int), 0, texture.height - 1),
                        np.clip((uv[:, 0] * (texture.width - 1)).astype(int), 0, texture.width - 1)]
        draw = ImageDraw.Draw(canvas)
        centers = positions[indices].mean(1)
        screen = np.column_stack((550 - positions[:, 0] * 500, 580 - positions[:, 1] * 500)).astype(int)
        face_colors = colors[indices].mean(1).astype('uint8')
        for i in np.argsort(-centers[:, 2]):
            draw.polygon([tuple(p) for p in screen[indices[i]]], fill=tuple(face_colors[i]))
        for y in np.arange(-1, 1.1, .2):
            sy = int(580 - y * 500)
            draw.line((30, sy, 1070, sy), fill='#888888')
            draw.text((32, sy), f'y={y:.1f}', fill='white')
        for x in np.arange(-.8, .9, .2):
            sx = int(550 - x * 500)
            draw.line((sx, 50, sx, 1100), fill='#777777')
            draw.text((sx, 1100), f'x={x:.1f}', fill='white')
        canvas.save(output.with_suffix('.png'))
        print(json.dumps({'texture': texture.size, 'bounds': [positions.min(0).tolist(), positions.max(0).tolist()]}))
        return

    reference = np.asarray(Image.open(args.reference).convert('RGB'), dtype=np.float32)
    atlas = np.array(texture, dtype=np.float32)
    mask = np.zeros(atlas.shape[:2], dtype=np.float32)
    height, width = atlas.shape[:2]
    texels = uv * np.array([width - 1, height - 1])
    centers = positions[indices].mean(1)
    candidates = np.flatnonzero((centers[:, 2] < -.07) & (centers[:, 1] < .33)
                               & (centers[:, 0] > -.43) & (centers[:, 0] < .49))
    for triangle in candidates:
        ids = indices[triangle]
        a, b, c = texels[ids]
        low = np.maximum(np.floor(np.minimum(np.minimum(a, b), c)).astype(int), 0)
        high = np.minimum(np.ceil(np.maximum(np.maximum(a, b), c)).astype(int), [width - 1, height - 1])
        if np.any(high < low):
            continue
        xx, yy = np.meshgrid(np.arange(low[0], high[0] + 1), np.arange(low[1], high[1] + 1))
        denominator = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
        if abs(denominator) < 1e-8:
            continue
        u = ((b[1] - c[1]) * (xx - c[0]) + (c[0] - b[0]) * (yy - c[1])) / denominator
        v = ((c[1] - a[1]) * (xx - c[0]) + (a[0] - c[0]) * (yy - c[1])) / denominator
        w = 1 - u - v
        inside = (u >= -1e-5) & (v >= -1e-5) & (w >= -1e-5)
        if not inside.any():
            continue
        px, py = xx[inside], yy[inside]
        point = u[inside, None] * positions[ids[0]] + v[inside, None] * positions[ids[1]] + w[inside, None] * positions[ids[2]]
        x, y, z = point.T
        # Shoulder width tapers toward the neck. This mask deliberately excludes
        # the cap, beads, sleeve wings, front, and inner garment surfaces.
        half_width = np.interp(y, [-1, .12, .32], [.43, .41, .17])
        alpha = np.clip((half_width - np.abs(x - .03)) / .035, 0, 1)
        alpha *= np.clip((.325 - y) / .035, 0, 1) * np.clip((-z - .07) / .07, 0, 1)
        # Manually aligned landmarks: neck at y=.32, back knot near y=-.08.
        # The cropped photograph supplies visible fabric only, not a new hem.
        source_x = np.clip(450 - (x - .03) * 490, 0, reference.shape[1] - 2)
        source_y = np.clip(280 + (.32 - y) * 780, 0, reference.shape[0] - 2)
        ix, iy = source_x.astype(int), source_y.astype(int)
        fx, fy = (source_x - ix)[:, None], (source_y - iy)[:, None]
        color = ((1-fx)*(1-fy)*reference[iy, ix] + fx*(1-fy)*reference[iy, ix+1]
                 + (1-fx)*fy*reference[iy+1, ix] + fx*fy*reference[iy+1, ix+1])
        atlas[py, px] = atlas[py, px] * (1-alpha[:, None]) + color * alpha[:, None]
        mask[py, px] = np.maximum(mask[py, px], alpha)
    encoded = io.BytesIO()
    Image.fromarray(np.clip(atlas, 0, 255).astype('uint8')).save(encoded, format='PNG')
    image_bytes = encoded.getvalue()
    # The image is the final buffer view in this specific source asset. Replace
    # it without duplicating its bytes; preserve every mesh buffer byte.
    assert image_start + image_view['byteLength'] >= len(binary) - 3
    assert all(view is image_view or view.get('byteOffset', 0) + view['byteLength'] <= image_start
               for view in doc['bufferViews'])
    result_binary = binary[:image_start] + b'\0' * (-image_start % 4)
    new_offset = len(result_binary)
    result_binary += image_bytes
    image_view.update({'byteOffset': new_offset, 'byteLength': len(image_bytes)})
    doc['images'][0]['mimeType'] = 'image/png'
    doc['images'][0]['name'] = 'Rear reference correction'
    doc['buffers'][0]['byteLength'] = len(result_binary)
    doc.setdefault('asset', {}).setdefault('extras', {})['loomCorrection'] = {
        'method': 'Manual rear photograph projection baked into existing UV atlas',
        'reference': Path(args.reference).name,
        'limitations': 'Texture only. No reconstructed geometry, cloth simulation, or measurement fitting.'
    }
    result_binary += b'\0' * (-len(result_binary) % 4)
    json_bytes = json.dumps(doc, separators=(',', ':')).encode()
    json_bytes += b' ' * (-len(json_bytes) % 4)
    result = (struct.pack('<III', 0x46546C67, 2, 28 + len(json_bytes) + len(result_binary))
              + struct.pack('<II', len(json_bytes), 0x4E4F534A) + json_bytes
              + struct.pack('<II', len(result_binary), 0x004E4942) + result_binary)
    assert output.resolve() != Path(args.model).resolve(), 'Never overwrite the source model'
    output.write_bytes(result)
    check_doc, check_binary = read_glb(output)
    for key, index in primitive['attributes'].items():
        assert np.array_equal(accessor(doc, binary, index), accessor(check_doc, check_binary, index)), key
    assert np.array_equal(indices, accessor(check_doc, check_binary, primitive['indices']).reshape(-1, 3))
    changed = np.any(np.asarray(texture) != np.clip(atlas, 0, 255).astype('uint8'), axis=2)
    assert not np.any(changed & (mask == 0))
    front_uv = texels[positions[:, 2] > .1].round().astype(int)
    front_changes = int(changed[front_uv[:, 1], front_uv[:, 0]].sum())
    assert front_changes == 0, 'Rear correction touched sampled front texture'
    report = {'source_sha256': hashlib.sha256(Path(args.model).read_bytes()).hexdigest(),
              'output_sha256': hashlib.sha256(result).hexdigest(),
              'vertices': len(positions), 'triangles': len(indices), 'geometry_unchanged': True,
              'changed_texture_pixels': int(changed.sum()), 'texture_pixels': width * height,
              'texture_size': [width, height], 'output_bytes': len(result),
              'front_vertex_texture_samples': len(front_uv), 'front_samples_changed': front_changes,
              'method': 'Manual photograph projection; visual approximation only'}
    output.with_suffix('.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report))


if __name__ == '__main__':
    main()
