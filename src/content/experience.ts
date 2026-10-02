export type Role = {
  title: string;
  company: string;
  location: string;
  period: string;
  year: string;
  bullets: string[];
};

export const roles: Role[] = [
  {
    title: "Mobile App Team Lead",
    company: "SATA Technologies (Pvt.) Ltd",
    location: "Gilgit",
    period: "Aug 2026 – Present",
    year: "2026",
    bullets: [
      "Lead a team of 5 Flutter developers building cross-platform mobile apps",
      "Built and shipped Sikka, a digital khata and billing app now live on the Google Play Store",
    ],
  },
  {
    title: "Web Development Lead",
    company: "SATA Technologies (Pvt.) Ltd",
    location: "Gilgit",
    period: "Jun 2026 – Aug 2026",
    year: "2026",
    bullets: [
      "Led a web development team building production AI agent systems",
      "Designed agentic architectures covering agent reasoning, coordination, and task orchestration",
      "Owned full-stack delivery from backend APIs through the AI agent layer",
    ],
  },
  {
    title: "Senior Web Developer",
    company: "Ripple Minds (Pvt.) Ltd",
    location: "Karachi",
    period: "Apr 2025 – May 2026",
    year: "2025",
    bullets: [
      "Architected and developed backend APIs using Node.js and Express.js for high-traffic applications",
      "Built scalable real-time features and performance optimizations ensuring stability under peak load",
    ],
  },
  {
    title: "Senior Executive Laravel Developer",
    company: "Sybex Lab (Pvt.) Ltd",
    location: "Karachi",
    period: "Nov 2023 – Mar 2025",
    year: "2023",
    bullets: [
      "Developed high-performance real-time Laravel applications on the TALL stack (Tailwind, Alpine.js, Livewire)",
      "Implemented data pipelines extracting attendance logs from biometric machines into the HR portal",
      "Built RESTful APIs and Node.js microservices powering scalable enterprise solutions",
    ],
  },
  {
    title: "Project Manager (Part-time)",
    company: "3Beez Technologies (Pvt.) Ltd",
    location: "Gilgit",
    period: "Apr 2023 – Jan 2025",
    year: "2023",
    bullets: [
      "Managed end-to-end delivery of Land Acquisition Management System and Assets Management System for government departments, coordinating cross-functional teams to on-time delivery",
    ],
  },
  {
    title: "Senior Web Developer",
    company: "SATA Technologies (Pvt.) Ltd",
    location: "Gilgit",
    period: "Jan 2021 – Jan 2025",
    year: "2021",
    bullets: [
      "Engineered E-Billing System (billing.wpdgb.gov.pk) processing 25,000+ monthly utility transactions",
      "Built AGGB Web Portal automating payroll and fund distribution for 10,000+ government employees",
      "Developed Asset Management System digitizing tracking for the Water and Power Department",
      "Led deployment and training of Point of Sale System across 30+ retail stores",
    ],
  },
  {
    title: "Student Assistant",
    company: "Karakoram International University",
    location: "Gilgit",
    period: "Mar 2023 – Jun 2023",
    year: "2023",
    bullets: [
      "Developed Learning Management System deployed across 8+ schools (HEC-sponsored project)",
      "Built the APIs behind its Flutter mobile app; lead trainer for administrators, teachers, and students",
    ],
  },
  {
    title: "Web & Mobile App Designer (Intern)",
    company: "Water & Power Department GB",
    location: "Gilgit",
    period: "Jan – Jun 2021",
    year: "2021",
    bullets: [
      "Developed Vendor Management System, live in production on wpdgb.gov.pk",
      "Built Meter Disconnection App for Android streamlining field operations",
    ],
  },
];

export const education = {
  school: "Karakoram International University",
  location: "Gilgit",
  period: "2018 – 2023",
  degree: "Bachelor of Science in Computer Science",
};

export const freelance = [
  {
    name: "quranri.com",
    href: "https://quranri.com",
    text: "Designed, built, and deployed an AI-integrated Quran learning platform with a custom AI tutor",
  },
];
