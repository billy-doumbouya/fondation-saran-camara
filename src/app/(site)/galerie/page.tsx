import type { Metadata } from "next";
import { Images } from "lucide-react";
import AnimatedSection from "@/components/site/animated-section";
import InstitutionalHero from "@/components/site/institutional-hero";
import GalleryGrid from "@/components/site/gallery-grid";
import { galleryRepo } from "@/lib/db/repo";

export const metadata: Metadata = {
  title: "Galerie photos — FSCPE",
  description:
    "Des moments de partage, d'apprentissage et de solidarité qui racontent l'action de la Fondation Saran Camara au quotidien.",
};
export const dynamic = "force-dynamic";

const GALLERY_HERO_BG =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop";

export default async function GalleryPage() {
  const images = await galleryRepo.listAll().catch(() => []);

  return (
    <>
      <InstitutionalHero
        image={GALLERY_HERO_BG}
        imageAlt="Enfants souriants accompagnés par la Fondation"
        eyebrow="Galerie"
        title="Les visages de notre engagement"
        description="Des moments de partage, d'apprentissage et de solidarité qui racontent l'action de la Fondation au quotidien."
        badge="Chaque image raconte une histoire"
      />

      <section className="relative overflow-hidden py-20 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #ffffff 0%, var(--background) 50%, var(--color-primary-50) 100%)",
          }}
        />

        <div className="container-app relative">
          {/* Header */}
          <AnimatedSection>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500/60" aria-hidden />
                  <span className="eyebrow">Sur le terrain</span>
                </div>
                <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                  Nos actions en images
                </h2>
              </div>
              {images.length > 0 && (
                <span className="font-mono text-xs uppercase tracking-widest text-navy-400">
                  {images.length} photo{images.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <span className="mt-4 block h-px w-full bg-navy-100" aria-hidden />
          </AnimatedSection>

          {/* Grid or empty */}
          {images.length > 0 ? (
            <div className="mt-8">
              <GalleryGrid images={images} />
            </div>
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
      <div className="mx-auto mt-12 max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md hairline bg-white">
          <Images size={24} className="text-navy-300" strokeWidth={1.5} />
        </div>
        <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">
          La galerie sera bientôt garnie
        </h3>
        <p className="mt-2 text-sm text-navy-500">
          Les premières photos de nos actions sur le terrain seront publiées prochainement.
        </p>
      </div>
    </AnimatedSection>
  );
}
