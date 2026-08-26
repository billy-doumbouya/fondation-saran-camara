import type { Metadata } from "next";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import ProgramCard from "@/components/site/cards/ProgramCard";
import { programsRepo } from "@/lib/db/repo";

export const metadata: Metadata = { title: "Programmes & Projets" };
export const dynamic = "force-dynamic";

const PROGRAMS_HERO_BG =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1920&auto=format&fit=crop";

export default async function ProgramsPage() {
  const programs = await programsRepo.listPublished().catch(() => []);
  return (
    <>
      <InstitutionalHero
        image={PROGRAMS_HERO_BG}
        imageAlt="Enfants apprenant en classe"
        eyebrow="Nos actions"
        title="Des projets concrets pour ouvrir des horizons"
        description="Bourses scolaires, kits scolaires, protection et action sociale : découvrez comment nous agissons concrètement."
        badge={<span className="text-sm text-white/85">Éducation, protection, solidarité</span>}
      />
      <div className="bg-gradient-to-b from-white to-primary-50/30 py-14 sm:py-16">
        <div className="container-app">
          <div className="mb-7 flex items-end justify-between border-b border-navy-100 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Notre impact</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">Programmes & projets</h2>
            </div>
            <span className="hidden text-sm text-navy-400 sm:block">Des solutions pensées pour durer</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((p, i) => (
          <AnimatedSection key={p.id} delay={(i % 3) * 0.08}>
            <ProgramCard program={p} />
          </AnimatedSection>
        ))}
          </div>
          {programs.length === 0 && (
            <p className="mt-12 text-center text-navy-400">Les programmes seront bientôt publiés ici.</p>
          )}
        </div>
      </div>
    </>
  );
}
