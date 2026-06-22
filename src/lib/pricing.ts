import type { SceneObject, FurnitureCategory } from "@/types";
import { resolveTemplate } from "./template-registry";

// Roll up the furniture in a scene into a shopping-style estimate. Identical
// templates collapse into a single line with a quantity. Custom/uploaded models
// have no catalog price and are reported separately so the total stays honest.

export interface CostLine {
  templateId: string;
  name: string;
  category: FurnitureCategory;
  unitPrice?: number;
  qty: number;
  subtotal: number;
}

export interface CostSummary {
  total: number;
  itemCount: number;
  pricedCount: number;
  unpricedCount: number;
  lines: CostLine[];
}

/** Build a spreadsheet-friendly CSV shopping list from a cost summary. */
export function costToCsv(summary: CostSummary, projectName: string): string {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows: (string | number)[][] = [["Item", "Category", "Qty", "Unit Price (USD)", "Subtotal (USD)"]];
  for (const l of summary.lines) {
    rows.push([
      l.name,
      l.category,
      l.qty,
      l.unitPrice != null ? l.unitPrice : "",
      l.unitPrice != null ? l.subtotal : "",
    ]);
  }
  rows.push([]);
  rows.push(["Total", "", summary.pricedCount, "", summary.total]);

  const header = `# Shopping list — ${projectName}`;
  return header + "\n" + rows.map((r) => r.map(esc).join(",")).join("\n");
}

export function computeCost(objects: SceneObject[]): CostSummary {
  const map = new Map<string, CostLine>();

  for (const o of objects) {
    const tpl = resolveTemplate(o.templateId);
    const existing = map.get(o.templateId);
    if (existing) {
      existing.qty += 1;
      existing.subtotal = (existing.unitPrice ?? 0) * existing.qty;
    } else {
      const unitPrice = tpl?.price;
      map.set(o.templateId, {
        templateId: o.templateId,
        name: tpl?.name ?? o.name,
        category: o.category,
        unitPrice,
        qty: 1,
        subtotal: unitPrice ?? 0,
      });
    }
  }

  const lines = Array.from(map.values()).sort((a, b) => b.subtotal - a.subtotal);
  const total = lines.reduce((sum, l) => sum + (l.unitPrice != null ? l.subtotal : 0), 0);
  const unpricedCount = lines
    .filter((l) => l.unitPrice == null)
    .reduce((sum, l) => sum + l.qty, 0);

  return {
    total,
    itemCount: objects.length,
    pricedCount: objects.length - unpricedCount,
    unpricedCount,
    lines,
  };
}
