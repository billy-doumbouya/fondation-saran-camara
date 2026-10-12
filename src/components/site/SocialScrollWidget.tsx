"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Share2, X } from "lucide-react";
import type { IconType } from "react-icons";
import { FaLinkedin } from "react-icons/fa6";
import {
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiYoutube,
} from "react-icons/si";

const SEARCH_TERM = encodeURIComponent("Fondation Saran Camara FSCPE");

const SOCIAL_NETWORKS: {
  label: string;
  href: string;
  Icon: IconType;
  color: string;
}[] = [
  {
    label: "Facebook",
    href: `https://www.facebook.com/search/top?q=${SEARCH_TERM}`,
    Icon: SiFacebook,
    color: "#1877F2",
  },
  {
    label: "LinkedIn",
    href: `https://www.linkedin.com/search/results/companies/?keywords=${SEARCH_TERM}`,
    Icon: FaLinkedin,
    color: "#0A66C2",
  },
  {
    label: "TikTok",
    href: `https://www.tiktok.com/search?q=${SEARCH_TERM}`,
    Icon: SiTiktok,
    color: "#111111",
  },
  {
    label: "Instagram",
    href: `https://www.instagram.com/explore/search/keyword/?q=${SEARCH_TERM}`,
    Icon: SiInstagram,
    color: "#C13584",
  },
  {
    label: "YouTube",
    href: `https://www.youtube.com/results?search_query=${SEARCH_TERM}`,
    Icon: SiYoutube,
    color: "#FF0033",
  },
];

const SHOW_AFTER_PX = 320;

export default function SocialScrollWidget() {
  const [visible, setVisible] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-label="Réseaux sociaux de la Fondation Saran Camara"
          className="fixed left-2 top-1/2 z-40 -translate-y-1/2 sm:left-4"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -28, scale: 0.88, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20, scale: 0.92, filter: "blur(6px)" }}
          transition={{ duration: reduceMotion ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={`flex flex-col items-center rounded-full border border-white/70 bg-white/80 shadow-[0_16px_44px_-18px_rgba(16,26,46,0.55)] backdrop-blur-xl ${mobileExpanded ? "gap-1.5 px-1.5 py-2.5" : "p-1"} sm:gap-2 sm:px-2 sm:py-3`}>
            <span
              className="mb-1 hidden font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-navy-500 sm:block sm:text-[9px]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              FSCPE
            </span>
            <motion.button
              type="button"
              onClick={() => setMobileExpanded((expanded) => !expanded)}
              aria-label={mobileExpanded ? "Replier les réseaux sociaux" : "Afficher les réseaux sociaux"}
              aria-expanded={mobileExpanded}
              title={mobileExpanded ? "Replier les réseaux sociaux" : "Afficher les réseaux sociaux"}
              whileTap={reduceMotion ? undefined : { scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-navy-950 shadow-sm ring-1 ring-gold-500/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:hidden"
            >
              {mobileExpanded ? <X size={18} /> : <Share2 size={18} />}
            </motion.button>
            <AnimatePresence initial={false}>
              {mobileExpanded && (
                <motion.div
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center gap-1.5 overflow-hidden sm:hidden"
                >
                  <SocialLinks reduceMotion={reduceMotion} onNavigate={() => setMobileExpanded(false)} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="hidden flex-col items-center gap-2 sm:flex">
              <SocialLinks reduceMotion={reduceMotion} onNavigate={() => setMobileExpanded(false)} />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function SocialLinks({
  reduceMotion,
  onNavigate,
}: {
  reduceMotion: boolean;
  onNavigate: () => void;
}) {
  return SOCIAL_NETWORKS.map(({ label, href, Icon, color }, index) => (
    <motion.a
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      aria-label={`Rechercher la Fondation Saran Camara sur ${label}`}
      title={`Rechercher la FSCPE sur ${label}`}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12, y: 8, scale: 0.7, rotate: -10 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
      transition={{
        duration: reduceMotion ? 0.12 : 0.38,
        delay: reduceMotion ? 0 : 0.08 + index * 0.075,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reduceMotion ? undefined : { scale: 1.16, rotate: 5, y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy-700 shadow-sm ring-1 ring-navy-900/5 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:h-10 sm:w-10"
      style={{ color }}
    >
      <Icon size={18} aria-hidden="true" />
      <span className="pointer-events-none absolute left-full ml-3 hidden translate-x-1 rounded-md bg-navy-950 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block">
        {label}
      </span>
    </motion.a>
  ));
}