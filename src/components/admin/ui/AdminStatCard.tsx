import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  href?: string;
  actionLabel?: string;
  accent?: "primary" | "gold" | "navy" | "rose" | "sky";
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  className?: string;
}

const accentStyles = {
  primary: {
    iconBg: "bg-emerald-50 text-primary-700 border-primary-200/60",
    glow: "bg-primary-500/10",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  gold: {
    iconBg: "bg-gold-50 text-gold-800 border-gold-300/60",
    glow: "bg-gold-500/10",
    badge: "text-gold-800 bg-gold-50 border-gold-200",
  },
  navy: {
    iconBg: "bg-navy-50 text-navy-800 border-navy-200/60",
    glow: "bg-navy-500/10",
    badge: "text-navy-700 bg-navy-50 border-navy-200",
  },
  rose: {
    iconBg: "bg-rose-50 text-rose-700 border-rose-200/60",
    glow: "bg-rose-500/10",
    badge: "text-rose-700 bg-rose-50 border-rose-200",
  },
  sky: {
    iconBg: "bg-sky-50 text-sky-700 border-sky-200/60",
    glow: "bg-sky-500/10",
    badge: "text-sky-700 bg-sky-50 border-sky-200",
  },
};

export default function AdminStatCard({
  label,
  value,
  icon,
  description,
  href,
  actionLabel = "Gérer",
  accent = "primary",
  trend,
  className,
}: AdminStatCardProps) {
  const styles = accentStyles[accent];

  const CardWrapper = href ? Link : "div";

  return (
    <CardWrapper
      href={href ?? ""}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300",
        href && "hover:-translate-y-1 hover:border-gold-300 hover:shadow-lg hover:shadow-navy-950/5 cursor-pointer",
        className
      )}
    >
      {/* Lueur d'ambiance d'angle */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl transition-opacity duration-300 opacity-60 group-hover:opacity-100",
          styles.glow
        )}
      />

      {/* Rangée supérieure : Libellé + Icône */}
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl tabular-nums">
              {value}
            </span>
          </div>
        </div>

        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-xs transition-transform duration-300 group-hover:scale-110",
            styles.iconBg
          )}
        >
          {icon}
        </div>
      </div>

      {/* Rangée inférieure : Tendance ou Description + Lien */}
      <div className="relative mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        {trend ? (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-mono text-[11px] font-bold",
                trend.isPositive !== false
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              )}
            >
              {trend.isPositive !== false ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span>{trend.value}</span>
            </span>
            {trend.label && (
              <span className="text-slate-500 text-[11px]">{trend.label}</span>
            )}
          </div>
        ) : description ? (
          <span className="text-slate-500 text-xs truncate max-w-[200px]">
            {description}
          </span>
        ) : (
          <span className="text-slate-400 text-[11px]">FSCPE Console</span>
        )}

        {href && (
          <span className="inline-flex items-center gap-1 font-semibold text-primary-700 opacity-80 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
            <span>{actionLabel}</span>
            <ArrowUpRight size={13} />
          </span>
        )}
      </div>
    </CardWrapper>
  );
}
