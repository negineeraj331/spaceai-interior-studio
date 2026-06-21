import { NextRequest, NextResponse } from "next/server";
import { uploadImage, cloudinaryConfigured } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { image } = (await req.json()) as { image?: string };
    if (!image || !image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "A base64 image data URL is required." },
        { status: 400 },
      );
    }
    // Guard against very large payloads (~8MB of base64).
    if (image.length > 11_000_000) {
      return NextResponse.json(
        { error: "Image too large. Please use an image under 8MB." },
        { status: 413 },
      );
    }

    const result = await uploadImage(image);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/upload]", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ configured: cloudinaryConfigured });
}
