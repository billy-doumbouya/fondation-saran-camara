"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  badge?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  children: ReactNode;
}

const SIZE_CLASSES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  "2xl": "max-w-4xl",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  badge,
  size = "lg",
  children,
}: ModalProps) {
  // Bloquer le défilement arrière-plan et fermer sur Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Arrière-plan flouté moderne */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-950/65 backdrop-blur-sm"
          />

          {/* Conteneur de la boîte modale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className={`relative w-full ${SIZE_CLASSES[size]} my-auto max-h-[92vh] flex flex-col rounded-3xl border border-navy-100/80 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.28)] overflow-hidden z-10`}
          >
            {/* Header avec dégradé subtil et titre stylisé */}
            <div className="flex items-start justify-between border-b border-navy-100 bg-gradient-to-r from-navy-50/60 via-white to-primary-50/30 px-6 py-5 sm:px-8">
              <div>
                {badge && (
                  <span className="inline-block mb-1.5 rounded-full bg-primary-100/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-800">
                    {badge}
                  </span>
                )}
                <h2 className="font-display text-xl font-bold tracking-tight text-navy-900">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-xs text-navy-500 sm:text-sm">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="ml-4 -mr-1.5 -mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-navy-400 hover:bg-navy-100/70 hover:text-navy-700 transition-colors"
                aria-label="Fermer la boîte de dialogue"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenu avec défilement fluide */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 max-h-[calc(92vh-100px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
