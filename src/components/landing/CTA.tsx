"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-24">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-brand-400/30 bg-gradient-to-br from-brand-600/30 via-ink-900 to-ink-950 px-8 py-16 text-center sm:px-16"
        >
          <div className="absolute inset-0 -z-10 bg-grid-faint [background-size:36px_36px] opacity-40" />
          <div className="absolute -top-24 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-500/30 blur-3xl" />

          <div className="chip mx-auto mb-6 bg-ink-950/50">
            <Sparkles className="h-3.5 w-3.5 text-accent-400" /> Your dream room is one photo away
          </div>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-balance">
            Stop imagining. Start designing.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            Upload a photo and see your space transformed in under a minute — completely free.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/studio" className="btn-primary text-base">
              Open the Studio <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/gallery" className="btn-ghost text-base">
              Browse the gallery
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
