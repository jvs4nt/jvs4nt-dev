"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BOOT_TIMINGS } from "@/components/ui/use-boot-sequence";

export function BootTerminal({
  visible,
  lines,
  skipHint,
}: {
  visible: boolean;
  lines: string[];
  skipHint: string;
}) {
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const step = Math.max(8, BOOT_TIMINGS.typing / Math.max(1, totalChars));
    const id = setInterval(() => {
      setTyped((count) => {
        if (count >= totalChars) {
          clearInterval(id);
          return count;
        }
        return count + 1;
      });
    }, step);
    return () => clearInterval(id);
  }, [totalChars]);

  const rendered = lines.map((line, i) => {
    const offset = lines
      .slice(0, i)
      .reduce((sum, prev) => sum + prev.length, 0);
    return line.slice(0, Math.max(0, typed - offset));
  });
  const typingLine = rendered.findIndex(
    (text, i) => text.length < lines[i].length,
  );
  const activeLine = typingLine === -1 ? lines.length - 1 : typingLine;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="boot-terminal"
          aria-hidden
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[70] flex flex-col bg-background px-6 py-10 font-mono text-sm text-muted sm:px-12 sm:text-base"
        >
          <div className="my-auto w-full max-w-2xl mx-auto space-y-2">
            {rendered.map((text, i) =>
              i <= activeLine ? (
                <p
                  key={i}
                  className={
                    i === lines.length - 1 ? "text-accent" : "text-foreground/80"
                  }
                >
                  {text}
                  {i === activeLine ? (
                    <span className="boot-cursor ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-accent" />
                  ) : null}
                </p>
              ) : null,
            )}
          </div>
          <p className="text-center text-xs text-muted/70">{skipHint}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
