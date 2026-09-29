"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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
            className="relative h-full w-1/2 overflow-hidden border-r border-gold-500/40 bg-navy-900 shadow-2xl"
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
            <div className="absolute inset-y-0 right-8 flex flex-col items-end justify-center text-right sm:right-16">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-gold-400/90">
                Fondation Humanitaire
              </span>
              <span className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                FSCPE
              </span>
              <span className="mt-1 font-mono text-[0.625rem] uppercase tracking-widest text-white/50">
                Guinée · Conakry
              </span>
            </div>

            {/* Demi-sceau central doré */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold-400/60 bg-navy-950 shadow-2xl backdrop-blur-md sm:h-36 sm:w-36">
                <Sparkles className="h-6 w-6 text-gold-400" />
              </div>
            </div>
          </motion.div>

          {/* Battant Droit */}
          <motion.div
            className="relative h-full w-1/2 overflow-hidden border-l border-gold-500/40 bg-navy-900 shadow-2xl"
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
            <div className="absolute inset-y-0 left-8 flex flex-col items-start justify-center text-left sm:left-16">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-primary-400">
                Protection de l&apos;Enfance
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-white/90 sm:text-2xl md:text-3xl max-w-xs">
                Saran Camara
              </span>
              <p className="mt-2 max-w-xs text-xs font-light leading-relaxed text-white/60 sm:text-sm">
                Un avenir digne pour chaque orphelin et enfant vulnérable.
              </p>
            </div>

            {/* Demi-sceau central droit */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold-400/60 bg-navy-950 shadow-2xl backdrop-blur-md sm:h-36 sm:w-36">
                <span className="font-display text-sm font-bold tracking-widest text-gold-300">
                  EST. 2024
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
