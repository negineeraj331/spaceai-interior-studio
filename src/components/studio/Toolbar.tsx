"use client";

import Link from "next/link";
import {
  Box,
  Move,
  RotateCw,
  Maximize2,
  Undo2,
  Redo2,
  Grid3x3,
  Magnet,
  Wand2,
  Trash2,
  Save,
  Camera,
  FileDown,
  Eye,
  Share2,
  LayoutTemplate,
} from "lucide-react";
import { useStudio } from "@/store/studio-store";
import { cn } from "@/lib/utils";
import type { TransformMode, CameraPreset } from "@/types";

const MODES: { id: TransformMode; icon: React.ComponentType<{ className?: string }>; key: string }[] = [
  { id: "translate", icon: Move, key: "G" },
  { id: "rotate", icon: RotateCw, key: "R" },
  { id: "scale", icon: Maximize2, key: "S" },
];

const CAMS: { id: CameraPreset; label: string }[] = [
  { id: "perspective", label: "3D" },
  { id: "corner", label: "Corner" },
  { id: "front", label: "Front" },
  { id: "top", label: "Top" },
];

export default function Toolbar({
  onSave,
  onScreenshot,
  onExport,
  onShare,
  onTemplates,
}: {
  onSave: () => void;
  onScreenshot: () => void;
  onExport: () => void;
  onShare: () => void;
  onTemplates: () => void;
}) {
  const projectName = useStudio((s) => s.projectName);
  const setProjectName = useStudio((s) => s.setProjectName);
  const mode = useStudio((s) => s.transformMode);
  const setMode = useStudio((s) => s.setTransformMode);
  const camera = useStudio((s) => s.cameraPreset);
  const setCamera = useStudio((s) => s.setCameraPreset);
  const showGrid = useStudio((s) => s.showGrid);
  const toggleGrid = useStudio((s) => s.toggleGrid);
  const snap = useStudio((s) => s.snapToGrid);
  const toggleSnap = useStudio((s) => s.toggleSnap);
  const undo = useStudio((s) => s.undo);
  const redo = useStudio((s) => s.redo);
  const canUndo = useStudio((s) => s.past.length > 0);
  const canRedo = useStudio((s) => s.future.length > 0);
  const autoArrange = useStudio((s) => s.autoArrange);
  const clearScene = useStudio((s) => s.clearScene);
  const count = useStudio((s) => s.objects.length);

  return (
    <header className="flex h-14 flex-none items-center justify-between gap-3 border-b border-white/10 bg-ink-900/80 px-3 backdrop-blur-xl">
      {/* Left: brand + project name */}
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/" className="flex flex-none items-center gap-1.5 font-display font-bold text-white">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-500">
            <Box className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">SpaceAI</span>
        </Link>
        <div className="hidden h-6 w-px bg-white/10 sm:block" />
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="min-w-0 max-w-[180px] rounded-md bg-transparent px-2 py-1 text-sm font-medium text-slate-200 outline-none hover:bg-white/5 focus:bg-white/5"
        />
      </div>

      {/* Center: tools */}
      <div className="flex items-center gap-1.5">
        <Group>
          {MODES.map((m) => (
            <ToolBtn
              key={m.id}
              active={mode === m.id}
              onClick={() => setMode(m.id)}
              title={`${m.id} (${m.key})`}
            >
              <m.icon className="h-4 w-4" />
            </ToolBtn>
          ))}
        </Group>

        <Group>
          <ToolBtn onClick={undo} disabled={!canUndo} title="Undo (⌘Z)">
            <Undo2 className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn onClick={redo} disabled={!canRedo} title="Redo (⌘⇧Z)">
            <Redo2 className="h-4 w-4" />
          </ToolBtn>
        </Group>

        <Group>
          <ToolBtn active={showGrid} onClick={toggleGrid} title="Toggle grid">
            <Grid3x3 className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn active={snap} onClick={toggleSnap} title="Snap to grid">
            <Magnet className="h-4 w-4" />
          </ToolBtn>
        </Group>

        <Group>
          {CAMS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCamera(c.id)}
              className={cn(
                "rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                camera === c.id ? "bg-brand-500 text-white" : "text-slate-300 hover:bg-white/10",
              )}
            >
              {c.label}
            </button>
          ))}
        </Group>

        <button onClick={onTemplates} className="btn-ghost ml-1 px-3 py-1.5 text-xs" title="Start from a template">
          <LayoutTemplate className="h-3.5 w-3.5" /> <span className="hidden lg:inline">Templates</span>
        </button>

        <button onClick={autoArrange} className="btn-accent px-3 py-1.5 text-xs" title="AI auto-arrange">
          <Wand2 className="h-3.5 w-3.5" /> <span className="hidden lg:inline">Auto-arrange</span>
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        <span className="hidden rounded-md bg-white/5 px-2 py-1 text-xs text-slate-400 xl:inline">
          {count} item{count === 1 ? "" : "s"}
        </span>
        <ToolBtn onClick={clearScene} title="Clear scene">
          <Trash2 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={onScreenshot} title="Screenshot (PNG)">
          <Camera className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={onExport} title="Export JSON">
          <FileDown className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={onShare} title="Copy share link">
          <Share2 className="h-4 w-4" />
        </ToolBtn>
        <button onClick={onSave} className="btn-primary px-3 py-1.5 text-xs">
          <Save className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Save</span>
        </button>
        <Link href="/gallery" className="btn-ghost px-2.5 py-1.5 text-xs" title="Gallery">
          <Eye className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-ink-800/60 p-0.5">
      {children}
    </div>
  );
}

function ToolBtn({
  children,
  active,
  disabled,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md transition-colors disabled:opacity-30",
        active ? "bg-brand-500 text-white" : "text-slate-300 hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}
