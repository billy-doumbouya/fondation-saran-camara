import Link from "next/link";
import Image from "next/image";
import { GraduationCap, ShieldCheck, HandHeart, Users2 } from "lucide-react";
import type { Program } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

const PILLAR_META: Record<string, { label: string; icon: typeof GraduationCap; color: string }> = {
  education: { label: "Éducation", icon: GraduationCap, color: "bg-primary-100 text-primary-700" },
  protection: { label: "Protection", icon: ShieldCheck, color: "bg-navy-100 text-navy-700" },
  orphelins: { label: "Aide aux orphelins", icon: HandHeart, color: "bg-gold-100 text-gold-700" },
  social: { label: "Action sociale", icon: Users2, color: "bg-primary-100 text-primary-700" },
};

export default function ProgramCard({ program }: { program: Program }) {
  const meta = PILLAR_META[program.pillar ?? "education"] ?? PILLAR_META.education;
  const Icon = meta.icon;

  return (
    <Link
      href={`/programmes/${program.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden bg-primary-50">
        {program.coverImageUrl ? (
          <Image
            src={program.coverImageUrl}
            alt={program.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Icon size={40} className="text-primary-300" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", meta.color)}>
          <Icon size={12} />
          {meta.label}
        </span>
        <h3 className="font-display mt-3 text-lg font-semibold text-navy-900">{program.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-navy-500">{program.summary}</p>
        {program.beneficiariesCount ? (
          <p className="mt-3 text-xs font-medium text-primary-600">
            {program.beneficiariesCount}+ enfants bénéficiaires
          </p>
        ) : null}
      </div>
    </Link>
  );
}
