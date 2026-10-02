import { skillGroups } from "@/content/skills";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="container-x scroll-mt-20 pt-28">
      <Reveal>
        <SectionHeading
          eyebrow="03 · Skills"
          title={
            <>
              The stack I ship with, <span className="font-serif italic text-accent">daily</span>
            </>
          }
          description="Backend first, then the app on top of it, then the agent layer that makes it think."
        />
      </Reveal>

      <Stagger className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g) => (
          <StaggerItem key={g.title}>
            <div className="h-full rounded-3xl border border-line bg-surface/40 p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-dim">{g.title}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-line bg-ink px-3 py-2 text-sm text-fg transition-[transform,border-color,color] duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
