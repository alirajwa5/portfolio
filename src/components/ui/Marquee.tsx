import { cn } from "@/lib/utils";

/** Infinite horizontal ticker. Pure CSS; pauses on hover, static under reduced motion. */
export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const list = [...items, ...items];
  return (
    <div className={cn("marquee relative overflow-hidden border-y border-line/70 py-4", className)} aria-hidden>
      <div className="animate-marquee flex w-max">
        {list.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 pr-8 font-mono text-[11px] uppercase tracking-[0.3em] text-muted"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-accent/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
