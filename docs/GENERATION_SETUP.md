# References and Tripo generation

## Run locally

Requires Node 20.12+ (Node 22+ recommended). Install dependencies with `npm ci`.

1. Copy `.env.example` to `.env` and add your Tripo API key as `TRIPO_API_KEY`. Do not prefix it with `VITE_`, commit it, or paste it into chat.
2. Run `npm run server` from the project root. This starts a local-only API on port 3001.
3. In a separate terminal, run `npm run dev`. Vite proxies `/api/generation` to the API.
4. In Sizing → Reference, add images/videos, capture video frames if needed, and assign generation views. A front view is required. Choose up to four views of the same garment.
5. Confirm sending those selected views to Tripo and using account credits, then generate. Only selected, resized JPEGs are sent. Original videos, other references, measurements, and brief text are not sent.
6. Wait for the returned model. Preview uses the actual provider GLB. Enable approximate fitting to scale it using the profile; adjust ease, length, height alignment, and rotation.

Images: JPEG/PNG/WebP, 10 MB maximum each. Videos: MP4/WebM/MOV, 50 MB each, subject to browser codec support. Up to 12 references total, including captured frames. Raw videos remain local; this is selected-frame generation, not temporal video understanding.

## What fitting does and does not do

The generated model is initially displayed without deformation. Approximate fitting normalizes its bounding box and scales width/depth along height using hip/waist/chest plus ease. The studio form is shown for alignment. This assumes an upright, garment-only mesh. It can distort sleeves or preserve unwanted background/person geometry; it is not collision-aware, sewing-pattern-based, or a validated fit prediction. Inspect and adjust before use. The scene's torso form is an illustrative sample with an existing corset; it is not a personalized body scan.

Image generation follows the selected pictures. Prompt text stays in the brief and does not control Tripo's image-to-model endpoint. A dedicated garment pattern and cloth-simulation service is still needed for production-quality fit. Do not represent the output as tailoring-ready.

## Reliability and security boundaries

The key stays in the local Node server. Input size/types, view roles, duplicate requests, and origins are checked. Provider POSTs are never automatically retried. Record the provider task ID if a submission is uncertain; check Tripo before generating again. The browser retains the local request ID in session storage for reconnecting. The API stores jobs in memory for up to 24 hours (100 job cap); restarting it loses that lookup, but the Tripo dashboard may still have the task. No production authentication, durable job queue, or per-user credit accounting is implemented. Keep the API bound to localhost.

Tripo download links expire. Use Refresh task status / model link while the local API is running. A future production integration should ingest generated assets into authenticated durable storage. Actual credit availability and generation quality must be tested with the user's account; automated tests use injected provider responses and do not spend credits.

Official contracts: [authentication and tasks](https://docs.tripo3d.ai/get-started/quick-start.html), [multiview roles](https://docs.tripo3d.ai/model-generation/multiview-to-model-v3-0-v3-1.html), [SDK upload compatibility](https://developers.tripo3d.ai/en/docs/sdk), [task results](https://docs.tripo3d.ai/task-query/get-your-task-result.html), [pricing](https://docs.tripo3d.ai/get-started/pricing.html).

## Verification

Run `npm test` and `npm run build`. Tests exercise reference limits, sizing, provider payload ordering, missing configuration, idempotent submission, status handling, origin rejection, and no automatic submission retry. Live provider generation and garment-fit quality remain unverified until an account key is configured.
