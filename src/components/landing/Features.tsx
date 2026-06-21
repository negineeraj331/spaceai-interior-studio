"use client";

import { motion } from "framer-motion";
import {
  ScanLine,
  Move3d,
  Wand2,
  Palette,
  Image as ImageIcon,
  LayoutGrid,
  Sun,
  Download,
} from "lucide-react";

const FEATURES = [
  {
    icon: ScanLine,
    title: "Photo → 3D reconstruction",
    body: "Depth estimation turns a single room photo into an editable 3D scene with realistic proportions.",
  },
  {
    icon: Move3d,
    title: "Drag-and-drop furniture",
    body: "Place, move, rotate and scale 30+ furniture models in real time with snapping and transform gizmos.",
  },
  {
    icon: Wand2,
    title: "GPT-4 Vision analysis",
    body: "AI reads your room — style, lighting, dimensions — and suggests layouts tailored to the space.",
  },
  {
    icon: ImageIcon,
    title: "Stable Diffusion redesigns",
    body: "Generate photorealistic previews of your room in any style, from Scandinavian to industrial.",
  },
  {
    icon: Palette,
    title: "Live wall & floor recolor",
    body: "Try any paint color or flooring material and see it update across the whole room instantly.",
  },
  {
    icon: LayoutGrid,
    title: "AI auto-arrange",
    body: "One click and the layout engine arranges your furniture into a balanced, walkable plan.",
  },
  {
    icon: Sun,
    title: "Lighting & time of day",
    body: "Sweep from warm morning to cool evening light to see how your room feels at any hour.",
  },
  {
    icon: Download,
    title: "Export & share",
    body: "Save projects, export the scene as JSON, or download a high-res render to share with anyone.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Everything in one studio"
          title="A full design toolkit, powered by AI"
          subtitle="From the first photo to the final render, every step lives in a single, fast, browser-based studio."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
              className="card group p-6 transition-colors hover:border-brand-400/40 hover:bg-white/[0.05]"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-inset ring-brand-400/20 transition-colors group-hover:bg-brand-500/25">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-slate-400">{subtitle}</p>}
    </div>
  );
}
