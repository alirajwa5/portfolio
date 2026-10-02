"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "@/components/layout/SmoothScroll";
import { ArrowOut } from "@/components/ui/Button";
import { ChevronIcon, CloseIcon, InstagramIcon, PlayIcon } from "@/components/ui/icons";
import { useHasFinePointer } from "@/hooks/useMediaQuery";

const EASE = [0.16, 1, 0.3, 1] as const;

export type ReelCard = {
  id: string;
  title: string;
  meta: string;
  poster: string | null;
  /** Instagram video URL. Null for local covers, or when Instagram withholds it (copyrighted audio). */
  video: string | null;
  /** Instagram permalink. */
  href: string | null;
};

/** Five vertical reels: hover plays a muted preview, click opens the lightbox with sound. */
export function ReelsRow({ cards }: { cards: ReelCard[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
        {cards.map((card, i) => (
          <ReelTile key={card.id} card={card} index={i} onOpen={() => setOpen(i)} />
        ))}
      </ul>
      <AnimatePresence>
        {open !== null && cards[open]?.video && <Lightbox key="reel-lightbox" cards={cards} index={open} onIndex={setOpen} onClose={close} />}
      </AnimatePresence>
    </>
  );
}

function ReelTile({ card, index, onOpen }: { card: ReelCard; index: number; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const finePointer = useHasFinePointer();

  const preview = () => {
    if (!finePointer) return;
    videoRef.current?.play().catch(() => {});
  };
  const stopPreview = () => {
    videoRef.current?.pause();
  };

  const media = card.video ? (
    <video
      ref={videoRef}
      src={card.video}
      poster={card.poster ?? undefined}
      muted
      loop
      playsInline
      preload={card.poster ? "none" : "metadata"}
      className="absolute inset-0 h-full w-full object-cover"
    />
  ) : card.poster ? (
    <Image
      src={card.poster}
      alt=""
      fill
      sizes="(min-width: 1024px) 220px, 64vw"
      unoptimized={card.poster.startsWith("http")}
      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
    />
  ) : null;

  const overlay = (
    <>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-16">
        {card.meta && <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">{card.meta}</p>}
        <p className="mt-2 line-clamp-3 text-sm leading-snug text-paper">{card.title}</p>
      </div>
      <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-paper backdrop-blur">
        {card.video ? <PlayIcon width={14} height={14} className="translate-x-px" /> : card.href ? <InstagramIcon width={15} height={15} /> : <PlayIcon width={14} height={14} />}
      </span>
    </>
  );

  const frame = "group relative block aspect-[9/16] w-full overflow-hidden rounded-2xl border border-line bg-surface text-left";

  return (
    <motion.li
      className="w-[64vw] max-w-[260px] shrink-0 snap-start sm:w-[240px] lg:w-auto lg:max-w-none"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.06 }}
    >
      {card.video ? (
        <button
          type="button"
          onClick={onOpen}
          onPointerEnter={preview}
          onPointerLeave={stopPreview}
          onFocus={preview}
          onBlur={stopPreview}
          aria-label={`Play: ${card.title}`}
          className={frame}
        >
          {media}
          {overlay}
        </button>
      ) : card.href ? (
        <a href={card.href} target="_blank" rel="noreferrer noopener" aria-label={`${card.title} on Instagram`} className={frame}>
          {media}
          {overlay}
        </a>
      ) : (
        <div className={frame}>
          {media}
          {overlay}
        </div>
      )}
    </motion.li>
  );
}

function Lightbox({
  cards,
  index,
  onIndex,
  onClose,
}: {
  cards: ReelCard[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const playable = useMemo(() => cards.map((c, i) => (c.video ? i : -1)).filter((i) => i >= 0), [cards]);
  const pos = playable.indexOf(index);
  const card = cards[index];

  const go = useCallback(
    (dir: number) => {
      if (playable.length < 2) return;
      onIndex(playable[(pos + dir + playable.length) % playable.length]);
    },
    [playable, pos, onIndex],
  );

  useEffect(() => {
    lenis?.stop();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      root.style.overflow = previous;
    };
  }, [lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, go]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={card.title}
      className="fixed inset-0 z-[85] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex w-full flex-col gap-4"
        style={{ maxWidth: "min(480px, calc((100dvh - 9rem) * 9 / 16))" }}
        initial={{ y: 16, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 16, scale: 0.97 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          key={card.id}
          src={card.video ?? undefined}
          poster={card.poster ?? undefined}
          controls
          autoPlay
          playsInline
          className="aspect-[9/16] w-full rounded-2xl bg-black object-cover"
        />
        <div className="flex items-start justify-between gap-4 text-paper">
          <div className="min-w-0">
            <p className="text-sm leading-snug">{card.title}</p>
            {card.meta && <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">{card.meta}</p>}
          </div>
          {card.href && (
            <a
              href={card.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs text-paper transition-colors hover:border-white/50"
            >
              Instagram <ArrowOut />
            </a>
          )}
        </div>
      </motion.div>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-paper transition-colors hover:border-white/50"
      >
        <CloseIcon />
      </button>
      {playable.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous reel"
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-paper transition-colors hover:border-white/50 sm:flex"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next reel"
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-paper transition-colors hover:border-white/50 sm:flex"
          >
            <ChevronIcon direction="right" />
          </button>
        </>
      )}
    </motion.div>
  );
}
