import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-primary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-navy-500">{description}</p>}
    </div>
  );
}
