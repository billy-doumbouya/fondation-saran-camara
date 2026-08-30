import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  HandHeart,
  Users2,
  ArrowRight,
} from "lucide-react";
import Hero from "@/components/site/Hero";
import AnimatedSection from "@/components/site/AnimatedSection";
import SectionHeading from "@/components/site/SectionHeading";
import ProgramCard from "@/components/site/cards/ProgramCard";
import NewsCard from "@/components/site/cards/NewsCard";
import TestimonialCard from "@/components/site/cards/TestimonialCard";
import {
  programsRepo,
  newsRepo,
  testimonialsRepo,
  partnersRepo,
} from "@/lib/db/repo";
import { BRAND } from "@/lib/site-data";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const PILLARS = [
  {
    icon: GraduationCap,
    title: "Éducation",
    text: "Frais de scolarité et suivi pédagogique des enfants vulnérables.",
  },
  {
    icon: ShieldCheck,
    title: "Protection de l'enfance",
    text: "Défense des droits et sensibilisation communautaire.",
  },
  {
    icon: HandHeart,
    title: "Aide aux orphelins",
    text: "Accompagnement moral, matériel et social.",
  },
  {
    icon: Users2,
    title: "Action sociale",
    text: "Soutien aux familles démunies et développement local.",
  },
];

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [siteSettings, programs, news, testimonials, partners] = await Promise.all([
    getSiteSettings(),
    safe(programsRepo.listPublished(), []),
    safe(newsRepo.listPublished(), []),
    safe(testimonialsRepo.listPublished(), []),
    safe(partnersRepo.listAll(), []),
  ]);

  const heroVideoUrl = siteSettings.heroVideoUrl || null;
  const heroPosterUrl = siteSettings.heroPosterUrl || null;

  return (
    <>
      {/* Dynamic Three.js + Video Hero */}
      <Hero videoUrl={heroVideoUrl} posterUrl={heroPosterUrl} />

      {/* Pillars */}
      <section className="container-app py-20">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Nos piliers"
            title="Quatre domaines d'intervention"
            description="Chaque action de la fondation s'inscrit dans l'un de ces quatre piliers complémentaires."
          />
        </AnimatedSection>
        
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-navy-100/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                  <p.icon size={22} />
                </div>
                <h3 className="font-display mt-4 text-base font-semibold text-navy-900">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{p.text}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Programs */}
      {programs.length > 0 && (
        <section className="bg-primary-50/40 py-20">
          <div className="container-app">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Nos programmes"
                title="Des actions concrètes pour les enfants"
                description="Bourses scolaires, kits scolaires, suivi psychosocial : découvrez nos projets en cours."
              />
            </AnimatedSection>
            
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.slice(0, 3).map((program, i) => (
                <AnimatedSection key={program.id} delay={i * 0.1}>
                  <ProgramCard program={program} />
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="mt-10 text-center" delay={0.2}>
              <Link
                href="/programmes"
                className="group inline-flex items-center gap-2 font-semibold text-primary-700 transition-colors hover:text-primary-800"
              >
                Voir tous les programmes{" "}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Quote / Mission */}
      <section className="container-app py-20">
        <AnimatedSection direction="fade">
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="font-display text-2xl font-semibold text-navy-800 sm:text-3xl sm:leading-tight">
              &ldquo;{siteSettings.quote || BRAND.quote}&rdquo;
            </p>
            <footer className="mt-6 text-sm font-medium tracking-wide text-primary-600">
              — {siteSettings.founderName || BRAND.founderName}, Fondatrice
            </footer>
          </blockquote>
        </AnimatedSection>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-navy-900 py-20 text-white">
          <div className="container-app">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Témoignages"
                title="Ce que disent nos partenaires et bénéficiaires"
                className="[&_span]:bg-white/10 [&_span]:text-primary-200 [&_h2]:text-white [&_p]:text-navy-300"
              />
            </AnimatedSection>
            
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.1}>
                  <TestimonialCard testimonial={t} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News */}
      {news.length > 0 && (
        <section className="container-app py-20">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Actualités"
              title="Dernières nouvelles de la fondation"
            />
          </AnimatedSection>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.slice(0, 3).map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 0.1}>
                <NewsCard item={item} />
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* Partners Marquee */}
      {partners.length > 0 && (
        <section className="overflow-hidden border-y border-navy-100 bg-white py-10">
          <div className="container-app">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-navy-400">
              Ils nous soutiennent
            </p>
            
            <div className="relative mt-8 flex w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-12">
                {partners.map((p) => (
                  <span
                    key={p.id}
                    className="shrink-0 text-sm font-semibold text-navy-500 opacity-75 transition-opacity hover:opacity-100"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
              
              {/* Duplication pour défilement fluide infini */}
              <div aria-hidden="true" className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-12">
                {partners.map((p) => (
                  <span
                    key={`dup-${p.id}`}
                    className="shrink-0 text-sm font-semibold text-navy-500 opacity-75 transition-opacity hover:opacity-100"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call To Action */}
      <section className="bg-linear-to-r from-primary-600 to-primary-700 py-16 text-white shadow-inner">
        <div className="container-app flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Ensemble, changeons des vies dès aujourd&apos;hui
            </h2>
            <p className="mt-2 text-primary-100 font-light">
              Chaque don, petit ou grand, ouvre une porte vers l&apos;éducation.
            </p>
          </div>
          <Link
            href="/don"
            className="shrink-0 rounded-full bg-white px-8 py-3.5 font-semibold text-primary-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-50 hover:shadow-xl active:scale-95"
          >
            Faire un don
          </Link>
        </div>
      </section>
    </>
  );
}