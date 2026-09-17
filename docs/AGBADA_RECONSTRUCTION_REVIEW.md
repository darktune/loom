# Agbada reconstruction review

Reviewed 2026-09-15 against the four supplied photographs, LOOM screenshot, Tripo share image, linked Tripo model page, and current source code. The MP4 was not decoded during this review; no claims here depend on its unseen frames.

## Root cause

LOOM's displayed object is not a reconstruction of the photographed agbada. `src/lib/construction.js` builds elliptical cross-sections from a single width profile, assumes bilateral symmetry, estimates depth from body circumferences, and adds sinusoidal ripples. It has no representation for the garment's panel assembly, sleeve openings, folded fabric, or garment-specific surface details. Stable vertex IDs establish indexing, not correct image-to-surface correspondence. Passing numeric tests did not validate visual fidelity.

The earlier emphasis on the cropped hem was misplaced. Cropping leaves the full length unknown, but the visible sleeves, neckline, embroidery, fabric differences, and folds were already sufficient to demonstrate the model's failure. Those features should have been acceptance criteria before implementing a shell.

## Reference comparison

| Feature | Photographic evidence | LOOM failure |
| --- | --- | --- |
| Silhouette | A loose outer robe with wide sleeves and hanging fabric | A smooth tapered tube with shoulder bulges |
| Openings and folds | Deep side folds and visible sleeve cavities/edges | No sleeve openings or folded surface layers |
| Neckline | Rounded embroidered neckline with a long central placket-like embroidery field | Narrow generic neck transition |
| Front | Long nested embroidery lines and repeated interlaced motifs | Uniform unadorned material |
| Back | Separate upper-back embroidered motif and different fold structure | Front-derived width profile applied around the whole shell |
| Fabric | Pink ground with a contrasting floral/paisley panel on one side | Uniform ivory; asymmetry removed |
| Display components | Glossy black mannequin, matching cap, several necklace loops | Simplified gray primitives and omitted accessories |

The photographs are one frontal view, one rear view, and two front-oblique/detail views. They must not be assigned indiscriminately to front/left/back/right slots. Views are not calibrated; camera distance and orientation differ. Embroidery is surface detail; necklaces and the cap are separate objects, not cloth panels.

## Real construction evidence

The [Metropolitan Museum's agbada record](https://www.metmuseum.org/art/collection/search/650308) identifies a loose, wide-sleeved, over-the-head robe worn over other clothing. Its recorded example is 121.9 cm high and 236.2 cm wide; these are dimensions of that museum object, not measurements to transfer to the user's garment.

The [Museum of International Folk Art record](https://collection.internationalfolkart.org/objects/81948/agbada-yoruba) describes an example with a front made from at least 14 panels, some gusseted. The [Bowers Museum record](https://collections.bowers.org/objects/146441/robe-babban-riga) describes joined cotton panels and embroidery at front and back neck areas of a related Nigerian robe. Their indexed records were accessible; direct page fetching failed. Construction varies by fabric and style, so neither is an exact cutting plan for these photographs.

The [V&A's boubou discussion](https://www.vam.ac.uk/articles/a-life-through-clothes-professor-lalage-bown-obe) describes the related rectangular-fabric approach: folding, creating a neck opening, and partially sewing sides. This is contextual evidence for cloth construction, not proof that every agbada uses one identical pattern.

The engineering consequence is to represent cloth pieces, seam relationships, openings, and drape. A plausible workflow measures the wearer and intended robe dimensions; drafts the central and sleeve/side pieces; assigns fabric direction and motif placement; defines neckline finishing and embroidery regions; joins the panels with appropriate openings; then simulates and validates the worn form. The exact seam layout, fabric properties, hidden layers, and full hem require further evidence.

## Tripo comparison and correction

The supplied [Tripo asset](https://studio.tripo3d.ai/3d-model/819d6660-98f7-4806-a526-e4a3df26956e) identifies model version `v3.1-20260211` and the prompt “pink traditional robe with headwrap and beaded necklaces.” LOOM's existing provider code already requests that version, with texture, PBR, and a 30,000-face limit. The local shell is not the output of that provider. Version equality does not establish identical Studio and API quality settings, preprocessing, or outputs.

The supplied untextured Tripo share image visibly retains large sleeve folds, neckline detail, cap, necklace loops, and front motifs. That supports a visual-fidelity comparison, not a claim of valid sewing patterns, separable cloth geometry, or measurement-accurate fit. The public page does not expose Tripo's private inference algorithm.

Correction order:

1. Stop treating the elliptical shell as a garment reconstruction; retain it only as a clearly limited experimental study.
2. Inspect/export the existing high-quality asset, where available, as a benchmark without paying for a duplicate task. Check front, rear, oblique views, openings, and whether mannequin and garment are separable.
3. Verify the documented API quality options and available API credits. Run comparable inputs only when the account can support the task. Do not silently mask out cap/necklaces when comparing against a full-dressed-mannequin result.
4. For genuinely editable fitting, implement panel/seam topology and a calibrated body/cloth solver, or integrate an established system. Do not deform an arbitrary whole-person mesh and label it physically fitted clothing.
5. Use the Studio workspace fallback only if the supported export/API paths are shown inadequate, as the user requested. No workspace generation was submitted during this review. A seamless LOOM interface can use a provider backend, but should not falsely attribute another system's generation technology or violate required attribution.

Acceptance must include side-by-side front/back/oblique visual review against all four photographs, not only topology bounds and successful compilation. A higher polygon count alone cannot recover missing garment structure.
