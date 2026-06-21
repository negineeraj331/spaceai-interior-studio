"use client";

import { useMemo, Suspense, Component, type ReactNode } from "react";
import { useGLTF, Clone } from "@react-three/drei";
import * as THREE from "three";
import type { Vec3 } from "@/types";

/**
 * Renders a GLTF/GLB model, auto-scaled to the template's target footprint and
 * recentered so it sits on the floor (y=0) centered on the object origin.
 * Wrapped by ModelErrorBoundary so a failed/invalid model falls back to a primitive.
 */
function GltfInner({ url, targetSize }: { url: string; targetSize: Vec3 }) {
  const { scene } = useGLTF(url);

  const { scale, position } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Fit the larger of the floor-plane dimensions to the target footprint.
    const maxTarget = Math.max(targetSize[0], targetSize[2]) || 1;
    const maxSource = Math.max(size.x, size.z) || 1;
    const s = maxTarget / maxSource;

    return {
      scale: s,
      position: [-center.x * s, -box.min.y * s, -center.z * s] as Vec3,
    };
  }, [scene, targetSize]);

  return (
    <group scale={scale} position={position}>
      <Clone object={scene} castShadow receiveShadow />
    </group>
  );
}

export function GltfModel({
  url,
  targetSize,
  fallback,
}: {
  url: string;
  targetSize: Vec3;
  fallback: ReactNode;
}) {
  return (
    <ModelErrorBoundary fallback={fallback}>
      <Suspense fallback={null}>
        <GltfInner url={url} targetSize={targetSize} />
      </Suspense>
    </ModelErrorBoundary>
  );
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    // A broken/unreachable model URL — silently use the primitive fallback.
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
