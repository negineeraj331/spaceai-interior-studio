import { NextRequest, NextResponse } from "next/server";
import { analyzeRoom, openaiConfigured } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = (await req.json()) as { imageUrl?: string };
    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required." },
        { status: 400 },
      );
    }
    const analysis = await analyzeRoom(imageUrl);
    return NextResponse.json(analysis);
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ configured: openaiConfigured });
}
