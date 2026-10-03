"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  GitBranch,
  MessageSquare,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { EASE_OUT } from "@/lib/motion";
import type { PreviewState } from "./types";

const NODE_W = 104;
const NODE_H = 30;
const PADDING = 12;

type NodePosition = { x: MotionValue<number>; y: MotionValue<number> };

type FlowNodeConfig = {
  label: string;
  icon: LucideIcon;
  fx: number;
  fy: number;
  tone: string;
};

const NODES: FlowNodeConfig[] = [
  { label: "Trigger", icon: Zap, fx: 0, fy: 0.12, tone: "text-amber-300" },
  { label: "AI agent", icon: Sparkles, fx: 0.5, fy: 0.5, tone: "text-accent" },
  { label: "If / else", icon: GitBranch, fx: 1, fy: 0.04, tone: "text-sky-300" },
  { label: "Reply", icon: MessageSquare, fx: 1, fy: 0.96, tone: "text-emerald-300" },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
];

function useNodePosition(): NodePosition {
  return { x: useMotionValue(0), y: useMotionValue(0) };
}

function edgePath([fx, fy, tx, ty]: number[]) {
  const sx = fx + NODE_W;
  const sy = fy + NODE_H / 2;
  const ex = tx;
  const ey = ty + NODE_H / 2;
  const curve = Math.max(28, Math.abs(ex - sx) / 2);
  return `M${sx} ${sy} C${sx + curve} ${sy} ${ex - curve} ${ey} ${ex} ${ey}`;
}

function FlowEdge({
  id,
  from,
  to,
  index,
  entered,
  playing,
  reduced,
}: {
  id: string;
  from: NodePosition;
  to: NodePosition;
  index: number;
  entered: boolean;
  playing: boolean;
  reduced: boolean;
}) {
  const d = useTransform([from.x, from.y, to.x, to.y], edgePath);

  return (
    <>
      <motion.path
        id={id}
        d={d}
        fill="none"
        stroke="rgb(139 92 246 / 0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: entered ? 1 : 0 }}
        transition={{
          duration: reduced ? 0 : 0.8,
          delay: 0.4 + index * 0.2,
          ease: EASE_OUT,
        }}
      />
      {playing ? (
        <circle r="3" fill="#ddd6fe">
          <animateMotion
            dur="2.2s"
            repeatCount="indefinite"
            begin={`${1.2 + index * 0.35}s`}
          >
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      ) : null}
    </>
  );
}

function FlowNode({
  config,
  position,
  index,
  entered,
  playing,
  reduced,
  constraints,
  onDragStart,
  onDragEnd,
}: {
  config: FlowNodeConfig;
  position: NodePosition;
  index: number;
  entered: boolean;
  playing: boolean;
  reduced: boolean;
  constraints: RefObject<HTMLDivElement | null>;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const Icon = config.icon;
  const isAgent = index === 1;

  return (
    <motion.div
      drag
      dragConstraints={constraints}
      dragElastic={0.08}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.08, zIndex: 10 }}
      whileHover={reduced ? undefined : { scale: 1.04 }}
      initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.7 }}
      animate={{ opacity: entered ? 1 : 0, scale: entered ? 1 : 0.7 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: reduced ? 0 : index * 0.12,
      }}
      style={{ x: position.x, y: position.y, width: NODE_W, height: NODE_H }}
      className="absolute left-0 top-0 flex cursor-grab touch-none select-none items-center gap-2 rounded-lg border border-white/10 bg-[#14141f] px-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)] active:cursor-grabbing"
    >
      {isAgent && playing ? (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-lg border border-accent"
          animate={{ opacity: [0.8, 0], scale: [1, 1.25] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      ) : null}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/5">
        <Icon size={11} className={config.tone} />
      </span>
      <span className="truncate font-mono text-[10px] text-foreground">
        {config.label}
      </span>
      <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-accent/60 bg-[#0a0a12]" />
      <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-accent/60 bg-[#0a0a12]" />
    </motion.div>
  );
}

export function ConduitPreview({ entered, playing, reduced }: PreviewState) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef<((event: Event) => void) | null>(null);
  const edgeId = useId().replace(/:/g, "");
  const positions = [
    useNodePosition(),
    useNodePosition(),
    useNodePosition(),
    useNodePosition(),
  ];
  const positionsRef = useRef(positions);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const layout = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const freeX = Math.max(0, width - PADDING * 2 - NODE_W);
      const freeY = Math.max(0, height - PADDING * 2 - NODE_H);
      NODES.forEach((node, index) => {
        positionsRef.current[index].x.set(PADDING + node.fx * freeX);
        positionsRef.current[index].y.set(PADDING + node.fy * freeY);
      });
    };

    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (suppressClickRef.current) {
        window.removeEventListener("click", suppressClickRef.current, true);
      }
    },
    [],
  );

  // The card is a link: a drag must not end in a click that opens it.
  function handleDragStart() {
    if (suppressClickRef.current) return;
    const suppress = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    suppressClickRef.current = suppress;
    window.addEventListener("click", suppress, true);
  }

  function handleDragEnd() {
    setTimeout(() => {
      if (!suppressClickRef.current) return;
      window.removeEventListener("click", suppressClickRef.current, true);
      suppressClickRef.current = null;
    }, 0);
  }

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle,rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[size:14px_14px]"
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        {EDGES.map(([from, to], index) => (
          <FlowEdge
            key={`${from}-${to}`}
            id={`${edgeId}-edge-${index}`}
            from={positions[from]}
            to={positions[to]}
            index={index}
            entered={entered}
            playing={playing}
            reduced={reduced}
          />
        ))}
      </svg>
      {NODES.map((node, index) => (
        <FlowNode
          key={node.label}
          config={node}
          position={positions[index]}
          index={index}
          entered={entered}
          playing={playing}
          reduced={reduced}
          constraints={canvasRef}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
}
