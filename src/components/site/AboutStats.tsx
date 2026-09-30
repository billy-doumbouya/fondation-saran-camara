"use client";

import { motion } from "motion/react";
import { Calendar, ShieldCheck, Users, MapPin, Sparkles } from "lucide-react";

interface AboutStatsProps {
  stats: {
    value: string;
    label: string;
    description?: string;
  }[];
}

const STAT_ICONS = [Calendar, ShieldCheck, Users, MapPin];

export default function AboutStats({ stats }: AboutStatsProps) {
  return (
    <section
      aria-label="Repères de la Fondation"
      className="relative border-b border-navy-100 bg-linear-to-b from-white via-background to-white py-10 sm:py-14"
    >
      <div className="container-app">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = STAT_ICONS[idx % STAT_ICONS.length] || Sparkles;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-2xl border border-navy-100/80 bg-white/90 p-5 shadow-xs transition-all duration-300 hover:border-primary-300/80 hover:bg-white hover:shadow-lg hover:shadow-primary-950/5 sm:p-6"
              >
                {/* Lueur d'accentuation discrète en haut de carte */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50/80 text-primary-700 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white">
                    <Icon size={19} strokeWidth={2} />
                  </span>
                  <span className="font-mono text-[10px] font-semibold tracking-wider text-navy-400 uppercase">
                    0{idx + 1}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="font-display text-3xl font-extrabold tabular-nums tracking-tight text-navy-950 sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-xs sm:text-sm font-medium leading-snug text-navy-600">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
