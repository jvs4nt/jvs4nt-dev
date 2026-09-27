"use client";

import { useRef, type ReactNode } from "react";
import {
  SpotlightGlow,
  useGridPointer,
  type GridPointer,
} from "@/components/spotlight-grid";
import { useLocale } from "@/i18n/use-locale";

function EducationCard({
  pointer,
  active,
  children,
}: {
  pointer: GridPointer;
  active: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  return (
    <article
      ref={ref}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-card p-6"
    >
      <SpotlightGlow pointer={pointer} active={active} cardRef={ref} />
      <div className="relative z-[1]">{children}</div>
    </article>
  );
}

export function Education() {
  const { content } = useLocale();
  const { pointer, active, gridProps } = useGridPointer();

  return (
    <section
      id="formacao"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24"
    >
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
        {content.ui.sections.education}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {content.ui.sections.educationTitle}
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-2" {...gridProps}>
        {content.education.map((item) => (
          <EducationCard key={item.title} pointer={pointer} active={active}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {item.period}
            </p>
            <h3 className="mt-3 text-xl font-medium">{item.title}</h3>
            <p className="mt-2 text-muted">{item.place}</p>
          </EducationCard>
        ))}
        {content.courses.map((item) => (
          <EducationCard key={item.title} pointer={pointer} active={active}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {item.period
                ? `${content.ui.education.courseLabel} · ${item.period}`
                : content.ui.education.courseLabel}
            </p>
            <h3 className="mt-3 text-xl font-medium">{item.title}</h3>
            <p className="mt-2 text-muted">{item.place}</p>
          </EducationCard>
        ))}
        {content.languages.map((item) => (
          <EducationCard key={item.name} pointer={pointer} active={active}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {content.ui.education.languageLabel}
            </p>
            <h3 className="mt-3 text-xl font-medium">{item.name}</h3>
            <p className="mt-2 text-muted">{item.level}</p>
          </EducationCard>
        ))}
      </div>
    </section>
  );
}
