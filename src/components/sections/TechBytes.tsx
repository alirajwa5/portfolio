"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { reels, techBytes } from "@/content/tech-bytes";
import { site } from "@/content/site";
import { ArrowOut } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlayIcon } from "@/components/ui/icons";

export function TechBytes() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragLimit, setDragLimit] = useState(0);

  useEffect(() => {
    const measure = () => {
      const v = viewportRef.current;
      const t = trackRef.current;
      if (!v || !t) return;
      setDragLimit(Math.max(0, t.scrollWidth - v.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section id="tech-bytes" className="scroll-mt-20 pt-28">
      <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <Reveal>
          <SectionHeading
            eyebrow="Content creation"
            title={
              <>
                {techBytes.heading}, <span className="font-serif italic text-accent">in Roman Urdu</span>
              </>
            }
            description={techBytes.intro}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="grid grid-cols-2 gap-6 border-l border-line pl-6">
            {techBytes.facts.map((f) => (
              <div key={f.label}>
                <dd className="text-3xl font-medium tracking-[-0.02em] text-fg">{f.value}</dd>
                <dt className="mt-1 text-sm text-muted">{f.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div ref={viewportRef} className="mt-12 overflow-hidden">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -dragLimit, right: 0 }}
          dragElastic={0.08}
          className="flex w-max cursor-grab gap-5 pl-[max(1.25rem,calc((100vw-1200px)/2+2rem))] pr-8 active:cursor-grabbing"
        >
          {reels.map((reel, i) => (
            <motion.article
              key={reel.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 5) * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative aspect-[9/16] w-[220px] shrink-0 overflow-hidden rounded-2xl border border-line bg-surface sm:w-[250px]"
            >
              <Image
                src={reel.cover}
                alt={`Cover of reel ${reel.n}: ${reel.title}`}
                fill
                sizes="250px"
                draggable={false}
                className="pointer-events-none select-none object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-16">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  {reel.series} · {String(reel.n).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm leading-snug text-fg">{reel.title}</p>
              </div>
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-fg backdrop-blur">
                <PlayIcon />
              </span>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <div className="container-x mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal>
          <p className="max-w-xl text-lg leading-relaxed text-muted">{techBytes.pipeline}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Production tools">
            {techBytes.tools.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="lg:justify-self-end">
          <a href={site.linkedin} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
            Watch on LinkedIn <ArrowOut />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
