import type { Metadata } from "next";
import Image from "next/image";
import { Handshake, Building2, ExternalLink } from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import { partnersRepo } from "@/lib/db/repo";
import Partners3DHeader from "../Partners3DHeader";

export const metadata: Metadata = { title: "Partenaires" };
export const dynamic = "force-dynamic";

// Image Unsplash d'arrière-plan (Partenariat / Collaboration)
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
        badge={<span className="text-sm text-white/85">Ensemble, un impact durable</span>}
      >
        <div className="pointer-events-none absolute inset-0 opacity-65">
          <Partners3DHeader />
        </div>
      </InstitutionalHero>

      {/* SECTION CONTENU & LOGOS */}
      <div className="container-app py-16">
        {/* GRILLE DES PARTENAIRES */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((p, i) => (
            <AnimatedSection key={p.id} delay={(i % 4) * 0.06}>
              <a
                href={p.websiteUrl ?? "#"}
                target={p.websiteUrl ? "_blank" : undefined}
                rel="noreferrer"
                className="group relative flex h-36 flex-col items-center justify-center rounded-3xl border border-navy-100/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/10"
              >
                {/* Icône lien externe au survol */}
                {p.websiteUrl && (
                  <span className="absolute right-3.5 top-3.5 text-navy-300 opacity-0 transition-opacity duration-300 group-hover:text-primary-600 group-hover:opacity-100">
                    <ExternalLink size={16} />
                  </span>
                )}

                {p.logoUrl ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={p.logoUrl}
                      alt={p.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <Building2 className="text-navy-300 transition-colors group-hover:text-primary-500" size={28} />
                    <span className="text-sm font-semibold text-navy-800 transition-colors group-hover:text-primary-700">
                      {p.name}
                    </span>
                  </div>
                )}
              </a>
            </AnimatedSection>
          ))}
        </div>

        {/* ÉTAT VIDE */}
        {partners.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-navy-200 bg-white/50 p-12 text-center">
            <Building2 className="mx-auto text-navy-300" size={40} />
            <p className="mt-3 text-sm font-medium text-navy-500">
              Nos partenaires seront bientôt affichés ici.
            </p>
          </div>
        )}

        {/* APPEL À ACTION EN BAS DE PAGE */}
        <AnimatedSection className="mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-navy-800 p-8 sm:p-12 text-white shadow-xl">
            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
              <div>
                <h3 className="font-display text-2xl font-bold sm:text-3xl">
                  Devenez partenaire engagé
                </h3>
                <p className="mt-2 text-sm text-primary-100 max-w-xl">
                  Rejoignez-nous pour créer un impact durable sur l&apos;éducation et la protection des enfants vulnérables.
                </p>
              </div>
              <a
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-md transition-all hover:bg-primary-50 hover:shadow-lg active:scale-95"
              >
                <Handshake size={18} className="text-primary-600" />
                Nous contacter
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </>
  );
}