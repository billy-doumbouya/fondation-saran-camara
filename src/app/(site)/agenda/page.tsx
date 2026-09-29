import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import InstitutionalHero from "@/components/site/institutional-hero";
import EventCard from "@/components/site/cards/event-card";
import { eventsRepo } from "@/lib/db/repo";
import { isUpcoming } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Agenda — FSCPE",
  description:
    "Retrouvez les prochains temps forts de la Fondation Saran Camara et venez partager chaque étape de nos engagements.",
};
export const dynamic = "force-dynamic";

const AGENDA_HERO_BG =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop";

export default async function AgendaPage() {
  const allEvents = await eventsRepo.listPublished().catch(() => []);

  // Tri ascendant par date
  const sorted = [...allEvents].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );

  const upcoming = sorted.filter((e) => isUpcoming(e.startAt));
  const past = sorted
    .filter((e) => !isUpcoming(e.startAt))
    .reverse(); // passé = récent d'abord

  return (
    <>
      <InstitutionalHero
        image={AGENDA_HERO_BG}
        imageAlt="Public réuni lors d'un événement"
        eyebrow="Agenda"
        title="Les rendez-vous qui nous rassemblent"
        description="Retrouvez les prochains temps forts de la Fondation et venez partager avec nous chaque étape de nos engagements."
        badge="Ouvert à toutes et tous"
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

        <div className="container-app relative">
          {allEvents.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* ——— À venir ——— */}
              {upcoming.length > 0 && (
                <div>
                  <AnimatedSection>
                    <div className="flex items-center justify-between hairline-b pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                          <span className="eyebrow">À venir</span>
                        </div>
                        <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                          Nos prochains événements
                        </h2>
                      </div>
                      <span className="font-mono text-xs uppercase tracking-widest text-navy-400 shrink-0">
                        {upcoming.length} à venir
                      </span>
                    </div>
                  </AnimatedSection>

                  <div className="mt-8 space-y-4">
                    {upcoming.map((e, i) => (
                      <AnimatedSection key={e.id} delay={i * 0.05}>
                        <EventCard event={e} />
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              )}

              {/* ——— Passés ——— */}
              {past.length > 0 && (
                <div className={upcoming.length > 0 ? "mt-16" : ""}>
                  <AnimatedSection>
                    <div className="flex items-center justify-between hairline-b pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="h-px w-8 bg-navy-200" aria-hidden />
                          <span className="eyebrow eyebrow-muted">Archives</span>
                        </div>
                        <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                          Événements passés
                        </h2>
                      </div>
                      <span className="font-mono text-xs uppercase tracking-widest text-navy-400 shrink-0">
                        {past.length} archive{past.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </AnimatedSection>

                  <div className="mt-8 space-y-4">
                    {past.map((e, i) => (
                      <AnimatedSection key={e.id} delay={i * 0.04}>
                        <EventCard event={e} />
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              )}

              {/* ——— CTA ——— */}
              <AnimatedSection className="mt-16" delay={0.1}>
                <div className="relative overflow-hidden hairline-strong bg-white rounded-lg p-8 text-center sm:p-10">
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary-500/8 blur-3xl"
                  />
                  <span className="eyebrow">Vous organisez&nbsp;?</span>
                  <h3 className="font-display mt-3 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                    Proposez-nous un événement
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm text-navy-500">
                    Atelier, conférence, action de solidarité&nbsp;: partagez votre idée et construisons
                    ensemble le prochain temps fort de la Fondation.
                  </p>
                  <Link
                    href="/contact?subject=Proposition%20d%27%C3%A9v%C3%A9nement"
                    className="btn-primary mt-6"
                  >
                    Nous contacter
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </AnimatedSection>
            </>
          )}
        </div>
      </section>
    </>
  );
}

// ——— Empty state ———
function EmptyState() {
  return (
    <AnimatedSection direction="fade">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md hairline bg-white">
          <CalendarClock size={24} className="text-navy-300" strokeWidth={1.5} />
        </div>
        <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">
          Aucun événement programmé
        </h3>
        <p className="mt-2 text-sm text-navy-500">
          Les prochains rendez-vous de la FSCPE seront publiés ici prochainement.
        </p>
      </div>
    </AnimatedSection>
  );
}