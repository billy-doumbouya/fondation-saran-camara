"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/lib/db/schema";
import { GALLERY_CATEGORY_LABELS, type GalleryCategory } from "@/lib/site-data";
import { cn } from "@/lib/utils";

// ——— Pattern d'aspect ratio pour masonry déterministe (pas de Math.random) ———
const ROW_SPANS = [2, 3, 2, 4, 2, 3, 2, 3, 4, 2, 3, 2];
const rowSpanFor = (i: number) => ROW_SPANS[i % ROW_SPANS.length];

interface GalleryGridProps {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduce = useReducedMotion() ?? false;

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i == null ? i : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i == null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );

  // ——— Keyboard nav in lightbox ———
  useEffect(() => {
    if (activeIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, prev]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 [grid-auto-flow:dense] [grid-auto-rows:8rem] sm:[grid-auto-rows:10rem]">
        {images.map((img, i) => {
          const span = rowSpanFor(i);
          const categoryKey = img.category as GalleryCategory | null;
          const categoryLabel =
            categoryKey && categoryKey in GALLERY_CATEGORY_LABELS
              ? GALLERY_CATEGORY_LABELS[categoryKey]
              : null;

          return (
            <motion.button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.4,
                delay: (i % 8) * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "group relative overflow-hidden hairline bg-navy-50 rounded-md",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
              )}
              style={{ gridRow: `span ${span}` }}
              aria-label={img.title || "Ouvrir la photo"}
            >
              <Image
                src={img.imageUrl}
                alt={img.title ?? "Photo FSCPE"}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />

              {/* Hover overlay */}
              <span
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-navy-900/80 via-navy-900/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              {/* Category chip (top-left) */}
              {categoryLabel && (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-sm bg-white/90 hairline px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-widest text-navy-700 backdrop-blur-sm">
                  <span className="h-1 w-1 rounded-full bg-gold-500" aria-hidden />
                  {categoryLabel}
                </span>
              )}

              {/* Title (bottom, hover only) */}
              {img.title && (
                <span className="absolute inset-x-2 bottom-2 font-display text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {img.title}
                </span>
              )}

              {/* Corner accent */}
              <span
                aria-hidden
                className="absolute right-2 top-2 h-3 w-3 border-r border-t border-gold-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </motion.button>
          );
        })}
      </div>

      {/* ——— Lightbox ——— */}
      <AnimatePresence>
        {activeIndex != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/90 backdrop-blur-md p-4 sm:p-8"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Visionneuse photo"
          >
            {/* Close */}
            <button
              type="button"
              onClick={close}
              aria-label="Fermer"
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white hairline border-white/15 transition-colors hover:bg-white/20"
            >
              <X size={18} />
            </button>

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Précédent"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white hairline border-white/15 transition-colors hover:bg-white/20"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Suivant"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white hairline border-white/15 transition-colors hover:bg-white/20"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={activeIndex}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src={images[activeIndex]!.imageUrl}
                  alt={images[activeIndex]!.title ?? "Photo FSCPE"}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Caption */}
              <div className="mt-3 flex items-center justify-between gap-4 text-white">
                <div className="min-w-0">
                  {images[activeIndex]!.title && (
                    <p className="font-display text-sm font-medium truncate">
                      {images[activeIndex]!.title}
                    </p>
                  )}
                  {(() => {
                    const cat = images[activeIndex]!.category as GalleryCategory | null;
                    if (!cat || !(cat in GALLERY_CATEGORY_LABELS)) return null;
                    return (
                      <span className="font-mono text-[0.625rem] uppercase tracking-widest text-navy-300">
                        {GALLERY_CATEGORY_LABELS[cat]}
                      </span>
                    );
                  })()}
                </div>
                <span className="font-mono text-[0.625rem] uppercase tracking-widest text-navy-400 shrink-0">
                  {activeIndex + 1} / {images.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
