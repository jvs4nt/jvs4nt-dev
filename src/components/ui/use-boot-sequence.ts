"use client";

import { useEffect, useState } from "react";

export type BootPhase = "terminal" | "power" | "reveal" | "done";

const PHASE_ORDER: BootPhase[] = ["terminal", "power", "reveal", "done"];
const SKIP_EVENTS = ["pointerdown", "keydown", "wheel", "touchmove"] as const;

export const BOOT_TIMINGS = {
  typing: 1400,
  power: 1900,
  reveal: 2900,
  done: 3800,
};

type BootState = { phase: BootPhase; instant: boolean };

function advance(next: BootPhase) {
  return (state: BootState): BootState =>
    PHASE_ORDER.indexOf(next) > PHASE_ORDER.indexOf(state.phase)
      ? { ...state, phase: next }
      : state;
}

export function bootPhaseAtLeast(phase: BootPhase, target: BootPhase) {
  return PHASE_ORDER.indexOf(phase) >= PHASE_ORDER.indexOf(target);
}

export function useBootSequence() {
  const [state, setState] = useState<BootState>({
    phase: "terminal",
    instant: false,
  });
  const finished = state.phase === "done";

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      const frame = requestAnimationFrame(() =>
        setState({ phase: "done", instant: true }),
      );
      return () => cancelAnimationFrame(frame);
    }

    const timers = [
      setTimeout(() => setState(advance("power")), BOOT_TIMINGS.power),
      setTimeout(() => setState(advance("reveal")), BOOT_TIMINGS.reveal),
      setTimeout(() => setState(advance("done")), BOOT_TIMINGS.done),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (finished) return;

    const onInput = () => setState(advance("done"));
    SKIP_EVENTS.forEach((type) =>
      window.addEventListener(type, onInput, { passive: true }),
    );
    return () =>
      SKIP_EVENTS.forEach((type) => window.removeEventListener(type, onInput));
  }, [finished]);

  return state;
}
