"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface GeometricMeshCanvasProps {
  variant?: "dark" | "light" | "hero";
  className?: string;
  enableMouseInteraction?: boolean;
}

/**
 * GeometricMeshCanvas — Moteur 3D WebGL d'ambiance FSCPE (Three.js)
 *
 * Caractéristiques :
 * - Grille topographique 3D ondulante géométrique (ondes sinusoïdales à mémoire de forme).
 * - Nuée de particules stellaires dorées & émeraudes en suspension lente.
 * - Parallaxe subtile au mouvement de la souris.
 * - 100% pointer-events-none pour ne jamais gêner les interactions et clics utilisateur.
 * - Respect des préférences d'accessibilité (prefers-reduced-motion) et pause automatique si hors-champ.
 * - Lisibilité garantie à 100% grâce à une opacité calibrée d'orfèvre.
 */
export default function GeometricMeshCanvas({
  variant = "dark",
  className = "",
  enableMouseInteraction = true,
}: GeometricMeshCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    // Accessibilité : pas d'animation lourde si l'utilisateur demande reduced-motion
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Configuration des couleurs selon la charte FSCPE
    const isLight = variant === "light";
    const meshColor = isLight ? 0x227a3f : 0xd4a017; // vert émeraude ou or noble
    const particleColor = isLight ? 0xab7d10 : 0x7ccf93; // or chaud ou émeraude lumineuse
    const meshOpacity = isLight ? 0.22 : 0.38;


    // Initialisation Scene, Camera, Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, -14, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Grille Géométrique 3D ondulante (Wireframe Topographique)
    const gridCols = 38;
    const gridRows = 26;
    const geometry = new THREE.PlaneGeometry(55, 38, gridCols, gridRows);
    const posAttr = geometry.attributes.position;
    const origZ = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      origZ[i] = posAttr.getZ(i);
    }

    const material = new THREE.MeshBasicMaterial({
      color: meshColor,
      wireframe: true,
      transparent: true,
      opacity: meshOpacity,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 3.2;
    mesh.position.y = -2;
    scene.add(mesh);

    // 2. Nuée de particules lumineuses (Poussière d'étoiles dorées)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleCoords[i * 3] = (Math.random() - 0.5) * 60;
      particleCoords[i * 3 + 1] = (Math.random() - 0.5) * 45;
      particleCoords[i * 3 + 2] = (Math.random() - 0.5) * 20;
      particleSpeeds[i] = 0.2 + Math.random() * 0.5;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particleCoords, 3));

    const particleMat = new THREE.PointsMaterial({
      color: particleColor,
      size: 0.38,
      transparent: true,
      opacity: isLight ? 0.45 : 0.70,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);


    // 3. Suivi de la souris (Parallaxe fluide)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableMouseInteraction) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.35;
      targetY = y * 0.25;
    };

    if (enableMouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    // 4. Redimensionnement réactif
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // 5. Boucle d'animation 60fps optimisée
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let isVisible = true;

    // IntersectionObserver pour stopper le rendu quand l'élément n'est pas à l'écran
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Mouvement ondulatoire du mesh géométrique
      if (!reduceMotion) {
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const u = (i % (gridCols + 1)) / gridCols;
          const v = Math.floor(i / (gridCols + 1)) / gridRows;

          // Double onde sinusoïdale organique
          const wave1 = Math.sin(u * 5 + elapsed * 0.9) * 1.6;
          const wave2 = Math.cos(v * 4 + elapsed * 0.7) * 1.2;
          const wave3 = Math.sin((u + v) * 4 + elapsed * 1.1) * 0.8;

          positions.setZ(i, origZ[i] + wave1 + wave2 + wave3);
        }
        positions.needsUpdate = true;

        // Dérive lente des particules
        const pPositions = particleGeo.attributes.position;
        for (let i = 0; i < particleCount; i++) {
          let y = pPositions.getY(i);
          y += particleSpeeds[i] * 0.015;
          if (y > 22) y = -22;
          pPositions.setY(i, y);
        }
        pPositions.needsUpdate = true;
      }

      // Parallaxe douce interpolée
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      mesh.rotation.z = mouseX * 0.2;
      mesh.rotation.x = -Math.PI / 3.2 + mouseY * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Nettoyage mémoire rigoureux (évite les fuites WebGL)
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (enableMouseInteraction) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      geometry.dispose();
      material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [variant, enableMouseInteraction]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    />
  );
}
