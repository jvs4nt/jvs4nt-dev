"use client";

import type { PointerEvent } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const SPRING = { stiffness: 160, damping: 18, mass: 0.5 };

export function useTilt(maxDegrees = 5) {
  const reduceMotion = usePrefersReducedMotion();
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const rotateX = useSpring(targetX, SPRING);
  const rotateY = useSpring(targetY, SPRING);

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    targetX.set(-py * maxDegrees * 2);
    targetY.set(px * maxDegrees * 2);
  }

  function onPointerLeave() {
    targetX.set(0);
    targetY.set(0);
  }

  return {
    style: { rotateX, rotateY, transformPerspective: 1200 },
    onPointerMove,
    onPointerLeave,
  };
}
