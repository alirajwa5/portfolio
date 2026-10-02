import { site } from "@/content/site";
import { ArrowOut, ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

export function Contact() {
  return (
    <section id="contact" className="container-x scroll-mt-20 pt-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-surface/40 px-6 py-16 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-24 h-[420px] w-[420px] rounded-full bg-accent/15 blur-[120px]" />
          <p className="eyebrow">07 · Contact</p>
          <h2 className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.98] tracking-[-0.035em] text-fg">
            Let&apos;s build something that <span className="font-serif italic text-accent">actually ships.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted">
            AI agent architecture, offline-first Flutter, or a backend that has to hold up under real load. {site.location}, working remotely.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <ButtonLink href={`mailto:${site.email}`}>{site.email}</ButtonLink>
            </Magnetic>
            <a href={site.linkedin} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
              <LinkedInIcon /> LinkedIn <ArrowOut />
            </a>
            <a href={site.github} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
              <GitHubIcon /> GitHub <ArrowOut />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
