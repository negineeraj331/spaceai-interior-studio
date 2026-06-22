"use client";

import { X, LayoutTemplate, ArrowRight } from "lucide-react";
import { ROOM_PRESETS } from "@/lib/room-presets";
import { useStudio } from "@/store/studio-store";

export default function TemplatesDialog({ onClose }: { onClose: () => void }) {
  const loadPreset = useStudio((s) => s.loadPreset);
  const objectCount = useStudio((s) => s.objects.length);

  const apply = (id: string) => {
    const preset = ROOM_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    if (
      objectCount > 0 &&
      !window.confirm("Starting a template will replace the current furniture. Continue?")
    ) {
      return;
    }
    loadPreset(preset);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-ink-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <LayoutTemplate className="h-5 w-5 text-brand-300" /> Start from a template
          </h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {ROOM_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => apply(p.id)}
              className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition-all hover:border-brand-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span
                  className="h-8 w-8 rounded-lg ring-1 ring-inset ring-white/10"
                  style={{ background: p.accent }}
                />
                <span className="chip text-[11px]">{p.objects.length} items</span>
              </div>
              <h4 className="mt-3 font-semibold text-white">{p.name}</h4>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-400">{p.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-300 opacity-0 transition-opacity group-hover:opacity-100">
                Use this template <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          You can fully customize everything after applying a template.
        </p>
      </div>
    </div>
  );
}
