"""Inspect geometry readiness without modifying the supplied GLB."""
import argparse
import json
from pathlib import Path
import numpy as np
from correct_agbada_back import accessor, read_glb


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('model')
parser.add_argument('output')
args = parser.parse_args()
doc, binary = read_glb(args.model)
primitive = doc['meshes'][0]['primitives'][0]
positions = accessor(doc, binary, primitive['attributes']['POSITION'])
triangles = accessor(doc, binary, primitive['indices']).reshape(-1, 3)
assert len(doc['meshes']) == 1 and len(doc['meshes'][0]['primitives']) == 1
assert primitive.get('mode', 4) == 4
assert np.isfinite(positions).all() and triangles.max() < len(positions)
# UV seams duplicate positions. Weld for analysis only, with an explicitly
# stated tolerance; never change the source mesh.
points, inverse = np.unique(np.round(positions, 6), axis=0, return_inverse=True)
faces = inverse[triangles]
parent = np.arange(len(points))


def root(vertex):
    while parent[vertex] != vertex:
        parent[vertex] = parent[parent[vertex]]
        vertex = parent[vertex]
    return vertex


edges = np.concatenate([faces[:, [0, 1]], faces[:, [1, 2]], faces[:, [2, 0]]])
edges.sort(axis=1)
edges, incidences = np.unique(edges, axis=0, return_counts=True)
for a, b in edges:
    ra, rb = root(a), root(b)
    if ra != rb:
        parent[rb] = ra
labels = np.array([root(i) for i in range(len(points))])
face_labels = labels[faces[:, 0]]
ids, counts = np.unique(face_labels, return_counts=True)
components = []
for idx in np.argsort(-counts)[:12]:
    selected = points[labels == ids[idx]]
    components.append({'triangles': int(counts[idx]), 'vertices_after_weld': len(selected),
                       'bounds_min': selected.min(0).tolist(), 'bounds_max': selected.max(0).tolist()})
report = {'model': Path(args.model).name, 'vertices': len(positions), 'triangles': len(triangles),
          'meshes': len(doc['meshes']), 'materials': len(doc.get('materials', [])),
          'skins': len(doc.get('skins', [])), 'animations': len(doc.get('animations', [])),
          'morph_targets': len(primitive.get('targets', [])),
          'weld_decimal_places': 6, 'vertices_after_weld': len(points),
          'connected_components_after_weld': len(ids), 'largest_components': components,
          'boundary_edges_after_weld': int((incidences == 1).sum()),
          'nonmanifold_edges_after_weld': int((incidences > 2).sum()),
          'degenerate_triangles_after_weld': int(((faces[:, 0] == faces[:, 1]) | (faces[:, 1] == faces[:, 2]) | (faces[:, 0] == faces[:, 2])).sum()),
          'limitations': 'Connectivity is geometric, not semantic segmentation. Counts depend on weld tolerance. No physical unit calibration or sewing pattern validation is inferred.'}
Path(args.output).write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report))
