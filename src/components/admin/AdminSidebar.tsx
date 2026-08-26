"use client";

import Link from "next/link";
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
  X,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/site/Logo";
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
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useAdminUIStore();

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
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary-600 text-white" : "text-navy-600 hover:bg-primary-50"
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
          onClick={logout}
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
      <aside className="hidden w-64 shrink-0 border-r border-navy-100 bg-white lg:block">{content}</aside>

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
    </>
  );
}
