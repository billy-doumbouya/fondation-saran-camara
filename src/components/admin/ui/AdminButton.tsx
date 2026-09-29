import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminButtonVariant =
  | "primary"
  | "gold"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "dark";

export type AdminButtonSize = "xs" | "sm" | "md" | "lg";

export interface AdminButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<AdminButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white shadow-md shadow-primary-700/20 hover:from-primary-600 hover:to-primary-700 border border-primary-500/30 active:scale-[0.98]",
  gold:
    "bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold shadow-md shadow-gold-500/20 hover:from-gold-400 hover:to-gold-500 border border-gold-400/50 active:scale-[0.98]",
  secondary:
    "bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200/80 active:scale-[0.98]",
  outline:
    "bg-white text-navy-800 border border-slate-200 hover:border-gold-400 hover:bg-slate-50 hover:text-navy-950 shadow-xs active:scale-[0.98]",
  ghost:
    "bg-transparent text-navy-700 hover:bg-navy-50/80 hover:text-navy-950",
  destructive:
    "bg-rose-600 text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 border border-rose-500 active:scale-[0.98]",
  dark:
    "bg-navy-950 text-white shadow-md shadow-navy-950/20 hover:bg-navy-900 border border-navy-800 active:scale-[0.98]",
};

const sizeStyles: Record<AdminButtonSize, string> = {
  xs: "h-7 px-2.5 text-[11px] gap-1.5 rounded-lg",
  sm: "h-9 px-3.5 text-xs gap-2 rounded-xl",
  md: "h-10 px-4 text-sm gap-2.5 rounded-xl",
  lg: "h-12 px-6 text-base gap-3 rounded-2xl",
};

const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:pointer-events-none disabled:opacity-50 select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

AdminButton.displayName = "AdminButton";

export default AdminButton;
