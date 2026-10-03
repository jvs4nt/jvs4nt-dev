"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/i18n/use-locale";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

function TimelineDot({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <span aria-hidden className="absolute top-1.5 -left-8 h-3.5 w-3.5">
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-accent"
        initial={false}
        animate={{
          backgroundColor: active ? "#8b5cf6" : "#07070b",
          scale: active && !reduced ? 1.15 : 1,
          boxShadow: active
            ? "0 0 14px rgba(139,92,246,0.8)"
            : "0 0 0px rgba(139,92,246,0)",
        }}
        transition={{ duration: reduced ? 0 : 0.35 }}
      />
      <AnimatePresence>
        {active && !reduced ? (
          <motion.span
            key="ring"
            className="absolute inset-0 rounded-full border border-accent"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        ) : null}
      </AnimatePresence>
    </span>
  );
}

function CurrentBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.15)]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </span>
      {label}
    </span>
  );
}

export function ExperienceTimeline() {
  const { content } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [reachedCount, setReachedCount] = useState(0);
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const springScaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  });

  useMotionValueEvent(springScaleY, "change", (progress) => {
    const container = ref.current;
    if (!container) return;
    const containerTop = container.getBoundingClientRect().top;
    const height = container.offsetHeight || 1;
    const reached = itemRefs.current.filter((item) => {
      if (!item) return false;
      const offset = item.getBoundingClientRect().top - containerTop + 10;
      return offset / height <= progress;
    }).length;
    setReachedCount((current) => (current === reached ? current : reached));
  });

  return (
    <section
      id="experiencia"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24"
    >
      <SectionHeading
        kicker={content.ui.sections.experience}
        title={content.ui.sections.experienceTitle}
      />

      <div ref={ref} className="relative mt-14 pl-8">
        <div
          aria-hidden
          className="absolute top-1 bottom-1 left-[7px] z-0 w-px bg-white/10"
        />
        <motion.div
          aria-hidden
          className="absolute top-1 left-[7px] z-[1] w-px origin-top bg-gradient-to-b from-accent via-accent to-[#60a5fa] shadow-[0_0_10px_rgba(139,92,246,0.6)]"
          style={{
            height: "100%",
            scaleY: reduceMotion ? scrollYProgress : springScaleY,
          }}
        />

        <ol className="relative z-[2] space-y-12">
          {content.experience.map((job, index) => (
            <ScrollReveal
              key={`${job.company}-${job.period}`}
              delay={Math.min(index * 0.06, 0.24)}
            >
              <li
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className="group relative"
              >
                <TimelineDot
                  active={index < reachedCount}
                  reduced={reduceMotion}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    {job.period} · {job.company}
                  </p>
                  {job.current ? (
                    <CurrentBadge label={content.ui.experience.current} />
                  ) : null}
                </div>
                <h3 className="mt-2 text-xl font-medium transition-colors duration-300 group-hover:text-accent">
                  {job.title}
                </h3>
                <ul className="mt-3 space-y-2 text-muted">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
