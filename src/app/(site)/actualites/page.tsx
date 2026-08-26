import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BellRing, CalendarDays, Newspaper } from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import ImageBackdrop from "@/components/site/ImageBackdrop";
import NewsCard from "@/components/site/cards/NewsCard";
import { newsRepo } from "@/lib/db/repo";

export const metadata: Metadata = { title: "Actualités" };
export const dynamic = "force-dynamic";

// Image Unsplash libre de droits (presse, écriture, lecture)
const NEWS_HERO_BG =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1920&auto=format&fit=crop";

export default async function NewsPage() {
  const news = await newsRepo.listPublished().catch(() => []);

  const featuredNews = news.length > 0 ? news[0] : null;
  const otherNews = news.length > 1 ? news.slice(1) : [];

  return (
    <>
      <section className="relative isolate min-h-[26rem] overflow-hidden bg-navy-900 text-white sm:min-h-[31rem]">
        <ImageBackdrop src={NEWS_HERO_BG} alt="Lecture de la presse et des actualités" imageClassName="scale-105 object-center" className="z-[-2]">
          <div className="absolute inset-0 bg-navy-950/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/65 to-primary-900/35" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-950/50 to-transparent" />
        </ImageBackdrop>

        <div className="container-app relative flex min-h-[26rem] items-end pb-14 pt-28 sm:min-h-[31rem] sm:pb-20">
          <AnimatedSection>
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">
                <span className="h-px w-10 bg-primary-300" />
                Blog & presse
              </div>
              <h1 className="font-display max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
                Les nouvelles qui font avancer nos engagements
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                Retrouvez les actions de la Fondation Saran Camara, les projets livrés et les voix de celles et ceux que nous accompagnons.
              </p>
            </div>
          </AnimatedSection>
        </div>

        <div className="absolute bottom-0 right-0 hidden border-l border-t border-white/15 bg-white/10 px-6 py-4 backdrop-blur-md sm:block">
          <div className="flex items-center gap-3 text-sm text-white/85">
            <CalendarDays size={17} className="text-primary-200" />
            <span>La fondation sur le terrain</span>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-white to-primary-50/30 pb-20 pt-12 sm:pt-16">
        <div className="container-app">
        {news.length > 0 ? (
          <>
            {featuredNews && (
              <AnimatedSection className="mb-14">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">À la une</p>
                    <h2 className="font-display mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">Ce qui se passe chez nous</h2>
                  </div>
                  <span className="hidden text-sm text-navy-400 sm:block">Une information, un impact</span>
                </div>
                <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white p-2 shadow-[0_18px_50px_-24px_rgba(16,26,46,0.35)] sm:p-3">
                  <NewsCard item={featuredNews} />
                </div>
              </AnimatedSection>
            )}

            {otherNews.length > 0 && (
              <section>
                <div className="mb-6 flex items-center justify-between border-b border-navy-100 pb-4">
                  <h2 className="font-display text-2xl font-bold text-navy-900">Toutes nos actualités</h2>
                  <span className="text-sm text-navy-400">{otherNews.length} publication{otherNews.length > 1 ? "s" : ""}</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {otherNews.map((item, i) => (
                    <AnimatedSection key={item.id} delay={(i % 3) * 0.08}>
                      <NewsCard item={item} />
                    </AnimatedSection>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <AnimatedSection>
            <div className="my-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-white/70 p-12 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <Newspaper size={30} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy-900">
                Aucune actualité publiée pour le moment
              </h3>
              <p className="mt-2 text-sm text-navy-600 max-w-md">
                Nos articles et rapports d&apos;activités seront bientôt disponibles ici.
              </p>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection className="mt-16">
          <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-8 text-white shadow-xl shadow-navy-900/15 sm:p-12">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary-800/45 to-transparent" />
            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  <BellRing size={14} /> Ne manquez rien
                </span>
                <h3 className="font-display mt-3 text-2xl font-bold sm:text-3xl">
                  Restez informé de nos actions sur le terrain
                </h3>
                <p className="mt-2 text-sm text-white/90">
                  Des questions sur nos derniers événements ou envie de devenir bénévole ? Contactez notre équipe.
                </p>
              </div>

              <Link
                href="/contact"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-md transition-all hover:bg-primary-100 active:scale-95"
              >
                Nous contacter
                <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
        </div>
      </div>
    </>
  );
}