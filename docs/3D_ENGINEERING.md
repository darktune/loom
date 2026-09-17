# 3D Graphics & AI Lead — first implementation

The showroom and sizing preview use React Three Fiber with Drei orbit controls and studio lighting. The default Studio mannequin is an authored, textured CC0 dress form with corset, collar, and an added display stand. The separate Garment sketch view retains the three illustrative collection silhouettes and their measurement hotspots. The studio sample is explicitly labeled as different from the selected catalog garment. Reset view restores the camera.

Measurements are centimetres, except weight in kilograms. Invalid, missing, or out-of-range values block progression. Finish applies the draft measurements to the showroom. Closing the wizard does not apply the draft. Height, chest, waist, and hip independently affect the procedural model. This is an illustrative proportion preview, not validated sizing, cloth simulation, or AI inference.

## Authored models

Add assets under `public/models/` and set `modelUrl: '/models/your-garment.glb'` on a garment in `src/App.jsx`. The loader uses Suspense, clones the scene for multiple viewers, and supports Draco through Drei's default decoder. Draco-compressed models require access to that decoder CDN. Production deployments should self-host the decoder if external requests are restricted.

Models should include textures, use metres, and be authored at a consistent human scale. Imported catalog assets are centered. The bundled studio model has approximate height and radial measurement deformation; this is not anatomical or garment-fit validation. Arbitrary authored garments need agreed mesh names or morph targets before fit deformation can be wired safely. Loading/render errors show a fallback. Asset credit and license are in `public/models/ATTRIBUTION.md`.

## Checks

- `node --test src/lib/sizing.test.js`
- `npm run build`
- In the browser: rotate, zoom, reset, select each garment, inspect hotspots, and resize to mobile.
- Open Custom fit, check blank/out-of-range input, enter valid values, advance to preview, and Finish. Confirm the showroom reflects the applied proportions.

## Reference and interaction fixes

The Reference step accepts up to 12 images and videos through a native file picker or drag-and-drop. Images are limited to 10 MB and 40 million pixels; videos to 50 MB. Users can capture still frames from browser-supported videos and assign front, left, back, or right views. Files stay local until the user explicitly submits selected image views to Tripo. See `GENERATION_SETUP.md` for setup and limitations.

The explicit fabric-texture checkbox updates the Studio mannequin immediately. The atlas shader uses a red-color mask to target the sample corset, preserving the original normal and roughness maps. It is a swatch visualization, not image-to-3D reconstruction. Photos of outfits do not generate matching garment shapes. References and text appear in the sizing preview and order review; the downloadable JSON brief includes measurements, prompt, and photo filename, not the image bytes.

Atelier scrolls to and focuses the viewer, Sizing opens the wizard, and Tailors/Escrow display truthful capability information. Review selected garment opens a demo order review. Download design brief exports a local file; it does not place an order or collect money. Dialogs support Escape, focus trapping, and returning focus to the opener. Displayed currency conversion is a fixed, labeled demo rate.

Tripo generation is integrated through a local server with credit checks, status polling, and generated GLB display. Live generation requires API credits and has not been verified with a paid task. Generated garments offer approximate measurement deformation and manual alignment; these are not cloth simulation. Live tailor chat/sync, payments, and escrow remain unimplemented. The authored studio sample is a dress form, not a photorealistic full-body person or a reconstruction of an uploaded photo.

API references: [R3F Canvas](https://r3f.docs.pmnd.rs/api/canvas), [Drei controls](https://drei.docs.pmnd.rs/controls/introduction), [GLTF loader](https://drei.docs.pmnd.rs/loaders/gltf-use-gltf).

## Measurement-driven construction study (2026-09-14)

The default viewer now renders a user-controlled garment shell, with agbada, kaftan, and tunic studies. The Reference step exposes length, ease, wing spread, and wireframe controls. Finish applies construction settings with measurements to the showroom. The previous studio sample remains a separate view.

The construction module exports 2,145 vertices and 4,096 triangles, UV coordinates, stable row/column vertex IDs, dimensions, and assigned-image coverage in a downloadable JSON blueprint. Changing construction settings preserves topology. Video files do not count as image views until frames are captured and assigned.

This is a parametric silhouette study, not automatic reference analysis. It has no sewn panels, arm openings, collision solver, physical drape, or validated anatomical fitting. Reference coverage checks metadata only. The exported vertex map is local; the current Tripo image-generation endpoint does not accept it as geometric constraints. A future construction pipeline must add actual pattern pieces, sewing constraints, and simulation before claiming reconstructed clothing.

Verification: all 17 Node tests passed, including four new construction tests. Production build passed with a large-bundle warning. Browser verification was attempted but blocked: automatic approval review could not authorize launching the development server because its review model was at capacity.

Research references: https://platform.tripo3d.ai/docs/generation and https://www.marvelousdesigner.com/explore/guide/make-3d-clothing-without-sculpting-every-wrinkle . These document separate image-generation and pattern/sewing/simulation workflows; they do not establish a working reconstruction pipeline in LOOM.

Browser verification follow-up: the local Vite server and generation API started successfully. The sizing journey was exercised in the in-app browser: select Tunic, set length to 70 cm, enable wireframe, continue to the rendered preview, Finish, and request the design brief. The copyable exported JSON preserved family=tunic, length=70, ease=20, spread=90, and wireframe=true. The compact viewer was increased from 280 to 440 px after visual inspection found the toolbar crowded the head; a second screenshot confirmed the head and garment were visible. No paid Tripo generation was submitted, and actual download-file delivery was not independently inspected.
