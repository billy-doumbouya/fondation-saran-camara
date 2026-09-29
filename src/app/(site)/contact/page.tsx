import type { Metadata } from "next";
import AnimatedSection from "@/components/site/animated-section";
import ContactForm from "@/components/site/contact-form";
import {
  ContactInteractiveCards,
  ContactFaqSection,
} from "@/components/site/contact-interactive";
import AtmosphereBackground from "@/components/site/ambient/AtmosphereBackground";
import ComplexGeometricOverlay from "@/components/site/ambient/ComplexGeometricOverlay";
import { Sparkles, Shield, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Échanges — Fondation Saran Camara (FSCPE)",
  description:
    "Échangez directement avec l'équipe de la Fondation Saran Camara à Conakry. Dons, parrainage, partenariats ou volontariat : nous répondons sous 24 à 48 heures.",
};

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden bg-[#faf9f5]">
      {/* ——— Hero de Page avec WebGL 3D Mesh & Guilloché Géométrique ——— */}
      <AtmosphereBackground
        variant="dark"
        enable3dMesh={true}
        enableGeometry={true}
        showSacredCircles={true}
        className="pb-24 pt-32 text-white sm:pb-32 sm:pt-40"
      >
        {/* Texture photographique subtile pour laisser rayonner le WebGL 3D et le guilloché or */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-15 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />


        <div className="container-app relative z-10">
          <AnimatedSection direction="up">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge d'engagement avec pulsation d'état */}
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-300 backdrop-blur-md shadow-lg shadow-gold-500/5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                </span>
                <span className="font-mono uppercase tracking-widest text-[0.6875rem]">
                  Écoute & Partenariat · Conakry
                </span>
              </div>

              {/* Titre Maître à contraste pur */}
              <h1 className="font-display mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-sm">
                Bâtissons ensemble un{" "}
                <span className="bg-gradient-to-r from-gold-300 via-gold-200 to-primary-300 bg-clip-text text-transparent">
                  avenir digne
                </span>{" "}
                pour chaque enfant.
              </h1>

              {/* Sous-titre avec lisibilité optimale garantie */}
              <p className="mt-5 text-base font-light leading-relaxed text-navy-100 sm:text-lg max-w-2xl mx-auto">
                Que vous soyez un particulier souhaitant parrainer un orphelin,
                une entreprise désireuse de concrétiser son engagement RSE, ou
                une institution internationale, notre direction vous répond avec
                rigueur et bienveillance.
              </p>

              {/* Piliers de confiance rapides */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-navy-200">
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <Sparkles size={15} className="text-gold-400" />
                  <span>Réponse garantie sous 24h à 48h</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <Shield size={15} className="text-primary-400" />
                  <span>ONG officiellement agréée en Guinée</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <HeartHandshake size={15} className="text-emerald-400" />
                  <span>100% de transparence et redevabilité</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </AtmosphereBackground>

      {/* ——— Section Principale : Coordonnées Directes & Formulaire ——— */}
      <section className="relative -mt-12 pb-24 sm:pb-32">
        {/* Trame géométrique isométrique douce sur fond crème (zéro obstacle à la lecture) */}
        <ComplexGeometricOverlay
          variant="light"
          opacity={0.25}
          showSacredCircles={false}
          className="pointer-events-none -z-10"
        />

        <div className="container-app relative z-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* Colonne Gauche : Canaux Directs, Carte Siège & Mot Fondatrice */}
            <div className="lg:col-span-5">
              <AnimatedSection direction="left">
                <ContactInteractiveCards />
              </AnimatedSection>
            </div>

            {/* Colonne Droite : Formulaire Tactile Haut de Gamme */}
            <div id="formulaire" className="lg:col-span-7 scroll-mt-24">
              <AnimatedSection direction="right" delay={0.1}>
                <div className="relative overflow-hidden rounded-3xl border border-white/90 bg-white/95 p-7 shadow-2xl shadow-navy-950/10 backdrop-blur-2xl sm:p-10 md:p-12">
                  {/* Liseré supérieur or & émeraude */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-700" />

                  {/* Lueurs ornementales d'angle */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold-400/10 blur-3xl"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-500/10 blur-3xl"
                  />

                  <ContactForm />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Section FAQ & Réponses Immédiates ——— */}
      <section id="faq" className="relative scroll-mt-20 border-t border-navy-100 bg-gradient-to-b from-white via-navy-50/40 to-white py-20 sm:py-28">
        <ComplexGeometricOverlay
          variant="light"
          opacity={0.18}
          showSacredCircles={false}
          className="pointer-events-none -z-10"
        />
        <div className="container-app relative z-10">
          <AnimatedSection direction="up">
            <ContactFaqSection />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}