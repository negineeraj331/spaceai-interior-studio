import OpenAI from "openai";
import type { RoomAnalysis, RedesignResult } from "@/types";

export const openaiConfigured = Boolean(process.env.OPENAI_API_KEY);
export const replicateConfigured = Boolean(process.env.REPLICATE_API_TOKEN);

const openai = openaiConfigured
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// ─────────────────────────────────────────────────────────────
// Room analysis via GPT-4 Vision (with deterministic mock fallback)
// ─────────────────────────────────────────────────────────────

const ANALYSIS_SCHEMA_HINT = `Return STRICT JSON, no markdown, matching:
{
  "roomType": string,                // e.g. "Living room"
  "detectedStyle": string,           // e.g. "Scandinavian"
  "dimensions": { "width": number, "depth": number, "height": number }, // meters, estimate
  "dominantColors": string[],        // up to 5 hex colors
  "lighting": string,                // short description
  "summary": string,                 // 1-2 sentences
  "suggestions": [                   // 3 layout ideas
    { "title": string, "description": string, "items": string[] }
  ]
}`;

export async function analyzeRoom(imageUrl: string): Promise<RoomAnalysis> {
  if (!openai) return mockAnalysis(imageUrl);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content:
            "You are an expert interior designer and spatial analyst. Analyze room photos and respond with strict JSON only.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this room photo for a 3D redesign tool. Estimate realistic dimensions in meters. ${ANALYSIS_SCHEMA_HINT}`,
            },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as Partial<RoomAnalysis>;
    return normalizeAnalysis(parsed, false);
  } catch (err) {
    console.error("[analyzeRoom] falling back to mock:", err);
    return mockAnalysis(imageUrl);
  }
}

function normalizeAnalysis(
  p: Partial<RoomAnalysis>,
  mocked: boolean,
): RoomAnalysis {
  return {
    roomType: p.roomType ?? "Living room",
    detectedStyle: p.detectedStyle ?? "Contemporary",
    dimensions: {
      width: clampNum(p.dimensions?.width, 2, 12, 5.5),
      depth: clampNum(p.dimensions?.depth, 2, 12, 4.5),
      height: clampNum(p.dimensions?.height, 2, 4, 2.8),
    },
    dominantColors:
      p.dominantColors?.slice(0, 5) ?? ["#e8e4dc", "#b08d57", "#3a4663"],
    lighting: p.lighting ?? "Soft natural daylight from the side",
    summary:
      p.summary ??
      "A balanced, well-proportioned space with good potential for an open, airy layout.",
    suggestions:
      p.suggestions && p.suggestions.length
        ? p.suggestions
        : DEFAULT_SUGGESTIONS,
    mocked,
  };
}

function clampNum(v: unknown, min: number, max: number, fallback: number) {
  const n = typeof v === "number" && isFinite(v) ? v : fallback;
  return Math.min(max, Math.max(min, n));
}

const DEFAULT_SUGGESTIONS = [
  {
    title: "Open & Airy",
    description:
      "Float the sofa off the back wall, anchor it with a large rug, and keep sightlines to the window clear.",
    items: ["3-Seat Sofa", "Area Rug", "Coffee Table", "Floor Lamp", "Fiddle-Leaf Fig"],
  },
  {
    title: "Cozy Conversation",
    description:
      "Pull seating into a tighter U-shape around a central table to encourage conversation.",
    items: ["3-Seat Sofa", "Accent Armchair", "Round Ottoman", "Side Table", "Round Rug"],
  },
  {
    title: "Work-from-Home Corner",
    description:
      "Carve out a productive nook with a desk against the wall and shelving for storage.",
    items: ["Work Desk", "Dining Chair", "Bookshelf", "Table Lamp", "Tabletop Succulent"],
  },
];

/** Deterministic, photo-agnostic analysis used when no API key is present. */
function mockAnalysis(imageUrl: string): RoomAnalysis {
  // Vary the "detected" style by a stable hash of the URL so it feels real.
  const styles = ["Scandinavian", "Mid-century Modern", "Japandi", "Industrial", "Contemporary"];
  const palettes = [
    ["#e8e4dc", "#b08d57", "#3a4663", "#9caf88"],
    ["#f5f0e8", "#8a6d4b", "#2c3e50", "#c0392b"],
    ["#ede8e0", "#6b7280", "#1f2937", "#d97706"],
  ];
  let h = 0;
  for (const ch of imageUrl) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const style = styles[h % styles.length];
  const palette = palettes[h % palettes.length];

  return {
    roomType: "Living room",
    detectedStyle: style,
    dimensions: { width: 5.5, depth: 4.5, height: 2.8 },
    dominantColors: palette,
    lighting: "Soft, diffuse daylight entering from one side — warm afternoon tone.",
    summary: `This reads as a ${style.toLowerCase()} space with strong natural light. There's room to add a defined seating zone and a touch of greenery without crowding the walkways.`,
    suggestions: DEFAULT_SUGGESTIONS,
    mocked: true,
  };
}

// ─────────────────────────────────────────────────────────────
// Redesign preview via Replicate Stable Diffusion (mock fallback)
// ─────────────────────────────────────────────────────────────

const STYLE_PROMPTS: Record<string, string> = {
  scandinavian:
    "scandinavian interior, light oak floors, white walls, cozy minimal furniture, soft natural light",
  modern: "modern minimalist interior, clean lines, neutral palette, designer furniture",
  industrial:
    "industrial loft interior, exposed brick, metal accents, leather furniture, warm edison lighting",
  bohemian: "bohemian interior, layered textiles, plants, rattan furniture, warm earthy tones",
  luxury: "luxury interior, marble, gold accents, plush velvet furniture, dramatic lighting",
  japandi: "japandi interior, low wooden furniture, muted tones, zen minimalism, paper lamps",
};

export async function redesignRoom(
  imageUrl: string,
  style: string,
  extraPrompt?: string,
): Promise<RedesignResult> {
  const styleKey = style.toLowerCase();
  const stylePrompt = STYLE_PROMPTS[styleKey] ?? `${style} interior design style`;
  const prompt = [
    "interior design photograph,",
    stylePrompt + ",",
    extraPrompt ?? "",
    "high quality, photorealistic, magazine quality, 8k, professional photography",
  ]
    .filter(Boolean)
    .join(" ");

  if (!replicateConfigured) {
    return {
      imageUrl: mockRedesignUrl(styleKey),
      style,
      prompt,
      mocked: true,
    };
  }

  try {
    // Lazy import so the dep is only loaded server-side when configured.
    const Replicate = (await import("replicate")).default;
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    // SDXL img2img — preserves room geometry while restyling.
    const output = (await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt,
          image: imageUrl,
          prompt_strength: 0.55,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          negative_prompt:
            "blurry, distorted, low quality, deformed, watermark, text, people",
        },
      },
    )) as unknown as string[];

    const url = Array.isArray(output) ? output[0] : String(output);
    return { imageUrl: url, style, prompt, mocked: false };
  } catch (err) {
    console.error("[redesignRoom] falling back to mock:", err);
    return { imageUrl: mockRedesignUrl(styleKey), style, prompt, mocked: true };
  }
}

/** Curated Unsplash interiors used as believable previews in mock mode. */
function mockRedesignUrl(styleKey: string): string {
  const gallery: Record<string, string> = {
    scandinavian:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
    modern: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    industrial:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    bohemian: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    luxury: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80",
    japandi: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=80",
  };
  return gallery[styleKey] ?? gallery.modern;
}
