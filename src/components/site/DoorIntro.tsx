"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Sparkles, X } from "lucide-react";

const emptySubscribe = () => () => {};

function checkShouldDismiss(reduce: boolean): boolean {
  if (typeof window === "undefined") return true;
  if (reduce) return true;

  try {
    const navEntries = performance.getEntriesByType?.("navigation") as
      | PerformanceNavigationTiming[]
      | undefined;
    const isReload = navEntries?.[0]?.type === "reload";
    const forceReplay =
      window.location.search.includes("door") ||
      window.location.search.includes("intro");

    const alreadySeen = sessionStorage.getItem("fscpe-door-seen-v5");
    return Boolean(alreadySeen && !isReload && !forceReplay);
  } catch {
    return false;
  }
}

/**
 * Effet majestueux "Porte d'entrée FSCPE"
 *
 * - Démarre immédiatement pour éviter tout saut de contenu (flash).
 * - S'ouvre avec une perspective 3D architecturale et des faisceaux dorés.
 * - Ne bloque plus les écrans tactiles ou laptops modernes.
 * - Joue à la visite ou lors d'un rafraîchissement de page.
 * - Bouton élégant "Passer" pour une accessibilité et liberté totale.
 */
export default function DoorIntro() {
  const reduce = useReducedMotion() ?? false;
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const initialDismissed = useSyncExternalStore(
    emptySubscribe,
    () => checkShouldDismiss(reduce),
    () => false
  );

  const audioContextRef = useRef<AudioContext | null>(null);
  const hasPlayedDoorSoundRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (initialDismissed || reduce) return;

    try {
      sessionStorage.setItem("fscpe-door-seen-v5", "1");
      sessionStorage.removeItem("fscpe-door-seen");
    } catch {
      // Ignorer si stockage restreint
    }

    const tOpen = setTimeout(() => setIsOpen(true), 850);
    const tDismiss = setTimeout(() => setIsDismissed(true), 2500);

    return () => {
      clearTimeout(tOpen);
      clearTimeout(tDismiss);
    };
  }, [initialDismissed, reduce]);

  useEffect(() => {
    if (!isOpen || initialDismissed || reduce || hasPlayedDoorSoundRef.current) return;

    hasPlayedDoorSoundRef.current = true;

    if (typeof window === "undefined") return;

    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;

    const context = new AudioCtor();
    audioContextRef.current = context;
    const now = context.currentTime;
    const master = context.createGain();
    master.gain.value = 0.0001;
    master.connect(context.destination);

    const creakOsc = context.createOscillator();
    creakOsc.type = "sawtooth";
    creakOsc.frequency.setValueAtTime(180, now);
    creakOsc.frequency.exponentialRampToValueAtTime(60, now + 1.2);

    const creakGain = context.createGain();
    creakGain.gain.setValueAtTime(0.0001, now);
    creakGain.gain.exponentialRampToValueAtTime(0.11, now + 0.12);
    creakGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    creakOsc.connect(creakGain);
    creakGain.connect(master);
    creakOsc.start(now);
    creakOsc.stop(now + 1.2);

    const duration = 1.2;
    const buffer = context.createBuffer(1, Math.floor(context.sampleRate * duration), context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i += 1) {
      const t = i / channel.length;
      const sweep = 1 - t;
      const noise = (Math.random() * 2 - 1) * (0.5 + sweep * 0.8);
      channel[i] = noise * (0.12 + (1 - t) * 0.18);
    }

    const noiseSource = context.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseGain = context.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);

    noiseSource.connect(noiseGain);
    noiseGain.connect(master);
    noiseSource.start(now);
    noiseSource.stop(now + duration);

    master.gain.linearRampToValueAtTime(0.18, now + 0.04);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    const timeoutId = window.setTimeout(async () => {
      try {
        await context.close();
      } catch {
        // Fermer proprement si le contexte est déjà fermé.
      }
    }, 1500);

    return () => {
      window.clearTimeout(timeoutId);
      if (audioContextRef.current) {
        void audioContextRef.current.close().catch(() => undefined);
      }
    };
  }, [isOpen, initialDismissed, reduce]);

  if (!isMounted || initialDismissed || isDismissed) return null;

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          className="fixed inset-0 z-[120] flex select-none overflow-hidden"
          style={{ perspective: "1600px", perspectiveOrigin: "center center" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          aria-hidden="true"
        >
          {/* Bouton discret "Passer l'introduction" */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="absolute bottom-6 right-6 z-50 flex items-center gap-1.5 rounded-full border border-white/20 bg-navy-950/70 px-4 py-2 text-xs font-medium tracking-wider text-white/80 backdrop-blur-md transition-all hover:border-gold-500/50 hover:bg-navy-950 hover:text-white"
          >
            <span>Passer l&apos;intro</span>
            <X size={14} />
          </button>

          {/* Lueur dorée centrale qui rayonne à travers l'ouverture */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={
              isOpen
                ? { opacity: [0.6, 1, 0], scale: [0.9, 1.8, 2.5] }
                : { opacity: [0.2, 0.7, 0.4], scale: [0.9, 1.05, 0.95] }
            }
            transition={
              isOpen
                ? { duration: 1.4, ease: "easeOut" }
                : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <div
              className="h-80 w-80 rounded-full blur-3xl sm:h-96 sm:w-96"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,160,23,0.7) 0%, rgba(34,122,63,0.4) 40%, transparent 70%)",
              }}
            />
          </motion.div>

          {/* Battant Gauche */}
          <motion.div
            className="absolute inset-y-0 left-0 w-[49.9%] overflow-hidden border-r border-gold-500/40 bg-navy-900 shadow-2xl"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              backgroundImage:
                "radial-gradient(circle at 100% 50%, rgba(212,160,23,0.12) 0%, transparent 60%), linear-gradient(135deg, #101a2e 0%, #16233f 60%, #154025 100%)",
            }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isOpen ? -108 : 0 }}
            transition={{
              duration: 1.5,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/* Lignes ornementales géométriques dorées */}
            <div className="absolute inset-4 rounded-xl border border-gold-500/20 sm:inset-10" />
            <div className="absolute inset-8 rounded-lg border border-white/5 sm:inset-16" />

            {/* Tranche droite avec lueur dorée */}
            <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-gold-400 to-transparent opacity-80" />

            {/* Texte & Monogramme gauche */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-end px-3 sm:px-6">
              <div className="mx-auto w-[60%] max-w-[220px] text-right max-[380px]:w-[70%]">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-gold-400/90 max-[380px]:text-[0.56rem] max-[380px]:tracking-[0.18em]">
                  Fondation Humanitaire
                </span>
                <span className="mt-1 block font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl max-[380px]:text-3xl">
                  FSCPE
                </span>
                <span className="mt-1 block font-mono text-[0.625rem] uppercase tracking-widest text-white/50 max-[380px]:text-[0.5rem]">
                  Guinée · Conakry
                </span>
              </div>
            </div>

            {/* Demi-sceau central doré */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold-400/60 bg-navy-950 shadow-2xl backdrop-blur-md sm:h-36 sm:w-36 max-[380px]:h-20 max-[380px]:w-20">
                <Sparkles className="h-6 w-6 text-gold-400 max-[380px]:h-4 max-[380px]:w-4" />
              </div>
            </div>
          </motion.div>

          {/* Battant Droit */}
          <motion.div
            className="absolute inset-y-0 right-0 w-[49.9%] overflow-hidden border-l border-gold-500/40 bg-navy-900 shadow-2xl"
            style={{
              transformOrigin: "right center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              backgroundImage:
                "radial-gradient(circle at 0% 50%, rgba(212,160,23,0.12) 0%, transparent 60%), linear-gradient(225deg, #101a2e 0%, #16233f 60%, #154025 100%)",
            }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isOpen ? 108 : 0 }}
            transition={{
              duration: 1.5,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/* Lignes ornementales géométriques dorées */}
            <div className="absolute inset-4 rounded-xl border border-gold-500/20 sm:inset-10" />
            <div className="absolute inset-8 rounded-lg border border-white/5 sm:inset-16" />

            {/* Tranche gauche avec lueur dorée */}
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-gold-400 to-transparent opacity-80" />

            {/* Texte & Devise droite */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-start px-3 sm:px-6">
              <div className="mx-auto w-[60%] max-w-[220px] text-left max-[380px]:w-[70%]">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-primary-400 max-[380px]:text-[0.5rem] max-[380px]:tracking-[0.18em]">
                  Protection de l&apos;Enfance
                </span>
                <span className="mt-1 block font-display text-xl font-bold tracking-tight text-white/90 sm:text-2xl md:text-3xl max-[380px]:text-base">
                  Saran Camara
                </span>
                <p className="mt-2 text-xs font-light leading-relaxed text-white/60 sm:text-sm max-[380px]:mt-1 max-[380px]:text-[0.6rem] max-[380px]:leading-snug">
                  Un avenir digne pour chaque orphelin et enfant vulnérable.
                </p>
              </div>
            </div>

            {/* Demi-sceau central droit */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold-400/60 bg-navy-950 shadow-2xl backdrop-blur-md sm:h-36 sm:w-36 max-[380px]:h-20 max-[380px]:w-20">
                <span className="font-display text-sm font-bold tracking-widest text-gold-300 max-[380px]:text-[0.55rem] max-[380px]:tracking-[0.15em]">
                  EST. 2026
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
