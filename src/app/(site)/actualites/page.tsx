import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, ArrowRight, HeartHandshake } from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import InstitutionalHero from "@/components/site/institutional-hero";
import NewsCard from "@/components/site/cards/news-card";
import NewsFeatureCard from "@/components/site/cards/news-feature-card";
import { newsRepo } from "@/lib/db/repo";

export const metadata: Metadata = {
  title: "Actualités — FSCPE",
  description:
    "Retrouvez les actions de la Fondation Saran Camara, les projets livrés et les voix de celles et ceux que nous accompagnons.",
};
export const dynamic = "force-dynamic";

const NEWS_HERO_BG =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1920&auto=format&fit=crop";

export default async function NewsPage() {
  const news = await newsRepo.listPublished().catch(() => []);

  const featuredNews = news.length > 0 ? news[0] : null;
  const otherNews = news.length > 1 ? news.slice(1) : [];

  return (
    <>
      <InstitutionalHero
        image={NEWS_HERO_BG}
        imageAlt="Lecture de la presse et des actualités"
        eyebrow="Blog & presse"
        title="Les nouvelles qui font avancer nos engagements"
        description="Retrouvez les actions de la Fondation Saran Camara, les projets livrés et les voix de celles et ceux que nous accompagnons."
        badge="La fondation sur le terrain"
      />

      <section className="relative overflow-hidden py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(47,153,80,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(212,160,23,0.18),transparent_30%),radial-gradient(circle_at_center,rgba(11,24,39,0.12),transparent_55%)]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(7,16,28,0.96) 0%, rgba(13,24,37,0.92) 26%, rgba(18,31,44,0.90) 52%, rgba(236,244,236,0.92) 100%)",
          }}
        />

        <div className="container-app relative">
          {news.length > 0 ? (
            <>
              {/* ——— Featured ——— */}
              {featuredNews && (
                <AnimatedSection>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                    <span className="eyebrow text-navy-700">À la une</span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                    Ce qui se passe chez nous
                  </h2>
                  <div className="mt-6">
                    <NewsFeatureCard item={featuredNews} />
                  </div>
                </AnimatedSection>
              )}

              {/* ——— Toutes les actus ——— */}
              {otherNews.length > 0 && (
                <section className={featuredNews ? "mt-16" : ""}>
                  <AnimatedSection>
                    <div className="flex items-center justify-between hairline-b pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                          <span className="eyebrow">Archives</span>
                        </div>
                        <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                          Toutes nos actualités
                        </h2>
                      </div>
                      <span className="font-mono text-xs uppercase tracking-widest text-navy-400 shrink-0">
                        {otherNews.length} publication{otherNews.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </AnimatedSection>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {otherNews.map((item, i) => (
                      <AnimatedSection key={item.id} delay={(i % 3) * 0.06}>
                        <NewsCard item={item} />
                      </AnimatedSection>
                    ))}
                  </div>
                </section>
              )}

              {/* ——— CTA Newsletter + Don ——— */}
              <AnimatedSection className="mt-16" delay={0.1}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Newsletter */}
                  <div className="relative overflow-hidden hairline-strong bg-white rounded-lg p-6 sm:p-8">
                    <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-500/8 blur-3xl"
                    />
                    <span className="eyebrow">Ne manquez rien</span>
                    <h3 className="font-display mt-3 text-lg font-bold text-navy-900">
                      Restez informé de nos actions
                    </h3>
                    <p className="mt-2 text-sm text-navy-500">
                      Notre newsletter arrive bientôt. En attendant, suivez-nous sur les réseaux.
                    </p>
                    <Link
                      href="/contact"
                      className="btn-ghost mt-4 group"
                    >
                      Nous suivre
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>

                  {/* Don */}
                  <div className="relative overflow-hidden rounded-lg bg-navy-900 p-6 text-white sm:p-8">
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-95"
                      style={{
                        background:
                          "linear-gradient(115deg, rgba(8,18,31,0.98) 0%, rgba(12,41,63,0.96) 38%, rgba(18,68,70,0.94) 100%)",
                      }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(212,160,23,0.18),transparent_28%)]" aria-hidden />
                    <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />

                    <div className="relative">
                      <span className="eyebrow eyebrow-light">Soutenez-nous</span>
                      <h3 className="mt-3 font-display text-lg font-bold text-white">
                        Chaque don ouvre une porte
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-navy-100">
                        Soutenez nos actions sur le terrain pour l&apos;éducation et la protection des enfants.
                      </p>
                      <Link
                        href="/don"
                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 font-display text-sm font-semibold text-navy-900 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-50"
                      >
                        <HeartHandshake size={15} strokeWidth={2} />
                        Faire un don
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </>
  );
}

// ——— Empty state ———
function EmptyState() {
  return (
    <AnimatedSection direction="fade">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md hairline bg-white">
          <Newspaper size={24} className="text-navy-300" strokeWidth={1.5} />
        </div>
        <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">
          Aucune actualité publiée
        </h3>
        <p className="mt-2 text-sm text-navy-500">
          Nos articles et rapports d&apos;activités seront bientôt disponibles ici.
        </p>
      </div>
    </AnimatedSection>
  );
}