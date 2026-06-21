"use client";

import { create } from "zustand";
import type { FurnitureTemplate, FurnitureCategory, Vec3 } from "@/types";
import { idbPutModel, idbGetModel, idbDeleteModel } from "@/lib/idb";
import {
  buildCustomTemplate,
  registerCustomTemplate,
  unregisterCustomTemplate,
} from "@/lib/template-registry";
import { uid } from "@/lib/utils";

const META_KEY = "spaceai:custom-furniture";
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB upload guard

/** Persisted metadata (the heavy model bytes live in IndexedDB or a remote URL). */
interface CustomMeta {
  id: string;
  name: string;
  category: FurnitureCategory;
  size: Vec3;
  defaultColor?: string;
  source: "idb" | "url";
  url?: string; // present when source === "url"
}

interface CustomFurnitureState {
  templates: FurnitureTemplate[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addFromFile: (
    file: File,
    meta: { name: string; category: FurnitureCategory; size: Vec3 },
  ) => Promise<void>;
  addFromUrl: (
    url: string,
    meta: { name: string; category: FurnitureCategory; size: Vec3 },
  ) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

function readMetas(): CustomMeta[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(META_KEY) ?? "[]") as CustomMeta[];
  } catch {
    return [];
  }
}

function writeMetas(metas: CustomMeta[]): void {
  localStorage.setItem(META_KEY, JSON.stringify(metas));
}

export const useCustomFurniture = create<CustomFurnitureState>((set, get) => ({
  templates: [],
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    const metas = readMetas();
    const templates: FurnitureTemplate[] = [];
    for (const m of metas) {
      try {
        let modelUrl: string;
        if (m.source === "url" && m.url) {
          modelUrl = m.url;
        } else {
          const blob = await idbGetModel(m.id);
          if (!blob) continue; // bytes gone — skip stale metadata
          modelUrl = URL.createObjectURL(blob);
        }
        const tpl = buildCustomTemplate({ ...m, modelUrl });
        registerCustomTemplate(tpl);
        templates.push(tpl);
      } catch {
        /* skip a single broken entry */
      }
    }
    set({ templates, hydrated: true });
  },

  addFromFile: async (file, meta) => {
    if (file.size > MAX_FILE_BYTES) {
      throw new Error("Model is too large (max 25MB).");
    }
    const id = uid("cust");
    await idbPutModel(id, file);
    const persisted: CustomMeta = { id, source: "idb", ...meta };
    writeMetas([...readMetas(), persisted]);

    const modelUrl = URL.createObjectURL(file);
    const tpl = buildCustomTemplate({ id, modelUrl, ...meta });
    registerCustomTemplate(tpl);
    set((s) => ({ templates: [...s.templates, tpl] }));
  },

  addFromUrl: async (url, meta) => {
    const id = uid("cust");
    const persisted: CustomMeta = { id, source: "url", url, ...meta };
    writeMetas([...readMetas(), persisted]);

    const tpl = buildCustomTemplate({ id, modelUrl: url, ...meta });
    registerCustomTemplate(tpl);
    set((s) => ({ templates: [...s.templates, tpl] }));
  },

  remove: async (id) => {
    writeMetas(readMetas().filter((m) => m.id !== id));
    try {
      await idbDeleteModel(id);
    } catch {
      /* url-sourced models have nothing in idb */
    }
    unregisterCustomTemplate(id);
    set((s) => ({ templates: s.templates.filter((t) => t.id !== id) }));
  },
}));
