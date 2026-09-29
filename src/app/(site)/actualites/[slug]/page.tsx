import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  HeartHandshake,
  Newspaper,
} from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import NewsCard from "@/components/site/cards/news-card";
import AtmosphereBackground from "@/components/site/ambient/AtmosphereBackground";
import { newsRepo } from "@/lib/db/repo";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await newsRepo.getBySlug(slug).catch(() => null);
  if (!item) return { title: "Actualité — FSCPE" };

  return {
    title: `${item.title} — Actualités FSCPE`,
    description: item.excerpt,
    openGraph: {
      title: item.title,
      description: item.excerpt,
      images: item.coverImageUrl ? [{ url: item.coverImageUrl }] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [item, allNews] = await Promise.all([
    newsRepo.getBySlug(slug).catch(() => null),
    newsRepo.listPublished().catch(() => []),
  ]);

  if (!item || !item.published) notFound();

  // Autres articles récents (excluant l'article actuel)
  const relatedNews = allNews.filter((n) => n.slug !== slug).slice(0, 3);

  // Estimation du temps de lecture
  const wordCount = (item.content || "").split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="relative isolate overflow-hidden bg-[#faf9f5] text-navy-900">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_top_left,rgba(47,153,80,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(212,160,23,0.12),transparent_30%)]" />
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
                href="/actualites"
                className="group inline-flex items-center gap-2 font-display text-xs font-semibold text-gold-200 transition-colors hover:text-white"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform duration-200 group-hover:-translate-x-1"
                />
                Retour aux actualités
              </Link>

              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-slate-100/90">
                Blog &amp; Presse FSCPE
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.05} className="mx-auto max-w-4xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-500/10 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold-100 backdrop-blur-sm">
                <Newspaper size={12} strokeWidth={2} />
                Actualité
              </span>

              {item.publishedAt && (
                <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-slate-100/90">
                  <Calendar size={13} strokeWidth={1.75} />
                  {formatDate(item.publishedAt)}
                </span>
              )}

              <span className="h-1 w-1 rounded-full bg-gold-300/80" aria-hidden />

              <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-slate-100/90">
                <Clock size={13} strokeWidth={1.75} />
                {readingTimeMinutes} min de lecture
              </span>
            </div>

            <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-6xl leading-[1.08]">
              {item.title}
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-relaxed text-slate-100 sm:text-lg">
              {item.excerpt}
            </p>
          </AnimatedSection>
        </div>
      </AtmosphereBackground>

      <div className="container-app relative z-10 -mt-12 pb-20">
        {item.coverImageUrl && (
          <AnimatedSection delay={0.1} className="mx-auto max-w-5xl">
            <div className="relative h-72 w-full overflow-hidden rounded-[28px] border border-[#ebe4d6] bg-white shadow-[0_30px_80px_rgba(12,23,38,0.12)] sm:h-96 md:h-[30rem]">
              <span className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-700" aria-hidden />
              <Image
                src={item.coverImageUrl}
                alt={item.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={0.15} className="mx-auto mt-10 max-w-3xl">
          <div className="rounded-[28px] border border-[#efe7da] bg-white/95 p-6 shadow-[0_25px_75px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-10">
            <div className="prose prose-navy max-w-none whitespace-pre-line text-base leading-relaxed text-navy-700 sm:text-lg">
              {item.content}
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-[#efe7da] pt-6 text-xs text-navy-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-navy-800">Fondation Saran Camara</span>
                <span>•</span>
                <span>Pour l&apos;enfance et l&apos;éducation</span>
              </div>
              <Link
                href="/actualites"
                className="inline-flex items-center gap-1.5 font-display font-semibold text-primary-700 transition-colors hover:text-primary-800"
              >
                <span>Voir d&apos;autres articles</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {relatedNews.length > 0 && (
          <section className="mx-auto mt-16 max-w-5xl">
            <AnimatedSection>
              <div className="flex items-center justify-between gap-4 border-b border-[#ebe4d6] pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gold-500/70" aria-hidden />
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-navy-500">
                      Poursuivre la lecture
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                    À lire également
                  </h2>
                </div>
                <Link
                  href="/actualites"
                  className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary-700 hover:underline"
                >
                  Toutes les actus
                </Link>
              </div>
            </AnimatedSection>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedNews.map((newsItem, i) => (
                <AnimatedSection key={newsItem.id} delay={(i % 3) * 0.08}>
                  <NewsCard item={newsItem} />
                </AnimatedSection>
              ))}
            </div>
          </section>
        )}

        <AnimatedSection delay={0.2} className="mx-auto mt-16 max-w-4xl">
          <div className="relative overflow-hidden rounded-[28px] border border-[#214b6d] bg-gradient-to-br from-[#0d1f2d] via-[#102a3d] to-[#153d59] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-10">
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-gold-500 to-primary-700" aria-hidden />
            <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-500/15 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gold-500/12 blur-3xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gold-200">
                  Soutenez nos actions
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                  Participez concrètement à nos projets
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  Chaque don est directement affecté à la scolarisation et à la protection des enfants vulnérables en Guinée.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/don"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-display text-sm font-semibold text-navy-900 shadow-lg shadow-white/15 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f5f7fb]"
                >
                  <HeartHandshake size={16} strokeWidth={2} />
                  Faire un don
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </article>
  );
}
