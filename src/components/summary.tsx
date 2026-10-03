"use client";

import { ScrollTextReveal } from "@/components/scroll-text-reveal";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/i18n/use-locale";

export function Summary() {
  const { content } = useLocale();

  return (
    <section id="sobre" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <SectionHeading kicker={content.ui.sections.about} />
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {content.summary.map((paragraph) => (
          <ScrollTextReveal
            key={paragraph}
            text={paragraph}
            className="text-lg leading-8 text-foreground/90"
          />
        ))}
      </div>
    </section>
  );
}
