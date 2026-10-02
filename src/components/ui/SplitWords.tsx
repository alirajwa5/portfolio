"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Word-by-word rise-in. Each word is clipped by its own box so descenders survive. */
export function SplitWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={cn("inline", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn("inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom", i < words.length - 1 && "mr-[0.22em]")}
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={reduced ? false : { y: "112%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, ease: EASE, delay: delay + i * 0.08 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
