import type { Metadata } from "next";
import { UsersRound } from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import InstitutionalHero from "@/components/site/institutional-hero";
import TeamCard from "@/components/site/cards/team-card";
import { teamRepo } from "@/lib/db/repo";

export const metadata: Metadata = {
  title: "Équipe & Gouvernance — FSCPE",
  description:
    "Assemblée Générale, Conseil d'Administration et Bureau Exécutif : découvrez l'équipe dévouée qui pilote les actions de la Fondation Saran Camara.",
};
export const dynamic = "force-dynamic";

const TEAM_HERO_BG =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1920&auto=format&fit=crop";

export default async function TeamPage() {
  const members = await teamRepo.listAll().catch(() => []);
  const groups = {
    fondatrice: members.filter((m) => m.organBody === "fondatrice"),
    bureau: members.filter((m) => m.organBody === "bureau"),
    ca: members.filter((m) => m.organBody === "ca"),
  };

  return (
    <>
      <InstitutionalHero
        image={TEAM_HERO_BG}
        imageAlt="Équipe réunie autour d'un projet"
        eyebrow="Gouvernance"
        title="Une équipe engagée pour l'enfance"
        description="Assemblée Générale, Conseil d'Administration et Bureau Exécutif garantissent la transparence et la bonne gestion de la fondation."
        badge={
          <div className="flex items-center gap-2 text-sm text-white/85">
            <UsersRound size={16} className="text-primary-200" />
            <span>Des responsabilités au service de l&apos;impact</span>
          </div>
        }
      />

      <section className="relative overflow-hidden py-20 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #ffffff 0%, var(--background) 50%, var(--color-primary-50) 100%)",
          }}
        />

        <div className="container-app relative space-y-16">
          {/* ——— La Fondatrice ——— */}
          {groups.fondatrice.length > 0 && (
            <AnimatedSection>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                <span className="eyebrow">Vision &amp; Leadership</span>
              </div>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                La Fondatrice
              </h2>
              <span className="mt-4 block h-px w-full bg-navy-100" aria-hidden />

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
                {groups.fondatrice.map((m) => (
                  <TeamCard key={m.id} member={m} />
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* ——— Bureau Exécutif ——— */}
          {groups.bureau.length > 0 && (
            <AnimatedSection>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                <span className="eyebrow">Opérations &amp; Terrain</span>
              </div>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                Bureau Exécutif
              </h2>
              <span className="mt-4 block h-px w-full bg-navy-100" aria-hidden />

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groups.bureau.map((m, i) => (
                  <AnimatedSection key={m.id} delay={i * 0.05}>
                    <TeamCard member={m} />
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* ——— Conseil d'Administration ——— */}
          {groups.ca.length > 0 && (
            <AnimatedSection>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                <span className="eyebrow">Stratégie &amp; Contrôle</span>
              </div>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                Conseil d&apos;Administration
              </h2>
              <span className="mt-4 block h-px w-full bg-navy-100" aria-hidden />

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groups.ca.map((m, i) => (
                  <AnimatedSection key={m.id} delay={i * 0.05}>
                    <TeamCard member={m} />
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* ——— État vide ——— */}
          {members.length === 0 && (
            <AnimatedSection direction="fade">
              <div className="mx-auto max-w-md text-center py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md hairline bg-white">
                  <UsersRound size={24} className="text-navy-300" strokeWidth={1.5} />
                </div>
                <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">
                  L&apos;équipe sera bientôt affichée
                </h3>
                <p className="mt-2 text-sm text-navy-500">
                  La liste des membres des instances de la Fondation sera publiée ici prochainement.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    </>
  );
}
