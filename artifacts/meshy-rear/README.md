# Meshy agbada: rear texture correction

`agbada-rear-corrected.glb` is a separate, self-contained model for local review in LOOM. The original `C:/Users/user/Downloads/model.glb` is unchanged.

The correction projects the user's rear photograph (`photo_2026-08-17_01-49-26.jpg`) onto the central rear garment panel, replacing the incorrect floral print with the photographed pink fabric and embroidered knot. The original UV layout, vertices, normals, indices, and model proportions are preserved. A lossless PNG atlas is embedded in the GLB.

This is a manually aligned visual approximation for this particular model. It is not an automatic multi-view reconstruction tool. The embroidery remains a texture; folds, seams, silhouette, and measurement fitting are not reconstructed. The photograph crops the garment hem and contains lighting and perspective distortion, which remain in the projection. Transitions at the edge of the corrected panel may remain visible.

No Meshy credits or paid services were used for this correction. The asset retains the source model's existing licensing obligations.

## Reproduce

Requires Python with NumPy and Pillow. From the LOOM directory:

```powershell
python tools/correct_agbada_back.py --model C:/Users/user/Downloads/model.glb --reference 'C:/Users/user/Documents/abrhamcollectionweb/abraham shoot/photo_2026-08-17_01-49-26.jpg' --output artifacts/meshy-rear/agbada-rear-corrected.glb
```

The script checks GLB validity, asserts identical mesh attributes and triangle indices, checks sampled front texture texels, and writes hashes and counts to `agbada-rear-corrected.json`. The alignment and panel mask are specific to this input model and photograph.

## Review in LOOM

Open **Import GLB**, choose the corrected file, and set rotation to **180°** for the back or **0°** for the front. The import lasts for the current browser session. Reloading the page requires importing again.

## Follow-up geometry and side review — 2026-09-16

The corrected GLB was loaded in LOOM and inspected at +120° and -120°. The embroidered back motif remains on the rear panel in both views. The plain and patterned sleeve surfaces remain visibly distinct. The photo projection still contains baked photographic lighting and folds, and its panel transition remains visible at oblique angles. This is suitable as a visual comparison asset, not an exact reconstruction.

`geometry-audit.json` records a read-only topology audit. At six-decimal position welding precision, all 723,326 triangles form **one connected component**. The audit found no boundary edges, non-manifold edges, or triangles collapsed by that weld. These checks do not establish absence of self-intersections or suitability for cloth simulation. The source contains one material, no skin, no animations, and no morph targets.

The garment, mannequin, cap, and necklaces are not supplied as independently selectable parts. Splitting by connected components therefore cannot produce a cloth-only mesh. Whole-model scaling would also scale accessories and the mannequin, so it must not be presented as measurement fitting.

The next fitting milestone needs a separate garment surface, valid neckline/sleeve/hem construction, a calibrated body, and fabric/seam constraints. For this asset, that means segmentation with reconstruction of hidden surfaces, or building separate sewn panels. Body measurements alone do not determine this agbada's full dimensions or material behavior. Full garment length, sleeve span/opening, desired ease, and fabric properties remain necessary inputs for a validated fit.

Reproduce the read-only audit:

```powershell
python tools/audit_glb.py artifacts/meshy-rear/agbada-rear-corrected.glb artifacts/meshy-rear/geometry-audit.json
```
