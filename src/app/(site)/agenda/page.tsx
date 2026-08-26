import type { Metadata } from "next";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import EventCard from "@/components/site/cards/EventCard";
import { eventsRepo } from "@/lib/db/repo";

export const metadata: Metadata = { title: "Agenda" };
export const dynamic = "force-dynamic";

const AGENDA_HERO_BG =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop";

export default async function AgendaPage() {
  const events = await eventsRepo.listPublished().catch(() => []);
  return (
    <>
      <InstitutionalHero
        image={AGENDA_HERO_BG}
        imageAlt="Public réuni lors d'un événement"
        eyebrow="Agenda"
        title="Les rendez-vous qui nous rassemblent"
        description="Retrouvez les prochains temps forts de la Fondation et venez partager avec nous chaque étape de nos engagements."
        badge={<span className="text-sm text-white/85">Ouvert à toutes et tous</span>}
      />
      <div className="bg-gradient-to-b from-white to-primary-50/30 py-14 sm:py-16">
        <div className="container-app">
          <div className="mb-7 flex items-end justify-between border-b border-navy-100 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">À venir</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">Nos prochains événements</h2>
            </div>
            <span className="hidden text-sm text-navy-400 sm:block">Au cœur de nos communautés</span>
          </div>
          <div className="space-y-4">
        {events.map((e, i) => (
          <AnimatedSection key={e.id} delay={i * 0.06}>
            <EventCard event={e} />
          </AnimatedSection>
        ))}
          </div>
          {events.length === 0 && <p className="mt-12 text-center text-navy-400">Aucun événement programmé pour le moment.</p>}
        </div>
      </div>
    </>
  );
}
