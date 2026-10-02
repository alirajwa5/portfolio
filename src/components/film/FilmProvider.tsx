"use client";

import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLenis } from "@/components/layout/SmoothScroll";

// The film is only fetched when someone presses play (or hovers the button).
const IntroFilm = dynamic(() => import("./IntroFilm"), { ssr: false });

export const prefetchFilm = () => {
  void import("./IntroFilm");
};

type FilmContextValue = { open: () => void; close: () => void; isOpen: boolean };

const FilmContext = createContext<FilmContextValue>({ open: () => {}, close: () => {}, isOpen: false });

export const useFilm = () => useContext(FilmContext);

/** Owns the intro film overlay: open/close, scroll lock, focus return, and the /#intro deep link. */
export function FilmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const lenis = useLenis();
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (window.location.hash === "#intro") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    requestAnimationFrame(() => returnFocus.current?.focus());
  }, []);

  useEffect(() => {
    if (window.location.hash === "#intro") setOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      lenis?.start();
      root.style.overflow = previous;
    };
  }, [isOpen, lenis]);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <FilmContext.Provider value={value}>
      {children}
      <AnimatePresence>{isOpen && <IntroFilm key="intro-film" onClose={close} />}</AnimatePresence>
    </FilmContext.Provider>
  );
}
