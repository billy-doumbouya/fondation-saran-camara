"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  GraduationCap,
  Users2,
  Image as ImageIcon,
  Quote,
  Mail,
  Send,
  ShieldCheck,
  ExternalLink,
  PlusCircle,
  LogOut,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface CommandItem {
  id: string;
  category: "Navigation" | "Actions rapides" | "Système";
  title: string;
  subtitle?: string;
  icon: typeof LayoutDashboard;
  perform: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigate = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [router, onClose]
  );

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: "nav-dash",
        category: "Navigation",
        title: "Tableau de bord général",
        subtitle: "Vue d'ensemble et indicateurs clés",
        icon: LayoutDashboard,
        perform: () => navigate("/admin/dashboard"),
        keywords: ["accueil", "home", "stats", "kpi"],
      },
      {
        id: "nav-news",
        category: "Navigation",
        title: "Actualités & Blog",
        subtitle: "Gérer et publier des articles",
        icon: Newspaper,
        perform: () => navigate("/admin/news"),
        keywords: ["blog", "article", "publication", "news"],
      },
      {
        id: "nav-events",
        category: "Navigation",
        title: "Agenda & Événements",
        subtitle: "Planifier des événements et cérémonies",
        icon: CalendarDays,
        perform: () => navigate("/admin/events"),
        keywords: ["agenda", "calendrier", "date"],
      },
      {
        id: "nav-programs",
        category: "Navigation",
        title: "Programmes & Projets",
        subtitle: "Piliers d'intervention et ODD",
        icon: GraduationCap,
        perform: () => navigate("/admin/programs"),
        keywords: ["projets", "orphelins", "ecoles", "programmes"],
      },
      {
        id: "nav-testimonials",
        category: "Navigation",
        title: "Témoignages & Avis",
        subtitle: "Avis vérifiés des partenaires et parrains",
        icon: Quote,
        perform: () => navigate("/admin/testimonials"),
        keywords: ["avis", "retours", "citations"],
      },
      {
        id: "nav-team",
        category: "Navigation",
        title: "Équipe & Gouvernance",
        subtitle: "Membres du conseil et direction",
        icon: Users2,
        perform: () => navigate("/admin/team"),
        keywords: ["membres", "conseil", "direction", "saran camara"],
      },
      {
        id: "nav-gallery",
        category: "Navigation",
        title: "Galerie photos humanitaire",
        subtitle: "Médiathèque et albums de terrain",
        icon: ImageIcon,
        perform: () => navigate("/admin/gallery"),
        keywords: ["photos", "images", "media", "albums"],
      },
      {
        id: "nav-messages",
        category: "Navigation",
        title: "Messages de contact",
        subtitle: "Courriers reçus depuis le formulaire public",
        icon: Mail,
        perform: () => navigate("/admin/messages"),
        keywords: ["contact", "emails", "inbox", "demandes"],
      },
      {
        id: "nav-newsletter",
        category: "Navigation",
        title: "Abonnés Newsletter",
        subtitle: "Diffusion et liste d'abonnés",
        icon: Send,
        perform: () => navigate("/admin/newsletter"),
        keywords: ["subscribers", "emails", "diffusion"],
      },
      {
        id: "nav-settings",
        category: "Navigation",
        title: "Paramètres & Sécurité",
        subtitle: "Configuration générale et accès",
        icon: ShieldCheck,
        perform: () => navigate("/admin/settings"),
        keywords: ["config", "mot de passe", "reglages"],
      },

      // Actions rapides
      {
        id: "act-new-post",
        category: "Actions rapides",
        title: "Rédiger un nouvel article",
        subtitle: "Ouvrir l'éditeur de publication",
        icon: PlusCircle,
        perform: () => navigate("/admin/news"),
        keywords: ["creer", "ajouter", "nouvel article"],
      },
      {
        id: "act-view-site",
        category: "Actions rapides",
        title: "Ouvrir le site public",
        subtitle: "Voir le rendu en direct pour les donateurs",
        icon: ExternalLink,
        perform: () => {
          onClose();
          window.open("/", "_blank");
        },
        keywords: ["site public", "front", "visite"],
      },

      // Système
      {
        id: "sys-logout",
        category: "Système",
        title: "Se déconnecter",
        subtitle: "Clôturer la session d'administration",
        icon: LogOut,
        perform: async () => {
          onClose();
          await fetch("/api/auth/logout", { method: "POST" });
          toast.success("Déconnexion réussie.");
          router.push("/admin/login");
          router.refresh();
        },
        keywords: ["quitter", "logout", "fermer"],
      },
    ],
    [navigate, onClose, router]
  );

  // Filtrage des commandes
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle?.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  }, [commands, query]);

  // Réinitialisation de l'index sélectionné lors du changement de query
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Navigation clavier
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filtered.length - 1) : prev - 1
        );
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].perform();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  // Réinitialiser la recherche à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:p-6 sm:pt-24">
          {/* Backdrop sombre */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm"
          />

          {/* Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-navy-950/20"
          >
            {/* Champ de recherche de la palette */}
            <div className="flex items-center border-b border-slate-100 px-4 py-3.5">
              <Search size={20} className="text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une section, action (ex: article, dons, équipe)..."
                className="w-full bg-transparent px-3 text-sm text-navy-950 placeholder:text-slate-400 focus:outline-none"
              />
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
                ESC
              </span>
            </div>

            {/* Liste des résultats */}
            <div className="max-h-[380px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  <Sparkles size={24} className="mx-auto mb-2 text-slate-300" />
                  Aucune commande ne correspond à « {query} ».
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => item.perform()}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-colors ${
                          isSelected
                            ? "bg-navy-950 text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isSelected
                                ? "bg-white/10 text-gold-400"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <p
                              className={`font-semibold ${
                                isSelected ? "text-white" : "text-navy-900"
                              }`}
                            >
                              {item.title}
                            </p>
                            {item.subtitle && (
                              <p
                                className={`text-[11px] ${
                                  isSelected
                                    ? "text-slate-300"
                                    : "text-slate-500"
                                }`}
                              >
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            isSelected
                              ? "bg-white/20 text-gold-300"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pied d'indication raccourcis */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span>
                  <strong className="font-mono">↑↓</strong> pour naviguer
                </span>
                <span>•</span>
                <span>
                  <strong className="font-mono">↵</strong> pour valider
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                FSCPE Console
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
