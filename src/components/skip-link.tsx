"use client";

import { useLocale } from "@/i18n/use-locale";

export function SkipLink() {
  const { content } = useLocale();

  return (
    <a
      href="#sobre"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
    >
      {content.ui.skipToContent}
    </a>
  );
}
