import type { Metadata } from "next";
import { Suspense } from "react";
import { BookOpenCheck, HeartHandshake, ShieldCheck, LockKeyhole } from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import InstitutionalHero from "@/components/site/institutional-hero";
import DonateForm from "@/components/site/donate-form";
import DonateFormSkeleton from "@/components/site/donate-form-skeleton";

export const metadata: Metadata = {
  title: "Faire un don — FSCPE",
  description:
    "Chaque contribution aide un enfant à apprendre, à être protégé et à construire un avenir digne. Soutenez la Fondation Saran Camara.",
};

const DONATE_HERO_BG =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1920&auto=format&fit=crop";

export default function DonatePage() {
  return (
    <>
      <InstitutionalHero
        image={DONATE_HERO_BG}
        imageAlt="Enfant étudiant avec un livre"
        eyebrow="Faire un don"
        title="Votre générosité ouvre des portes"
        description="Chaque contribution aide un enfant à apprendre, à être protégé et à construire un avenir digne."
        badge="Un geste, des possibilités nouvelles"
      />

      <section className="container-app py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-8">
          {/* ——— Sidebar impact ——— */}
          <AnimatedSection direction="left" className="lg:sticky lg:top-28">
            <aside className="relative overflow-hidden rounded-lg bg-navy-900 p-7 text-white sm:p-8">
              {/* Mesh accent (remplace le WebGL torusKnot) */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/15 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-gold-500/10 blur-3xl"
              />
              <div className="absolute inset-0 grid-overlay opacity-25" aria-hidden />
              <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-400/60" aria-hidden />
                  <span className="eyebrow eyebrow-light">Votre impact</span>
                </div>
                <h2 className="font-display mt-3 text-2xl font-bold leading-tight">
                  Un don qui devient une action concrète
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-navy-200">
                  100% des dons sont directement affectés aux frais de scolarité, kits scolaires
                  et actions de protection des enfants.
                </p>

                <ul className="mt-8 space-y-5 hairline-t border-white/10 pt-6">
                  <ImpactItem
                    icon={<BookOpenCheck size={18} strokeWidth={1.75} />}
                    title="Favoriser l'éducation"
                    text="Scolarité, fournitures et accompagnement."
                  />
                  <ImpactItem
                    icon={<ShieldCheck size={18} strokeWidth={1.75} />}
                    title="Protéger les enfants"
                    text="Des actions adaptées aux situations vulnérables."
                  />
                  <ImpactItem
                    icon={<HeartHandshake size={18} strokeWidth={1.75} />}
                    title="Agir ensemble"
                    text="Une solidarité qui se construit dans la durée."
                  />
                </ul>
              </div>
            </aside>
          </AnimatedSection>

          {/* ——— Form ——— */}
          <AnimatedSection direction="right" delay={0.1}>
            <Suspense fallback={<DonateFormSkeleton />}>
              <DonateForm />
            </Suspense>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-navy-400">
              <LockKeyhole size={13} className="text-primary-600" strokeWidth={1.75} />
              Paiement traité par un partenaire sécurisé
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

function ImpactItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <li className="group flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md hairline border-white/10 bg-white/[0.04] text-primary-300 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900 group-hover:border-gold-500">
        {icon}
      </span>
      <div>
        <p className="font-display text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-navy-300">{text}</p>
      </div>
    </li>
  );
}