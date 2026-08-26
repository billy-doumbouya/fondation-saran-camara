import type { Metadata } from "next";
import { UsersRound } from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import TeamCard from "@/components/site/cards/TeamCard";
import { teamRepo } from "@/lib/db/repo";

export const metadata: Metadata = { title: "Équipe & Gouvernance" };
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
          <div className="flex items-center gap-3 text-sm text-white/85">
            <UsersRound size={17} className="text-primary-200" />
            <span>Des responsabilités au service de l&apos;impact</span>
          </div>
        }
      />
      <div className="bg-gradient-to-b from-white to-primary-50/30 py-14 sm:py-16">
        <div className="container-app">

      {groups.fondatrice.length > 0 && (
        <div>
          <div className="mb-5 flex items-center gap-3 border-b border-navy-100 pb-4">
            <h2 className="font-display text-2xl font-bold text-navy-900">La Fondatrice</h2>
            <span className="h-px flex-1 bg-primary-100" />
          </div>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {groups.fondatrice.map((m) => (
              <AnimatedSection key={m.id}>
                <TeamCard member={m} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      )}

      {groups.bureau.length > 0 && (
        <div className="mt-14">
          <div className="mb-5 flex items-center gap-3 border-b border-navy-100 pb-4">
            <h2 className="font-display text-2xl font-bold text-navy-900">Bureau Exécutif</h2>
            <span className="h-px flex-1 bg-primary-100" />
          </div>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {groups.bureau.map((m, i) => (
              <AnimatedSection key={m.id} delay={i * 0.06}>
                <TeamCard member={m} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      )}

      {groups.ca.length > 0 && (
        <div className="mt-14">
          <div className="mb-5 flex items-center gap-3 border-b border-navy-100 pb-4">
            <h2 className="font-display text-2xl font-bold text-navy-900">Conseil d&apos;Administration</h2>
            <span className="h-px flex-1 bg-primary-100" />
          </div>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {groups.ca.map((m, i) => (
              <AnimatedSection key={m.id} delay={i * 0.06}>
                <TeamCard member={m} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      )}

      {members.length === 0 && (
        <p className="mt-12 text-center text-navy-400">L&apos;équipe sera bientôt affichée ici.</p>
      )}
        </div>
      </div>
    </>
  );
}
