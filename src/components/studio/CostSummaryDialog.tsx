"use client";

import { useMemo } from "react";
import { X, Receipt, ShoppingCart } from "lucide-react";
import { useStudio } from "@/store/studio-store";
import { computeCost } from "@/lib/pricing";
import { CATEGORY_META } from "@/lib/furniture-data";
import { formatPrice } from "@/lib/utils";
import type { FurnitureCategory } from "@/types";
import type { CostLine } from "@/lib/pricing";

export default function CostSummaryDialog({ onClose }: { onClose: () => void }) {
  const objects = useStudio((s) => s.objects);
  const projectName = useStudio((s) => s.projectName);
  const summary = useMemo(() => computeCost(objects), [objects]);

  // Group the line items by category for a readable receipt.
  const groups = useMemo<[FurnitureCategory, CostLine[]][]>(() => {
    const byCat = new Map<FurnitureCategory, CostLine[]>();
    for (const line of summary.lines) {
      const arr = byCat.get(line.category) ?? [];
      arr.push(line);
      byCat.set(line.category, arr);
    }
    return Array.from(byCat.entries());
  }, [summary]);

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-ink-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl border border-white/10 bg-ink-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <Receipt className="h-5 w-5 text-brand-300" /> Cost estimate
          </h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {summary.itemCount === 0 ? (
          <div className="grid flex-1 place-items-center p-10 text-center">
            <div>
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-slate-500">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-300">No furniture yet</p>
              <p className="mt-1 text-xs text-slate-500">Add pieces and your running total appears here.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5">
            <p className="mb-3 text-xs text-slate-500">{projectName}</p>
            {groups.map(([cat, lines]) => (
              <div key={cat} className="mb-4">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {CATEGORY_META[cat]?.label ?? cat}
                </p>
                <div className="space-y-1">
                  {lines.map((l) => (
                    <div key={l.templateId} className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate text-slate-300">
                        {l.name}
                        {l.qty > 1 && <span className="text-slate-500"> × {l.qty}</span>}
                      </span>
                      <span className="font-mono text-slate-200">
                        {l.unitPrice != null ? formatPrice(l.subtotal) : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-white/10 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              {summary.pricedCount} priced item{summary.pricedCount === 1 ? "" : "s"}
            </span>
            <span className="font-display text-2xl font-bold text-white">
              {formatPrice(summary.total)}
            </span>
          </div>
          {summary.unpricedCount > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              + {summary.unpricedCount} custom item{summary.unpricedCount === 1 ? "" : "s"} with no
              catalog price (not included in total).
            </p>
          )}
          <p className="mt-2 text-[11px] text-slate-600">
            Estimate based on catalog reference prices. Actual prices vary by retailer.
          </p>
        </div>
      </div>
    </div>
  );
}
