import { en } from "@/content/en";
import { ptBR } from "@/content/pt-BR";
import type { PortfolioContent } from "@/content/types";

export type Locale = "pt-BR" | "en";

export const DEFAULT_LOCALE: Locale = "pt-BR";
export const LOCALE_COOKIE = "portfolio-locale";
export const LOCALE_STORAGE_KEY = "portfolio-locale";

const dictionaries: Record<Locale, PortfolioContent> = {
  "pt-BR": ptBR,
  en,
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "pt-BR" || value === "en";
}

export function parseLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getContent(locale: Locale): PortfolioContent {
  return dictionaries[locale];
}

export type { PortfolioContent } from "@/content/types";
export type {
  CourseItem,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  NavItem,
  ProjectItem,
} from "@/content/types";
