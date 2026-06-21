# Schema Document (Data Models)
### SpaceAI — AI Interior Design Studio

| Field | Value |
|---|---|
| Version | 1.0 |
| Source of truth | `src/types/index.ts` |
| Last updated | 2026-06-21 |

---

## 1. Overview

v1 is **client-persisted** (no database): the scene graph and projects live in the
browser's `localStorage`. This document defines the canonical shapes and the storage
layout, plus a forward-looking relational schema for the v1.1 cloud sync milestone.

## 2. Core Types

### `Vec3`
`[number, number, number]` — meters, world space. `Y` is up.

### `FurnitureTemplate` (catalog blueprint)
```ts
{
  id: string;                 // "sofa-3seat"
  name: string;               // "3-Seat Sofa"
  category: FurnitureCategory;
  primitive: PrimitiveSpec;   // procedural geometry
  modelUrl?: string;          // optional GLTF (v1.1)
  size: Vec3;                 // footprint [w,h,d]
  defaultColor: string;       // hex
  price?: number;             // USD
  tags: string[];
}
```

### `FurnitureCategory`
`"seating" | "tables" | "storage" | "beds" | "lighting" | "decor" | "rugs" | "plants"`

### `PrimitiveSpec` / `PrimitivePart`
```ts
PrimitiveSpec { parts: PrimitivePart[] }

PrimitivePart {
  shape: "box"|"cylinder"|"sphere"|"cone"|"torus";
  position: Vec3;             // offset from object origin
  args: number[];             // geometry args (shape-specific)
  rotation?: Vec3;
  color?: string;
  role?: "body"|"frame"|"accent"|"cushion";  // drives derived tint
  metalness?: number;
  roughness?: number;
}
```

### `SceneObject` (placed instance)
```ts
{
  uid: string;                // "obj_x8f2…"
  templateId: string;         // → FurnitureTemplate.id
  name: string;
  category: FurnitureCategory;
  position: Vec3;
  rotation: Vec3;             // radians
  scale: number;              // uniform
  color: string;              // hex
  locked?: boolean;
}
```

### `RoomConfig`
```ts
{
  width: number; depth: number; height: number;  // meters
  wallColor: string; floorColor: string;          // hex
  floorMaterial: "wood"|"tile"|"carpet"|"concrete";
}
```

### `LightingConfig`
```ts
{
  ambient: number;       // 0..1.5
  directional: number;   // 0..2.5
  timeOfDay: number;     // 0..1  (morning→noon→evening)
  shadows: boolean;
}
```

### `RoomAnalysis` (AI output)
```ts
{
  roomType: string;
  detectedStyle: string;
  dimensions: { width: number; depth: number; height: number };
  dominantColors: string[];     // ≤5 hex
  lighting: string;
  summary: string;
  suggestions: LayoutSuggestion[];
  mocked: boolean;
}
LayoutSuggestion { title: string; description: string; items: string[] }
```

### `RedesignResult`
```ts
{ imageUrl: string; style: string; prompt: string; mocked: boolean }
```

### `SavedProject` (persistence unit)
```ts
{
  id: string;            // "proj_…"
  name: string;
  createdAt: number;     // epoch ms
  updatedAt: number;
  thumbnail?: string;    // data:image/jpeg
  photoUrl?: string;
  room: RoomConfig;
  objects: SceneObject[];
  lighting: LightingConfig;
  analysis?: RoomAnalysis | null;
}
```

## 3. LocalStorage Layout

| Key | Shape | Written by |
|---|---|---|
| `spaceai:autosave` | `SavedProject` | store, on every mutation |
| `spaceai:projects` | `SavedProject[]` | Save action / gallery |

Both are best-effort: parse failures are swallowed and treated as empty.

## 4. Validation Rules

| Field | Rule |
|---|---|
| `room.width/depth` | clamp 2…12 m |
| `room.height` | clamp 2…4 m |
| `scale` | clamp 0.5…2 (UI) |
| `dominantColors` | ≤ 5 entries |
| upload `image` | `data:image/*`, ≤ ~8 MB |
| analysis dims | clamped server-side before use |

## 5. Forward-Looking Relational Schema (v1.1 cloud)

```sql
-- Postgres sketch for cloud sync milestone

CREATE TABLE users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  name        text,
  plan        text NOT NULL DEFAULT 'free',     -- free|pro|studio
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  photo_url   text,
  thumbnail   text,
  room        jsonb NOT NULL,        -- RoomConfig
  lighting    jsonb NOT NULL,        -- LightingConfig
  analysis    jsonb,                 -- RoomAnalysis
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE scene_objects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  template_id text NOT NULL,
  name        text NOT NULL,
  category    text NOT NULL,
  position    real[3] NOT NULL,
  rotation    real[3] NOT NULL,
  scale       real NOT NULL DEFAULT 1,
  color       text NOT NULL,
  locked      boolean NOT NULL DEFAULT false
);

CREATE TABLE redesigns (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  style       text NOT NULL,
  prompt      text,
  image_url   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_user ON projects(user_id, updated_at DESC);
CREATE INDEX idx_objects_project ON scene_objects(project_id);
```

The `localStorage` ↔ relational mapping is 1:1 by design, so the v1.1 migration is a
straight serialization swap behind `src/lib/projects.ts`.
