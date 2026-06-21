# Technical Requirements Document (TRD)
### SpaceAI — AI Interior Design Studio

| Field | Value |
|---|---|
| Version | 1.0 |
| Companion to | [01-PRD.md](./01-PRD.md) |
| Last updated | 2026-06-21 |

---

## 1. Architecture Overview

A single **Next.js 14 (App Router)** application provides both the React frontend and the
Node.js backend (Route Handlers). The 3D editor runs entirely client-side via React Three
Fiber. AI/media work happens in server routes that proxy to OpenAI, Replicate, and
Cloudinary — each with a deterministic mock fallback.

```
┌────────────────────────── Browser ──────────────────────────┐
│  Marketing pages (SSR)        Studio (CSR, R3F canvas)       │
│        │                          │                          │
│        │     Zustand store ◄──────┘  (scene, history, undo)  │
│        ▼                          ▼                          │
│   fetch /api/*  ───────────────────────────────┐            │
└─────────────────────────────────────────────────┼────────────┘
                                                  ▼
                        Next.js Route Handlers (Node runtime)
            ┌──────────────┬──────────────┬───────────────┬────────────┐
            │ /api/upload  │ /api/analyze │ /api/redesign │ /api/depth │
            │  Cloudinary  │ GPT-4 Vision │  Replicate    │  MiDAS/    │
            │              │  (gpt-4o)    │  SDXL img2img │  heuristic │
            └──────────────┴──────────────┴───────────────┴────────────┘
                    (all fall back to mock when unconfigured)
```

## 2. Technology Stack

| Concern | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.2 |
| Language | TypeScript (strict) | 5.6 |
| UI | React | 18.3 |
| Styling | Tailwind CSS | 3.4 |
| 3D | three.js | 0.169 |
| 3D React | @react-three/fiber + drei | 8.17 / 9.11 |
| State | Zustand | 5.0 |
| Animation | Framer Motion | 11 |
| Icons | lucide-react | 0.45 |
| Vision AI | OpenAI SDK (gpt-4o) | 4.68 |
| Image AI | Replicate (SDXL) | 0.34 |
| Media | Cloudinary | 2.5 |
| Hosting | Vercel | — |

## 3. Runtime & Environments

- **Node runtime** for all API routes (`export const runtime = "nodejs"`).
- `maxDuration` raised for AI routes (analyze 60s, redesign 120s).
- Environments: `local` (mock-friendly), `preview` (Vercel PR), `production`.

## 4. Module Boundaries

| Layer | Path | Responsibility |
|---|---|---|
| Types | `src/types` | Domain models, single source of truth |
| Lib | `src/lib` | AI/media adapters, furniture data, pure utils |
| Store | `src/store` | Zustand editor state + history + persistence |
| API | `src/app/api` | Route handlers, validation, error envelopes |
| 3D | `src/components/studio/three` | R3F scene, room, lighting, meshes |
| Studio UI | `src/components/studio` | Toolbar, panels, catalog, minimap, shell |
| Marketing | `src/components/landing` | Landing sections |
| Pages | `src/app` | Routes: `/`, `/studio`, `/gallery`, `/api/*` |

## 5. API Contracts

All endpoints accept/return JSON. Errors: `{ "error": string }` with appropriate status.

### POST `/api/upload`
```
req:  { image: string /* data:image/...;base64 */ }
res:  { url: string, mocked: boolean }
errs: 400 (bad/missing image), 413 (>8MB), 500
```

### POST `/api/analyze`
```
req:  { imageUrl: string }
res:  RoomAnalysis  // see 04-SCHEMA
errs: 400, 500   // model failure → mocked analysis (200)
```

### POST `/api/redesign`
```
req:  { imageUrl: string, style?: string, prompt?: string }
res:  { imageUrl, style, prompt, mocked }
errs: 400, 500   // model failure → mocked preview (200)
```

### POST `/api/depth`
```
req:  { imageUrl: string, aspect?: number }
res:  { depthMapUrl: string|null, hints: {width,depth,height}, mocked }
```

Each route also exposes `GET` returning `{ configured: boolean }` for capability checks.

## 6. AI Integration Details

- **Analysis:** `gpt-4o` chat completion, `response_format: json_object`, vision message
  with the room image. Response normalised & clamped to safe ranges.
- **Redesign:** Replicate `stability-ai/sdxl` img2img with `prompt_strength ≈ 0.55` to
  preserve geometry; negative prompt strips artifacts/people/text.
- **Depth:** Replicate MiDaS when token present; otherwise aspect-ratio heuristic.
- **Fallbacks:** Hash-seeded mock analysis (stable per image), curated Unsplash previews
  for redesigns, data-URL passthrough for uploads.

## 7. 3D Engine Requirements

- Procedural furniture from `PrimitiveSpec` (boxes/cylinders/cones/spheres) so no GLTF
  asset hosting is required for v1; `modelUrl` field reserved for GLTF upgrade.
- Selection via raycast `onClick`; manipulation via drei `TransformControls` driving an
  invisible proxy that writes back to the store (keeps state authoritative).
- OrbitControls disabled while a gizmo drag is active.
- Snap-to-grid applied on translate; configurable grid size.
- Shadows via single directional light + ContactShadows; DPR clamped `[1,2]`.

## 8. State Management

- Single Zustand store; selectors used to minimise re-renders.
- History: bounded stacks (`past`/`future`, ≤ 50) snapshotting room+objects+lighting.
- Autosave to `localStorage` on every mutation; explicit "Save" writes to the projects
  library (separate key) with a JPEG thumbnail from the canvas.

## 9. Performance Budget

| Asset | Budget |
|---|---|
| Marketing first-load JS | ≤ 150 kB |
| Studio first-load JS | ≤ 180 kB |
| Interactive (studio) | ≤ 3 s mid-range |
| Frame rate (≤30 objects) | ~60 fps |

## 10. Security & Validation

- Input validation on every route (type, prefix, size).
- No secrets client-side; all AI calls server-only.
- `preserveDrawingBuffer` enabled for screenshots; remote-texture taint handled gracefully.
- `next.config` allowlists only known image hosts.

## 11. Build, CI & Deploy

- `npm run build` must pass with **zero type errors** (strict TS).
- GitHub repo with CI workflow running typecheck + build on push/PR.
- Vercel connected to the repo → automatic preview + production deploys.
- Env vars configured in Vercel project settings (all optional; absence → mock mode).

## 12. Observability (v1)

- `console.error` on the server for failed AI calls (with fallback note).
- `mocked` flags surfaced in UI so users/devs know when demo data is shown.
