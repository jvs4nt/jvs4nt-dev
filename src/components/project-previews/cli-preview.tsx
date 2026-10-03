"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { PreviewState } from "./types";

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string; tone: "ok" | "accent" | "muted" }
  | { kind: "budget" }
  | { kind: "run" };

const LINES: Line[] = [
  { kind: "cmd", text: "dcc scan ." },
  { kind: "out", text: "✓ 128 files indexed · 14 packages", tone: "ok" },
  { kind: "cmd", text: "dcc context --persona dev,qa,pm" },
  { kind: "out", text: "  + .ai/dev.md", tone: "accent" },
  { kind: "out", text: "  + .ai/qa.md", tone: "accent" },
  { kind: "out", text: "  + .ai/pm.md", tone: "accent" },
  { kind: "budget" },
  { kind: "cmd", text: "dcc run --agent cursor" },
  { kind: "run" },
];

const STEP_DELAY: Record<Exclude<Line["kind"], "cmd">, number> = {
  out: 260,
  budget: 1500,
  run: 3400,
};

const BUDGET = 0.62;

const TONES = {
  ok: "text-emerald-300",
  accent: "text-[#c4b5fd]",
  muted: "text-muted",
};

function TypedText({
  text,
  active,
  onDone,
}: {
  text: string;
  active: boolean;
  onDone: () => void;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (count >= text.length) {
      const timeout = setTimeout(onDone, 320);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(
      () => setCount((value) => value + 1),
      32 + Math.random() * 40,
    );
    return () => clearTimeout(timeout);
  }, [active, count, text.length, onDone]);

  return <>{text.slice(0, count)}</>;
}

function Cursor() {
  return (
    <span className="boot-cursor ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-[#c4b5fd]" />
  );
}

function BudgetLine({ animated }: { animated: boolean }) {
  return (
    <div className="flex items-center gap-2 text-muted">
      <span>tokens</span>
      <span className="relative h-1.5 w-28 overflow-hidden rounded-full bg-white/10 sm:w-36">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-[#60a5fa]"
          initial={{ width: animated ? "0%" : `${BUDGET * 100}%` }}
          animate={{ width: `${BUDGET * 100}%` }}
          transition={{ duration: animated ? 1.2 : 0, ease: EASE_OUT }}
        />
      </span>
      <span className="text-foreground">62%</span>
      <span className="hidden sm:inline">· 24.8k / 40k</span>
    </div>
  );
}

function RunLine({ animated }: { animated: boolean }) {
  return (
    <div className="flex items-center gap-2 text-emerald-300">
      <span className="relative flex h-2 w-2">
        {animated ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
        ) : null}
        <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      cursor-agent running
      {animated ? (
        <motion.span
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          ...
        </motion.span>
      ) : (
        "..."
      )}
    </div>
  );
}

export function CliPreview({ playing, reduced }: PreviewState) {
  const [{ step, cycle }, setProgress] = useState({ step: 0, cycle: 0 });
  const visibleStep = reduced ? LINES.length : step;

  const advance = useCallback(() => {
    setProgress(({ step: current, cycle: currentCycle }) =>
      current + 1 >= LINES.length
        ? { step: 0, cycle: currentCycle + 1 }
        : { step: current + 1, cycle: currentCycle },
    );
  }, []);

  useEffect(() => {
    if (!playing) return;
    const line = LINES[step];
    if (!line || line.kind === "cmd") return;
    const timeout = setTimeout(advance, STEP_DELAY[line.kind]);
    return () => clearTimeout(timeout);
  }, [playing, step, advance]);

  return (
    <div className="h-full overflow-hidden p-4 font-mono text-[11px] leading-[1.75]">
      {LINES.map((line, index) => {
        if (index > visibleStep) return null;
        const isCurrent = index === visibleStep;
        const key = `${cycle}-${index}`;

        if (line.kind === "cmd") {
          return (
            <div key={key} className="flex text-foreground">
              <span className="mr-2 text-accent">❯</span>
              <span className="whitespace-pre">
                {isCurrent ? (
                  <TypedText text={line.text} active={playing} onDone={advance} />
                ) : (
                  line.text
                )}
              </span>
              {isCurrent ? <Cursor /> : null}
            </div>
          );
        }

        return (
          <motion.div
            key={key}
            initial={reduced ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            {line.kind === "out" ? (
              <span className={cn("whitespace-pre", TONES[line.tone])}>
                {line.text}
              </span>
            ) : line.kind === "budget" ? (
              <BudgetLine animated={!reduced} />
            ) : (
              <RunLine animated={!reduced} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
