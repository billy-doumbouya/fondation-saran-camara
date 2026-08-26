"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Scene3D() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.004;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 5, 3]} intensity={1.3} color="#e3b32c" />

      {/* Polyèdre 3D Flottant et Dore */}
      <Float speed={2.2} rotationIntensity={1.4} floatIntensity={1.3}>
        <mesh ref={meshRef} position={[3.5, 0, -2]}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial
            color="#e3b32c"
            wireframe
            transparent
            opacity={0.3}
            emissive="#b8860b"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* Particules Lumineuses Dorées et Émeraudes */}
      <Sparkles count={55} scale={10} size={3.5} speed={0.5} opacity={0.7} color="#4bb56d" />
      <Sparkles count={35} scale={8} size={4.5} speed={0.7} opacity={0.8} color="#e3b32c" />
    </>
  );
}

export default function Partners3DHeader() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
      <Scene3D />
    </Canvas>
  );
}