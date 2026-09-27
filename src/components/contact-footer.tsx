"use client";

import { BrandMark } from "@/components/brand-mark";
import { useLocale } from "@/i18n/use-locale";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6a4.6 4.6 0 0 1 1.2-3.2 4.3 4.3 0 0 1 .1-3.2s1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.1a4.6 4.6 0 0 1 1.2 3.2c0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
    </svg>
  );
}

export function ContactFooter() {
  const { content } = useLocale();
  const { profile, ui } = content;

  return (
    <footer id="contato" className="scroll-mt-24 px-5 pb-10 pt-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#16161f] px-6 py-16 sm:px-12">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
          {ui.contact.kicker}
        </p>
        <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {ui.contact.title}
        </h2>
        <p className="mt-4 max-w-lg text-lg leading-8 text-muted">
          {ui.contact.body}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-white"
          >
            {profile.email}
          </a>
          <a
            href={profile.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-foreground transition hover:border-accent hover:text-accent"
          >
            {profile.phone}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-foreground transition hover:border-accent hover:text-accent"
          >
            <GitHubIcon />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-foreground transition hover:border-accent hover:text-accent"
          >
            <LinkedInIcon />
          </a>
        </div>

        <p className="mt-14 flex items-center gap-2.5 text-sm text-muted">
          <BrandMark size={28} className="h-7 w-7" />
          {profile.name} · {profile.city}
        </p>
      </div>
    </footer>
  );
}
