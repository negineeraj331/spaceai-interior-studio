<div align="center">

# 🛋️ SpaceAI — AI Interior Design Studio

**Upload a photo of your room → AI rebuilds it in 3D → drag in furniture, recolor walls,
rearrange the layout, and generate photorealistic redesigns — all in the browser.**

Next.js 14 · TypeScript · Three.js (R3F) · Tailwind · GPT-4 Vision · Stable Diffusion · Cloudinary

</div>

---

## ✨ Features

- **Photo → 3D** — upload a room photo; AI estimates dimensions and reconstructs an editable 3D scene.
- **3D furniture editor** — 26 procedurally-modeled pieces across 8 categories; add, move, rotate, scale, duplicate, delete.
- **GPT-4 Vision analysis** — detects room type, style, palette, lighting, and suggests tailored layouts.
- **AI auto-arrange** — one click lays out your furniture into a balanced plan.
- **Stable Diffusion redesigns** — photorealistic restyles (Scandinavian, Industrial, Japandi, …) via Replicate SDXL.
- **Live materials & lighting** — recolor walls/floors, switch flooring, sweep time-of-day.
- **Undo/redo, snap, grid, camera presets, minimap, keyboard shortcuts.**
- **Save / reopen / export** — local project gallery, JSON export, PNG screenshots.
- **Polished marketing site** — hero with live 3D, features, pricing, FAQ, and more.

> 💡 **Runs with zero API keys.** Every AI/media integration has a deterministic mock
> fallback, so you can explore the whole product before adding any credentials.

## 🚀 Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Then open **/studio** to design, or **/** for the landing page.

## 🔑 Environment (all optional)

Copy `.env.example` → `.env.local` and fill what you have. Missing keys → mock mode.

| Variable | Enables |
|---|---|
| `OPENAI_API_KEY` | Real GPT-4 Vision room analysis |
| `REPLICATE_API_TOKEN` | Real Stable Diffusion redesigns + depth |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Cloud image hosting |

## 🧱 Tech & structure

```
src/
├── app/                 # routes: /, /studio, /gallery, /api/*
│   └── api/             # upload · analyze · redesign · depth (Node handlers)
├── components/
│   ├── landing/         # marketing sections
│   └── studio/          # editor UI + three/ (R3F scene)
├── lib/                 # ai, cloudinary, furniture catalog, projects, utils
├── store/               # Zustand editor store (history, persistence)
└── types/               # domain models (single source of truth)
```

## 📚 Documentation

Full product & engineering docs live in [`/docs`](./docs):

1. [PRD](./docs/01-PRD.md) · 2. [TRD](./docs/02-TRD.md) · 3. [App Flow](./docs/03-APPFLOW.md) ·
4. [Design](./docs/04-DESIGN.md) · 5. [Schema](./docs/05-SCHEMA.md) ·
6. [Implementation Plan](./docs/06-IMPLEMENTATION-PLAN.md) · 7. [Tracker](./tracker.md) ·
8. [Rules](./rules.md)

## 🛠️ Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Lint |

## ☁️ Deploy (Vercel)

1. Push this repo to GitHub (done).
2. On [vercel.com](https://vercel.com) → **Add New… → Project** → import the repo.
3. Framework auto-detects **Next.js**. Click **Deploy**.
4. (Optional) add the env vars above in **Project → Settings → Environment Variables** to
   enable live AI, then redeploy.

Every push to `main` then auto-deploys to production; PRs get preview URLs.

## 📄 License

MIT — see headers / use freely.
