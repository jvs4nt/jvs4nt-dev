"use client";

import { useEffect } from "react";
import { animate, useMotionValue } from "motion/react";
import { EASE_OUT } from "@/lib/motion";

export function useCountUp(
  target: number,
  active: boolean,
  { duration = 1.4, delay = 0, instant = false } = {},
) {
  const value = useMotionValue(0);

  useEffect(() => {
    if (!active) return;
    if (instant) {
      value.set(target);
      return;
    }
    const controls = animate(value, target, { duration, delay, ease: EASE_OUT });
    return () => controls.stop();
  }, [active, instant, target, duration, delay, value]);

  return value;
}
