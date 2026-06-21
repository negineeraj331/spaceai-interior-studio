"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeading } from "./Features";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Everything you need to redesign your first room.",
    features: [
      "Photo → 3D reconstruction",
      "Full 3D furniture editor",
      "AI room analysis",
      "3 redesign renders / month",
      "Local project saves",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    desc: "For serious renovators and frequent designers.",
    features: [
      "Everything in Free",
      "Unlimited AI redesigns",
      "4K render exports",
      "Full furniture catalog",
      "Cloud project sync",
      "Priority AI processing",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Studio",
    price: "$49",
    period: "/ month",
    desc: "For interior designers and staging teams.",
    features: [
      "Everything in Pro",
      "Client sharing & comments",
      "Branded render exports",
      "Custom furniture uploads",
      "Team workspaces",
      "API access",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative border-y border-white/5 bg-ink-900/40 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free. Upgrade when you're hooked."
          subtitle="No credit card required to design your first room. Cancel anytime."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl border p-7",
                t.highlight
                  ? "border-brand-400/50 bg-gradient-to-b from-brand-500/15 to-transparent shadow-xl shadow-brand-900/30"
                  : "border-white/10 bg-white/[0.02]",
              )}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-brand-500/30">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-white">{t.name}</h3>
              <div className="mt-3 flex items-end gap-1">
                <span className="font-display text-4xl font-extrabold text-white">{t.price}</span>
                <span className="mb-1 text-sm text-slate-400">{t.period}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{t.desc}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-brand-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/studio"
                className={cn("mt-7 w-full", t.highlight ? "btn-primary" : "btn-ghost")}
              >
                {t.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
