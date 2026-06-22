"use client";

import type { SavedProject } from "@/types";
import { useAuth } from "@/store/auth-store";

// Client-side project library backed by localStorage, scoped per account.
// Each user (and the "guest" device session) gets an isolated bucket so designs
// belong to whoever made them. Swap these for API calls against the `projects`
// table in the schema doc when the backend lands — the UI won't change.

const BASE = "spaceai:projects";

function currentOwner(): string {
  return useAuth.getState().user?.id ?? "guest";
}

function keyFor(owner: string = currentOwner()): string {
  return `${BASE}:${owner}`;
}

// Migrate the pre-accounts global key into the guest bucket once, so existing
// saves aren't lost when scoping was introduced.
function migrateLegacy(): void {
  try {
    const legacy = localStorage.getItem(BASE);
    if (legacy && !localStorage.getItem(`${BASE}:guest`)) {
      localStorage.setItem(`${BASE}:guest`, legacy);
      localStorage.removeItem(BASE);
    }
  } catch {
    /* ignore */
  }
}

export function listProjects(): SavedProject[] {
  if (typeof window === "undefined") return [];
  migrateLegacy();
  try {
    const arr = JSON.parse(localStorage.getItem(keyFor()) ?? "[]") as SavedProject[];
    return arr.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function saveProject(project: SavedProject): SavedProject {
  const owner = currentOwner();
  const all = listProjects();
  const next: SavedProject = {
    ...project,
    ownerId: owner === "guest" ? undefined : owner,
    updatedAt: Date.now(),
  };
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx >= 0) all[idx] = next;
  else all.unshift(next);
  localStorage.setItem(keyFor(owner), JSON.stringify(all));
  return next;
}

export function getProject(id: string): SavedProject | undefined {
  return listProjects().find((p) => p.id === id);
}

export function deleteProject(id: string): void {
  const all = listProjects().filter((p) => p.id !== id);
  localStorage.setItem(keyFor(), JSON.stringify(all));
}
