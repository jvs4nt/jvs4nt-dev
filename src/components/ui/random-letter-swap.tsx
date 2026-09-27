"use client";

import { useCallback, useMemo, useState } from "react";
import {
  motion,
  useReducedMotion,
  type AnimationOptions,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

function randomStaggerDelays(length: number, staggerDuration: number) {
  const order = Array.from({ length }, (_, index) => index);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.map((charIndex, sequenceIndex) => ({
    charIndex,
    delay: sequenceIndex * staggerDuration,
  }));
}

type RandomLetterSwapProps = {
  label: string;
  reverse?: boolean;
  staggerDuration?: number;
  transition?: AnimationOptions;
  className?: string;
  onClick?: () => void;
};

export function RandomLetterSwap({
  label,
  reverse = true,
  staggerDuration = 0.02,
  transition = { type: "spring", duration: 0.8 },
  className,
  onClick,
}: RandomLetterSwapProps) {
  const reduceMotion = useReducedMotion();
  const chars = useMemo(() => label.split(""), [label]);
  const [active, setActive] = useState(false);
  const [delays, setDelays] = useState<number[]>(() =>
    chars.map(() => 0),
  );

  const refreshDelays = useCallback(() => {
    const next = new Array(chars.length).fill(0);
    for (const { charIndex, delay } of randomStaggerDelays(
      chars.length,
      staggerDuration,
    )) {
      next[charIndex] = delay;
    }
    setDelays(next);
  }, [chars.length, staggerDuration]);

  const onEnter = () => {
    if (reduceMotion) return;
    refreshDelays();
    setActive(true);
  };

  const onLeave = () => {
    setActive(false);
  };

  const y = active ? (reverse ? "-50%" : "50%") : "0%";

  return (
    <motion.span
      aria-label={label}
      className={cn("inline-flex", className)}
      onClick={onClick}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span aria-hidden className="inline-flex">
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            className="relative inline-block h-[1em] overflow-hidden"
            style={{ width: char === " " ? "0.3em" : undefined }}
          >
            <motion.span
              className="flex flex-col"
              animate={{ y: reduceMotion ? "0%" : y }}
              transition={{
                ...(transition as Transition),
                delay: delays[index] ?? 0,
              }}
            >
              <span className="flex h-[1em] items-center justify-center leading-none">
                {char === " " ? "\u00a0" : char}
              </span>
              <span className="flex h-[1em] items-center justify-center leading-none">
                {char === " " ? "\u00a0" : char}
              </span>
            </motion.span>
          </span>
        ))}
      </span>
    </motion.span>
  );
}
