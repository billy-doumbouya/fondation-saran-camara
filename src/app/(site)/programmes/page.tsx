import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, FolderOpen, HeartHandshake, Sparkles } from "lucide-react";
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
  const programsResult = await programsRepo.listPublished().catch(() => null);
  const loadError = programsResult === null;
  const programs = programsResult ?? [];

  // Stats agrégées
  const totalBeneficiaries = programs.reduce(
    (sum, p) => sum + (p.beneficiariesCount ?? 0),
    0,
  );

  return (
    <>
      {/* ——— Hero ——— */}
      <AtmosphereBackground
        variant="dark"
        enable3dMesh={false}
        enableGeometry={false}
        showSacredCircles={false}
        className="pb-24 pt-28 text-white sm:pb-28 sm:pt-32"
      >
        {/* Texture photographique subtile */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-overlay"
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
              <div className="inline-flex items-center gap-2 border-b border-gold-400/40 pb-2 text-xs font-semibold text-gold-200">
                <Sparkles size={14} className="text-gold-400" />
                <span className="font-mono uppercase tracking-widest text-[0.6875rem]">
                  Éducation · Protection · Solidarité
                </span>
              </div>

              <h1 className="font-display mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Des projets concrets pour{" "}
                <span className="bg-linear-to-r from-gold-300 via-gold-200 to-primary-300 bg-clip-text text-transparent">
                  ouvrir des horizons
                </span>
                .
              </h1>

              <p className="mt-5 text-base font-light leading-relaxed text-navy-100 sm:text-lg max-w-2xl mx-auto">
                Bourses scolaires, kits scolaires, protection et action sociale :
                découvrez comment la Fondation Saran Camara agit concrètement,
                au plus près des enfants orphelins et vulnérables de Guinée.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="#catalogue"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-gold-400 px-5 py-3 font-display text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
                >
                  Explorer les programmes
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/don"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/30 bg-white/5 px-5 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                >
                  <HeartHandshake size={16} />
                  Soutenir la FSCPE
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </AtmosphereBackground>

      {/* ——— Section Principale : Stats + Filtres + Grille ——— */}
      <section id="catalogue" className="relative overflow-hidden py-12 sm:py-16">
        <ComplexGeometricOverlay
          variant="light"
          opacity={0.1}
          showSacredCircles={false}
          className="pointer-events-none -z-10"
        />

        <div className="container-app relative z-10">
          {programs.length > 0 ? (
            <>
              {/* Header + stats flottantes */}
              <AnimatedSection>
                <div className="border-b border-navy-200 pb-6">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
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
                          label="Bénéficiaires cumulés"
                          value={
                            totalBeneficiaries.toLocaleString("fr-FR") + "+"
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Filter + grid */}
              <div className="mt-10">
                <ProgramsFilter programs={programs} />
              </div>
            </>
          ) : (
              <EmptyState loadError={loadError} />
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
function EmptyState({ loadError }: { loadError: boolean }) {
  const Icon = loadError ? AlertTriangle : FolderOpen;

  return (
    <AnimatedSection direction="fade">
      <div className="mx-auto max-w-md border-t-2 border-gold-500 py-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md hairline bg-white">
          <Icon size={24} className={loadError ? "text-gold-700" : "text-navy-300"} strokeWidth={1.5} />
        </div>
        <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">
          {loadError ? "Les programmes ne sont pas disponibles" : "Les programmes seront bientôt publiés"}
        </h3>
        <p className="mt-2 text-sm text-navy-500">
          {loadError
            ? "Une erreur empêche leur chargement. Veuillez réessayer dans quelques instants."
            : "Les premiers projets de la FSCPE seront présentés ici prochainement."}
        </p>
      </div>
    </AnimatedSection>
  );
}
