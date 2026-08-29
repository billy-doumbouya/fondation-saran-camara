"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Share2, Globe2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import Logo from "./Logo";
import { BRAND, NAV_LINKS } from "@/lib/site-data";

export default function Footer() {
  const handleShare = async () => {
    const shareData = {
      title: BRAND.fullName,
      text: BRAND.slogan,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      toast.success("Lien de la page copié.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Impossible de partager cette page.");
    }
  };

  return (
    <footer className="border-t border-navy-100 bg-navy-900 text-navy-100">
      <div className="container-app grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="[&_span]:text-white [&_span.text-primary-600]:text-primary-300">
            <Logo />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-300">{BRAND.slogan}</p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Réseaux sociaux"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-primary-500"
            >
              <Share2 size={16} />
            </button>
            <Link
              href="/"
              aria-label="Accueil du site"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-primary-500"
            >
              <Globe2 size={16} />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-gold-400">
            Navigation
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-navy-300 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-gold-400">
            Ressources
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/don" className="text-navy-300 transition-colors hover:text-white">
                Faire un don
              </Link>
            </li>
            <li>
              <Link href="/galerie" className="text-navy-300 transition-colors hover:text-white">
                Galerie photos
              </Link>
            </li>
            <li>
              <Link href="/temoignages" className="text-navy-300 transition-colors hover:text-white">
                Témoignages
              </Link>
            </li>
            <li>
              <Link href="/partenaires" className="text-navy-300 transition-colors hover:text-white">
                Partenaires
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-gold-400">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-300">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary-400" />
              {BRAND.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-primary-400" />
              {BRAND.phone}
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="shrink-0 text-primary-400" />
              <a
                href={`https://wa.me/${BRAND.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                {BRAND.whatsappDisplay} (WhatsApp)
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-primary-400" />
              {BRAND.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container-app text-center text-xs text-navy-400">
          © {new Date().getFullYear()} {BRAND.fullName}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
