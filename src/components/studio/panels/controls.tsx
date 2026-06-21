"use client";

import { cn } from "@/lib/utils";

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-slate-300">{label}</label>
        <span className="font-mono text-xs text-slate-400">
          {value.toFixed(step < 1 ? 2 : 0)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="range-input w-full"
      />
    </div>
  );
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-300">{label}</label>
      <div className="flex items-center gap-2">
        <label className="relative h-9 w-12 cursor-pointer overflow-hidden rounded-lg border border-white/15">
          <span className="block h-full w-full" style={{ background: value }} />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input font-mono uppercase"
        />
      </div>
    </div>
  );
}

const PALETTE = [
  "#e8e4dc", "#f5f0e8", "#d9d2c5", "#c7d2c0", "#a7bcc9",
  "#8a6d4b", "#b08d57", "#6b7280", "#3a4663", "#1f2937",
  "#9f1239", "#1e3a5f", "#15803d", "#b45309", "#0ea5e9",
];

export function SwatchRow({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PALETTE.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          title={c}
          className={cn(
            "h-7 w-7 rounded-md border transition-transform hover:scale-110",
            value.toLowerCase() === c.toLowerCase()
              ? "border-white ring-2 ring-brand-400"
              : "border-white/15",
          )}
          style={{ background: c }}
        />
      ))}
    </div>
  );
}

export function SegMented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-flow-col rounded-lg border border-white/10 bg-ink-800/60 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
            value === o.value ? "bg-brand-500 text-white" : "text-slate-300 hover:text-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
