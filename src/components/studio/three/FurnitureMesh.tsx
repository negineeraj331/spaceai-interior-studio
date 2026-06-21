"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { PrimitivePart, PrimitiveSpec } from "@/types";
import { mixHex } from "@/lib/utils";

/**
 * Renders a piece of furniture from its procedural PrimitiveSpec.
 * Part colors derive from the object's base color so recoloring is instant,
 * while "frame"/"accent" parts keep their own tones for visual richness.
 */
export function FurnitureMesh({
  spec,
  color,
}: {
  spec: PrimitiveSpec;
  color: string;
}) {
  return (
    <group>
      {spec.parts.map((part, i) => (
        <Part key={i} part={part} baseColor={color} />
      ))}
    </group>
  );
}

function Part({ part, baseColor }: { part: PrimitivePart; baseColor: string }) {
  const color = useMemo(() => {
    if (part.color) return part.color;
    switch (part.role) {
      case "frame":
        return mixHex(baseColor, "#0a0a0a", 0.55);
      case "accent":
        return mixHex(baseColor, "#ffffff", 0.25);
      case "cushion":
        return mixHex(baseColor, "#ffffff", 0.12);
      default:
        return baseColor;
    }
  }, [part.color, part.role, baseColor]);

  const geometry = useMemo(() => buildGeometry(part), [part]);

  return (
    <mesh
      geometry={geometry}
      position={part.position}
      rotation={part.rotation ?? [0, 0, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        metalness={part.metalness ?? (part.role === "frame" ? 0.3 : 0.05)}
        roughness={part.roughness ?? 0.7}
      />
    </mesh>
  );
}

function buildGeometry(part: PrimitivePart): THREE.BufferGeometry {
  const a = part.args;
  switch (part.shape) {
    case "box":
      return new THREE.BoxGeometry(a[0], a[1], a[2]);
    case "cylinder":
      return new THREE.CylinderGeometry(a[0], a[0], a[1], a[2] ?? 16);
    case "cone":
      return new THREE.ConeGeometry(a[0], a[1], a[2] ?? 16);
    case "sphere":
      return new THREE.SphereGeometry(a[0], 20, 20);
    case "torus":
      return new THREE.TorusGeometry(a[0], a[1], 12, 24);
    default:
      return new THREE.BoxGeometry(0.5, 0.5, 0.5);
  }
}
