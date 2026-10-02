"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type Range = [number, number];

/** Scroll-linked drift for the hero: the camera pulls away as you leave. Desktop only. */
export function ScrollDrift({
  children,
  className,
  y = [0, 0],
  scale = [1, 1],
  opacity = [1, 1],
  distance = 700,
}: {
  children: ReactNode;
  className?: string;
  y?: Range;
  scale?: Range;
  opacity?: Range;
  distance?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const { scrollY } = useScroll();
  const ty = useTransform(scrollY, [0, distance], y);
  const s = useTransform(scrollY, [0, distance], scale);
  const o = useTransform(scrollY, [0, distance], opacity);
  const active = desktop && !reduced;

  return (
    <motion.div className={className} style={active ? { y: ty, scale: s, opacity: o } : undefined}>
      {children}
    </motion.div>
  );
}
