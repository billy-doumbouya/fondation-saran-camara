"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Bell, CircleHelp, ShieldCheck, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NotificationItem = {
  title: string;
  description: string;
  accent: "primary" | "gold" | "navy";
};

const HELP_MAP: Record<string, { title: string; text: string }> = {
  "/admin/dashboard": {
    title: "Vue d’ensemble",
    text: "Suivez rapidement les volumes de contenu, les actions de publication et l’activité globale de votre fondation.",
  },
  "/admin/news": {
    title: "Actualités",
    text: "Publiez des contenus, gérez les brouillons et vérifiez le bon référencement de vos articles.",
  },
  "/admin/events": {
    title: "Agenda",
    text: "Planifiez les événements, vérifiez les dates et assurez une visibilité claire sur votre calendrier.",
  },
  "/admin/programs": {
    title: "Programmes",
    text: "Mettez à jour les piliers d’action, les bénéficiaires et les contenus de présentation.",
  },
  "/admin/team": {
    title: "Équipe",
    text: "Ajustez la gouvernance, la structure et les profils affichés publiquement.",
  },
  "/admin/gallery": {
    title: "Galerie",
    text: "Ajoutez des visuels, organisez les médias et maintenez une image de marque cohérente.",
  },
  "/admin/testimonials": {
    title: "Témoignages",
    text: "Validez les retours, modifiez la note et mettez en avant les voix les plus représentatives.",
  },
};

export default function ProtectedAdminHeader() {
  const pathname = usePathname();
  const [helpOpen, setHelpOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    if (!notificationsOpen) return;

    let active = true;

    const loadNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const response = await fetch("/api/admin/notifications", { cache: "no-store" });
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

  const helpContent = HELP_MAP[pathname] ?? {
    title: "Espace d’administration",
    text: "Consultez les données, publiez des contenus et gardez les informations de votre fondation à jour.",
  };

  const hasNotifications = notifications.length > 0;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-100/80 bg-white/85 px-4 backdrop-blur-md sm:px-8 lg:px-10">
        <div className="pl-12 lg:pl-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">FSCPE / Administration</p>
          <p className="text-sm font-medium text-navy-700">Pilotage de la fondation</p>
        </div>
        <div className="flex items-center gap-2 text-navy-500">
          <button
            type="button"
            aria-label="Aide"
            onClick={() => {
              setNotificationsOpen(false);
              setHelpOpen((prev) => !prev);
            }}
            className="rounded-xl p-2 transition-colors hover:bg-navy-50 hover:text-navy-800"
          >
            <CircleHelp size={18} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setHelpOpen(false);
              setNotificationsOpen((prev) => !prev);
            }}
            className="relative rounded-xl p-2 transition-colors hover:bg-navy-50 hover:text-navy-800"
          >
            <Bell size={18} />
            {hasNotifications && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gold-500" />}
          </button>
          <span className="ml-1 hidden h-8 w-px bg-navy-100 sm:block" />
          <div className="hidden items-center gap-2.5 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">AD</span>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-navy-800">Administrateur</p>
              <p className="flex items-center gap-1 text-[10px] text-navy-400"><ShieldCheck size={11} /> Accès sécurisé</p>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {helpOpen && (
          <motion.aside
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-20 z-40 w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-navy-100 bg-white p-4 shadow-[0_20px_50px_rgba(16,26,46,0.12)] sm:right-8 lg:right-10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-primary-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
                  <Sparkles size={16} />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em]">Aide rapide</p>
              </div>
              <button type="button" onClick={() => setHelpOpen(false)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50" aria-label="Fermer l’aide">
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-primary-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-700">Section actuelle</p>
              <p className="mt-2 font-display text-lg font-semibold text-navy-900">{helpContent.title}</p>
              <p className="mt-2 text-sm leading-6 text-navy-600">{helpContent.text}</p>
            </div>

            <div className="mt-4 space-y-2 text-sm text-navy-600">
              <div className="flex items-center justify-between rounded-xl border border-navy-100 px-3 py-2">
                <span>Vérifier le contenu public</span>
                <ArrowUpRight size={15} className="text-primary-600" />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-navy-100 px-3 py-2">
                <span>Contrôler les publications</span>
                <ArrowUpRight size={15} className="text-primary-600" />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notificationsOpen && (
          <motion.aside
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-20 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-navy-100 bg-white p-4 shadow-[0_20px_50px_rgba(16,26,46,0.12)] sm:right-8 lg:right-10"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">Notifications</p>
              <button type="button" onClick={() => setNotificationsOpen(false)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50" aria-label="Fermer les notifications">
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {loadingNotifications && (
                <div className="rounded-xl border border-dashed border-navy-200 bg-navy-50 p-3 text-sm text-navy-500">
                  Chargement des alertes…
                </div>
              )}

              {!loadingNotifications && notifications.length === 0 && (
                <div className="rounded-xl border border-navy-100 bg-navy-50 p-3 text-sm text-navy-600">
                  Aucune notification en attente pour le moment.
                </div>
              )}

              {!loadingNotifications && notifications.map((item) => (
                <div key={`${item.title}-${item.description}`} className="rounded-xl border border-navy-100 p-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      item.accent === "primary" ? "bg-primary-500" : item.accent === "gold" ? "bg-gold-500" : "bg-navy-500"
                    }`} />
                    <p className="text-sm font-semibold text-navy-800">{item.title}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-navy-500">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
