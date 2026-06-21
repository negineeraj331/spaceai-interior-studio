# Application Flow Document
### SpaceAI — AI Interior Design Studio

| Field | Value |
|---|---|
| Version | 1.0 |
| Last updated | 2026-06-21 |

---

## 1. Site Map

```
/                 Marketing landing (Hero, Features, How, Showcase, Pricing, FAQ, CTA)
/studio           The 3D design studio (the app)
/gallery          Saved projects on this device
/api/upload       POST  image → hosted URL
/api/analyze      POST  imageUrl → RoomAnalysis
/api/redesign     POST  imageUrl + style → preview image
/api/depth        POST  imageUrl → dimension hints
```

## 2. Primary Happy Path

```
Landing ──"Open Studio"──▶ Studio
   │                          │
   │                          ├─ Upload photo ─▶ /api/upload ─▶ /api/analyze
   │                          │       │                              │
   │                          │       ▼                              ▼
   │                          │   photo shown              dimensions+palette applied
   │                          │                                      │
   │                          ├─ Add furniture (catalog) ────────────┤
   │                          ├─ Move/rotate/scale (gizmo) ──────────┤
   │                          ├─ Recolor walls/floor, lighting ──────┤
   │                          ├─ "Auto-arrange" (AI layout) ─────────┤
   │                          ├─ "Generate redesign" ─▶ /api/redesign │
   │                          └─ Save / Export / Screenshot ─────────┘
   │                                       │
   └────────────── Gallery ◄───────────────┘  (reopen, delete)
```

## 3. Detailed Flows

### 3.1 Upload & Analyze
1. User drops/selects an image in the **AI panel**.
2. File → base64 data URL (client `FileReader`).
3. `POST /api/upload` → hosted URL (or data URL in mock mode). State `photoUrl` set.
4. Auto-trigger `POST /api/analyze` with the URL.
5. Response `RoomAnalysis` rendered (type, style, dims, palette, lighting, suggestions).
6. `applyAnalysisDimensions` resizes the 3D room and seeds the wall color.
7. Loading + error states shown inline; `mocked` badge when demo AI is used.

### 3.2 Place & Manipulate Furniture
1. User browses **catalog** (search + category chips).
2. Click an item → `addObject(templateId)` inserts at center with small jitter, selects it.
3. Selection shows a ring + the **Object** properties tab populates.
4. On-canvas **gizmo** (translate/rotate/scale) manipulates an invisible proxy.
5. Proxy change → snap (if enabled) → `updateObject` writes back to store → autosave.
6. Properties panel offers rotate-45°, lock, duplicate, delete, color, scale.

### 3.3 Room & Environment
1. **Room tab**: width/depth/height sliders re-build the parametric shell live.
2. Wall/floor color via swatches or hex; floor material segmented control.
3. Lighting: time-of-day sweep (warm↔cool + sun arc), ambient, sun intensity, shadows.

### 3.4 AI Auto-Arrange
1. User clicks **Auto-arrange** in the toolbar.
2. Layout engine repositions items by category (rug centered, seating to back wall,
   storage to side wall, bed to far wall, etc.) within room bounds.
3. Change is a single undoable history entry.

### 3.5 AI Redesign
1. User picks a **style preset** (+ optional prompt) in the AI panel.
2. `POST /api/redesign` with `photoUrl`, `style`, `prompt`.
3. SDXL img2img (or curated mock) returns an image; preview rendered with open-full-size.

### 3.6 Persistence
- **Autosave:** every mutation → `localStorage["spaceai:autosave"]`.
- **Save:** `serialize()` + canvas thumbnail → `localStorage["spaceai:projects"]`.
- **Gallery:** lists, opens (`loadProject`), and deletes saved projects.
- **Export:** JSON download of the full scene; PNG screenshot from the canvas.

## 4. State Machine — AI Panel

```
        ┌────────┐  upload ok   ┌──────────┐  analyze ok  ┌──────────┐
 idle ─▶│uploading│────────────▶│ analyzing│─────────────▶│ analyzed │
        └────────┘              └──────────┘              └────┬─────┘
            │ err                    │ err                     │ generate
            ▼                        ▼                         ▼
         ┌─────┐                  ┌─────┐                ┌────────────┐
         │error│                  │error│                │redesigning │
         └─────┘                  └─────┘                └─────┬──────┘
                                                               │ ok/err
                                                               ▼
                                                         ┌──────────┐
                                                         │ preview  │
                                                         └──────────┘
```

## 5. Keyboard Shortcuts

| Key | Action | Key | Action |
|---|---|---|---|
| G | Move mode | ⌘/Ctrl Z | Undo |
| R | Rotate mode | ⌘/Ctrl ⇧ Z | Redo |
| E | Scale mode | ⌘/Ctrl D | Duplicate |
| Del / ⌫ | Delete selected | ⌘/Ctrl S | Save |
| Esc | Deselect | | |

## 6. Empty / Error / Loading States

- **Studio first load:** spinner overlay until R3F canvas mounts.
- **No selection:** Object tab shows guidance to pick or add furniture.
- **No photo:** Redesign disabled with hint.
- **Gallery empty:** illustrated empty state → CTA to studio.
- **API failure:** inline red status; AI routes still return mock 200s where possible.
