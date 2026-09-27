"use client";

import { BlurIn } from "@/components/blur-in";
import { BrandMark } from "@/components/brand-mark";
import { CyberMatrix } from "@/components/cyber-matrix";
import { useLocale } from "@/i18n/use-locale";

export function Hero() {
  const { content } = useLocale();
  const { profile, ui } = content;

  return (
    <section
      id="topo"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-16 text-center"
    >
      <CyberMatrix />
      <div
        aria-hidden
        className="hero-vignette pointer-events-none absolute inset-0 z-[1]"
      />
      <div className="relative z-10 flex max-w-3xl flex-col items-center">
        <BlurIn delay={0}>
          <BrandMark
            size={88}
            priority
            className="h-[72px] w-[72px] drop-shadow-[0_0_22px_rgba(139,92,246,0.35)] sm:h-[88px] sm:w-[88px]"
          />
        </BlurIn>
        <BlurIn delay={0.08}>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.28em] text-accent">
            {profile.city} · {profile.role}
          </p>
        </BlurIn>
        <BlurIn
          as="h1"
          delay={0.16}
          className="mt-6 text-5xl font-semibold tracking-tight sm:text-7xl"
        >
          {profile.name}
        </BlurIn>
        <BlurIn
          as="p"
          delay={0.28}
          className="mt-6 text-lg leading-8 text-muted"
        >
          {ui.heroTagline}
        </BlurIn>
        <BlurIn delay={0.4} className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-white"
          >
            {ui.github}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-foreground transition hover:border-accent hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-foreground transition hover:border-accent hover:text-accent"
          >
            {profile.email}
          </a>
        </BlurIn>
      </div>
    </section>
  );
}
