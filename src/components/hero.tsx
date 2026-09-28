"use client";

import { RobotHero } from "@/components/ui/robot-hero";
import { useLocale } from "@/i18n/use-locale";

export function Hero() {
  const { content } = useLocale();
  const { profile } = content;

  return (
    <RobotHero
      backgroundTextTop={profile.name.toUpperCase()}
      backgroundTextBottom="FULL-STACK DEV"
      showNavbar={false}
      color="#1a1a24"
      pantallaColor="#8b5cf6"
      pantallaBrillo={1.4}
      metalness={0.2}
    />
  );
}
