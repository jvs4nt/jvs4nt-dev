import type { PortfolioContent } from "@/content/types";

export const ptBR: PortfolioContent = {
  profile: {
    name: "João Santos",
    role: "Desenvolvedor Full-Stack",
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
    "Desenvolvedor full-stack com atuação desde 2020 em TypeScript, React e Node.js. Experiência com SQL e NoSQL, spec-driven development e fluxos com agentes de IA.",
    "Ciclo completo de projeto: planejamento com Scrum, Git, testes, CI e deploy em Vercel e Railway. Comunicação com clientes em português e inglês.",
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
      title: "Desenvolvedor Full-Stack Senior",
      company: "14Mob",
      period: "Abr/2025 — atual",
      bullets: [
        "Desenvolvimento e manutenção de sistemas com spec-driven development e ferramentas de IA.",
        "Apps TypeScript de ponta a ponta: auth, PostgreSQL, dashboards e deploy contínuo.",
      ],
    },
    {
      title: "Desenvolvedor Full-Stack Pleno",
      company: "NocTech",
      period: "Fev/2025 — Abr/2025",
      bullets: [
        "API em NestJS e frontend em React em projeto de curta duração.",
        "Comunicação parcial em inglês, com feedback positivo ao encerrar o contrato.",
      ],
    },
    {
      title: "Desenvolvedor Full-Stack / Analista Web",
      company: "Electra Informatica Ltda",
      period: "Jan/2024 — Fev/2025",
      bullets: [
        "Full-stack com PHP, Laravel, React, React Native, Node.js e WordPress.",
        "Condução de clientes, incluindo projeto com comunicação 100% em inglês.",
      ],
    },
    {
      title: "Desenvolvedor Full Stack Junior",
      company: "14Mob",
      period: "Fev/2023 — Nov/2023",
      bullets: [
        "Desenvolvimento de aplicações web com PHP e Laravel.",
        "Evolução para Pleno em set/2023, com projeto em Symfony até nov/2023.",
      ],
    },
    {
      title: "Freelancer",
      company: "Autônomo",
      period: "2020 — 2022",
      bullets: [
        "Landing pages, sites, lojas virtuais e portfólios em paralelo ao técnico na ETEC.",
      ],
    },
  ],
  projects: [
    {
      name: "DreamPlanner",
      description:
        "Hub para planejar apartamento a dois: finanças, documentos, checklist e editor 3D no browser.",
      stack: "Next.js · React Three Fiber · Drizzle · Neon · JWT httpOnly",
      href: "https://dream-planner-xi.vercel.app",
      hrefLabel: "dream-planner-xi.vercel.app",
      span: "wide",
    },
    {
      name: "Conduit",
      description:
        "Builder visual de fluxos conversacionais com IA em canvas de nós.",
      stack: "React · React Flow · Fastify · Drizzle · PostgreSQL",
      href: "https://conduit-mu-six.vercel.app",
      hrefLabel: "conduit-mu-six.vercel.app",
      span: "normal",
    },
    {
      name: "FinTrack",
      description:
        "Organizador financeiro pessoal com API REST: fixos, meses, cartões, reservas e dashboard.",
      stack: "React · Express · Prisma · PostgreSQL",
      href: "https://github.com/jvs4nt/fintrack",
      hrefLabel: "github.com/jvs4nt/fintrack",
      span: "normal",
    },
    {
      name: "DCC-CLI",
      description:
        "CLI em TypeScript que varre o workspace, gera contexto .ai/ por persona e dispara o Cursor Agent com controle de orçamento de tokens.",
      stack: "TypeScript · Commander · Cursor Agent",
      span: "wide",
    },
  ],
  education: [
    {
      title: "Análise e Desenvolvimento de Software",
      place: "FIAP — Av. Paulista",
      period: "2023 — 2025",
      status: "Concluído",
    },
    {
      title: "Técnico em Informática para Internet",
      place: "ETEC — Francisco Morato",
      period: "Concluído",
      status: "Concluído",
    },
  ],
  courses: [
    {
      title: "Master AI Spec-Driven Development with BMAD Method",
      place: "BMAD v6 · TEA Framework · Context Engineering",
    },
    {
      title:
        "Certificado de Qualificação Profissional em Desenvolvimento de Aplicações Móveis",
      place: "FIAP",
      period: "Dez/2024 — Dez/2035",
    },
    {
      title:
        "Certificado de Qualificação Profissional em Desenvolvimento e Designer Web 2.0",
      place: "FIAP",
      period: "Jul/2024",
    },
    {
      title: "Formação Laravel: crie aplicações web em PHP",
      place: "Alura",
      period: "Ago/2024",
    },
    {
      title: "Linux Fundamentals",
      place: "FIAP",
      period: "Mai/2024",
    },
    {
      title: "Formação Social e Sustentabilidade",
      place: "FIAP",
      period: "Mai/2024",
    },
    {
      title:
        "Qualificação Profissional em Análise de Sistemas e Prototipação Web",
      place: "FIAP",
      period: "Dez/2023",
    },
  ],
  languages: [
    { name: "Português", level: "Nativo" },
    { name: "Inglês", level: "Avançado — Wizard by Pearson, 2012–2020" },
  ],
  nav: [
    { href: "#sobre", label: "Sobre" },
    { href: "#experiencia", label: "Experiência" },
    { href: "#projetos", label: "Projetos" },
    { href: "#formacao", label: "Formação" },
    { href: "#contato", label: "Contato" },
  ],
  ui: {
    skipToContent: "Pular para o conteúdo",
    navAriaLabel: "Seções",
    github: "GitHub",
    stackAriaLabel: "Stack",
    heroTagline:
      "TypeScript de ponta a ponta: React, Next.js e Node.js, com banco, autenticação e deploy. Projetos em produção e contato com clientes em português e inglês.",
    languageToggle: {
      groupLabel: "Idioma do site",
      pt: "Português",
      en: "Inglês",
    },
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    mobileMenuAriaLabel: "Menu de navegação",
    sections: {
      about: "Sobre",
      experience: "Experiência",
      experienceTitle: "Trajetória profissional",
      projects: "Projetos pessoais",
      projectsTitle: "Produtos TypeScript de ponta a ponta",
      education: "Formação",
      educationTitle: "Estudo e idiomas",
    },
    education: {
      courseLabel: "Curso",
      languageLabel: "Idioma",
    },
    contact: {
      kicker: "Contato",
      title: "Vamos conversar?",
      body: "Aberto a projetos, conversas e oportunidades em TypeScript de ponta a ponta.",
    },
  },
};
