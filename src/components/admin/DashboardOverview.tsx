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
      {/* Bannière Maîtresse Executive - Contraste & Lisibilité Maximale */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-[#0b1329] p-6 text-white shadow-xl shadow-navy-950/20 sm:p-8 md:p-10 border border-slate-700/60"
      >
        {/* Motif géométrique discret d'arrière-plan sans flou perturbateur */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[24px] border-emerald-500/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-emerald-950/30 via-transparent to-transparent pointer-events-none"
        />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/15 px-3.5 py-1 text-xs font-semibold text-gold-300">
              <Sparkles size={14} className="text-gold-400" />
              <span className="font-mono uppercase tracking-widest text-[0.6875rem]">
                Console de Pilotage Général · Conakry
              </span>
            </div>

            <h1 className="font-display mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl leading-tight">
              Bienvenue sur l&apos;espace de gestion{" "}
              <span className="text-gold-400 font-black">
                FSCPE
              </span>
            </h1>

            <p className="mt-2.5 text-sm sm:text-base text-slate-100 font-normal leading-relaxed max-w-xl">
              Supervisez les dons enregistrés, coordonnez la publication des
              articles et gérez les programmes d&apos;aide aux orphelins de Guinée.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-white font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {contentTotal} ressources actives
              </span>
              <span className="text-slate-400">•</span>
              <span className="rounded-xl border border-gold-400/30 bg-gold-400/15 px-3 py-1.5 font-mono text-gold-300 font-bold">
                {donationsCount} contribution{donationsCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Raccourcis d'action rapide dans le Hero avec contraste élevé */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/news">
              <AdminButton
                variant="gold"
                size="sm"
                className="font-bold shadow-md hover:brightness-110"
                leftIcon={<Plus size={16} />}
              >
                Nouvel article
              </AdminButton>
            </Link>

            <Link href="/admin/donations">
              <AdminButton
                variant="outline"
                size="sm"
                className="bg-white/15 border-white/30 text-white hover:bg-white/25 hover:text-white font-medium shadow-sm"
                leftIcon={<HeartHandshake size={16} />}
              >
                Voir les dons
              </AdminButton>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/25 transition-colors border border-white/25 shadow-sm"
            >
              <span>Site public</span>
              <ExternalLink size={13} className="text-slate-200" />
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
