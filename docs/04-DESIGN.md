# Design Document (UI/UX & Visual System)
### SpaceAI — AI Interior Design Studio

| Field | Value |
|---|---|
| Version | 1.0 |
| Last updated | 2026-06-21 |

---

## 1. Design Principles

1. **Show, don't tell** — lead with live 3D and real previews, not copy.
2. **One studio, no modes** — upload, edit, and AI all coexist in a single screen.
3. **Confidence over precision** — approximate-but-believable beats fiddly CAD.
4. **Dark, focused canvas** — the room is the hero; UI recedes.
5. **Always responsive** — every action gives immediate visual feedback.

## 2. Brand & Visual Language

- **Mood:** modern, architectural, premium-but-approachable.
- **Surface:** deep "ink" navy-blacks with subtle glassmorphism panels.
- **Accent:** electric brand blue (`#3366ff`) + warm amber (`#ff9913`) for AI moments.

## 3. Color Tokens

| Token | Hex | Use |
|---|---|---|
| `ink-950` | `#070a13` | App background |
| `ink-900` | `#0b0f1a` | Panels / canvas bg |
| `ink-800` | `#111726` | Inputs / wells |
| `ink-600` | `#27314a` | Borders / tracks |
| `brand-500` | `#3366ff` | Primary actions, selection |
| `brand-300` | `#8eb6ff` | Accents, icons |
| `accent-500` | `#ff9913` | AI / highlight CTAs |
| slate-200…500 | — | Text hierarchy |

Semantic roles: success `green-400`, danger `red-400/500`, info `brand-400`.

## 4. Typography

- **Family:** Inter (variable), `--font-sans` / `--font-display`.
- **Scale:** display 36–60px (hero), h2 30–36px, body 16–18px, UI 12–14px.
- **Tracking:** tight on display headings; balanced wrapping via `text-balance`.

## 5. Spacing, Radius, Elevation

- Spacing scale: 4px base (Tailwind default).
- Radius: `lg`(8) inputs, `xl`(12) buttons/cards, `2xl`(16) panels, `3xl` CTA blocks.
- Elevation: soft brand-tinted shadows on primary buttons & hero canvas.

## 6. Component Inventory

| Component | Notes |
|---|---|
| Buttons | `btn-primary` / `btn-ghost` / `btn-accent`; active scale, focus ring |
| Card / Panel | bordered, translucent, backdrop-blur |
| Input / Slider | dark wells; custom themed range thumb |
| Chip | pill labels, status dots |
| Color field + swatch row | hex input + native picker + 15-swatch palette |
| Segmented control | floor material / camera presets |
| Toolbar tool buttons | grouped, active state = brand fill |
| Tabs (right panel) | AI / Object / Room |
| Toast | transient confirmation |
| Modal-less popovers | shortcuts card, mobile menu |

## 7. Layout — Marketing

Single-column, max-width 1280px, generous vertical rhythm. Sections:
Hero (split: copy + live 3D) → Features (4-col grid) → How (3 steps) →
Showcase (style switcher) → Pricing (3 tiers) → Testimonials (masonry) →
FAQ (accordion) → CTA (gradient block) → Footer.

Motion: Framer Motion fade-up on scroll (`whileInView`, once), hero entrance,
auto-rotating 3D preview.

## 8. Layout — Studio

```
┌──────────────────────── Toolbar (h-14) ─────────────────────────┐
│ logo · name | move/rot/scale · undo/redo · grid/snap · cams |  …│
├───────────┬──────────────────────────────────┬──────────────────┤
│ Catalog   │            3D Viewport           │  Right panel     │
│ (300px)   │   ┌───────────────────────────┐  │  (340px)         │
│ search    │   │  R3F canvas (orbit)       │  │  [AI][Obj][Room] │
│ chips     │   │  minimap (bottom-left)    │  │  scrollable      │
│ grid 2col │   │  shortcuts (bottom-right) │  │                  │
└───────────┴───┴───────────────────────────┴──┴──────────────────┘
```

- Left panel collapsible; floating reopen button.
- Canvas fills remaining space; overlays are pointer-friendly.
- Right panel tabbed to keep a single, predictable inspector location.

## 9. Iconography

lucide-react throughout; 16–24px; category icons map furniture groups
(Sofa, Table, Archive, BedDouble, Lamp, Frame, Square, Sprout).

## 10. Accessibility

- All interactive elements are real buttons/inputs with focus-visible rings.
- Color contrast targets WCAG AA for text on ink surfaces.
- Keyboard shortcuts documented + non-destructive defaults.
- Reduced-motion friendly (entrance animations are subtle, content-independent).

## 11. Responsive Behavior

- Marketing: fully responsive down to 360px; nav collapses to a sheet menu.
- Studio: optimized for ≥ 1024px; on narrow screens panels stack / collapse and a
  notice encourages a larger screen for full editing.

## 12. Empty & Loading Visuals

- Skeleton/pulse blocks for the hero 3D and studio canvas while loading.
- Illustrated empty states (gallery, no-selection) with a clear next action.
