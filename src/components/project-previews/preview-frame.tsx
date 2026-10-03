import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PreviewFrameProps = {
  variant: "browser" | "terminal";
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

const DOTS = [
  "group-hover:bg-[#ff5f57]",
  "group-hover:bg-[#febc2e]",
  "group-hover:bg-[#28c840]",
];

export function PreviewFrame({
  variant,
  label,
  hint,
  children,
  className,
}: PreviewFrameProps) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a12] shadow-[0_24px_60px_-32px_rgba(139,92,246,0.55)] transition-colors duration-300 group-hover:border-accent/30",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/5 bg-white/[0.02] px-3 py-2">
        <div className="flex shrink-0 gap-1.5">
          {DOTS.map((hover, index) => (
            <span
              key={hover}
              className={cn(
                "h-2 w-2 rounded-full bg-white/15 transition-colors duration-300",
                hover,
              )}
              style={{ transitionDelay: `${index * 60}ms` }}
            />
          ))}
        </div>
        {variant === "browser" ? (
          <div className="min-w-0 flex-1 truncate rounded-md bg-white/5 px-2 py-0.5 text-center font-mono text-[10px] text-muted">
            {label}
          </div>
        ) : (
          <div className="min-w-0 flex-1 truncate font-mono text-[10px] text-muted">
            {label}
          </div>
        )}
        {hint ? (
          <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
            {hint}
          </span>
        ) : null}
      </div>
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0">{children}</div>
      </div>
    </div>
  );
}
