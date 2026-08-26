import type { Metadata } from "next";
import { Building2, HeartHandshake, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import { BRAND } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "À propos",
  description: "L'histoire de la Fondation Saran Camara pour l'Éducation et la Protection des Enfants.",
};

const ABOUT_HERO_BG =
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1920&auto=format&fit=crop";

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
      <div className="bg-gradient-to-b from-white to-primary-50/30 py-14 sm:py-16">
        <div className="container-app">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <AnimatedSection delay={0.1} className="space-y-5 text-base leading-8 text-navy-600">
              <div className="mb-7 border-b border-navy-100 pb-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Notre histoire</p>
                <h2 className="font-display mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">Grandir, apprendre, s&apos;épanouir</h2>
              </div>
              <p>
                Fondée en 2026 à Kissosso, Conakry, la {BRAND.fullName} ({BRAND.acronym}) est née d&apos;une conviction
                simple portée par sa fondatrice, Madame {BRAND.founderName} : chaque enfant, quelle que soit sa situation,
                mérite une chance réelle de grandir, d&apos;apprendre et de s&apos;épanouir.
              </p>
              <p>
                Constituée lors d&apos;une assemblée générale fondatrice réunissant dix membres engagés, la fondation s&apos;est
                fixée pour mission de promouvoir l&apos;accès à l&apos;éducation, de protéger les enfants vulnérables et
                d&apos;accompagner les familles démunies de la région de Conakry, avant d&apos;étendre progressivement ses
                actions à d&apos;autres régions de la République de Guinée.
              </p>
              <p>
                Depuis sa création, la fondation s&apos;appuie sur une gouvernance structurée — Assemblée Générale, Conseil
                d&apos;Administration et Bureau Exécutif — garantissant transparence et rigueur dans la gestion de chaque
                ressource confiée par nos donateurs et partenaires.
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
