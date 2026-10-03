"use client";

import { motion, type Variants } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type SectionHeadingProps = {
  kicker: string;
  title?: string;
  className?: string;
  titleClassName?: string;
};

const VIEWPORT = { once: true, margin: "-80px 0px" } as const;

export function SectionHeading({
  kicker,
  title,
  className,
  titleClassName = "mt-3 text-3xl font-semibold tracking-tight sm:text-4xl",
}: SectionHeadingProps) {
  const reduceMotion = usePrefersReducedMotion();

  const wordVariants: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { y: "110%" },
    shown: (index: number) => ({
      opacity: 1,
      y: "0%",
      transition: {
        duration: reduceMotion ? 0.3 : 0.75,
        delay: 0.1 + index * 0.05,
        ease: EASE_OUT,
      },
    }),
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <motion.span
          aria-hidden
          className="h-px w-8 origin-left bg-accent shadow-[0_0_8px_rgba(139,92,246,0.8)]"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        />
        <motion.p
          key={kicker}
          className="font-mono text-xs uppercase tracking-[0.24em] text-accent"
          initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE_OUT }}
        >
          {kicker}
        </motion.p>
      </div>
      {title ? (
        <motion.h2
          key={title}
          className={titleClassName}
          initial="hidden"
          whileInView="shown"
          viewport={VIEWPORT}
        >
          <span className="sr-only">{title}</span>
          <span aria-hidden>
            {title.split(" ").map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <motion.span
                  className="inline-block"
                  custom={index}
                  variants={wordVariants}
                >
                  {word}
                </motion.span>
                {"\u00a0"}
              </span>
            ))}
          </span>
        </motion.h2>
      ) : null}
    </div>
  );
}
