import Link from "next/link";
import Image from "next/image";
import { GraduationCap, ShieldCheck, HandHeart, Users2, ArrowRight } from "lucide-react";
import type { Program } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

const PILLAR_META: Record<
  string,
  { label: string; icon: typeof GraduationCap; badgeCls: string }
> = {
  education: {
    label: "Éducation",
    icon: GraduationCap,
    badgeCls: "bg-primary-50 text-primary-700 border-primary-200/60",
  },
  protection: {
    label: "Protection",
    icon: ShieldCheck,
    badgeCls: "bg-navy-50 text-navy-700 border-navy-200/60",
  },
  orphelins: {
    label: "Aide aux orphelins",
    icon: HandHeart,
    badgeCls: "bg-gold-50 text-gold-700 border-gold-200/60",
  },
  social: {
    label: "Action sociale",
    icon: Users2,
    badgeCls: "bg-primary-50 text-primary-700 border-primary-200/60",
  },
};

export default function ProgramCard({ program }: { program: Program }) {
  const meta = PILLAR_META[program.pillar ?? "education"] ?? PILLAR_META.education;
  const Icon = meta.icon;

  return (
    <Link
      href={`/programmes/${program.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-navy-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
    >
      {/* Accent top */}
      <span className="absolute inset-x-0 top-0 z-10 h-0.5 bg-gold-500" aria-hidden />

      {/* Cover image */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-navy-50">
        {program.coverImageUrl ? (
          <Image
            src={program.coverImageUrl}
            alt={program.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-navy-50 to-primary-50/50">
            <Icon size={44} className="text-primary-300" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-wider border",
              meta.badgeCls,
            )}
          >
            <Icon size={13} strokeWidth={2} />
            {meta.label}
          </span>
          {program.beneficiariesCount ? (
            <span className="font-mono text-[0.625rem] text-navy-400 tabular-nums">
              {program.beneficiariesCount.toLocaleString("fr-FR")}+ bénéficiaires
            </span>
          ) : null}
        </div>

        <h3 className="font-display mt-4 text-xl font-bold leading-snug text-navy-900 transition-colors duration-200 group-hover:text-primary-700">
          {program.title}
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-600">
          {program.summary}
        </p>

        {/* Card footer */}
        <div className="mt-6 flex items-center justify-between border-t border-[#edf0f3] pt-4 text-xs font-semibold text-primary-700">
          <span className="font-display">En savoir plus</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
