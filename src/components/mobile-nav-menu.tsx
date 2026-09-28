"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { NavItem } from "@/content";

export function MobileNavMenu({
  open,
  onClose,
  nav,
  title,
  closeLabel,
}: {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  title: string;
  closeLabel: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const fade = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  const overlay = (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[70] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
        >
          <button
            type="button"
            aria-label={closeLabel}
            className="absolute inset-0 bg-background/55 backdrop-blur-xl"
            onClick={onClose}
          />

          <div className="relative flex h-full flex-col bg-white/[0.03] px-6 pb-10 pt-6">
            <button
              ref={closeRef}
              type="button"
              aria-label={closeLabel}
              onClick={onClose}
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-foreground"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <nav className="flex flex-1 flex-col justify-center">
              <ul className="space-y-2">
                {nav.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 18 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            duration: 0.4,
                            delay: 0.06 + index * 0.05,
                            ease: [0.22, 1, 0.36, 1],
                          }
                    }
                  >
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="block py-3 text-4xl font-semibold tracking-tight text-foreground"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}
