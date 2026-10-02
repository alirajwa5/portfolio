"use client";

import { filmLengthLabel } from "@/content/film";
import { prefetchFilm, useFilm } from "@/components/film/FilmProvider";
import { PlayIcon } from "@/components/ui/icons";

export function WatchIntroButton() {
  const { open } = useFilm();
  return (
    <button type="button" onClick={open} onPointerEnter={prefetchFilm} onFocus={prefetchFilm} className="btn btn-ghost">
      <span aria-hidden className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-ink">
        <PlayIcon width={9} height={9} className="translate-x-[0.5px]" />
      </span>
      Watch the intro
      <span className="font-mono text-xs text-dim">{filmLengthLabel}</span>
    </button>
  );
}
