"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const LenisContext = createContext<Lenis | null>(null);

/** The live Lenis instance (null under reduced motion or before mount). */
export const useLenis = () => useContext(LenisContext);

/** Smoothly scroll to a selector, element or offset; falls back to native scrolling. */
export function useScrollTo() {
  const lenis = useLenis();
  return (target: string | HTMLElement | number, offset = 0) => {
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.2 });
      return;
    }
    if (typeof target === "string") {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (typeof target === "number") {
      window.scrollTo({ top: target + offset, behavior: "smooth" });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      autoRaf: true,
    });
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
