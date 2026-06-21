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
  onSelect: (id: string) => void;
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
        onSelect(obj.uid);
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
  const selectedId = useStudio((s) => s.selectedId);
  const showGrid = useStudio((s) => s.showGrid);
  const cameraPreset = useStudio((s) => s.cameraPreset);
  const select = useStudio((s) => s.select);
  const updateObject = useStudio((s) => s.updateObject);
  // Re-render placed objects once custom models finish registering after reload.
  useCustomFurniture((s) => s.templates.length);

  const [dragging, setDragging] = useState(false);
  const proxyRef = useRef<THREE.Group>(null);
  const { camera, controls } = useThree() as any;

  const selected = objects.find((o) => o.uid === selectedId) ?? null;

  // Sync proxy transform → store on gizmo change.
  const handleGizmoChange = () => {
    const p = proxyRef.current;
    if (!p || !selected) return;
    const pos = applySnap([p.position.x, p.position.y, p.position.z]);
    p.position.set(pos[0], Math.max(0, pos[1]), pos[2]);
    updateObject(selected.uid, {
      position: [p.position.x, p.position.y, p.position.z],
      rotation: [p.rotation.x, p.rotation.y, p.rotation.z],
      scale: (p.scale.x + p.scale.y + p.scale.z) / 3,
    });
  };

  // Keep the invisible proxy aligned with the selected object.
  useEffect(() => {
    const p = proxyRef.current;
    if (!p || !selected) return;
    p.position.set(...selected.position);
    p.rotation.set(...selected.rotation);
    p.scale.setScalar(selected.scale);
  }, [selected]);

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
        <ObjectView key={o.uid} obj={o} selected={o.uid === selectedId} onSelect={select} />
      ))}

      {/* Invisible proxy the gizmo manipulates */}
      <group ref={proxyRef} visible={false}>
        <mesh>
          <boxGeometry args={[0.01, 0.01, 0.01]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>

      {selected && (
        <Gizmo targetRef={proxyRef} onChange={handleGizmoChange} onDragChange={setDragging} />
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
