"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./Features";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Do I need any design or 3D experience?",
    a: "None at all. Upload a photo and the studio does the heavy lifting — AI estimates your room's dimensions and you simply drag furniture in. If you can use a phone, you can use SpaceAI.",
  },
  {
    q: "How accurate is the 3D reconstruction?",
    a: "We use depth estimation to approximate your room's proportions from a single photo, then let you fine-tune width, depth and height with sliders. It's designed for confident visualization, not millimeter-perfect CAD.",
  },
  {
    q: "What AI models power the redesigns?",
    a: "Room analysis runs on GPT-4 Vision, and photorealistic redesigns use Stable Diffusion (SDXL) via Replicate. The app also ships with high-quality offline previews so you can explore everything without any API keys.",
  },
  {
    q: "Can I use my own furniture?",
    a: "The Studio plan supports custom GLTF furniture uploads. Free and Pro plans include our growing catalog of 30+ models across every category.",
  },
  {
    q: "Where are my projects stored?",
    a: "Free projects autosave to your browser. Pro and Studio plans add encrypted cloud sync so your designs follow you across devices.",
  },
  {
    q: "Is there really a free plan?",
    a: "Yes — design unlimited rooms in 3D for free, with a few AI redesign renders included each month. No credit card required to start.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />

        <div className="mt-12 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-white">{f.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 flex-none text-slate-400 transition-transform",
                      isOpen && "rotate-180 text-brand-400",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden px-6 transition-all duration-300",
                    isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <p className="min-h-0 text-sm leading-relaxed text-slate-400">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
