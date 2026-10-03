"use client";

import { motion, useTransform, type Variants } from "motion/react";
import { Check, FileText, Sofa, Wallet } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";
import type { PreviewState } from "./types";
import { useCountUp } from "./use-count-up";

const WALLS = [
  "M10 10 H210 V140 H10 Z",
  "M120 10 V78",
  "M120 100 V140",
  "M10 86 H78",
  "M98 86 H120",
];

const wallVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (index: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.9, delay: index * 0.12, ease: EASE_OUT },
  }),
};

const furnitureVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4, y: -10 },
  shown: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 18,
      delay: 0.7 + index * 0.08,
    },
  }),
};

const sofaLoop: Variants = {
  rest: { x: 0, transition: { duration: 0.4 } },
  loop: {
    x: [0, 0, 16, 16, 0],
    transition: {
      duration: 3.2,
      times: [0, 0.2, 0.45, 0.75, 1],
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1.2,
      delay: 1.8,
    },
  },
};

const cursorLoop: Variants = {
  rest: { opacity: 0 },
  loop: {
    opacity: [0, 1, 1, 1, 0],
    scale: [1, 0.85, 0.85, 0.85, 1],
    transition: {
      duration: 3.2,
      times: [0, 0.2, 0.45, 0.75, 1],
      repeat: Infinity,
      repeatDelay: 1.2,
      delay: 1.8,
    },
  },
};

const FURNITURE_STYLE = {
  transformBox: "fill-box",
  transformOrigin: "center",
} as const;

const CHECKLIST = [
  { icon: FileText, width: "72%" },
  { icon: Wallet, width: "58%" },
  { icon: Sofa, width: "80%" },
];

function formatBudget(value: number) {
  return `R$ ${Math.round(value).toLocaleString("pt-BR")}`;
}

