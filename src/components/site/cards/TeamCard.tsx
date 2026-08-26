import Image from "next/image";
import { UserRound } from "lucide-react";
import type { TeamMember } from "@/lib/db/schema";

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="group flex flex-col items-center rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-primary-100 ring-4 ring-primary-50">
        {member.photoUrl ? (
          <Image src={member.photoUrl} alt={member.fullName} fill className="object-cover" />
        ) : (
          <UserRound className="m-auto mt-6 text-primary-500" size={36} />
        )}
      </div>
      <h3 className="font-display mt-4 text-base font-semibold text-navy-900">{member.fullName}</h3>
      <p className="text-sm font-medium text-primary-600">{member.role}</p>
      {member.bio && <p className="mt-2 line-clamp-3 text-xs text-navy-500">{member.bio}</p>}
    </div>
  );
}
