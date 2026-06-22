import type { Metadata } from "next";
import StudioShell from "@/components/studio/StudioShell";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Studio",
  description: "Design your room in 3D with AI.",
};

export default function StudioPage() {
  return (
    <AuthGuard>
      <StudioShell />
    </AuthGuard>
  );
}
