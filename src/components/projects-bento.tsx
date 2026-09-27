"use client";

import { useRef, type Ref } from "react";
import type { ProjectItem } from "@/content";
import {
  SpotlightGlow,
  useGridPointer,
  type GridPointer,
} from "@/components/spotlight-grid";
import { useLocale } from "@/i18n/use-locale";

function ProjectCard({
  project,
  pointer,
  active,
}: {
  project: ProjectItem;
  pointer: GridPointer;
  active: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  const content = (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
        {project.stack}
      </p>
      <h3 className="mt-4 text-2xl font-semibold">{project.name}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{project.description}</p>
      {project.hrefLabel ? (
        <p className="mt-6 font-mono text-xs text-foreground/80">
          {project.hrefLabel}
        </p>
      ) : null}
    </>
  );

  const className = `relative overflow-hidden rounded-3xl border border-white/10 bg-card p-7 ${
    project.span === "wide" ? "md:col-span-2" : ""
  }`;

  if (project.href) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <SpotlightGlow pointer={pointer} active={active} cardRef={ref} />
        <div className="relative">{content}</div>
      </a>
    );
  }

  return (
    <article ref={ref} className={className}>
      <SpotlightGlow pointer={pointer} active={active} cardRef={ref} />
      <div className="relative">{content}</div>
    </article>
  );
}

export function ProjectsBento() {
  const { content } = useLocale();
  const { pointer, active, gridProps } = useGridPointer();

  return (
    <section id="projetos" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
        {content.ui.sections.projects}
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        {content.ui.sections.projectsTitle}
      </h2>
      <div className="mt-12 grid gap-4 md:grid-cols-2" {...gridProps}>
        {content.projects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            pointer={pointer}
            active={active}
          />
        ))}
      </div>
    </section>
  );
}
