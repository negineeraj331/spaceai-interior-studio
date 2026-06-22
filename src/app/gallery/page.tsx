"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Plus, Trash2, FolderOpen, Clock, LogIn } from "lucide-react";
import { listProjects, deleteProject } from "@/lib/projects";
import { useStudio } from "@/store/studio-store";
import { useAuth } from "@/store/auth-store";
import type { SavedProject } from "@/types";

export default function GalleryPage() {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const loadProject = useStudio((s) => s.loadProject);
  const user = useAuth((s) => s.user);
  const hydrateAuth = useAuth((s) => s.hydrate);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  // Re-list whenever the signed-in user changes (projects are account-scoped).
  useEffect(() => {
    setProjects(listProjects());
  }, [user]);

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects(listProjects());
  };

  return (
    <div className="min-h-[100dvh] bg-ink-950">
      <header className="border-b border-white/10 bg-ink-900/60 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-white">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-500">
              <Box className="h-4 w-4" />
            </span>
            SpaceAI
          </Link>
          <Link href="/studio" className="btn-primary text-sm">
            <Plus className="h-4 w-4" /> New design
          </Link>
        </div>
      </header>

      <main className="container-page py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white">
            {user ? `${user.name.split(" ")[0]}'s gallery` : "Your gallery"}
          </h1>
          <p className="mt-1 text-slate-400">
            {projects.length
              ? `${projects.length} saved design${projects.length === 1 ? "" : "s"}`
              : "Saved designs live here on this device."}
          </p>
        </div>

        {!user && (
          <div className="mb-8 flex flex-col items-start justify-between gap-3 rounded-2xl border border-brand-400/30 bg-brand-500/10 p-4 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-300">
              You&apos;re browsing as a guest. Sign in to keep your designs tied to your account.
            </p>
            <Link href="/login" className="btn-primary flex-none text-sm">
              <LogIn className="h-4 w-4" /> Sign in
            </Link>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-24 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
              <FolderOpen className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">No saved designs yet</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Open the studio, design a room, and hit Save to see it appear here.
            </p>
            <Link href="/studio" className="btn-primary mt-6">
              <Plus className="h-4 w-4" /> Start designing
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-brand-400/40"
              >
                <div className="relative aspect-video overflow-hidden bg-ink-800">
                  {p.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.thumbnail} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-slate-600">
                      <Box className="h-10 w-10" />
                    </div>
                  )}
                  <span className="absolute right-2 top-2 chip bg-ink-950/70 text-[10px]">
                    {p.objects.length} items
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="truncate font-semibold text-white">{p.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href="/studio"
                      onClick={() => loadProject(p)}
                      className="btn-primary flex-1 text-xs"
                    >
                      <FolderOpen className="h-3.5 w-3.5" /> Open
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30 hover:bg-red-500/25"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
