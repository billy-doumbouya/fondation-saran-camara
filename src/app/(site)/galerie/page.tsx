import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import { galleryRepo } from "@/lib/db/repo";

export const metadata: Metadata = { title: "Galerie photos" };
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
        badge={<span className="text-sm text-white/85">Chaque image raconte une histoire</span>}
      />
      <div className="bg-gradient-to-b from-white to-primary-50/30 py-14 sm:py-16">
        <div className="container-app">
          <div className="mb-7 flex items-end justify-between border-b border-navy-100 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Sur le terrain</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">Nos actions en images</h2>
            </div>
            <span className="hidden text-sm text-navy-400 sm:block">Des souvenirs, des avancées</span>
          </div>
          <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
        {images.map((img, i) => (
          <AnimatedSection key={img.id} delay={(i % 6) * 0.05}>
            <div className="relative w-full overflow-hidden rounded-2xl shadow-sm">
              <Image
                src={img.imageUrl}
                alt={img.title ?? "Photo FSCPE"}
                width={500}
                height={500}
                className="w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </AnimatedSection>
        ))}
          </div>
          {images.length === 0 && <p className="mt-12 text-center text-navy-400">La galerie sera bientôt garnie de photos.</p>}
        </div>
      </div>
    </>
  );
}
