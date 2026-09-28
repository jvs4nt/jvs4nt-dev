"use client";

import { ArrowUpRight, CodeXml, Globe } from "lucide-react";
import type { ProjectItem } from "@/content";
import { SpotlightGlow, useGridPointer } from "@/components/spotlight-grid";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLocale } from "@/i18n/use-locale";

function ProjectCard({ project }: { project: ProjectItem }) {
  const { content: siteContent } = useLocale();
  const labels = siteContent.ui.projects;
  const isRepo = project.href?.includes("github.com") ?? false;
  const Icon = isRepo ? CodeXml : Globe;

  const content = (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
        {project.stack}
      </p>
      <h3 className="mt-4 text-2xl font-semibold">{project.name}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{project.description}</p>
      {project.href ? (
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-foreground transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white">
            <Icon size={16} aria-hidden />
            {isRepo ? labels.viewCode : labels.visitSite}
            <ArrowUpRight
              size={16}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
          {project.hrefLabel ? (
            <span className="font-mono text-xs text-muted">
              {project.hrefLabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </>
  );

  const className =
    "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card p-7";

  if (project.href) {
    return (
      <a
        data-spotlight-card
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <SpotlightGlow />
        <div className="relative flex h-full flex-col">{content}</div>
      </a>
    );
  }

  return (
    <article data-spotlight-card className={className}>
      <SpotlightGlow />
      <div className="relative flex h-full flex-col">{content}</div>
    </article>
  );
}

export function ProjectsBento() {
  const { content } = useLocale();
  const { gridProps } = useGridPointer();

  return (
    <section id="projetos" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
          {content.ui.sections.projects}
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {content.ui.sections.projectsTitle}
        </h2>
      </ScrollReveal>
      <div
        {...gridProps}
        className={`mt-12 grid gap-4 md:grid-cols-2 ${gridProps.className}`}
      >
        {content.projects.map((project, index) => (
          <ScrollReveal
            key={project.name}
            delay={Math.min(index * 0.06, 0.24)}
            className={project.span === "wide" ? "h-full md:col-span-2" : "h-full"}
          >
            <ProjectCard project={project} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
