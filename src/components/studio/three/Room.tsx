"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { RoomConfig } from "@/types";
import { mixHex } from "@/lib/utils";

const FLOOR_ROUGHNESS: Record<RoomConfig["floorMaterial"], number> = {
  wood: 0.6,
  tile: 0.25,
  carpet: 1.0,
  concrete: 0.8,
};

/**
 * Parametric room shell: floor + ceiling + 4 walls sized from RoomConfig.
 * Walls are single-sided and face inward so the camera can orbit freely
 * without back walls occluding the view (we render only the far + side walls
 * relative to a typical viewing angle, plus thin baseboards for grounding).
 */
export function Room({ room }: { room: RoomConfig }) {
  const { width, depth, height, wallColor, floorColor } = room;
  const hw = width / 2;
  const hd = depth / 2;

  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: floorColor,
        roughness: FLOOR_ROUGHNESS[room.floorMaterial],
        metalness: 0.05,
      }),
    [floorColor, room.floorMaterial],
  );

  const wallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: wallColor,
        roughness: 0.95,
        side: THREE.DoubleSide,
      }),
    [wallColor],
  );

  const baseboardColor = useMemo(() => mixHex(wallColor, "#000000", 0.4), [wallColor]);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={floorMat}>
        <planeGeometry args={[width, depth]} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={mixHex(wallColor, "#ffffff", 0.15)} roughness={1} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, height / 2, -hd]} receiveShadow material={wallMat}>
        <planeGeometry args={[width, height]} />
      </mesh>

      {/* Front wall (transparent-ish, lets you see in) */}
      <mesh position={[0, height / 2, hd]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-hw, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={wallMat}>
        <planeGeometry args={[depth, height]} />
      </mesh>

      {/* Right wall */}
      <mesh position={[hw, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>

      {/* Baseboards on the two solid walls */}
      <mesh position={[0, 0.05, -hd + 0.01]}>
        <boxGeometry args={[width, 0.1, 0.02]} />
        <meshStandardMaterial color={baseboardColor} />
      </mesh>
      <mesh position={[-hw + 0.01, 0.05, 0]}>
        <boxGeometry args={[0.02, 0.1, depth]} />
        <meshStandardMaterial color={baseboardColor} />
      </mesh>
    </group>
  );
}
