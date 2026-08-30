"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Newspaper,
  Quote,
  Users2,
  Image as ImageIcon,
  GraduationCap,
  CalendarDays,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/site/Logo";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { useAdminUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/news", label: "Actualités / Blog", icon: Newspaper },
  { href: "/admin/testimonials", label: "Témoignages", icon: Quote },
  { href: "/admin/team", label: "Équipe / Gouvernance", icon: Users2 },
  { href: "/admin/gallery", label: "Galerie photos", icon: ImageIcon },
  { href: "/admin/programs", label: "Programmes / Projets", icon: GraduationCap },
  { href: "/admin/events", label: "Agenda / Événements", icon: CalendarDays },
  { href: "/admin/messages", label: "Messages reçus", icon: LogOut },
  { href: "/admin/settings", label: "Paramètres", icon: ShieldCheck },
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
    <div className="flex h-full flex-col">
      <div className="border-b border-navy-100 p-5">
        <Logo />
        <p className="mt-4 rounded-xl bg-primary-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-700">Console de pilotage</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                active ? "bg-primary-600 text-white shadow-md shadow-primary-600/20" : "text-navy-600 hover:translate-x-0.5 hover:bg-primary-50"
              )}
            >
              <link.icon size={17} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-navy-100 p-3">
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen w-64 shrink-0 border-r border-navy-100/80 bg-white/95 shadow-[8px_0_30px_rgba(16,26,46,0.04)] backdrop-blur-md lg:block">
        <div className="h-full overflow-y-auto">{content}</div>
      </aside>

      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-navy-100 bg-white p-2 shadow-sm lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25 }}
              className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-2xl lg:hidden"
            >
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-3 rounded-lg p-1.5 text-navy-500"
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
