"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, ChevronDown, HeartHandshake } from "lucide-react";

import TypingEffect from "./TypingEffect";
import ComplexGeometricOverlay from "./ambient/ComplexGeometricOverlay";
import { BRAND, HERO_TYPING_WORDS } from "@/lib/site-data";

interface HeroProps {
  videoUrl?: string | null;
  posterUrl?: string | null;
}

const DEFAULT_SCHOOL_VIDEO =
  "https://videos.pexels.com/video-files/32778874/13973117_2560_1440_30fps.mp4";
const DEFAULT_SCHOOL_POSTER =
  "https://images.pexels.com/videos/32778874/africa-african-children-african-rural-school-african-students-32778874.jpeg?auto=compress&cs=tinysrgb&h=900&fit=crop&w=1600";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero({ videoUrl, posterUrl }: HeroProps) {
  const activeVideoUrl = videoUrl || DEFAULT_SCHOOL_VIDEO;
  const activePosterUrl = posterUrl || DEFAULT_SCHOOL_POSTER;
  const [videoFailed, setVideoFailed] = useState(false);
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-900 text-white"
      aria-label="Présentation de la Fondation"
    >
      {/* ——— Background ——— */}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}
        {videoFailed && (
          <div className="mesh-hero h-full w-full" />
        )}

        {/* Lisibilité — dégradés multi-couches */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/75 to-navy-900/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/85 via-navy-900/20 to-transparent" />
        <div className="absolute inset-0 bg-primary-900/10 mix-blend-multiply" />

        {/* Trame géométrique sacrée et guilloché de haute précision */}
        <ComplexGeometricOverlay
          variant="dark"
          opacity={0.65}
          showSacredCircles={true}
          className="z-[2]"
        />

        {/* Orbe lumineux lent */}
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-primary-500/20 blur-3xl"
            aria-hidden
            animate={{ y: [0, -24, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Light sweep signature */}
        {!reduce && !videoFailed && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 z-[5] w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mix-blend-soft-light"
            initial={{ left: "-40%" }}
            animate={{ left: ["-40%", "120%"] }}
            transition={{
              duration: 9,
              repeat: Infinity,
              repeatDelay: 8,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Film grain statique */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6] h-full w-full opacity-[0.04] mix-blend-overlay"
        >
          <filter id="hero-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-grain)" />
        </svg>
      </div>

      {/* ——— Content ——— */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-app relative z-20 py-24"
      >
        <motion.div variants={item} className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold-400/60" aria-hidden />
          <span className="eyebrow eyebrow-light">
            {BRAND.acronym} · Conakry, République de Guinée
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
        >
          Ensemble, construisons
          <br />
          <span className="text-primary-400">
            <TypingEffect words={HERO_TYPING_WORDS} />
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-base font-light leading-relaxed text-navy-100/90 sm:text-lg"
        >
          La {BRAND.fullName} scolarise, protège et accompagne les enfants
          orphelins et vulnérables de Guinée — à travers l&apos;éducation, les
          kits scolaires et le soutien communautaire.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
          <Link href="/don" className="btn-primary group">
            <HeartHandshake size={18} />
            Faire un don
          </Link>
          <Link href="/programmes" className="btn-ghost btn-ghost-light group">
            Découvrir nos programmes
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* ——— Scroll cue ——— */}
      <motion.button
        type="button"
        onClick={() =>
          window.scrollTo({ top: window.innerHeight * 0.92, behavior: "smooth" })
        }
        aria-label="Découvrir la suite"
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 transition-colors hover:text-white"
        initial={{ opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, 8, 0] }}
        transition={
          reduce
            ? { duration: 0.5, delay: 1.2 }
            : { opacity: { duration: 0.5, delay: 1.2 }, y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        }
      >
        <span className="font-mono text-[0.625rem] uppercase tracking-widest">
          Scroll
        </span>
        <ChevronDown size={20} />
      </motion.button>

      {/* ——— Bottom hairline cut ——— */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-white/10" aria-hidden />
    </section>
  );
}