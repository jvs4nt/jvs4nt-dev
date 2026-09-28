import type { PortfolioContent } from "@/content/types";

export const en: PortfolioContent = {
  profile: {
    name: "João Santos",
    role: "Full-Stack Developer",
    city: "São Paulo",
    email: "joaovit342@gmail.com",
    phone: "(11) 94702-1907",
    whatsapp: "https://wa.me/5511947021907",
    github: "https://github.com/jvs4nt",
    githubLabel: "github.com/jvs4nt",
    linkedin: "https://www.linkedin.com/in/jo%C3%A3o-santos-3b02a5220/",
    linkedinLabel: "linkedin.com/in/joão-santos-3b02a5220",
  },
  summary: [
    "Full-stack developer working with TypeScript, React, and Node.js since 2020. Experience with SQL and NoSQL, spec-driven development, and AI-agent workflows.",
    "End-to-end project cycle: Scrum planning, Git, tests, CI, and deploys on Vercel and Railway. Client communication in Portuguese and English.",
  ],
  stackPrimary: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Fastify",
    "Express",
    "NestJS",
    "PostgreSQL",
    "Drizzle",
    "Prisma",
    "Tailwind",
    "Git",
  ],
  stackSecondary: ["PHP", "Laravel", "Symfony", "React Native", "WordPress"],
  experience: [
    {
      title: "Senior Full-Stack Developer",
      company: "14Mob",
      period: "Apr/2025 — present",
      bullets: [
        "Building and maintaining systems with spec-driven development and AI tooling.",
        "End-to-end TypeScript apps: auth, PostgreSQL, dashboards, and continuous deploy.",
      ],
    },
    {
      title: "Mid-level Full-Stack Developer",
      company: "NocTech",
      period: "Feb/2025 — Apr/2025",
      bullets: [
        "NestJS API and React frontend on a short-term engagement.",
        "Partial communication in English, with positive feedback at the end of the contract.",
      ],
    },
    {
      title: "Full-Stack Developer / Web Analyst",
      company: "Electra Informatica Ltda",
      period: "Jan/2024 — Feb/2025",
      bullets: [
        "Full-stack work with PHP, Laravel, React, React Native, Node.js, and WordPress.",
        "Led client conversations, including a project run entirely in English.",
      ],
    },
    {
      title: "Junior Full-Stack Developer",
      company: "14Mob",
      period: "Feb/2023 — Nov/2023",
      bullets: [
        "Web applications with PHP and Laravel.",
        "Promoted to mid-level in Sep/2023, then shipped a Symfony project through Nov/2023.",
      ],
    },
    {
      title: "Freelancer",
      company: "Independent",
      period: "2020 — 2022",
      bullets: [
        "Landing pages, websites, stores, and portfolios alongside the ETEC technical program.",
      ],
    },
  ],
  projects: [
    {
      name: "DreamPlanner",
      description:
        "Hub for planning an apartment together: finances, documents, checklists, and a 3D editor in the browser.",
      stack: "Next.js · React Three Fiber · Drizzle · Neon · JWT httpOnly",
      href: "https://dream-planner-xi.vercel.app",
      hrefLabel: "dream-planner-xi.vercel.app",
      span: "wide",
    },
    {
      name: "Conduit",
      description:
        "Visual builder for AI conversational flows on a node canvas.",
      stack: "React · React Flow · Fastify · Drizzle · PostgreSQL",
      href: "https://conduit-mu-six.vercel.app",
      hrefLabel: "conduit-mu-six.vercel.app",
      span: "normal",
    },
    {
      name: "FinTrack",
      description:
        "Personal finance organizer with a REST API: fixed costs, months, cards, reserves, and a dashboard.",
      stack: "React · Express · Prisma · PostgreSQL",
      href: "https://github.com/jvs4nt/fintrack",
      hrefLabel: "github.com/jvs4nt/fintrack",
      span: "normal",
    },
    {
      name: "DCC-CLI",
      description:
        "TypeScript CLI that scans the workspace, generates .ai/ context per persona, and runs the Cursor Agent with a token budget.",
      stack: "TypeScript · Commander · Cursor Agent",
      span: "wide",
    },
  ],
  education: [
    {
      title: "Software Analysis and Development",
      place: "FIAP — Av. Paulista",
      period: "2023 — 2025",
      status: "Completed",
    },
    {
      title: "Internet Computing Technician",
      place: "ETEC — Francisco Morato",
      period: "Completed",
      status: "Completed",
    },
  ],
  courses: [
    {
      title: "Master AI Spec-Driven Development with BMAD Method",
      place: "BMAD v6 · TEA Framework · Context Engineering",
    },
    {
      title:
        "Professional Qualification Certificate in Mobile Application Development",
      place: "FIAP",
      period: "Dec/2024 — Dec/2035",
    },
    {
      title:
        "Professional Qualification Certificate in Web Development and Design 2.0",
      place: "FIAP",
      period: "Jul/2024",
    },
    {
      title: "Laravel Track: build web applications in PHP",
      place: "Alura",
      period: "Aug/2024",
    },
    {
      title: "Linux Fundamentals",
      place: "FIAP",
      period: "May/2024",
    },
    {
      title: "Social Education and Sustainability",
      place: "FIAP",
      period: "May/2024",
    },
    {
      title:
        "Professional Qualification in Systems Analysis and Web Prototyping",
      place: "FIAP",
      period: "Dec/2023",
    },
  ],
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "Advanced — Wizard by Pearson, 2012–2020" },
  ],
  nav: [
    { href: "#sobre", label: "About" },
    { href: "#experiencia", label: "Experience" },
    { href: "#projetos", label: "Projects" },
    { href: "#formacao", label: "Education" },
    { href: "#contato", label: "Contact" },
  ],
  ui: {
    skipToContent: "Skip to content",
    navAriaLabel: "Sections",
    github: "GitHub",
    stackAriaLabel: "Stack",
    heroTagline:
      "End-to-end TypeScript: React, Next.js, and Node.js, with database, auth, and deploy. Production products and client work in Portuguese and English.",
    languageToggle: {
      groupLabel: "Site language",
      pt: "Portuguese",
      en: "English",
    },
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mobileMenuAriaLabel: "Navigation menu",
    sections: {
      about: "About",
      experience: "Experience",
      experienceTitle: "Career path",
      projects: "Personal projects",
      projectsTitle: "End-to-end TypeScript products",
      education: "Education",
      educationTitle: "Study and languages",
    },
    education: {
      courseLabel: "Course",
      languageLabel: "Language",
    },
    projects: {
      visitSite: "Visit site",
      viewCode: "View code",
    },
    contact: {
      kicker: "Contact",
      title: "Shall we talk?",
      body: "Open to projects, conversations, and opportunities in end-to-end TypeScript.",
    },
  },
};
