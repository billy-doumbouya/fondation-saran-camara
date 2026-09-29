import Image from "next/image";
import AnimatedSection from "@/components/site/AnimatedSection";
import ComplexGeometricOverlay from "@/components/site/ambient/ComplexGeometricOverlay";

interface InstitutionalHeroProps {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Chip optionnel (ex. "Fondée en 2026 à Conakry"). */
  badge?: React.ReactNode;
  /** Children renderés sous le badge, dans la colonne texte. */
  children?: React.ReactNode;
}

export default function InstitutionalHero({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  badge,
  children,
}: InstitutionalHeroProps) {
  return (
    <section
      className="relative isolate flex min-h-[60vh] items-end overflow-hidden bg-navy-900 text-white"
      aria-label={eyebrow}
    >
      {/* Image backdrop */}
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-105 brightness-[0.68] contrast-110 saturate-75"
      />

      {/* Overlays lisibilité & Mesh Gradient Ambiant */}
      <div className="absolute inset-0 bg-navy-950/80" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-navy-950/80 to-primary-950/35"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent"
      />

      {/* Orbes lumineux émeraude et or noble */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-primary-500/35 blur-[120px] animate-[pulse_10s_ease-in-out_infinite]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-10 h-[400px] w-[400px] rounded-full bg-gold-500/25 blur-[110px] animate-[pulse_12s_ease-in-out_infinite_2s]"
      />

      {/* Trame géométrique de précision & cercles harmoniques */}
      <ComplexGeometricOverlay
        variant="dark"
        opacity={0.65}
        showSacredCircles={true}
        className="z-[2]"
      />

      {/* Bottom hairline gold */}
      <span className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" aria-hidden />

      {/* Content */}
      <div className="container-app relative z-10 pb-16 pt-28 sm:pb-20">
        <AnimatedSection>
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold-400/60" aria-hidden />
              <span className="eyebrow eyebrow-light">{eyebrow}</span>
            </div>

            <h1 className="font-display mt-5 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>

            <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-navy-100/85 sm:text-lg">
              {description}
            </p>

            {/* Badge + children inline */}
            {(badge || children) && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {badge && (
                  <span className="inline-flex items-center gap-2 rounded-sm hairline border-white/15 bg-white/[0.06] px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-widest text-navy-100 backdrop-blur-sm">
                    {badge}
                  </span>
                )}
                {children}
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}