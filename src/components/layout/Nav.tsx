"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navLinks, sectionIds, site } from "@/content/site";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

/** Full-width at the top; condenses into a floating glass pill once you scroll. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pill = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex h-14 items-center justify-between rounded-full border transition-[max-width,background-color,border-color,box-shadow,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          pill
            ? "max-w-[880px] border-line/80 bg-ink/70 pl-5 pr-2 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            : "max-w-[1200px] border-transparent bg-transparent pl-2 pr-0 sm:pl-4",
        )}
      >
        <ScrollLink href="#top" offset={0} className="font-serif text-[1.65rem] italic leading-none text-fg" aria-label="Back to top">
          Ali<span className="text-accent">.</span>
        </ScrollLink>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href}>
                <ScrollLink
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative block rounded-full px-3 py-1.5 text-sm transition-colors",
                    isActive ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-surface-2"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </ScrollLink>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <a href={`mailto:${site.email}`} className="btn btn-primary btn-sm hidden sm:inline-flex">
            Email me
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="btn btn-ghost btn-sm md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-2 max-w-[880px] overflow-hidden rounded-3xl border border-line bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1 p-4">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <ScrollLink
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-2xl font-medium tracking-[-0.02em] text-fg"
                  >
                    {l.label}
                  </ScrollLink>
                </li>
              ))}
              <li className="pt-3">
                <a href={`mailto:${site.email}`} className="btn btn-primary">
                  Email me
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
