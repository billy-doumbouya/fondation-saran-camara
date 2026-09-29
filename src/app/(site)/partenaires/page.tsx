import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Handshake, Building2, ExternalLink } from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import InstitutionalHero from "@/components/site/institutional-hero";
import { partnersRepo } from "@/lib/db/repo";

export const metadata: Metadata = {
  title: "Partenaires — FSCPE",
  description:
    "Merci à toutes les organisations, institutions et entreprises qui soutiennent la mission de la Fondation Saran Camara en Guinée.",
};
export const dynamic = "force-dynamic";

const PARTNERS_HERO_BG =
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1920&auto=format&fit=crop";

export default async function PartnersPage() {
  const partners = await partnersRepo.listAll().catch(() => []);

  return (
    <>
      <InstitutionalHero
        image={PARTNERS_HERO_BG}
        imageAlt="Partenaires réunis autour d'un projet"
        eyebrow="Partenaires"
        title="Ils nous font confiance"
        description="Merci à toutes les organisations, institutions et entreprises qui soutiennent notre mission en Guinée."
        badge="Ensemble, un impact durable"
      />

      <section className="container-app py-20 sm:py-24">
        {partners.length > 0 ? (
          <>
            {/* Count */}
            <AnimatedSection>
              <div className="flex items-center justify-between hairline-b pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                    <span className="eyebrow">Nos soutiens</span>
                  </div>
                  <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                    Ils s&apos;engagent à nos côtés
                  </h2>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-navy-400 shrink-0">
                  {partners.length} partenaire{partners.length > 1 ? "s" : ""}
                </span>
              </div>
            </AnimatedSection>

            {/* Grid */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {partners.map((p, i) => (
                <AnimatedSection key={p.id} delay={(i % 4) * 0.05}>
                  <a
                    href={p.websiteUrl ?? "#"}
                    target={p.websiteUrl ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden hairline bg-white rounded-md p-6 transition-all duration-300 hover:hairline-strong hover:-translate-y-1"
                  >
                    {/* Accent gold top au hover */}
                    <span
                      className="absolute inset-x-0 top-0 h-0.5 bg-gold-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden
                    />
                    {/* Corner accent top-right */}
                    <span
                      aria-hidden
                      className="absolute right-2 top-2 h-3 w-3 border-r border-t border-gold-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    {p.websiteUrl && (
                      <span className="absolute bottom-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-sm bg-white/85 backdrop-blur-sm hairline text-navy-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <ExternalLink size={11} strokeWidth={2} />
                      </span>
                    )}

                    {p.logoUrl ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={p.logoUrl}
                          alt={p.name}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <Building2
                          size={28}
                          className="text-navy-300 transition-colors duration-300 group-hover:text-primary-500"
                          strokeWidth={1.5}
                        />
                        <span className="font-display text-sm font-semibold text-navy-800 transition-colors group-hover:text-primary-700">
                          {p.name}
                        </span>
                      </div>
                    )}
                  </a>
                </AnimatedSection>
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}

        {/* ——— CTA ——— */}
        <AnimatedSection className="mt-16" delay={0.1}>
          <div className="relative overflow-hidden bg-navy-900 rounded-lg p-8 text-white sm:p-10">
            <div
              aria-hidden
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  "linear-gradient(115deg, var(--color-primary-800) 0%, var(--color-navy-900) 60%, var(--color-navy-800) 100%)",
              }}
            />
            <div className="absolute inset-0 grid-overlay opacity-25" aria-hidden />
            <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-400/60" aria-hidden />
                  <span className="eyebrow eyebrow-light">Devenir partenaire</span>
                </div>
                <h3 className="font-display mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  Devenez partenaire engagé
                </h3>
                <p className="mt-2 text-sm text-navy-200">
                  Rejoignez-nous pour créer un impact durable sur l&apos;éducation et la protection
                  des enfants vulnérables.
                </p>
              </div>
              <Link
                href="/contact?subject=Proposition%20de%20partenariat"
                className="shrink-0 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3.5 font-display text-sm font-semibold text-primary-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-50"
              >
                <Handshake size={16} strokeWidth={2} />
                Nous contacter
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
          <Building2 size={24} className="text-navy-300" strokeWidth={1.5} />
        </div>
        <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">
          Nos partenaires seront bientôt affichés
        </h3>
        <p className="mt-2 text-sm text-navy-500">
          Les organisations qui soutiennent la FSCPE seront présentées ici prochainement.
        </p>
      </div>
    </AnimatedSection>
  );
}