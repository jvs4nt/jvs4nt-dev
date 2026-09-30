"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LanguageToggle } from "@/components/language-toggle";
import { MobileNavMenu } from "@/components/mobile-nav-menu";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";
import { useActiveSection } from "@/components/use-active-section";
import { useLocale } from "@/i18n/use-locale";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const { content } = useLocale();
  const { profile, nav, ui } = content;
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(nav.map((item) => item.href));
  const reduceMotion = useReducedMotion();
  const indicatorTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <header className="fixed inset-x-0 top-0 z-[60] border-b border-white/5 bg-background/70 backdrop-blur-md">
      <nav
        aria-label={ui.navAriaLabel}
        className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-3 lg:justify-center lg:py-4"
      >
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-foreground lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? ui.closeMenu : ui.openMenu}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
              <path
                d="M5 7h14M5 12h14M5 17h14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        <ul className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const isActive = item.href === active;
            return (
              <li key={item.href} className="relative">
                <a
                  href={item.href}
                  className="block"
                  aria-current={isActive ? "location" : undefined}
                >
                  <RandomLetterSwap
                    className={cn(
                      "cursor-pointer font-medium text-sm transition-colors hover:text-foreground",
                      isActive ? "text-foreground" : "text-muted",
                    )}
                    label={item.label}
                    staggerDuration={0.025}
                    transition={{ duration: 0.6, type: "spring" }}
                  />
                </a>
                <AnimatePresence>
                  {isActive ? (
                    <motion.span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-2 h-0.5 origin-center rounded-full bg-accent shadow-[0_0_10px_rgba(139,92,246,0.7)]"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      transition={indicatorTransition}
                    />
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 lg:absolute lg:right-5">
          <LanguageToggle />
          <a
            href={profile.github}
            className="rounded-full border border-white/10 px-2.5 py-1.5 font-mono text-[11px] text-foreground transition-colors hover:border-accent hover:text-accent lg:px-3 lg:text-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            {ui.github}
          </a>
        </div>
      </nav>

      <div id="mobile-nav-menu">
        <MobileNavMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          nav={nav}
          activeHref={active}
          title={ui.mobileMenuAriaLabel}
          closeLabel={ui.closeMenu}
        />
      </div>
    </header>
  );
}
