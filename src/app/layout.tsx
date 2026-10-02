import type { Metadata, Viewport } from "next";
import "./globals.css";
import { geist, geistMono, instrument } from "@/lib/fonts";
import { site, siteUrl } from "@/content/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Letterbox } from "@/components/layout/Letterbox";
import { SitePlayer } from "@/components/layout/SitePlayer";
import { FilmProvider } from "@/components/film/FilmProvider";

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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e0d0b" },
    { media: "(prefers-color-scheme: light)", color: "#f4efe6" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Runs before paint: picks the theme (saved choice, else the system's) and marks
// whether the opening letterbox already played this session.
const bootScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.dataset.theme=t}catch(e){d.dataset.theme='dark'}try{if(sessionStorage.getItem('intro-seen')){d.dataset.intro='seen'}else{sessionStorage.setItem('intro-seen','1')}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${instrument.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh font-sans">
        <a
          href="#main"
          className="sr-only rounded-full bg-accent px-4 py-2 font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <div id="top" />
        <Letterbox />
        <SmoothScroll>
          <FilmProvider>
            <Nav />
            {children}
            <Footer />
            <SitePlayer />
          </FilmProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
