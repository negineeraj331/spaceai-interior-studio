"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Sparkles,
  Wand2,
  Loader2,
  ImagePlus,
  Check,
  AlertCircle,
  Ruler,
  Lightbulb,
} from "lucide-react";
import { useStudio } from "@/store/studio-store";
import type { RoomAnalysis, RedesignResult } from "@/types";
import { cn } from "@/lib/utils";

const STYLE_PRESETS = [
  "Scandinavian",
  "Modern",
  "Industrial",
  "Bohemian",
  "Luxury",
  "Japandi",
];

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AIPanel() {
  const photoUrl = useStudio((s) => s.photoUrl);
  const setPhotoUrl = useStudio((s) => s.setPhotoUrl);
  const analysis = useStudio((s) => s.analysis);
  const applyAnalysis = useStudio((s) => s.applyAnalysisDimensions);

  const [busy, setBusy] = useState<null | "upload" | "analyze" | "redesign">(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [style, setStyle] = useState("Scandinavian");
  const [prompt, setPrompt] = useState("");
  const [redesign, setRedesign] = useState<RedesignResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    try {
      setBusy("upload");
      const dataUrl = await fileToDataUrl(file);
      // Upload to Cloudinary (or fall back to the data URL).
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setPhotoUrl(data.url);
      setRedesign(null);
      // Auto-analyze right after upload.
      await analyze(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  async function analyze(url: string) {
    try {
      setBusy("analyze");
      setError(null);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      const data: RoomAnalysis = await res.json();
      if (!res.ok) throw new Error((data as any).error ?? "Analysis failed");
      applyAnalysis(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setBusy(null);
    }
  }

  async function generateRedesign() {
    if (!photoUrl) return;
    try {
      setBusy("redesign");
      setError(null);
      const res = await fetch("/api/redesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: photoUrl, style, prompt }),
      });
      const data: RedesignResult = await res.json();
      if (!res.ok) throw new Error((data as any).error ?? "Redesign failed");
      setRedesign(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Redesign failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex-1 space-y-5 overflow-y-auto p-4">
      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed transition-colors",
          dragOver ? "border-brand-400 bg-brand-500/10" : "border-white/15 bg-white/[0.02]",
        )}
      >
        {photoUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl} alt="Your room" className="h-40 w-full object-cover" />
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 btn-ghost bg-ink-950/70 text-xs"
            >
              <ImagePlus className="h-3.5 w-3.5" /> Replace
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 px-4 py-8 text-center"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-200">Upload a room photo</p>
            <p className="text-xs text-slate-500">Drag & drop or click — JPG/PNG up to 8MB</p>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {busy === "upload" && <Status icon="spin" text="Uploading photo…" />}
      {busy === "analyze" && <Status icon="spin" text="AI is analyzing your room…" />}
      {error && <Status icon="error" text={error} />}

      {/* Analysis */}
      {analysis && (
        <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4 text-accent-400" /> Room analysis
            </h4>
            {analysis.mocked && <span className="chip text-[10px]">demo AI</span>}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="chip text-[11px]">{analysis.roomType}</span>
            <span className="chip text-[11px]">{analysis.detectedStyle}</span>
          </div>

          <p className="text-xs leading-relaxed text-slate-400">{analysis.summary}</p>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Ruler className="h-3.5 w-3.5" />
            {analysis.dimensions.width.toFixed(1)} × {analysis.dimensions.depth.toFixed(1)} ×{" "}
            {analysis.dimensions.height.toFixed(1)} m
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lightbulb className="h-3.5 w-3.5" /> {analysis.lighting}
          </div>

          <div className="flex gap-1.5">
            {analysis.dominantColors.map((c) => (
              <span
                key={c}
                className="h-6 w-6 rounded-md border border-white/15"
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>

          <button onClick={() => applyAnalysis(analysis)} className="btn-ghost w-full text-xs">
            <Check className="h-3.5 w-3.5" /> Apply dimensions & palette to room
          </button>

          {/* Layout suggestions */}
          <div className="space-y-2 border-t border-white/10 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Suggested layouts
            </p>
            {analysis.suggestions.map((s) => (
              <details key={s.title} className="group rounded-lg border border-white/10 bg-white/[0.02]">
                <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-slate-200">
                  {s.title}
                </summary>
                <div className="px-3 pb-3 text-xs text-slate-400">
                  <p>{s.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.items.map((it) => (
                      <span key={it} className="rounded bg-white/5 px-1.5 py-0.5 text-[11px]">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Redesign */}
      <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
          <Wand2 className="h-4 w-4 text-brand-300" /> AI redesign preview
        </h4>
        <p className="text-xs text-slate-500">
          Restyle your room photo with Stable Diffusion while keeping its layout.
        </p>

        <div className="flex flex-wrap gap-1.5">
          {STYLE_PRESETS.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                style === s
                  ? "bg-brand-500 text-white"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Optional: add details (e.g. 'more plants, warm wood')"
          className="input"
        />

        <button
          onClick={generateRedesign}
          disabled={!photoUrl || busy === "redesign"}
          className="btn-primary w-full text-sm"
        >
          {busy === "redesign" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" /> Generate {style} redesign
            </>
          )}
        </button>

        {!photoUrl && (
          <p className="text-center text-[11px] text-slate-500">Upload a photo first.</p>
        )}

        {redesign && (
          <div className="space-y-2">
            <div className="relative overflow-hidden rounded-lg border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={redesign.imageUrl} alt={`${redesign.style} redesign`} className="w-full" />
              {redesign.mocked && (
                <span className="absolute right-2 top-2 chip bg-ink-950/70 text-[10px]">
                  demo preview
                </span>
              )}
            </div>
            <a
              href={redesign.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full text-xs"
            >
              Open full size
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Status({ icon, text }: { icon: "spin" | "error"; text: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
        icon === "error"
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-brand-400/30 bg-brand-500/10 text-brand-200",
      )}
    >
      {icon === "spin" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      {text}
    </div>
  );
}
