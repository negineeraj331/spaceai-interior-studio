"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Box, Menu, X, LogOut, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth-store";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#showcase", label: "Showcase" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuth((s) => s.user);
  const hydrate = useAuth((s) => s.hydrate);
  const logout = useAuth((s) => s.logout);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-ink-950/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 shadow-lg shadow-brand-500/30">
            <Box className="h-5 w-5" />
          </span>
          Space<span className="gradient-text">AI</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/gallery" className="text-sm font-medium text-slate-300 hover:text-white">
            Gallery
          </Link>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 hover:bg-white/10"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-slate-200">{user.name.split(" ")[0]}</span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-ink-900/95 py-1 shadow-2xl backdrop-blur-xl"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div className="border-b border-white/10 px-3 py-2">
                    <p className="truncate text-sm font-medium text-white">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Link href="/studio" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
                    <LayoutGrid className="h-4 w-4" /> Open Studio
                  </Link>
                  <Link href="/gallery" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
                    <Box className="h-4 w-4" /> My designs
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-300 hover:bg-white/5"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white">
                Log in
              </Link>
              <Link href="/register" className="btn-primary">
                Sign up free
              </Link>
            </>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink-950/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-1 text-slate-300"
              >
                {l.label}
              </a>
            ))}
            <Link href="/gallery" className="py-1 text-slate-300" onClick={() => setOpen(false)}>
              Gallery
            </Link>
            {user ? (
              <>
                <Link href="/studio" className="btn-primary mt-2" onClick={() => setOpen(false)}>
                  Open Studio
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="btn-ghost mt-1"
                >
                  Sign out ({user.name.split(" ")[0]})
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost mt-2" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link href="/register" className="btn-primary" onClick={() => setOpen(false)}>
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
