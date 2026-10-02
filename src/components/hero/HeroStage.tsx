"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { apps } from "@/content/apps";
import { filmLengthLabel } from "@/content/film";
import { site } from "@/content/site";
import { prefetchFilm, useFilm } from "@/components/film/FilmProvider";
import { PlayIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const CYCLE_MS = 2800;

/**
 * The hero as a live broadcast frame: slow Ken Burns on the portrait, a running timecode,
 * and a lower-third that cycles through the apps. Dark in both themes. Play opens the film.
 */
export function HeroStage() {
  const { open } = useFilm();
  return (
    <div
      className="stage-wipe relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[2rem] bg-stage text-paper shadow-[0_50px_120px_-50px_rgba(0,0,0,0.75)] light:shadow-[0_50px_110px_-50px_rgba(60,40,10,0.55)]"
      style={{ animationDelay: "0.7s" }}
    >
      <div className="kenburns absolute inset-0">
        <Image
          src={site.portrait}
          alt={`${site.name}, portrait`}
          fill
          priority
          sizes="(min-width: 1024px) 460px, 92vw"
          className="object-cover object-[50%_28%]"
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_30%,transparent_45%,rgba(0,0,0,0.6)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      <div aria-hidden className="sheen pointer-events-none absolute inset-0" />

      <div className="absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-paper/80">
        <span className="flex items-center gap-2 rounded-full bg-black/45 px-2.5 py-1 backdrop-blur">
          <span className="rec-dot h-1.5 w-1.5 rounded-full bg-[#ff4d3d]" />
          Live
        </span>
        <Timecode className="rounded-full bg-black/45 px-2.5 py-1 backdrop-blur" />
      </div>

      <div className="absolute inset-x-4 bottom-4 flex items-end gap-3">
        <LowerThird className="min-w-0 flex-1" />
        <button
          type="button"
          onClick={open}
          onPointerEnter={prefetchFilm}
          onFocus={prefetchFilm}
          aria-label={`Play the intro film, ${filmLengthLabel}`}
          className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold text-[#0e0d0b] shadow-[0_10px_30px_-8px_rgba(242,181,68,0.6)] transition-transform duration-300 hover:scale-105"
        >
          <span aria-hidden className="pulse-ring absolute inset-0 rounded-full" />
          <PlayIcon width={20} height={20} className="translate-x-px" />
        </button>
      </div>
    </div>
  );
}

/** HH:MM:SS:FF since page load at 25 fps, written straight to the node (no re-renders). */
function Timecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const start = performance.now();
    const pad = (n: number) => String(n).padStart(2, "0");
    const id = window.setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const t = (performance.now() - start) / 1000;
      el.textContent = `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(Math.floor(t) % 60)}:${pad(Math.floor((t % 1) * 25))}`;
    }, 40);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      00:00:00:00
    </span>
  );
}

function LowerThird({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setIndex((v) => (v + 1) % apps.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  const app = apps[index];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-black/45 p-3 backdrop-blur-md", className)}>
      <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-paper/55">
        Now showing · {pad(index + 1)}/{pad(apps.length)}
      </p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={app.slug}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-2 flex items-center gap-3"
        >
          <Image src={app.icon} alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-xl" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-paper">{app.name}</p>
            <p className="truncate text-xs text-paper/65">{app.tagline}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-3 h-px w-full overflow-hidden bg-white/10">
        {!reduced && <div key={index} className="lower-progress h-full bg-gold" />}
      </div>
    </div>
  );
}
