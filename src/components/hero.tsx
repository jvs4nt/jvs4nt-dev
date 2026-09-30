"use client";

import { HeroIntro } from "@/components/hero-intro";
import { IconCloud } from "@/components/ui/interactive-icon-cloud";
import { RobotHero } from "@/components/ui/robot-hero";
import { useLocale } from "@/i18n/use-locale";

const ICON_SLUGS = [
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "nodedotjs",
  "fastify",
  "express",
  "nestjs",
  "postgresql",
  "drizzle",
  "prisma",
  "tailwindcss",
  "git",
  "github",
  "php",
  "laravel",
  "symfony",
  "wordpress",
  "html5",
  "css3",
  "vercel",
];

export function Hero() {
  const { content } = useLocale();
  const { ui } = content;

  return (
    <RobotHero
      backdrop={<IconCloud iconSlugs={ICON_SLUGS} />}
      intro={(state) => <HeroIntro {...state} />}
      showNavbar={false}
      color="#1a1a24"
      pantallaColor="#8b5cf6"
      pantallaBrillo={1.4}
      metalness={0.2}
      bootLines={ui.boot.lines}
      bootSkipHint={ui.boot.skipHint}
    />
  );
}
