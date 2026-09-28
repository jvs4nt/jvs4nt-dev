"use client";

import type { PointerEvent } from "react";

export function useGridPointer() {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const cards = event.currentTarget.querySelectorAll<HTMLElement>(
      "[data-spotlight-card]",
    );
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  }

  return {
    gridProps: {
      className: "group/spotlight",
      onPointerMove,
    },
  };
}

export function SpotlightGlow() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
      style={{
        background:
          "radial-gradient(420px circle at var(--spot-x, 0px) var(--spot-y, 0px), rgb(139 92 246 / 0.16), transparent 42%)",
      }}
    />
  );
}
