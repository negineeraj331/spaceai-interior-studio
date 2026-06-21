# Engineering Rules & Conventions
### SpaceAI — AI Interior Design Studio

| Field | Value |
|---|---|
| Version | 1.0 |
| Applies to | All contributors |
| Last updated | 2026-06-21 |

---

## 1. Golden Rules

1. **Types are the contract.** All domain shapes live in `src/types`. Never duplicate a
   shape; import it.
2. **Every external service has a mock.** If you add an API dependency, ship a deterministic
   fallback so the app runs with zero keys.
3. **The store is authoritative.** 3D objects never own their own truth — they render from
   the Zustand store and write back through actions.
4. **Keep secrets server-side.** No API key, token, or secret may be imported into a Client
   Component or shipped to the browser.
5. **Green build or it didn't happen.** `tsc --noEmit` and `next build` must pass before any
   commit that touches code.

## 2. Code Style

- **Language:** TypeScript, `strict: true`. No `any` except at validated boundaries.
- **Components:** function components; `"use client"` only when needed (state, effects, 3D).
- **Naming:** `PascalCase` components, `camelCase` vars/functions, `kebab-case` files for
  non-components, `PascalCase.tsx` for components.
- **Imports:** absolute via `@/*`. Group: external → `@/` → relative.
- **Styling:** Tailwind utilities + the shared component classes in `globals.css`
  (`btn-*`, `card`, `panel`, `input`, `chip`). Don't invent one-off CSS files.
- **Comments:** explain *why*, not *what*. Document non-obvious math/3D/AI decisions.

## 3. State & Data

- Mutations go through store actions; never `set` raw state from components.
- Any state-changing action that should be undoable must `commit()` first.
- Persist via the store's `persist()`; never write `localStorage` keys directly elsewhere
  (use `src/lib/projects.ts` for the projects library).

## 4. 3D Conventions

- Units are **meters**; **Y is up**; object origin sits on the floor (`y=0`).
- New furniture = a `FurnitureTemplate` with a `PrimitiveSpec`. Prefer primitives over GLTF
  in v1. Keep part counts low (perf).
- Use `role` (`body|frame|accent|cushion`) so recoloring stays automatic.
- Disable OrbitControls during gizmo drags. Clamp DPR `[1,2]`.

## 5. API Routes

- Validate input first; return `{ error }` with a correct status on bad input.
- Wrap model calls in try/catch and **fall back to mock**, logging `[route] falling back`.
- Set `runtime = "nodejs"` and an appropriate `maxDuration`.
- Expose `GET → { configured: boolean }` for capability checks.

## 6. Accessibility & UX

- Interactive elements must be real `<button>`/`<input>`/`<a>` with focus-visible styles.
- Provide loading, empty, and error states for every async surface.
- Surface `mocked` flags so users know when demo data is shown.

## 7. Git & Commits

- Branch off `main`; open a PR; CI (typecheck + build) must be green to merge.
- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`,
  `perf:`, `build:`, `ci:`.
- Subject ≤ 72 chars, imperative mood. Body explains rationale when non-trivial.
- Author commits under your own identity. Do not add third-party/tool co-author trailers.
- Never commit secrets or `.env*`. `.env.example` documents required vars.

## 8. Dependencies

- Add a dependency only when it earns its weight. Prefer the stack already chosen.
- Pin to caret ranges consistent with existing `package.json`.

## 9. Performance Budgets

- Marketing first-load JS ≤ 150 kB; studio ≤ 180 kB.
- Lazy-load the 3D canvas (`next/dynamic`, `ssr: false`).
- Memoize geometry/material creation in 3D components.

## 10. Definition of Done

A change is done when:
- [ ] Types updated in `src/types` if shapes changed
- [ ] `tsc --noEmit` passes
- [ ] `next build` passes
- [ ] Loading/empty/error states covered
- [ ] Mock fallback intact for any new external call
- [ ] Tracker updated
