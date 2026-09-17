# LOOM generation architecture

## Decision

LOOM uses one generation job interface with provider adapters behind it. **Recommendation:** Tripo API is the primary server adapter when `TRIPO_API_KEY` and credits exist. Meshy is a supervised browser adapter and immediate fallback: LOOM prepares references and imports a user-downloaded GLB. Local runtime is a reserved adapter, disabled until a supported model, GPU, licensing, and repeatable quality test exist.

This separation prevents provider branding from being confused with model quality. It also prevents measurements from being represented as a 3D fit when the provider only created image-to-mesh geometry.

## Provider options

| Adapter | Execution | Current state | Strength | Hard limit |
| --- | --- | --- | --- | --- |
| `tripo-api` | LOOM server | Active when key and credits work | Automated multi-view request, task polling, GLB URL | Provider inference does not guarantee sewing topology or measurement fit |
| `meshy-browser` | User-supervised browser | Active fallback | Existing Meshy account, high-quality visual reference, downloaded GLB import | Browser session and plan control generation; LOOM cannot monitor or download it silently |
| `local-runtime` | LOOM worker/GPU | Disabled | No per-generation cloud fee, private data path, reproducible preprocessing | Current hardware/runtime not validated; local image-to-3D still does not create a validated sewn garment |

## Job interface

Every adapter must accept a normalized job containing an id, provider, front/left/back/right references, prompt, measurements as context, and consent. It returns status, progress, provider task id, model URL or imported file, provenance, and explicit `fitApplied` status. It must never return “fitted” merely because measurements were collected.

Job states: `queued`, `uploading`, `running`, `success`, `failed`, `cancelled`. One active generation per browser session prevents duplicate credit spend. Jobs need durable storage before production deployment; current server storage is in memory and is intentionally local-development only.

## End-to-end path

1. Reference intake validates type, size, role uniqueness, and consent.
2. Preprocessor creates bounded JPEG views and optional reviewed outline masks. It does not infer hidden geometry.
3. Provider adapter submits only selected views. Measurements remain design context.
4. Job store polls provider state and persists terminal provenance.
5. Model validator accepts self-contained GLB only; LOOM viewer loads it with original proportions.
6. Review compares front, rear, and oblique views against references.
7. Fitting is a separate module: garment panel segmentation or reconstruction, calibrated body, seam constraints, fabric parameters, cloth solver, and fit validation.

## Backend hardening sequence

Current code has a local in-memory Tripo job map. Next backend steps:

1. Move `createJobStore` behind a storage interface; use SQLite for one-machine development, Postgres for deployment.
2. Store input hashes, provider task ids, status history, output URL expiry, and provenance. Encrypt or delete reference bytes per retention policy.
3. Add signed result download proxy with size/type checks; do not trust arbitrary provider URLs in the browser.
4. Add idempotency key `(userId, inputHash, provider, requestId)` and per-user concurrency/credit guards.
5. Add a worker queue for polling and cleanup. Keep provider adapters stateless.
6. Add model QA gates: GLB self-contained, triangle/index validity, texture presence, no external URI, and visual review record.
7. Add local runtime only after a benchmark compares it to the corrected Meshy and Tripo assets on the same four references.

## Deadline runbook

Use this order for a submission build:

1. Start LOOM and the local generation API.
2. Assign the four garment photos: front, left, back, right. Captured video frames count as images after capture.
3. Check Tripo connection and credits. Submit one textured multiview job only if credits are available.
4. If Tripo is unavailable, open Meshy fallback. Prepare and download the selected views, generate in Meshy, download a self-contained GLB, then import it into LOOM.
5. Show the generated model in the viewer and label its provider. Keep the corrected Meshy GLB as a known-good backup.
6. Describe measurements as design context. Do not call the result measurement-fitted unless a cloth solver has passed fit validation.

For a first demo, do not pay both providers. Use existing Meshy free credits for the visual fallback. Add Tripo API credits only when automated in-LOOM generation is required.

## Acceptance gates

- Provider shown in UI and brief.
- No key appears in browser code, logs, or committed files.
- Duplicate submit does not spend another credit.
- Failed provider request produces no generated result.
- Imported Meshy model remains downloadable and visible in LOOM.
- Measurements display as context until a cloth fitting solver passes a separate validation suite.
