"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Home, Compass as CompassIcon } from "lucide-react";

// ==========================================
// 1. BOUSSOLE 3D INTERACTIVE (3D COMPASS)
// ==========================================
function Floating3DCompass() {
  const groupRef = useRef<THREE.Group>(null!);
  const needleRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();

    // Orient suave de la boussole vers le curseur
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.8,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.5,
      0.05
    );

    // Oscillation continuelle de l'aiguille magnétique
    if (needleRef.current) {
      needleRef.current.rotation.z = Math.sin(t * 2) * 0.2 + Math.cos(t * 3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <group ref={groupRef} scale={1.3}>
        {/* Anneau extérieur de la boussole */}
        <mesh>
          <torusGeometry args={[1.2, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Cadran intérieur translucide */}
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[1.15, 64]} />
          <meshPhysicalMaterial
            color="#030712"
            transmission={0.6}
            opacity={0.8}
            transparent
            roughness={0.1}
            ior={1.5}
          />
        </mesh>

        {/* Sphère centrale en fil de fer (Énergie) */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={2}
            wireframe
          />
        </mesh>

        {/* Aiguille Nord / Sud */}
        <group ref={needleRef}>
          {/* Pointe Nord (Gold/Amber) */}
          <mesh position={[0, 0.5, 0.05]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.12, 0.9, 4]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#d97706"
              emissiveIntensity={1}
            />
          </mesh>
          {/* Pointe Sud (Cyan) */}
          <mesh position={[0, -0.5, 0.05]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.12, 0.9, 4]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1}
            />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

// ==========================================
// 2. GRILLE D'HORIZON 3D (CYBER GRID)
// ==========================================
function HorizonGrid() {
  const gridRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.getElapsedTime() * 0.4) % 1;
    }
  });

  return (
    <mesh
      ref={gridRef}
      rotation={[-Math.PI / 2.2, 0, 0]}
      position={[0, -2.5, 0]}
    >
      <planeGeometry args={[30, 30, 40, 40]} />
      <meshBasicMaterial
        color="#0284c7"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// ==========================================
// 3. COMPOSANT PAGE 404 COMPLET
// ==========================================
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#020617] text-white selection:bg-cyan-500 selection:text-black">
      
      {/* 🔮 CANVAS THREE.JS ARRIÈRE-PLAN */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#fbbf24" />
          <pointLight position={[-5, -5, -2]} intensity={2} color="#38bdf8" />

          {/* Scène 3D */}
          <Floating3DCompass />
          <HorizonGrid />
          
          {/* Étoiles et Particules */}
          <Sparkles
            count={120}
            scale={10}
            size={2}
            speed={0.5}
            opacity={0.6}
            color="#38bdf8"
          />
          <Sparkles
            count={40}
            scale={8}
            size={4}
            speed={0.8}
            opacity={0.8}
            color="#fbbf24"
          />
        </Canvas>
      </div>

      {/* 🎭 OVERLAYS ET FONDUS DE DEGRADÉS */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-radial-gradient from-transparent via-[#020617]/50 to-[#020617]" />
      
      {/* 📄 CONTENU TEXTUEL & UI (GLASSMORPHISME) */}
      <main className="relative z-20 flex max-w-lg flex-col items-center px-6 text-center">
        
        {/* Badge 404 Glow */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-500/10">
          <CompassIcon className="h-4 w-4 animate-spin text-amber-400" style={{ animationDuration: "10s" }} />
          <span>ERREUR 404 • VOIE PERDUE</span>
        </div>

        {/* Titre Geant */}
        <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
          <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Page introuvable
          </span>
        </h1>

        {/* Message */}
        <p className="mt-4 text-base text-slate-300 sm:text-lg font-light leading-relaxed">
          Il semble que la boussole ait perdu le nord. Cette page n&apos;existe pas ou a été déplacée vers une autre destination.
        </p>

        {/* Bouton d'action */}
        <div className="mt-8 flex items-center justify-center">
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 font-bold text-white shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40 active:scale-95"
          >
            <Home className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Retour à l&apos;accueil</span>
          </Link>
        </div>
      </main>

      {/* Signature / Footer discret */}
      <footer className="absolute bottom-6 z-20 text-xs text-slate-500 font-mono">
        Fondation Saran Camara • Éducation &amp; Protection
      </footer>
    </div>
  );
}