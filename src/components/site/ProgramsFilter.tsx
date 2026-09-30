"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Search, X, Filter } from "lucide-react";
import type { Program } from "@/lib/db/schema";
import ProgramCard from "@/components/site/cards/ProgramCard";
import { cn } from "@/lib/utils";

interface ProgramsFilterProps {
  programs: Program[];
}

const PILLAR_OPTIONS = [
  { key: "all", label: "Tous" },
  { key: "education", label: "Éducation" },
  { key: "protection", label: "Protection" },
  { key: "orphelins", label: "Orphelins" },
  { key: "social", label: "Social" },
] as const;

export default function ProgramsFilter({ programs }: ProgramsFilterProps) {
  const [selectedPillar, setSelectedPillar] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const reduce = useReducedMotion() ?? false;

  // Calcul du nombre de programmes par pilier
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: programs.length };
    for (const p of programs) {
      if (p.pillar) {
        map[p.pillar] = (map[p.pillar] ?? 0) + 1;
      }
    }
    return map;
  }, [programs]);

  // Filtrage combiné : pilier + recherche textuelle
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return programs.filter((p) => {
      const matchPillar = selectedPillar === "all" || p.pillar === selectedPillar;
      if (!matchPillar) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.summary && p.summary.toLowerCase().includes(q))
      );
    });
  }, [programs, selectedPillar, search]);

  const resetFilters = () => {
    setSelectedPillar("all");
    setSearch("");
  };

  return (
    <div className="space-y-8">
      {/* Contrôles de filtrage */}
      <div className="flex flex-col gap-4 rounded-lg border border-navy-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
        {/* Pills par pilier */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PILLAR_OPTIONS.map((opt) => {
            const count = counts[opt.key] ?? 0;
            const isActive = selectedPillar === opt.key;
            // Ne masquer les filtres spécifiques que s'il n'y a aucun programme dans cette catégorie
            if (opt.key !== "all" && count === 0) return null;

            return (
              <button
                type="button"
                key={opt.key}
                onClick={() => setSelectedPillar(opt.key)}
                aria-pressed={isActive}
                aria-controls="program-results"
                className={cn(
                  "relative z-0 inline-flex items-center gap-2 rounded-md border px-3.5 py-2 font-display text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
                  isActive
                    ? "border-[#102a43] text-white"
                    : "border-[#d7dee5] bg-white text-[#102a43] shadow-sm hover:border-[#102a43] hover:bg-[#eef5f0]",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="pillar-highlight"
                    className="absolute inset-0 -z-10 rounded-md bg-[#102a43]"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 32 }
                    }
                  />
                )}
                <span className="relative z-10">{opt.label}</span>
                <span
                  className={cn(
                    "relative z-10 rounded-full px-1.5 py-0.5 font-mono text-[0.625rem]",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#e5edf1] text-[#102a43]",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher un programme par nom ou description"
            aria-controls="program-results"
            placeholder="Rechercher un projet…"
            className="w-full rounded-md border border-navy-200 bg-white py-2.5 pl-9 pr-8 text-xs text-navy-900 placeholder:text-navy-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              aria-label="Effacer la recherche"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "programme trouvé" : "programmes trouvés"}
      </p>

      {/* Grille des résultats */}
      {filtered.length > 0 ? (
        <motion.div
          layout
          id="program-results"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((program) => (
              <motion.div
                key={program.id}
                layout
                initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ProgramCard program={program} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* État vide après filtrage */
        <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-[#d9e0e4] bg-white/80 p-12 text-center shadow-[0_16px_35px_rgba(15,23,42,0.03)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full hairline bg-navy-50 text-navy-400">
            <Filter size={20} strokeWidth={1.75} />
          </div>
          <h3 className="font-display mt-4 text-base font-semibold text-navy-900">
            Aucun projet ne correspond à vos critères
          </h3>
          <p className="mt-1 text-xs text-navy-500 max-w-sm">
            Essayez de modifier vos filtres ou votre recherche pour découvrir les programmes de la Fondation.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="btn-outline mt-5 text-xs py-2 px-4"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
