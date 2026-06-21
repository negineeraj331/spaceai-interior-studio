"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";

// The 3D canvas is client-only and heavy — load it lazily.
const HeroPreview = dynamic(() => import("./HeroPreview"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full animate-pulse rounded-2xl border border-white/10 bg-ink-800/40 md:h-[520px]" />
  ),
});

const STATS = [
  { value: "12K+", label: "Rooms designed" },
  { value: "60s", label: "Photo → 3D" },
  { value: "30+", label: "Furniture models" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 -z-10 bg-radial-glow" />
      <div className="absolute inset-0 -z-10 bg-grid-faint [background-size:40px_40px] mask-fade-b opacity-60" />

      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="chip mb-6">
            <Sparkles className="h-3.5 w-3.5 text-accent-400" />
            AI-powered interior design, in your browser
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
            Redesign any room <span className="gradient-text">before</span> you spend a cent.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Upload a photo and watch AI rebuild your space in 3D. Drag in furniture,
            recolor walls, rearrange the layout in real time — then generate a
            photorealistic preview of the finished room.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/studio" className="btn-primary text-base">
              Start designing free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="btn-ghost text-base">
              <Play className="h-4 w-4" /> See how it works
            </a>
          </div>

          <dl className="mt-12 flex gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-2xl font-bold text-white">{s.value}</dt>
                <dd className="text-sm text-slate-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  );
}
