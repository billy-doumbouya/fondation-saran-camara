import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  HandHeart,
  Users2,
  CheckCircle2,
  ArrowLeft,
  HeartHandshake,
  Lock,
} from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import AtmosphereBackground from "@/components/site/ambient/AtmosphereBackground";
import ProgramCard from "@/components/site/cards/program-card";
import { programsRepo } from "@/lib/db/repo";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PILLAR_META: Record<
  string,
  { label: string; icon: typeof GraduationCap; color: string; badgeCls: string }
> = {
  education: {
    label: "Éducation",
    icon: GraduationCap,
    color: "text-primary-700",
    badgeCls: "bg-primary-50 text-primary-700 border-primary-200/60",
  },
  protection: {
    label: "Protection",
    icon: ShieldCheck,
    color: "text-navy-700",
    badgeCls: "bg-navy-50 text-navy-700 border-navy-200/60",
  },
  orphelins: {
    label: "Aide aux orphelins",
    icon: HandHeart,
    color: "text-gold-700",
    badgeCls: "bg-gold-50 text-gold-700 border-gold-200/60",
  },
  social: {
    label: "Action sociale",
    icon: Users2,
    color: "text-primary-700",
    badgeCls: "bg-primary-50 text-primary-700 border-primary-200/60",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await programsRepo.getBySlug(slug).catch(() => null);
  if (!program) return { title: "Programme — FSCPE" };

  return {
    title: `${program.title} — Programmes FSCPE`,
    description: program.summary,
    openGraph: {
      title: program.title,
      description: program.summary,
      images: program.coverImageUrl ? [{ url: program.coverImageUrl }] : [],
    },
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [program, allPrograms] = await Promise.all([
    programsRepo.getBySlug(slug),
    programsRepo.listPublished().catch(() => []),
  ]);

  if (!program || !program.published) notFound();

  const meta = PILLAR_META[program.pillar ?? "education"] ?? PILLAR_META.education;
  const PillarIcon = meta.icon;

  // Autres programmes récents (excluant l'actuel)
  const relatedPrograms = allPrograms.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className="relative isolate overflow-hidden bg-[#faf9f5] text-navy-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_top_left,rgba(47,153,80,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(212,160,23,0.12),transparent_30%)]"
      />

      <AtmosphereBackground
        variant="dark"
        enable3dMesh={true}
        enableGeometry={true}
        showSacredCircles={true}
        className="relative pb-20 pt-24 sm:pt-28"
      >
        <div className="container-app relative z-10">
          <AnimatedSection>
            <div className="flex items-center justify-between gap-3 pb-6">
              <Link
                href="/programmes"
                className="group inline-flex items-center gap-2 font-display text-xs font-semibold text-gold-200 transition-colors hover:text-white"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform duration-200 group-hover:-translate-x-1"
                />
                Tous les programmes &amp; projets
              </Link>

              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-navy-200">
                Projets de terrain • FSCPE
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.05} className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] backdrop-blur-sm",
                  meta.badgeCls,
                )}
              >
                <PillarIcon size={13} strokeWidth={2} />
                {meta.label}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-emerald-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Programme publié
              </span>
            </div>

            <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-6xl leading-[1.08]">
              {program.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-navy-100 sm:text-lg">
              {program.summary}
            </p>
          </AnimatedSection>
        </div>
      </AtmosphereBackground>

      <div className="container-app relative z-10 -mt-12 pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-8">
            <AnimatedSection delay={0.1}>
              <div className="relative h-72 w-full overflow-hidden rounded-[28px] border border-[#ebe4d6] bg-white shadow-[0_30px_80px_rgba(12,23,38,0.12)] sm:h-96 md:h-120">
                <span className="absolute inset-x-0 top-0 z-10 h-1 bg-linear-to-r from-primary-600 via-gold-500 to-primary-700" aria-hidden />
                {program.coverImageUrl ? (
                  <Image
                    src={program.coverImageUrl}
                    alt={program.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-linear-to-br from-navy-50 to-primary-50/50">
                    <PillarIcon size={64} className="text-primary-300" strokeWidth={1.25} />
                  </div>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {program.beneficiariesCount ? (
                  <div className="rounded-lg border border-navy-100 bg-white p-4 shadow-sm">
                    <p className="font-mono text-[0.625rem] uppercase tracking-wider text-navy-400">
                      Bénéficiaires
                    </p>
                    <p className="font-display mt-1 text-2xl font-bold text-primary-700 tabular-nums">
                      {program.beneficiariesCount.toLocaleString("fr-FR")}+
                    </p>
                    <p className="mt-0.5 text-xs text-navy-500">Enfants accompagnés</p>
                  </div>
                ) : null}

                <div className="rounded-lg border border-navy-100 bg-white p-4 shadow-sm">
                  <p className="font-mono text-[0.625rem] uppercase tracking-wider text-navy-400">
                    Pilier
                  </p>
                  <p className="font-display mt-1 flex items-center gap-1.5 text-lg font-bold text-navy-900">
                    <PillarIcon size={16} className={meta.color} />
                    {meta.label}
                  </p>
                  <p className="mt-0.5 text-xs text-navy-500">Domaine d&apos;intervention</p>
                </div>

                <div className="rounded-lg border border-navy-100 bg-white p-4 shadow-sm">
                  <p className="font-mono text-[0.625rem] uppercase tracking-wider text-navy-400">
                    Engagement FSCPE
                  </p>
                  <p className="font-display mt-1 flex items-center gap-1.5 text-lg font-bold text-emerald-700">
                    <CheckCircle2 size={16} />
                    Paiement direct
                  </p>
                  <p className="mt-0.5 text-xs text-navy-500">Engagement général de la Fondation</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="rounded-[28px] border border-[#efe7da] bg-white/95 p-6 shadow-[0_25px_75px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-9">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                  <span className="eyebrow">Objectifs &amp; Déploiement</span>
                </div>
                <h2 className="font-display mt-3 text-xl font-bold text-navy-900 sm:text-2xl">
                  À propos de ce projet
                </h2>

                <div className="prose prose-navy mt-6 max-w-none whitespace-pre-line text-base leading-relaxed text-navy-700 sm:text-lg">
                  {program.content}
                </div>

                <div className="mt-8 rounded-[22px] border border-primary-200/80 bg-primary-50/60 p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary-700" />
                    <div>
                      <h4 className="font-display text-sm font-bold text-navy-900">
                        Engagement général de transparence de la FSCPE
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-navy-600 sm:text-sm">
                        La politique de la Fondation prévoit le règlement direct des établissements
                        scolaires et fournisseurs partenaires contre reçus officiels, ainsi qu&apos;un suivi
                        des enfants bénéficiaires. Cet engagement concerne la FSCPE dans son ensemble.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            <AnimatedSection delay={0.15}>
              <div className="relative overflow-hidden rounded-[28px] border border-[#214b6d] bg-linear-to-br from-[#0d1f2d] via-[#102a3d] to-[#163d59] p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:p-7">
                <span className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary-500 via-gold-500 to-primary-600" aria-hidden />
                <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-primary-500/15 blur-3xl" />
                <div aria-hidden className="pointer-events-none absolute -left-14 -bottom-14 h-44 w-44 rounded-full bg-gold-500/10 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-6 bg-gold-400/70" aria-hidden />
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-gold-200">
                      Participer
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-bold text-white">
                    Soutenez la FSCPE
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-200 sm:text-sm">
                    Votre don contribue aux actions de la Fondation en faveur des enfants et des familles
                    vulnérables en Guinée.
                  </p>

                  <div className="mt-6 space-y-3">
                    <Link
                      href="/don"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-display text-sm font-semibold text-primary-700 shadow-lg shadow-white/10 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-50"
                    >
                      <HeartHandshake size={16} strokeWidth={2} />
                      Faire un don à la Fondation
                    </Link>

                    <Link
                      href="/contact"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      Devenir partenaire ou bénévole
                    </Link>
                  </div>

                  <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-[0.6875rem] text-slate-200 sm:text-[0.75rem]">
                    <div className="flex items-center gap-2">
                      <Lock size={12} className="shrink-0 text-gold-300" />
                      <span>Paiement sécurisé via Mobile Money ou Carte</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="shrink-0 text-emerald-300" />
                      <span>Affectation directe et traçable à 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {relatedPrograms.length > 0 && (
              <AnimatedSection delay={0.2}>
                <div className="rounded-3xl border border-[#ebe4d6] bg-white/95 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-navy-400">
                    Autres projets
                  </p>
                  <h4 className="font-display mt-1 text-base font-bold text-navy-900">
                    Découvrir aussi
                  </h4>

                  <div className="mt-4 space-y-3">
                    {relatedPrograms.map((other) => {
                      const otherMeta =
                        PILLAR_META[other.pillar ?? "education"] ?? PILLAR_META.education;
                      return (
                        <Link
                          key={other.id}
                          href={`/programmes/${other.slug}`}
                          className="group block rounded-2xl border border-[#edf0f3] p-2.5 transition-colors hover:bg-navy-50"
                        >
                          <span
                            className={cn(
                              "inline-block rounded-sm px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-wider",
                              otherMeta.badgeCls,
                            )}
                          >
                            {otherMeta.label}
                          </span>
                          <p className="font-display mt-1 text-xs font-semibold text-navy-900 line-clamp-1 group-hover:text-primary-700">
                            {other.title}
                          </p>
                          <p className="mt-0.5 text-[0.6875rem] text-navy-500 line-clamp-2">
                            {other.summary}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>

        {relatedPrograms.length > 0 && (
          <section className="mt-20 border-t border-[#ebe4d6] pt-14">
            <AnimatedSection>
              <div className="flex items-center justify-between gap-4 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                    <span className="eyebrow">Tous nos engagements</span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                    D&apos;autres actions sur le terrain
                  </h2>
                </div>
                <Link
                  href="/programmes"
                  className="font-mono text-xs uppercase tracking-wider text-primary-700 hover:underline"
                >
                  Tous les projets
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPrograms.map((p, i) => (
                <AnimatedSection key={p.id} delay={(i % 3) * 0.08}>
                  <ProgramCard program={p} />
                </AnimatedSection>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
