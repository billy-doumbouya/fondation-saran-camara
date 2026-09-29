import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AdminBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "gold"
  | "neutral";

export type AdminBadgeSize = "xs" | "sm" | "md";

interface AdminBadgeProps {
  children: ReactNode;
  variant?: AdminBadgeVariant;
  size?: AdminBadgeSize;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<AdminBadgeVariant, { bg: string; dot: string }> = {
  success: {
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  warning: {
    bg: "bg-amber-50 text-amber-900 border-amber-200/80",
    dot: "bg-amber-500",
  },
  gold: {
    bg: "bg-gold-50 text-gold-950 border-gold-300/80",
    dot: "bg-gold-500",
  },
  danger: {
    bg: "bg-rose-50 text-rose-800 border-rose-200/80",
    dot: "bg-rose-500",
  },
  info: {
    bg: "bg-sky-50 text-sky-800 border-sky-200/80",
    dot: "bg-sky-500",
  },
  neutral: {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  },
};

const sizeStyles: Record<AdminBadgeSize, string> = {
  xs: "px-2 py-0.5 text-[10px] font-semibold gap-1",
  sm: "px-2.5 py-0.5 text-xs font-semibold gap-1.5",
  md: "px-3 py-1 text-xs font-semibold gap-2",
};

export default function AdminBadge({
  children,
  variant = "neutral",
  size = "sm",
  dot = false,
  pulse = false,
  className,
}: AdminBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border tracking-wide transition-colors",
        styles.bg,
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className="relative flex h-2 w-2 shrink-0">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                styles.dot
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              styles.dot
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
