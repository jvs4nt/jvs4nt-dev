"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BrazilFlag, UnitedStatesFlag } from "@/components/flag-icons";
import type { Locale } from "@/content";
import { useLocale } from "@/i18n/use-locale";

const OPTIONS: { locale: Locale; Flag: typeof BrazilFlag }[] = [
  { locale: "pt-BR", Flag: BrazilFlag },
  { locale: "en", Flag: UnitedStatesFlag },
];

export function LanguageToggle() {
  const { locale, setLocale, content } = useLocale();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <div
      role="group"
      aria-label={content.ui.languageToggle.groupLabel}
      className="relative flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5 md:p-1"
    >
      {OPTIONS.map(({ locale: option, Flag }) => {
        const active = locale === option;
        const label =
          option === "pt-BR"
            ? content.ui.languageToggle.pt
            : content.ui.languageToggle.en;

        return (
          <button
            key={option}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => {
              if (!active) setLocale(option);
            }}
            className="relative z-[1] flex h-7 w-7 items-center justify-center rounded-full md:h-8 md:w-9"
          >
            {active ? (
              <motion.span
                layoutId="language-toggle-active"
                className="absolute inset-0 rounded-full bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 400, damping: 30 }
                }
              />
            ) : null}
            <motion.span
              className="relative"
              animate={{
                opacity: active ? 1 : 0.55,
                scale: active ? 1.06 : 0.94,
              }}
              whileHover={reduceMotion ? undefined : { scale: 1.08, opacity: 1 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
            >
              <Flag className="h-3 w-[18px] overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.12)] md:h-4 md:w-6" />
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
