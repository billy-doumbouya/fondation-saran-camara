"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { useChatUIStore, useContactFabStore } from "@/lib/store";
import { BRAND } from "@/lib/site-data";

const HINT_STORAGE_KEY = "fscpe_fab_hint_seen";
const HINT_DELAY_MS = 1500;
const HINT_DURATION_MS = 5000;

/** Icône générique "téléphone dans une bulle" — teintée en vert WhatsApp,
 *  pas le logo de marque déposé, pour éviter toute reproduction d'IP. */
function WhatsAppGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.65-1.22A9 9 0 1 0 12 3Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.65-1.22A9 9 0 1 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.5 9.2c.2-.5.4-.5.6-.5h.4c.15 0 .3 0 .4.3.15.35.5 1.2.55 1.3.05.1.08.2 0 .35-.08.15-.12.25-.25.4-.12.15-.25.25-.1.5.4.7.85 1.15 1.5 1.5.25.15.35.1.5-.05.15-.15.55-.6.7-.8.15-.2.3-.15.5-.1.2.08 1.25.6 1.45.7.2.1.35.15.4.25.05.1.05.55-.15 1.05-.2.5-1.1.95-1.5.98-.4.03-.75.2-2.5-.5-2.1-.85-3.4-2.9-3.5-3.05-.1-.15-.83-1.1-.83-2.1 0-1 .5-1.5.7-1.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ContactFab() {
  const chatOpen = useChatUIStore((s) => s.open);
  const setChatOpen = useChatUIStore((s) => s.setOpen);
  const { expanded, toggleExpanded, setExpanded } = useContactFabStore();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(HINT_STORAGE_KEY)) return;
    } catch {
      return;
    }
    const showTimer = setTimeout(() => setShowHint(true), HINT_DELAY_MS);
    const hideTimer = setTimeout(() => {
      setShowHint(false);
      try {
        localStorage.setItem(HINT_STORAGE_KEY, "1");
      } catch {
        /* ignore (private browsing, etc.) */
      }
    }, HINT_DELAY_MS + HINT_DURATION_MS);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    try {
      localStorage.setItem(HINT_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const handleMainClick = () => {
    dismissHint();
    if (chatOpen) {
      setChatOpen(false);
      setExpanded(false);
      return;
    }
    toggleExpanded();
  };

  const openChat = () => {
    dismissHint();
    setExpanded(false);
    setChatOpen(true);
  };

  const whatsappHref = `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
    "Bonjour, je viens du site de la Fondation Saran Camara et je souhaite avoir des informations."
  )}`;

  const mainOpen = expanded || chatOpen;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* First-visit discovery hint */}
      <AnimatePresence>
        {showHint && !mainOpen && (
          <motion.button
            type="button"
            onClick={() => {
              dismissHint();
              toggleExpanded();
            }}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="max-w-[13rem] rounded-2xl rounded-br-sm bg-navy-900 px-4 py-3 text-left text-xs font-medium text-white shadow-xl"
          >
            💬 Besoin d&apos;aide ? Discutez avec nous ou écrivez-nous sur WhatsApp.
          </motion.button>
        )}
      </AnimatePresence>

      {/* Speed-dial options */}
      <AnimatePresence>
        {expanded && !chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-end gap-3"
          >
            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => setExpanded(false)}
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.9 }}
              transition={{ duration: 0.18, delay: 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 rounded-full bg-white py-2.5 pl-4 pr-2.5 text-sm font-semibold text-navy-800 shadow-lg"
            >
              WhatsApp
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white">
                <WhatsAppGlyph size={18} />
              </span>
            </motion.a>

            <motion.button
              type="button"
              onClick={openChat}
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 rounded-full bg-white py-2.5 pl-4 pr-2.5 text-sm font-semibold text-navy-800 shadow-lg"
            >
              Assistant IA
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white">
                <Sparkles size={16} />
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <div className="relative">
        {!mainOpen && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary-500/40" />
        )}
        <motion.button
          type="button"
          onClick={handleMainClick}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label={mainOpen ? "Fermer" : "Nous contacter"}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl shadow-primary-600/40"
        >
          {mainOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </motion.button>
      </div>
    </div>
  );
}
