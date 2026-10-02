import { education, freelance, roles } from "@/content/experience";
import { resume } from "@/content/resume";
import { site } from "@/content/site";
import { skillGroups } from "@/content/skills";
import { ArrowOut, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8" aria-label={title}>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-dim">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Resume() {
  return (
    <section id="resume" className="container-x scroll-mt-20 pt-28">
      <Reveal>
        <SectionHeading
          eyebrow="06 · Resume"
          title={
            <>
              The <span className="font-serif italic text-accent">one-page</span> version
            </>
          }
          description={`Same content as the PDF, updated ${site.resumeUpdated}.`}
        />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-line bg-surface/40 p-7">
            <p className="text-2xl font-medium tracking-[-0.02em] text-fg">{site.name}</p>
            <p className="mt-1 text-muted">{site.role}</p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li>{site.location}</li>
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-fg">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.linkedin} target="_blank" rel="noreferrer noopener" className="transition-colors hover:text-fg">
                  linkedin.com/in/alimohdrajwa
                </a>
              </li>
              <li>
                <a href={site.github} target="_blank" rel="noreferrer noopener" className="transition-colors hover:text-fg">
                  github.com/alirajwa5
                </a>
              </li>
            </ul>
            <ButtonLink href={site.resumePdf} external={false} download className="mt-7 w-full">
              Download PDF
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Block title="Summary">
            <p className="leading-relaxed text-muted">{resume.summary}</p>
          </Block>

          <Block title="Technical skills">
            <dl className="space-y-3">
              {skillGroups.map((g) => (
                <div key={g.title} className="grid gap-1 sm:grid-cols-[180px_1fr]">
                  <dt className="font-medium text-fg">{g.title}</dt>
                  <dd className="text-muted">{g.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block title="Professional experience">
            <ol className="space-y-7">
              {roles.map((r) => (
                <li key={`${r.title}-${r.period}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h4 className="font-medium text-fg">
                      {r.title}, <span className="font-normal text-muted">{r.company}, {r.location}</span>
                    </h4>
                    <p className="font-mono text-xs text-dim">{r.period}</p>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-muted">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Block>

          <Block title="Freelance projects">
            <ul className="space-y-2 text-muted">
              {freelance.map((f) => (
                <li key={f.name} className="flex gap-3">
                  <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
                  <span>
                    <a href={f.href} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 font-medium text-fg hover:text-accent">
                      {f.name} <ArrowOut />
                    </a>
                    : {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Content creation">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h4 className="font-medium text-fg">{resume.contentCreation.title}</h4>
              <p className="font-mono text-xs text-dim">{resume.contentCreation.period}</p>
            </div>
            <ul className="mt-2 space-y-1.5 text-muted">
              {resume.contentCreation.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Education">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h4 className="font-medium text-fg">
                {education.school}, <span className="font-normal text-muted">{education.location}</span>
              </h4>
              <p className="font-mono text-xs text-dim">{education.period}</p>
            </div>
            <p className="mt-1 italic text-muted">{education.degree}</p>
          </Block>
        </Reveal>
      </div>
    </section>
  );
}
