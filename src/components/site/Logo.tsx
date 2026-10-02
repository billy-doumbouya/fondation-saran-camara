"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLogoTapStore } from "@/lib/store";
import Image from "next/image";

interface LogoProps {
  className?: string;
  withWordmark?: boolean;
  /** When true, tapping the mark 5x within 2.5s reveals the admin login. */
  enableAdminTrigger?: boolean;
}

/**
 * Emblème vectoriel recréé pour le web (léger, net à toute résolution),
 * inspiré du logo fourni : mains protectrices, silhouette d'enfants,
 * croissants bicolores, étoile — sans reproduire le fichier brut.
 */
export default function Logo({ className, withWordmark = true, enableAdminTrigger = false }: LogoProps) {
  const router = useRouter();
  const registerTap = useLogoTapStore((s) => s.registerTap);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!enableAdminTrigger) return;
    const reached = registerTap();
    if (reached) {
      event.preventDefault();
      router.push("/admin/login");
    }
  };

  return (
   <div
  onClick={handleClick}
  className={cn(
    "group flex min-w-0 items-center gap-2.5 select-none",
    enableAdminTrigger ? "cursor-pointer" : "cursor-default",
    className
  )}
>
  <Image
    src="/icon.png"
    width={44}
    height={44}
    priority
    alt="Fondation Saran Camara"
    className="h-9 w-9 shrink-0 select-none rounded-full object-cover sm:h-11 sm:w-11"
  />
  {withWordmark && (
    <span className="flex min-w-0 flex-col items-start leading-none">
      <span className="max-w-full truncate font-display text-[15px] font-bold tracking-tight">
        <span className="text-navy-800">Saran</span>{" "}
        <span className="text-primary-600">Camara</span>
      </span>
      <span className="mt-1 hidden max-w-full truncate text-[10px] uppercase tracking-wide text-navy-500 min-[400px]:block">
        Éducation &amp; Protection des Enfants
      </span>
    </span>
  )}
</div>
  );
}
