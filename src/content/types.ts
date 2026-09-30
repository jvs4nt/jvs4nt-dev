export type ExperienceItem = {
  title: string;
  company: string;
  period: string;
  bullets: string[];
};

export type ProjectItem = {
  name: string;
  description: string;
  stack: string;
  href?: string;
  hrefLabel?: string;
  span: "wide" | "normal";
};

export type EducationItem = {
  title: string;
  place: string;
  period: string;
  status: string;
};

export type CourseItem = {
  title: string;
  place: string;
  period?: string;
};

export type LanguageItem = {
  name: string;
  level: string;
};

export type NavItem = {
  href: string;
  label: string;
};

export type PortfolioContent = {
  profile: {
    name: string;
    role: string;
    city: string;
    email: string;
    phone: string;
    whatsapp: string;
    github: string;
    githubLabel: string;
    linkedin: string;
    linkedinLabel: string;
  };
  summary: string[];
  stackPrimary: string[];
  stackSecondary: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  courses: CourseItem[];
  languages: LanguageItem[];
  nav: NavItem[];
  ui: {
    skipToContent: string;
    navAriaLabel: string;
    github: string;
    stackAriaLabel: string;
    heroTagline: string;
    boot: {
      lines: string[];
      skipHint: string;
    };
    languageToggle: {
      groupLabel: string;
      pt: string;
      en: string;
    };
    openMenu: string;
    closeMenu: string;
    mobileMenuAriaLabel: string;
    sections: {
      about: string;
      experience: string;
      experienceTitle: string;
      projects: string;
      projectsTitle: string;
      education: string;
      educationTitle: string;
    };
    education: {
      courseLabel: string;
      languageLabel: string;
    };
    projects: {
      visitSite: string;
      viewCode: string;
    };
    contact: {
      kicker: string;
      title: string;
      body: string;
    };
  };
};
