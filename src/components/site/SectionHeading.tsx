import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Pour les sections sombres (navy), passe `light`. */
  tone?: "dark" | "light";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  const isLight = tone === "light";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span
            className={cn("h-px w-8", isLight ? "bg-gold-400/60" : "bg-primary-500/60")}
            aria-hidden
          />
          <span
            className={cn(
              "eyebrow",
              isLight && "eyebrow-light",
            )}
          >
            {eyebrow}
          </span>
          <span
            className={cn("h-px w-8", isLight ? "bg-gold-400/60" : "bg-primary-500/60")}
            aria-hidden
          />
        </div>
      )}
      <h2
        className={cn(
          "font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl",
          isLight ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-[1.0625rem]",
            isLight ? "text-navy-200" : "text-navy-500",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
