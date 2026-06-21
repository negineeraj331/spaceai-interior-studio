"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useStudio } from "@/store/studio-store";
import { saveProject } from "@/lib/projects";
import { downloadDataUrl, downloadJson } from "@/lib/utils";
import Toolbar from "./Toolbar";
import FurnitureCatalog from "./FurnitureCatalog";
import RightPanel from "./RightPanel";
import Minimap from "./Minimap";
import { PanelLeftClose, PanelLeft, Keyboard } from "lucide-react";

const Scene = dynamic(() => import("./three/Scene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-ink-950">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        <p className="text-sm">Loading 3D studio…</p>
      </div>
    </div>
  ),
});

export default function StudioShell() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leftOpen, setLeftOpen] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const hydrate = useStudio((s) => s.hydrate);
  const serialize = useStudio((s) => s.serialize);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const handleSave = () => {
    const project = serialize();
    if (canvasRef.current) {
      try {
        project.thumbnail = canvasRef.current.toDataURL("image/jpeg", 0.5);
      } catch {
        /* tainted canvas (remote textures) — skip thumbnail */
      }
    }
    saveProject(project);
    flash("Project saved to your gallery");
  };

  const handleScreenshot = () => {
    if (!canvasRef.current) return;
    try {
      const url = canvasRef.current.toDataURL("image/png");
      downloadDataUrl(url, `${serialize().name.replace(/\s+/g, "-")}.png`);
      flash("Screenshot downloaded");
    } catch {
      flash("Screenshot blocked by remote textures");
    }
  };

  const handleExport = () => {
    const project = serialize();
    downloadJson(project, `${project.name.replace(/\s+/g, "-")}.json`);
    flash("Scene exported as JSON");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const s = useStudio.getState();
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? s.redo() : s.undo();
        return;
      }
      if (meta && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
        return;
      }
      if (meta && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (s.selectedId) s.duplicateObject(s.selectedId);
        return;
      }
      switch (e.key.toLowerCase()) {
        case "g":
          s.setTransformMode("translate");
          break;
        case "r":
          s.setTransformMode("rotate");
          break;
        case "e":
          s.setTransformMode("scale");
          break;
        case "delete":
        case "backspace":
          if (s.selectedId) s.removeObject(s.selectedId);
          break;
        case "escape":
          s.select(null);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-ink-950">
      <Toolbar onSave={handleSave} onScreenshot={handleScreenshot} onExport={handleExport} />

      <div className="flex min-h-0 flex-1">
        {/* Left: catalog */}
        {leftOpen ? (
          <aside className="flex w-[300px] flex-none flex-col border-r border-white/10 bg-ink-900/60">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <h2 className="text-sm font-semibold text-white">Furniture</h2>
              <button
                onClick={() => setLeftOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-white/10"
                title="Collapse"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
            <FurnitureCatalog />
          </aside>
        ) : (
          <button
            onClick={() => setLeftOpen(true)}
            className="absolute left-3 top-20 z-20 grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-ink-900/80 text-slate-300 backdrop-blur hover:bg-white/10"
            title="Open furniture"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        {/* Center: 3D viewport */}
        <main className="relative min-w-0 flex-1">
          <Scene canvasRef={canvasRef} />
          <Minimap />

          <button
            onClick={() => setShowShortcuts((v) => !v)}
            className="absolute bottom-4 right-4 z-20 grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-ink-900/80 text-slate-300 backdrop-blur hover:bg-white/10"
            title="Keyboard shortcuts"
          >
            <Keyboard className="h-4 w-4" />
          </button>

          {showShortcuts && <ShortcutsCard onClose={() => setShowShortcuts(false)} />}
        </main>

        {/* Right: tabbed panels */}
        <RightPanel />
      </div>

      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-brand-400/40 bg-ink-900/95 px-4 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur">
          {toast}
        </div>
      )}
    </div>
  );
}

const SHORTCUTS: [string, string][] = [
  ["G", "Move mode"],
  ["R", "Rotate mode"],
  ["E", "Scale mode"],
  ["⌘ Z", "Undo"],
  ["⌘ ⇧ Z", "Redo"],
  ["⌘ D", "Duplicate"],
  ["⌘ S", "Save"],
  ["Del", "Delete selected"],
  ["Esc", "Deselect"],
];

function ShortcutsCard({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute bottom-16 right-4 z-30 w-64 rounded-xl border border-white/10 bg-ink-900/95 p-4 shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Shortcuts</h3>
        <button onClick={onClose} className="text-xs text-slate-400 hover:text-white">
          close
        </button>
      </div>
      <dl className="space-y-1.5">
        {SHORTCUTS.map(([key, label]) => (
          <div key={key} className="flex items-center justify-between text-xs">
            <dt className="text-slate-400">{label}</dt>
            <dd>
              <kbd className="kbd">{key}</kbd>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
