"use client";

import { useState, useRef } from "react";
import { X, Upload, Link2, Loader2, Box } from "lucide-react";
import { useCustomFurniture } from "@/store/custom-furniture-store";
import { CATEGORIES, CATEGORY_META } from "@/lib/furniture-data";
import type { FurnitureCategory, Vec3 } from "@/types";
import { cn } from "@/lib/utils";

export default function CustomModelDialog({ onClose }: { onClose: () => void }) {
  const addFromFile = useCustomFurniture((s) => s.addFromFile);
  const addFromUrl = useCustomFurniture((s) => s.addFromUrl);

  const [tab, setTab] = useState<"file" | "url">("file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FurnitureCategory>("decor");
  const [sizeM, setSizeM] = useState(1); // approx footprint in meters
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    if (!/\.(glb|gltf)$/i.test(f.name)) {
      setError("Please choose a .glb or .gltf file.");
      return;
    }
    setError(null);
    setFile(f);
    if (!name) setName(f.name.replace(/\.(glb|gltf)$/i, ""));
  };

  const submit = async () => {
    setError(null);
    const cleanName = name.trim() || "Custom model";
    const size: Vec3 = [sizeM, sizeM, sizeM];
    try {
      setBusy(true);
      if (tab === "file") {
        if (!file) {
          setError("Choose a model file first.");
          return;
        }
        await addFromFile(file, { name: cleanName, category, size });
      } else {
        if (!/^https?:\/\/.+\.(glb|gltf)(\?.*)?$/i.test(url.trim())) {
          setError("Enter a valid .glb/.gltf URL (must be publicly reachable + CORS-enabled).");
          return;
        }
        await addFromUrl(url.trim(), { name: cleanName, category, size });
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add model.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-ink-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <Box className="h-5 w-5 text-brand-300" /> Add a 3D model
          </h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* source tabs */}
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-ink-800/60 p-1">
          <TabBtn active={tab === "file"} onClick={() => setTab("file")} icon={<Upload className="h-4 w-4" />} label="Upload file" />
          <TabBtn active={tab === "url"} onClick={() => setTab("url")} icon={<Link2 className="h-4 w-4" />} label="From URL" />
        </div>

        {tab === "file" ? (
          <button
            onClick={() => fileRef.current?.click()}
            className="mb-4 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] px-4 py-6 text-center hover:border-brand-400/50"
          >
            <Upload className="h-6 w-6 text-brand-300" />
            <span className="text-sm text-slate-200">{file ? file.name : "Choose a .glb / .gltf file"}</span>
            <span className="text-xs text-slate-500">Stored privately on this device · max 25MB</span>
            <input
              ref={fileRef}
              type="file"
              accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </button>
        ) : (
          <div className="mb-4">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/chair.glb"
              className="input"
            />
            <p className="mt-1 text-xs text-slate-500">Public, CORS-enabled URL. Shareable across devices.</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Eames Chair" className="input" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    category === c ? "bg-brand-500 text-white" : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
                  )}
                >
                  {CATEGORY_META[c].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-300">
              <span>Approx. size (footprint)</span>
              <span className="font-mono text-slate-400">{sizeM.toFixed(1)} m</span>
            </label>
            <input
              type="range"
              min={0.2}
              max={3}
              step={0.1}
              value={sizeM}
              onChange={(e) => setSizeM(parseFloat(e.target.value))}
              className="range-input w-full"
            />
            <p className="mt-1 text-xs text-slate-500">The model is auto-scaled to this footprint and placed on the floor.</p>
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1 text-sm">Cancel</button>
          <button onClick={submit} disabled={busy} className="btn-primary flex-1 text-sm">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Box className="h-4 w-4" />}
            Add to catalog
          </button>
        </div>
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors",
        active ? "bg-brand-500 text-white" : "text-slate-300 hover:text-white",
      )}
    >
      {icon} {label}
    </button>
  );
}
