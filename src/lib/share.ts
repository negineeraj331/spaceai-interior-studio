import type { SavedProject, SceneObject, RoomConfig, LightingConfig } from "@/types";

// ─────────────────────────────────────────────────────────────
// Keyless scene sharing: pack the essential scene into a compact,
// URL-safe string. No backend required — the whole design travels
// inside the link itself (?d=...). Numbers are rounded to keep URLs short.
// ─────────────────────────────────────────────────────────────

const VERSION = 1;

const r = (n: number, p = 3) => Number(n.toFixed(p));

interface PackedScene {
  v: number;
  n: string; // name
  rm: [number, number, number, string, string, string]; // w,d,h,wall,floor,mat
  lt: [number, number, number, number]; // ambient, directional, tod, shadows(0/1)
  ph?: string; // photoUrl (omitted if it's a huge data URL)
  o: PackedObject[];
}

// [templateId, x,y,z, rx,ry,rz, scale, color]
type PackedObject = [string, number, number, number, number, number, number, number, string];

function packObject(o: SceneObject): PackedObject {
  return [
    o.templateId,
    r(o.position[0]), r(o.position[1]), r(o.position[2]),
    r(o.rotation[0]), r(o.rotation[1]), r(o.rotation[2]),
    r(o.scale, 2),
    o.color,
  ];
}

function unpackObject(p: PackedObject, i: number): Omit<SceneObject, "name" | "category"> {
  return {
    uid: `shared_${i}`,
    templateId: p[0],
    position: [p[1], p[2], p[3]],
    rotation: [p[4], p[5], p[6]],
    scale: p[7],
    color: p[8],
  };
}

export function encodeScene(project: SavedProject): string {
  const rm: PackedScene["rm"] = [
    r(project.room.width, 2), r(project.room.depth, 2), r(project.room.height, 2),
    project.room.wallColor, project.room.floorColor, project.room.floorMaterial,
  ];
  const lt: PackedScene["lt"] = [
    r(project.lighting.ambient, 2), r(project.lighting.directional, 2),
    r(project.lighting.timeOfDay, 2), project.lighting.shadows ? 1 : 0,
  ];
  const packed: PackedScene = {
    v: VERSION,
    n: project.name,
    rm,
    lt,
    // Only carry remote photo URLs (skip multi-MB data URLs to keep links sane).
    ph: project.photoUrl && project.photoUrl.startsWith("http") ? project.photoUrl : undefined,
    o: project.objects.map(packObject),
  };
  return toBase64Url(JSON.stringify(packed));
}

export interface DecodedScene {
  name: string;
  room: RoomConfig;
  lighting: LightingConfig;
  objects: Array<Omit<SceneObject, "name" | "category">>;
  photoUrl?: string;
}

export function decodeScene(encoded: string): DecodedScene | null {
  try {
    const json = fromBase64Url(encoded);
    const p = JSON.parse(json) as PackedScene;
    if (p.v !== VERSION || !Array.isArray(p.o)) return null;
    const room: RoomConfig = {
      width: p.rm[0], depth: p.rm[1], height: p.rm[2],
      wallColor: p.rm[3], floorColor: p.rm[4],
      floorMaterial: p.rm[5] as RoomConfig["floorMaterial"],
    };
    const lighting: LightingConfig = {
      ambient: p.lt[0], directional: p.lt[1], timeOfDay: p.lt[2], shadows: p.lt[3] === 1,
    };
    return {
      name: p.n || "Shared design",
      room,
      lighting,
      objects: p.o.map(unpackObject),
      photoUrl: p.ph,
    };
  } catch {
    return null;
  }
}

// Base64URL helpers that survive unicode (names) safely.
function toBase64Url(str: string): string {
  const b64 =
    typeof window === "undefined"
      ? Buffer.from(str, "utf-8").toString("base64")
      : btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  if (typeof window === "undefined") return Buffer.from(b64, "base64").toString("utf-8");
  return decodeURIComponent(escape(atob(b64)));
}
