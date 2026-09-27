"use client";

import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/i18n/use-locale";

export function SiteNav() {
  const { content } = useLocale();
  const { profile, nav, ui } = content;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-md">
      <nav
        aria-label={ui.navAriaLabel}
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4"
      >
        <a
          href="#topo"
          className="flex items-center gap-2.5 font-mono text-sm tracking-tight text-foreground"
        >
          <BrandMark size={32} priority className="h-8 w-8" />
          <span className="max-[380px]:hidden">{profile.name}</span>
        </a>
        <ul className="hidden items-center gap-6 text-sm text-muted md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a className="transition-colors hover:text-foreground" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <a
            href={profile.github}
            className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            {ui.github}
          </a>
        </div>
      </nav>
    </header>
  );
}
