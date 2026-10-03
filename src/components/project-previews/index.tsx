"use client";

import { useRef, type ComponentType } from "react";
import { useInView } from "motion/react";
import type { ProjectItem, ProjectPreviewId } from "@/content";
import { useLocale } from "@/i18n/use-locale";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { CliPreview } from "./cli-preview";
import { ConduitPreview } from "./conduit-preview";
import { DreamPlannerPreview } from "./dreamplanner-preview";
import { FinTrackPreview } from "./fintrack-preview";
import { PreviewFrame } from "./preview-frame";
import type { PreviewState } from "./types";

type PreviewConfig = {
  component: ComponentType<PreviewState>;
  variant: "browser" | "terminal";
  interactive: boolean;
};

const PREVIEWS: Record<ProjectPreviewId, PreviewConfig> = {
  dreamplanner: {
    component: DreamPlannerPreview,
    variant: "browser",
    interactive: true,
  },
  conduit: { component: ConduitPreview, variant: "browser", interactive: true },
  fintrack: {
    component: FinTrackPreview,
    variant: "browser",
    interactive: true,
  },
  cli: { component: CliPreview, variant: "terminal", interactive: false },
};

export function ProjectPreview({
  project,
  hovered,
  className,
}: {
  project: ProjectItem;
  hovered: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { content } = useLocale();
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { amount: 0.35 });
  const entered = useInView(ref, { amount: 0.35, once: true });
  const { component: Preview, variant, interactive } = PREVIEWS[project.preview];
  const label =
    project.hrefLabel ?? `~/${project.name.toLowerCase()} — zsh`;

  return (
    <div ref={ref} aria-hidden className={className}>
      <PreviewFrame
        variant={variant}
        label={label}
        hint={interactive ? content.ui.projects.previewHint : undefined}
      >
        <Preview
          entered={entered || reduced}
          playing={inView && !reduced}
          hovered={hovered}
          reduced={reduced}
        />
      </PreviewFrame>
    </div>
  );
}
