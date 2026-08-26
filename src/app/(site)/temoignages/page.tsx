import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MessageSquareQuote, HeartHandshake, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import TestimonialCard from "@/components/site/cards/TestimonialCard";
import { testimonialsRepo } from "@/lib/db/repo";

export const metadata: Metadata = { title: "Témoignages" };
export const dynamic = "force-dynamic";

// Image d'arrière-plan Unsplash (Sourires / Éducation / Communauté)
const TESTIMONIALS_HERO_BG =
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop";

export default async function TestimonialsPage() {
  const testimonials = await testimonialsRepo.listPublished().catch(() => []);

  return (
    <>
      <InstitutionalHero
        image={TESTIMONIALS_HERO_BG}
        imageAlt="Élèves réunis dans une salle de classe"
        eyebrow="Témoignages"
        title="Ce que disent nos partenaires et bénéficiaires"
        description="Découvrez les histoires touchantes, les retours d&apos;expérience et l&apos;impact direct de nos actions à travers leurs voix."
        badge={
          <div className="flex items-center gap-3 text-sm text-white/85">
            <CalendarDays size={17} className="text-primary-200" />
            <span>Des histoires qui comptent</span>
          </div>
        }
      />

      {/* CONTENU PRINCIPAL */}
      <div className="container-app py-16">
        {/* GRILLE DE TÉMOIGNAGES */}
        {testimonials.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.id} delay={(i % 3) * 0.08}>
                <TestimonialCard testimonial={t} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          /* ÉTAT VIDE */
          <AnimatedSection>
            <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-navy-200 bg-navy-50/40 p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <MessageSquareQuote size={32} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy-900">
                Aucun témoignage disponible pour le moment
              </h3>
              <p className="mt-2 text-sm text-navy-500 max-w-md">
                Les retours d&apos;expérience de nos bénéficiaires et partenaires seront bientôt publiés sur cette page.
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* SECTION CALL-TO-ACTION (Partagez votre expérience) */}
        <AnimatedSection className="mt-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-primary-950 p-8 sm:p-12 text-white shadow-xl">
            {/* Texture d'arrière-plan */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-60 w-60 rounded-full bg-primary-500/20 blur-2xl" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary-300">
                  <Sparkles size={14} /> Votre voix compte
                </span>
                <h3 className="font-display mt-3 text-2xl font-bold sm:text-3xl">
                  Vous avez bénéficié de nos programmes ou collaboré avec nous ?
                </h3>
                <p className="mt-2 text-sm text-navy-200">
                  Partagez votre expérience et aidez-nous à inspirer davantage de bienfaiteurs et de partenaires.
                </p>
              </div>

              <Link
                href="/contact"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-600 hover:shadow-xl active:scale-95"
              >
                <HeartHandshake size={18} />
                Laisser un témoignage
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </>
  );
}