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
  {
    id: "kitchen-diner",
    name: "Kitchen & Diner",
    description: "Island, full appliances, and a connected dining nook.",
    accent: "#f97316",
    room: { width: 6, depth: 5, height: 2.8, wallColor: "#eef0f2", floorColor: "#cbd5e1", floorMaterial: "tile" },
    lighting: { timeOfDay: 0.45, ambient: 0.85, directional: 1.1 },
    objects: [
      { templateId: "kitchen-island", position: [-1.0, 0, -0.8] },
      { templateId: "range-stove", position: [0.6, 0, -2.1] },
      { templateId: "refrigerator", position: [2.4, 0, -1.9] },
      { templateId: "bar-stool", position: [-1.6, 0, 0.2] },
      { templateId: "bar-stool", position: [-0.5, 0, 0.2] },
      { templateId: "dining-table", position: [1.4, 0, 1.3] },
      { templateId: "dining-chair", position: [0.9, 0, 0.6], rotation: [0, 0, 0] },
      { templateId: "dining-chair", position: [1.9, 0, 0.6], rotation: [0, 0, 0] },
      { templateId: "dining-chair", position: [0.9, 0, 2.0], rotation: [0, P, 0] },
      { templateId: "dining-chair", position: [1.9, 0, 2.0], rotation: [0, P, 0] },
      { templateId: "pendant-light", position: [1.4, 2.3, 1.3] },
      { templateId: "plant-tall", position: [2.6, 0, 2.0] },
    ],
  },
  {
    id: "spa-bathroom",
    name: "Spa Bathroom",
    description: "Freestanding tub, vanity, and calming greenery.",
    accent: "#38bdf8",
    room: { width: 3.5, depth: 3, height: 2.6, wallColor: "#e8eef0", floorColor: "#b8c4c9", floorMaterial: "tile" },
    lighting: { timeOfDay: 0.5, ambient: 0.9 },
    objects: [
      { templateId: "bathtub", position: [0, 0, -1.0] },
      { templateId: "vanity-sink", position: [1.4, 0, 0.5], rotation: [0, -P / 2, 0] },
      { templateId: "mirror", position: [1.71, 1.5, 0.5], rotation: [0, -P / 2, 0] },
      { templateId: "wall-sconce", position: [1.71, 1.75, 0.0], rotation: [0, -P / 2, 0] },
      { templateId: "wall-sconce", position: [1.71, 1.75, 1.0], rotation: [0, -P / 2, 0] },
      { templateId: "toilet", position: [-1.35, 0, 0.6], rotation: [0, P / 2, 0] },
      { templateId: "plant-tall", position: [-1.2, 0, -1.0] },
      { templateId: "rug-round", position: [0.2, 0, 0.7], scale: 0.5 },
    ],
  },
  {
    id: "garden-patio",
    name: "Garden Patio",
    description: "Shaded dining set, grill, and lush planters outdoors.",
    accent: "#84cc16",
    room: { width: 5, depth: 5, height: 2.8, wallColor: "#d9e2d0", floorColor: "#9aa0a6", floorMaterial: "concrete" },
    lighting: { timeOfDay: 0.5, ambient: 1.0, directional: 1.4 },
    objects: [
      { templateId: "parasol", position: [0.6, 0, 0.4] },
      { templateId: "round-dining-table", position: [0.6, 0, 0.4] },
      { templateId: "patio-chair", position: [-0.4, 0, 0.4], rotation: [0, P / 2, 0] },
      { templateId: "patio-chair", position: [1.6, 0, 0.4], rotation: [0, -P / 2, 0] },
      { templateId: "patio-chair", position: [0.6, 0, -0.6], rotation: [0, 0, 0] },
      { templateId: "patio-chair", position: [0.6, 0, 1.4], rotation: [0, P, 0] },
      { templateId: "bbq-grill", position: [-1.8, 0, -1.8], rotation: [0, P / 4, 0] },
      { templateId: "bench", position: [1.7, 0, -2.0] },
      { templateId: "plant-tall", position: [-1.9, 0, 1.8] },
      { templateId: "plant-tall", position: [2.0, 0, 1.9] },
    ],
  },
  {
    id: "home-theater",
    name: "Home Theater",
    description: "Big screen, deep seating, and moody low light.",
    accent: "#e879f9",
    room: { width: 6, depth: 5, height: 2.8, wallColor: "#1f2433", floorColor: "#3a2e2a", floorMaterial: "carpet" },
    lighting: { timeOfDay: 0.92, ambient: 0.4, directional: 0.45 },
    objects: [
      { templateId: "tv-stand", position: [0, 0, -2.2] },
      { templateId: "flat-tv", position: [0, 0.5, -2.2] },
      { templateId: "sofa-3seat", position: [0, 0, 1.2], rotation: [0, P, 0] },
      { templateId: "armchair", position: [-2.0, 0, 0.5], rotation: [0, P / 3, 0] },
      { templateId: "armchair", position: [2.0, 0, 0.5], rotation: [0, -P / 3, 0] },
      { templateId: "coffee-table", position: [0, 0, -0.1] },
      { templateId: "floor-speaker", position: [-2.5, 0, -1.9] },
      { templateId: "floor-speaker", position: [2.5, 0, -1.9] },
      { templateId: "rug-rect", position: [0, 0, 0.3] },
      { templateId: "floor-lamp", position: [2.4, 0, 1.7] },
    ],
  },
  {
    id: "studio-apartment",
    name: "Studio Apartment",
    description: "Sleep, lounge, kitchen, and work zones in one open space.",
    accent: "#22d3ee",
    room: { width: 7, depth: 6, height: 2.9, wallColor: "#e7e2d9", floorColor: "#a17c4e", floorMaterial: "wood" },
    lighting: { timeOfDay: 0.5, ambient: 0.8 },
    objects: [
      { templateId: "bed-queen", position: [-2.1, 0, -2.3] },
      { templateId: "nightstand", position: [-3.1, 0, -2.5] },
      { templateId: "sofa-3seat", position: [1.4, 0, 1.6], rotation: [0, P, 0] },
      { templateId: "coffee-table", position: [1.4, 0, 0.6] },
      { templateId: "tv-stand", position: [1.4, 0, -2.6] },
      { templateId: "flat-tv", position: [1.4, 0.5, -2.6] },
      { templateId: "kitchen-island", position: [-2.4, 0, 1.6], rotation: [0, P / 2, 0] },
      { templateId: "bar-stool", position: [-1.4, 0, 1.6] },
      { templateId: "desk", position: [3.0, 0, 0], rotation: [0, -P / 2, 0] },
      { templateId: "dining-chair", position: [2.3, 0, 0], rotation: [0, -P / 2, 0] },
      { templateId: "rug-rect", position: [1.4, 0, 1.1] },
      { templateId: "plant-tall", position: [3.0, 0, 2.5] },
    ],
  },
];
