import type { Metadata } from "next";
import { Building2, HeartHandshake, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import { BRAND } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "À propos",
  description: "L'histoire de la Fondation Saran Camara pour l'Éducation et la Protection des Enfants.",
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
    icon: Sparkles,
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
];

export default function AboutPage() {
  return (
    <>
      <InstitutionalHero
        image={ABOUT_HERO_BG}
        imageAlt="Équipe associative réunie autour d'un projet"
        eyebrow="À propos"
        title="Une fondation née d'une conviction simple"
        description="Chaque enfant mérite une chance réelle de grandir, d'apprendre et de s'épanouir. Découvrez l'histoire et les engagements de la FSCPE."
        badge={<span className="text-sm text-white/85">Fondée en 2026 à Conakry</span>}
      />
      <div
        className="bg-[#fbfaf6] py-14 sm:py-16"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 18%, rgba(47, 153, 80, 0.09), transparent 28%), linear-gradient(180deg, #ffffff 0%, #fbfaf6 58%, #eefaf1 100%)",
        }}
      >
        <div className="container-app">
          <AnimatedSection delay={0.1} className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Notre histoire</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">Un parcours, étape par étape</h2>
              <p className="mt-3 text-sm leading-7 text-navy-500 sm:text-base">
                De la conviction fondatrice aux prochaines actions, voici les moments qui donnent son sens à la FSCPE.
              </p>
            </div>

            <div className="relative mt-12 before:absolute before:bottom-6 before:left-4 before:top-6 before:w-px before:bg-primary-200 sm:before:left-1/2 sm:before:-translate-x-1/2">
              <div className="space-y-10 sm:space-y-14">
                {HISTORY_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isRight = index % 2 === 1;

                  return (
                    <AnimatedSection
                      key={step.label}
                      direction={isRight ? "right" : "left"}
                      delay={0.12 + index * 0.08}
                      className="relative grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-4 sm:grid-cols-2 sm:gap-16"
                    >
                      <div className={`col-start-1 row-start-1 pl-0 sm:col-span-1 sm:pl-0 ${isRight ? "sm:col-start-2" : "sm:col-start-1 sm:text-right"}`}>
                        <div className={`rounded-2xl border border-navy-100 bg-white p-5 shadow-[0_16px_40px_-28px_rgba(16,26,46,0.5)] sm:p-6 ${isRight ? "sm:text-left" : ""}`}>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">{step.label}</p>
                          <p className="font-display mt-2 text-2xl font-bold text-navy-900">{step.year}</p>
                          <h3 className="font-display mt-3 text-lg font-semibold leading-tight text-navy-900">{step.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-navy-600">{step.description}</p>
                        </div>
                      </div>
                      <div className="absolute left-0 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-primary-600 text-white shadow-sm sm:left-1/2 sm:-translate-x-1/2">
                        <Icon size={14} strokeWidth={2.5} />
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <AnimatedSection delay={0.15} className="text-base leading-8 text-navy-600">
              <p>
                Depuis sa création, la {BRAND.fullName} ({BRAND.acronym}) s&apos;appuie sur une gouvernance structurée —
                Assemblée Générale, Conseil d&apos;Administration et Bureau Exécutif — pour garantir transparence et rigueur
                dans la gestion de chaque ressource confiée par ses donateurs et partenaires.
              </p>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <aside className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-[0_18px_50px_-24px_rgba(16,26,46,0.35)]">
                <div className="bg-navy-900 p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-200">Nos fondations</p>
                  <h3 className="font-display mt-2 text-xl font-bold">Une action responsable</h3>
                </div>
                <div className="space-y-5 p-6">
                  <div className="flex gap-3">
                    <Building2 className="mt-0.5 shrink-0 text-primary-600" size={20} />
                    <p className="text-sm leading-6 text-navy-600">Une gouvernance structurée au service de la transparence.</p>
                  </div>
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 shrink-0 text-primary-600" size={20} />
                    <p className="text-sm leading-6 text-navy-600">La protection des enfants au cœur de chaque décision.</p>
                  </div>
                  <div className="flex gap-3">
                    <HeartHandshake className="mt-0.5 shrink-0 text-primary-600" size={20} />
                    <p className="text-sm leading-6 text-navy-600">Des partenariats construits dans la durée.</p>
                  </div>
                  <blockquote className="border-l-4 border-primary-500 bg-primary-50 px-4 py-4 text-sm italic leading-6 text-navy-700">
                    &ldquo;{BRAND.quote}&rdquo;
                  </blockquote>
                </div>
              </aside>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </>
  );
}
