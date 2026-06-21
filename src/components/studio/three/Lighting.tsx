"use client";

import { useMemo } from "react";
import type { LightingConfig } from "@/types";
import { mixHex } from "@/lib/utils";

/**
 * Lighting rig driven by LightingConfig. `timeOfDay` (0..1) sweeps the sun
 * from a low warm morning angle to a high neutral noon to a low cool evening,
 * tinting both the key light and the ambient fill.
 */
export function Lighting({
  config,
  roomWidth,
  roomDepth,
  roomHeight,
}: {
  config: LightingConfig;
  roomWidth: number;
  roomDepth: number;
  roomHeight: number;
}) {
  const { ambient, directional, timeOfDay, shadows } = config;

  const { sunPos, sunColor, ambientColor } = useMemo(() => {
    const t = timeOfDay; // 0 morning → 0.5 noon → 1 evening
    const angle = Math.PI * (0.15 + t * 0.7); // arc across the sky
    const x = Math.cos(angle) * roomWidth;
    const y = Math.sin(angle) * roomHeight * 2.5 + 1.5;
    const z = roomDepth * 0.7;

    // warm at the edges of the day, neutral at noon
    const warmth = Math.abs(t - 0.5) * 2; // 0 at noon, 1 at extremes
    const warm = "#ffd9a0";
    const cool = "#cfe0ff";
    const sun = t < 0.5 ? mixHex("#ffffff", warm, warmth) : mixHex("#ffffff", cool, warmth);
    const amb = t < 0.5 ? mixHex("#dfe6ff", warm, warmth * 0.5) : mixHex("#dfe6ff", cool, warmth * 0.5);

    return { sunPos: [x, y, z] as [number, number, number], sunColor: sun, ambientColor: amb };
  }, [timeOfDay, roomWidth, roomDepth, roomHeight]);

  return (
    <>
      <ambientLight intensity={ambient} color={ambientColor} />
      <hemisphereLight intensity={ambient * 0.4} color="#ffffff" groundColor="#3a4663" />
      <directionalLight
        position={sunPos}
        intensity={directional}
        color={sunColor}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-roomWidth}
        shadow-camera-right={roomWidth}
        shadow-camera-top={roomDepth}
        shadow-camera-bottom={-roomDepth}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.0004}
      />
      {/* gentle fill from the opposite side */}
      <directionalLight position={[-sunPos[0], sunPos[1] * 0.6, -sunPos[2]]} intensity={directional * 0.25} color={ambientColor} />
    </>
  );
}
