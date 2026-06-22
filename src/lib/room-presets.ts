import type { RoomConfig, LightingConfig, Vec3 } from "@/types";

// Curated starter rooms: each sets dimensions, palette, lighting, and a sensible
// furniture arrangement so a user can begin from a designed space in one click.
// Coordinates are in meters, centered on the origin; Y is up, floor at y=0.

export interface PresetObject {
  templateId: string;
  position: Vec3;
  rotation?: Vec3;
  scale?: number;
  color?: string;
}

export interface RoomPreset {
  id: string;
  name: string;
  description: string;
  accent: string; // swatch shown on the card
  room: RoomConfig;
  lighting?: Partial<LightingConfig>;
  objects: PresetObject[];
}

const P = Math.PI;

export const ROOM_PRESETS: RoomPreset[] = [
  {
    id: "living-modern",
    name: "Modern Living Room",
    description: "Floating sofa, media console, and a warm reading corner.",
    accent: "#3366ff",
    room: { width: 6, depth: 5, height: 2.8, wallColor: "#e8e4dc", floorColor: "#b08d57", floorMaterial: "wood" },
    lighting: { timeOfDay: 0.45, ambient: 0.75 },
    objects: [
      { templateId: "rug-rect", position: [0, 0, 0.4] },
      { templateId: "sofa-3seat", position: [0, 0, 1.7], rotation: [0, P, 0], color: "#5b6472" },
      { templateId: "coffee-table", position: [0, 0, 0.5] },
      { templateId: "tv-stand", position: [0, 0, -2.15] },
      { templateId: "armchair", position: [-2.1, 0, 0.6], rotation: [0, P / 2.4, 0], color: "#b45309" },
      { templateId: "side-table", position: [1.9, 0, 1.7] },
      { templateId: "floor-lamp", position: [2.3, 0, 1.7] },
      { templateId: "plant-tall", position: [2.3, 0, -2.0] },
      { templateId: "wall-art", position: [0, 1.6, -2.46], color: "#0ea5e9" },
    ],
  },
  {
    id: "bedroom-cozy",
    name: "Cozy Bedroom",
    description: "Queen bed with symmetric nightstands and soft evening light.",
    accent: "#f472b6",
    room: { width: 5, depth: 4.5, height: 2.8, wallColor: "#ded9cf", floorColor: "#8a6d4b", floorMaterial: "wood" },
    lighting: { timeOfDay: 0.82, ambient: 0.6, directional: 0.7 },
    objects: [
      { templateId: "rug-round", position: [0, 0, 0.9] },
      { templateId: "bed-queen", position: [0, 0, -1.3] },
      { templateId: "nightstand", position: [-1.15, 0, -1.55] },
      { templateId: "nightstand", position: [1.15, 0, -1.55] },
      { templateId: "table-lamp", position: [-1.15, 0.5, -1.55] },
      { templateId: "table-lamp", position: [1.15, 0.5, -1.55] },
      { templateId: "wardrobe", position: [2.1, 0, 0.6], rotation: [0, -P / 2, 0] },
      { templateId: "plant-tall", position: [-2.0, 0, 1.4] },
      { templateId: "mirror", position: [0, 1.5, -2.2], color: "#cbd5e1" },
    ],
  },
  {
    id: "office-focus",
    name: "Home Office",
    description: "Desk against the wall, shelving, and plenty of greenery.",
    accent: "#34d399",
    room: { width: 4.5, depth: 4, height: 2.8, wallColor: "#eef0f2", floorColor: "#9aa0a6", floorMaterial: "concrete" },
    lighting: { timeOfDay: 0.4, ambient: 0.85, directional: 1.1 },
    objects: [
      { templateId: "rug-rect", position: [0, 0, 0.4], scale: 0.8 },
      { templateId: "desk", position: [0, 0, -1.3] },
      { templateId: "dining-chair", position: [0, 0, -0.5], rotation: [0, P, 0], color: "#1f2937" },
      { templateId: "bookshelf", position: [-1.9, 0, 0.2], rotation: [0, P / 2, 0] },
      { templateId: "plant-tall", position: [1.7, 0, -1.4] },
      { templateId: "floor-lamp", position: [1.6, 0, 1.1] },
      { templateId: "wall-art", position: [0, 1.55, -1.96], color: "#f59e0b" },
      { templateId: "plant-small", position: [0.5, 0.75, -1.3] },
    ],
  },
  {
    id: "dining-social",
    name: "Dining Room",
    description: "Six-seat table under a pendant, with a sideboard.",
    accent: "#fbbf24",
    room: { width: 5.5, depth: 4.5, height: 2.9, wallColor: "#e7ded2", floorColor: "#6b4f34", floorMaterial: "wood" },
    lighting: { timeOfDay: 0.6, ambient: 0.7 },
    objects: [
      { templateId: "rug-rect", position: [0, 0, 0], scale: 1.1 },
      { templateId: "dining-table", position: [0, 0, 0] },
      { templateId: "dining-chair", position: [-0.6, 0, -0.78], rotation: [0, 0, 0] },
      { templateId: "dining-chair", position: [0.6, 0, -0.78], rotation: [0, 0, 0] },
      { templateId: "dining-chair", position: [-0.6, 0, 0.78], rotation: [0, P, 0] },
      { templateId: "dining-chair", position: [0.6, 0, 0.78], rotation: [0, P, 0] },
      { templateId: "dining-chair", position: [-1.15, 0, 0], rotation: [0, P / 2, 0] },
      { templateId: "dining-chair", position: [1.15, 0, 0], rotation: [0, -P / 2, 0] },
      { templateId: "pendant-light", position: [0, 2.35, 0] },
      { templateId: "tv-stand", position: [0, 0, -2.0], color: "#3f3f46" },
      { templateId: "vase", position: [0, 0.79, 0], color: "#f5f5f4" },
    ],
  },
];
