"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, X, HeartHandshake } from "lucide-react";
import Logo from "./Logo";
import { NAV_LINKS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-background/90 backdrop-blur-md">
      <nav className="container-app flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label="Accueil">
          <Logo enableAdminTrigger />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => link.children && setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-primary-50 hover:text-primary-700",
                    isActive && "bg-primary-50 text-primary-700"
                  )}
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} className="opacity-60" />}
                </Link>
                <AnimatePresence>
                  {link.children && openDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full w-64 overflow-hidden rounded-2xl border border-navy-100 bg-white p-2 shadow-xl"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-primary-50"
                        >
                          <span className="block text-sm font-semibold text-navy-800">{child.label}</span>
                          {child.description && (
                            <span className="block text-xs text-navy-500">{child.description}</span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Link
            href="/don"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/30 transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md"
          >
            <HeartHandshake size={16} />
            Faire un don
          </Link>
        </div>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          className="rounded-lg p-2 text-navy-800 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-navy-100 bg-white lg:hidden"
          >
            <ul className="container-app flex flex-col gap-1 py-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 font-medium text-navy-700 hover:bg-primary-50"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <ul className="ml-3 border-l border-navy-100 pl-3">
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-navy-500 hover:bg-primary-50 hover:text-primary-700"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/don"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-3 font-semibold text-white"
                >
                  <HeartHandshake size={16} />
                  Faire un don
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
