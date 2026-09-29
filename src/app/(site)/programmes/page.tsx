import type { Metadata } from "next";
import { FolderOpen, Sparkles, Shield, HeartHandshake } from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import AtmosphereBackground from "@/components/site/ambient/AtmosphereBackground";
import ComplexGeometricOverlay from "@/components/site/ambient/ComplexGeometricOverlay";
import ProgramsFilter from "@/components/site/programs-filter";
import { programsRepo } from "@/lib/db/repo";

export const metadata: Metadata = {
  title: "Programmes & Projets — FSCPE",
  description:
    "Bourses scolaires, kits scolaires, protection et action sociale : découvrez comment la Fondation Saran Camara agit concrètement en Guinée.",
};
export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const programs = await programsRepo.listPublished().catch(() => []);

  // Stats agrégées
  const totalBeneficiaries = programs.reduce(
    (sum, p) => sum + (p.beneficiariesCount ?? 0),
    0,
  );

  return (
    <>
      {/* ——— Hero immersif : WebGL 3D Mesh + Guilloché or + Mesh Aurora ——— */}
      <AtmosphereBackground
        variant="dark"
        enable3dMesh={true}
        enableGeometry={true}
        showSacredCircles={true}
        className="pb-28 pt-32 text-white sm:pb-36 sm:pt-40"
      >
        {/* Texture photographique subtile */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-15 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />

        <div className="container-app relative z-10">
          <AnimatedSection direction="up">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge pulsant */}
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-300 backdrop-blur-md shadow-lg shadow-gold-500/5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
                </span>
                <span className="font-mono uppercase tracking-widest text-[0.6875rem]">
                  Éducation · Protection · Solidarité
                </span>
              </div>

              <h1 className="font-display mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-sm">
                Des projets concrets pour{" "}
                <span className="bg-gradient-to-r from-gold-300 via-gold-200 to-primary-300 bg-clip-text text-transparent">
                  ouvrir des horizons
                </span>
                .
              </h1>

              <p className="mt-5 text-base font-light leading-relaxed text-navy-100 sm:text-lg max-w-2xl mx-auto">
                Bourses scolaires, kits scolaires, protection et action sociale :
                découvrez comment la Fondation Saran Camara agit concrètement,
                au plus près des enfants orphelins et vulnérables de Guinée.
              </p>

              {/* Piliers de confiance */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-navy-200">
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <Sparkles size={15} className="text-gold-400" />
                  <span>Programmes suivis et évalués</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <Shield size={15} className="text-primary-400" />
                  <span>ONG officiellement agréée en Guinée</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <HeartHandshake size={15} className="text-emerald-400" />
                  <span>100% de traçabilité des dons</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </AtmosphereBackground>

      {/* ——— Section Principale : Stats + Filtres + Grille ——— */}
      <section className="relative -mt-16 overflow-hidden pb-24 sm:pb-32">
        {/* Trame géométrique douce sur fond crème */}
        <ComplexGeometricOverlay
          variant="light"
          opacity={0.22}
          showSacredCircles={false}
          className="pointer-events-none -z-10"
        />
        {/* Mesh orbes clairs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-primary-500/10 blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-1/2 h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-[110px]"
        />

        <div className="container-app relative z-10">
          {programs.length > 0 ? (
            <>
              {/* Header + stats flottantes */}
              <AnimatedSection>
                <div className="relative overflow-hidden rounded-[28px] border border-white/90 bg-white/90 p-7 shadow-2xl shadow-navy-950/10 backdrop-blur-2xl sm:p-9">
                  {/* Liseré supérieur or & émeraude */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-700" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-400/10 blur-3xl"
                  />

                  <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                        <span className="eyebrow">Notre impact</span>
                      </div>
                      <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                        Programmes &amp; projets
                      </h2>
                      <p className="mt-2 text-sm text-navy-500">
                        Des solutions pensées pour durer.
                      </p>
                    </div>
                    <div className="flex items-center gap-8">
                      <Stat
                        label="Programmes"
                        value={programs.length.toString()}
                      />
                      {totalBeneficiaries > 0 && (
                        <Stat
                          label="Bénéficiaires"
                          value={
                            totalBeneficiaries.toLocaleString("fr-FR") + "+"
                          }
                        />
                      )}
                    </div>
                  </div>
                  <span
                    className="mt-6 block h-px w-full bg-navy-100"
                    aria-hidden
                  />
                </div>
              </AnimatedSection>

              {/* Filter + grid */}
              <div className="mt-10">
                <ProgramsFilter programs={programs} />
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </>
  );
}

// ——— Sub-components ———

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <p className="font-display text-3xl font-bold tabular-nums text-primary-700 sm:text-4xl">
        {value}
      </p>
      <p className="font-mono text-[0.625rem] uppercase tracking-widest text-navy-400">
        {label}
      </p>
    </div>
  );
}

// ——— Empty state ———
function EmptyState() {
  return (
    <AnimatedSection direction="fade">
      <div className="mx-auto max-w-md rounded-[28px] border border-white/90 bg-white/90 p-12 text-center shadow-2xl shadow-navy-950/10 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md hairline bg-white">
          <FolderOpen size={24} className="text-navy-300" strokeWidth={1.5} />
        </div>
        <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">
          Les programmes seront bientôt publiés
        </h3>
        <p className="mt-2 text-sm text-navy-500">
          Les premiers projets de la FSCPE seront présentés ici prochainement.
        </p>
      </div>
    </AnimatedSection>
  );
}
