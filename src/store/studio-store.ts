"use client";

import { create } from "zustand";
import type {
  SceneObject,
  RoomConfig,
  LightingConfig,
  TransformMode,
  CameraPreset,
  RoomAnalysis,
  SavedProject,
  Vec3,
} from "@/types";
import { getTemplate } from "@/lib/furniture-data";
import { uid, clamp, snap as snapVal } from "@/lib/utils";

const STORAGE_KEY = "spaceai:autosave";

const DEFAULT_ROOM: RoomConfig = {
  width: 6,
  depth: 5,
  height: 2.8,
  wallColor: "#e8e4dc",
  floorColor: "#b08d57",
  floorMaterial: "wood",
};

const DEFAULT_LIGHTING: LightingConfig = {
  ambient: 0.7,
  directional: 1.0,
  timeOfDay: 0.5,
  shadows: true,
};

interface HistoryEntry {
  room: RoomConfig;
  objects: SceneObject[];
  lighting: LightingConfig;
}

interface StudioState {
  // scene
  room: RoomConfig;
  objects: SceneObject[];
  lighting: LightingConfig;

  // editor ui
  selectedId: string | null;
  transformMode: TransformMode;
  cameraPreset: CameraPreset;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;

  // project / ai
  projectName: string;
  photoUrl: string | null;
  analysis: RoomAnalysis | null;

  // history
  past: HistoryEntry[];
  future: HistoryEntry[];

  // ── actions ──
  addObject: (templateId: string, position?: Vec3) => void;
  removeObject: (uid: string) => void;
  duplicateObject: (uid: string) => void;
  updateObject: (uid: string, patch: Partial<SceneObject>) => void;
  select: (uid: string | null) => void;
  setTransformMode: (m: TransformMode) => void;
  setCameraPreset: (p: CameraPreset) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;

  setRoom: (patch: Partial<RoomConfig>) => void;
  setLighting: (patch: Partial<LightingConfig>) => void;
  setProjectName: (name: string) => void;
  setPhotoUrl: (url: string | null) => void;
  setAnalysis: (a: RoomAnalysis | null) => void;
  applyAnalysisDimensions: (a: RoomAnalysis) => void;

  autoArrange: () => void;
  clearScene: () => void;
  loadProject: (p: SavedProject) => void;
  serialize: () => SavedProject;

  undo: () => void;
  redo: () => void;
  commit: () => void; // push current state to history

  hydrate: () => void;
  persist: () => void;
}

function snapshot(s: StudioState): HistoryEntry {
  return {
    room: { ...s.room },
    objects: s.objects.map((o) => ({ ...o })),
    lighting: { ...s.lighting },
  };
}

