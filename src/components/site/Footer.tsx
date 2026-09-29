"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { FaSquareFacebook } from "react-icons/fa6";

import { Mail, MapPin, Phone, MessageCircle, Share2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { BRAND, NAV_LINKS } from "@/lib/site-data";
import Logo from "./Logo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const year = new Date().getFullYear();

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
      toast.success("Lien copié dans le presse-papier.");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      toast.error("Impossible de partager cette page.");
    }
  };

  const handleNewsletter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        toast.error(
          data?.error || "Une erreur est survenue. Veuillez réessayer."
        );
        return;
      }

      if (data.alreadySubscribed) {
        toast.info(data.message);
      } else {
        toast.success(data.message);
        setEmail("");
      }
    } catch {
      toast.error(
        "Impossible de s'inscrire pour le moment. Vérifiez votre connexion."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-navy-900 text-navy-100">
      {/* Top hairline gold (signature) */}
      <span className="absolute inset-x-0 top-0 h-px bg-gold-500/40" aria-hidden />
      {/* Mesh accent subtil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-gold-500/[0.07] blur-3xl"
      />

      {/* ——— Main grid ——— */}
      <div className="container-app relative grid gap-10 py-14 md:grid-cols-12 md:gap-8 md:py-16">
        {/* Brand + newsletter — col-span-5 */}
        <div className="md:col-span-5">
          <div className="[&_span]:text-white [&_span.text-primary-600]:text-primary-300">
            <Logo />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-300">
            {BRAND.slogan}
          </p>

          {/* Newsletter */}
          <form onSubmit={handleNewsletter} className="mt-6 max-w-sm">
            <label
              htmlFor="footer-email"
              className="eyebrow eyebrow-light block mb-2"
            >
              Newsletter
            </label>
            <div className="flex items-center hairline-strong border-white/15 rounded-md overflow-hidden bg-white/[0.03]">
              <input
                id="footer-email"
                type="email"
                required
                disabled={submitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.org"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-navy-400 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={submitting}
                aria-label="S'inscrire à la newsletter"
                className="shrink-0 px-3 py-2.5 bg-gold-500 text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="block h-4 w-4 animate-spin rounded-full border-2 border-navy-900/30 border-t-navy-900" />
                ) : (
                  <ArrowRight size={16} strokeWidth={2} />
                )}
              </button>
            </div>
            <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-wider text-navy-400">
              Pas de spam. Désinscription en 1 clic.
            </p>
          </form>

          {/* Réseaux */}
          <div className="mt-6 flex gap-2">
            <SocialButton
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              label="WhatsApp"
              icon={<MessageCircle size={15} />}
            />
            <SocialButton
              href="https://facebook.com"
              label="Facebook"
              icon={<FaSquareFacebook size={15} />}
              external
            />
            <SocialButton
              href={`mailto:${BRAND.email}`}
              label="Email"
              icon={<Mail size={15} />}
            />
            <SocialButton
              onClick={handleShare}
              label="Partager"
              icon={<Share2 size={15} />}
            />
          </div>
        </div>

        {/* Navigation — col-span-2 */}
        <div className="md:col-span-2">
          <FooterHeading>Navigation</FooterHeading>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.slice(0, 5).map((l) => (
              <li key={l.href}>
                <FooterLink href={l.href}>{l.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Ressources — col-span-2 */}
        <div className="md:col-span-2">
          <FooterHeading>Ressources</FooterHeading>
          <ul className="mt-4 space-y-2">
            <li><FooterLink href="/don">Faire un don</FooterLink></li>
            <li><FooterLink href="/galerie">Galerie photos</FooterLink></li>
            <li><FooterLink href="/temoignages">Témoignages</FooterLink></li>
            <li><FooterLink href="/partenaires">Partenaires</FooterLink></li>
            <li><FooterLink href="/agenda">Agenda</FooterLink></li>
          </ul>
        </div>

        {/* Contact — col-span-3 */}
        <div className="md:col-span-3">
          <FooterHeading>Contact</FooterHeading>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-primary-400" strokeWidth={1.75} />
              <span className="text-navy-300 leading-relaxed">{BRAND.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={15} className="shrink-0 text-primary-400" strokeWidth={1.75} />
              <a
                href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
                className="text-navy-300 transition-colors hover:text-white"
              >
                {BRAND.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MessageCircle size={15} className="shrink-0 text-primary-400" strokeWidth={1.75} />
              <a
                href={`https://wa.me/${BRAND.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="text-navy-300 transition-colors hover:text-white"
              >
                {BRAND.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={15} className="shrink-0 text-primary-400" strokeWidth={1.75} />
              <a
                href={`mailto:${BRAND.email}`}
                className="text-navy-300 transition-colors hover:text-white"
              >
                {BRAND.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ——— Bottom bar ——— */}
      <div className="hairline-t border-white/10">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p className="text-navy-400">
            © {year} {BRAND.fullName}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-navy-400">
            <Link href="/mentions-legales" className="transition-colors hover:text-white">
              Mentions légales
            </Link>
            <span className="h-3 w-px bg-white/15" aria-hidden />
            <Link href="/confidentialite" className="transition-colors hover:text-white">
              Confidentialité
            </Link>
            <span className="hidden sm:inline h-3 w-px bg-white/15" aria-hidden />
            <span className="hidden sm:inline font-mono uppercase tracking-widest text-navy-500">
              Conakry · GN
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ——— Sub-components ———

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-px w-4 bg-gold-400/60" aria-hidden />
      <h3 className="eyebrow eyebrow-light">{children}</h3>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm text-navy-300 transition-colors hover:text-white"
    >
      <span
        className="h-px w-0 bg-gold-400 transition-all duration-200 group-hover:w-3"
        aria-hidden
      />
      {children}
    </Link>
  );
}

function SocialButton({
  href,
  onClick,
  label,
  icon,
  external = false,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  const cls =
    "inline-flex h-9 w-9 items-center justify-center rounded-md hairline border-white/15 bg-white/[0.03] text-navy-200 transition-all duration-200 hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500";
  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className={cls}
      >
        {icon}
      </a>
    );
  }
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>
      {icon}
    </button>
  );
}