import { cn } from "@/lib/utils";

/**
 * Letters rise out of their word's box one after another. Pure CSS (`.char` in globals.css),
 * so it plays before hydration and is static under reduced motion. Wrap in an element that
 * carries the readable text; this one is decorative.
 */
export function CharRise({
  text,
  delay = 0,
  stagger = 0.035,
  className,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const words = text.split(" ");
  const starts: number[] = [];
  let count = 0;
  for (const word of words) {
    starts.push(count);
    count += word.length;
  }

  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span
          key={`${word}-${wi}`}
          className={cn(
            "-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] pr-[0.08em] align-bottom",
            wi < words.length - 1 && "mr-[0.14em]",
          )}
        >
          {Array.from(word).map((ch, ci) => (
            <span key={ci} className="char" style={{ animationDelay: `${(delay + (starts[wi] + ci) * stagger).toFixed(3)}s` }}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
