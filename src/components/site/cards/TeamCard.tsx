import Image from "next/image";
import { UserRound } from "lucide-react";
import type { TeamMember } from "@/lib/db/schema";

interface TeamCardProps {
  member: TeamMember;
  /** Numéro optionnel pour numérotation. */
  index?: number;
}

export default function TeamCard({ member, index }: TeamCardProps) {
  return (
    <article className="group relative flex h-full gap-4 overflow-hidden hairline bg-white rounded-lg p-5 transition-all duration-300 hover:hairline-strong hover:-translate-y-0.5">
      {/* Accent bar top */}
      <span className="absolute inset-x-0 top-0 h-0.5 bg-gold-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />

      {/* Portrait — carré, pas rond */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-navy-50 hairline">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.fullName}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <UserRound size={28} className="text-navy-300" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-tight text-navy-900">
            {member.fullName}
          </h3>
          {index != null && (
            <span className="font-mono text-[0.625rem] uppercase tracking-widest text-navy-300 shrink-0">
              0{index + 1}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary-600">
          {member.role}
        </p>
        {member.bio && (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-navy-500">
            {member.bio}
          </p>
        )}
      </div>
    </article>
  );
}