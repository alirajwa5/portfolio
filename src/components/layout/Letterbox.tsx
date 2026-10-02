/** Opening bars that part like the start of a film. CSS-only; hidden after the first view this session. */
export function Letterbox() {
  return (
    <div aria-hidden className="letterbox pointer-events-none fixed inset-0 z-[90]">
      <div className="letterbox-top absolute inset-x-0 top-0 flex h-[12vh] items-end justify-between bg-black px-5 pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45 sm:px-8">
        <span>Ali Muhammad Rajwa</span>
        <span className="hidden sm:inline">Portfolio — 2026</span>
      </div>
      <div className="letterbox-bottom absolute inset-x-0 bottom-0 flex h-[12vh] items-start justify-between bg-black px-5 pt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45 sm:px-8">
        <span>Scene 01 — Intro</span>
        <span>00:00:00:00</span>
      </div>
    </div>
  );
}
