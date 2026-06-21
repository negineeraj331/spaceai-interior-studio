"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

function MiniSofa() {
  return (
    <group position={[0, 0, 0.6]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[2, 0.3, 0.9]} />
        <meshStandardMaterial color="#3366ff" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, -0.3]} castShadow>
        <boxGeometry args={[2, 0.45, 0.25]} />
        <meshStandardMaterial color="#598dff" roughness={0.7} />
      </mesh>
      <mesh position={[-0.85, 0.45, 0]} castShadow>
        <boxGeometry args={[0.25, 0.45, 0.9]} />
        <meshStandardMaterial color="#598dff" roughness={0.7} />
      </mesh>
      <mesh position={[0.85, 0.45, 0]} castShadow>
        <boxGeometry args={[0.25, 0.45, 0.9]} />
        <meshStandardMaterial color="#598dff" roughness={0.7} />
      </mesh>
    </group>
  );
}

function MiniTable() {
  return (
    <group position={[0, 0, -0.6]}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[1, 0.06, 0.55]} />
        <meshStandardMaterial color="#c89b6a" roughness={0.5} />
      </mesh>
      {[[-0.42, -0.22], [0.42, -0.22], [-0.42, 0.22], [0.42, 0.22]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.18, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.36, 10]} />
          <meshStandardMaterial color="#8a6d4b" />
        </mesh>
      ))}
    </group>
  );
}

function MiniPlant() {
  return (
    <group position={[1.7, 0, -0.8]}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.36, 16]} />
        <meshStandardMaterial color="#a16207" />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Room() {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color="#b08d57" roughness={0.85} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 1.4, -2.5]} receiveShadow>
        <planeGeometry args={[6, 2.8]} />
        <meshStandardMaterial color="#e8e4dc" roughness={1} />
      </mesh>
      {/* left wall */}
      <mesh position={[-3, 1.4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5, 2.8]} />
        <meshStandardMaterial color="#ded9cf" roughness={1} />
      </mesh>
      <MiniSofa />
      <MiniTable />
      <MiniPlant />
    </group>
  );
}

export default function HeroPreview() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-ink-800/60 to-ink-950 shadow-2xl shadow-brand-900/30 md:h-[520px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [4.5, 3.2, 5], fov: 42 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 7, 4]}
            intensity={1.4}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
            <Room />
          </Float>
          <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={12} blur={2.4} far={4} />
          <Environment preset="apartment" />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.8}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 chip bg-ink-950/70">
        <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Live 3D preview
      </div>
    </div>
  );
}
