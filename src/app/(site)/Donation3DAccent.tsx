"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type * as THREE from "three";

/**
 * Ajuste ces deux teintes pour qu'elles correspondent exactement à
 * theme.colors.navy[900] / theme.colors.primary[400] dans ta config Tailwind —
 * ce composant ne peut pas lire les tokens Tailwind directement.
 */
const COLOR_PRIMARY = "#f4b942";
const COLOR_NAVY = "#1c3a63";

function GlassKnot() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.09;
    meshRef.current.rotation.y += delta * 0.14;
  });

  return (
    <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={1.6}>
        <torusKnotGeometry args={[1, 0.32, 200, 28]} />
        <MeshDistortMaterial
          color={COLOR_NAVY}
          distort={0.32}
          speed={1.4}
          roughness={0.1}
          metalness={0.55}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

interface Donation3DAccentProps {
  className?: string;
}

/**
 * Canvas décoratif (aria-hidden, pointer-events-none côté appelant) —
 * ne se monte pas du tout si l'utilisateur préfère les animations réduites,
 * plutôt que de figer une frame statique.
 */
export default function Donation3DAccent({ className }: Donation3DAccentProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
    const onChange = () => setEnabled(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!enabled) return null;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 3, 4]} intensity={1.2} color={COLOR_PRIMARY} />
        <directionalLight position={[-3, -2, -2]} intensity={0.4} color="#ffffff" />
        <GlassKnot />
      </Canvas>
    </div>
  );
}