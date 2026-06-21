"use client";

import { motion } from "framer-motion";
import { Upload, Boxes, Wand2, ArrowRight } from "lucide-react";
import { SectionHeading } from "./Features";

const STEPS = [
  {
    icon: Upload,
    step: "01",
    title: "Upload your room",
    body: "Drop in a single photo. AI estimates depth and dimensions to rebuild your space as a 3D scene.",
  },
  {
    icon: Boxes,
    step: "02",
    title: "Design in 3D",
    body: "Drag in furniture, recolor walls, and rearrange the layout — or let AI auto-arrange it for you.",
  },
  {
    icon: Wand2,
    step: "03",
    title: "Render & decide",
    body: "Generate a photorealistic preview, compare styles, and export the look you love.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative border-y border-white/5 bg-ink-900/40 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title="From photo to finished room in three steps"
          subtitle="No CAD skills, no measuring tape, no guesswork. Just upload and design."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              <div className="card h-full p-8">
                <div className="mb-5 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-inset ring-brand-400/20">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-4xl font-extrabold text-white/10">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
              </div>

              {i < STEPS.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-ink-800 text-brand-400 ring-1 ring-white/10">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
