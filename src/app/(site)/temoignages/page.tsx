import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareQuote, HeartHandshake, Quote } from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import AtmosphereBackground from "@/components/site/ambient/AtmosphereBackground";
import { testimonialsRepo } from "@/lib/db/repo";
import TestimonialCard from "@/components/site/cards/TestimonialCard";

export const metadata: Metadata = {
  title: "Témoignages — FSCPE",
  description:
    "Découvrez les histoires touchantes, les retours d'expérience et l'impact direct de nos actions à travers les voix de nos bénéficiaires et partenaires.",
};
export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = await testimonialsRepo.listPublished().catch(() => []);

  return (
    <>
      <AtmosphereBackground
        variant="dark"
        enable3dMesh={true}
        enableGeometry={true}
        showSacredCircles={true}
        className="relative overflow-hidden pb-20 pt-24 sm:pt-28"
      >
        <div className="container-app relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold-400/70" aria-hidden />
                <span className="eyebrow eyebrow-light">Témoignages</span>
              </div>

              <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
                Ce que disent nos partenaires et bénéficiaires
              </h1>

              <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-slate-200 sm:text-lg">
                Découvrez les histoires touchantes, les retours d&apos;expérience et l&apos;impact direct de nos actions à travers leurs voix.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-slate-100 backdrop-blur-sm">
                  <Quote size={14} className="text-gold-400" />
                  Des histoires qui comptent
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </AtmosphereBackground>

      <section className="container-app py-20 sm:py-24">
        {testimonials.length > 0 ? (
          <>
            {/* Count */}
            <AnimatedSection>
              <div className="flex items-center justify-between hairline-b pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                    <span className="eyebrow">Récits</span>
                  </div>
                  <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                    Voix de la Fondation
                  </h2>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-navy-400 shrink-0">
                  {testimonials.length} témoignage{testimonials.length > 1 ? "s" : ""}
                </span>
              </div>
            </AnimatedSection>

            {/* Grid */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.05}>
                  <TestimonialCard testimonial={t} />
                </AnimatedSection>
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}

        {/* ——— CTA ——— */}
        <AnimatedSection className="mt-16" delay={0.1}>
          <div className="relative overflow-hidden rounded-[28px] border border-[#214b6d] bg-gradient-to-br from-[#0d1f2d] via-[#102a3d] to-[#153d59] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary-500/15 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -left-12 -bottom-12 h-52 w-52 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,153,80,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(212,160,23,0.16),transparent_35%)]" aria-hidden />
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-gold-500 to-primary-700" aria-hidden />

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-400/60" aria-hidden />
                  <span className="eyebrow eyebrow-light">Votre voix compte</span>
                </div>
                <h3 className="font-display mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Vous avez bénéficié de nos programmes ou collaboré avec nous&nbsp;?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  Partagez votre expérience et aidez-nous à inspirer davantage de bienfaiteurs et de partenaires.
                </p>
              </div>
              <Link
                href="/contact?subject=Proposition%20de%20témoignage"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-display text-sm font-semibold text-primary-700 shadow-lg shadow-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-50"
              >
                <HeartHandshake size={16} strokeWidth={2} />
                Laisser un témoignage
              </Link>
            </div>
          </div>
        </AnimatedSection>
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
          <MessageSquareQuote size={24} className="text-navy-300" strokeWidth={1.5} />
        </div>
        <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">
          Aucun témoignage pour le moment
        </h3>
        <p className="mt-2 text-sm text-navy-500">
          Les retours d&apos;expérience de nos bénéficiaires et partenaires seront bientôt publiés ici.
        </p>
      </div>
    </AnimatedSection>
  );
}