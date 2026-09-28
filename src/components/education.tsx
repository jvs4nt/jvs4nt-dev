"use client";

import type { ReactNode } from "react";
import { SpotlightGlow, useGridPointer } from "@/components/spotlight-grid";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLocale } from "@/i18n/use-locale";

function EducationCard({ children }: { children: ReactNode }) {
  return (
    <article
      data-spotlight-card
      className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-card p-6"
    >
      <SpotlightGlow />
      <div className="relative z-[1]">{children}</div>
    </article>
  );
}

export function Education() {
  const { content } = useLocale();
  const { gridProps } = useGridPointer();

  return (
    <section
      id="formacao"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24"
    >
      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
          {content.ui.sections.education}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {content.ui.sections.educationTitle}
        </h2>
      </ScrollReveal>
      <div
        {...gridProps}
        className={`mt-12 grid gap-6 md:grid-cols-2 ${gridProps.className}`}
      >
        {content.education.map((item, index) => (
          <ScrollReveal
            key={item.title}
            delay={Math.min(index * 0.06, 0.24)}
            className="h-full"
          >
            <EducationCard>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {item.period}
              </p>
              <h3 className="mt-3 text-xl font-medium">{item.title}</h3>
              <p className="mt-2 text-muted">{item.place}</p>
            </EducationCard>
          </ScrollReveal>
        ))}
        {content.courses.map((item, index) => (
          <ScrollReveal
            key={item.title}
            delay={Math.min(index * 0.06, 0.24)}
            className="h-full"
          >
            <EducationCard>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {item.period
                  ? `${content.ui.education.courseLabel} · ${item.period}`
                  : content.ui.education.courseLabel}
              </p>
              <h3 className="mt-3 text-xl font-medium">{item.title}</h3>
              <p className="mt-2 text-muted">{item.place}</p>
            </EducationCard>
          </ScrollReveal>
        ))}
        {content.languages.map((item, index) => (
          <ScrollReveal
            key={item.name}
            delay={Math.min(index * 0.06, 0.24)}
            className="h-full"
          >
            <EducationCard>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {content.ui.education.languageLabel}
              </p>
              <h3 className="mt-3 text-xl font-medium">{item.name}</h3>
              <p className="mt-2 text-muted">{item.level}</p>
            </EducationCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
