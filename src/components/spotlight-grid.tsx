"use client";

import { useState, type PointerEvent, type RefObject } from "react";

export type GridPointer = { x: number; y: number };

export function useGridPointer() {
  const [pointer, setPointer] = useState<GridPointer>({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    setPointer({ x: event.clientX, y: event.clientY });
    if (!active) setActive(true);
  }

  return {
    pointer,
    active,
    gridProps: {
      onPointerMove,
      onPointerLeave: () => setActive(false),
    },
  };
}

export function SpotlightGlow({
  pointer,
  active,
  cardRef,
}: {
  pointer: GridPointer;
  active: boolean;
  cardRef: RefObject<HTMLElement | null>;
}) {
  const rect = cardRef.current?.getBoundingClientRect();
  const localX = rect ? pointer.x - rect.left : 0;
  const localY = rect ? pointer.y - rect.top : 0;

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: `radial-gradient(420px circle at ${localX}px ${localY}px, rgb(139 92 246 / 0.16), transparent 42%)`,
      }}
    />
  );
}
