"use client";

import { createContext } from "react";
import type { Locale, PortfolioContent } from "@/content";

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  content: PortfolioContent;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);
