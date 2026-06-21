# Implementation Plan
### SpaceAI — AI Interior Design Studio

| Field | Value |
|---|---|
| Version | 1.0 |
| Companion to | TRD, Schema |
| Last updated | 2026-06-21 |

---

## 1. Strategy

Build vertically in milestones, each shippable. Keep every external dependency behind an
adapter with a mock fallback so the app is always demoable. Verify with `tsc` + `next build`
after each milestone. Track status in [`07-TRACKER.md`](./07-TRACKER.md).

## 2. Milestones → Tasks

### M0 — Foundation
- T0.1 Scaffold Next.js 14 + TS + Tailwind config
- T0.2 Design tokens, global styles, root layout + metadata
- T0.3 Domain types (`src/types`)
- T0.4 Pure utils (`cn`, `uid`, color math, downloads)

### M1 — Data & Catalog
- T1.1 Procedural furniture catalog (≥25 items, 8 categories)
- T1.2 Category metadata + lookup helpers

### M2 — State
- T2.1 Zustand store: scene, selection, editor flags
- T2.2 History (undo/redo, ≤50), autosave/persist/hydrate
- T2.3 Auto-arrange layout engine
- T2.4 Projects library (`localStorage`) + serialize

### M3 — AI & Media (server)
- T3.1 Cloudinary adapter + `/api/upload` (data-URL fallback)
- T3.2 OpenAI GPT-4 Vision adapter + `/api/analyze` (mock fallback)
- T3.3 Replicate SDXL adapter + `/api/redesign` (curated mock)
- T3.4 Depth `/api/depth` (MiDaS or heuristic)

### M4 — 3D Engine
- T4.1 Parametric `Room` (walls/floor/ceiling, materials, baseboards)
- T4.2 `FurnitureMesh` primitive renderer with role-based tinting
- T4.3 `Lighting` rig (time-of-day, ambient, sun, shadows)
- T4.4 `Scene`: orbit, selection raycast, TransformControls proxy, grid, snap, camera presets

### M5 — Studio UI
- T5.1 Toolbar (modes, undo/redo, grid/snap, cameras, auto-arrange, save/export/screenshot)
- T5.2 Furniture catalog panel (search + chips)
- T5.3 Right panel tabs: AI / Object / Room
- T5.4 Minimap (top-down plan)
- T5.5 StudioShell: layout, keyboard shortcuts, toasts, dynamic 3D import

### M6 — Marketing
- T6.1 Navbar + Footer
- T6.2 Hero + live 3D preview
- T6.3 Features, How-it-works, Showcase
- T6.4 Pricing, Testimonials, FAQ, CTA
- T6.5 Compose landing page

### M7 — Pages & Polish
- T7.1 `/studio` route
- T7.2 `/gallery` route
- T7.3 README + docs suite
- T7.4 Verify: `tsc --noEmit` + `next build` green

### M8 — Repo & Deploy
- T8.1 `.gitignore`, init repo, structured commit history
- T8.2 GitHub repo (public) + push
- T8.3 CI workflow (typecheck + build)
- T8.4 Vercel connect → preview + production deploy
- T8.5 Configure env vars (optional keys) in Vercel

## 3. Dependency Order

```
M0 → M1 → M2 → M4 → M5
        ↘ M3 ↗        ↘ M7 → M8
M0 ───────────→ M6 ──↗
```

3D engine (M4) depends on catalog (M1) + store (M2); Studio UI (M5) depends on M3+M4.
Marketing (M6) only needs M0. Deploy (M8) is last.

## 4. Acceptance Criteria (per milestone)

| M | Done when |
|---|---|
| M0 | `tsc` passes on empty app shell |
| M1 | Catalog renders, items typed |
| M2 | Add/move/undo works against store in isolation |
| M3 | All four routes return valid JSON in mock mode |
| M4 | Canvas shows room + furniture, gizmo edits persist |
| M5 | Full studio usable end-to-end locally |
| M6 | Landing renders all sections responsively |
| M7 | `next build` green; gallery round-trips a save |
| M8 | Repo public; Vercel production URL live |

## 5. Test & Verification Plan

- **Static:** strict TypeScript, ESLint via `next build`.
- **Build:** `next build` must generate all routes with no errors.
- **Manual smoke:** upload → analyze → add furniture → move → recolor → auto-arrange →
  redesign → save → reopen from gallery → export PNG/JSON.
- **Resilience:** run with no env keys (mock) and confirm no hard failures.

## 6. Rollout

1. Push repo with full history.
2. Vercel preview deploy on first push; verify smoke path on preview URL.
3. Promote to production (auto on `main`).
4. (Optional) add API keys in Vercel to enable live AI.
