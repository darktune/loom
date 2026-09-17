# Reference-driven construction: current delivery

## Implemented

LOOM accepts multiple images and videos. Users can capture a video frame, assign generation views, and trace a front or back garment boundary in the Reference step. A reviewed polygon becomes 33 normalized width sections. These drive a 2,145-vertex, 4,096-triangle shell while preserving topology and vertex correspondence. The blueprint contains the source filename, points, section widths, units, body measurements, and mapping assumptions.

Chest, waist, and hip now influence separate body sections. Previously the construction shell used only the largest circumference, so smaller changes could have no effect. This regression is covered by a test.

The generation panel can mask the traced image with a white background and show the prepared image before submission. Only the matching source image is masked; other views stay unchanged. Sending still requires the existing explicit consent and available provider credits. The vertex map is not sent as unsupported constraints to Tripo.

## Use

1. Enter body measurements and add images or videos.
2. Assign a front image. For video, capture and assign a still frame.
3. Open **Map a reference outline to the garment**. Mark at least four boundary points in order. Exclude the head and background. Undo or clear incorrect points.
4. Select **Apply reviewed outline**, then inspect Preview. The outline controls width; preset and wing controls are disabled until the mapping is removed. Depth remains an estimate from body measurements.
5. Optionally enable the background mask and inspect the exact prepared image before generating. A silhouette outline cannot remove necklaces or other objects inside that boundary.
6. Download the geometry blueprint for explicit mapping data. Finish applies construction settings to the showroom.

Keyboard tracing uses arrow keys to move a cursor in 1% image increments and Enter or Space to add points. Crossed outlines, invalid dimensions, and degenerate traces are rejected. A boundary within 2% of an image edge is flagged as potentially cropped.

## Verification on 2026-09-15

All 22 Node tests passed. Browser checks used the user's already-loaded first agbada reference: an 11-point outline was applied, the local shell visibly changed to a broad-shouldered form, and the prepared image visibly excluded the head and background. No provider generation was submitted. The reference crops the hem, so its outline does not establish complete garment length. The edge-warning and disabled-preset additions were covered by source/build checks, not a fresh browser reload that would discard the loaded references.

## Still required for the original full-reconstruction objective

- Automatic image interpretation and garment-part segmentation. No vision provider has been selected or connected. The current workflow uses a human-reviewed boundary.
- Full front/back/side reference coverage or explicit assumptions about unseen surfaces. A cropped photograph cannot establish missing construction details or absolute dimensions.
- Sewing-pattern generation with panels, seams, neck and arm openings, and garment layers. The current surface is an open shell, not a production pattern.
- A calibrated body model, fabric parameters, cloth simulation, collision handling, and fitting validation. No physical fit guarantee is implemented.
- A live Tripo generation acceptance test. The last successful account check on 2026-09-14 returned zero API credits. Balance may change; check the connection panel before submitting.
- Persistent project storage and recovery of reference files, applied measurements, and generated models across reloads. Current working references are held in browser memory.

These are implementation requirements, not capabilities granted by better prompting or a higher polygon count. This delivery should not be described as completed photorealistic garment reconstruction.
