import type { Metadata, Viewport } from "next";
import "./globals.css";
import { geist, geistMono, instrument } from "@/lib/fonts";
import { site, siteUrl } from "@/content/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const TITLE = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: TITLE, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  keywords: [
    "Ali Muhammad Rajwa",
    "Full-stack developer",
    "Flutter developer",
    "Laravel developer",
    "Node.js",
    "AI agents",
    "Gilgit",
    "Pakistan",
  ],
  openGraph: {
    type: "website",
    title: TITLE,
    description: site.description,
    siteName: site.name,
    url: siteUrl,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0e0d0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrument.variable} h-full`}>
      <body className="min-h-dvh font-sans">
        <a
          href="#main"
          className="sr-only rounded-full bg-accent px-4 py-2 font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <div id="top" />
        <SmoothScroll>
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
