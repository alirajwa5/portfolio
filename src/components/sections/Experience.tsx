"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { education, roles } from "@/content/experience";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 75%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const [year, setYear] = useState(roles[0].year);

  return (
    <section id="experience" className="container-x scroll-mt-20 pt-28">
      <Reveal>
        <SectionHeading
          eyebrow="04 · Experience"
          title={
            <>
              Five years, <span className="font-serif italic text-accent">eight roles</span>
            </>
          }
          description="Gilgit and Karachi. Government billing to AI agent teams, with a lot of Flutter in between."
        />
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <p className="eyebrow">Year</p>
            <div className="relative mt-2 h-[9rem] overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.p
                  key={year}
                  initial={{ y: "60%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-60%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="font-serif text-[9rem] italic leading-none tracking-[-0.04em] text-fg"
                >
                  {year}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-4 max-w-xs text-muted">Jan 2021 → today. Scroll the roles and the year follows.</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-line" aria-hidden />
          <motion.div
            className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-accent"
            style={{ scaleY }}
            aria-hidden
          />
          <ol ref={listRef} className="space-y-12">
            {roles.map((role, i) => (
              <motion.li
                key={`${role.title}-${role.period}`}
                className="relative pl-10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.8, ease: EASE, delay: i === 0 ? 0.1 : 0 }}
              >
                <span className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-ink bg-accent" aria-hidden />
                {/* Year tracker: fires when the role crosses the middle band of the viewport. */}
                <motion.div onViewportEnter={() => setYear(role.year)} viewport={{ margin: "-45% 0px -45% 0px" }}>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">{role.period}</p>
                  <h3 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-fg">{role.title}</h3>
                  <p className="mt-1 text-muted">
                    {role.company} · {role.location}
                  </p>
                  <ul className="mt-4 space-y-2 text-muted">
                    {role.bullets.map((b) => (
                      <li key={b} className="flex gap-3 leading-relaxed">
                        <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.li>
            ))}
            <li className="relative pl-10">
              <span className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-ink bg-line" aria-hidden />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">{education.period}</p>
              <h3 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-fg">{education.degree}</h3>
              <p className="mt-1 text-muted">
                {education.school} · {education.location}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
