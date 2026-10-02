"use client";

import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import { useMemo, useRef, useState, type MouseEvent } from "react";
import { apps, type App, type Shot } from "@/content/apps";
import { DeviceFrame, DeviceShot } from "@/components/visuals/DeviceFrame";
import { ArrowOut } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useScrollTo } from "@/components/layout/SmoothScroll";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Scroll distance each screenshot owns inside the pinned section. */
const VH_PER_SHOT = 34;

type Slice = { app: App; shot: Shot; appIndex: number };

export function AppShowcase() {
  const slices = useMemo<Slice[]>(
    () => apps.flatMap((app, appIndex) => app.shots.map((shot) => ({ app, shot, appIndex }))),
    [],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // The pinned container is display:none below lg, where progress can be NaN.
    if (!Number.isFinite(v)) return;
    const i = Math.min(slices.length - 1, Math.max(0, Math.floor(v * slices.length)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const scrollTo = useScrollTo();
  const jumpTo = (appIndex: number) => {
    const el = containerRef.current;
    if (!el) return;
    const first = slices.findIndex((s) => s.appIndex === appIndex);
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    scrollTo(top + (first / slices.length) * travel + 4);
  };

  const current = slices[active] ?? slices[0];

  return (
    <section id="work" className="relative scroll-mt-20">
      <div className="container-x pt-28">
        <Reveal>
          <SectionHeading
            eyebrow="02 · Selected work"
            title={
              <>
                Seven apps, <span className="font-serif italic text-accent">built in Flutter</span>
              </>
            }
            description="Shops, schools, students, hosts and one physics game, with Node or Laravel behind them and most of it offline-first. Sikka is live on Google Play; the rest are in testing or with clients."
          />
        </Reveal>
      </div>

      {/* Desktop: pinned two-column showcase driven by scroll. */}
      <div
        ref={containerRef}
        className="relative hidden lg:block"
        style={{ height: `${slices.length * VH_PER_SHOT + 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="container-x grid w-full grid-cols-2 items-center gap-16">
            <Copy app={current.app} index={current.appIndex} onJump={jumpTo} />
            <Device slice={current} first={active === 0} />
          </div>
        </div>
      </div>

      {/* Mobile and tablet: stacked cards. */}
      <div className="container-x mt-14 space-y-14 lg:hidden">
        {apps.map((app, i) => (
          <AppCard key={app.slug} app={app} index={i} />
        ))}
      </div>
    </section>
  );
}

function Copy({ app, index, onJump }: { app: App; index: number; onJump: (i: number) => void }) {
  return (
    <div>
      <p className="eyebrow flex items-center gap-3">
        <span className="text-fg">{String(index + 1).padStart(2, "0")}</span>
        <span className="h-px w-8 bg-line" />
        <span>{String(apps.length).padStart(2, "0")}</span>
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={app.slug}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="mt-7"
        >
          <AppHeader app={app} large />
          <p className="mt-6 font-serif text-[1.75rem] italic leading-tight text-fg/90">{app.tagline}</p>
          <p className="mt-4 max-w-md leading-relaxed text-muted">{app.description}</p>
          <StackChips app={app} className="mt-6" />
          <RoleLine app={app} className="mt-5" />
          <Links app={app} className="mt-6" />
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center gap-2" role="tablist" aria-label="Apps">
        {apps.map((a, i) => (
          <button
            key={a.slug}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={a.name}
            onClick={() => onJump(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === index ? "w-9 bg-accent" : "w-3 bg-line hover:bg-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function Device({ slice, first }: { slice: Slice; first: boolean }) {
  const reduced = usePrefersReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 14);
    rx.set(-py * 10);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  const kind = slice.shot.kind ?? "phone";

  return (
    <div
      className="relative flex h-[82vh] items-center justify-center"
      style={{ perspective: 1400 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute h-[520px] w-[520px] rounded-full opacity-[0.22] blur-[120px]"
        animate={{ backgroundColor: slice.app.accent }}
        transition={{ duration: 0.9, ease: EASE }}
      />

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={kind}
          initial={{ opacity: 0, scale: 0.94, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.94, rotateY: 10 }}
          transition={{ duration: 0.65, ease: EASE }}
          className="relative"
        >
          <motion.div
            style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <DeviceFrame kind={kind}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={slice.shot.src}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src={slice.shot.src}
                    alt={slice.shot.alt}
                    fill
                    priority={first}
                    sizes={kind === "phone" ? "290px" : "560px"}
                    draggable={false}
                    className="pointer-events-none select-none object-cover object-top"
                  />
                </motion.div>
              </AnimatePresence>
            </DeviceFrame>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AppCard({ app, index }: { app: App; index: number }) {
  const phoneShots = app.shots.filter((s) => (s.kind ?? "phone") === "phone");
  return (
    <Reveal>
      <article className="border-t border-line pt-8" aria-labelledby={`app-${app.slug}`}>
        <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
        <div className="mt-4">
          <AppHeader app={app} id={`app-${app.slug}`} />
        </div>
        <p className="mt-4 font-serif text-2xl italic text-fg/90">{app.tagline}</p>

        <div className="-mx-5 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8 [scrollbar-width:none]">
          {phoneShots.map((shot, i) => (
            <div key={shot.src} className="shrink-0 snap-start">
              <DeviceShot src={shot.src} alt={shot.alt} widthClass="w-[210px]" sizes="210px" priority={index === 0 && i === 0} />
            </div>
          ))}
        </div>

        <p className="mt-5 leading-relaxed text-muted">{app.description}</p>
        <StackChips app={app} className="mt-5" />
        <RoleLine app={app} className="mt-4" />
        <Links app={app} className="mt-5" />
      </article>
    </Reveal>
  );
}

function AppHeader({ app, large = false, id }: { app: App; large?: boolean; id?: string }) {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={app.icon}
        alt=""
        width={large ? 56 : 48}
        height={large ? 56 : 48}
        className={cn("rounded-2xl border border-line bg-surface", large ? "h-14 w-14" : "h-12 w-12")}
      />
      <div>
        <h3 id={id} className={cn("font-medium tracking-[-0.02em] text-fg", large ? "text-4xl" : "text-3xl")}>
          {app.name}
        </h3>
        <p className="mt-1 text-sm text-muted">{app.status}</p>
      </div>
    </div>
  );
}

function StackChips({ app, className }: { app: App; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Stack">
      {app.stack.map((s) => (
        <li key={s} className="chip">
          {s}
        </li>
      ))}
    </ul>
  );
}

function RoleLine({ app, className }: { app: App; className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="chip chip-accent">{app.role}</span>
      {app.roleNote && <span className="text-sm text-dim">{app.roleNote}</span>}
    </p>
  );
}

function Links({ app, className }: { app: App; className?: string }) {
  if (!app.links.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {app.links.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener" className="btn btn-ghost btn-sm">
          {l.label} <ArrowOut />
        </a>
      ))}
    </div>
  );
}
