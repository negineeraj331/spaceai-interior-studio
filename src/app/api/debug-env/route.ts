import { NextResponse } from "next/server";

// TEMPORARY diagnostic — reports the PRESENCE of expected env vars (booleans)
// and any env var NAMES matching our providers. It NEVER returns secret values.
// Remove after diagnosing production env configuration.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const present = {
    OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
    REPLICATE_API_TOKEN: Boolean(process.env.REPLICATE_API_TOKEN),
    CLOUDINARY_CLOUD_NAME: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    CLOUDINARY_API_KEY: Boolean(process.env.CLOUDINARY_API_KEY),
    CLOUDINARY_API_SECRET: Boolean(process.env.CLOUDINARY_API_SECRET),
  };

  // Names only (no values) of any vars that look provider-related — surfaces typos.
  const matchingNames = Object.keys(process.env)
    .filter((k) => /OPENAI|REPLICATE|CLOUDINARY/i.test(k))
    .sort();

  return NextResponse.json({
    present,
    matchingNames,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  });
}
