# Product Requirements Document (PRD)
### SpaceAI — AI Interior Design Studio

| Field | Value |
|---|---|
| Version | 1.0 |
| Status | Approved for build |
| Owner | Product |
| Last updated | 2026-06-21 |

---

## 1. Problem Statement

People renovating or furnishing a home cannot visualise how furniture, colors, or
layouts will look in *their actual space* before committing money. Existing tools are
either too complex (professional CAD), too generic (catalog mockups), or purely 2D.
The result is expensive mistakes: wrong-sized sofas, clashing paint, awkward layouts.

## 2. Vision

> Upload one photo of a room and instantly get an editable 3D version of it. Drag in
> furniture, repaint walls, rearrange the layout, and generate a photorealistic preview —
> all in the browser, with AI doing the heavy lifting.

## 3. Goals & Non-Goals

### Goals
- **G1** — Turn a single room photo into an editable 3D scene in < 60 seconds.
- **G2** — Let any non-technical user place & manipulate furniture in real time.
- **G3** — Use AI to analyse the room and suggest layouts tailored to its dimensions.
- **G4** — Generate photorealistic restyled previews of the room.
- **G5** — Run fully (in a degraded "demo" mode) with zero API keys, for easy evaluation.

### Non-Goals (v1)
- Millimeter-accurate CAD / construction documents.
- Multi-room / whole-house planning.
- E-commerce checkout (we link out; we don't sell furniture).
- Native mobile apps (responsive web only).
- Real-time multi-user collaboration.

## 4. Target Users / Personas

| Persona | Need | Key feature |
|---|---|---|
| **Homeowner Hana** (renovating) | Avoid costly mistakes | 3D editor + recolor |
| **Renter Raj** (can't paint) | Try ideas risk-free | AI redesign previews |
| **Designer Dana** (pro) | Fast client mockups | Catalog + export/share |
| **Stager Sam** (real estate) | Quick room turnarounds | AI auto-arrange |

## 5. User Stories

- As a user, I can **upload a room photo** and see it analysed automatically.
- As a user, I can **see my room reconstructed in 3D** with approximate dimensions.
- As a user, I can **browse a furniture catalog** and add items to my room.
- As a user, I can **move, rotate, and scale** furniture with direct manipulation.
- As a user, I can **recolor walls and floors** and change flooring material.
- As a user, I can **adjust lighting / time of day** to preview ambiance.
- As a user, I can **ask AI to auto-arrange** my furniture into a sensible layout.
- As a user, I can **generate a photorealistic redesign** in a chosen style.
- As a user, I can **save, reopen, export, and screenshot** my designs.
- As a user, I can **undo/redo** any change.

## 6. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | Image upload (drag-drop + picker), validated, ≤ 8 MB | P0 |
| FR-2 | Cloudinary hosting with data-URL fallback | P0 |
| FR-3 | GPT-4 Vision room analysis → type, style, dims, palette, lighting | P0 |
| FR-4 | Depth-based dimension hints feeding the 3D room shell | P1 |
| FR-5 | Parametric 3D room (walls/floor/ceiling) from dimensions | P0 |
| FR-6 | Furniture catalog, ≥ 25 items, 8 categories, searchable | P0 |
| FR-7 | Add / select / move / rotate / scale / duplicate / delete objects | P0 |
| FR-8 | Wall & floor color + material editing | P0 |
| FR-9 | Lighting controls (ambient, sun, time-of-day, shadows) | P1 |
| FR-10 | AI auto-arrange layout | P1 |
| FR-11 | Stable Diffusion redesign with style presets + custom prompt | P0 |
| FR-12 | Undo / redo (≥ 50 steps) | P1 |
| FR-13 | Save/load projects (local), export JSON, export PNG screenshot | P0 |
| FR-14 | Top-down 2D minimap | P2 |
| FR-15 | Keyboard shortcuts | P2 |
| FR-16 | Marketing site (hero, features, pricing, FAQ, etc.) | P0 |
| FR-17 | Gallery of saved projects | P1 |

## 7. Non-Functional Requirements

- **Performance:** Studio interactive < 3 s on mid-range laptop; 60 fps target for ≤ 30 objects.
- **Resilience:** Every external API degrades gracefully to a mock — app never hard-fails.
- **Accessibility:** Keyboard operable controls, sufficient contrast, semantic markup.
- **SEO:** Server-rendered marketing pages with full metadata/OG tags.
- **Privacy:** Photos uploaded only on user action; no third-party analytics in v1.
- **Cost control:** Free tier caps AI redesigns; mock mode for evaluation.

## 8. Success Metrics

| Metric | Target |
|---|---|
| Photo → first 3D render | < 60 s |
| Activation (upload + ≥1 furniture placed) | ≥ 60% of new users |
| Redesign generated per active session | ≥ 1.2 |
| Project save rate | ≥ 35% of sessions |
| Lighthouse (marketing) | ≥ 90 perf / 100 SEO |

## 9. Release Scope

**v1.0 (this build):** FR-1…FR-17 in mock-capable form, single-device persistence,
marketing site, gallery, deployed on Vercel.

**v1.1 (next):** Cloud accounts & sync, custom GLTF uploads, share links.

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| AI API keys absent during demo | Deterministic mock fallbacks for every endpoint |
| 3D perf on low-end devices | Procedural primitives, DPR clamp, object cap guidance |
| Depth estimate inaccuracy | User-adjustable dimension sliders |
| Image upload abuse / size | Server-side size guard + type validation |
