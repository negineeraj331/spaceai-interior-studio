import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Depth estimation endpoint. With a Replicate token this can call a MiDaS /
 * Depth-Anything model; without one it returns heuristic room hints derived
 * from the image aspect ratio so the 3D reconstruction still adapts per-photo.
 */
export async function POST(req: NextRequest) {
  try {
    const { imageUrl, aspect } = (await req.json()) as {
      imageUrl?: string;
      aspect?: number; // width / height
    };
    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required." },
        { status: 400 },
      );
    }

    const token = process.env.REPLICATE_API_TOKEN;
    if (token) {
      try {
        const Replicate = (await import("replicate")).default;
        const replicate = new Replicate({ auth: token });
        const output = await replicate.run(
          "cjwbw/midas:a6ba5798f04f80d3b314de0f0a62277f21ab3503c60c84d4817de83c5edfdae0",
          { input: { image: imageUrl, model_type: "dpt_beit_large_512" } },
        );
        return NextResponse.json({
          depthMapUrl: String(output),
          hints: hintsFromAspect(aspect ?? 1.5),
          mocked: false,
        });
      } catch (err) {
        console.error("[/api/depth] model failed, using heuristic:", err);
      }
    }

    return NextResponse.json({
      depthMapUrl: null,
      hints: hintsFromAspect(aspect ?? 1.5),
      mocked: true,
    });
  } catch (err) {
    console.error("[/api/depth]", err);
    return NextResponse.json({ error: "Depth estimation failed." }, { status: 500 });
  }
}

/** Map photo aspect ratio to plausible room proportions (meters). */
function hintsFromAspect(aspect: number) {
  const width = Math.min(9, Math.max(3, 4 + aspect * 1.2));
  const depth = Math.min(8, Math.max(3, width * 0.8));
  return {
    width: Number(width.toFixed(1)),
    depth: Number(depth.toFixed(1)),
    height: 2.8,
  };
}
