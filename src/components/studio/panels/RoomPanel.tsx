"use client";

import { useStudio } from "@/store/studio-store";
import { Slider, ColorField, SwatchRow, SegMented } from "./controls";
import { Sun, Lightbulb } from "lucide-react";
import type { RoomConfig } from "@/types";

const FLOORS: { value: RoomConfig["floorMaterial"]; label: string }[] = [
  { value: "wood", label: "Wood" },
  { value: "tile", label: "Tile" },
  { value: "carpet", label: "Carpet" },
  { value: "concrete", label: "Concrete" },
];

export default function RoomPanel() {
  const room = useStudio((s) => s.room);
  const setRoom = useStudio((s) => s.setRoom);
  const lighting = useStudio((s) => s.lighting);
  const setLighting = useStudio((s) => s.setLighting);

  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-4">
      <Section title="Dimensions">
        <Slider label="Width" value={room.width} min={2} max={12} step={0.1} unit="m"
          onChange={(width) => setRoom({ width })} />
        <Slider label="Depth" value={room.depth} min={2} max={12} step={0.1} unit="m"
          onChange={(depth) => setRoom({ depth })} />
        <Slider label="Height" value={room.height} min={2} max={4} step={0.1} unit="m"
          onChange={(height) => setRoom({ height })} />
        <p className="text-xs text-slate-500">
          Floor area ≈ <span className="text-slate-300">{(room.width * room.depth).toFixed(1)} m²</span>
        </p>
      </Section>

      <Section title="Walls">
        <ColorField label="Wall color" value={room.wallColor} onChange={(wallColor) => setRoom({ wallColor })} />
        <SwatchRow value={room.wallColor} onChange={(wallColor) => setRoom({ wallColor })} />
      </Section>

      <Section title="Floor">
        <SegMented options={FLOORS} value={room.floorMaterial} onChange={(floorMaterial) => setRoom({ floorMaterial })} />
        <ColorField label="Floor color" value={room.floorColor} onChange={(floorColor) => setRoom({ floorColor })} />
        <SwatchRow value={room.floorColor} onChange={(floorColor) => setRoom({ floorColor })} />
      </Section>

      <Section title="Lighting">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sun className="h-4 w-4 text-accent-400" /> Time of day
        </div>
        <Slider label="" value={lighting.timeOfDay} min={0} max={1} step={0.02}
          onChange={(timeOfDay) => setLighting({ timeOfDay })} />
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>Morning</span><span>Noon</span><span>Evening</span>
        </div>
        <Slider label="Ambient light" value={lighting.ambient} min={0} max={1.5} step={0.05}
          onChange={(ambient) => setLighting({ ambient })} />
        <Slider label="Sun intensity" value={lighting.directional} min={0} max={2.5} step={0.05}
          onChange={(directional) => setLighting({ directional })} />
        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <Lightbulb className="h-4 w-4 text-accent-400" /> Soft shadows
          </span>
          <input
            type="checkbox"
            checked={lighting.shadows}
            onChange={(e) => setLighting({ shadows: e.target.checked })}
            className="h-4 w-4 accent-brand-500"
          />
        </label>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h4>
      {children}
    </div>
  );
}
