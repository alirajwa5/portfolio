import { site } from "@/content/site";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line">
      <div className="container-x flex flex-col gap-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. {site.location}.
        </p>
        <div className="flex items-center gap-5">
          <a href={`mailto:${site.email}`} className="flex items-center gap-2 transition-colors hover:text-fg">
            <MailIcon /> Email
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 transition-colors hover:text-fg">
            <LinkedInIcon /> LinkedIn
          </a>
          <a href={site.github} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 transition-colors hover:text-fg">
            <GitHubIcon /> GitHub
          </a>
          <ScrollLink href="#top" offset={0} className="transition-colors hover:text-fg">
            Top ↑
          </ScrollLink>
        </div>
      </div>
      <p
        aria-hidden
        className="container-x select-none whitespace-nowrap pb-2 font-serif text-[11.4vw] italic leading-[0.85] tracking-[-0.03em] text-surface-2"
      >
        {site.name}
      </p>
    </footer>
  );
}
