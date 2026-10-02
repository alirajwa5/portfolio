import { marquee } from "@/content/site";
import { Marquee } from "@/components/ui/Marquee";
import { Hero } from "@/components/sections/Hero";
import { AppShowcase } from "@/components/sections/AppShowcase";
import { WebWork } from "@/components/sections/WebWork";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { TechBytes } from "@/components/sections/TechBytes";
import { Resume } from "@/components/sections/Resume";
import { Contact } from "@/components/sections/Contact";

// Instagram reels are re-fetched at most once an hour.
export const revalidate = 3600;

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Marquee items={marquee} className="mt-10" />
      <AppShowcase />
      <WebWork />
      <Skills />
      <Experience />
      <TechBytes />
      <Resume />
      <Contact />
    </main>
  );
}
