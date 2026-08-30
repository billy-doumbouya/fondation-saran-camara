import type { Metadata } from "next";
import { BookOpenCheck, HeartHandshake, LockKeyhole, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import DonateForm from "@/components/site/DonateForm";
import Donation3DAccent from "@/app/(site)/Donation3DAccent";
import { Suspense } from "react";
import DonateFormSkeleton from "@/components/DonateFormSkeleton";

export const metadata: Metadata = { title: "Faire un don" };

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
        badge={<span className="text-sm text-white/85">Un geste, des possibilités nouvelles</span>}
      />
      <div className="bg-gradient-to-b from-white to-primary-50/30 py-12 sm:py-16">
        <div className="container-app">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12">
            <AnimatedSection direction="left" className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-7 text-white shadow-xl shadow-navy-900/15 sm:p-8">
                {/* Accent 3D ambiant, cadré dans le coin supérieur droit du
                    panneau — décoratif uniquement, jamais dans le flux de
                    lecture ni cliquable. */}
                <Donation3DAccent className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-70 sm:h-72 sm:w-72" />

                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-200">Votre impact</p>
                  <h2 className="font-display mt-3 text-2xl font-bold leading-tight">
                    Un don qui devient une action concrète
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    100% des dons sont directement affectés aux frais de scolarité, kits scolaires et actions de
                    protection des enfants.
                  </p>
                  <div className="mt-8 space-y-5 border-t border-white/10 pt-6">
                    <div className="flex gap-3">
                      <BookOpenCheck className="mt-0.5 shrink-0 text-primary-300" size={20} />
                      <div>
                        <p className="text-sm font-semibold">Favoriser l&apos;éducation</p>
                        <p className="mt-1 text-xs leading-5 text-white/60">
                          Scolarité, fournitures et accompagnement.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <ShieldCheck className="mt-0.5 shrink-0 text-primary-300" size={20} />
                      <div>
                        <p className="text-sm font-semibold">Protéger les enfants</p>
                        <p className="mt-1 text-xs leading-5 text-white/60">
                          Des actions adaptées aux situations vulnérables.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <HeartHandshake className="mt-0.5 shrink-0 text-primary-300" size={20} />
                      <div>
                        <p className="text-sm font-semibold">Agir ensemble</p>
                        <p className="mt-1 text-xs leading-5 text-white/60">
                          Une solidarité qui se construit dans la durée.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right" delay={0.1}>
              <Suspense fallback={<DonateFormSkeleton />}>
                <DonateForm />
              </Suspense>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-navy-400">
                <LockKeyhole size={14} className="text-primary-600" />
                Paiement traité par un partenaire sécurisé
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </>
  );
}