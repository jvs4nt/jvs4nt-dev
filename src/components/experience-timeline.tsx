"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useLocale } from "@/i18n/use-locale";

export function ExperienceTimeline() {
  const { content } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const springScaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <section
      id="experiencia"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24"
    >
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
        {content.ui.sections.experience}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {content.ui.sections.experienceTitle}
      </h2>

      <div ref={ref} className="relative mt-14 pl-8">
        <div
          aria-hidden
          className="absolute top-1 bottom-1 left-[7px] z-0 w-px bg-white/10"
        />
        <motion.div
          aria-hidden
          className="absolute top-1 left-[7px] z-[1] w-px origin-top bg-accent"
          style={{
            height: "100%",
            scaleY: reduceMotion ? scrollYProgress : springScaleY,
          }}
        />

        <ol className="relative z-[2] space-y-12">
          {content.experience.map((job) => (
            <li key={`${job.company}-${job.period}`} className="relative">
              <span
                aria-hidden
                className="absolute top-1.5 -left-8 h-3.5 w-3.5 rounded-full border-2 border-accent bg-background"
              />
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {job.period} · {job.company}
              </p>
              <h3 className="mt-2 text-xl font-medium">{job.title}</h3>
              <ul className="mt-3 space-y-2 text-muted">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
