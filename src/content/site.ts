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

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Tech Bytes", href: "#tech-bytes" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
] as const;
