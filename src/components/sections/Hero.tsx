import { site, stats } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Magnetic } from "@/components/ui/Magnetic";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { CharRise } from "@/components/hero/CharRise";
import { HeroStage } from "@/components/hero/HeroStage";
import { ScrollDrift } from "@/components/hero/ScrollDrift";
import { WatchIntroButton } from "@/components/hero/WatchIntroButton";

const at = (seconds: number) => ({ animationDelay: `${seconds}s` });

/** Scene 01. The opening runs in CSS (see `.char`, `.reveal-up`, `.stage-wipe` in globals.css). */
export function Hero() {
  return (
    <section id="intro" aria-label="Introduction" className="relative overflow-hidden pb-10 pt-32 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] h-[620px] w-[620px] rounded-full bg-accent/10 blur-[140px]" />

      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <ScrollDrift y={[0, -70]} opacity={[1, 0.15]}>
          <p className="eyebrow reveal-up" style={at(0.45)}>
            01 · {site.position} · {site.location}
          </p>

          <h1 className="mt-7 text-[clamp(2.9rem,8.2vw,7.4rem)] font-medium leading-[0.94] tracking-[-0.04em] text-fg">
            <span className="sr-only">{site.name}</span>
            <span aria-hidden>
              <CharRise text="Ali Muhammad" delay={0.55} />
              <br />
              <CharRise text="Rajwa" delay={0.95} className="font-serif font-normal italic tracking-[-0.02em] text-accent" />
            </span>
          </h1>

          <p className="reveal-up mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl" style={at(1.15)}>
            I build <em className="font-serif text-[1.15em] italic text-fg">AI agents that can&apos;t go rogue</em>, mobile apps that
            work with no signal, and backends that bill 25,000+ accounts a month.
          </p>

          <div className="reveal-up mt-10 flex flex-wrap items-center gap-3" style={at(1.3)}>
            <Magnetic>
              <ButtonLink href={`mailto:${site.email}`}>Email me</ButtonLink>
            </Magnetic>
            <WatchIntroButton />
            <ButtonLink href={site.resumePdf} variant="ghost" external={false} download>
              Resume
            </ButtonLink>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="btn btn-ghost h-11 w-11 !p-0"
            >
              <LinkedInIcon />
            </a>
            <a href={site.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub" className="btn btn-ghost h-11 w-11 !p-0">
              <GitHubIcon />
            </a>
          </div>
        </ScrollDrift>

        <ScrollDrift y={[0, 40]} scale={[1, 0.93]}>
          <HeroStage />
        </ScrollDrift>
      </div>

      <dl className="reveal-up container-x mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 sm:grid-cols-4" style={at(1.5)}>
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse">
            <dt className="mt-1 text-sm text-muted">{s.label}</dt>
            <dd className="text-4xl font-medium tracking-[-0.03em] text-fg sm:text-5xl">
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
