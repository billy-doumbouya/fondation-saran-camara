import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  HandHeart,
  HeartHandshake,
  Scale,
  ShieldCheck,
  Sparkles,
  UsersRound,
  UserRound,
  Compass,
  Target,
  Award,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { TeamMember } from "@/lib/db/schema";
import { BRAND } from "@/lib/site-data";
import { teamRepo } from "@/lib/db/repo";
import AboutTimeline from "@/components/site/AboutTimeline";
import AboutStats from "@/components/site/AboutStats";
import AnimatedSection from "@/components/site/AnimatedSection";

export const metadata: Metadata = {
  title: "À propos — Fondation Saran Camara (FSCPE)",
  description:
    "Découvrez l'histoire, la vision, les valeurs fondatrices et l'équipe engagée de la Fondation Saran Camara pour l'Éducation et la Protection des Enfants à Conakry, Guinée.",
};

export const dynamic = "force-dynamic";

const PILLARS = [
  { label: "Éducation & Scolarité", icon: BookOpenCheck, color: "text-primary-700 bg-primary-50 border-primary-200" },
  { label: "Protection de l'Enfance", icon: ShieldCheck, color: "text-navy-700 bg-navy-50 border-navy-200" },
  { label: "Accompagnement des Orphelins", icon: HandHeart, color: "text-gold-700 bg-gold-50 border-gold-200" },
  { label: "Solidarité Communautaire", icon: UsersRound, color: "text-primary-800 bg-primary-50/80 border-primary-200" },
] as const;

const VALUES = [
  {
    title: "Dignité Humaine",
    text: "Placer l'intérêt supérieur, l'épanouissement et le respect inconditionnel de chaque enfant au cœur absolu de toutes nos interventions.",
    icon: HeartHandshake,
    tone: "text-gold-700 bg-gold-50 border-gold-200",
    badge: "Valeur Cardinal",
  },
  {
    title: "Équité & Justice",
    text: "Garantir un accès juste à une éducation de qualité et un accompagnement sans discrimination d'origine, de genre ou de condition sociale.",
    icon: Scale,
    tone: "text-primary-700 bg-primary-50 border-primary-200",
    badge: "Inclusion",
  },
  {
    title: "Transparence & Rigueur",
    text: "Rendre compte avec intégrité de chaque franc et ressource allouée, assurant la traçabilité intégrale de nos actions humanitaires.",
    icon: CheckCircle2,
    tone: "text-navy-700 bg-navy-50 border-navy-200",
    badge: "Gouvernance",
  },
  {
    title: "Solidarité Active",
    text: "Bâtir des alliances durables avec les familles d'accueil, les écoles, les autorités locales et les partenaires de la société civile.",
    icon: UsersRound,
    tone: "text-primary-700 bg-primary-50 border-primary-200",
    badge: "Collectif",
  },
] as const;

