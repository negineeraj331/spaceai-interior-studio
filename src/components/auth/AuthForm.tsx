"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Eye, EyeOff, Loader2, AlertCircle, Mail, Lock, User as UserIcon } from "lucide-react";
import { useAuth } from "@/store/auth-store";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const register = useAuth((s) => s.register);
  const user = useAuth((s) => s.user);
  const hydrate = useAuth((s) => s.hydrate);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already signed in, bounce to the studio.
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  useEffect(() => {
    if (user) router.replace("/studio");
  }, [user, router]);

  const isRegister = mode === "register";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (isRegister && password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    const res = isRegister
      ? await register(name, email, password)
      : await login(email, password);
    setBusy(false);
    if (res.ok) {
      router.replace("/studio");
    } else {
      setError(res.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="relative grid min-h-[100dvh] lg:grid-cols-2">
      {/* Visual brand side */}
      <div className="relative hidden overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink-950 via-ink-950/70 to-brand-900/30" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500">
              <Box className="h-5 w-5" />
            </span>
            Space<span className="gradient-text">AI</span>
          </Link>
          <div>
            <h2 className="max-w-sm font-display text-3xl font-bold leading-tight text-white text-balance">
              Design your dream room before you spend a cent.
            </h2>
            <p className="mt-3 max-w-sm text-slate-300">
              Photo → editable 3D space → AI layouts & photorealistic redesigns.
            </p>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-ink-950 px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2 font-display text-lg font-bold text-white lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500">
              <Box className="h-5 w-5" />
            </span>
            Space<span className="gradient-text">AI</span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-white">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {isRegister
              ? "Start designing rooms in minutes — it's free."
              : "Sign in to pick up where you left off."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {isRegister && (
              <Field
                icon={<UserIcon className="h-4 w-4" />}
                label="Name"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Jane Doe"
                autoComplete="name"
              />
            )}
            <Field
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegister ? "At least 6 characters" : "••••••••"}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className="input pl-9 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {isRegister && (
              <Field
                icon={<Lock className="h-4 w-4" />}
                label="Confirm password"
                type={show ? "text" : "password"}
                value={confirm}
                onChange={setConfirm}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 flex-none" /> {error}
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isRegister ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-brand-300 hover:text-brand-200">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to SpaceAI?{" "}
                <Link href="/register" className="font-medium text-brand-300 hover:text-brand-200">
                  Create an account
                </Link>
              </>
            )}
          </p>

          <p className="mt-8 text-center text-[11px] leading-relaxed text-slate-600">
            Demo accounts are stored locally in your browser (passwords are hashed). For a
            shared, secure account, connect a backend — see the schema doc.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-300">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="input pl-9"
          required
        />
      </div>
    </div>
  );
}
