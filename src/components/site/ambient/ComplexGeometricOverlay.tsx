"use client";

interface ComplexGeometricOverlayProps {
  variant?: "dark" | "light" | "gold";
  opacity?: number;
  className?: string;
  showSacredCircles?: boolean;
}

/**
 * ComplexGeometricOverlay — Trame vectorielle géométrique & guilloché de haute précision
 *
 * Inspiré des gravures de sécurité des institutions internationales et de la géométrie sacrée :
 * - Trame isométrique millimétrée avec croix nodales (+) aux intersections.
 * - Cercles harmoniques concentriques (proportions du Nombre d'Or).
 * - Masque radial de lisibilité assurant que le centre reste 100% dégagé pour la typographie.
 */
export default function ComplexGeometricOverlay({
  variant = "dark",
  opacity = 0.65,
  className = "",
  showSacredCircles = true,
}: ComplexGeometricOverlayProps) {
  const isDark = variant === "dark";
  const strokeColor = isDark
    ? "rgba(212, 160, 23, 0.45)" // Or noble délicat
    : "rgba(34, 122, 63, 0.35)"; // Émeraude douce

  const accentColor = isDark
    ? "rgba(124, 207, 147, 0.55)"
    : "rgba(212, 160, 23, 0.55)";


  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      style={{ opacity }}
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Grille Isométrique / Millimétrée */}
          <pattern
            id={`isometric-grid-${variant}`}
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.8"
            />
            {/* Croix nodale aux intersections */}
            <path
              d="M 38 40 L 42 40 M 40 38 L 40 42"
              stroke={accentColor}
              strokeWidth="1"
            />
          </pattern>

          {/* Masque de dégradé radial pour protéger la lisibilité du texte */}
          <radialGradient
            id={`readability-mask-${variant}`}
            cx="50%"
            cy="45%"
            r="60%"
          >
            <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#fff" stopOpacity="1" />
          </radialGradient>


          <mask id={`mask-layer-${variant}`}>
            <rect
              width="100%"
              height="100%"
              fill={`url(#readability-mask-${variant})`}
            />
          </mask>
        </defs>

        {/* Application de la trame avec masque de lisibilité */}
        <g mask={`url(#mask-layer-${variant})`}>
          <rect
            width="100%"
            height="100%"
            fill={`url(#isometric-grid-${variant})`}
          />

          {/* Lignes d'horizon et angles architecturaux directeurs */}
          <line
            x1="0"
            y1="200"
            x2="1600"
            y2="700"
            stroke={accentColor}
            strokeWidth="0.75"
            strokeDasharray="4 8"
          />
          <line
            x1="0"
            y1="700"
            x2="1600"
            y2="200"
            stroke={strokeColor}
            strokeWidth="0.75"
            strokeDasharray="4 8"
          />

          {showSacredCircles && (
            <g className="animate-[spin_240s_linear_infinite] origin-center opacity-70">
              {/* Cercles harmoniques concentriques (proportions d'or) */}
              <circle
                cx="800"
                cy="450"
                r="160"
                fill="none"
                stroke={accentColor}
                strokeWidth="0.75"
                strokeDasharray="3 6"
              />
              <circle
                cx="800"
                cy="450"
                r="280"
                fill="none"
                stroke={strokeColor}
                strokeWidth="0.5"
              />
              <circle
                cx="800"
                cy="450"
                r="420"
                fill="none"
                stroke={accentColor}
                strokeWidth="0.5"
                strokeDasharray="6 12"
              />
              <circle
                cx="800"
                cy="450"
                r="600"
                fill="none"
                stroke={strokeColor}
                strokeWidth="0.75"
              />

              {/* Losange directeur d'équilibre */}
              <polygon
                points="800,290 960,450 800,610 640,450"
                fill="none"
                stroke={strokeColor}
                strokeWidth="0.6"
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
