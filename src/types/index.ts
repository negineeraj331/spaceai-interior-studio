// ─────────────────────────────────────────────────────────────
// Core domain types for the SpaceAI interior design studio
// ─────────────────────────────────────────────────────────────

export type Vec3 = [number, number, number];

export type FurnitureCategory =
  | "seating"
  | "tables"
  | "storage"
  | "beds"
  | "lighting"
  | "decor"
  | "rugs"
  | "plants"
  | "kitchen"
  | "bathroom"
  | "outdoor"
  | "electronics";

/** A catalog template — the "blueprint" for a piece of furniture. */
export interface FurnitureTemplate {
  id: string;
  name: string;
  category: FurnitureCategory;
  /** Primitive procedural model used when no GLTF is available. */
  primitive: PrimitiveSpec;
  /** Optional GLTF model URL (CDN). Falls back to primitive on error. */
  modelUrl?: string;
  /** Default footprint in meters [w, h, d]. */
  size: Vec3;
  defaultColor: string;
  price?: number;
  tags: string[];
}

/** A procedural representation so the studio works with zero external assets. */
export interface PrimitiveSpec {
  /** Ordered list of parts composing the object. */
  parts: PrimitivePart[];
}

export interface PrimitivePart {
  shape: "box" | "cylinder" | "sphere" | "cone" | "torus";
  /** Position offset from object origin, in meters. */
  position: Vec3;
  /** Size: box=[w,h,d]; cylinder/cone=[radius, height, radialSegments]; sphere=[r]; torus=[r, tube]. */
  args: number[];
  rotation?: Vec3;
  /** Color override; defaults to the object color. */
  color?: string;
  /** "frame" parts use a darker/metal accent. */
  role?: "body" | "frame" | "accent" | "cushion";
  metalness?: number;
  roughness?: number;
}

/** A live instance of furniture placed in the scene. */
export interface SceneObject {
  uid: string;
  templateId: string;
  name: string;
  category: FurnitureCategory;
  position: Vec3;
  rotation: Vec3;
  scale: number;
  color: string;
  locked?: boolean;
}

export interface RoomConfig {
  width: number; // X meters
  depth: number; // Z meters
  height: number; // Y meters
  wallColor: string;
  floorColor: string;
  floorMaterial: "wood" | "tile" | "carpet" | "concrete";
}

export interface LightingConfig {
  ambient: number;
  directional: number;
  /** 0..1 mapped to a warm→cool sweep + sun angle. */
  timeOfDay: number;
  shadows: boolean;
}

export type TransformMode = "translate" | "rotate" | "scale";
export type CameraPreset = "perspective" | "top" | "front" | "corner";

// ─── AI analysis ────────────────────────────────────────────────

export interface RoomAnalysis {
  roomType: string;
  detectedStyle: string;
  dimensions: { width: number; depth: number; height: number };
  dominantColors: string[];
  lighting: string;
  summary: string;
  suggestions: LayoutSuggestion[];
  /** True when produced by the deterministic mock (no API key). */
  mocked: boolean;
}

export interface LayoutSuggestion {
  title: string;
  description: string;
  items: string[];
}

export interface RedesignResult {
  imageUrl: string;
  style: string;
  prompt: string;
  mocked: boolean;
}

// ─── Persistence ────────────────────────────────────────────────

export interface SavedProject {
  id: string;
  name: string;
  ownerId?: string; // present when saved by a signed-in user
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
  photoUrl?: string;
  room: RoomConfig;
  objects: SceneObject[];
  lighting: LightingConfig;
  analysis?: RoomAnalysis | null;
}
