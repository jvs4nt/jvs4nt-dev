"use client";

import { motion, type Variants } from "motion/react";
import { ArrowDown, ArrowUpRight, LayoutGrid } from "lucide-react";
import { Magnetic } from "@/components/magnetic";
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

      <motion.div
        custom={4}
        variants={itemVariants}
        initial={false}
        animate={animate}
        className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
      >
        <Magnetic>
          <a
            href="#sobre"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-[background-color,box-shadow] hover:bg-[#7c4fe0] hover:shadow-[0_0_32px_rgba(139,92,246,0.6)]"
          >
            {ui.hero.cta}
            <ArrowDown
              size={16}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </a>
        </Magnetic>
        <Magnetic strength={0.2}>
          <a
            href="#projetos"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
          >
            <LayoutGrid size={15} aria-hidden />
            {ui.hero.ctaProjects}
            <ArrowUpRight
              size={15}
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </Magnetic>
      </motion.div>
    </div>
  );
}