export const useStudio = create<StudioState>((set, get) => ({
  room: DEFAULT_ROOM,
  objects: [],
  lighting: DEFAULT_LIGHTING,

  selectedId: null,
  transformMode: "translate",
  cameraPreset: "perspective",
  showGrid: true,
  snapToGrid: true,
  gridSize: 0.25,

  projectName: "Untitled Room",
  photoUrl: null,
  analysis: null,

  past: [],
  future: [],

  commit: () => {
    const s = get();
    set({ past: [...s.past, snapshot(s)].slice(-50), future: [] });
  },

  addObject: (templateId, position) => {
    const tpl = getTemplate(templateId);
    if (!tpl) return;
    get().commit();
    const s = get();
    // place near center, nudged so stacked adds don't overlap perfectly
    const jitter = (s.objects.length % 5) * 0.3 - 0.6;
    const pos: Vec3 = position ?? [jitter, 0, jitter];
    const obj: SceneObject = {
      uid: uid("obj"),
      templateId,
      name: tpl.name,
      category: tpl.category,
      position: pos,
      rotation: [0, 0, 0],
      scale: 1,
      color: tpl.defaultColor,
    };
    set({ objects: [...s.objects, obj], selectedId: obj.uid });
    get().persist();
  },

  removeObject: (id) => {
    get().commit();
    set((s) => ({
      objects: s.objects.filter((o) => o.uid !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
    get().persist();
  },

  duplicateObject: (id) => {
    const src = get().objects.find((o) => o.uid === id);
    if (!src) return;
    get().commit();
    const copy: SceneObject = {
      ...src,
      uid: uid("obj"),
      position: [src.position[0] + 0.4, src.position[1], src.position[2] + 0.4],
    };
    set((s) => ({ objects: [...s.objects, copy], selectedId: copy.uid }));
    get().persist();
  },

  updateObject: (id, patch) => {
    set((s) => ({
      objects: s.objects.map((o) => (o.uid === id ? { ...o, ...patch } : o)),
    }));
    get().persist();
  },

  select: (id) => set({ selectedId: id }),
  setTransformMode: (m) => set({ transformMode: m }),
  setCameraPreset: (p) => set({ cameraPreset: p }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),

  setRoom: (patch) => {
    get().commit();
    set((s) => ({ room: { ...s.room, ...patch } }));
    get().persist();
  },

  setLighting: (patch) => {
    set((s) => ({ lighting: { ...s.lighting, ...patch } }));
    get().persist();
  },

  setProjectName: (name) => {
    set({ projectName: name });
    get().persist();
  },

  setPhotoUrl: (url) => {
    set({ photoUrl: url });
    get().persist();
  },

  setAnalysis: (a) => {
    set({ analysis: a });
    get().persist();
  },

  applyAnalysisDimensions: (a) => {
    get().commit();
    set((s) => ({
      room: {
        ...s.room,
        width: clamp(a.dimensions.width, 2, 12),
        depth: clamp(a.dimensions.depth, 2, 12),
        height: clamp(a.dimensions.height, 2, 4),
        wallColor: a.dominantColors[0] ?? s.room.wallColor,
      },
      analysis: a,
    }));
    get().persist();
  },

  // Naive but pleasant auto-layout: hug walls for big items, center the rug,
  // float the coffee table near the sofa. Demonstrates "AI arranges layout".
  autoArrange: () => {
    get().commit();
    const { objects, room } = get();
    const halfW = room.width / 2 - 0.6;
    const halfD = room.depth / 2 - 0.6;
    const arranged = objects.map((o) => {
      const next = { ...o };
      switch (o.category) {
        case "rugs":
          next.position = [0, 0, 0];
          next.rotation = [0, 0, 0];
          break;
        case "seating":
          next.position = [0, 0, halfD];
          next.rotation = [0, Math.PI, 0];
          break;
        case "tables":
          next.position = o.templateId === "coffee-table" ? [0, 0, halfD - 1.2] : [0, 0, -halfD + 1.4];
          next.rotation = [0, 0, 0];
          break;
        case "storage":
          next.position = [-halfW, 0, 0];
          next.rotation = [0, Math.PI / 2, 0];
          break;
        case "beds":
          next.position = [0, 0, -halfD + 0.2];
          next.rotation = [0, 0, 0];
          break;
        case "plants":
          next.position = [halfW, 0, -halfD];
          break;
        case "lighting":
          next.position = [halfW - 0.3, 0, halfD - 0.3];
          break;
        default:
          break;
      }
      return next;
    });
    set({ objects: arranged });
    get().persist();
  },

  clearScene: () => {
    get().commit();
    set({ objects: [], selectedId: null });
    get().persist();
  },

  loadProject: (p) => {
    set({
      projectName: p.name,
      room: p.room,
      objects: p.objects,
      lighting: p.lighting,
      analysis: p.analysis ?? null,
      photoUrl: p.photoUrl ?? null,
      selectedId: null,
      past: [],
      future: [],
    });
    get().persist();
  },

  serialize: () => {
    const s = get();
    return {
      id: uid("proj"),
      name: s.projectName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      photoUrl: s.photoUrl ?? undefined,
      room: s.room,
      objects: s.objects,
      lighting: s.lighting,
      analysis: s.analysis,
    };
  },

  undo: () => {
    const s = get();
    if (s.past.length === 0) return;
    const prev = s.past[s.past.length - 1];
    set({
      past: s.past.slice(0, -1),
      future: [snapshot(s), ...s.future].slice(0, 50),
      room: prev.room,
      objects: prev.objects,
      lighting: prev.lighting,
      selectedId: null,
    });
    get().persist();
  },

  redo: () => {
    const s = get();
    if (s.future.length === 0) return;
    const next = s.future[0];
    set({
      future: s.future.slice(1),
      past: [...s.past, snapshot(s)].slice(-50),
      room: next.room,
      objects: next.objects,
      lighting: next.lighting,
      selectedId: null,
    });
    get().persist();
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw) as SavedProject;
      set({
        projectName: p.name ?? "Untitled Room",
        room: { ...DEFAULT_ROOM, ...p.room },
        objects: Array.isArray(p.objects) ? p.objects : [],
        lighting: { ...DEFAULT_LIGHTING, ...p.lighting },
        analysis: p.analysis ?? null,
        photoUrl: p.photoUrl ?? null,
      });
    } catch {
      /* corrupt autosave — ignore */
    }
  },

  persist: () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(get().serialize()));
    } catch {
      /* quota / serialization issues — non-fatal */
    }
  },
}));

/** Apply snap-to-grid using current settings (used by drag handlers). */
export function applySnap(pos: Vec3): Vec3 {
  const { snapToGrid, gridSize } = useStudio.getState();
  if (!snapToGrid) return pos;
  return [snapVal(pos[0], gridSize), pos[1], snapVal(pos[2], gridSize)];
}