export function DreamPlannerPreview({
  entered,
  playing,
  hovered,
  reduced,
}: PreviewState) {
  const budget = useCountUp(18400, entered, { delay: 0.9, instant: reduced });
  const budgetLabel = useTransform(budget, formatBudget);
  const isometric = hovered && !reduced;
  const animateState = entered ? "shown" : "hidden";
  const initialState = reduced ? "shown" : "hidden";

  return (
    <div className="grid h-full grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-3 p-3 sm:gap-4 sm:p-4">
      <div
        className="relative flex items-center justify-center"
        style={{ perspective: 900 }}
      >
        <motion.div
          className="relative w-full"
          animate={
            isometric
              ? { rotateX: 52, rotateZ: -32, scale: 0.86, y: -6 }
              : { rotateX: 0, rotateZ: 0, scale: 1, y: 0 }
          }
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.span
            className="absolute inset-x-6 -bottom-2 h-6 rounded-[50%] bg-accent/30 blur-xl"
            animate={{ opacity: isometric ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.svg
            viewBox="0 0 220 150"
            className="relative w-full overflow-visible"
            initial={initialState}
            animate={animateState}
          >
            <defs>
              <pattern
                id="dp-grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M10 0 H0 V10"
                  fill="none"
                  stroke="rgb(255 255 255 / 0.04)"
                  strokeWidth="0.6"
                />
              </pattern>
            </defs>
            <rect x="10" y="10" width="200" height="130" fill="url(#dp-grid)" />

            {WALLS.map((d, index) => (
              <motion.path
                key={d}
                d={d}
                custom={index}
                variants={wallVariants}
                fill="none"
                stroke="#a78bfa"
                strokeWidth={index === 0 ? 3 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            <motion.rect
              custom={0}
              variants={furnitureVariants}
              style={FURNITURE_STYLE}
              x="22"
              y="16"
              width="40"
              height="4"
              rx="2"
              fill="#c4b5fd"
            />
            <motion.rect
              custom={1}
              variants={furnitureVariants}
              style={FURNITURE_STYLE}
              x="34"
              y="34"
              width="26"
              height="13"
              rx="3"
              fill="rgb(139 92 246 / 0.35)"
              stroke="#8b5cf6"
              strokeWidth="1"
            />
            <motion.g
              custom={2}
              variants={furnitureVariants}
              style={FURNITURE_STYLE}
            >
              <motion.g
                variants={sofaLoop}
                initial="rest"
                animate={playing ? "loop" : "rest"}
              >
                <rect
                  x="22"
                  y="60"
                  width="50"
                  height="16"
                  rx="4"
                  fill="rgb(139 92 246 / 0.55)"
                />
                <rect x="25" y="63" width="21" height="8" rx="2" fill="#c4b5fd" opacity="0.6" />
                <rect x="48" y="63" width="21" height="8" rx="2" fill="#c4b5fd" opacity="0.6" />
                <motion.path
                  variants={cursorLoop}
                  d="M60 70 L60 84 L64 80 L67 87 L69.5 86 L66.5 79 L72 79 Z"
                  fill="#ffffff"
                  stroke="#07070b"
                  strokeWidth="1"
                  style={FURNITURE_STYLE}
                />
              </motion.g>
            </motion.g>
            <motion.circle
              custom={3}
              variants={furnitureVariants}
              style={FURNITURE_STYLE}
              cx="106"
              cy="22"
              r="5"
              fill="rgb(52 211 153 / 0.6)"
            />
            <motion.g
              custom={4}
              variants={furnitureVariants}
              style={FURNITURE_STYLE}
            >
              <rect x="140" y="22" width="52" height="60" rx="4" fill="rgb(139 92 246 / 0.4)" />
              <rect x="144" y="26" width="20" height="10" rx="2" fill="#ddd6fe" opacity="0.7" />
              <rect x="168" y="26" width="20" height="10" rx="2" fill="#ddd6fe" opacity="0.7" />
            </motion.g>
            <motion.rect
              custom={5}
              variants={furnitureVariants}
              style={FURNITURE_STYLE}
              x="134"
              y="122"
              width="62"
              height="11"
              rx="2"
              fill="rgb(96 165 250 / 0.45)"
            />
            <motion.path
              custom={6}
              variants={furnitureVariants}
              style={FURNITURE_STYLE}
              d="M15 96 H25 V125 H75 V135 H15 Z"
              fill="rgb(96 165 250 / 0.35)"
            />
            <motion.circle
              custom={7}
              variants={furnitureVariants}
              style={FURNITURE_STYLE}
              cx="92"
              cy="112"
              r="10"
              fill="rgb(139 92 246 / 0.3)"
              stroke="#8b5cf6"
              strokeWidth="1"
            />
            <motion.text
              custom={8}
              variants={furnitureVariants}
              x="200"
              y="134"
              textAnchor="end"
              className="fill-[#9b9bb0] font-mono"
              fontSize="7"
            >
              42 m²
            </motion.text>
          </motion.svg>
        </motion.div>
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-1.5">
              <span className="h-5 w-5 rounded-full border-2 border-[#0a0a12] bg-accent" />
              <span className="h-5 w-5 rounded-full border-2 border-[#0a0a12] bg-[#60a5fa]" />
            </div>
            <span className="font-mono text-[10px] text-muted">74%</span>
          </div>
          <motion.p className="mt-2 font-mono text-sm font-semibold text-foreground tabular-nums">
            {budgetLabel}
          </motion.p>
          <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-white/5">
            <motion.span
              className="h-full origin-left bg-accent"
              style={{ width: "41%" }}
              initial={{ scaleX: reduced ? 1 : 0 }}
              animate={{ scaleX: entered ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 1, delay: 0.9, ease: EASE_OUT }}
            />
            <motion.span
              className="h-full origin-left bg-[#60a5fa]"
              style={{ width: "33%" }}
              initial={{ scaleX: reduced ? 1 : 0 }}
              animate={{ scaleX: entered ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 1, delay: 1.3, ease: EASE_OUT }}
            />
          </div>
        </div>

        <ul className="space-y-2.5">
          {CHECKLIST.map(({ icon: Icon, width }, index) => (
            <li key={width} className="flex items-center gap-2">
              <motion.span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-accent/50"
                initial={false}
                animate={
                  entered
                    ? { backgroundColor: "#8b5cf6", borderColor: "#8b5cf6" }
                    : { backgroundColor: "rgba(0,0,0,0)" }
                }
                transition={{
                  duration: reduced ? 0 : 0.3,
                  delay: reduced ? 0 : 1.4 + index * 0.35,
                }}
              >
                <motion.span
                  initial={false}
                  animate={{ scale: entered ? 1 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: reduced ? 0 : 1.45 + index * 0.35,
                  }}
                >
                  <Check size={10} strokeWidth={3} className="text-white" />
                </motion.span>
              </motion.span>
              <Icon size={12} className="shrink-0 text-muted" />
              <span
                className="h-1.5 rounded-full bg-white/10"
                style={{ width }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
