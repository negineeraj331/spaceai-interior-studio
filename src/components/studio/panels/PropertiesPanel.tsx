"use client";

import { useStudio } from "@/store/studio-store";
import { getTemplate } from "@/lib/furniture-data";
import { Copy, Trash2, RotateCw, Lock, Unlock, MousePointer2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ColorField, Slider } from "./controls";

export default function PropertiesPanel() {
  const selectedId = useStudio((s) => s.selectedId);
  const obj = useStudio((s) => s.objects.find((o) => o.uid === s.selectedId) ?? null);
  const update = useStudio((s) => s.updateObject);
  const remove = useStudio((s) => s.removeObject);
  const duplicate = useStudio((s) => s.duplicateObject);

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
