"use client";

import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { film, filmDuration, filmScenes, formatTime, sceneStarts } from "@/content/film";
import { site } from "@/content/site";
import { useScrollTo } from "@/components/layout/SmoothScroll";
import { CloseIcon, MailIcon, PauseIcon, PlayIcon, ReplayIcon } from "@/components/ui/icons";
import { SCENES } from "./scenes";

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

function sceneAt(t: number) {
  let idx = 0;
  for (let i = 0; i < sceneStarts.length; i++) if (t >= sceneStarts[i]) idx = i;
  return idx;
}

/** Client-only (loaded with ssr: false), so matchMedia is safe in the initializer. */
function usePortrait() {
  const [portrait, setPortrait] = useState(() => window.matchMedia("(orientation: portrait)").matches);
  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const onChange = () => setPortrait(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return portrait;
}

/** One clock drives every scene. `time` is in seconds and never re-renders React by itself. */
function useFilmClock() {
  const time = useMotionValue(0);
  const [playing, setPlaying] = useState(true);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const next = time.get() + dt;
      if (next >= filmDuration) {
        time.set(filmDuration);
        setPlaying(false);
        setEnded(true);
        return;
      }
      time.set(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, time]);

  const play = useCallback(() => {
    if (time.get() >= filmDuration - 0.05) time.set(0);
    setEnded(false);
    setPlaying(true);
  }, [time]);
  const pause = useCallback(() => setPlaying(false), []);
  const seek = useCallback(
    (t: number) => {
      time.set(Math.min(Math.max(t, 0), filmDuration - 0.01));
      setEnded(false);
    },
    [time],
  );

  return { time, playing, ended, play, pause, seek };
}

