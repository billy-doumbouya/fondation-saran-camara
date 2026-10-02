import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Handshake, HeartHandshake, ArrowUpRight } from "lucide-react";
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

type Partner = Awaited<ReturnType<typeof partnersRepo.listAll>>[number];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default async function PartnersPage() {
  const partners = await partnersRepo.listAll().catch(() => []);
  const count = partners.length;

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

      <section className="container-app py-16 sm:py-24">
        {count > 0 ? (
          <>
            {/* ——— Intro : le chiffre fait partie de la phrase ——— */}
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
              <h2 className="min-w-0 break-words font-display text-3xl font-bold leading-[1.1] tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
                {count} {count > 1 ? "organisations" : "organisation"}{" "}
                <span className="text-primary-600">
                  {count > 1 ? "financent" : "finance"} la scolarité
                </span>{" "}
                et la protection des enfants.
              </h2>
              <p className="max-w-md text-base leading-relaxed text-navy-600">
                Institutions, entreprises et associations : chacune rend possible une part
                concrète de nos programmes. Voici ceux qui avancent avec nous.
              </p>
            </div>

            {/* ——— Mur de logos : cellules séparées par des filets partagés ——— */}
            <AnimatedSection className="mt-12 sm:mt-16">
              <div className="overflow-hidden rounded-lg hairline bg-white">
                <ul className="-mb-px -mr-px grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {partners.map((p) => (
                    <li key={p.id} className="min-w-0">
                      <PartnerCell partner={p} />
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </>
        ) : (
          <EmptyState />
        )}

        {/* ——— CTA ——— */}
        <AnimatedSection className="mt-16 sm:mt-24" delay={0.1}>
          <div className="mesh-luxury-dark relative overflow-hidden rounded-lg p-6 text-white sm:p-12">
            <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500" aria-hidden />
            <div className="grid-overlay absolute inset-0 opacity-20" aria-hidden />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 max-w-2xl">
                <h3 className="break-words font-display text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
                  Votre organisation peut en faire partie.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-100/90 sm:text-base">
                  Parlons de ce que vous pouvez apporter aux enfants orphelins et vulnérables
                  de Guinée : nous construirons le partenariat ensemble.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
                <Link
                  href="/contact?subject=Proposition%20de%20partenariat"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 font-display text-sm font-semibold text-primary-700 shadow-lg transition-colors duration-200 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 sm:w-auto"
                >
                  <Handshake size={16} strokeWidth={2} />
                  Devenir partenaire
                </Link>
                <Link
                  href="/don"
                  className="btn-ghost btn-ghost-light w-full justify-center sm:w-auto"
                >
                  <HeartHandshake size={16} />
                  Faire un don
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}

// ——— Cellule partenaire ———
function PartnerCell({ partner: p }: { partner: Partner }) {
  const cellClass =
    "group relative flex h-full min-h-44 flex-col items-center justify-center gap-4 border-b border-r border-navy-100 bg-white p-5 text-center transition-colors duration-300 sm:min-h-52 sm:p-8";

  const content = (
    <>
      {/* Filet or : apparaît quand la cellule est active */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gold-500 transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />

      {p.logoUrl ? (
        <div className="relative h-14 w-full sm:h-20">
          <Image
            src={p.logoUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
            className="object-contain opacity-80 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
          />
        </div>
      ) : (
        <span
          aria-hidden
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 font-display text-lg font-bold text-primary-700 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white sm:h-16 sm:w-16"
        >
          {initials(p.name)}
        </span>
      )}

      <span className="flex w-full min-w-0 items-center justify-center gap-1 font-display text-xs font-semibold text-navy-700 sm:text-sm">
        <span className="truncate">{p.name}</span>
        {p.websiteUrl && (
          <ArrowUpRight
            size={14}
            aria-hidden
            className="shrink-0 text-navy-300 transition-colors duration-300 group-hover:text-primary-600"
          />
        )}
      </span>
    </>
  );

  // Pas de site → pas de faux lien « # »
  if (!p.websiteUrl) {
    return <div className={cellClass}>{content}</div>;
  }

  return (
    <a
      href={p.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${p.name} — ouvrir le site (nouvel onglet)`}
      className={`${cellClass} hover:bg-primary-50/40 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600`}
    >
      {content}
    </a>
  );
}

// ——— État vide ———
function EmptyState() {
  return (
    <div className="mx-auto max-w-md text-center">
      <h2 className="font-display text-xl font-semibold text-navy-900">
        Les partenaires seront présentés ici
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-navy-500">
        Vous représentez une organisation qui souhaite soutenir la FSCPE ? Écrivez-nous.
      </p>
      <Link
        href="/contact?subject=Proposition%20de%20partenariat"
        className="btn-primary mt-6 justify-center"
      >
        <Handshake size={16} />
        Devenir partenaire
      </Link>
    </div>
  );
}