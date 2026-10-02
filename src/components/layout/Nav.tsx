"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/content/site";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || open ? "border-b border-line/70 bg-ink/75 backdrop-blur-md" : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="container-x flex h-[72px] items-center justify-between" aria-label="Primary">
        <ScrollLink href="#top" className="font-serif text-[1.65rem] italic leading-none text-fg" aria-label="Back to top">
          Ali<span className="text-accent">.</span>
        </ScrollLink>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <ScrollLink href={l.href} className="text-sm text-muted transition-colors hover:text-fg">
                {l.label}
              </ScrollLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden"
          >
            <ul className="container-x flex flex-col gap-1 pb-6 pt-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <ScrollLink
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-2xl font-medium tracking-[-0.02em] text-fg"
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
