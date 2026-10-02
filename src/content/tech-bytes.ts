export type Reel = {
  n: number;
  title: string;
  series: "Tech Bytes" | "Explainer";
  cover: string;
};

/** Local covers, newest first. Shown when Instagram is not connected (see src/lib/instagram.ts). */
export const reels: Reel[] = [
  { n: 32, title: "Google's space data centre, Meta's 100 g VR glasses, Snapdragon 8 Elite Gen 6", series: "Tech Bytes", cover: "/images/content/32.webp" },
  { n: 31, title: "OpenClaw, Grok Bot and Dots — what each AI agent actually is", series: "Explainer", cover: "/images/content/31.webp" },
  { n: 30, title: "The DevDay leaks, before the keynote", series: "Tech Bytes", cover: "/images/content/30.webp" },
  { n: 29, title: "Invisible Unicode letters, from prompt injection to spam", series: "Explainer", cover: "/images/content/29.webp" },
  { n: 28, title: "Opus 5.5 vs Grok 4.7 — cheap petrol, expensive journey", series: "Explainer", cover: "/images/content/28.webp" },
  { n: 27, title: "Jev, the AI umpire that only says yes or no", series: "Explainer", cover: "/images/content/27.webp" },
  { n: 26, title: "Phone week — Android, Siri and the AWS outage", series: "Tech Bytes", cover: "/images/content/26.webp" },
  { n: 24, title: "iPhone 18 Pro Max — the same phone in a new colour?", series: "Explainer", cover: "/images/content/24.webp" },
  { n: 23, title: "DaVinci Resolve, driven by an AI", series: "Explainer", cover: "/images/content/23.webp" },
];

export const LATEST_COUNT = 5;

export const techBytes = {
  heading: "Tech Bytes",
  intro:
    "Tech news explained in Roman Urdu for people who have never written a line of code. One concept per reel, a daily-life example before the jargon, and the catch last.",
  pipeline:
    "Every reel — script, visuals, voice, even the presenter — comes off an AI pipeline I built and keep tuning. The man on screen is my avatar.",
  tools: ["Veo 3", "Google Flow", "Gemini Omni", "DaVinci Resolve", "ElevenLabs"],
  facts: [
    { value: "20+", label: "reels since Sep 2026" },
    { value: "Weekly", label: "Tech Bytes roundup" },
    { value: "3K", label: "followers on LinkedIn" },
    { value: "9:16", label: "vertical, under a minute" },
  ],
} as const;
