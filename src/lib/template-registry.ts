import type { FurnitureTemplate, PrimitiveSpec, Vec3, FurnitureCategory } from "@/types";
import { FURNITURE_BY_ID } from "./furniture-data";

// A runtime registry that unifies the built-in catalog with user-added custom
// templates. Placed objects reference a templateId; this resolves it from either
// source so the rest of the app doesn't care where a template came from.

const custom = new Map<string, FurnitureTemplate>();

export function registerCustomTemplate(t: FurnitureTemplate): void {
  custom.set(t.id, t);
}

export function unregisterCustomTemplate(id: string): void {
  custom.delete(id);
}

/** Resolve a template by id from built-ins first, then custom uploads. */
export function resolveTemplate(id: string): FurnitureTemplate | undefined {
  return FURNITURE_BY_ID.get(id) ?? custom.get(id);
}

/** A simple box primitive used as the load-failure fallback for custom models. */
export function fallbackPrimitive(size: Vec3): PrimitiveSpec {
  return {
    parts: [
      {
        shape: "box",
        position: [0, size[1] / 2, 0],
        args: [size[0], size[1], size[2]],
        role: "body",
      },
    ],
  };
}

/** Build a FurnitureTemplate for a custom (GLTF) model. */
export function buildCustomTemplate(opts: {
  id: string;
  name: string;
  category: FurnitureCategory;
  size: Vec3;
  modelUrl: string;
  defaultColor?: string;
}): FurnitureTemplate {
  return {
    id: opts.id,
    name: opts.name,
    category: opts.category,
    size: opts.size,
    modelUrl: opts.modelUrl,
    defaultColor: opts.defaultColor ?? "#94a3b8",
    tags: ["custom"],
    primitive: fallbackPrimitive(opts.size),
  };
}
