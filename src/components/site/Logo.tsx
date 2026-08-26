"use client";

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

  const handleClick = () => {
    if (!enableAdminTrigger) return;
    const reached = registerTap();
    if (reached) router.push("/admin/login");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Fondation Saran Camara"
      className={cn(
        "group flex items-center gap-2.5 select-none",
        enableAdminTrigger ? "cursor-pointer" : "cursor-default",
        className
      )}
    >
      {/* logo */}
      <Image
        src="/icon.jpeg"
        width={44}
        height={44}
        priority
        alt="Fondation Saran Camara"
        className="select-none rounded-full object-cover"
      />
      {withWordmark && (
        <span className="flex flex-col items-start leading-none">
          <span className="font-display font-bold text-[15px] tracking-tight text-navy-800">
            <span className="text-navy-800">Saran</span> <span className="text-primary-600">Camara</span>
          </span>
          <span className="text-[10px] uppercase tracking-wide text-navy-500">
            Éducation &amp; Protection des Enfants
          </span>
        </span>
      )}
    </button>
  );
}
