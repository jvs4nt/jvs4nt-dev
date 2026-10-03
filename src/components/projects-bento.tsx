"use client";

import { useState, type FocusEvent } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowUpRight, CodeXml, Globe } from "lucide-react";
import type { ProjectItem } from "@/content";
import { ProjectPreview } from "@/components/project-previews";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightGlow, useGridPointer } from "@/components/spotlight-grid";
import { useTilt } from "@/components/use-tilt";
import { useLocale } from "@/i18n/use-locale";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const chipVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.15 + index * 0.05, ease: EASE_OUT },
  }),
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function LaunchArrow() {
  return (
    <span className="relative inline-flex h-4 w-4 overflow-hidden">
      <ArrowUpRight
        size={16}
        aria-hidden
        className="absolute inset-0 transition-transform duration-300 group-hover:translate-x-4 group-hover:-translate-y-4 motion-reduce:transition-none"
      />
      <ArrowUpRight
        size={16}
        aria-hidden
        className="absolute inset-0 -translate-x-4 translate-y-4 transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0 motion-reduce:transition-none"
      />
    </span>
  );
}

function ProjectCard({
  project,
  index,
  total,
  reverse,
}: {
  project: ProjectItem;
  index: number;
  total: number;
  reverse: boolean;
}) {
  const { content: siteContent } = useLocale();
  const labels = siteContent.ui.projects;
  const [hovered, setHovered] = useState(false);
  const isWide = project.span === "wide";
  const tilt = useTilt(isWide ? 2 : 4);
  const isRepo = project.href?.includes("github.com") ?? false;
  const Icon = isRepo ? CodeXml : Globe;
  const chips = project.stack.split("·").map((chip) => chip.trim());

  const body = (
    <div className={cn("flex h-full flex-col", reverse && "md:order-2")}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-semibold">{project.name}</h3>
        <span className="pt-1.5 font-mono text-xs text-muted">
          <span className="text-accent">{pad(index + 1)}</span> / {pad(total)}
        </span>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted">{project.description}</p>
      <motion.ul
        className="mt-5 flex flex-wrap gap-2"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "-60px 0px" }}
      >
        {chips.map((chip, chipIndex) => (
          <motion.li
            key={chip}
            custom={chipIndex}
            variants={chipVariants}
            className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-muted transition-colors duration-300 group-hover:border-accent/30 group-hover:text-foreground/80"
          >
            {chip}
          </motion.li>
        ))}
      </motion.ul>
      {project.href ? (
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-foreground transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white">
            <Icon size={16} aria-hidden />
            {isRepo ? labels.viewCode : labels.visitSite}
            <LaunchArrow />
          </span>
          {project.hrefLabel ? (
            <span className="font-mono text-xs text-muted">
              {project.hrefLabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  const preview = (
    <ProjectPreview
      project={project}
      hovered={hovered}
      className={
        isWide
          ? "h-64 min-w-0 shrink-0 md:h-full md:min-h-[280px]"
          : "h-56 min-w-0 shrink-0"
      }
    />
  );

  const inner = isWide ? (
    <div
      className={cn(
        "relative grid h-full grid-cols-1 gap-7 md:items-stretch",
        reverse
          ? "md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
          : "md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]",
      )}
    >
      {body}
      {preview}
    </div>
  ) : (
    <div className="relative flex h-full flex-col gap-6">
      {preview}
      {body}
    </div>
  );

  const className =
    "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card p-5 transition-colors duration-300 hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-7";

  const interactionProps = {
    "data-spotlight-card": "",
    style: tilt.style,
    onPointerMove: tilt.onPointerMove,
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => {
      setHovered(false);
      tilt.onPointerLeave();
    },
    onFocus: () => setHovered(true),
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setHovered(false);
      }
    },
  };

  if (project.href) {
    return (
      <motion.a
        {...interactionProps}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        className={className}
      >
        <SpotlightGlow />
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.article {...interactionProps} className={className}>
      <SpotlightGlow />
      {inner}
    </motion.article>
  );
}

export function ProjectsBento() {
  const { content } = useLocale();
  const { gridProps } = useGridPointer();
  const total = content.projects.length;

  return (
    <section id="projetos" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <SectionHeading
        kicker={content.ui.sections.projects}
        title={content.ui.sections.projectsTitle}
        titleClassName="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl"
      />
      <div
        {...gridProps}
        className={`mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 ${gridProps.className}`}
      >
        {content.projects.map((project, index) => {
          const widesBefore = content.projects
            .slice(0, index)
            .filter((item) => item.span === "wide").length;
          const reverse = project.span === "wide" && widesBefore % 2 === 1;
          return (
            <ScrollReveal
              key={project.name}
              delay={Math.min((index % 2) * 0.08, 0.24)}
              className={project.span === "wide" ? "h-full md:col-span-2" : "h-full"}
            >
              <ProjectCard
                project={project}
                index={index}
                total={total}
                reverse={reverse}
              />
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
