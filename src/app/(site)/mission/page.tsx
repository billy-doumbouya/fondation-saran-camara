import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, ShieldCheck, HandHeart, Users2, ArrowRight, HeartHandshake } from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import InstitutionalHero from "@/components/site/institutional-hero";
import SectionHeading from "@/components/site/section-heading";
import { BRAND } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Mission & Vision — FSCPE",
  description:
    "Promouvoir, accompagner et garantir l'accès à l'éducation, à la protection sociale et sanitaire, ainsi qu'à l'épanouissement global de chaque enfant vulnérable.",
};

const MISSION_HERO_BG =
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=1920&auto=format&fit=crop";

const PILLARS = [
  { icon: GraduationCap, title: "Éducation", text: "Scolarisation, appui matériel, suivi pédagogique." },
  { icon: ShieldCheck, title: "Protection de l'enfance", text: "Défense des droits, sensibilisation communautaire." },
  { icon: HandHeart, title: "Aide aux orphelins", text: "Accompagnement moral, matériel et social." },
  { icon: Users2, title: "Action sociale", text: "Soutien aux familles démunies et au développement local." },
] as const;

const OBJECTIVES = [
  "Promouvoir l'accès à l'éducation pour les enfants vulnérables et les orphelins",
  "Sensibiliser les communautés aux droits fondamentaux de l'enfant",
  "Faciliter la scolarisation en prenant en charge frais d'inscription et de scolarité",
  "Fournir fournitures et kits scolaires aux enfants démunis",
  "Réduire le taux d'abandon scolaire lié aux difficultés financières",
  "Organiser des actions de solidarité pour les familles démunies",
  "Développer des partenariats stratégiques durables",
] as const;

export default function MissionPage() {
  return (
    <>
      <InstitutionalHero
        image={MISSION_HERO_BG}
        imageAlt="Enfants réunis dans une salle de classe"
        eyebrow="Mission & vision"
        title="Offrir à chaque enfant les conditions d'un avenir digne"
        description="Promouvoir, accompagner et garantir l'accès à l'éducation, à la protection sociale et sanitaire, ainsi qu'à l'épanouissement global de chaque enfant vulnérable."
        badge="Agir aujourd'hui, construire demain"
      />

      {/* ——— Pillars ——— */}
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
          <AnimatedSection>
            <SectionHeading
              eyebrow="Notre vision en action"
              title="Quatre engagements, une même ambition"
              description="Chaque pilier structure nos actions au quotidien et oriente nos décisions vers l'impact le plus direct pour les enfants."
            />
          </AnimatedSection>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <AnimatedSection key={p.title} delay={i * 0.06}>
                  <div className="group relative h-full overflow-hidden hairline bg-white rounded-lg p-6 transition-all duration-300 hover:hairline-strong hover:-translate-y-1">
                    <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white">
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <h3 className="font-display mt-4 text-base font-semibold text-navy-900">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-500">{p.text}</p>
                    <span className="mt-4 inline-block font-mono text-[0.625rem] uppercase tracking-widest text-navy-300">
                      0{i + 1} / 0{PILLARS.length}
                    </span>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ——— Quote bandeau ——— */}
      <section className="relative overflow-hidden bg-navy-900 py-16 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(115deg, var(--color-primary-800) 0%, var(--color-navy-900) 60%, var(--color-navy-800) 100%)",
          }}
        />
        <div className="absolute inset-0 grid-overlay opacity-25" aria-hidden />
        <span className="absolute inset-x-0 top-0 h-px bg-gold-500/40" aria-hidden />

        <AnimatedSection className="container-app relative">
          <figure className="mx-auto flex max-w-4xl flex-col items-center gap-7 text-center sm:flex-row sm:gap-10 sm:text-left">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full ring-4 ring-gold-400/50 shadow-2xl sm:h-36 sm:w-36">
              <Image
                src="/saran camara.png"
                alt={BRAND.founderName}
                fill
                sizes="144px"
                className="object-cover object-top"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span aria-hidden className="font-display text-5xl leading-none text-gold-400">&ldquo;</span>
              <blockquote className="font-display mt-2 text-2xl font-medium leading-snug text-white sm:text-3xl">
                {BRAND.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center justify-center gap-3 sm:justify-start">
                <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                <span className="font-mono text-xs uppercase tracking-widest text-gold-300">
                  {BRAND.founderName}, Fondatrice & Présidente FSCPE
                </span>
                <span className="h-px w-8 bg-gold-500/60" aria-hidden />
              </figcaption>
            </div>
          </figure>
        </AnimatedSection>
      </section>

      {/* ——— Objectives ——— */}
      <section className="container-app py-20 sm:py-24">
        <AnimatedSection className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold-500/60" aria-hidden />
            <span className="eyebrow">Notre feuille de route</span>
          </div>
          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            Nos objectifs
          </h2>
          <p className="mt-3 text-sm text-navy-500">
            Sept engagements concrets qui guident chacune de nos actions sur le terrain.
          </p>

          <ul className="mt-8 hairline-t">
            {OBJECTIVES.map((o, i) => (
              <AnimatedSection
                key={o}
                delay={i * 0.04}
                direction="up"
                className="flex items-start gap-4 hairline-b py-4"
              >
                <span className="font-mono text-sm font-bold text-primary-600 tabular-nums shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-navy-700 sm:text-base">{o}</p>
              </AnimatedSection>
            ))}
          </ul>
        </AnimatedSection>
      </section>

      {/* ——— CTA ——— */}
      <section className="container-app pb-20 sm:pb-24">
        <AnimatedSection>
          <div className="relative overflow-hidden hairline-strong bg-white rounded-lg p-8 text-center sm:p-10">
            <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary-500/8 blur-3xl"
            />
            <span className="eyebrow">Agissez avec nous</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
              Soutenez notre mission dès aujourd&apos;hui
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-navy-500">
              Chaque don, chaque bénévolat, chaque partenariat nous rapproche d&apos;une Guinée
              où chaque enfant grandit avec dignity et espoir.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/don" className="btn-primary">
                <HeartHandshake size={16} />
                Faire un don
              </Link>
              <Link href="/contact" className="btn-ghost">
                Devenir bénévole
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}