"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useTransform } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { PreviewState } from "./types";
import { useCountUp } from "./use-count-up";

const MONTHS = [
  { label: "J", value: 2140 },
  { label: "F", value: 1680 },
  { label: "M", value: 2620 },
  { label: "A", value: 1920 },
  { label: "M", value: 2980 },
  { label: "J", value: 3410 },
];

const MAX_VALUE = Math.max(...MONTHS.map((month) => month.value));

const CATEGORIES = [
  { share: 0.46, color: "#8b5cf6" },
  { share: 0.3, color: "#60a5fa" },
  { share: 0.24, color: "#34d399" },
];

const TRANSACTIONS = [
  { amount: "+ R$ 320", up: true },
  { amount: "- R$ 89", up: false },
  { amount: "+ R$ 1.2k", up: true },
  { amount: "- R$ 45", up: false },
];

function formatCurrency(value: number) {
  return `R$ ${Math.round(value).toLocaleString("pt-BR")}`;
}

function formatShort(value: number) {
  return `R$ ${(value / 1000).toFixed(1)}k`;
}

function Donut({ entered, reduced }: { entered: boolean; reduced: boolean }) {
  const offsets = CATEGORIES.reduce<number[]>(
    (acc, category, index) => [
      ...acc,
      index === 0 ? 0 : acc[index - 1] + CATEGORIES[index - 1].share,
    ],
    [],
  );

  return (
    <svg viewBox="0 0 56 56" className="h-14 w-14 shrink-0 -rotate-90">
      <circle
        cx="28"
        cy="28"
        r="21"
        fill="none"
        stroke="rgb(255 255 255 / 0.06)"
        strokeWidth="7"
      />
      {CATEGORIES.map((category, index) => (
        <motion.circle
          key={category.color}
          cx="28"
          cy="28"
          r="21"
          fill="none"
          stroke={category.color}
          strokeWidth="7"
          initial={{
            pathOffset: offsets[index],
            pathLength: reduced ? category.share - 0.015 : 0,
          }}
          animate={{
            pathOffset: offsets[index],
            pathLength: entered ? category.share - 0.015 : 0,
          }}
          transition={{
            duration: reduced ? 0 : 0.9,
            delay: reduced ? 0 : 0.5 + index * 0.25,
            ease: EASE_OUT,
          }}
        />
      ))}
    </svg>
  );
}

export function FinTrackPreview({
  entered,
  playing,
  reduced,
}: PreviewState) {
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [transaction, setTransaction] = useState(0);
  const balance = useCountUp(12480, entered, { delay: 0.3, instant: reduced });
  const balanceLabel = useTransform(balance, formatCurrency);
  const highlighted = activeBar ?? MONTHS.length - 1;

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setTransaction((current) => (current + 1) % TRANSACTIONS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [playing]);

  const current = TRANSACTIONS[transaction];
  const TrendIcon = current.up ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="block h-1.5 w-14 rounded-full bg-white/10" />
          <motion.p className="mt-2 font-mono text-lg font-semibold text-foreground tabular-nums">
            {balanceLabel}
          </motion.p>
          <div className="relative mt-1 h-5 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={transaction}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[10px]",
                  current.up
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-rose-400/10 text-rose-300",
                )}
              >
                <TrendIcon size={10} />
                {current.amount}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <Donut entered={entered} reduced={reduced} />
      </div>

      <div
        className="flex min-h-0 flex-1 items-end gap-2"
        onPointerLeave={() => setActiveBar(null)}
      >
        {MONTHS.map((month, index) => {
          const isActive = index === highlighted;
          return (
            <div
              key={`${month.label}-${index}`}
              className="relative flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              onPointerEnter={() => setActiveBar(index)}
            >
              <div className="relative w-full flex-1">
                <AnimatePresence>
                  {isActive && entered ? (
                    <motion.span
                      key="tooltip"
                      initial={{ opacity: 0, x: "-50%", y: 4, scale: 0.9 }}
                      animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: "-50%", y: 4, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 z-10 whitespace-nowrap rounded-md border border-accent/40 bg-[#14141f] px-1.5 py-0.5 font-mono text-[9px] text-foreground"
                      style={{
                        bottom: `calc(${(month.value / MAX_VALUE) * 78}% + 4px)`,
                      }}
                    >
                      {formatShort(month.value)}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
                <motion.span
                  className={cn(
                    "absolute inset-x-0 bottom-0 origin-bottom rounded-t-md transition-[background-color,box-shadow] duration-300",
                    isActive
                      ? "bg-accent shadow-[0_0_16px_rgba(139,92,246,0.6)]"
                      : "bg-accent/25",
                  )}
                  style={{ height: `${(month.value / MAX_VALUE) * 78}%` }}
                  initial={{ scaleY: reduced ? 1 : 0 }}
                  animate={{ scaleY: entered ? 1 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 16,
                    delay: reduced ? 0 : 0.4 + index * 0.08,
                  }}
                />
              </div>
              <span
                className={cn(
                  "font-mono text-[9px] transition-colors",
                  isActive ? "text-foreground" : "text-muted",
                )}
              >
                {month.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
