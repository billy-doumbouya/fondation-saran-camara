import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Users2,
  HandHeart,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HeartHandshake,
  Receipt,
  FileCheck2,
  Eye,
} from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import InstitutionalHero from "@/components/site/institutional-hero";
import ProgramCard from "@/components/site/cards/program-card";
import { programsRepo } from "@/lib/db/repo";

export const metadata: Metadata = {
  title: "Notre Impact & Transparence — FSCPE",
  description:
    "Découvrez les résultats concrets de nos actions en Guinée, nos 4 piliers d'intervention et nos engagements stricts de traçabilité et de transparence.",
};
export const dynamic = "force-dynamic";

const IMPACT_HERO_BG =
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=1920&auto=format&fit=crop";

export default async function ImpactPage() {
  const programs = await programsRepo.listPublished().catch(() => []);
  const totalBeneficiaries = programs.reduce(
    (sum, p) => sum + (p.beneficiariesCount ?? 0),
    0,
  );

  return (
    <>
      <InstitutionalHero
        image={IMPACT_HERO_BG}
        imageAlt="Élèves réunis dans une salle de classe"
        eyebrow="Mesurer notre impact"
        title="Chaque chiffre est une promesse tenue pour l'avenir"
        description="Chaque contribution se traduit par des actions tangibles sur le terrain : scolarisation d'orphelins, kits scolaires et protection des enfants en Guinée."
        badge="100% direct aux enfants"
      />

      {/* ——— Section 1 : Chiffres clés ——— */}
      <section className="relative overflow-hidden py-16 sm:py-20">
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
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold-500/60" aria-hidden />
              <span className="eyebrow">Indicateurs clés</span>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                  L&apos;impact en quelques chiffres
                </h2>
                <p className="mt-2 text-sm text-navy-500">
                  Des repères mesurables pour rendre compte de l&apos;action de la Fondation.
                </p>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-navy-400">
                Données de terrain certifiées
              </span>
            </div>
            <span className="mt-4 block h-px w-full bg-navy-100" aria-hidden />
          </AnimatedSection>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Carte principale en vedette (Navy) */}
            <AnimatedSection delay={0.06} className="sm:col-span-2">
              <div className="mesh-luxury-dark relative h-full overflow-hidden rounded-lg p-7 text-white shadow-md sm:p-8">
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />
                <ImpactPathMesh tone="gold" className="h-52 w-80 opacity-70" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-sm bg-white/10 px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-primary-200">
                        <Users2 size={13} />
                        Bénéficiaires directs
                      </span>
                      <span className="font-mono text-xs text-navy-400">Total cumulé</span>
                    </div>

                    <p className="font-display mt-6 text-4xl font-bold sm:text-5xl text-white tabular-nums">
                      {totalBeneficiaries > 0
                        ? `${totalBeneficiaries.toLocaleString("fr-FR")}+`
                        : "100+"}
                    </p>
                    <p className="font-display mt-2 text-lg font-semibold text-primary-200">
                      Enfants scolarisés et soutenus
                    </p>
                    <p className="mt-2 text-sm text-navy-300 leading-relaxed max-w-md">
                      Prise en charge intégrale ou partielle des frais de scolarité, dotations de
                      kits scolaires et accompagnement direct pour lutter contre la déscolarisation.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 font-mono text-xs text-gold-400 hairline-t border-white/10 pt-4">
                    <CheckCircle2 size={14} />
                    <span>Paiements effectués sans intermédiaire aux écoles</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Carte Programmes */}
            <AnimatedSection delay={0.12}>
              <div className="mesh-soft relative flex h-full flex-col justify-between overflow-hidden rounded-lg hairline bg-white p-6 shadow-sm transition-all duration-300 hover:hairline-strong hover:-translate-y-0.5 sm:p-7">
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />
                <ImpactPathMesh tone="primary" />
                <div className="relative z-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md hairline bg-primary-50 text-primary-700">
                    <GraduationCap size={22} strokeWidth={1.75} />
                  </div>
                  <p className="font-display mt-6 text-3xl font-bold text-navy-900 tabular-nums">
                    {programs.length > 0 ? programs.length : "4"}
                  </p>
                  <p className="font-display mt-1 text-base font-semibold text-navy-800">
                    Programmes déployés
                  </p>
                  <p className="mt-2 text-xs text-navy-500 leading-relaxed">
                    Des projets d&apos;aide conçus pour répondre aux besoins vitaux des orphelins et des écoliers.
                  </p>
                </div>
                <div className="mt-4 font-mono text-[0.625rem] uppercase tracking-wider text-navy-400 hairline-t pt-3">
                  Éducation • Protection • Social
                </div>
              </div>
            </AnimatedSection>

            {/* Carte Zone d'action */}
            <AnimatedSection delay={0.18}>
              <div className="mesh-soft relative flex h-full flex-col justify-between overflow-hidden rounded-lg hairline bg-white p-6 shadow-sm transition-all duration-300 hover:hairline-strong hover:-translate-y-0.5 sm:p-7">
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />
                <ImpactPathMesh tone="gold" />
                <div className="relative z-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md hairline bg-gold-50 text-gold-700">
                    <MapPin size={22} strokeWidth={1.75} />
                  </div>
                  <p className="font-display mt-6 text-3xl font-bold text-navy-900">
                    Guinée
                  </p>
                  <p className="font-display mt-1 text-base font-semibold text-navy-800">
                    Conakry &amp; Régions
                  </p>
                  <p className="mt-2 text-xs text-navy-500 leading-relaxed">
                    Une présence active dans les communes vulnérables et un déploiement progressif à l&apos;intérieur du pays.
                  </p>
                </div>
                <div className="mt-4 font-mono text-[0.625rem] uppercase tracking-wider text-navy-400 hairline-t pt-3">
                  Ancrage territorial
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ——— Section 2 : 4 Piliers d'intervention ——— */}
      <section className="py-16 sm:py-20 hairline-t bg-white">
        <div className="container-app">
          <AnimatedSection>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold-500/60" aria-hidden />
              <span className="eyebrow">Domaines d&apos;action</span>
            </div>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
              Nos 4 piliers d&apos;impact
            </h2>
            <p className="mt-2 text-sm text-navy-500 max-w-2xl">
              Une approche globale qui allie scolarité, sécurité affective et soutien matériel pour
              permettre à chaque enfant de construire son avenir.
            </p>
          </AnimatedSection>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <PillarCard
              icon={<GraduationCap size={24} strokeWidth={1.75} />}
              title="Éducation & Scolarité"
              tag="Accès au savoir"
              description="Règlement direct des frais de scolarité, remise de kits scolaires complets (sacs, cahiers, manuels) et suivi trimestriel de l'assiduité."
              tone="primary"
            />
            <PillarCard
              icon={<ShieldCheck size={24} strokeWidth={1.75} />}
              title="Protection de l'Enfance"
              tag="Sécurité & Dignité"
              description="Actions contre le travail précoce des mineurs, accompagnement médico-social et sensibilisation communautaire aux droits de l'enfant."
              tone="navy"
            />
            <PillarCard
              icon={<HandHeart size={24} strokeWidth={1.75} />}
              title="Aide aux Orphelins"
              tag="Solidarité continue"
              description="Parrainage personnalisé d'enfants orphelins de père ou de mère, soutien direct aux tuteurs légaux et aide alimentaire d'appoint."
              tone="gold"
            />
            <PillarCard
              icon={<Users2 size={24} strokeWidth={1.75} />}
              title="Action Sociale"
              tag="Cohésion locale"
              description="Interventions d'urgence auprès des familles en précarité extrême pour maintenir les enfants dans un foyer stable et chaleureux."
              tone="primary"
            />
          </div>
        </div>
      </section>

      {/* ——— Section 3 : Transparence & Traçabilité ——— */}
      <section className="py-16 sm:py-20 hairline-t bg-navy-50/60">
        <div className="container-app">
          <AnimatedSection className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-gold-500/60" aria-hidden />
              <span className="eyebrow">Confiance &amp; Rigueur</span>
              <span className="h-px w-8 bg-gold-500/60" aria-hidden />
            </div>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
              Notre charte d&apos;exigence et de transparence
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-600 max-w-2xl mx-auto">
              Chaque franc guinéen ou euro confié à la FSCPE doit avoir un impact mesurable et
              incontestable dans la vie des enfants.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <TransparenceCard
              icon={<Receipt size={22} className="text-primary-700" strokeWidth={1.75} />}
              title="Zéro versement en liquide"
              text="Aucun don n'est transmis sous forme d'espèces aux familles. La Fondation règle directement les établissements scolaires et fournisseurs sur présentation de reçus officiels."
              tone="primary"
            />
            <TransparenceCard
              icon={<FileCheck2 size={22} className="text-gold-700" strokeWidth={1.75} />}
              title="Sélection sur critères rigoureux"
              text="La priorité est accordée aux orphelins totaux, aux orphelins de père ou de mère, et aux enfants en situation d'abandon ou de déscolarisation imminente."
              tone="gold"
            />
            <TransparenceCard
              icon={<Eye size={22} className="text-navy-700" strokeWidth={1.75} />}
              title="Suivi de terrain régulier"
              text="Nos coordinateurs effectuent des visites régulières dans les écoles partenaires afin de vérifier l'assiduité, les notes et l'épanouissement de chaque enfant."
              tone="navy"
            />
          </div>
        </div>
      </section>

      {/* ——— Section 4 : Programmes associés ——— */}
      {programs.length > 0 && (
        <section className="py-16 sm:py-20 hairline-t bg-white">
          <div className="container-app">
            <AnimatedSection>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                    <span className="eyebrow">Sur le terrain</span>
                  </div>
                  <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                    Les programmes qui incarnent cet impact
                  </h2>
                </div>
                <Link
                  href="/programmes"
                  className="font-display text-xs font-semibold text-primary-700 hover:text-navy-900 inline-flex items-center gap-1.5"
                >
                  <span>Consulter tous les projets</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </AnimatedSection>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.slice(0, 3).map((p, i) => (
                <AnimatedSection key={p.id} delay={(i % 3) * 0.08}>
                  <ProgramCard program={p} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— Section 5 : CTA Final ——— */}
      <section className="py-16 sm:py-20 hairline-t bg-navy-900 text-white">
        <div className="container-app">
          <AnimatedSection className="relative overflow-hidden rounded-lg bg-navy-950 p-8 sm:p-12 shadow-xl border border-white/10">
            <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/15 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-gold-500/10 blur-3xl"
            />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="eyebrow eyebrow-light">Agissez avec nous</span>
                <h3 className="font-display mt-3 text-2xl font-bold sm:text-4xl leading-tight">
                  Vous aussi, devenez un artisan de ce changement
                </h3>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-navy-200">
                  Avec 100 000 GNF ou plus, vous garantissez à un enfant les fournitures essentielles
                  pour une année scolaire complète et un accompagnement de proximité.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/don"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-display text-sm font-semibold text-primary-700 shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-50"
                >
                  <HeartHandshake size={16} strokeWidth={2} />
                  Faire un don maintenant
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Devenir partenaire
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

// ——— Sous-composants ———

function PillarCard({
  icon,
  title,
  tag,
  description,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  tag: string;
  description: string;
  tone: "primary" | "navy" | "gold";
}) {
  const iconCls = {
    primary: "bg-primary-50 text-primary-700 border-primary-200/60",
    navy: "bg-navy-50 text-navy-700 border-navy-200/60",
    gold: "bg-gold-50 text-gold-700 border-gold-200/60",
  }[tone];
  const accentCls = {
    primary: "bg-primary-600",
    navy: "bg-navy-700",
    gold: "bg-gold-500",
  }[tone];

  return (
    <AnimatedSection delay={0.08}>
      <div className="mesh-soft relative flex h-full flex-col justify-between overflow-hidden rounded-lg hairline bg-white p-6 shadow-sm transition-all duration-300 hover:hairline-strong hover:-translate-y-0.5">
        <span className={`absolute inset-x-0 top-0 h-0.5 ${accentCls}`} aria-hidden />
        <ImpactPathMesh tone={tone} />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-md border ${iconCls}`}
            >
              {icon}
            </span>
            <span className="font-mono text-[0.625rem] uppercase tracking-wider text-navy-400">
              {tag}
            </span>
          </div>

          <h3 className="font-display mt-5 text-lg font-bold text-navy-900">
            {title}
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-navy-500">
            {description}
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}

function TransparenceCard({
  icon,
  title,
  text,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tone: "primary" | "navy" | "gold";
}) {
  const accentCls = {
    primary: "bg-primary-600",
    navy: "bg-navy-700",
    gold: "bg-gold-500",
  }[tone];

  return (
    <AnimatedSection delay={0.08}>
      <div className="mesh-soft relative h-full overflow-hidden rounded-lg hairline bg-white p-6 shadow-sm">
        <span className={`absolute inset-x-0 top-0 h-0.5 ${accentCls}`} aria-hidden />
        <ImpactPathMesh tone={tone} className="h-28 w-48 opacity-70" />
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-md hairline bg-white/80">
          {icon}
        </div>
        <h4 className="font-display relative z-10 mt-4 text-base font-bold text-navy-900">
          {title}
        </h4>
        <p className="relative z-10 mt-2 text-xs leading-relaxed text-navy-500 sm:text-sm">
          {text}
        </p>
      </div>
    </AnimatedSection>
  );
}

function ImpactPathMesh({
  tone,
  className = "",
}: {
  tone: "primary" | "navy" | "gold";
  className?: string;
}) {
  const toneCls = {
    primary: "text-primary-600/15",
    navy: "text-navy-700/15",
    gold: "text-gold-600/20",
  }[tone];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 160"
      fill="none"
      className={`pointer-events-none absolute -right-4 -top-3 h-40 w-60 ${toneCls} ${className}`}
    >
      <path d="M-20 126C25 74 43 26 94 31c47 5 48 63 92 66 28 2 39-25 74-47" stroke="currentColor" />
      <path d="M-20 142C27 91 49 43 96 47c43 4 48 56 89 59 30 2 45-22 75-42" stroke="currentColor" />
      <path d="M-20 158C29 108 54 61 99 63c39 2 48 49 87 52 31 2 50-19 74-37" stroke="currentColor" />
      <path d="M-20 110C22 56 37 10 91 15c51 5 48 70 96 72 24 1 32-27 73-52" stroke="currentColor" />
    </svg>
  );
}
