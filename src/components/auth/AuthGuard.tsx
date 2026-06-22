"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box } from "lucide-react";
import { useAuth } from "@/store/auth-store";

/**
 * Gate for app features (studio, gallery): requires a signed-in user.
 * While the auth session hydrates we show a splash; if there's no user we
 * redirect to /login. Auth is client-side (localStorage) so this runs on mount.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const hydrate = useAuth((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-ink-950">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <span className="grid h-11 w-11 animate-pulse place-items-center rounded-xl bg-brand-500 text-white">
            <Box className="h-6 w-6" />
          </span>
          <div className="flex items-center gap-2 text-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            {hydrated ? "Redirecting to sign in…" : "Loading your session…"}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
