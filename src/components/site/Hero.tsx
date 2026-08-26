"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, HeartHandshake, ChevronDown } from "lucide-react";

import TypingEffect from "./TypingEffect";
import { BRAND, HERO_TYPING_WORDS } from "@/lib/site-data";

interface HeroProps {
  videoUrl?: string | null;
  posterUrl?: string | null;
}

// Vidéo libre de droits (Pexels — licence gratuite, attribution non requise)
// "Rural African Classroom with Students Learning" par TimePRO TV
// https://www.pexels.com/video/rural-african-classroom-with-students-learning-32778874/
// Remarque : le fichier source est en 2560x1440. Si le poids pèse sur le LCP,
// télécharge la version SD depuis la page Pexels et héberge-la toi-même.
const DEFAULT_SCHOOL_VIDEO =
  "https://videos.pexels.com/video-files/32778874/13973117_2560_1440_30fps.mp4";
const DEFAULT_SCHOOL_POSTER =
  "https://images.pexels.com/videos/32778874/africa-african-children-african-rural-school-african-students-32778874.jpeg?auto=compress&cs=tinysrgb&h=900&fit=crop&w=1600";

// ==========================================
// Poussière de craie — remplace l'ancien overlay Three.js/Sparkles.
// Même effet d'ambiance (points lumineux qui dérivent), sans le coût
// d'un contexte WebGL. Positions fixes (pas de Math.random au render)
// pour éviter tout mismatch d'hydratation SSR/CSR.
// ==========================================
const DUST_MOTES = [
  { left: "8%", size: 4, duration: 14, delay: 0, drift: 24, color: "rgba(255,255,255,0.55)" },
  { left: "16%", size: 3, duration: 11, delay: 2.4, drift: -18, color: "rgba(227,179,44,0.5)" },
  { left: "24%", size: 5, duration: 16, delay: 1.1, drift: 20, color: "rgba(255,255,255,0.4)" },
  { left: "33%", size: 3, duration: 10, delay: 3.6, drift: -14, color: "rgba(75,181,109,0.45)" },
  { left: "41%", size: 4, duration: 13, delay: 0.7, drift: 16, color: "rgba(227,179,44,0.4)" },
  { left: "52%", size: 6, duration: 17, delay: 2.9, drift: -22, color: "rgba(255,255,255,0.5)" },
  { left: "61%", size: 3, duration: 12, delay: 1.8, drift: 18, color: "rgba(75,181,109,0.4)" },
  { left: "69%", size: 4, duration: 15, delay: 4.2, drift: -16, color: "rgba(255,255,255,0.45)" },
  { left: "77%", size: 5, duration: 11, delay: 0.3, drift: 22, color: "rgba(227,179,44,0.5)" },
  { left: "85%", size: 3, duration: 14, delay: 3.1, drift: -20, color: "rgba(255,255,255,0.4)" },
  { left: "92%", size: 4, duration: 16, delay: 1.5, drift: 14, color: "rgba(75,181,109,0.4)" },
  { left: "4%", size: 3, duration: 12, delay: 4.8, drift: 20, color: "rgba(227,179,44,0.4)" },
] as const;

