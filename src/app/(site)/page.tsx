import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  ShieldCheck,
  HandHeart,
  Users2,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";
import Hero from "@/components/site/Hero";
import DoorIntro from "@/components/site/door-intro";
import AnimatedSection from "@/components/site/animated-section";
import SectionHeading from "@/components/site/section-heading";
import ProgramCard from "@/components/site/cards/program-card";
import NewsCard from "@/components/site/cards/news-card";
import TestimonialCard from "@/components/site/cards/testimonial-card";
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
    accent: "primary",
  },
  {
    icon: ShieldCheck,
    title: "Protection de l'enfance",
    text: "Défense des droits et sensibilisation communautaire.",
    accent: "navy",
  },
  {
    icon: HandHeart,
    title: "Aide aux orphelins",
    text: "Accompagnement moral, matériel et social.",
    accent: "gold",
  },
  {
    icon: Users2,
    title: "Action sociale",
    text: "Soutien aux familles démunies et développement local.",
    accent: "primary",
  },
] as const;

const ACCENT_MAP = {
  primary: {
    bar: "bg-primary-500",
    icon: "bg-primary-50 text-primary-600 group-hover:bg-primary-500 group-hover:text-white",
  },
  navy: {
    bar: "bg-navy-500",
    icon: "bg-navy-50 text-navy-600 group-hover:bg-navy-500 group-hover:text-white",
  },
  gold: {
    bar: "bg-gold-500",
    icon: "bg-gold-50 text-gold-600 group-hover:bg-gold-500 group-hover:text-white",
  },
} as const;

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
      <DoorIntro />
      <Hero videoUrl={heroVideoUrl} posterUrl={heroPosterUrl} />

      {/* ——— Pillars ——— */}
      <section className="container-app py-20 sm:py-24">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Nos piliers"
            title="Quatre domaines d'intervention"
            description="Chaque action de la fondation s'inscrit dans l'un de ces quatre piliers complémentaires."
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => {
            const accent = ACCENT_MAP[p.accent];
            const Icon = p.icon;
            return (
              <AnimatedSection key={p.title} delay={i * 0.06}>
                <div className="group relative h-full overflow-hidden hairline bg-white rounded-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:hairline-strong">
                  <span className={`absolute inset-x-0 top-0 h-0.5 ${accent.bar}`} aria-hidden />
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-md transition-colors duration-300 ${accent.icon}`}
                  >
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display mt-4 text-base font-semibold text-navy-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">
                    {p.text}
                  </p>
                  <span className="mt-4 inline-block font-mono text-[0.625rem] uppercase tracking-widest text-navy-300">
                    0{i + 1} / 04
                  </span>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* ——— Programs ——— */}
      {programs.length > 0 && (
        <section className="bg-primary-50/40 py-20 sm:py-24">
          <div className="container-app">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Nos programmes"
                title="Des actions concrètes pour les enfants"
                description="Bourses scolaires, kits scolaires, suivi psychosocial : découvrez nos projets en cours."
              />
            </AnimatedSection>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.slice(0, 3).map((program, i) => (
                <AnimatedSection key={program.id} delay={i * 0.08}>
                  <ProgramCard program={program} />
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="mt-10 text-center" delay={0.15}>
              <Link
                href="/programmes"
                className="group inline-flex items-center gap-2 font-display text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800"
              >
                Voir tous les programmes
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ——— Mission quote / Mot de la Fondatrice ——— */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Lueur d'ambiance organique (mesh) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-70"
        >
          <div className="h-[480px] w-[800px] max-w-full rounded-full bg-gradient-to-tr from-gold-500/15 via-primary-500/12 to-navy-500/10 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        </div>

        <div className="container-app relative">
          <AnimatedSection direction="up">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-b from-white/95 via-white/85 to-primary-50/30 p-8 shadow-2xl shadow-navy-950/10 backdrop-blur-xl sm:p-12 md:p-16">
              {/* Filigrane ornemental de coin */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/10 blur-2xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary-500/10 blur-2xl"
              />

              <figure className="relative flex flex-col items-center gap-8 sm:flex-row sm:gap-12 text-center sm:text-left">
                {/* Portrait de Mme Saran Camara */}
                <div className="relative shrink-0">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full ring-4 ring-gold-500/40 shadow-2xl hairline-strong sm:h-48 sm:w-48">
                    <Image
                      src="/saran camara.png"
                      alt="Saran Camara, fondatrice et présidente de la FSCPE"
                      fill
                      priority
                      sizes="(max-width: 640px) 160px, 192px"
                      className="object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  {/* Badge d'authenticité / Fondation */}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold-500/50 bg-navy-900 px-3.5 py-1 text-[0.6875rem] font-medium tracking-wider text-gold-300 shadow-md">
                    Fondatrice FSCPE
                  </span>
                </div>

                {/* Citation & Signature */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <span className="h-px w-6 bg-gold-500/60" aria-hidden />
                    <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary-700">
                      Le mot de la Fondatrice
                    </span>
                  </div>

                  <blockquote className="font-display mt-4 text-2xl font-bold leading-snug tracking-tight text-navy-900 sm:text-3xl sm:leading-tight">
                    &ldquo;{siteSettings.quote || BRAND.quote}&rdquo;
                  </blockquote>

                  <p className="mt-3 text-sm leading-relaxed text-navy-600 sm:text-base">
                    Chaque jour, nous nous mobilisons pour que la situation d&apos;un
                    orphelin ne définisse jamais la limite de ses rêves et de ses talents.
                  </p>

                  <figcaption className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-navy-100/80 pt-5 sm:justify-start">
                    <div>
                      <p className="font-display text-base font-bold text-navy-950">
                        {siteSettings.founderName || BRAND.founderName}
                      </p>
                      <p className="font-mono text-xs text-navy-500">
                        Présidente-Fondatrice · Fondation Saran Camara
                      </p>
                    </div>

                    <Link
                      href="/a-propos"
                      className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 transition-colors hover:text-primary-800"
                    >
                      <span>Découvrir notre histoire</span>
                      <ArrowRight size={14} />
                    </Link>
                  </figcaption>
                </div>
              </figure>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ——— Testimonials ——— */}
      {testimonials.length > 0 && (
        <section className="bg-navy-900 py-20 text-white sm:py-24">
          <div className="container-app">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Témoignages"
                title="Ce que disent nos partenaires et bénéficiaires"
                tone="light"
              />
            </AnimatedSection>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.08}>
                  <TestimonialCard testimonial={t} tone="light" />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— News ——— */}
      {news.length > 0 && (
        <section className="container-app py-20 sm:py-24">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Actualités"
              title="Dernières nouvelles de la fondation"
            />
          </AnimatedSection>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.slice(0, 3).map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 0.08}>
                <NewsCard item={item} />
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* ——— Partners marquee ——— */}
      {partners.length > 0 && (
        <section className="overflow-hidden hairline-t hairline-b bg-white py-10">
          <p className="container-app eyebrow eyebrow-muted text-center">
            Ils nous soutiennent
          </p>
          <div
            className="relative mt-8 flex w-full overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex shrink-0 animate-marquee items-center justify-around gap-16 pr-16">
              {partners.map((p) => (
                <span
                  key={p.id}
                  className="shrink-0 font-display text-sm font-semibold text-navy-500 opacity-70 transition-opacity hover:opacity-100"
                >
                  {p.name}
                </span>
              ))}
            </div>
            <div
              aria-hidden
              className="flex shrink-0 animate-marquee items-center justify-around gap-16 pr-16"
            >
              {partners.map((p) => (
                <span
                  key={`dup-${p.id}`}
                  className="shrink-0 font-display text-sm font-semibold text-navy-500 opacity-70 transition-opacity hover:opacity-100"
                >
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— CTA ——— */}
      <section className="relative overflow-hidden bg-navy-900 py-16 text-white">
        {/* Mesh background signature */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(115deg, var(--color-primary-700) 0%, var(--color-primary-900) 60%, var(--color-navy-900) 100%)",
          }}
        />
        <div className="absolute inset-0 grid-overlay opacity-30" aria-hidden />

        <div className="container-app relative z-10 flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="max-w-xl">
            <span className="eyebrow eyebrow-light">Faire un don</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Ensemble, changeons des vies dès aujourd&apos;hui
            </h2>
            <p className="mt-2 text-sm text-primary-100/80">
              Chaque don, petit ou grand, ouvre une porte vers l&apos;éducation.
            </p>
          </div>
          <Link
            href="/don"
            className="shrink-0 inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 font-display text-sm font-semibold text-primary-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-50 hover:shadow-xl active:scale-95"
          >
            <HeartHandshake size={16} />
            Faire un don
          </Link>
        </div>
      </section>
    </>
  );
}