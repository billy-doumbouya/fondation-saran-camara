"use client";

import {
  Activity,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  ImageIcon,
  Mail,
  Newspaper,
  Plus,
  Quote,
  Users2,
  HeartHandshake,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import AdminStatCard from "@/components/admin/ui/AdminStatCard";
import AdminButton from "@/components/admin/ui/AdminButton";

export type DashboardStat = {
  icon: string;
  label: string;
  value: number;
  href: string;
  accent?: "primary" | "gold" | "navy" | "rose" | "sky";
  description?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
};

export type DashboardQuickAction = {
  icon: string;
  label: string;
  href: string;
};

interface DashboardOverviewProps {
  stats: DashboardStat[];
  quickActions: DashboardQuickAction[];
  contentTotal: number;
  donationsTotalGNF?: number;
  donationsCount?: number;
}

export default function DashboardOverview({
  stats,
  quickActions,
  contentTotal,
  donationsTotalGNF = 0,
  donationsCount = 0,
}: DashboardOverviewProps) {
  const formatGNF = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " GNF";
  };

  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case "newspaper":
        return <Newspaper size={22} />;
      case "calendar":
        return <CalendarDays size={22} />;
      case "graduation":
        return <GraduationCap size={22} />;
      case "image":
        return <ImageIcon size={22} />;
      case "mail":
        return <Mail size={22} />;
      case "send":
        return <Send size={22} />;
      case "quote":
        return <Quote size={22} />;
      case "users":
        return <Users2 size={22} />;
      case "heart":
        return <HeartHandshake size={22} />;
      default:
        return <Activity size={22} />;
    }
  };

  return (
    <div className="space-y-7">
      {/* Bannière Maîtresse Executive */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-[#13203c] to-primary-950 p-6 text-white shadow-xl shadow-navy-950/10 sm:p-8 md:p-10 border border-white/10"
      >
        {/* Cercles géométriques & Lueur ornementale */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[32px] border-primary-500/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 right-36 h-40 w-40 rounded-full bg-gold-400/15 blur-3xl"
        />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold text-gold-300 backdrop-blur-md">
              <Sparkles size={14} className="text-gold-400" />
              <span className="font-mono uppercase tracking-widest text-[0.6875rem]">
                Console de Pilotage Général · Conakry
              </span>
            </div>

            <h1 className="font-display mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              Bienvenue sur l&apos;espace de gestion{" "}
              <span className="bg-gradient-to-r from-gold-300 via-gold-200 to-primary-300 bg-clip-text text-transparent">
                FSCPE
              </span>
            </h1>

            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed max-w-xl">
              Supervisez les dons enregistrés, coordonnez la publication des
              articles et gérez les programmes d&apos;aide aux orphelins de Guinée.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-xs font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {contentTotal} ressources actives
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-mono text-gold-300 font-semibold">
                {donationsCount} contribution{donationsCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Raccourcis d'action rapide dans le Hero */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/news">
              <AdminButton
                variant="gold"
                size="sm"
                leftIcon={<Plus size={16} />}
              >
                Nouvel article
              </AdminButton>
            </Link>

            <Link href="/admin/donations">
              <AdminButton
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                leftIcon={<HeartHandshake size={16} />}
              >
                Voir les dons
              </AdminButton>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors border border-white/15"
            >
              <span>Site public</span>
              <ExternalLink size={13} className="text-slate-300" />
            </a>
          </div>
        </div>
      </motion.section>

      {/* Cartes KPI Principales (Dons & Modules Clés) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold uppercase tracking-wider text-navy-950 sm:text-lg">
            Indicateurs Stratégiques
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Mise à jour temps réel
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            label="Dons collectés"
            value={donationsTotalGNF > 0 ? formatGNF(donationsTotalGNF) : "0 GNF"}
            icon={<HeartHandshake size={22} />}
            accent="gold"
            href="/admin/donations"
            actionLabel="Transactions"
            description="Collecte via GeniusPay & Mobile Money"
          />

          <AdminStatCard
            label="Actualités & Blog"
            value={stats.find((s) => s.href === "/admin/news")?.value ?? 0}
            icon={<Newspaper size={22} />}
            accent="primary"
            href="/admin/news"
            actionLabel="Éditer"
            description="Publications et reportages terrain"
          />

          <AdminStatCard
            label="Agenda & Événements"
            value={stats.find((s) => s.href === "/admin/events")?.value ?? 0}
            icon={<CalendarDays size={22} />}
            accent="navy"
            href="/admin/events"
            actionLabel="Planifier"
            description="Cérémonies et distributions prévues"
          />

          <AdminStatCard
            label="Messages reçus"
            value={stats.find((s) => s.href === "/admin/messages")?.value ?? 0}
            icon={<Mail size={22} />}
            accent="rose"
            href="/admin/messages"
            actionLabel="Consulter"
            description="Sollicitations depuis le formulaire public"
          />
        </div>
      </section>

      {/* Grille secondaire des modules de contenu */}
      <section className="space-y-3">
        <h2 className="font-display text-base font-bold uppercase tracking-wider text-navy-950 sm:text-lg">
          Modules & Gouvernance
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats
            .filter(
              (s) =>
                s.href !== "/admin/news" &&
                s.href !== "/admin/events" &&
                s.href !== "/admin/messages"
            )
            .map((stat) => (
              <AdminStatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={getStatIcon(stat.icon)}
                accent={stat.accent || "navy"}
                href={stat.href}
                actionLabel="Gérer"
                description={stat.description}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
