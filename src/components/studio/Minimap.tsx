"use client";

import { useStudio } from "@/store/studio-store";
import { resolveTemplate as getTemplate } from "@/lib/template-registry";

const CAT_COLOR: Record<string, string> = {
  seating: "#3366ff",
  tables: "#c89b6a",
  storage: "#a78bfa",
  beds: "#f472b6",
  lighting: "#fbbf24",
  decor: "#22d3ee",
  rugs: "#fb7185",
  plants: "#34d399",
  kitchen: "#f97316",
  bathroom: "#38bdf8",
  outdoor: "#84cc16",
  electronics: "#e879f9",
};

/** Lightweight top-down 2D plan of the room and its furniture footprints. */
export default function Minimap() {
  const room = useStudio((s) => s.room);
  const objects = useStudio((s) => s.objects);
  const selectedIds = useStudio((s) => s.selectedIds);
  const select = useStudio((s) => s.select);

  const pad = 10;
  const scale = 22; // px per meter
  const w = room.width * scale + pad * 2;
  const h = room.depth * scale + pad * 2;

  const toX = (mx: number) => pad + (mx + room.width / 2) * scale;
  const toY = (mz: number) => pad + (mz + room.depth / 2) * scale;

  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 rounded-xl border border-white/10 bg-ink-950/80 p-2 backdrop-blur">
      <p className="mb-1 px-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
        Top view
      </p>
      <svg width={w} height={h} className="block">
        <rect
          x={pad}
          y={pad}
          width={room.width * scale}
          height={room.depth * scale}
          rx={4}
          fill="rgba(255,255,255,0.03)"
          stroke="#3a4663"
          strokeWidth={1.5}
        />
        {objects.map((o) => {
          const tpl = getTemplate(o.templateId);
          if (!tpl) return null;
          const ow = tpl.size[0] * o.scale * scale;
          const od = tpl.size[2] * o.scale * scale;
          const cx = toX(o.position[0]);
          const cy = toY(o.position[2]);
          const isSel = selectedIds.includes(o.uid);
          return (
            <g
              key={o.uid}
              transform={`translate(${cx} ${cy}) rotate(${(-o.rotation[1] * 180) / Math.PI})`}
              onClick={(e) => select(o.uid, e.shiftKey || e.metaKey || e.ctrlKey)}
              className="cursor-pointer"
            >
              <rect
                x={-ow / 2}
                y={-od / 2}
                width={ow}
                height={od}
                rx={2}
                fill={CAT_COLOR[o.category] ?? "#94a3b8"}
                fillOpacity={isSel ? 0.95 : 0.65}
                stroke={isSel ? "#fff" : "transparent"}
                strokeWidth={1.5}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
