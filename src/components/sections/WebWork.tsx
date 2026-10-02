import { webWork } from "@/content/web-work";
import { ArrowOut } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WebWork() {
  return (
    <section className="container-x pt-28" aria-labelledby="web-work">
      <Reveal>
        <SectionHeading
          eyebrow="02 · Web & systems"
          title={
            <span id="web-work">
              Also in production, <span className="font-serif italic text-accent">quietly</span>
            </span>
          }
          description="Government and enterprise systems people depend on every month. Mostly Laravel, some Next.js."
        />
      </Reveal>

      <Stagger className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {webWork.map((w) => {
          const Tag = w.href ? "a" : "div";
          return (
            <StaggerItem key={w.name} className="h-full">
              <Tag
                {...(w.href ? { href: w.href, target: "_blank", rel: "noreferrer noopener" } : {})}
                className="group flex h-full flex-col bg-ink p-7 transition-colors hover:bg-surface"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-dim">{w.stack}</p>
                <h3 className="mt-5 flex items-start justify-between gap-3 text-xl font-medium tracking-[-0.01em] text-fg">
                  {w.name}
                  {w.href && <ArrowOut className="mt-1.5 text-dim transition-colors group-hover:text-accent" />}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{w.summary}</p>
              </Tag>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
