"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronDown, HeartHandshake } from "lucide-react";
import { NAV_LINKS } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion() ?? false;

  // — Scrolled state (condense header) —
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // — Lock body scroll when mobile menu open —
// — Lock page scroll when mobile menu open —
useEffect(() => {
  if (!mobileOpen) return;
  const html = document.documentElement;
  const previous = html.style.overflow;
  html.style.overflow = "hidden";
  return () => {
    html.style.overflow = previous;
  };
}, [mobileOpen]);

  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/85 backdrop-blur-xl hairline-b shadow-sm"
            : "bg-background/40 backdrop-blur-md border-b border-transparent",
        )}
      >
        {/* Scroll progress hairline (top) */}
        <ScrollProgress />

        <nav
          className={cn(
            "container-app gap-3 flex items-center justify-between transition-all duration-300",
            scrolled ? "h-14" : "h-16 md:h-20",
          )}
        >
          {/* — Logo — */}
          <Link
            href="/"
            aria-label="Accueil — FSCPE"
            className="min-w-0 flex-1 lg:flex-none"
          >
            <Logo enableAdminTrigger />
          </Link>

          {/* — Desktop nav — */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <li
                  key={link.href}
                  className="relative"
                  onMouseEnter={() =>
                    link.children && setOpenDropdown(link.label)
                  }
                  onMouseLeave={() => link.children && setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "group relative flex items-center gap-1 rounded-md px-3 py-2",
                      "font-display text-[0.875rem] font-medium transition-colors duration-200",
                      active
                        ? "text-primary-700"
                        : "text-navy-700 hover:text-primary-700",
                    )}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        size={13}
                        className={cn(
                          "opacity-50 transition-transform duration-200",
                          openDropdown === link.label && "rotate-180",
                        )}
                      />
                    )}
                    {/* Animated underline */}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-2 -bottom-px h-px bg-gold-500"
                        transition={
                          reduce
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 400, damping: 32 }
                        }
                      />
                    )}
                  </Link>

                  {/* — Dropdown — */}
                  <AnimatePresence>
                    {link.children && openDropdown === link.label && (
                      <motion.div
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className={cn("absolute left-0 top-full pt-2 w-72")}
                      >
                        <div className="overflow-hidden rounded-md hairline bg-white shadow-xl shadow-navy-900/5">
                          <span
                            className="block h-0.5 w-full bg-gold-500"
                            aria-hidden
                          />
                          <div className="p-1.5">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "group block rounded-sm px-3 py-2.5",
                                  "transition-colors duration-150 hover:bg-primary-50",
                                )}
                              >
                                <div className="flex items-baseline justify-between gap-2">
                                  <span className="font-display text-sm font-semibold text-navy-800">
                                    {child.label}
                                  </span>
                                  <span
                                    className="font-mono text-[0.625rem] uppercase tracking-wider text-navy-300 opacity-0 transition-opacity group-hover:opacity-100"
                                    aria-hidden
                                  >
                                    →
                                  </span>
                                </div>
                                {child.description && (
                                  <span className="mt-0.5 block text-xs leading-relaxed text-navy-500">
                                    {child.description}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* — CTA desktop — */}
          <div className="hidden lg:block">
            <Link
              href="/don"
              className={cn(
                "group inline-flex items-center gap-2",
                "rounded-md px-5 py-2.5",
                "font-display text-sm font-semibold text-white",
                "bg-primary-600 transition-all duration-200",
                "hover:bg-primary-700 hover:-translate-y-0.5",
                "shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40",
              )}
            >
              <HeartHandshake size={15} strokeWidth={2} />
              Faire un don
            </Link>
          </div>

          {/* — Mobile burger — */}
          <button
            type="button"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            className={cn(
              "relative z-50 flex h-10 w-10 items-center justify-center lg:hidden",
              "rounded-md hairline bg-white/60",
              "transition-colors hover:bg-white",
            )}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <div className="relative h-3.5 w-5">
              <motion.span
                className="absolute left-0 top-0 h-0.5 w-full bg-navy-800"
                animate={
                  mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-navy-800"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="absolute bottom-0 left-0 h-0.5 w-full bg-navy-800"
                animate={
                  mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* — Mobile drawer (full-screen) — */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-navy-900/40 backdrop-blur-sm lg:hidden"
              aria-hidden
            />
            {/* Panel */}
            <motion.div
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-background lg:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Header strip */}
                <div className="flex h-16 items-center justify-between hairline-b px-5">
                  <span className="eyebrow">Menu</span>
                  <span className="font-mono text-[0.625rem] uppercase tracking-widest text-navy-400">
                    FSCPE
                  </span>
                </div>

                {/* Links */}
                <nav className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="flex flex-col gap-0.5">
                    {NAV_LINKS.map((link, i) => {
                      const active = isLinkActive(link.href);
                      return (
                        <motion.li
                          key={link.href}
                          initial={reduce ? false : { opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: reduce ? 0 : 0.05 + i * 0.04,
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center justify-between rounded-md px-3 py-2.5",
                              "font-display text-base font-medium transition-colors",
                              active
                                ? "bg-primary-50 text-primary-700"
                                : "text-navy-800 hover:bg-primary-50/50 hover:text-primary-700",
                            )}
                          >
                            <span>{link.label}</span>
                            <span className="font-mono text-[0.625rem] text-navy-300">
                              0{i + 1}
                            </span>
                          </Link>
                          {link.children && (
                            <ul className="ml-3 hairline-l my-1 pl-3">
                              {link.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block rounded-md px-3 py-1.5 text-sm text-navy-500 hover:bg-primary-50 hover:text-primary-700"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                {/* CTA */}
                <div className="hairline-t p-5">
                  <Link
                    href="/don"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary w-full justify-center"
                  >
                    <HeartHandshake size={16} />
                    Faire un don
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ——— Scroll progress (top hairline gold) ———
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    if (reduce) return;
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce]);

  if (reduce) return null;

  return (
    <div className="absolute inset-x-0 top-0 h-px bg-transparent">
      <div
        className="h-full bg-gold-500 transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
