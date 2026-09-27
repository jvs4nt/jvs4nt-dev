import { ContactFooter } from "@/components/contact-footer";
import { Education } from "@/components/education";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Hero } from "@/components/hero";
import { ProjectsBento } from "@/components/projects-bento";
import { SiteNav } from "@/components/site-nav";
import { SkipLink } from "@/components/skip-link";
import { StackMarquee } from "@/components/stack-marquee";
import { Summary } from "@/components/summary";

export default function Home() {
  return (
    <div className="relative z-10">
      <SkipLink />
      <SiteNav />
      <main>
        <Hero />
        <Summary />
        <StackMarquee />
        <ExperienceTimeline />
        <ProjectsBento />
        <Education />
      </main>
      <ContactFooter />
    </div>
  );
}
