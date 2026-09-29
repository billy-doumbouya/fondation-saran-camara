"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  HeartHandshake,
  Newspaper,
  CalendarDays,
  GraduationCap,
  ImageIcon,
  Mail,
  Send,
  Quote,
  Users2,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/site/Logo";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { useAdminUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface NavGroup {
  label: string;
  items: {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Pilotage Stratégique",
    items: [
      { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
      { href: "/admin/donations", label: "Dons & Finances", icon: HeartHandshake },
    ],
  },
  {
    label: "Contenu & Projets",
    items: [
      { href: "/admin/news", label: "Actualités & Blog", icon: Newspaper },
      { href: "/admin/events", label: "Agenda & Événements", icon: CalendarDays },
      { href: "/admin/programs", label: "Programmes & ODD", icon: GraduationCap },
      { href: "/admin/gallery", label: "Galerie photos", icon: ImageIcon },
    ],
  },
  {
    label: "Communauté & Échanges",
    items: [
      { href: "/admin/messages", label: "Messages reçus", icon: Mail },
      { href: "/admin/newsletter", label: "Newsletter", icon: Send },
      { href: "/admin/testimonials", label: "Témoignages", icon: Quote },
      { href: "/admin/team", label: "Équipe & Conseil", icon: Users2 },
    ],
  },
  {
    label: "Configuration",
    items: [
      { href: "/admin/settings", label: "Paramètres & Accès", icon: ShieldCheck },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useAdminUIStore();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Déconnecté.");
    router.push("/admin/login");
    router.refresh();
  };

  const content = (
    <div className="flex h-full flex-col bg-[#0b1220] text-slate-300">
      {/* En-tête de la Sidebar avec Logo FSCPE */}
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between">
          <div className="brightness-125 contrast-125">
            <Logo />
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-white/5 px-3 py-1.5 border border-white/5 text-[10px]">
          <span className="font-mono uppercase tracking-widest text-gold-400 font-semibold">
            Console Exécutive
          </span>
          <span className="text-slate-400 font-mono">Conakry (GMT)</span>
        </div>
      </div>

      {/* Groupes de navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-white/10">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 select-none">
              {group.label}
            </p>

            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" &&
                    pathname.startsWith(item.href + "/"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
                      active
                        ? "bg-gradient-to-r from-primary-700 to-primary-800 text-white font-semibold shadow-md shadow-primary-900/40 ring-1 ring-primary-500/40"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={16}
                        className={cn(
                          "transition-transform duration-200 group-hover:scale-110",
                          active
                            ? "text-gold-300"
                            : "text-slate-400 group-hover:text-slate-200"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="rounded-full bg-gold-400/20 px-2 py-0.5 font-mono text-[10px] font-bold text-gold-300 border border-gold-400/30">
                        {item.badge}
                      </span>
                    )}

                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-gold-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Raccourci vers le site public & Profil */}
      <div className="border-t border-white/10 p-3 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-gold-400" />
            <span>Voir le site public</span>
          </div>
          <ExternalLink size={13} className="text-slate-400" />
        </a>

        {/* Profil utilisateur & Bouton Déconnexion */}
        <div className="flex items-center justify-between rounded-xl bg-black/20 p-2.5 border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-amber-600 font-bold text-navy-950 text-xs shadow-xs">
              SC
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                Mme Saran Camara
              </p>
              <p className="truncate text-[10px] text-slate-400">
                Direction / Admin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
            title="Se déconnecter"
            aria-label="Déconnexion"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop fixe */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 shrink-0 border-r border-navy-950/20 shadow-2xl z-40 lg:block">
        <div className="h-full overflow-hidden">{content}</div>
      </aside>

      {/* Bouton Trigger Mobile flottant */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-3.5 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/90 p-2 text-navy-900 shadow-md backdrop-blur-md lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>

      {/* Drawer Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-xs lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="fixed left-0 top-0 z-50 h-full w-64 shadow-2xl lg:hidden"
            >
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <ConfirmationModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={logout}
        title="Se déconnecter ?"
        description="Votre session d’administration sera fermée sur cet appareil."
        confirmLabel="Se déconnecter"
      />
    </>
  );
}
