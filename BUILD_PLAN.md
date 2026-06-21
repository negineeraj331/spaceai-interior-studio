# SpaceAI — AI Interior Design Studio · Full Build Plan

> Upload a photo of your room → AI reconstructs it as a 3D scene → drag in furniture,
> recolor walls, reposition items in real time → AI suggests layouts & photorealistic redesigns.

---

## 1. Product Overview

| | |
|---|---|
| **Problem** | People renovating can't visualise furniture, colors, or layouts before spending money. |
| **Solution** | Photo → 3D editable scene + AI layout suggestions + Stable Diffusion redesign previews. |
| **Audience** | Homeowners, renters, interior designers, real-estate stagers. |

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router) + TypeScript** | React UI + Node API routes in one deployable unit |
| Styling | **Tailwind CSS** + custom design system | Fast, consistent, production-grade |
| 3D | **Three.js via React Three Fiber + drei** | Idiomatic React 3D, controls, GLTF loading |
| State | **Zustand** | Lightweight global store for the editor |
| AI — Vision | **OpenAI GPT-4 Vision** (`/api/analyze`) | Room analysis + layout suggestions |
| AI — Image | **Replicate (Stable Diffusion / SDXL)** (`/api/redesign`) | Photorealistic redesign previews |
| AI — Depth | **Depth estimation** (`/api/depth`) | Photo → depth → room dimensions |
| Media | **Cloudinary** (`/api/upload`) | Image hosting + transforms |
| Animation | **Framer Motion** | Landing-page polish |
| Icons | **lucide-react** | Clean icon set |

> **Key design principle:** every external API has a deterministic **mock fallback**, so the
> entire product is demoable with zero API keys. Real keys upgrade it transparently.

## 3. Architecture

```
Browser (React)
  ├── Landing site (marketing)
  └── Studio (the app)
        ├── Upload → /api/upload (Cloudinary)
        ├── Analyze → /api/analyze (GPT-4 Vision)   → room dims + layout plan
        ├── Depth   → /api/depth                     → 3D reconstruction hints
        ├── 3D Canvas (R3F): room shell + draggable GLTF furniture
        └── Redesign→ /api/redesign (Replicate SDXL) → photoreal preview
Zustand store  ── holds scene graph, furniture, history (undo/redo), persisted to localStorage
```

## 4. Feature Set

### Marketing site
- [x] Sticky navbar, animated hero with live 3D preview
- [x] Features grid, How-it-works (3 steps), interactive showcase
- [x] Pricing tiers, testimonials, FAQ, final CTA, footer

### Studio (core app)
- [x] Drag-drop / click photo upload with progress + preview
- [x] AI room analysis panel (dimensions, style, lighting, suggestions)
- [x] 3D scene: parametric room shell (walls/floor/ceiling) from detected dims
- [x] Furniture catalog (categorized) → drag/click into scene
- [x] Select / move / rotate / scale objects (gizmo + properties panel)
- [x] Wall & floor color/material picker
- [x] Lighting controls (ambient, directional, time-of-day)
- [x] AI layout auto-arrange + alternative layouts
- [x] Stable Diffusion redesign with style presets + prompt
- [x] Undo / redo, duplicate, delete, snap-to-grid
- [x] Save / load projects (localStorage + API stub), export JSON, screenshot PNG
- [x] Top-down 2D minimap, camera presets, grid toggle
- [x] Keyboard shortcuts, responsive panels

### Platform
- [x] Project gallery page
- [x] API routes with mock fallbacks + input validation
- [x] Env-driven config, README, deploy notes

## 5. Build Phases

1. **Foundation** — scaffold, config, design system, types ✅
2. **Marketing site** — all landing sections ✅
3. **Studio shell** — layout, panels, Zustand store ✅
4. **3D engine** — room, furniture, controls, transforms ✅
5. **AI integrations** — analyze / redesign / depth / upload ✅
6. **Polish** — gallery, shortcuts, export, docs ✅

## 6. Env Vars

```
OPENAI_API_KEY=         # GPT-4 Vision (optional → mock)
REPLICATE_API_TOKEN=    # Stable Diffusion (optional → mock)
CLOUDINARY_CLOUD_NAME=  # uploads (optional → data-URL fallback)
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## 7. Run

```bash
npm install
npm run dev      # http://localhost:3000
```
