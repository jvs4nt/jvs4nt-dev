"use client";

import { useState } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { MobileNavMenu } from "@/components/mobile-nav-menu";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";
import { useLocale } from "@/i18n/use-locale";

export function SiteNav() {
  const { content } = useLocale();
  const { profile, nav, ui } = content;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-md">
      <nav
        aria-label={ui.navAriaLabel}
        className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:justify-center md:py-4"
      >
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-foreground md:hidden"
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

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="block">
                <RandomLetterSwap
                  className="cursor-pointer font-medium text-sm text-muted hover:text-foreground"
                  label={item.label}
                  staggerDuration={0.025}
                  transition={{ duration: 0.6, type: "spring" }}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:absolute md:right-5">
          <LanguageToggle />
          <a
            href={profile.github}
            className="rounded-full border border-white/10 px-2.5 py-1.5 font-mono text-[11px] text-foreground transition-colors hover:border-accent hover:text-accent md:px-3 md:text-xs"
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
          title={ui.mobileMenuAriaLabel}
          closeLabel={ui.closeMenu}
        />
      </div>
    </header>
  );
}
