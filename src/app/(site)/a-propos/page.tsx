import type { Metadata } from "next";
import Image from "next/image";
import { Sprout, Users, MapPin, HeartHandshake, Building2, ShieldCheck, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import InstitutionalHero from "@/components/site/institutional-hero";
import SectionHeading from "@/components/site/section-heading";
import ComplexGeometricOverlay from "@/components/site/ambient/ComplexGeometricOverlay";
import { BRAND } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "À propos — FSCPE",
  description:
    "L'histoire de la Fondation Saran Camara pour l'Éducation et la Protection des Enfants.",
};

const ABOUT_HERO_BG =
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1920&auto=format&fit=crop";

const HISTORY_STEPS = [
  {
    year: "2026",
    label: "L'origine",
    title: "Une conviction devient une fondation",
    description:
      "À Kissosso, Conakry, Saran Camara transforme une conviction simple en un engagement collectif : chaque enfant mérite une chance réelle de grandir, d'apprendre et de s'épanouir.",
    icon: Sprout,
  },
  {
    year: "2026",
    label: "Le premier cercle",
    title: "Dix membres réunis autour d'une même cause",
    description:
      "L'assemblée générale fondatrice rassemble dix personnes engagées et pose les premières bases d'une action durable pour les enfants et les familles vulnérables.",
    icon: Users,
  },
  {
    year: "Aujourd'hui",
    label: "Notre territoire",
    title: "Agir d'abord à Conakry",
    description:
      "La fondation accompagne les enfants et les familles démunies de la région de Conakry, avec l'ambition d'étendre progressivement ses actions à d'autres régions de Guinée.",
    icon: MapPin,
  },
  {
    year: "Demain",
    label: "Notre cap",
    title: "Grandir avec nos partenaires",
    description:
      "Éducation, protection et solidarité structurent chaque prochaine étape, dans une gouvernance transparente et une gestion rigoureuse des ressources confiées.",
    icon: HeartHandshake,
  },
] as const;

