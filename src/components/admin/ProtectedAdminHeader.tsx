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
  ChevronRight,
  Inbox,
  Calendar,
  FileText,
  HeartHandshake,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import CommandPalette from "@/components/admin/ui/CommandPalette";

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  accent: "primary" | "gold" | "navy";
  href: string;
  count?: number;
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
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [totalNotificationCount, setTotalNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  // Charger les notifications depuis la base de données
  const loadNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      const res = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        setNotifications(items);
        setTotalNotificationCount(data.totalCount || items.length);
      }
    } catch {
      // Ignorer silencieusement si hors-ligne
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  // Chargement initial + rafraîchissement périodique (toutes les 90s)
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 90000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Fermeture automatique lors du changement de route (navigation)
  useEffect(() => {
    setNotificationsOpen(false);
    setHelpOpen(false);
  }, [pathname]);

  // Fermeture automatique sur touche Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setNotificationsOpen(false);
        setHelpOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentBreadcrumb = BREADCRUMB_MAP[pathname] ?? {
    category: "FSCPE Console",
    title: "Administration",
  };

  const helpContent = HELP_MAP[pathname] ?? {
    title: "Espace d’administration",
    text: "Consultez les données, publiez des contenus et gardez les informations de la fondation à jour.",
  };

  const hasNotifications = notifications.length > 0;

  const handleNotificationClick = (href: string) => {
    setNotificationsOpen(false);
    router.push(href);
  };

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

        {/* Centre / Droite : Command Palette + Status + Actions */}
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

          {/* Cloche de Notifications connectée à la base de données */}
          <button
            type="button"
            aria-label="Notifications administrateur"
            onClick={() => {
              setHelpOpen(false);
              setNotificationsOpen((prev) => !prev);
              if (!notificationsOpen) loadNotifications();
            }}
            className={`relative rounded-xl p-2 transition-colors ${
              notificationsOpen
                ? "bg-primary-50 text-primary-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-navy-900"
            }`}
          >
            <Bell size={18} />
            {hasNotifications && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white shadow-xs ring-2 ring-white">
                {totalNotificationCount > 9 ? "9+" : totalNotificationCount}
              </span>
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

      {/* Volet Aide rapide avec fermeture automatique */}
      <AnimatePresence>
        {helpOpen && (
          <>
            {/* Backdrop transparent pour auto-fermeture au clic extérieur */}
            <div
              onClick={() => setHelpOpen(false)}
              className="fixed inset-0 z-35 bg-transparent"
              aria-hidden="true"
            />
            <motion.aside
              ref={helpRef}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-x-4 top-18 z-40 sm:absolute sm:inset-x-auto sm:right-6 sm:top-20 w-auto sm:w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
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
          </>
        )}
      </AnimatePresence>

      {/* Volet Notifications connecté à la DB avec fermeture automatique & responsive */}
      <AnimatePresence>
        {notificationsOpen && (
          <>
            {/* Backdrop pour auto-fermeture immédiate au clic extérieur */}
            <div
              onClick={() => setNotificationsOpen(false)}
              className="fixed inset-0 z-35 bg-black/10 backdrop-blur-[1px]"
              aria-hidden="true"
            />

            <motion.aside
              ref={notifRef}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-x-3 top-18 z-40 sm:absolute sm:inset-x-auto sm:right-6 sm:top-20 w-auto sm:w-[24rem] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                    <Bell size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy-950">
                      Notifications
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Synchronisé avec la base de données
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  aria-label="Fermer les notifications"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3.5 space-y-2.5">
                {loadingNotifications && (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-xs text-slate-500">
                    <span className="inline-block animate-pulse">
                      Vérification des alertes en direct...
                    </span>
                  </div>
                )}

                {!loadingNotifications && notifications.length === 0 && (
                  <div className="rounded-2xl border border-slate-100 bg-emerald-50/40 p-6 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
                      <ShieldCheck size={20} />
                    </div>
                    <p className="text-xs font-semibold text-emerald-900">
                      Tout est à jour !
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Aucun message non lu ou action requise pour le moment.
                    </p>
                  </div>
                )}

                {!loadingNotifications &&
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNotificationClick(item.href)}
                      className="group flex w-full items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 text-left transition-all hover:border-primary-400 hover:bg-primary-50/20 hover:shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 flex h-2 w-2 shrink-0 rounded-full ${
                            item.accent === "primary"
                              ? "bg-primary-600 ring-4 ring-primary-100"
                              : item.accent === "gold"
                              ? "bg-amber-500 ring-4 ring-amber-100"
                              : "bg-navy-600 ring-4 ring-navy-100"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-bold text-navy-950 group-hover:text-primary-800 transition-colors">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={15}
                        className="shrink-0 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all mt-1"
                      />
                    </button>
                  ))}
              </div>

              {notifications.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{totalNotificationCount} alerte(s) active(s)</span>
                  <button
                    type="button"
                    onClick={() => {
                      loadNotifications();
                    }}
                    className="font-semibold text-primary-700 hover:underline"
                  >
                    Actualiser
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
