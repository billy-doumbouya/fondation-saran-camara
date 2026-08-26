"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import ContactForm from "@/components/site/ContactForm";
import { BRAND } from "@/lib/site-data";

// Image Unsplash d'arrière-plan (Humanitaire / Écoute / Communauté)
const CONTACT_HERO_BG =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?q=80&w=1920&auto=format&fit=crop";

// ==========================================
// 1. EFFET 3D D'EN-TÊTE INTERACTIF
// ==========================================
function Contact3DHeader() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.15;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#4bb56d" />

      {/* Anneau 3D Flottant et Rotatif */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.2}>
        <mesh ref={meshRef} position={[3, 0.5, -2]}>
          <torusGeometry args={[1.6, 0.4, 16, 50]} />
          <meshStandardMaterial
            color="#2f9950"
            wireframe
            transparent
            opacity={0.25}
            emissive="#227a3f"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Particules Lumineuses FSCPE */}
      <Sparkles count={50} scale={10} size={3} speed={0.5} opacity={0.7} color="#4bb56d" />
      <Sparkles count={30} scale={8} size={4} speed={0.8} opacity={0.8} color="#e3b32c" />
    </>
  );
}

// ==========================================
// 2. COMPOSANT PAGE CONTACT
// ==========================================
export default function ContactPage() {
  return (
    <>
      <InstitutionalHero
        image={CONTACT_HERO_BG}
        imageAlt="Échange avec la Fondation"
        eyebrow="Contact"
        title="Nous sommes à votre écoute"
        description="Une question, une envie d'engagement ou un partenariat ? Contactez l'équipe de la Fondation."
        badge={<span className="text-sm text-white/85">Une équipe disponible pour vous répondre</span>}
      >
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
            <Contact3DHeader />
          </Canvas>
        </div>
      </InstitutionalHero>

      {/* SECTION CONTENU & FORMULAIRE */}
      <div className="container-app py-16">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* CARTE DES INFORMATIONS DE CONTACT */}
          <AnimatedSection direction="left" className="lg:col-span-2">
            <div className="h-full rounded-3xl border border-navy-100/80 bg-white p-8 shadow-md transition-all duration-300 hover:border-primary-200 hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="relative mb-7 h-40 overflow-hidden rounded-2xl bg-navy-100">
                  <Image
                    src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=900&auto=format&fit=crop"
                    alt="Équipe en échange autour d'un projet"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    À votre écoute
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-navy-900">
                  Nos Coordonnées
                </h3>
                <p className="mt-2 text-sm text-navy-500 leading-relaxed">
                  Retrouvez-nous à Conakry ou écrivez-nous directement par téléphone ou email.
                </p>

                <div className="mt-8 space-y-6">
                  {/* Adresse */}
                  <div className="group flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                        Adresse
                      </h4>
                      <p className="mt-1 text-sm font-medium text-navy-800 leading-snug">
                        {BRAND.address}
                      </p>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="group flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                        Téléphone
                      </h4>
                      <a
                        href={`tel:${BRAND.phone}`}
                        className="mt-1 block text-sm font-medium text-navy-800 transition-colors hover:text-primary-600"
                      >
                        {BRAND.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                        Email
                      </h4>
                      <a
                        href={`mailto:${BRAND.email}`}
                        className="mt-1 block text-sm font-medium text-navy-800 transition-colors hover:text-primary-600"
                      >
                        {BRAND.email}
                      </a>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div className="group flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                        Horaires d&apos;ouverture
                      </h4>
                      <p className="mt-1 text-sm font-medium text-navy-800">
                        Lundi – Vendredi : 08h00 – 17h00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Encadré d'engagement */}
              <div className="mt-10 rounded-2xl bg-primary-50/70 p-4 border border-primary-100">
                <div className="flex items-center gap-2 text-primary-700 font-semibold text-xs uppercase tracking-wider">
                  <Send size={14} /> Réponse rapide
                </div>
                <p className="mt-1 text-xs text-navy-600">
                  Notre équipe s&apos;efforce de répondre à toutes les demandes sous 24h à 48h ouvrées.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* FORMULAIRE DE CONTACT */}
          <AnimatedSection direction="right" delay={0.1} className="lg:col-span-3">
            <div className="rounded-3xl border border-navy-100/80 bg-white p-8 shadow-md transition-all duration-300 hover:shadow-xl">
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}