"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./Features";

const STYLES = [
  {
    key: "Scandinavian",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&q=80",
    desc: "Light oak, soft textiles, and uncluttered calm.",
  },
  {
    key: "Industrial",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&q=80",
    desc: "Exposed materials, metal accents, warm Edison glow.",
  },
  {
    key: "Japandi",
    img: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1000&q=80",
    desc: "Low furniture, muted tones, quiet minimalism.",
  },
  {
    key: "Luxury",
    img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1000&q=80",
    desc: "Marble, velvet, and dramatic statement lighting.",
  },
];

export default function Showcase() {
  const [active, setActive] = useState(0);

  return (
    <section id="showcase" className="relative py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="One room, every style"
          title="See your space reimagined instantly"
          subtitle="Switch styles and let Stable Diffusion repaint the entire room while keeping its bones intact."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <motion.div
            key={active}
            initial={{ opacity: 0.4, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={STYLES[active].img}
              alt={STYLES[active].key}
              className="h-[300px] w-full object-cover sm:h-[440px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <div className="chip mb-2 bg-ink-950/60">AI-generated preview</div>
              <h3 className="font-display text-2xl font-bold text-white">
                {STYLES[active].key}
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-300">{STYLES[active].desc}</p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-3">
            {STYLES.map((s, i) => (
              <button
                key={s.key}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`group flex items-center gap-4 rounded-xl border p-3 text-left transition-all ${
                  active === i
                    ? "border-brand-400/50 bg-brand-500/10"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt="" className="h-16 w-16 flex-none rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="font-semibold text-white">{s.key}</p>
                  <p className="truncate text-sm text-slate-400">{s.desc}</p>
                </div>
              </button>
            ))}
            <Link href="/studio" className="btn-primary mt-2 w-full">
              Try it on your room <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
