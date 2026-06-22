"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  TransformControls,
  Grid,
  ContactShadows,
  Environment,
  Bounds,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { useStudio, applySnap } from "@/store/studio-store";
import { useCustomFurniture } from "@/store/custom-furniture-store";
import { resolveTemplate } from "@/lib/template-registry";
import type { SceneObject, Vec3, CameraPreset } from "@/types";
import { Room } from "./Room";
import { Lighting } from "./Lighting";
import { FurnitureMesh } from "./FurnitureMesh";
import { GltfModel } from "./GltfModel";

const PRESET_POS: Record<CameraPreset, Vec3> = {
  perspective: [6, 5, 7],
  top: [0, 12, 0.01],
  front: [0, 2.2, 9],
  corner: [7, 3, 7],
};

function ObjectView({
  obj,
  selected,
  onSelect,
}: {
  obj: SceneObject;
  selected: boolean;
  onSelect: (id: string, additive: boolean) => void;
}) {
  const tpl = resolveTemplate(obj.templateId);
  if (!tpl) return null;

  const primitive = <FurnitureMesh spec={tpl.primitive} color={obj.color} />;

  return (
    <group
      position={obj.position}
      rotation={obj.rotation}
      scale={obj.scale}
      onClick={(e) => {
        e.stopPropagation();
        const ne = e.nativeEvent as MouseEvent;
        onSelect(obj.uid, ne.shiftKey || ne.metaKey || ne.ctrlKey);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {tpl.modelUrl ? (
        <GltfModel url={tpl.modelUrl} targetSize={tpl.size} fallback={primitive} />
      ) : (
        primitive
      )}
      {selected && <SelectionRing size={Math.max(tpl.size[0], tpl.size[2])} />}
    </group>
  );
}

function SelectionRing({ size }: { size: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
      <ringGeometry args={[size * 0.62, size * 0.72, 48]} />
      <meshBasicMaterial color="#3366ff" transparent opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** A floating measurement pill positioned in 3D space. */
function DimLabel({ position, text, accent }: { position: Vec3; text: string; accent?: boolean }) {
  return (
    <Html position={position} center distanceFactor={10} zIndexRange={[20, 0]} pointerEvents="none">
      <div
        className={
          "select-none whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold shadow-md " +
          (accent ? "bg-brand-500 text-white" : "bg-ink-950/90 text-slate-100 ring-1 ring-white/15")
        }
      >
        {text}
      </div>
    </Html>
  );
}

/** Width/depth measurements along two room edges. */
function RoomDimensions({ width, depth }: { width: number; depth: number }) {
  return (
    <>
      <DimLabel position={[0, 0.08, depth / 2 + 0.25]} text={`${width.toFixed(1)} m`} />
      <DimLabel position={[width / 2 + 0.25, 0.08, 0]} text={`${depth.toFixed(1)} m`} />
    </>
  );
}

/** Footprint + height of the selected piece, floating above it. */
function ObjectDimensions({
  position,
  size,
  scale,
}: {
  position: Vec3;
  size: Vec3;
  scale: number;
}) {
  const w = (size[0] * scale).toFixed(2);
  const d = (size[2] * scale).toFixed(2);
  const h = (size[1] * scale).toFixed(2);
  return (
    <DimLabel
      position={[position[0], position[1] + size[1] * scale + 0.35, position[2]]}
      text={`${w} × ${d} × ${h} m`}
      accent
    />
  );
}

/** Bridges drei TransformControls → Zustand, and pauses OrbitControls while dragging. */
function Gizmo({
  targetRef,
  onChange,
  onDragChange,
}: {
  targetRef: React.RefObject<THREE.Object3D>;
  onChange: () => void;
  onDragChange: (dragging: boolean) => void;
}) {
  const mode = useStudio((s) => s.transformMode);
  if (!targetRef.current) return null;
  return (
    <TransformControls
      object={targetRef.current}
      mode={mode}
      translationSnap={0.05}
      rotationSnap={Math.PI / 24}
      scaleSnap={0.05}
      showY={mode !== "translate"}
      onObjectChange={onChange}
      onMouseDown={() => onDragChange(true)}
      onMouseUp={() => onDragChange(false)}
    />
  );
}

function SceneContents() {
  const room = useStudio((s) => s.room);
  const lighting = useStudio((s) => s.lighting);
  const objects = useStudio((s) => s.objects);
  const selectedIds = useStudio((s) => s.selectedIds);
  const showGrid = useStudio((s) => s.showGrid);
  const showDimensions = useStudio((s) => s.showDimensions);
  const cameraPreset = useStudio((s) => s.cameraPreset);
  const select = useStudio((s) => s.select);
  const nudgeSelected = useStudio((s) => s.nudgeSelected);
  const rotateSelected = useStudio((s) => s.rotateSelected);
  const scaleSelected = useStudio((s) => s.scaleSelected);
  // Re-render placed objects once custom models finish registering after reload.
  useCustomFurniture((s) => s.templates.length);

  const [dragging, setDragging] = useState(false);
  const proxyRef = useRef<THREE.Group>(null);
  const lastProxy = useRef({ pos: new THREE.Vector3(), rot: new THREE.Euler(), scale: 1 });
  const { camera, controls } = useThree() as any;

  const selectedSet = new Set(selectedIds);
  const selectedObjects = objects.filter((o) => selectedSet.has(o.uid));
  const primary = selectedObjects[0] ?? null;
  const primaryTemplate = primary ? resolveTemplate(primary.templateId) : null;

  // Re-center the gizmo proxy on the selection's centroid with neutral orientation.
  const resetProxy = () => {
    const p = proxyRef.current;
    if (!p) return;
    const c = new THREE.Vector3();
    const sel = useStudio.getState().objects.filter((o) => selectedSet.has(o.uid));
    if (sel.length) {
      sel.forEach((o) => c.add(new THREE.Vector3(...o.position)));
      c.multiplyScalar(1 / sel.length);
    }
    p.position.copy(c);
    p.rotation.set(0, 0, 0);
    p.scale.setScalar(1);
    lastProxy.current.pos.copy(c);
    lastProxy.current.rot.set(0, 0, 0);
    lastProxy.current.scale = 1;
  };

  // Apply gizmo movement as a delta to every selected object (group transform).
  const handleGizmoChange = () => {
    const p = proxyRef.current;
    if (!p) return;
    const mode = useStudio.getState().transformMode;
    if (mode === "translate") {
      const snapped = applySnap([p.position.x, p.position.y, p.position.z]);
      p.position.set(snapped[0], Math.max(0, snapped[1]), snapped[2]);
      const d: Vec3 = [
        p.position.x - lastProxy.current.pos.x,
        p.position.y - lastProxy.current.pos.y,
        p.position.z - lastProxy.current.pos.z,
      ];
      if (d[0] || d[1] || d[2]) nudgeSelected(d);
      lastProxy.current.pos.copy(p.position);
    } else if (mode === "rotate") {
      const d: Vec3 = [
        p.rotation.x - lastProxy.current.rot.x,
        p.rotation.y - lastProxy.current.rot.y,
        p.rotation.z - lastProxy.current.rot.z,
      ];
      if (d[0] || d[1] || d[2]) rotateSelected(d);
      lastProxy.current.rot.copy(p.rotation);
    } else {
      const avg = (p.scale.x + p.scale.y + p.scale.z) / 3;
      const ratio = avg / (lastProxy.current.scale || 1);
      if (Math.abs(ratio - 1) > 1e-5) scaleSelected(ratio);
      lastProxy.current.scale = avg;
    }
  };

  const handleDragChange = (d: boolean) => {
    setDragging(d);
    if (d) useStudio.getState().commit(); // one undo step per drag
    else resetProxy(); // re-center after the drag completes
  };

  // Reset the proxy whenever the selection changes.
  useEffect(() => {
    resetProxy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.join(",")]);

  // Apply camera presets.
  useEffect(() => {
    const pos = PRESET_POS[cameraPreset];
    camera.position.set(...pos);
    camera.lookAt(0, 0.5, 0);
    if (controls) controls.target.set(0, 0.5, 0);
  }, [cameraPreset, camera, controls]);

  return (
    <>
      <Lighting
        config={lighting}
        roomWidth={room.width}
        roomDepth={room.depth}
        roomHeight={room.height}
      />

      {/* Click empty floor to deselect */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.001, 0]}
        onPointerDown={() => !dragging && select(null)}
      >
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <Room room={room} />

      {objects.map((o) => (
        <ObjectView key={o.uid} obj={o} selected={selectedSet.has(o.uid)} onSelect={select} />
      ))}

      {showDimensions && <RoomDimensions width={room.width} depth={room.depth} />}
      {showDimensions && primary && primaryTemplate && (
        <ObjectDimensions
          position={primary.position}
          size={primaryTemplate.size}
          scale={primary.scale}
        />
      )}

      {/* Invisible proxy the gizmo manipulates */}
      <group ref={proxyRef} visible={false}>
        <mesh>
          <boxGeometry args={[0.01, 0.01, 0.01]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>

      {selectedObjects.length > 0 && (
        <Gizmo targetRef={proxyRef} onChange={handleGizmoChange} onDragChange={handleDragChange} />
      )}

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={lighting.shadows ? 0.45 : 0}
        scale={Math.max(room.width, room.depth) * 1.4}
        blur={2.2}
        far={5}
      />

      {showGrid && (
        <Grid
          position={[0, 0.005, 0]}
          args={[room.width, room.depth]}
          cellSize={0.5}
          cellThickness={0.6}
          cellColor="#2a3550"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#3a4663"
          fadeDistance={28}
          infiniteGrid={false}
        />
      )}

      <Environment preset="apartment" />

      <OrbitControls
        makeDefault
        enabled={!dragging}
        enablePan
        minDistance={2}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

export default function Scene({ canvasRef }: { canvasRef?: React.RefObject<HTMLCanvasElement> }) {
  return (
    <Canvas
      ref={canvasRef as any}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      camera={{ position: [6, 5, 7], fov: 45 }}
      className="touch-none"
    >
      <color attach="background" args={["#0b0f1a"]} />
      <fog attach="fog" args={["#0b0f1a", 22, 45]} />
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
