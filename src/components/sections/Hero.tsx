"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { site, stats } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Magnetic } from "@/components/ui/Magnetic";
import { SplitWords } from "@/components/ui/SplitWords";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

const EASE = [0.16, 1, 0.3, 1] as const;
const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-10 sm:pt-44">
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[620px] w-[620px] rounded-full bg-accent/10 blur-[140px]" />

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.p className="eyebrow" {...fade(0.05)}>
            {site.position} · {site.location}
          </motion.p>

          <h1 className="mt-7 text-[clamp(2.9rem,8.4vw,7.6rem)] font-medium leading-[0.94] tracking-[-0.04em] text-fg">
            <SplitWords text="Ali Muhammad" />
            <br />
            <SplitWords text="Rajwa" delay={0.18} className="font-serif font-normal italic tracking-[-0.02em] text-accent" />
          </h1>

          <motion.p className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl" {...fade(0.45)}>
            I build <em className="font-serif text-[1.15em] italic text-fg">AI agents that can&apos;t go rogue</em>,
            mobile apps that work with no signal, and backends that bill 25,000+ accounts a month.
          </motion.p>

          <motion.div className="mt-10 flex flex-wrap items-center gap-3" {...fade(0.6)}>
            <Magnetic>
              <ButtonLink href={`mailto:${site.email}`}>Email me</ButtonLink>
            </Magnetic>
            <ButtonLink href={site.resumePdf} variant="ghost" external={false} download>
              Download resume
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
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="btn btn-ghost h-11 w-11 !p-0"
            >
              <GitHubIcon />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-[440px]"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}
        >
          <div className="pointer-events-none absolute -inset-8 rounded-full bg-accent/15 blur-[90px]" />
          <div className="portrait-mask relative aspect-square overflow-hidden rounded-[2rem]">
            <Image
              src={site.portrait}
              alt={`${site.name}, portrait`}
              fill
              priority
              sizes="(min-width: 1024px) 440px, 80vw"
              className="object-cover"
            />
          </div>
          <motion.div className="absolute bottom-5 left-5 chip border-line/80 bg-ink/70 backdrop-blur" {...fade(1)}>
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {site.role}
          </motion.div>
        </motion.div>
      </div>

      <motion.dl className="container-x mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 sm:grid-cols-4" {...fade(0.8)}>
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="order-2 mt-1 text-sm text-muted">{s.label}</dt>
            <dd className="text-4xl font-medium tracking-[-0.03em] text-fg sm:text-5xl">
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
