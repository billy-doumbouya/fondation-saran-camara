"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sprout,
  Building2,
  HeartHandshake,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Clock,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineMilestone {
  id: string;
  year: string;
  badge: string;
  badgeType: "completed" | "current" | "future";
  title: string;
  location: string;
  text: string;
  highlight: string;
  stats?: string;
  icon: typeof Sprout;
}

const MILESTONES: TimelineMilestone[] = [
  {
    id: "fondation",
    year: "2026",
    badge: "Étape Fondatrice",
    badgeType: "completed",
    title: "Une conviction devient une fondation",
    location: "Kissosso, Conakry",
    text: "À Kissosso, Saran Camara transforme son engagement personnel pour l'éducation et la dignité des orphelins en une initiative collective pérenne et déclarée.",
    highlight: "Création officielle de la FSCPE",
    stats: "1 vision partagée",
    icon: Sprout,
  },
  {
    id: "gouvernance",
    year: "2026",
    badge: "Structuration",
    badgeType: "completed",
    title: "Un premier cercle fondateur",
    location: "Conakry, Guinée",
    text: "Dix membres engagés réunissent leurs compétences pour structurer les statuts, l'Assemblée Générale, le Conseil d'Administration et le Bureau Exécutif.",
    highlight: "Gouvernance transparente & solidaire",
    stats: "10 membres fondateurs",
    icon: Building2,
  },
  {
    id: "terrain",
    year: "Aujourd'hui",
    badge: "Action Continue",
    badgeType: "current",
    title: "Agir au plus près des enfants",
    location: "Région de Conakry & périphérie",
    text: "La Fondation déploie des kits scolaires, du tutorat, des consultations de suivi et un accompagnement psychosocial direct pour les enfants et leurs familles d'accueil.",
    highlight: "Soutien direct aux orphelins vulnérables",
    stats: "+500 bénéficiaires ciblés",
    icon: HeartHandshake,
  },
  {
    id: "horizon",
    year: "Horizon 2030",
    badge: "Perspectives",
    badgeType: "future",
    title: "Grandir avec les communautés",
    location: "Étendue nationale en Guinée",
    text: "Extension progressive des antennes régionales, création d'un centre d'accueil et d'apprentissage pilote, et renforcement des partenariats internationaux.",
    highlight: "Déploiement multisectoriel",
    stats: "Impact à grande échelle",
    icon: Sparkles,
  },
];

