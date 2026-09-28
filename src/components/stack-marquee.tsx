"use client";

import { ScrollReveal } from "@/components/scroll-reveal";
import { useLocale } from "@/i18n/use-locale";

const MIN_LOOP_ITEMS = 16;

function loopItems(items: string[]) {
  const copies = Math.max(2, Math.ceil(MIN_LOOP_ITEMS / Math.max(items.length, 1)));
  return Array.from({ length: copies }, () => items).flat();
}

function Track({
  items,
  direction,
}: {
  items: string[];
  direction: "left" | "right";
}) {
  const loop = loopItems(items);

  return (
    <div className="overflow-hidden border-y border-white/5 py-4">
      <ul
        className={`flex w-max gap-10 ${direction === "right" ? "marquee-track-reverse" : "marquee-track"}`}
      >
        {loop.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="font-mono text-sm uppercase tracking-[0.2em] text-muted"
            aria-hidden={index >= items.length}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StackMarquee() {
  const { content } = useLocale();

  return (
    <section aria-label={content.ui.stackAriaLabel} className="py-6">
      <ScrollReveal y={16}>
        <Track items={content.stackPrimary} direction="right" />
        <Track items={content.stackSecondary} direction="left" />
      </ScrollReveal>
    </section>
  );
}
