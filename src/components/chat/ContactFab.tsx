"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X } from "lucide-react";
import { useChatUIStore } from "@/lib/store";

const HINT_STORAGE_KEY = "fscpe_fab_hint_seen";
const HINT_DELAY_MS = 1500;
const HINT_DURATION_MS = 5000;

export default function ContactFab() {
  const chatOpen = useChatUIStore((s) => s.open);
  const setChatOpen = useChatUIStore((s) => s.setOpen);
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
    setChatOpen(!chatOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* First-visit discovery hint */}
      <AnimatePresence>
        {showHint && !chatOpen && (
          <motion.button
            type="button"
            onClick={handleMainClick}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="max-w-[13rem] rounded-2xl rounded-br-sm bg-navy-900 px-4 py-3 text-left text-xs font-medium text-white shadow-xl"
          >
            Posez vos questions à l&apos;assistant FSCPE.
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative">
        {!chatOpen && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary-500/40" />
        )}
        <motion.button
          type="button"
          onClick={handleMainClick}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label={chatOpen ? "Fermer l’assistant FSCPE" : "Ouvrir l’assistant FSCPE"}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl shadow-primary-600/40"
        >
          {chatOpen ? <X size={22} /> : <Bot size={23} />}
        </motion.button>
      </div>
    </div>
  );
}
