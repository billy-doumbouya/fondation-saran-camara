"use client";

import dynamic from "next/dynamic";
import ComplexGeometricOverlay from "./ComplexGeometricOverlay";

// Chargement différé côté client du WebGL pour garantir 0 impact au SSR
const GeometricMeshCanvas = dynamic(() => import("./GeometricMeshCanvas"), {
  ssr: false,
});

interface AtmosphereBackgroundProps {
  variant?: "dark" | "light" | "dual";
  enable3dMesh?: boolean;
  enableGeometry?: boolean;
  showSacredCircles?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * AtmosphereBackground — Système d'ambiance de luxe pour les pages FSCPE
 *
 * Combine 3 niveaux de profondeur :
 * 1. Dégradés Mesh Aurora organiques (Émeraude profonde, Or champagne, Navy impérial).
 * 2. Canvas WebGL 3D Three.js (mesh topographique et particules stellaires).
 * 3. Guilloché vectoriel & géométrie sacrée avec masque de contraste protecteur.
 */
export default function AtmosphereBackground({
  variant = "dark",
  enable3dMesh = true,
  enableGeometry = true,
  showSacredCircles = true,
  className = "",
  children,
}: AtmosphereBackgroundProps) {
  const isDark = variant === "dark" || variant === "dual";

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      {/* ——— Niveau 1 : Mesh Gradients Aurora ——— */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      >
        {isDark ? (
          <>
            {/* Fond de base sombre riche */}
            <div className="absolute inset-0 bg-[#0a1424]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,26,46,0.85)_0%,rgba(10,18,32,0.92)_50%,rgba(21,64,37,0.45)_100%)]" />

            {/* Orbe Émeraude Impériale */}
            <div
              className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full blur-[120px] opacity-45 animate-[pulse_10s_ease-in-out_infinite]"
              style={{
                background:
                  "radial-gradient(circle, rgba(34,122,63,0.85) 0%, rgba(21,64,37,0.5) 60%, transparent 80%)",
              }}
            />

            {/* Orbe Or Rayonnant */}
            <div
              className="absolute -right-20 top-1/4 h-[550px] w-[550px] rounded-full blur-[110px] opacity-40 animate-[pulse_12s_ease-in-out_infinite_2s]"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,160,23,0.8) 0%, rgba(171,125,16,0.4) 60%, transparent 80%)",
              }}
            />

            {/* Orbe Bleu Nuit Profond */}
            <div
              className="absolute bottom-0 left-1/4 h-[650px] w-[650px] rounded-full blur-[130px] opacity-50"
              style={{
                background:
                  "radial-gradient(circle, rgba(34,60,105,0.9) 0%, rgba(16,26,46,0.6) 60%, transparent 80%)",
              }}
            />
          </>
        ) : (
          <>
            {/* Fond de base crème */}
            <div className="absolute inset-0 bg-[#faf9f5]" />

            {/* Orbe Émeraude douce */}
            <div
              className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full blur-[110px] opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(47,153,80,0.6) 0%, transparent 70%)",
              }}
            />

            {/* Orbe Or doux */}
            <div
              className="absolute -right-20 top-1/3 h-[500px] w-[500px] rounded-full blur-[110px] opacity-35"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,160,23,0.55) 0%, transparent 70%)",
              }}
            />
          </>
        )}
      </div>

      {/* ——— Niveau 2 : WebGL 3D Mesh Topographique (Three.js) ——— */}
      {enable3dMesh && (
        <GeometricMeshCanvas
          variant={isDark ? "dark" : "light"}
          className="z-[1] opacity-90"
        />
      )}

      {/* ——— Niveau 3 : Guilloché Géométrique & Lignes de Précision ——— */}
      {enableGeometry && (
        <ComplexGeometricOverlay
          variant={isDark ? "dark" : "light"}
          showSacredCircles={showSacredCircles}
          opacity={isDark ? 0.65 : 0.45}
          className="z-[2]"
        />
      )}

      {/* Contenu textuel / composant protégé au premier plan */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
