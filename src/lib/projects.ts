"use client";

import type { SavedProject } from "@/types";

// Client-side project library backed by localStorage. A real deployment can
// swap these four functions for API calls without touching the UI.

const KEY = "spaceai:projects";

export function listProjects(): SavedProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as SavedProject[];
    return arr.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function saveProject(project: SavedProject): SavedProject {
  const all = listProjects();
  const idx = all.findIndex((p) => p.id === project.id);
  const next = { ...project, updatedAt: Date.now() };
  if (idx >= 0) all[idx] = next;
  else all.unshift(next);
  localStorage.setItem(KEY, JSON.stringify(all));
  return next;
}

export function getProject(id: string): SavedProject | undefined {
  return listProjects().find((p) => p.id === id);
}

export function deleteProject(id: string): void {
  const all = listProjects().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}
