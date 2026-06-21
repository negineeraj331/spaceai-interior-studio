"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Sofa,
  Table,
  Archive,
  BedDouble,
  Lamp,
  Frame,
  Square,
  Sprout,
  Plus,
  Search,
  Box,
  Trash2,
  Upload,
} from "lucide-react";
import { FURNITURE, CATEGORIES, CATEGORY_META } from "@/lib/furniture-data";
import { useStudio } from "@/store/studio-store";
import { useCustomFurniture } from "@/store/custom-furniture-store";
import { formatPrice, cn } from "@/lib/utils";
import type { FurnitureCategory, FurnitureTemplate } from "@/types";
import CustomModelDialog from "./CustomModelDialog";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sofa,
  Table,
  Archive,
  BedDouble,
  Lamp,
  Frame,
  Square,
  Sprout,
};

export default function FurnitureCatalog() {
  const [cat, setCat] = useState<FurnitureCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const addObject = useStudio((s) => s.addObject);

  const customTemplates = useCustomFurniture((s) => s.templates);
  const removeCustom = useCustomFurniture((s) => s.remove);
  const hydrateCustom = useCustomFurniture((s) => s.hydrate);

  useEffect(() => {
    hydrateCustom();
  }, [hydrateCustom]);

  const customIds = useMemo(() => new Set(customTemplates.map((t) => t.id)), [customTemplates]);

  // Custom uploads appear first so they're easy to find.
  const all = useMemo<FurnitureTemplate[]>(
    () => [...customTemplates, ...FURNITURE],
    [customTemplates],
  );

  const items = all.filter((f) => {
    const matchCat = cat === "all" || f.category === cat;
    const matchQuery =
      !query ||
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.tags.some((t) => t.includes(query.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search furniture…"
            className="input pl-9"
          />
        </div>

        <button
          onClick={() => setDialogOpen(true)}
          className="btn-ghost mt-3 w-full justify-center text-xs"
        >
          <Upload className="h-3.5 w-3.5" /> Upload 3D model
        </button>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <CatChip active={cat === "all"} onClick={() => setCat("all")} label="All" />
          {CATEGORIES.map((c) => (
            <CatChip
              key={c}
              active={cat === c}
              onClick={() => setCat(c)}
              label={CATEGORY_META[c].label}
            />
          ))}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-2 content-start gap-2.5 overflow-y-auto p-3">
        {items.map((f) => {
          const isCustom = customIds.has(f.id);
          const Icon = isCustom ? Box : ICONS[CATEGORY_META[f.category].icon] ?? Square;
          return (
            <div
              key={f.id}
              className="group relative flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center transition-all hover:border-brand-400/40 hover:bg-white/[0.06]"
            >
              <button onClick={() => addObject(f.id)} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-lg ring-1 ring-inset ring-white/5 transition-colors",
                    isCustom
                      ? "bg-accent-500/15 text-accent-400 group-hover:bg-accent-500/25"
                      : "bg-brand-500/10 text-brand-300 group-hover:bg-brand-500/20",
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-200">{f.name}</p>
                  {isCustom ? (
                    <p className="text-[11px] text-accent-400/80">custom model</p>
                  ) : (
                    f.price != null && (
                      <p className="text-[11px] text-slate-500">{formatPrice(f.price)}</p>
                    )
                  )}
                </div>
              </button>

              <button
                onClick={() => addObject(f.id)}
                title="Add to scene"
                className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-md bg-brand-500 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>

              {isCustom && (
                <button
                  onClick={() => removeCustom(f.id)}
                  title="Remove custom model"
                  className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-md bg-red-500/80 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="col-span-2 mt-8 text-center text-sm text-slate-500">
            No furniture matches “{query}”.
          </p>
        )}
      </div>

      {dialogOpen && <CustomModelDialog onClose={() => setDialogOpen(false)} />}
    </div>
  );
}

function CatChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-brand-500 text-white"
          : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
      )}
    >
      {label}
    </button>
  );
}
