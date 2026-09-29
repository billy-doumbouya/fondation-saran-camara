"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Bell,
  CircleHelp,
  ShieldCheck,
  Sparkles,
  X,
  Search,
  ExternalLink,
  Plus,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CommandPalette from "@/components/admin/ui/CommandPalette";

type NotificationItem = {
  title: string;
  description: string;
  accent: "primary" | "gold" | "navy";
};

const BREADCRUMB_MAP: Record<string, { category: string; title: string }> = {
  "/admin/dashboard": { category: "Pilotage", title: "Tableau de bord" },
  "/admin/donations": { category: "Pilotage", title: "Dons & Finances" },
  "/admin/news": { category: "Contenu", title: "Actualités & Blog" },
  "/admin/events": { category: "Contenu", title: "Agenda & Événements" },
  "/admin/programs": { category: "Contenu", title: "Programmes & Projets" },
  "/admin/gallery": { category: "Contenu", title: "Galerie photos" },
  "/admin/messages": { category: "Communauté", title: "Messages de contact" },
  "/admin/newsletter": { category: "Communauté", title: "Abonnés Newsletter" },
  "/admin/testimonials": { category: "Communauté", title: "Témoignages & Avis" },
  "/admin/team": { category: "Communauté", title: "Équipe & Gouvernance" },
  "/admin/settings": { category: "Système", title: "Paramètres & Sécurité" },
};

const HELP_MAP: Record<string, { title: string; text: string }> = {
  "/admin/dashboard": {
    title: "Vue d’ensemble",
    text: "Suivez les volumes de contenu, les dons enregistrés, les messages en attente et l’activité globale de la fondation.",
  },
  "/admin/donations": {
    title: "Dons & Finances",
    text: "Consultez l'historique des contributions reçues par Orange Money, MTN, carte bancaire ou virement, et filtrez les statuts.",
  },
  "/admin/news": {
    title: "Actualités & Blog",
    text: "Rédigez des articles, gérez les brouillons et vérifiez les images de couverture pour le site public.",
  },
  "/admin/events": {
    title: "Agenda & Événements",
    text: "Planifiez les cérémonies, distributions et dates clés de la FSCPE pour informer la communauté.",
  },
  "/admin/programs": {
    title: "Programmes & Projets",
    text: "Ajustez les piliers humanitaires (Éducation, Santé, Orphelins, Urgences) et le nombre d'enfants bénéficiaires.",
  },
  "/admin/gallery": {
    title: "Galerie Médias",
    text: "Téléversez des photos de haute qualité des actions sur le terrain avec Cloudinary.",
  },
  "/admin/messages": {
    title: "Messages de contact",
    text: "Traitez les sollicitations de donateurs, parrains et bénévoles envoyées via le formulaire public.",
  },
  "/admin/settings": {
    title: "Paramètres & Sécurité",
    text: "Gérez la configuration du site, les coordonnées officielles et votre mot de passe d'administration.",
  },
};

