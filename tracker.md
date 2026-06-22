# Project Tracker
### SpaceAI — AI Interior Design Studio

> Living status board. ✅ done · 🟡 in progress · ⬜ todo.
> Last updated: 2026-06-21

---

## Milestone Status

| Milestone | Status | Notes |
|---|---|---|
| M0 Foundation | ✅ | Next.js 14, TS strict, Tailwind tokens |
| M1 Data & Catalog | ✅ | 52 items / 12 categories |
| M2 State | ✅ | Zustand + history + autosave + auto-arrange |
| M3 AI & Media | ✅ | 4 routes, all mock-capable |
| M4 3D Engine | ✅ | Room, meshes, lighting, gizmo, snap, cameras |
| M5 Studio UI | ✅ | Toolbar, panels, catalog, minimap, shell |
| M6 Marketing | ✅ | 10 sections, animated |
| M7 Pages & Polish | ✅ | studio + gallery; build green |
| M8 Repo & Deploy | ✅ | Live at spaceai-interior-studio.vercel.app (add prod env vars for live AI) |

## Task Checklist

### M0 Foundation
- [x] T0.1 Scaffold (package.json, tsconfig, next.config, postcss, tailwind)
- [x] T0.2 globals.css + root layout + metadata/OG
- [x] T0.3 Domain types
- [x] T0.4 Utils

### M1 Data & Catalog
- [x] T1.1 Procedural furniture catalog
- [x] T1.2 Category meta + lookups

### M2 State
- [x] T2.1 Store: scene/selection/flags
- [x] T2.2 History + persist/hydrate
- [x] T2.3 Auto-arrange engine
- [x] T2.4 Projects library + serialize

### M3 AI & Media
- [x] T3.1 Cloudinary + /api/upload
- [x] T3.2 GPT-4 Vision + /api/analyze
- [x] T3.3 Replicate SDXL + /api/redesign
- [x] T3.4 /api/depth

### M4 3D Engine
- [x] T4.1 Parametric Room
- [x] T4.2 FurnitureMesh
- [x] T4.3 Lighting rig
- [x] T4.4 Scene (orbit, selection, gizmo, grid, cameras)

### M5 Studio UI
- [x] T5.1 Toolbar
- [x] T5.2 Catalog panel
- [x] T5.3 Right panel tabs (AI/Object/Room)
- [x] T5.4 Minimap
- [x] T5.5 StudioShell + shortcuts + toasts

### M6 Marketing
- [x] T6.1 Navbar + Footer
- [x] T6.2 Hero + live 3D
- [x] T6.3 Features / How / Showcase
- [x] T6.4 Pricing / Testimonials / FAQ / CTA
- [x] T6.5 Compose landing

### M7 Pages & Polish
- [x] T7.1 /studio
- [x] T7.2 /gallery
- [x] T7.3 README + docs
- [x] T7.4 Verify build (tsc + next build green)

### M8 Repo & Deploy
- [x] T8.1 .gitignore + structured commits
- [x] T8.2 GitHub repo (public) + push
- [x] T8.3 CI workflow (typecheck + build)
- [ ] T8.4 Vercel import → production deploy  _(one click on vercel.com — see README)_
- [ ] T8.5 Add optional API keys in Vercel env

## Verification Log

| Date | Check | Result |
|---|---|---|
| 2026-06-21 | `tsc --noEmit` | ✅ pass |
| 2026-06-21 | `next build` | ✅ 10 routes, no errors |

## Post-v1 Enhancements

| Date | Change | Status |
|---|---|---|
| 2026-06-21 | Shareable design links (URL-encoded scenes, keyless) | ✅ |
| 2026-06-22 | Custom GLTF/GLB furniture uploads (IndexedDB + URL, auto-fit, fallback) | ✅ |
| 2026-06-22 | One-click room starter templates (4 designed rooms) + empty-state hint | ✅ |
| 2026-06-22 | Live cost estimate (toolbar total + itemized receipt dialog) | ✅ |
| 2026-06-22 | Dimension overlay (room + selected-item measurements, toggleable) | ✅ |
| 2026-06-22 | Deployed to Vercel + live AI keys verified (Cloudinary live; OpenAI/Replicate valid, need credit) | ✅ |
| 2026-06-22 | Catalog expanded 26→52 pieces; +4 categories (Kitchen, Bathroom, Outdoor, Electronics) | ✅ |

## Known Follow-ups (v1.1)

- Cloud accounts + project sync (see Schema §5)
- Custom GLTF furniture uploads
- Real depth-map → mesh displacement