export default function IntroFilm({ onClose }: { onClose: () => void }) {
  const portrait = usePortrait();
  const { time, playing, ended, play, pause, seek } = useFilmClock();
  const [scene, setScene] = useState(0);
  const [sec, setSec] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();

  useMotionValueEvent(time, "change", (t) => {
    const i = sceneAt(t);
    setScene((prev) => (prev === i ? prev : i));
    const s = Math.floor(t);
    setSec((prev) => (prev === s ? prev : s));
  });

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);
  const restart = useCallback(() => {
    seek(0);
    play();
  }, [seek, play]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [pause]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Space on a focused button or link presses it, as usual.
      const onControl = e.target instanceof Element && e.target.closest("button, a") !== null;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if ((e.key === " " && !onControl) || e.key === "k" || e.key === "K") {
        e.preventDefault();
        toggle();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        seek(time.get() + 5);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        seek(time.get() - 5);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, toggle, seek, time]);

  const seeWork = () => {
    onClose();
    window.setTimeout(() => scrollTo("#work", -72), 420);
  };

  const stageStyle: CSSProperties = portrait
    ? { width: "min(100%, calc((100dvh - 10rem) * 9 / 16))", aspectRatio: "9 / 16", containerType: "size" }
    : { width: "min(100%, calc((100dvh - 10rem) * 16 / 9))", aspectRatio: "16 / 9", containerType: "size" };

  const current = filmScenes[scene];

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Intro film"
      tabIndex={-1}
      className="fixed inset-0 z-[95] flex flex-col bg-black text-paper outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/45">
          Intro film · {formatTime(filmDuration, true)}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-xs text-paper/80 transition-colors hover:border-white/40 hover:text-paper"
        >
          <CloseIcon width={14} height={14} />
          Close
          <span className="hidden font-mono text-[10px] text-paper/40 sm:inline">Esc</span>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-3 sm:px-6">
        <motion.div
          className="relative cursor-pointer overflow-hidden rounded-[1.25rem] bg-stage ring-1 ring-white/10"
          style={stageStyle}
          onClick={toggle}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
        >
          <Backdrop time={time} />

          <AnimatePresence initial={false}>
            <motion.div
              key={current.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <SceneHost index={scene} time={time} portrait={portrait} />
            </motion.div>
          </AnimatePresence>

          <div aria-hidden className="film-grain pointer-events-none absolute inset-0" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between font-mono uppercase text-paper/35"
            style={{ padding: "2.6cqmin 3cqmin", fontSize: "1.45cqmin", letterSpacing: "0.3em" }}
          >
            <span>{site.name}</span>
            <Timecode time={time} />
          </div>

          <AnimatePresence>
            {!playing && !ended && (
              <motion.div
                key="paused"
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-[#0e0d0b]">
                  <PlayIcon width={26} height={26} className="translate-x-0.5" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {ended && (
              <motion.div
                key="end"
                className="absolute inset-x-0 flex flex-wrap items-center justify-center gap-3 px-4"
                style={{ bottom: "7cqmin" }}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <a
                  href={`mailto:${film.end.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-[#0e0d0b] transition-colors hover:bg-paper"
                >
                  <MailIcon width={16} height={16} /> Email me
                </a>
                <button
                  type="button"
                  onClick={seeWork}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm text-paper transition-colors hover:border-white/50"
                >
                  See the work →
                </button>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm text-paper/80 transition-colors hover:border-white/50"
                >
                  <ReplayIcon width={16} height={16} /> Replay
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="px-3 pb-4 pt-3 sm:px-6 sm:pb-6">
        <div className="mx-auto flex w-full max-w-[1100px] items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-[#0e0d0b] transition-transform hover:scale-105"
          >
            {playing ? <PauseIcon /> : <PlayIcon className="translate-x-px" />}
          </button>
          <div className="hidden w-40 shrink-0 sm:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40">
              Scene {pad(scene + 1)} / {pad(filmScenes.length)}
            </p>
            <p className="mt-0.5 truncate text-sm text-paper">{current.label}</p>
          </div>
          <Track time={time} sec={sec} onSeek={seek} />
          <p className="w-[5.4rem] shrink-0 text-right font-mono text-xs tabular-nums text-paper/60">
            {formatTime(sec)} / {formatTime(filmDuration, true)}
          </p>
          <button
            type="button"
            onClick={restart}
            aria-label="Restart"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-paper/80 transition-colors hover:border-white/40 sm:flex"
          >
            <ReplayIcon />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SceneHost({ index, time, portrait }: { index: number; time: MotionValue<number>; portrait: boolean }) {
  const start = sceneStarts[index];
  const { id, duration } = filmScenes[index];
  const p = useTransform(time, [start, start + duration], [0, 1]);
  const Scene = SCENES[id];
  return <Scene p={p} portrait={portrait} />;
}

/** Two slow light pools drifting behind every scene. */
function Backdrop({ time }: { time: MotionValue<number> }) {
  const background = useTransform(
    time,
    (t) =>
      `radial-gradient(60% 70% at ${50 + Math.sin(t / 4) * 22}% ${45 + Math.cos(t / 5) * 18}%, rgba(242,181,68,0.10), transparent 70%), ` +
      `radial-gradient(50% 60% at ${30 + Math.cos(t / 6) * 20}% 80%, rgba(90,120,255,0.07), transparent 70%)`,
  );
  return <motion.div aria-hidden className="absolute inset-0" style={{ background }} />;
}

function Timecode({ time }: { time: MotionValue<number> }) {
  const text = useTransform(time, (t) => `00:00:${pad(Math.floor(t))}:${pad(Math.floor((t % 1) * 25))}`);
  return <motion.span className="tabular-nums">{text}</motion.span>;
}

function Track({ time, sec, onSeek }: { time: MotionValue<number>; sec: number; onSeek: (t: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const scaleX = useTransform(time, [0, filmDuration], [0, 1]);

  const seekAt = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onSeek(((clientX - rect.left) / rect.width) * filmDuration);
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
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

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Seek the intro film"
      aria-valuemin={0}
      aria-valuemax={Math.round(filmDuration)}
      aria-valuenow={sec}
      aria-valuetext={`${formatTime(sec)} of ${formatTime(filmDuration, true)}`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="relative h-8 min-w-0 flex-1 cursor-pointer touch-none outline-none"
    >
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/15">
        <motion.div className="h-full origin-left bg-gold" style={{ scaleX }} />
      </div>
      {sceneStarts.slice(1).map((s, i) => (
        <span
          key={s}
          title={filmScenes[i + 1].label}
          className="absolute top-1/2 h-2.5 w-[2px] -translate-y-1/2 rounded-full bg-black"
          style={{ left: `${(s / filmDuration) * 100}%` }}
        />
      ))}
    </div>
  );
}
