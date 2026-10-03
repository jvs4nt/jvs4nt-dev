"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left bg-gradient-to-r from-accent via-[#a78bfa] to-[#60a5fa] shadow-[0_0_12px_rgba(139,92,246,0.7)]"
      style={{ scaleX }}
    />
  );
}
