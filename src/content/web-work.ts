export type WebWork = {
  name: string;
  summary: string;
  stack: string;
  href?: string;
};

export const webWork: WebWork[] = [
  {
    name: "E-Billing System",
    summary: "Utility billing for the Water & Power Department, Gilgit-Baltistan. 25,000+ transactions a month.",
    stack: "Laravel · MySQL · queue workers",
    href: "https://billing.wpdgb.gov.pk",
  },
  {
    name: "AGGB Web Portal",
    summary: "Payroll and fund distribution automated for 10,000+ government employees.",
    stack: "Laravel · MySQL · RBAC",
  },
  {
    name: "QuranRI.com",
    summary: "An AI Quran tutor that answers from verified sources, with streaming responses.",
    stack: "Next.js · LLMs · RAG",
    href: "https://quranri.com",
  },
  {
    name: "Mountain Agriculture Research Platform",
    summary: "Community-driven agricultural data for Gilgit-Baltistan, the base for future AI decision support.",
    stack: "Next.js · MongoDB · Cloudinary",
    href: "https://marp-gb.vercel.app",
  },
  {
    name: "Vendor Management System",
    summary: "Built as an intern in 2021, still live on the department's official site.",
    stack: "Web · WPDGB",
    href: "https://wpdgb.gov.pk",
  },
  {
    name: "Point of Sale",
    summary: "Desktop POS deployed and trained across 30+ retail stores in Gilgit.",
    stack: "Desktop · training & rollout",
  },
];