function ChalkDust({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {DUST_MOTES.map((m, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full blur-[1px]"
          style={{
            left: m.left,
            width: m.size,
            height: m.size,
            backgroundColor: m.color,
          }}
          animate={{
            y: ["0%", "-120%"],
            x: [0, m.drift, 0],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ==========================================
// Rayon de lumière — élément signature.
// Un faisceau diagonal qui balaie lentement la vidéo, comme la lumière
// du matin traversant une salle de classe. Rare, lent, discret : un seul
// geste fort plutôt que plusieurs effets superposés.
// ==========================================
function LightSweep({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 z-[6] w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent mix-blend-soft-light"
      initial={{ left: "-40%" }}
      animate={{ left: ["-40%", "120%"] }}
      transition={{ duration: 7, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
    />
  );
}

// ==========================================
// Grain cinématographique — texture subtile pour éviter l'effet
// "vidéo plate" et donner une profondeur presque filmique.
// ==========================================
function FilmGrain() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 z-[7] h-full w-full opacity-[0.05] mix-blend-overlay">
      <filter id="hero-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#hero-grain)" />
    </svg>
  );
}

// ==========================================
// Orbes lumineux animés (Framer Motion)
// ==========================================
function FloatingOrbs({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute -right-16 top-16 h-72 w-72 rounded-full bg-primary-500/25 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 30, 0], y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute left-[-4rem] bottom-10 h-64 w-64 rounded-full bg-[#e3b32c]/20 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -25, 0], y: [0, 25, 0], opacity: [0.4, 0.7, 0.4] }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="pointer-events-none absolute right-1/3 bottom-0 h-40 w-40 rounded-full bg-primary-400/20 blur-2xl"
        animate={reduceMotion ? undefined : { y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </>
  );
}

// ==========================================
// Vague de transition en bas du Hero
// ==========================================
function HeroWaveDivider() {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 leading-[0]">
      <svg
        viewBox="0 0 1440 90"
        className="h-14 w-full sm:h-20"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,32 C240,80 480,0 720,24 C960,48 1200,88 1440,40 L1440,90 L0,90 Z"
          fill="white"
        />
      </svg>
    </div>
  );
}

// ==========================================
// Indicateur de scroll
// ==========================================
function ScrollCue({ reduceMotion }: { reduceMotion: boolean }) {
  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight * 0.92, behavior: "smooth" });
  };
  return (
    <motion.button
      type="button"
      onClick={scrollToNext}
      aria-label="Découvrir la suite"
      className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full p-2 text-white/70 transition-colors hover:text-white"
      animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
    >
      <ChevronDown size={26} />
    </motion.button>
  );
}

// ==========================================
// Composant Hero
// ==========================================
export default function Hero({ videoUrl, posterUrl }: HeroProps) {
  const activeVideoUrl = videoUrl || DEFAULT_SCHOOL_VIDEO;
  const activePosterUrl = posterUrl || DEFAULT_SCHOOL_POSTER;
  const [videoFailed, setVideoFailed] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-900 text-white">
      {/* VIDÉO DE FOND */}
      <div className="absolute inset-0 z-0">
        {!videoFailed && (
          <motion.video
            key={activeVideoUrl}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={activePosterUrl}
            src={activeVideoUrl}
            onError={() => setVideoFailed(true)}
            initial={{ opacity: 0, scale: 1 }}
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: [1, 1.06, 1] }
            }
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 22, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        )}

        {/* Fallback si pas de vidéo / échec de chargement */}
        {videoFailed && (
          <div className="h-full w-full bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900" />
        )}

        {/* Dégradés de lisibilité — teintés à l'identité de la fondation */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/75 to-navy-900/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/85 via-navy-900/20 to-transparent" />
        <div className="absolute inset-0 bg-primary-900/10 mix-blend-multiply" />

        {/* Rayon de lumière signature */}
        {!videoFailed && <LightSweep reduceMotion={reduceMotion} />}
      </div>

      {/* Grain cinématographique */}
      <FilmGrain />

      {/* Poussière de craie (remplace l'overlay Three.js) */}
      <div className="absolute inset-0 z-[5]">
        <ChalkDust reduceMotion={reduceMotion} />
      </div>

      {/* Orbes animés */}
      <div className="absolute inset-0 z-10">
        <FloatingOrbs reduceMotion={reduceMotion} />
      </div>

      {/* CONTENU */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-app relative z-20 py-24"
      >
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-primary-200 backdrop-blur-sm"
        >
          {BRAND.acronym} · Conakry, République de Guinée
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display mt-6 max-w-3xl text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl"
        >
          Ensemble, construisons
          <br />
          <span className="text-primary-400">
            <TypingEffect words={HERO_TYPING_WORDS} />
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-lg text-navy-100/90 font-light"
        >
          La {BRAND.fullName} scolarise, protège et accompagne les enfants
          orphelins et vulnérables de Guinée à travers l&apos;éducation, les kits
          scolaires et le soutien communautaire.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/don"
            className="group inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 hover:bg-primary-600"
          >
            <HeartHandshake size={18} />
            Faire un don
          </Link>
          <Link
            href="/programmes"
            className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/15"
          >
            Découvrir nos programmes
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      <ScrollCue reduceMotion={reduceMotion} />

      {/* Vague de transition vers la section suivante */}
      <HeroWaveDivider />
    </section>
  );
}