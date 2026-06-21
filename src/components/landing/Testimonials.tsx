"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeading } from "./Features";

const QUOTES = [
  {
    quote:
      "I redesigned my whole living room before buying a single thing. The AI layout nailed where the sofa should go — I never would've tried it angled like that.",
    name: "Maya R.",
    role: "Homeowner, Austin",
  },
  {
    quote:
      "As a stager, this cut my mood-board time in half. Clients finally *get* the vision when they can spin the room around themselves.",
    name: "Daniel K.",
    role: "Property Stager",
  },
  {
    quote:
      "The Stable Diffusion previews are scary good. Showed three styles to my partner and we agreed in five minutes instead of five weeks.",
    name: "Priya S.",
    role: "Renter, Toronto",
  },
  {
    quote:
      "We use the Studio plan across our whole design team. Shared projects and branded renders make client reviews effortless.",
    name: "Elena M.",
    role: "Interior Designer",
  },
  {
    quote:
      "Uploaded a phone photo of my awkward narrow room and it figured out the proportions instantly. Genuinely impressed.",
    name: "Tom W.",
    role: "First-time buyer",
  },
  {
    quote:
      "The real-time recoloring saved me from a very expensive paint mistake. Worth it for that alone.",
    name: "Sofia L.",
    role: "Homeowner, Madrid",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Loved by designers & homeowners"
          title="12,000+ rooms reimagined and counting"
        />

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="card mb-5 break-inside-avoid p-6"
            >
              <div className="mb-3 flex gap-0.5 text-accent-400">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-slate-300">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-200">
                  {q.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{q.name}</p>
                  <p className="text-xs text-slate-400">{q.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
