import { getLatestVideos } from "@/lib/instagram";
import { LATEST_COUNT, reels, techBytes } from "@/content/tech-bytes";
import { site } from "@/content/site";
import { ArrowOut } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/icons";
import { ReelsRow, type ReelCard } from "./ReelsRow";

/** First caption line, hashtags dropped, trimmed to a card's worth. */
function captionTitle(caption: string) {
  const line = caption.split("\n").map((s) => s.trim()).find(Boolean) ?? "";
  const clean = line.replace(/#\w+/g, "").replace(/\s{2,}/g, " ").trim();
  return clean.length > 90 ? `${clean.slice(0, 88).trimEnd()}…` : clean;
}

function shortDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Karachi" });
}

/** Scene 05. Live from Instagram when INSTAGRAM_ACCESS_TOKEN is set (hourly refresh), local covers otherwise. */
export async function TechBytes() {
  const feed = await getLatestVideos(LATEST_COUNT);

  const cards: ReelCard[] = feed
    ? feed.videos.map((v) => ({
        id: v.id,
        title: captionTitle(v.caption) || "Watch on Instagram",
        meta: shortDate(v.timestamp),
        poster: v.posterUrl,
        video: v.videoUrl,
        href: v.permalink,
      }))
    : reels.slice(0, LATEST_COUNT).map((r) => ({
        id: `local-${r.n}`,
        title: r.title,
        meta: `${r.series} · ${String(r.n).padStart(2, "0")}`,
        poster: r.cover,
        video: null,
        href: null,
      }));

  const handle = feed?.username ?? null;

  return (
    <section id="tech-bytes" className="container-x scroll-mt-20 pt-28">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <Reveal>
          <SectionHeading
            eyebrow="05 · Content creation"
            title={
              <>
                {techBytes.heading}, <span className="font-serif italic text-accent">in Roman Urdu</span>
              </>
            }
            description={techBytes.intro}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="grid grid-cols-2 gap-6 border-l border-line pl-6">
            {techBytes.facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-muted">{f.label}</dt>
                <dd className="text-3xl font-medium tracking-[-0.02em] text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <Reveal className="mt-14 flex flex-wrap items-end justify-between gap-4">
        <p className="eyebrow">{handle ? `Latest ${cards.length} on Instagram` : `Latest ${cards.length} reels`}</p>
        {handle && (
          <a
            href={`https://www.instagram.com/${handle}/`}
            target="_blank"
            rel="noreferrer noopener"
            className="font-serif text-3xl italic text-fg transition-colors hover:text-accent sm:text-4xl"
          >
            @{handle}
          </a>
        )}
      </Reveal>

      <div className="mt-6">
        <ReelsRow cards={cards} />
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal>
          <p className="max-w-xl text-lg leading-relaxed text-muted">{techBytes.pipeline}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Production tools">
            {techBytes.tools.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="lg:justify-self-end">
          {handle ? (
            <a href={`https://www.instagram.com/${handle}/`} target="_blank" rel="noreferrer noopener" className="btn btn-primary">
              <InstagramIcon /> Follow on Instagram <ArrowOut />
            </a>
          ) : (
            <a href={site.linkedin} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
              <LinkedInIcon /> Watch on LinkedIn <ArrowOut />
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
