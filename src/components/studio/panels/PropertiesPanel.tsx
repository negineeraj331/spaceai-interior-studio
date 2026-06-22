"use client";

import { useStudio } from "@/store/studio-store";
import { resolveTemplate as getTemplate } from "@/lib/template-registry";
import { Copy, Trash2, RotateCw, Lock, Unlock, MousePointer2, Boxes } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ColorField, Slider } from "./controls";

export default function PropertiesPanel() {
  const selectedIds = useStudio((s) => s.selectedIds);
  const obj = useStudio((s) =>
    s.selectedIds.length === 1 ? s.objects.find((o) => o.uid === s.selectedIds[0]) ?? null : null,
  );
  const update = useStudio((s) => s.updateObject);
  const remove = useStudio((s) => s.removeObject);
  const duplicate = useStudio((s) => s.duplicateObject);
  const removeSelected = useStudio((s) => s.removeSelected);
  const duplicateSelected = useStudio((s) => s.duplicateSelected);

  // Group panel when more than one object is selected.
  if (selectedIds.length > 1) {
    return (
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div className="flex items-center gap-3 rounded-xl border border-brand-400/30 bg-brand-500/10 p-4">
          <div className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-brand-500/20 text-brand-200">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-white">{selectedIds.length} items selected</p>
            <p className="text-xs text-slate-400">Drag the gizmo to move, rotate, or scale them together.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={duplicateSelected} className="btn-ghost text-xs">
            <Copy className="h-3.5 w-3.5" /> Duplicate all
          </button>
          <button
            onClick={removeSelected}
            className="btn text-xs bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30 hover:bg-red-500/25"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete all
          </button>
        </div>
        <p className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-slate-500">
          Tip: <kbd className="kbd">Shift</kbd>-click items to add or remove them from the selection.
          Press <kbd className="kbd">⌘/Ctrl A</kbd> to select everything.
        </p>
      </div>
    );
  }

  if (!obj) {
    return (
      <div className="grid flex-1 place-items-center p-8 text-center">
        <div>
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-slate-500">
            <MousePointer2 className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-300">Nothing selected</p>
          <p className="mt-1 text-xs text-slate-500">
            Click a piece of furniture in the scene to edit it, or add one from the catalog.
          </p>
        </div>
      </div>
    );
  }

  const tpl = getTemplate(obj.templateId);

  return (
    <div className="flex-1 space-y-5 overflow-y-auto p-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">{obj.name}</h3>
          <span className="chip text-[11px] capitalize">{obj.category}</span>
        </div>
        {tpl?.price != null && (
          <p className="mt-1 text-xs text-slate-500">{formatPrice(tpl.price)}</p>
        )}
      </div>

      <ColorField
        label="Color"
        value={obj.color}
        onChange={(c) => update(obj.uid, { color: c })}
      />

      <Slider
        label="Rotation"
        value={(obj.rotation[1] * 180) / Math.PI}
        min={-180}
        max={180}
        step={5}
        unit="°"
        onChange={(deg) =>
          update(obj.uid, { rotation: [obj.rotation[0], (deg * Math.PI) / 180, obj.rotation[2]] })
        }
      />

      <Slider
        label="Scale"
        value={obj.scale}
        min={0.5}
        max={2}
        step={0.05}
        unit="×"
        onChange={(scale) => update(obj.uid, { scale })}
      />

      <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
        {(["X", "Y", "Z"] as const).map((axis, i) => (
          <div key={axis} className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
            <div className="text-slate-500">{axis}</div>
            <div className="font-mono text-slate-200">{obj.position[i].toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() =>
            update(obj.uid, {
              rotation: [obj.rotation[0], obj.rotation[1] + Math.PI / 4, obj.rotation[2]],
            })
          }
          className="btn-ghost text-xs"
        >
          <RotateCw className="h-3.5 w-3.5" /> Rotate 45°
        </button>
        <button
          onClick={() => update(obj.uid, { locked: !obj.locked })}
          className="btn-ghost text-xs"
        >
          {obj.locked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          {obj.locked ? "Unlock" : "Lock"}
        </button>
        <button onClick={() => duplicate(obj.uid)} className="btn-ghost text-xs">
          <Copy className="h-3.5 w-3.5" /> Duplicate
        </button>
        <button
          onClick={() => remove(obj.uid)}
          className="btn text-xs bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30 hover:bg-red-500/25"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>

      <p className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-slate-500">
        Tip: use the on-scene gizmo to drag, rotate, or scale. Switch modes with the toolbar or
        press <kbd className="kbd">G</kbd> / <kbd className="kbd">R</kbd> / <kbd className="kbd">S</kbd>.
      </p>
    </div>
  );
}
