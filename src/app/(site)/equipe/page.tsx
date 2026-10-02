import type { Metadata } from "next";
import Link from "next/link";
import {
  UsersRound,
  ShieldCheck,
  Award,
  HeartHandshake,
  ArrowRight,
  Scale,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import TeamOrganigram from "@/components/site/TeamOrganigram";
import { teamRepo } from "@/lib/db/repo";

export const metadata: Metadata = {
  title: "Gouvernance & Organigramme — FSCPE",
  description:
    "Découvrez l'organigramme officiel et l'équipe dirigeante de la Fondation Saran Camara : Présidence, Bureau Exécutif, Conseil d'Administration et responsables de pôles opérationnels.",
};

export const dynamic = "force-dynamic";

const TEAM_HERO_BG =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1920&auto=format&fit=crop";

export default async function TeamPage() {
  const members = await teamRepo.listAll().catch(() => []);

  return (
    <>
      {/* Hero Institutionnel de Haute Facture */}
      <InstitutionalHero
        image={TEAM_HERO_BG}
        imageAlt="Gouvernance et équipe dirigeante de la Fondation Saran Camara"
        eyebrow="Gouvernance &amp; Transparence"
        title="Une architecture humaine au service de l'enfance"
        description="Une hiérarchie collégiale, rigoureuse et transparente où chaque décision est guidée par l'intérêt supérieur de l'orphelin et la protection de ses droits fondamentaux."
        badge={
          <div className="flex items-center gap-2 text-sm text-white/90">
            <UsersRound size={16} className="text-gold-400" />
            <span>10 Membres Dirigeants Statutaires</span>
          </div>
        }
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-sm hairline border-gold-400/30 bg-gold-500/10 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-gold-300 backdrop-blur-sm">
            <Sparkles size={11} className="text-gold-400" />
            Conakry, République de Guinée
          </span>
        </div>
      </InstitutionalHero>

      {/* Barre de métriques et principes de gouvernance */}
      <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-navy-100 bg-white p-6 sm:p-8 shadow-xl shadow-navy-950/5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-navy-100">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950">
                10
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-gold-600 font-semibold mt-1">
                Membres dirigeants
              </span>
              <p className="text-xs text-navy-500 mt-1">
                Juristes, pédiatres, sociologues et éducateurs
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-4 lg:pt-0 lg:pl-8">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-primary-600">
                3
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-gold-600 font-semibold mt-1">
                Organes statutaires
              </span>
              <p className="text-xs text-navy-500 mt-1">
                Présidence, Bureau Exécutif &amp; CA
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-4 lg:pt-0 lg:pl-8">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950">
                100 %
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-gold-600 font-semibold mt-1">
                Bénévolat de direction
              </span>
              <p className="text-xs text-navy-500 mt-1">
                Mandats désintéressés pour l&apos;impact
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-4 lg:pt-0 lg:pl-8">
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-primary-600">
                15+
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-gold-600 font-semibold mt-1">
                Années d&apos;engagement
              </span>
              <p className="text-xs text-navy-500 mt-1">
                Ancrage ininterrompu sur le sol guinéen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corps Principal : Organigramme Interactif Vivant & Annuaire */}
      <section className="relative overflow-x-clip py-16 sm:py-24">
        {/* Fond texturé subtil */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(#2f9950 0.75px, transparent 0.75px), radial-gradient(#d4a017 0.75px, transparent 0.75px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 16px 16px",
          }}
        />

        <div className="container-app relative">
          {members.length > 0 ? (
            <AnimatedSection>
              <TeamOrganigram members={members} />
            </AnimatedSection>
          ) : (
            <div className="mx-auto max-w-md text-center py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-navy-50 text-navy-400">
                <UsersRound size={28} />
              </div>
              <h3 className="font-display text-lg font-bold text-navy-900 mt-4">
                Instances en cours de publication
              </h3>
              <p className="text-sm text-navy-500 mt-2">
                Les fiches officielles de l&apos;équipe dirigeante seront disponibles prochainement.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Section 4 Piliers de Bonne Gouvernance - Design lumineux, lisibilité cristalline */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-[#fbfaf6] via-navy-50/40 to-white relative overflow-hidden border-t border-navy-100">
        <div className="container-app relative">
          <AnimatedSection>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500" aria-hidden />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold-700">
                  Transparence &amp; Rigueur Institutionnelle
                </span>
              </div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl mt-3">
                Notre Charte Éthique de Gouvernance
              </h2>
              <p className="text-base sm:text-lg text-navy-700 mt-4 leading-relaxed font-normal">
                Afin de garantir que chaque franc guinéen versé profite directement aux enfants, notre conseil s&apos;astreint aux standards de gouvernance les plus exigeants.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <div className="group relative rounded-2xl border border-navy-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-500 hover:shadow-xl">
                <span className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-gold-500 to-gold-400" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-700 mb-5 border border-gold-200">
                  <Award size={22} className="text-gold-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-navy-950">
                  Bénévolat Statutaire
                </h3>
                <p className="text-sm text-navy-700 mt-3 leading-relaxed">
                  Tous les membres du bureau et du conseil exercent leurs mandats à titre strictement gracieux, sans rémunération ni jetons de présence.
                </p>
              </div>

              <div className="group relative rounded-2xl border border-navy-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-xl">
                <span className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-primary-600 to-primary-400" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 mb-5 border border-primary-200">
                  <Scale size={22} className="text-primary-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-navy-950">
                  Contrôle &amp; Double Signature
                </h3>
                <p className="text-sm text-navy-700 mt-3 leading-relaxed">
                  Tout engagement financier supérieur au seuil réglementaire exige l&apos;approbation conjointe de la Présidence et de la Trésorerie Générale.
                </p>
              </div>

              <div className="group relative rounded-2xl border border-navy-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-500 hover:shadow-xl">
                <span className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-gold-500 to-gold-400" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-700 mb-5 border border-gold-200">
                  <ShieldCheck size={22} className="text-gold-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-navy-950">
                  Audit Annuel Public
                </h3>
                <p className="text-sm text-navy-700 mt-3 leading-relaxed">
                  Publication intégrale de nos comptes de résultat et rapports d&apos;activités certifiés pour assurer une transparence sans faille auprès des donateurs.
                </p>
              </div>

              <div className="group relative rounded-2xl border border-navy-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-xl">
                <span className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-primary-600 to-primary-400" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 mb-5 border border-primary-200">
                  <HeartHandshake size={22} className="text-primary-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-navy-950">
                  Ancrage Communautaire
                </h3>
                <p className="text-sm text-navy-700 mt-3 leading-relaxed">
                  Implication continue des relais de quartiers, chefs traditionnels et mères de famille pour adapter chaque action aux réalités locales.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Appel aux compétences & Engagement bénévole */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-50/30">
        <div className="container-app">
          <div className="rounded-3xl border border-primary-200 bg-gradient-to-br from-primary-900 via-primary-950 to-navy-950 p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
            {/* Décoration d'arrière-plan */}
            <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-gold-400 font-bold">
                Engagement Citoyen • Bénévolat
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
                Vous souhaitez apporter votre expertise à la Fondation ?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
                Médecins, éducateurs, juristes, informaticiens ou communicants : la Fondation Saran Camara accueille les femmes et hommes désireux de consacrer un peu de leur temps à l&apos;émancipation des orphelins de Guinée.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy-950 shadow-lg shadow-gold-500/20 hover:bg-gold-400 hover:scale-[1.02] transition-all"
                >
                  <span>Proposer mes compétences</span>
                  <ArrowRight size={15} />
                </Link>

                <div className="flex items-center gap-2 text-xs text-emerald-200 font-medium">
                  <CheckCircle size={15} className="text-emerald-400" />
                  <span>Missions ponctuelles ou régulières adaptées à votre emploi du temps</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
