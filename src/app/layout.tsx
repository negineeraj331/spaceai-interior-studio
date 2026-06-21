import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "SpaceAI — AI Interior Design Studio",
    template: "%s · SpaceAI",
  },
  description:
    "Upload a photo of your room and watch AI rebuild it in 3D. Drag in furniture, recolor walls, and preview photorealistic redesigns — before you spend a cent.",
  keywords: [
    "AI interior design",
    "3D room planner",
    "furniture visualizer",
    "room redesign",
    "Stable Diffusion interior",
  ],
  openGraph: {
    title: "SpaceAI — AI Interior Design Studio",
    description:
      "Photo → editable 3D room → AI layouts & photorealistic redesigns.",
    url: appUrl,
    siteName: "SpaceAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpaceAI — AI Interior Design Studio",
    description: "Photo → editable 3D room → AI layouts & redesigns.",
  },
};

export const viewport: Viewport = {
  themeColor: "#070a13",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
