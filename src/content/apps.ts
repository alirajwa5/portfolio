export type DeviceKind = "phone" | "tablet" | "tablet-portrait";

export type Shot = {
  src: string;
  alt: string;
  kind?: DeviceKind;
};

export type AppRole = "Built" | "Lead architect" | "Team lead";

export type App = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  role: AppRole;
  roleNote?: string;
  status: string;
  accent: string;
  icon: string;
  shots: Shot[];
  links: { label: string; href: string }[];
};

const img = (slug: string, file: string) => `/images/apps/${slug}/${file}.webp`;

export const apps: App[] = [
  {
    slug: "sikka",
    name: "Sikka",
    tagline: "Khata, billing and POS that works with no signal.",
    description:
      "A shopkeeper's ledger, invoices, stock and a tap-to-add counter, written to the phone first and synced in the background when the signal comes back. PDF invoices and thermal receipts without a server in the loop.",
    stack: ["Flutter", "SQLite", "Node.js · TypeScript", "Render", "Google sign-in sync"],
    role: "Lead architect",
    roleNote: "Local-network sync engine, backend, release",
    status: "Live on Google Play",
    accent: "#2a6df4",
    icon: img("sikka", "icon"),
    shots: [
      { src: img("sikka", "01"), alt: "Sikka home screen with sales total, amount to collect and quick actions" },
      { src: img("sikka", "02"), alt: "Sikka splash screen — smart ledger for modern business" },
    ],
    links: [{ label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.sata.sikka" }],
  },
  {
    slug: "encompass",
    name: "Encompass AI",
    tagline: "Snap a GCSE question, hear the working on a whiteboard.",
    description:
      "Photograph a maths or science question and an AI tutor solves it step by step, out loud, drawing on a live whiteboard. Handwritten answers get marked point by point, practice runs spec by spec, and progress climbs a mastery ladder. One account across the Flutter app and the Next.js site.",
    stack: ["Flutter", "Riverpod", "Next.js 16", "Claude · OpenAI · Gemini", "MongoDB"],
    role: "Built",
    roleNote: "Freelance, for ISM Tutoring",
    status: "Client project · encompassai.net",
    accent: "#c4a35a",
    icon: img("encompass", "icon"),
    shots: [
      { src: img("encompass", "03"), alt: "Encompass home — snap a question or mark my answer" },
      { src: img("encompass", "05"), alt: "Encompass science progress across biology, chemistry and physics" },
      { src: img("encompass", "07"), alt: "Encompass biology topics with mastery levels" },
    ],
    links: [{ label: "encompassai.net", href: "https://www.encompassai.net" }],
  },
  {
    slug: "my-assistant",
    name: "My Assistant",
    tagline: "A chat-first life OS with an AI that can't go rogue.",
    description:
      "Tasks, money, notes, meetings and plans, kept in your own MongoDB by talking to it. The model only ever runs eight validated tools, anything destructive waits for a yes, and a heartbeat agent pings you only when something actually needs you.",
    stack: ["Flutter", "Riverpod", "Node.js · TypeScript", "MongoDB", "FCM"],
    role: "Built",
    roleNote: "App, backend and the tool sandbox",
    status: "Closed testing on Google Play",
    accent: "#2fd38a",
    icon: img("my-assistant", "icon"),
    shots: [
      { src: img("my-assistant", "02"), alt: "My Assistant chat planning the week from a single message" },
      { src: img("my-assistant", "01"), alt: "My Assistant dashboard with timetable, money, calories and meetings" },
      { src: img("my-assistant", "08"), alt: "My Assistant settings — models, MCP server, agent and tokens" },
    ],
    links: [],
  },
  {
    slug: "ledgent",
    name: "Ledgent",
    tagline: "Offline-first point of sale for retail shops.",
    description:
      "Checkout, barcode scanning, stock, purchases, expenses, suppliers, customers, employees and branches, all on the device with background sync to a Laravel backend. Thermal receipts, PDF sharing, and sales, stock and profit reports.",
    stack: ["Flutter", "sqflite", "Laravel", "ESC/POS printing"],
    role: "Team lead",
    roleNote: "SATA mobile department",
    status: "Coming to Google Play",
    accent: "#bc1823",
    icon: img("ledgent", "icon"),
    shots: [
      { src: img("ledgent", "01"), alt: "Ledgent dashboard with launch register and quick actions" },
      { src: img("ledgent", "03"), alt: "Ledgent add product with barcode and pricing" },
      { src: img("ledgent", "08"), alt: "Ledgent settings — offline-first with cloud sync" },
      { src: img("ledgent", "tablet-01"), alt: "Ledgent widescreen POS register on a tablet", kind: "tablet" },
    ],
    links: [],
  },
  {
    slug: "sata-lms",
    name: "SATA LMS",
    tagline: "Student, teacher and parent apps for one LMS.",
    description:
      "Three roles in one Flutter app. Students take lectures, quizzes and assignments; teachers mark attendance, grade and announce; parents follow their children's results.",
    stack: ["Flutter", "REST APIs"],
    role: "Team lead",
    roleNote: "SATA mobile department",
    status: "Coming to Google Play",
    accent: "#d7262e",
    icon: img("sata-lms", "icon"),
    shots: [
      { src: img("sata-lms", "06"), alt: "SATA LMS student dashboard with courses, quizzes and attendance" },
      { src: img("sata-lms", "08"), alt: "SATA LMS teacher dashboard with quick stats" },
      { src: img("sata-lms", "05"), alt: "SATA LMS mark attendance screen" },
      { src: img("sata-lms", "tablet-08"), alt: "SATA LMS teacher dashboard on a tablet", kind: "tablet-portrait" },
    ],
    links: [],
  },
  {
    slug: "uble",
    name: "Uble",
    tagline: "Book mountain stays and homes, or host your own.",
    description:
      "A stays marketplace for Gilgit-Baltistan: search, instant booking, guest chat and reservations on one side; listings, calendar and earnings for hosts on the other.",
    stack: ["Flutter", "REST APIs"],
    role: "Team lead",
    roleNote: "SATA mobile department",
    status: "Coming to Google Play",
    accent: "#e8125c",
    icon: img("uble", "icon"),
    shots: [
      { src: img("uble", "02"), alt: "Uble home with search and property listings" },
      { src: img("uble", "07"), alt: "Uble apartment detail with amenities and reserve button" },
      { src: img("uble", "13"), alt: "Uble host dashboard with reservations and earnings" },
    ],
    links: [],
  },
  {
    slug: "stack-city",
    name: "Stack City 3D",
    tagline: "City Bloxx, rebuilt with real physics.",
    description:
      "Time the swinging crane, drop each floor, keep the tower standing. Flame and Forge2D rigid-body physics at 60 fps, parachuting residents, and a landmark comparison when you top out. Plus a Next.js landing site.",
    stack: ["Flutter", "Flame", "Forge2D", "Next.js"],
    role: "Built",
    roleNote: "Personal project",
    status: "Closed testing on Google Play",
    accent: "#00ccff",
    icon: img("stack-city", "icon"),
    shots: [
      { src: img("stack-city", "05"), alt: "Stack City 3D tower with residents parachuting in" },
      { src: img("stack-city", "02"), alt: "Stack City 3D crane swinging the first floor over the site" },
      { src: img("stack-city", "08"), alt: "Stack City 3D tower compared with real landmarks" },
    ],
    links: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.alirajwa5.stackcity" },
      { label: "stack-city-3d.vercel.app", href: "https://stack-city-3d.vercel.app" },
    ],
  },
];
