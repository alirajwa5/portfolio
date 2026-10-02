import { apps } from "./apps";
import { site } from "./site";

/** The intro film: scene order and length. Every scene is drawn in code (src/components/film/scenes.tsx). */
export type FilmSceneId = "open" | "who" | "numbers" | "apps" | "agents" | "content" | "end";

export const filmScenes: { id: FilmSceneId; label: string; duration: number }[] = [
  { id: "open", label: "Cold open", duration: 4 },
  { id: "who", label: "Who I am", duration: 6 },
  { id: "numbers", label: "In production", duration: 7 },
  { id: "apps", label: "Seven apps", duration: 9.8 },
  { id: "agents", label: "AI agents", duration: 7 },
  { id: "content", label: "Tech Bytes", duration: 6 },
  { id: "end", label: "Let's talk", duration: 5 },
];

export const sceneStarts: number[] = filmScenes.reduce<number[]>((acc, _scene, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + filmScenes[i - 1].duration);
  return acc;
}, []);

export const filmDuration = filmScenes.reduce((sum, s) => sum + s.duration, 0);

/** m:ss. `round` for a total length, floor for a running clock. */
export function formatTime(seconds: number, round = false) {
  const s = Math.max(0, round ? Math.round(seconds) : Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export const filmLengthLabel = formatTime(filmDuration, true);

export const film = {
  coldOpen: {
    label: "Gilgit · Pakistan · 2026",
    headline: "Hi, I'm Ali.",
  },
  who: {
    name: site.name,
    portrait: site.portrait,
    lines: [site.role, site.position, "5+ years shipping to production"],
  },
  numbers: [
    { value: 25000, suffix: "+", label: "utility bills a month · E-Billing, Gilgit-Baltistan" },
    { value: 10000, suffix: "+", label: "government employees on payroll · AGGB portal" },
    { value: 7, suffix: "", label: "apps built in Flutter" },
    { value: 5, suffix: "", label: "Flutter developers I lead" },
  ],
  apps: apps.map((a) => ({
    slug: a.slug,
    name: a.name,
    tagline: a.tagline,
    accent: a.accent,
    shot: (a.shots.find((s) => (s.kind ?? "phone") === "phone") ?? a.shots[0]).src,
  })),
  agents: {
    headline: "I build AI agents that can't go rogue.",
    caption: "The model never touches the database. Anything destructive waits for a yes.",
  },
  content: {
    line1: "Every week I explain tech",
    line2: "in Roman Urdu — Tech Bytes.",
    covers: [
      "/images/content/32.webp",
      "/images/content/31.webp",
      "/images/content/30.webp",
      "/images/content/29.webp",
      "/images/content/28.webp",
    ],
  },
  end: {
    line1: "Let's build something that",
    line2: "actually ships.",
    email: site.email,
  },
};
