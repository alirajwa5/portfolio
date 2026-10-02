/**
 * Latest videos from Instagram, server-side only (the token never reaches the browser).
 *
 * Instagram API with Instagram Login, graph.instagram.com, permission `instagram_business_basic`.
 * Needs a Professional (Creator or Business) account and a long-lived token in INSTAGRAM_ACCESS_TOKEN.
 * Tokens last 60 days; README.md has the refresh call. Without a token, or on any error, this returns
 * null and the section shows the local covers instead.
 */

const API = "https://graph.instagram.com/v25.0";
const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username";
export const INSTAGRAM_REVALIDATE = 3600;

type IgMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  /** Omitted by Instagram when the media is flagged for copyrighted audio. */
  media_url?: string;
  /** Only present on VIDEO. */
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  username?: string;
};

export type InstagramVideo = {
  id: string;
  caption: string;
  videoUrl: string | null;
  posterUrl: string | null;
  permalink: string;
  timestamp: string;
};

export type InstagramFeed = {
  username: string | null;
  videos: InstagramVideo[];
};

export async function getLatestVideos(count: number): Promise<InstagramFeed | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return null;

  const url = `${API}/me/media?fields=${FIELDS}&limit=25&access_token=${encodeURIComponent(token)}`;
  try {
    const res = await fetch(url, { next: { revalidate: INSTAGRAM_REVALIDATE } });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[instagram] HTTP ${res.status}: ${body.slice(0, 300)}`);
      return null;
    }
    const json = (await res.json()) as { data?: IgMedia[] };
    const videos = (json.data ?? []).filter((m) => m.media_type === "VIDEO").slice(0, count);
    if (!videos.length) return null;
    return {
      username: videos[0].username ?? null,
      videos: videos.map((m) => ({
        id: m.id,
        caption: (m.caption ?? "").trim(),
        videoUrl: m.media_url ?? null,
        posterUrl: m.thumbnail_url ?? null,
        permalink: m.permalink,
        timestamp: m.timestamp,
      })),
    };
  } catch (err) {
    console.error("[instagram] request failed", err);
    return null;
  }
}
