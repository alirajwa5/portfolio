"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { chapters } from "@/content/site";
import { formatTime } from "@/content/film";
import { useLenis } from "@/components/layout/SmoothScroll";
import { prefetchFilm, useFilm } from "@/components/film/FilmProvider";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type Mark = { id: string; label: string; n: string; at: number };

const EASE = [0.16, 1, 0.3, 1] as const;

/** Autoplay speed: a fifth of the viewport per second, so a pinned app shot holds about 1.7 s. */
const speedPx = () => Math.max(140, window.innerHeight * 0.2);

/**
 * The page as a video. A chaptered progress bar at the bottom: scrub it to move through the
 * site, or press play and the page scrolls itself. Any wheel, touch or scroll key pauses it.
 */
export function SitePlayer() {
  const lenis = useLenis();
  const { isOpen: filmOpen, open: openFilm } = useFilm();
  const reduced = usePrefersReducedMotion();
  const progress = useMotionValue(0);
  const [playing, setPlaying] = useState(false);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [chapter, setChapter] = useState(0);
  const [sec, setSec] = useState(0);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const maxRef = useRef(1);
  const marksRef = useRef<Mark[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Appear after the opening sequence (sooner when it was skipped this session).
  useEffect(() => {
    const seen = document.documentElement.dataset.intro === "seen";
    const t = window.setTimeout(() => setShow(true), seen ? 300 : 2300);
    return () => window.clearTimeout(t);
  }, []);

  // Measure chapter positions and track scroll.
  useEffect(() => {
    const onScroll = () => {
      const max = maxRef.current;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      progress.set(p);
      const s = Math.floor((p * max) / speedPx());
      setSec((prev) => (prev === s ? prev : s));
      const ms = marksRef.current;
      let idx = 0;
      for (let i = 0; i < ms.length; i++) if (p + 0.0005 >= ms[i].at) idx = i;
      setChapter((prev) => (prev === idx ? prev : idx));
    };
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      maxRef.current = max;
      const next = chapters.map((c) => {
        const el = document.getElementById(c.id);
        const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
        return { id: c.id, label: c.label, n: c.n, at: Math.min(1, Math.max(0, top / max)) };
      });
      marksRef.current = next;
      setMarks(next);
      setTotal(max / speedPx());
      onScroll();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [progress]);

  // Autoplay: scroll at a steady speed until the end or until the visitor takes over.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    let y = window.scrollY;
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      y = Math.min(maxRef.current, y + speedPx() * dt);
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
      if (y >= maxRef.current - 0.5) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const stop = () => setPlaying(false);
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) stop();
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", onKey);
    };
  }, [playing, lenis]);

  useEffect(() => {
    if (filmOpen) setPlaying(false);
  }, [filmOpen]);

  const jump = (y: number, smooth: boolean) => {
    const target = Math.min(maxRef.current, Math.max(0, y));
    if (lenis) lenis.scrollTo(target, smooth ? { duration: 1.2 } : { immediate: true, force: true });
    else window.scrollTo({ top: target, behavior: smooth ? "smooth" : "auto" });
  };

  const togglePlay = () => {
    if (!playing && window.scrollY >= maxRef.current - 2) jump(0, false);
    setPlaying((v) => !v);
  };

  const seekAt = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    jump(((clientX - rect.left) / rect.width) * maxRef.current, false);
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    setPlaying(false);
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekAt(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) seekAt(e.clientX);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const onTrackKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const target = marks[Math.min(marks.length - 1, Math.max(0, chapter + (e.key === "ArrowRight" ? 1 : -1)))];
    if (target) jump(target.at * maxRef.current, true);
  };

  if (filmOpen) return null;

  const current = marks[chapter] ?? { label: chapters[0].label, n: chapters[0].n };

  return (
    <>
      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-accent md:hidden" style={{ scaleX: progress }} />

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 hidden justify-center md:flex">
        <motion.div
          className="pointer-events-auto flex h-14 w-[min(680px,calc(100vw-2.5rem))] items-center gap-3 rounded-full border border-line/80 bg-ink/75 pl-2 pr-2 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          initial={{ y: 90, opacity: 0 }}
          animate={show ? { y: 0, opacity: 1 } : { y: 90, opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {!reduced && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause the page" : "Play the page like a video"}
              title={playing ? "Pause" : "Play the page"}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-ink transition-transform hover:scale-105"
            >
              {playing ? <PauseIcon width={16} height={16} /> : <PlayIcon width={16} height={16} className="translate-x-px" />}
            </button>
          )}
          <div className="w-28 shrink-0 pl-1 leading-tight">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">Chapter {current.n}</p>
            <p className="truncate text-sm text-fg">{current.label}</p>
          </div>

          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Page position"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round((marks.length ? progress.get() : 0) * 100)}
            aria-valuetext={`Chapter ${current.n}, ${current.label}`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onTrackKey}
            className="relative h-8 min-w-0 flex-1 cursor-pointer touch-none outline-none"
          >
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-line">
              <motion.div className="h-full origin-left bg-accent" style={{ scaleX: progress }} />
            </div>
            {marks.slice(1).map((m) => (
              <span
                key={m.id}
                title={m.label}
                className="absolute top-1/2 h-3 w-[2px] -translate-y-1/2 rounded-full bg-ink"
                style={{ left: `${m.at * 100}%` }}
              />
            ))}
          </div>

          <p className="w-[5.6rem] shrink-0 text-right font-mono text-xs tabular-nums text-muted">
            {formatTime(sec)} / {formatTime(total, true)}
          </p>
          <button
            type="button"
            onClick={openFilm}
            onPointerEnter={prefetchFilm}
            onFocus={prefetchFilm}
            className="hidden h-10 shrink-0 items-center gap-1.5 rounded-full border border-line px-3.5 text-xs text-fg transition-colors hover:border-muted lg:inline-flex"
          >
            <PlayIcon width={11} height={11} /> Intro film
          </button>
        </motion.div>
      </div>
    </>
  );
}
