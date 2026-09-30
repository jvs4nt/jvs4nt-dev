"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { CHARS } from "@/components/cyber-matrix";

const FRAME_MS = 45;

type Status = "idle" | "running" | "done";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)] ?? "0";
}

export function ScrambleText({
  text,
  active,
  animate = true,
  delay = 0,
  duration = 800,
  className,
  style,
}: {
  text: string;
  active: boolean;
  animate?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [glyphs, setGlyphs] = useState<string[] | null>(null);

  useEffect(() => {
    if (!active || !animate) return;

    const chars = Array.from(text);
    let frame = 0;
    let start = 0;
    let lastTick = 0;

    const tick = (now: number) => {
      if (!start) {
        start = now;
        setStatus("running");
      }
      const progress = Math.min(1, (now - start) / duration);

      if (progress >= 1) {
        setGlyphs(null);
        setStatus("done");
        return;
      }

      if (now - lastTick >= FRAME_MS) {
        lastTick = now;
        const revealed = Math.floor(progress * chars.length);
        setGlyphs(
          chars.map((ch, i) => (ch === " " || i < revealed ? ch : randomChar())),
        );
      }
      frame = requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [active, animate, text, delay, duration]);

  const visible = status !== "idle" || (active && !animate);
  const chars = Array.from(text);

  return (
    <span className={className} style={style}>
      <span className={visible ? undefined : "invisible"}>
        {chars.map((ch, i) => {
          const glyph = glyphs?.[i] ?? ch;
          if (ch === " " || glyph === ch) return ch;
          return (
            <span key={i} className="relative inline-block">
              <span className="invisible">{ch}</span>
              <span className="absolute inset-0 text-center">{glyph}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
