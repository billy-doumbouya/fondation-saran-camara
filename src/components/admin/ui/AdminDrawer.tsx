"use client";

import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  badge?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
  children: ReactNode;
}

const sizeWidths = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

export default function AdminDrawer({
  isOpen,
  onClose,
  title,
  description,
  badge,
  size = "md",
  footer,
  children,
}: AdminDrawerProps) {
  // Verrouillage du scroll en arrière-plan lorsque le tiroir est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fermeture par la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop sombre flouté */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-950/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Panneau coulissant */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={cn(
              "relative z-10 flex h-full w-full flex-col border-l border-slate-200 bg-white shadow-2xl",
              sizeWidths[size]
            )}
          >
            {/* En-tête du tiroir */}
            <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-navy-950">
                    {title}
                  </h3>
                  {badge && <div>{badge}</div>}
                </div>
                {description && (
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="Fermer le volet"
              >
                <X size={18} />
              </button>
            </div>

            {/* Corps défilable */}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>

            {/* Pied de page avec actions si présent */}
            {footer && (
              <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