export default function AboutTimeline() {
  const [activeId, setActiveId] = useState<string>("terrain");
  const activeMilestone = MILESTONES.find((m) => m.id === activeId) || MILESTONES[2];

  return (
    <div className="relative">
      {/* Sélecteur interactif rapide (Navigation par jalons) */}
      <div className="mx-auto mb-10 flex max-w-2xl items-center justify-between rounded-2xl border border-navy-100 bg-white/80 p-1.5 shadow-sm backdrop-blur-md sm:mb-14">
        {MILESTONES.map((item, idx) => {
          const isActive = item.id === activeId;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-semibold transition-all duration-300 sm:gap-2 sm:py-2.5 sm:text-sm",
                isActive
                  ? "text-navy-950 font-bold shadow-sm"
                  : "text-navy-500 hover:text-navy-900 hover:bg-navy-50/60"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="activeTimelinePill"
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-primary-50 via-gold-50/80 to-primary-50/60 border border-primary-200/70"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon
                  size={15}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-primary-700" : "text-navy-400"
                  )}
                />
                <span className="hidden sm:inline font-mono">{item.year}</span>
                <span className="sm:hidden font-mono">#{idx + 1}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Vue desktop & grand écran : Frise chronologique avec barre lumineuse connectée */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Ligne directrice en arrière-plan */}
          <div className="absolute top-12 left-8 right-8 h-1 rounded-full bg-navy-100" />
          
          {/* Ligne animée lumineuse avec dégradé dynamique */}
          <motion.div
            className="absolute top-12 left-8 h-1 rounded-full bg-linear-to-r from-primary-600 via-gold-500 to-primary-700 shadow-sm shadow-primary-500/30"
            initial={{ width: "0%" }}
            whileInView={{ width: "calc(100% - 4rem)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Grille des 4 jalons avec puces interactives */}
          <div className="relative grid grid-cols-4 gap-6">
            {MILESTONES.map((item, index) => {
              const isSelected = item.id === activeId;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  onClick={() => setActiveId(item.id)}
                  className="group cursor-pointer"
                >
                  {/* Point d'ancrage / Puce lumineuse */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300 group-hover:scale-110",
                        isSelected
                          ? "border-primary-600 bg-primary-700 text-white shadow-lg shadow-primary-700/30 scale-105"
                          : "border-navy-200 bg-white text-navy-600 group-hover:border-primary-400 group-hover:text-primary-700 shadow-sm"
                      )}
                    >
                      <Icon size={22} strokeWidth={isSelected ? 2.2 : 1.8} />
                      
                      {/* Anneau pulsant pour l'étape active/en cours */}
                      {item.badgeType === "current" && (
                        <span className="absolute -inset-1 rounded-2xl border-2 border-primary-500/50 animate-ping opacity-75 pointer-events-none" />
                      )}
                    </div>

                    {/* Étiquette d'année sous le nœud */}
                    <span
                      className={cn(
                        "mt-3 inline-block font-mono text-xs font-bold tracking-wider transition-colors",
                        isSelected ? "text-primary-700 font-extrabold" : "text-navy-400"
                      )}
                    >
                      {item.year}
                    </span>
                  </div>

                  {/* Carte descriptive du jalon */}
                  <div
                    className={cn(
                      "mt-5 rounded-2xl p-5 transition-all duration-300 border text-left",
                      isSelected
                        ? "bg-white border-primary-300 shadow-xl shadow-primary-950/5 ring-1 ring-primary-400/40 -translate-y-1"
                        : "bg-white/70 border-navy-100 hover:bg-white hover:border-navy-200 hover:shadow-md hover:-translate-y-0.5"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
                          item.badgeType === "completed"
                            ? "bg-navy-50 text-navy-700"
                            : item.badgeType === "current"
                            ? "bg-primary-100 text-primary-800 ring-1 ring-primary-300"
                            : "bg-gold-50 text-gold-800"
                        )}
                      >
                        {item.badge}
                      </span>
                      <span className="font-mono text-[11px] text-navy-400 font-medium">
                        0{index + 1}
                      </span>
                    </div>

                    <h4 className="font-display mt-3 text-base font-bold text-navy-950 leading-snug line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="mt-2 text-xs leading-relaxed text-navy-600 line-clamp-3">
                      {item.text}
                    </p>

                    <div className="mt-4 pt-3 border-t border-navy-100 flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-navy-400">
                        <MapPin size={12} className="text-primary-600" />
                        <span className="truncate max-w-[120px]">{item.location}</span>
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-primary-700">
                        {item.stats}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Panneau focal interactif détaillé au clic */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMilestone.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-10 overflow-hidden rounded-3xl border border-primary-100 bg-linear-to-br from-primary-50/70 via-white to-gold-50/40 p-7 shadow-sm lg:p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-700 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-white">
                    <Clock size={13} />
                    {activeMilestone.year}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1 font-mono text-xs font-semibold text-navy-700 border border-navy-200">
                    <MapPin size={13} className="text-primary-600" />
                    {activeMilestone.location}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-gold-100/80 px-3 py-1 font-mono text-xs font-semibold text-gold-900">
                    <Sparkles size={13} className="text-gold-700" />
                    {activeMilestone.highlight}
                  </span>
                </div>

                <h3 className="font-display mt-3.5 text-2xl font-bold text-navy-950 sm:text-3xl">
                  {activeMilestone.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-navy-700">
                  {activeMilestone.text}
                </p>
              </div>

              <div className="shrink-0 flex flex-col gap-3 rounded-2xl bg-white p-5 border border-navy-100 shadow-sm sm:min-w-[240px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-navy-400">
                      Indicateur clé
                    </p>
                    <p className="font-display text-sm font-bold text-navy-900">
                      {activeMilestone.stats}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-primary-700 font-semibold pt-2 border-t border-navy-100">
                  <CheckCircle2 size={14} />
                  <span>Jalon inscrit dans les statuts FSCPE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Vue Mobile & Tablette : Chronogramme vertical moderne et tactile */}
      <div className="block lg:hidden">
        <div className="relative pl-6 sm:pl-8">
          {/* Ligne verticale continue */}
          <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-linear-to-b from-primary-600 via-gold-500 to-navy-200" />

          <div className="space-y-6 sm:space-y-8">
            {MILESTONES.map((item, index) => {
              const isSelected = item.id === activeId;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Puce d'ancrage sur la ligne verticale */}
                  <button
                    onClick={() => setActiveId(item.id)}
                    aria-label={`Étape ${item.year}: ${item.title}`}
                    className={cn(
                      "absolute -left-6 sm:-left-8 top-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                      isSelected
                        ? "border-primary-600 bg-primary-700 text-white scale-110 shadow-md shadow-primary-700/30"
                        : "border-navy-200 bg-white text-navy-600"
                    )}
                  >
                    <Icon size={14} strokeWidth={2} />
                  </button>

                  {/* Carte d'étape mobile */}
                  <div
                    onClick={() => setActiveId(item.id)}
                    className={cn(
                      "rounded-2xl border p-4 sm:p-5 transition-all duration-300 cursor-pointer",
                      isSelected
                        ? "bg-white border-primary-400 shadow-lg shadow-primary-950/5 ring-1 ring-primary-300/40"
                        : "bg-white/80 border-navy-100 hover:bg-white hover:border-navy-200"
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-navy-900 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                          {item.year}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold",
                            item.badgeType === "completed"
                              ? "bg-navy-50 text-navy-700"
                              : item.badgeType === "current"
                              ? "bg-primary-100 text-primary-800 ring-1 ring-primary-300"
                              : "bg-gold-50 text-gold-800"
                          )}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-navy-400">
                        Étape 0{index + 1}
                      </span>
                    </div>

                    <h4 className="font-display mt-2.5 text-base font-bold text-navy-950 sm:text-lg">
                      {item.title}
                    </h4>

                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-navy-600">
                      {item.text}
                    </p>

                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-navy-100 pt-3 text-[11px]">
                      <span className="flex items-center gap-1 text-navy-500">
                        <MapPin size={12} className="text-primary-600 shrink-0" />
                        <span>{item.location}</span>
                      </span>
                      <span className="font-mono font-semibold text-primary-700">
                        {item.stats}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
