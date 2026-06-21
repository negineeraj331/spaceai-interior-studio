import { NextRequest, NextResponse } from "next/server";
import { redesignRoom, replicateConfigured } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, style, prompt } = (await req.json()) as {
      imageUrl?: string;
      style?: string;
      prompt?: string;
    };
    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required." },
        { status: 400 },
      );
    }
    const result = await redesignRoom(imageUrl, style ?? "modern", prompt);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/redesign]", err);
    return NextResponse.json(
      { error: "Redesign failed. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ configured: replicateConfigured });
}
