import type { FurnitureTemplate, FurnitureCategory } from "@/types";

// ─────────────────────────────────────────────────────────────
// Procedural furniture catalog.
// Each template is built from primitive parts so the studio renders
// real-looking furniture with zero external GLTF assets required.
// `modelUrl` can be added later to upgrade any item to a full GLTF.
// ─────────────────────────────────────────────────────────────

export const CATEGORY_META: Record<
  FurnitureCategory,
  { label: string; icon: string }
> = {
  seating: { label: "Seating", icon: "Sofa" },
  tables: { label: "Tables", icon: "Table" },
  storage: { label: "Storage", icon: "Archive" },
  beds: { label: "Beds", icon: "BedDouble" },
  lighting: { label: "Lighting", icon: "Lamp" },
  decor: { label: "Decor", icon: "Frame" },
  rugs: { label: "Rugs", icon: "Square" },
  plants: { label: "Plants", icon: "Sprout" },
  kitchen: { label: "Kitchen", icon: "CookingPot" },
  bathroom: { label: "Bathroom", icon: "Bath" },
  outdoor: { label: "Outdoor", icon: "Umbrella" },
  electronics: { label: "Electronics", icon: "Tv" },
};

export const FURNITURE: FurnitureTemplate[] = [
  // ── Seating ──────────────────────────────────────────────
  {
    id: "sofa-3seat",
    name: "3-Seat Sofa",
    category: "seating",
    size: [2.1, 0.85, 0.9],
    defaultColor: "#6b7280",
    price: 1290,
    tags: ["living room", "comfort"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.25, 0], args: [2.1, 0.3, 0.9], role: "body" },
        { shape: "box", position: [0, 0.5, -0.32], args: [2.1, 0.5, 0.26], role: "cushion" },
        { shape: "box", position: [-0.92, 0.45, 0], args: [0.26, 0.5, 0.9], role: "cushion" },
        { shape: "box", position: [0.92, 0.45, 0], args: [0.26, 0.5, 0.9], role: "cushion" },
        { shape: "box", position: [-0.5, 0.45, 0.05], args: [0.62, 0.18, 0.62], role: "cushion" },
        { shape: "box", position: [0.5, 0.45, 0.05], args: [0.62, 0.18, 0.62], role: "cushion" },
      ],
    },
  },
  {
    id: "armchair",
    name: "Accent Armchair",
    category: "seating",
    size: [0.85, 0.9, 0.85],
    defaultColor: "#b45309",
    price: 540,
    tags: ["accent", "reading"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.25, 0], args: [0.85, 0.3, 0.85], role: "body" },
        { shape: "box", position: [0, 0.55, -0.3], args: [0.85, 0.55, 0.25], role: "cushion" },
        { shape: "box", position: [-0.37, 0.45, 0], args: [0.18, 0.4, 0.85], role: "cushion" },
        { shape: "box", position: [0.37, 0.45, 0], args: [0.18, 0.4, 0.85], role: "cushion" },
        { shape: "cylinder", position: [-0.32, 0.1, 0.32], args: [0.04, 0.2, 12], role: "frame" },
        { shape: "cylinder", position: [0.32, 0.1, 0.32], args: [0.04, 0.2, 12], role: "frame" },
        { shape: "cylinder", position: [-0.32, 0.1, -0.32], args: [0.04, 0.2, 12], role: "frame" },
        { shape: "cylinder", position: [0.32, 0.1, -0.32], args: [0.04, 0.2, 12], role: "frame" },
      ],
    },
  },
  {
    id: "dining-chair",
    name: "Dining Chair",
    category: "seating",
    size: [0.48, 0.9, 0.5],
    defaultColor: "#334155",
    price: 120,
    tags: ["dining"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.46, 0], args: [0.46, 0.06, 0.46], role: "body" },
        { shape: "box", position: [0, 0.72, -0.2], args: [0.46, 0.5, 0.06], role: "body" },
        { shape: "box", position: [-0.2, 0.23, -0.2], args: [0.05, 0.46, 0.05], role: "frame" },
        { shape: "box", position: [0.2, 0.23, -0.2], args: [0.05, 0.46, 0.05], role: "frame" },
        { shape: "box", position: [-0.2, 0.23, 0.2], args: [0.05, 0.46, 0.05], role: "frame" },
        { shape: "box", position: [0.2, 0.23, 0.2], args: [0.05, 0.46, 0.05], role: "frame" },
      ],
    },
  },
  {
    id: "ottoman",
    name: "Round Ottoman",
    category: "seating",
    size: [0.6, 0.42, 0.6],
    defaultColor: "#475569",
    price: 180,
    tags: ["footstool"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.2, 0], args: [0.3, 0.34, 24], role: "cushion" },
        { shape: "cylinder", position: [0, 0.02, 0], args: [0.28, 0.06, 24], role: "frame" },
      ],
    },
  },

  // ── Tables ───────────────────────────────────────────────
  {
    id: "coffee-table",
    name: "Coffee Table",
    category: "tables",
    size: [1.1, 0.4, 0.6],
    defaultColor: "#7c5a3a",
    price: 320,
    tags: ["living room"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.38, 0], args: [1.1, 0.06, 0.6], role: "body", roughness: 0.6 },
        { shape: "box", position: [-0.48, 0.18, -0.24], args: [0.06, 0.36, 0.06], role: "frame" },
        { shape: "box", position: [0.48, 0.18, -0.24], args: [0.06, 0.36, 0.06], role: "frame" },
        { shape: "box", position: [-0.48, 0.18, 0.24], args: [0.06, 0.36, 0.06], role: "frame" },
        { shape: "box", position: [0.48, 0.18, 0.24], args: [0.06, 0.36, 0.06], role: "frame" },
      ],
    },
  },
  {
    id: "dining-table",
    name: "Dining Table",
    category: "tables",
    size: [1.8, 0.75, 0.9],
    defaultColor: "#6b4f34",
    price: 890,
    tags: ["dining"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.73, 0], args: [1.8, 0.06, 0.9], role: "body", roughness: 0.5 },
        { shape: "box", position: [-0.8, 0.36, -0.38], args: [0.08, 0.72, 0.08], role: "frame" },
        { shape: "box", position: [0.8, 0.36, -0.38], args: [0.08, 0.72, 0.08], role: "frame" },
        { shape: "box", position: [-0.8, 0.36, 0.38], args: [0.08, 0.72, 0.08], role: "frame" },
        { shape: "box", position: [0.8, 0.36, 0.38], args: [0.08, 0.72, 0.08], role: "frame" },
      ],
    },
  },
  {
    id: "side-table",
    name: "Side Table",
    category: "tables",
    size: [0.45, 0.55, 0.45],
    defaultColor: "#1f2937",
    price: 140,
    tags: ["accent"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.54, 0], args: [0.23, 0.04, 24], role: "body" },
        { shape: "cylinder", position: [0, 0.27, 0], args: [0.03, 0.52, 12], role: "frame", metalness: 0.8 },
        { shape: "cylinder", position: [0, 0.02, 0], args: [0.18, 0.04, 24], role: "frame", metalness: 0.8 },
      ],
    },
  },
  {
    id: "desk",
    name: "Work Desk",
    category: "tables",
    size: [1.4, 0.75, 0.7],
    defaultColor: "#8a6d4b",
    price: 410,
    tags: ["office"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.74, 0], args: [1.4, 0.05, 0.7], role: "body" },
        { shape: "box", position: [-0.65, 0.37, 0], args: [0.05, 0.72, 0.66], role: "frame", metalness: 0.6 },
        { shape: "box", position: [0.65, 0.37, 0], args: [0.05, 0.72, 0.66], role: "frame", metalness: 0.6 },
        { shape: "box", position: [0.45, 0.5, 0], args: [0.5, 0.4, 0.6], role: "accent" },
      ],
    },
  },

  // ── Storage ──────────────────────────────────────────────
  {
    id: "bookshelf",
    name: "Bookshelf",
    category: "storage",
    size: [0.9, 1.8, 0.32],
    defaultColor: "#5b4632",
    price: 360,
    tags: ["office", "living room"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.9, 0], args: [0.9, 1.8, 0.32], role: "body" },
        { shape: "box", position: [0, 0.9, 0.02], args: [0.82, 1.72, 0.28], role: "accent", color: "#3a2e20" },
        { shape: "box", position: [0, 0.45, 0.04], args: [0.82, 0.04, 0.28], role: "frame" },
        { shape: "box", position: [0, 0.9, 0.04], args: [0.82, 0.04, 0.28], role: "frame" },
        { shape: "box", position: [0, 1.35, 0.04], args: [0.82, 0.04, 0.28], role: "frame" },
      ],
    },
  },
  {
    id: "tv-stand",
    name: "TV Console",
    category: "storage",
    size: [1.6, 0.5, 0.4],
    defaultColor: "#27272a",
    price: 380,
    tags: ["living room", "media"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.25, 0], args: [1.6, 0.45, 0.4], role: "body" },
        { shape: "box", position: [-0.4, 0.25, 0.205], args: [0.7, 0.35, 0.02], role: "accent", color: "#3f3f46" },
        { shape: "box", position: [0.4, 0.25, 0.205], args: [0.7, 0.35, 0.02], role: "accent", color: "#3f3f46" },
      ],
    },
  },
  {
    id: "wardrobe",
    name: "Wardrobe",
    category: "storage",
    size: [1.2, 2.0, 0.6],
    defaultColor: "#e2e8f0",
    price: 720,
    tags: ["bedroom"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 1.0, 0], args: [1.2, 2.0, 0.6], role: "body" },
        { shape: "box", position: [-0.3, 1.0, 0.305], args: [0.55, 1.9, 0.02], role: "accent", color: "#cbd5e1" },
        { shape: "box", position: [0.3, 1.0, 0.305], args: [0.55, 1.9, 0.02], role: "accent", color: "#cbd5e1" },
        { shape: "cylinder", position: [-0.05, 1.0, 0.33], args: [0.02, 0.3, 10], rotation: [0, 0, 0], role: "frame", metalness: 0.9 },
        { shape: "cylinder", position: [0.05, 1.0, 0.33], args: [0.02, 0.3, 10], role: "frame", metalness: 0.9 },
      ],
    },
  },

  // ── Beds ─────────────────────────────────────────────────
  {
    id: "bed-queen",
    name: "Queen Bed",
    category: "beds",
    size: [1.6, 1.0, 2.1],
    defaultColor: "#94a3b8",
    price: 1100,
    tags: ["bedroom"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.2, 0], args: [1.6, 0.3, 2.1], role: "frame", color: "#4b3b2a" },
        { shape: "box", position: [0, 0.45, 0.05], args: [1.55, 0.22, 2.0], role: "cushion", color: "#e2e8f0" },
        { shape: "box", position: [0, 0.85, -0.95], args: [1.6, 0.8, 0.12], role: "body" },
        { shape: "box", position: [-0.45, 0.6, -0.85], args: [0.5, 0.16, 0.34], role: "cushion", color: "#f1f5f9" },
        { shape: "box", position: [0.45, 0.6, -0.85], args: [0.5, 0.16, 0.34], role: "cushion", color: "#f1f5f9" },
      ],
    },
  },
  {
    id: "nightstand",
    name: "Nightstand",
    category: "beds",
    size: [0.45, 0.5, 0.4],
    defaultColor: "#3f3f46",
    price: 160,
    tags: ["bedroom"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.25, 0], args: [0.45, 0.5, 0.4], role: "body" },
        { shape: "box", position: [0, 0.32, 0.205], args: [0.38, 0.16, 0.02], role: "accent", color: "#52525b" },
        { shape: "cylinder", position: [0, 0.32, 0.23], args: [0.02, 0.06, 10], rotation: [1.57, 0, 0], role: "frame", metalness: 0.9 },
      ],
    },
  },

  // ── Lighting ─────────────────────────────────────────────
  {
    id: "floor-lamp",
    name: "Floor Lamp",
    category: "lighting",
    size: [0.4, 1.6, 0.4],
    defaultColor: "#1f2937",
    price: 130,
    tags: ["ambient"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.03, 0], args: [0.2, 0.05, 24], role: "frame", metalness: 0.7 },
        { shape: "cylinder", position: [0, 0.8, 0], args: [0.02, 1.55, 12], role: "frame", metalness: 0.7 },
        { shape: "cone", position: [0, 1.5, 0], args: [0.22, 0.3, 24], role: "accent", color: "#fde68a" },
      ],
    },
  },
  {
    id: "pendant-light",
    name: "Pendant Light",
    category: "lighting",
    size: [0.4, 0.5, 0.4],
    defaultColor: "#0f172a",
    price: 95,
    tags: ["ceiling"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.5, 0], args: [0.01, 0.5, 8], role: "frame" },
        { shape: "cone", position: [0, 0.18, 0], args: [0.22, 0.28, 24], rotation: [3.14159, 0, 0], role: "accent", color: "#fbbf24" },
      ],
    },
  },
  {
    id: "table-lamp",
    name: "Table Lamp",
    category: "lighting",
    size: [0.3, 0.5, 0.3],
    defaultColor: "#e5e7eb",
    price: 70,
    tags: ["accent"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.02, 0], args: [0.12, 0.04, 20], role: "frame", metalness: 0.6 },
        { shape: "cylinder", position: [0, 0.2, 0], args: [0.015, 0.32, 10], role: "frame" },
        { shape: "cone", position: [0, 0.42, 0], args: [0.16, 0.2, 20], role: "accent", color: "#fef3c7" },
      ],
    },
  },

  // ── Decor ────────────────────────────────────────────────
  {
    id: "wall-art",
    name: "Wall Art",
    category: "decor",
    size: [0.9, 0.7, 0.05],
    defaultColor: "#0ea5e9",
    price: 110,
    tags: ["wall"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0, 0], args: [0.9, 0.7, 0.04], role: "frame", color: "#1f2937" },
        { shape: "box", position: [0, 0, 0.025], args: [0.82, 0.62, 0.01], role: "accent" },
      ],
    },
  },
  {
    id: "mirror",
    name: "Round Mirror",
    category: "decor",
    size: [0.8, 0.8, 0.05],
    defaultColor: "#cbd5e1",
    price: 150,
    tags: ["wall"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0, 0], args: [0.4, 0.04, 32], rotation: [1.5708, 0, 0], role: "frame", color: "#d4af37", metalness: 0.9 },
        { shape: "cylinder", position: [0, 0, 0.025], args: [0.35, 0.01, 32], rotation: [1.5708, 0, 0], role: "accent", color: "#e2e8f0", metalness: 1, roughness: 0.05 },
      ],
    },
  },
  {
    id: "vase",
    name: "Ceramic Vase",
    category: "decor",
    size: [0.25, 0.45, 0.25],
    defaultColor: "#f5f5f4",
    price: 45,
    tags: ["tabletop"],
    primitive: {
      parts: [
        { shape: "sphere", position: [0, 0.18, 0], args: [0.13], role: "body" },
        { shape: "cylinder", position: [0, 0.38, 0], args: [0.05, 0.18, 16], role: "body" },
      ],
    },
  },

  // ── Rugs ─────────────────────────────────────────────────
  {
    id: "rug-rect",
    name: "Area Rug",
    category: "rugs",
    size: [2.4, 0.04, 1.6],
    defaultColor: "#9f1239",
    price: 240,
    tags: ["floor"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.02, 0], args: [2.4, 0.03, 1.6], role: "body", roughness: 1 },
        { shape: "box", position: [0, 0.031, 0], args: [2.2, 0.005, 1.4], role: "accent", color: "#be123c", roughness: 1 },
      ],
    },
  },
  {
    id: "rug-round",
    name: "Round Rug",
    category: "rugs",
    size: [1.8, 0.04, 1.8],
    defaultColor: "#1e3a5f",
    price: 210,
    tags: ["floor"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.02, 0], args: [0.9, 0.03, 40], role: "body", roughness: 1 },
        { shape: "cylinder", position: [0, 0.031, 0], args: [0.7, 0.005, 40], role: "accent", color: "#2c5282", roughness: 1 },
      ],
    },
  },

  // ── Plants ───────────────────────────────────────────────
  {
    id: "plant-tall",
    name: "Fiddle-Leaf Fig",
    category: "plants",
    size: [0.6, 1.7, 0.6],
    defaultColor: "#15803d",
    price: 85,
    tags: ["greenery"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.18, 0], args: [0.18, 0.36, 20], role: "frame", color: "#a16207" },
        { shape: "cylinder", position: [0, 0.7, 0], args: [0.03, 0.7, 10], role: "accent", color: "#4d7c0f" },
        { shape: "sphere", position: [0, 1.2, 0], args: [0.32], role: "body" },
        { shape: "sphere", position: [0.18, 1.0, 0.1], args: [0.2], role: "body" },
        { shape: "sphere", position: [-0.15, 1.35, -0.08], args: [0.22], role: "body" },
      ],
    },
  },
  {
    id: "plant-small",
    name: "Tabletop Succulent",
    category: "plants",
    size: [0.25, 0.3, 0.25],
    defaultColor: "#16a34a",
    price: 30,
    tags: ["greenery", "tabletop"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.08, 0], args: [0.1, 0.16, 18], role: "frame", color: "#d97706" },
        { shape: "sphere", position: [0, 0.22, 0], args: [0.12], role: "body" },
      ],
    },
  },
  {
    id: "cactus",
    name: "Potted Cactus",
    category: "plants",
    size: [0.3, 0.7, 0.3],
    defaultColor: "#15803d",
    price: 40,
    tags: ["greenery", "desert"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.1, 0], args: [0.13, 0.2, 18], role: "frame", color: "#c2410c" },
        { shape: "cylinder", position: [0, 0.42, 0], args: [0.08, 0.5, 12], role: "body" },
        { shape: "sphere", position: [0.12, 0.42, 0], args: [0.07], role: "body" },
        { shape: "sphere", position: [-0.12, 0.52, 0], args: [0.06], role: "body" },
      ],
    },
  },

  // ── Seating (more) ───────────────────────────────────────
  {
    id: "loveseat",
    name: "Loveseat",
    category: "seating",
    size: [1.5, 0.85, 0.9],
    defaultColor: "#7c8a9e",
    price: 860,
    tags: ["living room", "compact"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.25, 0], args: [1.5, 0.3, 0.9], role: "body" },
        { shape: "box", position: [0, 0.5, -0.32], args: [1.5, 0.5, 0.26], role: "cushion" },
        { shape: "box", position: [-0.62, 0.45, 0], args: [0.26, 0.5, 0.9], role: "cushion" },
        { shape: "box", position: [0.62, 0.45, 0], args: [0.26, 0.5, 0.9], role: "cushion" },
        { shape: "box", position: [0, 0.45, 0.05], args: [1.0, 0.18, 0.62], role: "cushion" },
      ],
    },
  },
  {
    id: "bar-stool",
    name: "Bar Stool",
    category: "seating",
    size: [0.4, 0.75, 0.4],
    defaultColor: "#1f2937",
    price: 95,
    tags: ["kitchen", "counter"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.72, 0], args: [0.18, 0.06, 24], role: "cushion" },
        { shape: "cylinder", position: [-0.13, 0.36, -0.13], args: [0.02, 0.7, 10], role: "frame", metalness: 0.8 },
        { shape: "cylinder", position: [0.13, 0.36, -0.13], args: [0.02, 0.7, 10], role: "frame", metalness: 0.8 },
        { shape: "cylinder", position: [-0.13, 0.36, 0.13], args: [0.02, 0.7, 10], role: "frame", metalness: 0.8 },
        { shape: "cylinder", position: [0.13, 0.36, 0.13], args: [0.02, 0.7, 10], role: "frame", metalness: 0.8 },
        { shape: "torus", position: [0, 0.25, 0], args: [0.16, 0.015], rotation: [1.5708, 0, 0], role: "frame", metalness: 0.8 },
      ],
    },
  },
  {
    id: "bench",
    name: "Upholstered Bench",
    category: "seating",
    size: [1.3, 0.45, 0.45],
    defaultColor: "#475569",
    price: 220,
    tags: ["entryway", "bedroom"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.4, 0], args: [1.3, 0.16, 0.45], role: "cushion" },
        { shape: "box", position: [-0.55, 0.16, -0.16], args: [0.06, 0.32, 0.06], role: "frame" },
        { shape: "box", position: [0.55, 0.16, -0.16], args: [0.06, 0.32, 0.06], role: "frame" },
        { shape: "box", position: [-0.55, 0.16, 0.16], args: [0.06, 0.32, 0.06], role: "frame" },
        { shape: "box", position: [0.55, 0.16, 0.16], args: [0.06, 0.32, 0.06], role: "frame" },
      ],
    },
  },

  // ── Tables (more) ────────────────────────────────────────
  {
    id: "console-table",
    name: "Console Table",
    category: "tables",
    size: [1.2, 0.8, 0.35],
    defaultColor: "#6b4f34",
    price: 290,
    tags: ["entryway", "hallway"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.78, 0], args: [1.2, 0.05, 0.35], role: "body" },
        { shape: "box", position: [-0.55, 0.39, 0], args: [0.05, 0.76, 0.32], role: "frame", metalness: 0.5 },
        { shape: "box", position: [0.55, 0.39, 0], args: [0.05, 0.76, 0.32], role: "frame", metalness: 0.5 },
        { shape: "box", position: [0, 0.4, 0], args: [1.1, 0.04, 0.3], role: "frame" },
      ],
    },
  },
  {
    id: "round-dining-table",
    name: "Round Dining Table",
    category: "tables",
    size: [1.2, 0.75, 1.2],
    defaultColor: "#6b4f34",
    price: 640,
    tags: ["dining"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.73, 0], args: [0.6, 0.05, 36], role: "body" },
        { shape: "cylinder", position: [0, 0.36, 0], args: [0.08, 0.72, 16], role: "frame" },
        { shape: "cylinder", position: [0, 0.03, 0], args: [0.35, 0.05, 24], role: "frame" },
      ],
    },
  },

  // ── Storage (more) ───────────────────────────────────────
  {
    id: "dresser",
    name: "Dresser",
    category: "storage",
    size: [1.1, 0.85, 0.5],
    defaultColor: "#8a6d4b",
    price: 460,
    tags: ["bedroom"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.42, 0], args: [1.1, 0.85, 0.5], role: "body" },
        { shape: "box", position: [0, 0.2, 0.255], args: [1.0, 0.22, 0.02], role: "accent", color: "#7a5d3b" },
        { shape: "box", position: [0, 0.45, 0.255], args: [1.0, 0.22, 0.02], role: "accent", color: "#7a5d3b" },
        { shape: "box", position: [0, 0.7, 0.255], args: [1.0, 0.22, 0.02], role: "accent", color: "#7a5d3b" },
        { shape: "cylinder", position: [0, 0.2, 0.28], args: [0.02, 0.12, 8], rotation: [0, 0, 1.5708], role: "frame", metalness: 0.9 },
        { shape: "cylinder", position: [0, 0.45, 0.28], args: [0.02, 0.12, 8], rotation: [0, 0, 1.5708], role: "frame", metalness: 0.9 },
        { shape: "cylinder", position: [0, 0.7, 0.28], args: [0.02, 0.12, 8], rotation: [0, 0, 1.5708], role: "frame", metalness: 0.9 },
      ],
    },
  },
  {
    id: "sideboard",
    name: "Sideboard",
    category: "storage",
    size: [1.7, 0.75, 0.45],
    defaultColor: "#3f3f46",
    price: 540,
    tags: ["dining", "living room"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.4, 0], args: [1.7, 0.7, 0.45], role: "body" },
        { shape: "box", position: [-0.42, 0.4, 0.23], args: [0.78, 0.6, 0.02], role: "accent", color: "#52525b" },
        { shape: "box", position: [0.42, 0.4, 0.23], args: [0.78, 0.6, 0.02], role: "accent", color: "#52525b" },
        { shape: "box", position: [-0.78, 0.04, -0.16], args: [0.06, 0.1, 0.06], role: "frame", metalness: 0.6 },
        { shape: "box", position: [0.78, 0.04, -0.16], args: [0.06, 0.1, 0.06], role: "frame", metalness: 0.6 },
      ],
    },
  },
  {
    id: "cube-shelf",
    name: "Cube Shelf",
    category: "storage",
    size: [0.8, 0.8, 0.32],
    defaultColor: "#e2e8f0",
    price: 180,
    tags: ["organizer"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.4, 0], args: [0.8, 0.8, 0.32], role: "body" },
        { shape: "box", position: [0, 0.4, 0.02], args: [0.04, 0.76, 0.28], role: "accent", color: "#cbd5e1" },
        { shape: "box", position: [0, 0.4, 0.02], args: [0.76, 0.04, 0.28], role: "accent", color: "#cbd5e1" },
      ],
    },
  },

  // ── Beds (more) ──────────────────────────────────────────
  {
    id: "single-bed",
    name: "Single Bed",
    category: "beds",
    size: [1.0, 0.9, 2.0],
    defaultColor: "#94a3b8",
    price: 640,
    tags: ["bedroom", "kids"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.2, 0], args: [1.0, 0.3, 2.0], role: "frame", color: "#4b3b2a" },
        { shape: "box", position: [0, 0.45, 0.05], args: [0.96, 0.2, 1.9], role: "cushion", color: "#e2e8f0" },
        { shape: "box", position: [0, 0.8, -0.9], args: [1.0, 0.7, 0.1], role: "body" },
        { shape: "box", position: [0, 0.58, -0.78], args: [0.6, 0.14, 0.34], role: "cushion", color: "#f1f5f9" },
      ],
    },
  },
  {
    id: "crib",
    name: "Baby Crib",
    category: "beds",
    size: [0.8, 0.9, 1.4],
    defaultColor: "#f8fafc",
    price: 320,
    tags: ["nursery", "kids"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.35, 0], args: [0.8, 0.1, 1.4], role: "cushion", color: "#fde68a" },
        { shape: "box", position: [0, 0.6, -0.69], args: [0.8, 0.6, 0.04], role: "body" },
        { shape: "box", position: [0, 0.6, 0.69], args: [0.8, 0.6, 0.04], role: "body" },
        { shape: "box", position: [-0.39, 0.6, 0], args: [0.04, 0.6, 1.4], role: "body" },
        { shape: "box", position: [0.39, 0.6, 0], args: [0.04, 0.6, 1.4], role: "body" },
      ],
    },
  },

  // ── Lighting (more) ──────────────────────────────────────
  {
    id: "chandelier",
    name: "Chandelier",
    category: "lighting",
    size: [0.7, 0.6, 0.7],
    defaultColor: "#d4af37",
    price: 480,
    tags: ["ceiling", "luxury"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.55, 0], args: [0.01, 0.5, 8], role: "frame", metalness: 0.9 },
        { shape: "sphere", position: [0, 0.3, 0], args: [0.08], role: "frame", metalness: 0.9 },
        { shape: "torus", position: [0, 0.2, 0], args: [0.28, 0.02], rotation: [1.5708, 0, 0], role: "frame", metalness: 0.9 },
        { shape: "sphere", position: [0.28, 0.2, 0], args: [0.06], role: "accent", color: "#fde68a" },
        { shape: "sphere", position: [-0.28, 0.2, 0], args: [0.06], role: "accent", color: "#fde68a" },
        { shape: "sphere", position: [0, 0.2, 0.28], args: [0.06], role: "accent", color: "#fde68a" },
        { shape: "sphere", position: [0, 0.2, -0.28], args: [0.06], role: "accent", color: "#fde68a" },
      ],
    },
  },
  {
    id: "wall-sconce",
    name: "Wall Sconce",
    category: "lighting",
    size: [0.2, 0.35, 0.2],
    defaultColor: "#1f2937",
    price: 75,
    tags: ["wall", "ambient"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0, -0.08], args: [0.1, 0.2, 0.04], role: "frame", metalness: 0.6 },
        { shape: "cone", position: [0, 0.1, 0], args: [0.1, 0.2, 20], role: "accent", color: "#fef3c7" },
      ],
    },
  },

  // ── Decor (more) ─────────────────────────────────────────
  {
    id: "wall-clock",
    name: "Wall Clock",
    category: "decor",
    size: [0.4, 0.4, 0.05],
    defaultColor: "#0f172a",
    price: 55,
    tags: ["wall"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0, 0], args: [0.2, 0.04, 32], rotation: [1.5708, 0, 0], role: "frame" },
        { shape: "cylinder", position: [0, 0, 0.025], args: [0.17, 0.01, 32], rotation: [1.5708, 0, 0], role: "accent", color: "#f8fafc" },
        { shape: "box", position: [0, 0.06, 0.035], args: [0.012, 0.12, 0.01], role: "body", color: "#0f172a" },
        { shape: "box", position: [0.05, 0, 0.035], args: [0.09, 0.012, 0.01], role: "body", color: "#0f172a" },
      ],
    },
  },
  {
    id: "stacked-books",
    name: "Stacked Books",
    category: "decor",
    size: [0.3, 0.2, 0.22],
    defaultColor: "#9f1239",
    price: 25,
    tags: ["tabletop", "shelf"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.03, 0], args: [0.3, 0.05, 0.22], role: "body" },
        { shape: "box", position: [0.01, 0.085, 0.01], args: [0.28, 0.05, 0.2], role: "accent", color: "#1e3a5f" },
        { shape: "box", position: [-0.01, 0.14, 0], args: [0.26, 0.05, 0.21], role: "accent", color: "#b45309" },
      ],
    },
  },
  {
    id: "candle-set",
    name: "Candle Set",
    category: "decor",
    size: [0.3, 0.25, 0.15],
    defaultColor: "#e7e5e4",
    price: 35,
    tags: ["tabletop"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [-0.08, 0.11, 0], args: [0.04, 0.22, 18], role: "body" },
        { shape: "cylinder", position: [0.0, 0.08, 0], args: [0.04, 0.16, 18], role: "body" },
        { shape: "cylinder", position: [0.08, 0.06, 0], args: [0.04, 0.12, 18], role: "body" },
        { shape: "sphere", position: [-0.08, 0.24, 0], args: [0.015], role: "accent", color: "#f59e0b" },
        { shape: "sphere", position: [0.0, 0.18, 0], args: [0.015], role: "accent", color: "#f59e0b" },
        { shape: "sphere", position: [0.08, 0.14, 0], args: [0.015], role: "accent", color: "#f59e0b" },
      ],
    },
  },

  // ── Rugs (more) ──────────────────────────────────────────
  {
    id: "runner-rug",
    name: "Runner Rug",
    category: "rugs",
    size: [0.8, 0.04, 2.6],
    defaultColor: "#0f766e",
    price: 160,
    tags: ["hallway", "floor"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.02, 0], args: [0.8, 0.03, 2.6], role: "body", roughness: 1 },
        { shape: "box", position: [0, 0.031, 0], args: [0.66, 0.005, 2.4], role: "accent", color: "#0d9488", roughness: 1 },
      ],
    },
  },

  // ── Kitchen ──────────────────────────────────────────────
  {
    id: "kitchen-island",
    name: "Kitchen Island",
    category: "kitchen",
    size: [1.8, 0.9, 0.9],
    defaultColor: "#e5e7eb",
    price: 1450,
    tags: ["kitchen", "counter"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.43, 0], args: [1.8, 0.85, 0.9], role: "body" },
        { shape: "box", position: [0, 0.88, 0], args: [1.9, 0.06, 1.0], role: "accent", color: "#1f2937", roughness: 0.3, metalness: 0.2 },
        { shape: "box", position: [-0.4, 0.45, 0.46], args: [0.7, 0.6, 0.02], role: "accent", color: "#d1d5db" },
        { shape: "box", position: [0.4, 0.45, 0.46], args: [0.7, 0.6, 0.02], role: "accent", color: "#d1d5db" },
      ],
    },
  },
  {
    id: "refrigerator",
    name: "Refrigerator",
    category: "kitchen",
    size: [0.8, 1.9, 0.75],
    defaultColor: "#cbd5e1",
    price: 1200,
    tags: ["kitchen", "appliance"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.95, 0], args: [0.8, 1.9, 0.75], role: "body", metalness: 0.5, roughness: 0.3 },
        { shape: "box", position: [0, 1.35, 0.38], args: [0.76, 1.05, 0.02], role: "accent", color: "#94a3b8" },
        { shape: "box", position: [0, 0.45, 0.38], args: [0.76, 0.78, 0.02], role: "accent", color: "#94a3b8" },
        { shape: "box", position: [-0.32, 1.35, 0.42], args: [0.04, 0.4, 0.04], role: "frame", metalness: 0.9 },
        { shape: "box", position: [-0.32, 0.45, 0.42], args: [0.04, 0.3, 0.04], role: "frame", metalness: 0.9 },
      ],
    },
  },
  {
    id: "range-stove",
    name: "Range & Stove",
    category: "kitchen",
    size: [0.8, 0.9, 0.7],
    defaultColor: "#1f2937",
    price: 880,
    tags: ["kitchen", "appliance"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.42, 0], args: [0.8, 0.85, 0.7], role: "body", metalness: 0.4 },
        { shape: "box", position: [0, 0.86, 0], args: [0.82, 0.04, 0.72], role: "accent", color: "#0f172a" },
        { shape: "cylinder", position: [-0.18, 0.89, -0.15], args: [0.1, 0.01, 20], role: "frame", color: "#52525b" },
        { shape: "cylinder", position: [0.18, 0.89, -0.15], args: [0.1, 0.01, 20], role: "frame", color: "#52525b" },
        { shape: "cylinder", position: [-0.18, 0.89, 0.15], args: [0.1, 0.01, 20], role: "frame", color: "#52525b" },
        { shape: "cylinder", position: [0.18, 0.89, 0.15], args: [0.1, 0.01, 20], role: "frame", color: "#52525b" },
        { shape: "box", position: [0, 0.35, 0.36], args: [0.7, 0.5, 0.02], role: "accent", color: "#374151" },
      ],
    },
  },

  // ── Bathroom ─────────────────────────────────────────────
  {
    id: "bathtub",
    name: "Bathtub",
    category: "bathroom",
    size: [1.7, 0.6, 0.8],
    defaultColor: "#f8fafc",
    price: 920,
    tags: ["bathroom"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.3, 0], args: [1.7, 0.6, 0.8], role: "body", roughness: 0.2 },
        { shape: "box", position: [0, 0.42, 0], args: [1.5, 0.4, 0.6], role: "accent", color: "#e2e8f0", roughness: 0.1 },
        { shape: "cylinder", position: [-0.75, 0.55, 0], args: [0.03, 0.18, 12], rotation: [0, 0, 1.5708], role: "frame", metalness: 0.9 },
      ],
    },
  },
  {
    id: "toilet",
    name: "Toilet",
    category: "bathroom",
    size: [0.4, 0.8, 0.65],
    defaultColor: "#f8fafc",
    price: 280,
    tags: ["bathroom"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.2, -0.22], args: [0.36, 0.4, 0.2], role: "body" },
        { shape: "box", position: [0, 0.55, -0.28], args: [0.4, 0.4, 0.12], role: "body" },
        { shape: "cylinder", position: [0, 0.42, 0.05], args: [0.18, 0.1, 24], role: "body" },
        { shape: "cylinder", position: [0, 0.48, 0.05], args: [0.19, 0.04, 24], role: "accent", color: "#e2e8f0" },
      ],
    },
  },
  {
    id: "vanity-sink",
    name: "Vanity Sink",
    category: "bathroom",
    size: [0.8, 0.85, 0.5],
    defaultColor: "#8a6d4b",
    price: 420,
    tags: ["bathroom"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.4, 0], args: [0.8, 0.8, 0.5], role: "body" },
        { shape: "box", position: [0, 0.82, 0], args: [0.84, 0.06, 0.54], role: "accent", color: "#f1f5f9", roughness: 0.2 },
        { shape: "cylinder", position: [0, 0.83, 0], args: [0.16, 0.05, 24], role: "accent", color: "#e2e8f0" },
        { shape: "cylinder", position: [0, 0.92, -0.16], args: [0.015, 0.12, 10], role: "frame", metalness: 0.9 },
      ],
    },
  },

  // ── Outdoor ──────────────────────────────────────────────
  {
    id: "patio-chair",
    name: "Patio Chair",
    category: "outdoor",
    size: [0.6, 0.8, 0.6],
    defaultColor: "#0f766e",
    price: 130,
    tags: ["outdoor", "garden"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.4, 0], args: [0.56, 0.08, 0.56], role: "cushion" },
        { shape: "box", position: [0, 0.62, -0.26], args: [0.56, 0.44, 0.06], role: "cushion" },
        { shape: "cylinder", position: [-0.24, 0.2, -0.24], args: [0.025, 0.4, 10], role: "frame", metalness: 0.7 },
        { shape: "cylinder", position: [0.24, 0.2, -0.24], args: [0.025, 0.4, 10], role: "frame", metalness: 0.7 },
        { shape: "cylinder", position: [-0.24, 0.2, 0.24], args: [0.025, 0.4, 10], role: "frame", metalness: 0.7 },
        { shape: "cylinder", position: [0.24, 0.2, 0.24], args: [0.025, 0.4, 10], role: "frame", metalness: 0.7 },
      ],
    },
  },
  {
    id: "parasol",
    name: "Garden Parasol",
    category: "outdoor",
    size: [2.0, 2.3, 2.0],
    defaultColor: "#dc2626",
    price: 190,
    tags: ["outdoor", "shade"],
    primitive: {
      parts: [
        { shape: "cylinder", position: [0, 0.04, 0], args: [0.3, 0.08, 24], role: "frame", color: "#334155" },
        { shape: "cylinder", position: [0, 1.1, 0], args: [0.03, 2.1, 12], role: "frame", color: "#52525b" },
        { shape: "cone", position: [0, 2.1, 0], args: [1.0, 0.45, 32], role: "body" },
      ],
    },
  },
  {
    id: "bbq-grill",
    name: "BBQ Grill",
    category: "outdoor",
    size: [0.9, 1.1, 0.6],
    defaultColor: "#1f2937",
    price: 340,
    tags: ["outdoor", "cooking"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.6, 0], args: [0.8, 0.35, 0.55], role: "body", metalness: 0.5 },
        { shape: "cylinder", position: [0, 0.82, 0], args: [0.42, 0.4, 24, ], rotation: [1.5708, 0, 0], role: "accent", color: "#0f172a", metalness: 0.6 },
        { shape: "cylinder", position: [-0.3, 0.2, -0.18], args: [0.02, 0.42, 10], role: "frame", metalness: 0.7 },
        { shape: "cylinder", position: [0.3, 0.2, -0.18], args: [0.02, 0.42, 10], role: "frame", metalness: 0.7 },
        { shape: "cylinder", position: [0, 0.2, 0.2], args: [0.02, 0.42, 10], role: "frame", metalness: 0.7 },
      ],
    },
  },

  // ── Electronics ──────────────────────────────────────────
  {
    id: "flat-tv",
    name: 'Flat-Screen TV (55")',
    category: "electronics",
    size: [1.25, 0.8, 0.12],
    defaultColor: "#0a0a0a",
    price: 650,
    tags: ["media", "living room"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.55, 0], args: [1.25, 0.72, 0.05], role: "body", roughness: 0.3 },
        { shape: "box", position: [0, 0.55, 0.03], args: [1.18, 0.66, 0.01], role: "accent", color: "#1e293b", roughness: 0.1 },
        { shape: "box", position: [0, 0.12, 0], args: [0.3, 0.24, 0.18], role: "frame", color: "#27272a" },
        { shape: "box", position: [0, 0.02, 0], args: [0.5, 0.04, 0.22], role: "frame", color: "#27272a" },
      ],
    },
  },
  {
    id: "desktop-computer",
    name: "Desktop Computer",
    category: "electronics",
    size: [0.6, 0.5, 0.3],
    defaultColor: "#18181b",
    price: 1100,
    tags: ["office", "media"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.3, 0], args: [0.55, 0.34, 0.04], role: "body" },
        { shape: "box", position: [0, 0.3, 0.025], args: [0.5, 0.29, 0.01], role: "accent", color: "#0ea5e9", roughness: 0.1 },
        { shape: "cylinder", position: [0, 0.08, 0], args: [0.03, 0.16, 12], role: "frame", metalness: 0.7 },
        { shape: "box", position: [0, 0.01, 0], args: [0.22, 0.02, 0.16], role: "frame", metalness: 0.7 },
      ],
    },
  },
  {
    id: "floor-speaker",
    name: "Floor Speaker",
    category: "electronics",
    size: [0.3, 1.0, 0.3],
    defaultColor: "#27272a",
    price: 380,
    tags: ["media", "audio"],
    primitive: {
      parts: [
        { shape: "box", position: [0, 0.5, 0], args: [0.28, 1.0, 0.28], role: "body" },
        { shape: "cylinder", position: [0, 0.75, 0.14], args: [0.09, 0.01, 24], rotation: [1.5708, 0, 0], role: "accent", color: "#0a0a0a" },
        { shape: "cylinder", position: [0, 0.45, 0.14], args: [0.11, 0.01, 24], rotation: [1.5708, 0, 0], role: "accent", color: "#0a0a0a" },
      ],
    },
  },
];

export const FURNITURE_BY_ID = new Map(FURNITURE.map((f) => [f.id, f]));

export function getTemplate(id: string): FurnitureTemplate | undefined {
  return FURNITURE_BY_ID.get(id);
}

export const CATEGORIES = Object.keys(CATEGORY_META) as FurnitureCategory[];
