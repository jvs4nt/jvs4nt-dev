"use client";

import { useLocale } from "@/i18n/use-locale";

export function Summary() {
  const { content } = useLocale();

  return (
    <section id="sobre" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
        {content.ui.sections.about}
      </p>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {content.summary.map((paragraph) => (
          <p key={paragraph} className="text-lg leading-8 text-muted">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
