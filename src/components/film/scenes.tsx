"use client";

import { AnimatePresence, cubicBezier, motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useState, type ComponentType, type CSSProperties } from "react";
import { film, type FilmSceneId } from "@/content/film";
import { cn } from "@/lib/utils";

/**
 * The seven scenes of the intro film. Each one is a pure function of `p`, its own
 * progress from 0 to 1, so the film can pause, seek and scrub like a video.
 * Sizes use container units (cqmin, cqw, cqh) so a scene scales with the stage.
 */
export type SceneProps = { p: MotionValue<number>; portrait: boolean };

const EASE = [0.16, 1, 0.3, 1] as const;
const easeOutExpo = cubicBezier(0.16, 1, 0.3, 1);
const pad = (n: number) => String(n).padStart(2, "0");
const GOLD = "#f2b544";
const CORAL = "#ff7a5c";

/** Opacity + rise between two points of a scene. */
function useFadeUp(p: MotionValue<number>, a: number, b: number) {
  const opacity = useTransform(p, [a, b], [0, 1]);
  const y = useTransform(p, [a, b], ["40%", "0%"], { ease: easeOutExpo });
  return { opacity, y };
}

/* ---------------------------------------------------------------- 01 cold open */

function ColdOpen({ p }: SceneProps) {
  const labelReveal = useTransform(p, [0, 0.32], [100, 0], { ease: easeOutExpo });
  const labelClip = useTransform(labelReveal, (v) => `inset(0 ${v}% 0 0)`);
  const line = useTransform(p, [0.1, 0.44], [0, 1], { ease: easeOutExpo });
  const headOpacity = useTransform(p, [0.36, 0.64], [0, 1]);
  const headBlur = useTransform(p, [0.36, 0.7], [14, 0]);
  const headFilter = useTransform(headBlur, (b) => `blur(${b}px)`);
  const headY = useTransform(p, [0.36, 0.72], ["22%", "0%"], { ease: easeOutExpo });
  const push = useTransform(p, [0, 1], [1, 1.06]);

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-[8cqmin] text-center" style={{ scale: push }}>
      <motion.p
        className="font-mono uppercase text-paper/60"
        style={{ clipPath: labelClip, fontSize: "2cqmin", letterSpacing: "0.5em" }}
      >
        {film.coldOpen.label}
      </motion.p>
      <motion.div className="origin-center bg-gold" style={{ scaleX: line, height: 1, width: "34cqmin", marginTop: "3cqmin" }} />
      <motion.h2
        className="font-serif italic leading-none text-paper"
        style={{ opacity: headOpacity, filter: headFilter, y: headY, fontSize: "12.5cqmin", marginTop: "4cqmin" }}
      >
        {film.coldOpen.headline}
      </motion.h2>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- 02 who */

function Who({ p, portrait }: SceneProps) {
  const reveal = useTransform(p, [0, 0.38], [100, 0], { ease: easeOutExpo });
  const clip = useTransform(reveal, (v) => `inset(${v}% 0% 0% 0% round 3cqmin)`);
  const zoom = useTransform(p, [0, 1], [1.16, 1.02]);
  const name = useFadeUp(p, 0.2, 0.42);
  const line1 = useFadeUp(p, 0.42, 0.56);
  const line2 = useFadeUp(p, 0.52, 0.66);
  const line3 = useFadeUp(p, 0.62, 0.76);
  const lines = [line1, line2, line3];
  const photo: CSSProperties = portrait ? { width: "62cqw" } : { height: "72cqh" };

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center",
        portrait ? "flex-col justify-center gap-[6cqmin] px-[8cqmin]" : "justify-center gap-[7cqmin] px-[9cqmin]",
      )}
    >
      <motion.div className="relative shrink-0 overflow-hidden" style={{ ...photo, aspectRatio: "4 / 5", clipPath: clip }}>
        <motion.div className="absolute inset-0" style={{ scale: zoom }}>
          <Image src={film.who.portrait} alt="" fill sizes="(orientation: portrait) 62vw, 34vw" className="object-cover object-[50%_28%]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      </motion.div>
      <div className={cn(portrait && "text-center")}>
        <motion.p className="font-medium leading-[1.02] tracking-[-0.035em] text-paper" style={{ ...name, fontSize: "6.2cqmin" }}>
          {film.who.name}
        </motion.p>
        <div style={{ marginTop: "3cqmin" }}>
          {film.who.lines.map((line, i) => (
            <motion.p key={line} className="text-paper/70" style={{ ...lines[i], fontSize: "2.9cqmin", marginTop: i ? "1.3cqmin" : 0 }}>
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 03 numbers */

function Numbers({ p }: SceneProps) {
  const label = useFadeUp(p, 0, 0.08);
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.p
        className="absolute inset-x-0 text-center font-mono uppercase text-paper/45"
        style={{ ...label, top: "17%", fontSize: "1.8cqmin", letterSpacing: "0.4em" }}
      >
        In production
      </motion.p>
      {film.numbers.map((item, i) => (
        <NumberBeat key={item.label} p={p} i={i} count={film.numbers.length} item={item} />
      ))}
    </div>
  );
}

function NumberBeat({
  p,
  i,
  count,
  item,
}: {
  p: MotionValue<number>;
  i: number;
  count: number;
  item: { value: number; suffix: string; label: string };
}) {
  const a = i / count;
  const b = (i + 1) / count;
  const w = b - a;
  const last = i === count - 1;
  const input = last ? [a, a + w * 0.18] : [a, a + w * 0.18, b - w * 0.16, b];
  const opacity = useTransform(p, input, last ? [0, 1] : [0, 1, 1, 0]);
  const y = useTransform(p, input, last ? ["30%", "0%"] : ["30%", "0%", "0%", "-30%"]);
  const value = useTransform(p, [a, a + w * 0.6], [0, item.value], { ease: easeOutExpo });
  const text = useTransform(value, (v) => `${Math.round(v).toLocaleString("en-US")}${item.suffix}`);

  return (
    <motion.div className="absolute inset-x-0 flex flex-col items-center px-[6cqmin] text-center" style={{ opacity, y }}>
      <motion.span className="font-medium tabular-nums tracking-[-0.045em] text-paper" style={{ fontSize: "19cqmin", lineHeight: 1 }}>
        {text}
      </motion.span>
      <span className="text-paper/60" style={{ fontSize: "3cqmin", marginTop: "2.4cqmin" }}>
        {item.label}
      </span>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- 04 apps */

function Apps({ p, portrait }: SceneProps) {
  const list = film.apps;
  const n = list.length;
  const [beat, setBeat] = useState(() => Math.min(n - 1, Math.max(0, Math.floor(p.get() * n))));
  useMotionValueEvent(p, "change", (v) => {
    const next = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setBeat((prev) => (prev === next ? prev : next));
  });
  const app = list[beat];
  const tilt = useTransform(p, (v) => Math.sin(v * Math.PI * 5) * 8);
  const lift = useTransform(p, (v) => Math.cos(v * Math.PI * 4) * 6);
  const phone: CSSProperties = portrait ? { width: "46cqw" } : { height: "74cqh" };

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center",
        portrait ? "flex-col justify-center gap-[5cqmin] px-[6cqmin]" : "justify-between gap-[6cqmin] px-[10cqmin]",
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: "95cqmin", height: "95cqmin", filter: "blur(12cqmin)", opacity: 0.3 }}
        animate={{ backgroundColor: app.accent }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      <div className={cn("relative z-10", portrait ? "order-2 text-center" : "max-w-[46cqw]")}>
        <p className="font-mono uppercase text-paper/45" style={{ fontSize: "1.7cqmin", letterSpacing: "0.3em" }}>
          Selected work · {pad(beat + 1)} / {pad(n)}
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={app.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <h3
              className="font-medium leading-[0.98] tracking-[-0.035em] text-paper"
              style={{ fontSize: portrait ? "8.4cqmin" : "8.6cqmin", marginTop: "2cqmin" }}
            >
              {app.name}
            </h3>
            <p className="font-serif italic text-paper/75" style={{ fontSize: "3.4cqmin", marginTop: "1.6cqmin" }}>
              {app.tagline}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={cn("relative z-10", portrait && "order-1")} style={{ perspective: "150cqmin" }}>
        <motion.div
          className="relative border border-bezel-line bg-gradient-to-b from-bezel to-bezel-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
          style={{ ...phone, aspectRatio: "9 / 19", borderRadius: "4.6cqmin", rotateY: tilt, y: lift }}
        >
          <div className="absolute overflow-hidden bg-black" style={{ inset: "1.1cqmin", borderRadius: "3.8cqmin" }}>
            <AnimatePresence initial={false}>
              <motion.div
                key={app.shot}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <Image src={app.shot} alt="" fill sizes="(orientation: portrait) 50vw, 25vw" className="object-cover object-top" />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 05 agents */

type DiagramNodeDef = { id: string; label: string; sub: string; cx: number; cy: number; w: number; h: number; at: number; tone?: "gold" | "coral" };
type DiagramEdgeDef = { id: string; d: string; from: number; to: number; tone?: "coral" };
type Diagram = { viewBox: string; nodes: DiagramNodeDef[]; edges: DiagramEdgeDef[] };

const NODE_COPY = {
  you: { label: "You", sub: "plain words" },
  gateway: { label: "Gateway", sub: "auth · rate limits" },
  tools: { label: "8 tools", sub: "sandboxed, typed" },
  data: { label: "Your data", sub: "never raw queries" },
  wait: { label: "WAIT gate", sub: "deletes ask first" },
};

const DIAGRAM_LANDSCAPE: Diagram = {
  viewBox: "0 0 1000 330",
  nodes: [
    { id: "you", ...NODE_COPY.you, cx: 100, cy: 110, w: 180, h: 80, at: 0.34 },
    { id: "gateway", ...NODE_COPY.gateway, cx: 340, cy: 110, w: 180, h: 80, at: 0.46 },
    { id: "tools", ...NODE_COPY.tools, cx: 610, cy: 110, w: 180, h: 80, at: 0.58, tone: "gold" },
    { id: "data", ...NODE_COPY.data, cx: 880, cy: 110, w: 180, h: 80, at: 0.7 },
    { id: "wait", ...NODE_COPY.wait, cx: 610, cy: 265, w: 180, h: 80, at: 0.8, tone: "coral" },
  ],
  edges: [
    { id: "e1", d: "M190 110 H250", from: 0.38, to: 0.46 },
    { id: "e2", d: "M430 110 H520", from: 0.5, to: 0.58 },
    { id: "e3", d: "M700 110 H790", from: 0.62, to: 0.7 },
    { id: "e4", d: "M610 150 V225", from: 0.73, to: 0.8, tone: "coral" },
    { id: "e5", d: "M700 265 C 820 265, 880 230, 880 150", from: 0.83, to: 0.92, tone: "coral" },
  ],
};

const DIAGRAM_PORTRAIT: Diagram = {
  viewBox: "0 0 360 610",
  nodes: [
    { id: "you", ...NODE_COPY.you, cx: 180, cy: 45, w: 230, h: 70, at: 0.34 },
    { id: "gateway", ...NODE_COPY.gateway, cx: 180, cy: 160, w: 230, h: 70, at: 0.46 },
    { id: "tools", ...NODE_COPY.tools, cx: 180, cy: 275, w: 230, h: 70, at: 0.58, tone: "gold" },
    { id: "wait", ...NODE_COPY.wait, cx: 180, cy: 390, w: 230, h: 70, at: 0.8, tone: "coral" },
    { id: "data", ...NODE_COPY.data, cx: 180, cy: 545, w: 230, h: 70, at: 0.7 },
  ],
  edges: [
    { id: "e1", d: "M180 80 V125", from: 0.38, to: 0.46 },
    { id: "e2", d: "M180 195 V240", from: 0.5, to: 0.58 },
    { id: "e3", d: "M65 275 C 12 350, 12 470, 65 545", from: 0.62, to: 0.7 },
    { id: "e4", d: "M180 310 V355", from: 0.73, to: 0.8, tone: "coral" },
    { id: "e5", d: "M180 425 V510", from: 0.83, to: 0.92, tone: "coral" },
  ],
};

function Agents({ p, portrait }: SceneProps) {
  const text = film.agents.headline;
  const count = useTransform(p, [0.02, 0.32], [0, text.length]);
  const typed = useTransform(count, (c) => text.slice(0, Math.round(c)));
  const caption = useFadeUp(p, 0.88, 0.97);
  const diagram = portrait ? DIAGRAM_PORTRAIT : DIAGRAM_LANDSCAPE;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-[7cqmin]">
      <p
        className="relative text-center font-medium tracking-[-0.03em] text-paper"
        style={{ fontSize: portrait ? "6.4cqmin" : "5.6cqmin", lineHeight: 1.08 }}
      >
        <span className="invisible">{text}</span>
        <span className="absolute inset-0">
          <motion.span>{typed}</motion.span>
          <span className="film-caret" />
        </span>
      </p>
      <svg viewBox={diagram.viewBox} aria-hidden style={{ width: portrait ? "74cqw" : "78cqw", marginTop: "4cqmin" }}>
        {diagram.edges.map((e) => (
          <DiagramEdge key={e.id} p={p} edge={e} />
        ))}
        {diagram.nodes.map((n) => (
          <DiagramNode key={n.id} p={p} node={n} />
        ))}
      </svg>
      <motion.p className="text-center text-paper/60" style={{ ...caption, fontSize: "2.5cqmin", marginTop: "3cqmin" }}>
        {film.agents.caption}
      </motion.p>
    </div>
  );
}

function DiagramNode({ p, node }: { p: MotionValue<number>; node: DiagramNodeDef }) {
  const opacity = useTransform(p, [node.at, node.at + 0.05], [0, 1]);
  const scale = useTransform(p, [node.at, node.at + 0.06], [0.85, 1], { ease: easeOutExpo });
  const strokeColor = node.tone === "gold" ? GOLD : node.tone === "coral" ? CORAL : "rgba(243,238,228,0.22)";
  return (
    <motion.g style={{ opacity, scale }}>
      <rect
        x={node.cx - node.w / 2}
        y={node.cy - node.h / 2}
        width={node.w}
        height={node.h}
        rx={18}
        fill="rgba(243,238,228,0.04)"
        stroke={strokeColor}
        strokeWidth={1.5}
      />
      <text x={node.cx} y={node.cy - 2} textAnchor="middle" fill="#f3eee4" fontSize={22} fontWeight={500}>
        {node.label}
      </text>
      <text x={node.cx} y={node.cy + 21} textAnchor="middle" fill="rgba(243,238,228,0.55)" fontSize={14}>
        {node.sub}
      </text>
    </motion.g>
  );
}

function DiagramEdge({ p, edge }: { p: MotionValue<number>; edge: DiagramEdgeDef }) {
  const pathLength = useTransform(p, [edge.from, edge.to], [0, 1]);
  const opacity = useTransform(p, [edge.from, edge.from + 0.005], [0, 1]);
  return (
    <motion.path
      d={edge.d}
      fill="none"
      stroke={edge.tone === "coral" ? CORAL : GOLD}
      strokeOpacity={0.85}
      strokeWidth={2}
      strokeLinecap="round"
      style={{ pathLength, opacity }}
    />
  );
}

/* ---------------------------------------------------------------- 06 content */

function Content({ p, portrait }: SceneProps) {
  const line1 = useFadeUp(p, 0.04, 0.22);
  const line2 = useFadeUp(p, 0.14, 0.32);
  const covers = film.content.covers;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-[6cqmin] text-center">
      <motion.p className="font-medium tracking-[-0.03em] text-paper" style={{ ...line1, fontSize: "5.4cqmin", lineHeight: 1.05 }}>
        {film.content.line1}
      </motion.p>
      <motion.p className="font-serif italic text-gold" style={{ ...line2, fontSize: "5.8cqmin", lineHeight: 1.1 }}>
        {film.content.line2}
      </motion.p>
      <div className="relative w-full" style={{ height: portrait ? "56cqw" : "46cqh", marginTop: "5cqmin" }}>
        {covers.map((src, i) => (
          <FanCover key={src} p={p} i={i} n={covers.length} src={src} portrait={portrait} />
        ))}
      </div>
    </div>
  );
}

function FanCover({ p, i, n, src, portrait }: { p: MotionValue<number>; i: number; n: number; src: string; portrait: boolean }) {
  const off = i - (n - 1) / 2;
  const spread = useTransform(p, [0.28, 0.62], [0, 1], { ease: easeOutExpo });
  const x = useTransform(spread, (s) => `${off * s * (portrait ? 15 : 17)}cqmin`);
  const y = useTransform(spread, (s) => `${Math.abs(off) * s * 2.4}cqmin`);
  const rotate = useTransform(spread, (s) => off * s * 8);
  const opacity = useTransform(p, [0.22 + i * 0.025, 0.3 + i * 0.025], [0, 1]);
  return (
    <div className="absolute left-1/2 top-0 h-full -translate-x-1/2" style={{ zIndex: 10 - Math.round(Math.abs(off) * 2) }}>
      <motion.div
        className="relative h-full overflow-hidden border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
        style={{ x, y, rotate, opacity, aspectRatio: "9 / 16", borderRadius: "2.2cqmin" }}
      >
        <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------- 07 end card */

function End({ p }: SceneProps) {
  const line1 = useFadeUp(p, 0.04, 0.22);
  const line2 = useFadeUp(p, 0.14, 0.32);
  const rule = useTransform(p, [0.3, 0.6], [0, 1], { ease: easeOutExpo });
  const mail = useFadeUp(p, 0.32, 0.5);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-[8cqmin] text-center">
      <motion.p className="font-medium leading-none tracking-[-0.03em] text-paper" style={{ ...line1, fontSize: "7.4cqmin" }}>
        {film.end.line1}
      </motion.p>
      <motion.p className="font-serif italic leading-[1.05] text-gold" style={{ ...line2, fontSize: "8.4cqmin" }}>
        {film.end.line2}
      </motion.p>
      <motion.div className="bg-gold/70" style={{ scaleX: rule, height: 1, width: "30cqmin", marginTop: "4cqmin" }} />
      <motion.p className="font-mono text-paper/70" style={{ ...mail, fontSize: "2.6cqmin", letterSpacing: "0.18em", marginTop: "3cqmin" }}>
        {film.end.email}
      </motion.p>
    </div>
  );
}

export const SCENES: Record<FilmSceneId, ComponentType<SceneProps>> = {
  open: ColdOpen,
  who: Who,
  numbers: Numbers,
  apps: Apps,
  agents: Agents,
  content: Content,
  end: End,
};