export default function ProtectedAdminHeader() {
  const pathname = usePathname();
  const [helpOpen, setHelpOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Écouteur global pour ouvrir la Command Palette via Ctrl+K ou Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!notificationsOpen) return;

    let active = true;

    const loadNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const response = await fetch("/api/admin/notifications", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Impossible de charger les notifications");
        }

        const payload = await response.json();
        const items = Array.isArray(payload.items) ? payload.items : [];
        if (active) setNotifications(items);
      } catch {
        if (active) setNotifications([]);
      } finally {
        if (active) setLoadingNotifications(false);
      }
    };

    void loadNotifications();
    return () => {
      active = false;
    };
  }, [notificationsOpen]);

  const currentBreadcrumb = BREADCRUMB_MAP[pathname] ?? {
    category: "FSCPE Console",
    title: "Administration",
  };

  const helpContent = HELP_MAP[pathname] ?? {
    title: "Espace d’administration",
    text: "Consultez les données, publiez des contenus et gardez les informations de la fondation à jour.",
  };

  const hasNotifications = notifications.length > 0;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-8 lg:px-10">
        {/* Titre & Fil d'Ariane de la section */}
        <div className="pl-12 lg:pl-0 flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-700">
                {currentBreadcrumb.category}
              </span>
              <span className="text-slate-300 text-xs">/</span>
              <h2 className="font-display text-sm font-bold text-navy-950 sm:text-base">
                {currentBreadcrumb.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Centre / Droite : Command Palette trigger + Status + Actions */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-600">
          {/* Bouton de recherche globale Command Palette (Ctrl+K) */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 hover:border-gold-400 hover:bg-white hover:text-navy-900 transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-400 group-hover:text-gold-600 transition-colors" />
              <span>Rechercher...</span>
            </div>
            <kbd className="flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-400 group-hover:border-gold-300">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </button>

          {/* Indicateur de connectivité Neon Database */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px]">Neon DB Sync</span>
          </div>

          <span className="hidden h-5 w-px bg-slate-200 sm:block" />

          {/* Aide contextuelle */}
          <button
            type="button"
            aria-label="Aide"
            onClick={() => {
              setNotificationsOpen(false);
              setHelpOpen((prev) => !prev);
            }}
            className={`rounded-xl p-2 transition-colors ${
              helpOpen
                ? "bg-primary-50 text-primary-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-navy-900"
            }`}
          >
            <CircleHelp size={18} />
          </button>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setHelpOpen(false);
              setNotificationsOpen((prev) => !prev);
            }}
            className={`relative rounded-xl p-2 transition-colors ${
              notificationsOpen
                ? "bg-primary-50 text-primary-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-navy-900"
            }`}
          >
            <Bell size={18} />
            {hasNotifications && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold-500 ring-2 ring-white" />
            )}
          </button>

          <span className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* Utilisateur connecté */}
          <div className="hidden items-center gap-2.5 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-700 to-primary-900 text-xs font-bold text-white shadow-xs">
              SC
            </span>
            <div className="leading-tight">
              <p className="text-xs font-bold text-navy-950">Mme Saran Camara</p>
              <p className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                <ShieldCheck size={11} /> Direction Générale
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Palette de commande modale (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Volet Aide rapide */}
      <AnimatePresence>
        {helpOpen && (
          <motion.aside
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute right-4 top-20 z-40 w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:right-8 lg:right-10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-primary-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
                  <Sparkles size={16} />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em]">
                  Aide & Recommandations
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer l’aide"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3.5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-700">
                Section active
              </p>
              <p className="mt-1 font-display text-base font-bold text-navy-950">
                {helpContent.title}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {helpContent.text}
              </p>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 font-medium text-slate-700 hover:border-gold-400 hover:bg-slate-50 transition-colors"
              >
                <span>Aperçu du site public</span>
                <ArrowUpRight size={14} className="text-primary-700" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setHelpOpen(false);
                  setCommandPaletteOpen(true);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 font-medium text-slate-700 hover:border-gold-400 hover:bg-slate-50 transition-colors text-left"
              >
                <span>Recherche globale (Ctrl+K)</span>
                <Search size={14} className="text-primary-700" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Volet Notifications */}
      <AnimatePresence>
        {notificationsOpen && (
          <motion.aside
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute right-4 top-20 z-40 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:right-8 lg:right-10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-primary-700" />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy-950">
                  Centre de notifications
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer les notifications"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {loadingNotifications && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                  Chargement des alertes en cours…
                </div>
              )}

              {!loadingNotifications && notifications.length === 0 && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center text-xs text-slate-500">
                  Aucune alerte prioritaire en attente. Tout est sous contrôle !
                </div>
              )}

              {!loadingNotifications &&
                notifications.map((item) => (
                  <div
                    key={`${item.title}-${item.description}`}
                    className="rounded-xl border border-slate-200 p-3 hover:border-gold-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.accent === "primary"
                            ? "bg-primary-600"
                            : item.accent === "gold"
                            ? "bg-gold-500"
                            : "bg-navy-600"
                        }`}
                      />
                      <p className="text-xs font-bold text-navy-950">
                        {item.title}
                      </p>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>
                ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
