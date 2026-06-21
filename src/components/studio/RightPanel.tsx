"use client";

import { useState } from "react";
import { Sparkles, SlidersHorizontal, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import AIPanel from "./panels/AIPanel";
import RoomPanel from "./panels/RoomPanel";
import PropertiesPanel from "./panels/PropertiesPanel";

type Tab = "ai" | "properties" | "room";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "ai", label: "AI", icon: Sparkles },
  { id: "properties", label: "Object", icon: Box },
  { id: "room", label: "Room", icon: SlidersHorizontal },
];

export default function RightPanel() {
  const [tab, setTab] = useState<Tab>("ai");

  return (
    <aside className="flex w-[340px] flex-none flex-col border-l border-white/10 bg-ink-900/60">
      <div className="grid grid-cols-3 gap-1 border-b border-white/10 p-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors",
              tab === t.id ? "bg-brand-500 text-white" : "text-slate-300 hover:bg-white/5",
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "ai" && <AIPanel />}
      {tab === "properties" && <PropertiesPanel />}
      {tab === "room" && <RoomPanel />}
    </aside>
  );
}
