"use client";

import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  Mail,
  Newspaper,
  Plus,
  Quote,
  Users2,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

const iconMap: Record<string, LucideIcon> = {
  newspaper: Newspaper,
  quote: Quote,
  users: Users2,
  image: ImageIcon,
  graduation: GraduationCap,
  calendar: CalendarDays,
  mail: Mail,
};

export type DashboardStat = {
  icon: string;
  label: string;
  value: number;
  href: string;
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
}

export default function DashboardOverview({ stats, quickActions, contentTotal }: DashboardOverviewProps) {
  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" as const },
    },
  };

  return (
    <div className="mx-auto max-w-7xl">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top_right,_rgba(76,181,100,0.24),_transparent_35%),linear-gradient(135deg,#101a2e_0%,#16233f_42%,#1a2e54_100%)] px-6 py-7 text-white shadow-[0_30px_80px_rgba(16,26,46,0.18)] sm:px-8 sm:py-8"
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-primary-400/20" />
        <div className="absolute -bottom-8 right-20 h-20 w-20 rounded-full bg-gold-400/15 blur-2xl" />
        <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]" />

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
          className="relative"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary-200">Espace administration</p>
          <h1 className="font-display mt-3 text-2xl font-semibold sm:text-3xl">Tableau de bord</h1>
          <p className="mt-3 max-w-xl text-sm text-navy-200">
            Une vue claire de l&apos;activité éditoriale et des ressources de la fondation.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-navy-200">
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 backdrop-blur-sm">
              <Activity size={14} className="text-primary-300" />
              Données synchronisées
            </span>
            <span className="text-navy-300">Dernière vue globale de vos contenus</span>
          </div>
        </motion.div>
      </motion.section>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_2fr]">
        <motion.section
          variants={item}
          initial="hidden"
          animate="show"
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-primary-100 bg-primary-50/70 p-5 shadow-[0_12px_30px_rgba(34,122,63,0.06)] sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-700">Portefeuille éditorial</p>
              <p className="font-display mt-3 text-4xl font-bold text-navy-900">{contentTotal}</p>
              <p className="mt-1 text-sm text-navy-600">ressources actuellement suivies</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm ring-1 ring-primary-100">
              <Activity size={20} />
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white ring-1 ring-primary-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
              className="h-full rounded-full bg-primary-600"
            />
          </div>
          <p className="mt-2 text-xs text-navy-500">Une base active pour raconter l&apos;impact de la fondation.</p>
        </motion.section>

        <motion.section
          variants={item}
          initial="hidden"
          animate="show"
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-navy-100 bg-white p-5 shadow-[0_12px_30px_rgba(16,26,46,0.04)] sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-600">Actions rapides</p>
              <h2 className="font-display mt-1 text-lg font-semibold text-navy-900">Faire avancer le contenu</h2>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
              <Plus size={18} />
            </div>
          </div>

          <motion.div variants={stagger} initial="hidden" animate="show" className="mt-5 grid gap-2 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = iconMap[action.icon] ?? Newspaper;

              return (
                <motion.div key={action.href} variants={item} whileHover={{ y: -3 }}>
                  <Link
                    href={action.href}
                    className="group flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-3 py-3 text-sm font-semibold text-navy-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                  >
                    <Icon size={17} className="shrink-0 text-primary-600" />
                    <span className="min-w-0 flex-1">{action.label}</span>
                    <ExternalLink size={14} className="shrink-0 text-navy-300 transition-colors group-hover:text-primary-600" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon] ?? Newspaper;

          return (
            <motion.div key={stat.label} variants={item} whileHover={{ y: -5 }}>
              <Link
                href={stat.href}
                className="group block rounded-2xl border border-navy-100 bg-white p-5 shadow-[0_10px_25px_rgba(16,26,46,0.03)] transition-all hover:border-primary-200 hover:shadow-[0_20px_40px_rgba(34,122,63,0.08)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  <Icon size={18} />
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <p className="font-display text-2xl font-bold text-navy-900">{stat.value}</p>
                  <ArrowUpRight size={16} className="mb-1 text-primary-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-1 text-sm text-navy-500">{stat.label}</p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
