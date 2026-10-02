export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const site = {
  name: "Ali Muhammad Rajwa",
  role: "Full-Stack & AI Systems Lead",
  position: "Mobile App Team Lead · SATA Technologies",
  location: "Gilgit, Pakistan",
  email: "alimohdrajwa5@gmail.com",
  linkedin: "https://linkedin.com/in/alimohdrajwa",
  github: "https://github.com/alirajwa5",
  resumePdf: "/resume/updated_resume_2_oct.pdf",
  resumeUpdated: "2 Oct 2026",
  portrait: "/images/me.jpeg",
  description:
    "Full-stack developer and mobile app team lead. 5+ years shipping Laravel and Node.js backends, Flutter apps and AI agent systems — from government billing at 25,000 transactions a month to offline-first apps on Google Play.",
} as const;

export const stats = [
  { value: 5, suffix: "+", label: "years in production" },
  { value: 25000, suffix: "+", label: "utility bills a month" },
  { value: 10000, suffix: "+", label: "employees on payroll" },
  { value: 5, suffix: "", label: "Flutter devs I lead" },
] as const;

export const marquee = [
  "Laravel",
  "Flutter",
  "Node.js",
  "Next.js",
  "TypeScript",
  "AI agents",
  "NestJS",
  "React",
  "Socket.IO",
  "MySQL",
  "MongoDB",
  "Redis",
  "Docker",
  "AWS",
] as const;

/** The page as a film: one chapter per section, in scroll order. Nav, section eyebrows and the site player read this. */
export const chapters = [
  { id: "intro", label: "Intro", n: "01" },
  { id: "work", label: "Work", n: "02" },
  { id: "skills", label: "Skills", n: "03" },
  { id: "experience", label: "Experience", n: "04" },
  { id: "tech-bytes", label: "Tech Bytes", n: "05" },
  { id: "resume", label: "Resume", n: "06" },
  { id: "contact", label: "Contact", n: "07" },
] as const;

export const navLinks = chapters.slice(1).map((c) => ({ label: c.label, href: `#${c.id}` }));

export const sectionIds: readonly string[] = chapters.map((c) => c.id);