export default async function AboutPage() {
  const teamResult = await teamRepo.listAll().catch(() => null);
  const team = teamResult ?? [];

  const stats = [
    { value: "2026", label: "Année de fondation officielle" },
    { value: "04", label: "Piliers d'intervention stratégiques" },
    {
      value: teamResult === null ? "10+" : String(team.length || "10"),
      label: "Membres de la gouvernance",
    },
    { value: "Conakry", label: "Ancrage territorial (Kissosso)" },
  ];

  return (
    <main className="bg-background text-navy-950 selection:bg-primary-100 selection:text-primary-900">
      {/* ========================================================
          1. HERO INSTITUTIONNEL & PORTRAIT FONDATRICE
          ======================================================== */}
      <section className="relative overflow-hidden border-b border-navy-100 bg-linear-to-b from-white via-background to-white py-14 sm:py-20 lg:py-24">
        {/* Cercles diffus subtils en arrière-plan */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-100/40 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-gold-100/40 blur-3xl" />

        <div className="container-app relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <AnimatedSection direction="up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-primary-50/70 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary-800 shadow-xs">
                <Sparkles size={14} className="text-gold-600 animate-pulse" aria-hidden="true" />
                <span>À propos de la FSCPE</span>
              </div>

              <h1 className="font-display mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-950 sm:text-5xl lg:text-6xl">
                Chaque enfant mérite une chance de{" "}
                <span className="bg-linear-to-r from-primary-700 via-primary-600 to-gold-600 bg-clip-text text-transparent">
                  grandir, d&apos;apprendre
                </span>{" "}
                et de réussir.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-700 sm:text-lg">
                La <strong className="font-semibold text-navy-950">{BRAND.fullName}</strong> est une organisation dédiée à la réhabilitation des droits fondamentaux des enfants orphelins et vulnérables en République de Guinée.
              </p>

              {/* Ruban des 4 piliers synthétiques */}
              <div className="mt-8 flex flex-wrap gap-2 sm:gap-2.5">
                {PILLARS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <span
                      key={p.label}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200/70 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-navy-800 shadow-2xs"
                    >
                      <Icon size={14} className="text-primary-700" />
                      <span>{p.label}</span>
                    </span>
                  );
                })}
              </div>

              {/* Boutons d'action rapides */}
              <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <Link
                  href="/don"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary-700 px-6 py-3.5 font-display text-sm font-semibold text-white shadow-md shadow-primary-700/20 transition-all duration-300 hover:bg-primary-800 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
                >
                  Soutenir notre action
                  <HeartHandshake size={17} />
                </Link>
                <Link
                  href="/impact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-6 py-3.5 font-display text-sm font-semibold text-navy-800 shadow-2xs transition-all duration-300 hover:border-primary-300 hover:bg-primary-50/50 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
                >
                  Découvrir notre impact
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-7 flex items-center gap-3 text-xs text-navy-500 font-mono">
                <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-ping" />
                <span>Organisation déclarée sous le récépissé officiel · Conakry, Guinée</span>
              </div>
            </AnimatedSection>

            {/* Carte Portrait Présidente & Fondatrice avec cadre de prestige */}
            <AnimatedSection direction="scale" delay={0.15}>
              <figure className="relative mx-auto w-full max-w-md lg:ml-auto">
                <div className="group relative aspect-4/4.5 overflow-hidden rounded-3xl border-2 border-gold-300/40 bg-white p-2.5 shadow-2xl shadow-navy-950/10">
                  <div className="relative h-full w-full overflow-hidden rounded-2xl bg-navy-100">
                    <Image
                      src="/saran camara.png"
                      alt="Saran Camara, Présidente et Fondatrice de la FSCPE"
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 42vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-transparent to-transparent opacity-80" />
                    
                    {/* Badge flottant sur l'image */}
                    <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-white/90 p-3.5 backdrop-blur-md shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-display text-sm font-bold text-navy-950">
                            {BRAND.founderName}
                          </p>
                          <p className="font-mono text-[11px] font-semibold text-primary-700 uppercase tracking-wider">
                            Fondatrice &amp; Présidente
                          </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-100 text-gold-800">
                          <Award size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <figcaption className="mt-3.5 px-2 text-center text-xs italic text-navy-500">
                  &ldquo;{BRAND.quote}&rdquo;
                </figcaption>
              </figure>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. REPÈRES CHIFFRÉS & STATS DYNAMIQUES
          ======================================================== */}
      <AboutStats stats={stats} />

      {/* ========================================================
          3. NOTRE RAISON D'ÊTRE, MISSION & VISION
          ======================================================== */}
      <section className="container-app py-16 sm:py-24">
        <AnimatedSection direction="up">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
                Notre raison d&apos;être
              </p>
              <h2 className="font-display mt-3 text-3xl font-extrabold leading-tight text-navy-950 sm:text-4xl">
                L&apos;enfance au cœur de chaque décision.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-navy-700">
                En Guinée, des milliers d&apos;enfants orphelins sont confrontés à la déscolarisation précoce, à la précarité alimentaire et au manque de prise en charge psychologique. La FSCPE intervient comme une passerelle d&apos;espoir, en restaurant leur accès à l&apos;école, à la santé et à un foyer chaleureux.
              </p>

              <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                    <Target size={20} />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-navy-900">
                      Notre engagement direct
                    </h4>
                    <p className="mt-0.5 text-xs text-navy-600">
                      Zéro intermédiaire : 100% de vos dons soutiennent directement les enfants.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <article className="group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 shadow-xs transition-all duration-300 hover:border-primary-300 hover:shadow-lg hover:-translate-y-1">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary-600" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 mb-4 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  <Compass size={24} />
                </div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary-700">
                  Notre mission
                </p>
                <h3 className="font-display mt-2 text-xl font-bold text-navy-950">
                  Ouvrir des possibilités concrètes
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">
                  Identifier, inscrire à l&apos;école et parrainer les orphelins démunis de Conakry en leur fournissant les fournitures, les uniformes, le soutien nutritionnel et médical régulier.
                </p>
              </article>

              <article className="group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 shadow-xs transition-all duration-300 hover:border-gold-300 hover:shadow-lg hover:-translate-y-1">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gold-500" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-700 mb-4 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                  <Sparkles size={24} />
                </div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gold-700">
                  Notre vision
                </p>
                <h3 className="font-display mt-2 text-xl font-bold text-navy-950">
                  Un avenir où chaque enfant compte
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">
                  Construire une communauté protectrice où aucun enfant n&apos;est abandonné à la rue, et développer un centre d&apos;hébergement et de formation d&apos;excellence pour l&apos;autonomie des jeunes.
                </p>
              </article>
            </div>
          </div>
        </AnimatedSection>

        {/* ========================================================
            4. NOS VALEURS FONDATRICES
            ======================================================== */}
        <div className="mt-16 sm:mt-24">
          <AnimatedSection direction="up">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
                Nos valeurs
              </p>
              <h2 className="font-display mt-3 text-2xl font-bold text-navy-950 sm:text-3xl">
                Des principes cardinaux qui guident chaque action
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-navy-600">
                Chacun de nos programmes s&apos;appuie sur une charte morale rigoureuse adoptée à l&apos;unanimité par notre conseil fondateur.
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((val) => {
                const Icon = val.icon;
                return (
                  <article
                    key={val.title}
                    className="group relative flex flex-col justify-between rounded-2xl border border-navy-100 bg-white p-5 sm:p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-950/5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-xl border ${val.tone} transition-transform duration-300 group-hover:scale-110`}>
                          <Icon size={20} strokeWidth={2} />
                        </span>
                        <span className="font-mono text-[10px] font-semibold text-navy-400 uppercase tracking-wider">
                          {val.badge}
                        </span>
                      </div>

                      <h3 className="font-display mt-4 text-lg font-bold text-navy-950">
                        {val.title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-navy-600">
                        {val.text}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-navy-50 flex items-center gap-1.5 text-xs font-semibold text-primary-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Principe actif</span>
                      <ChevronRight size={14} />
                    </div>
                  </article>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========================================================
          5. LE CHRONOGRAMME MODERNE, RESPONSIVE & ANIMÉ
          ======================================================== */}
      <section id="histoire" className="border-y border-navy-100 bg-white py-16 sm:py-24">
        <div className="container-app">
          <AnimatedSection direction="up">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12 sm:mb-16">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 border border-gold-200 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-gold-800">
                  <Sparkles size={13} className="text-gold-600" />
                  <span>Chronogramme de la Fondation</span>
                </div>
                <h2 className="font-display mt-3 text-3xl font-extrabold text-navy-950 sm:text-4xl lg:text-5xl">
                  Un engagement qui s&apos;écrit avec le temps.
                </h2>
                <p className="mt-3.5 text-base leading-relaxed text-navy-600">
                  Découvrez les grandes étapes de la création de la FSCPE, de la conviction initiale de Saran Camara aux perspectives d&apos;extension nationales.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-navy-400">
                <span className="h-2 w-2 rounded-full bg-primary-600" />
                <span>Cliquez sur une étape pour explorer</span>
              </div>
            </div>

            {/* Composant interactif de chronogramme */}
            <AboutTimeline />
          </AnimatedSection>
        </div>
      </section>

      {/* ========================================================
          6. ÉQUIPE & GOUVERNANCE
          ======================================================== */}
      <section id="equipe" className="container-app py-16 sm:py-24">
        <AnimatedSection direction="up">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
                Gouvernance collégiale
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold text-navy-950 sm:text-4xl">
                Des bénévoles dévoués, une mission sacrée
              </h2>
              <p className="mt-3 text-base leading-relaxed text-navy-600">
                La FSCPE s&apos;appuie sur une gouvernance structurée réunissant éducateurs, juristes, médecins et figures communautaires au service des enfants.
              </p>
            </div>
            <Link
              href="/equipe"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary-200 bg-primary-50/60 px-4 py-2.5 font-display text-sm font-semibold text-primary-800 transition-all hover:bg-primary-700 hover:text-white"
            >
              Organigramme complet
              <ArrowRight size={15} />
            </Link>
          </div>

          {team.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.slice(0, 4).map((member) => (
                <TeamProfile key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-navy-100 bg-white p-8 text-center">
              <p className="text-sm text-navy-500">
                {teamResult === null
                  ? "Les profils de l'équipe sont momentanément indisponibles."
                  : "Les profils de l'équipe seront publiés prochainement."}
              </p>
            </div>
          )}
        </AnimatedSection>
      </section>

      {/* ========================================================
          7. BANNIÈRE D'ENGAGEMENT "À NOS CÔTÉS"
          ======================================================== */}
      <section className="relative overflow-hidden bg-[#0b172a] py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gold-500/20 blur-3xl" />

        <div className="container-app relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                <Sparkles size={14} />
                Rejoignez le mouvement
              </span>
              <h2 className="font-display mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                Chaque geste peut ouvrir une nouvelle voie.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-navy-200">
                Que ce soit par un don financier, un parrainage d&apos;orphelin ou un partenariat institutionnel, votre soutien transforme concrètement le destin d&apos;un enfant guinéen.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <Link
                href="/don"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gold-400 px-7 py-3.5 font-display text-sm font-bold text-navy-950 shadow-lg shadow-gold-500/25 transition-all duration-300 hover:bg-gold-300 hover:scale-105"
              >
                Faire un don
                <HeartHandshake size={17} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-7 py-3.5 font-display text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15"
              >
                Nous contacter
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TeamProfile({ member }: { member: TeamMember }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-950/5">
      <div className="relative aspect-4/3 overflow-hidden bg-navy-50">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.fullName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-navy-300">
            <UserRound size={48} strokeWidth={1.2} />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-5">
        <h3 className="font-display text-base font-bold text-navy-950 group-hover:text-primary-700 transition-colors">
          {member.fullName}
        </h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-wider text-primary-700 font-semibold">
          {member.role}
        </p>
      </div>
    </article>
  );
}