const PILLARS = [
  {
    icon: Building2,
    title: "Gouvernance structurée",
    text: "Une organisation claire au service de la transparence.",
  },
  {
    icon: ShieldCheck,
    title: "Protection de l'enfance",
    text: "Au cœur de chaque décision, dans chaque action.",
  },
  {
    icon: HeartHandshake,
    title: "Partenariats durables",
    text: "Construits dans la durée, avec des acteurs engagés.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <InstitutionalHero
        image={ABOUT_HERO_BG}
        imageAlt="Équipe associative réunie autour d'un projet"
        eyebrow="À propos"
        title="Une fondation née d'une conviction simple"
        description="Chaque enfant mérite une chance réelle de grandir, d'apprendre et de s'épanouir. Découvrez l'histoire et les engagements de la FSCPE."
        badge="Fondée en 2026 · Conakry, République de Guinée"
      />

      {/* ——— Histoire (timeline) ——— */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        {/* Mesh accent & Trame géométrique subtile */}
        <ComplexGeometricOverlay
          variant="light"
          opacity={0.2}
          showSacredCircles={false}
          className="pointer-events-none -z-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 18%, rgba(47,153,80,0.09), transparent 28%), linear-gradient(180deg, #ffffff 0%, var(--background) 58%, var(--color-primary-50) 100%)",
          }}
        />

        <div className="container-app relative">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow="Notre histoire"
              title="Un parcours, étape par étape"
              description="De la conviction fondatrice aux prochaines actions, voici les moments qui donnent leur sens à la FSCPE."
            />
          </AnimatedSection>

          {/* Timeline */}
          <div className="relative mx-auto mt-14 max-w-5xl">
            {/* Hairline centrale verticale */}
            <span
              aria-hidden
              className="absolute left-4 top-2 bottom-2 w-px bg-gold-500/30 lg:left-1/2 lg:-translate-x-1/2"
            />

            <div className="space-y-10 lg:space-y-16">
              {HISTORY_STEPS.map((step, i) => {
                const Icon = step.icon;
                const isRight = i % 2 === 1;
                return (
                  <AnimatedSection
                    key={step.label}
                    direction={isRight ? "right" : "left"}
                    delay={0.05 + i * 0.06}
                    className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-4 lg:grid-cols-2 lg:gap-12"
                  >
                    {/* Node (circle on the line) */}
                    <div className="absolute left-4 top-4 z-10 -translate-x-1/2 lg:left-1/2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white hairline-strong shadow-md">
                        <Icon size={14} strokeWidth={2} />
                      </span>
                    </div>

                    {/* Card */}
                    <div
                      className={
                        isRight
                          ? "col-start-2 lg:col-start-2 lg:pl-8"
                          : "col-start-2 lg:col-start-1 lg:row-start-1 lg:pr-8 lg:text-right"
                      }
                    >
                      <article className="group relative overflow-hidden hairline bg-white rounded-lg p-6 transition-all duration-300 hover:hairline-strong hover:-translate-y-0.5">
                        <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />
                        <div className={isRight ? "" : "lg:flex lg:flex-col lg:items-end"}>
                          <span className="eyebrow">{step.label}</span>
                          <p className="font-display mt-2 text-3xl font-bold tracking-tight text-navy-900">
                            {step.year}
                          </p>
                          <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-navy-900">
                            {step.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-navy-500">
                            {step.description}
                          </p>
                        </div>
                      </article>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Gouvernance + Aside ——— */}
      <section className="container-app py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-12">
          <AnimatedSection direction="left" delay={0.1}>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary-500/60" aria-hidden />
              <span className="eyebrow">Gouvernance</span>
            </div>
            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Une action responsable, à chaque étape
            </h2>
            <div className="mt-5 space-y-5 text-base leading-relaxed text-navy-600">
              <p>
                Depuis sa création, la {BRAND.fullName} ({BRAND.acronym}) s&apos;appuie sur
                une gouvernance structurée — Assemblée Générale, Conseil d&apos;Administration
                et Bureau Exécutif — pour garantir transparence et rigueur dans la gestion
                de chaque ressource confiée par ses donateurs et partenaires.
              </p>
              <p>
                Chaque décision est prise dans le respect des valeurs fondatrices de la
                fondation : dignité de l&apos;enfant, équité d&apos;accès à l&apos;éducation,
                impact mesurable et redevabilité envers les communautés accompagnées.
              </p>
            </div>

            {/* Pillars inline */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {PILLARS.map((p, i) => (
                <div
                  key={p.title}
                  className="hairline bg-white rounded-md p-4 transition-all duration-300 hover:hairline-strong hover:-translate-y-0.5"
                >
                  <p.icon
                    size={20}
                    className="text-primary-600"
                    strokeWidth={1.75}
                  />
                  <h3 className="font-display mt-2 text-sm font-semibold text-navy-900">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-navy-500">
                    {p.text}
                  </p>
                  <span className="mt-3 block font-mono text-[0.625rem] uppercase tracking-widest text-navy-300">
                    0{i + 1} / 0{PILLARS.length}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Aside quote avec Photo de la Fondatrice */}
          <AnimatedSection direction="right" delay={0.15}>
            <aside className="relative overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-navy-950 via-navy-900 to-primary-950 p-7 text-white shadow-2xl">
              {/* Lueur d'ambiance dorée */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gold-400/15 blur-3xl"
              />
              <div className="absolute inset-0 grid-overlay opacity-20" aria-hidden />
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-600" aria-hidden />

              <div className="relative">
                {/* Header de la carte */}
                <div className="flex items-center justify-between">
                  <span className="eyebrow eyebrow-light flex items-center gap-1.5 text-gold-400">
                    <Sparkles size={13} />
                    Mot de la Fondatrice
                  </span>
                  <span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 font-mono text-[0.625rem] text-gold-300">
                    FSCPE
                  </span>
                </div>

                {/* Photo officielle de Mme Saran Camara */}
                <div className="mt-6 flex flex-col items-center text-center">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-gold-400/50 shadow-2xl sm:h-32 sm:w-32">
                    <Image
                      src="/saran camara.png"
                      alt={BRAND.founderName}
                      fill
                      sizes="128px"
                      className="object-cover object-top transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <span className="mt-3 inline-block rounded-full border border-gold-500/40 bg-navy-900/90 px-3 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-wider text-gold-300">
                    Fondatrice & Présidente
                  </span>
                </div>

                {/* Citation */}
                <div className="mt-5 text-center">
                  <span
                    aria-hidden
                    className="font-display block text-4xl leading-none text-gold-400/80"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="font-display -mt-2 text-base font-semibold leading-snug text-white sm:text-lg">
                    {BRAND.quote}
                  </blockquote>
                </div>

                {/* Signature de bas de carte */}
                <figcaption className="mt-6 border-t border-white/10 pt-4 text-center">
                  <p className="font-display text-sm font-bold text-white">
                    {BRAND.founderName}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.6875rem] uppercase tracking-wider text-navy-300">
                    Présidente de la Fondation
                  </p>
                </figcaption>
              </div>
            </aside>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
