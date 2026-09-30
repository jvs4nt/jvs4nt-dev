"use client";

import { motion, type Variants } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useLocale } from "@/i18n/use-locale";

const STAGGER = 0.08;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: index * STAGGER,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  instant: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0 },
  },
};

export function HeroIntro({
  revealed,
  instant,
}: {
  revealed: boolean;
  instant: boolean;
}) {
  const { content } = useLocale();
  const { profile, ui } = content;
  const animate = !revealed ? "hidden" : instant ? "instant" : "visible";

  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
      <motion.p
        custom={0}
        variants={itemVariants}
        initial={false}
        animate={animate}
        className="font-mono text-xs uppercase tracking-[0.2em] text-accent"
      >
        {profile.role} · {profile.city}
      </motion.p>

      <motion.h1
        custom={1}
        variants={itemVariants}
        initial={false}
        animate={animate}
        className="mt-5 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
      >
        {profile.name}
        <span className="text-accent">.</span>
      </motion.h1>

      <motion.p
        custom={2}
        variants={itemVariants}
        initial={false}
        animate={animate}
        className="mt-4 text-2xl font-medium tracking-tight text-foreground lg:text-3xl"
      >
        {ui.hero.phraseLead}{" "}
        <span className="text-accent">{ui.hero.phraseAccent}</span>
      </motion.p>

      <motion.p
        custom={3}
        variants={itemVariants}
        initial={false}
        animate={animate}
        className="mt-5 max-w-md text-base leading-relaxed text-muted"
      >
        {ui.heroTagline}
      </motion.p>

      <motion.a
        custom={4}
        variants={itemVariants}
        initial={false}
        animate={animate}
        href="#sobre"
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-colors hover:bg-[#7c4fe0]"
      >
        {ui.hero.cta}
        <ArrowDown
          size={16}
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-y-0.5"
        />
      </motion.a>
    </div>
  );
}
