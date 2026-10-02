# Ali Muhammad Rajwa — portfolio

Single-page portfolio built like a film: a cinematic opening, a 45-second intro film made in code, a scroll-pinned showcase of seven mobile apps, web and systems work, skills, an experience timeline, the latest Instagram reels, the resume, and contact. Dark and light themes.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (tokens and both themes in `src/app/globals.css`)
- Framer Motion for scroll-linked motion, the pinned app showcase and the intro film
- Lenis for smooth scrolling (disabled under `prefers-reduced-motion`)
- `next/image` + `next/font` (Geist, Geist Mono, Instrument Serif)

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Deploys on Vercel with no extra config. Environment variables:

| Variable | What |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production domain, so Open Graph URLs are absolute (falls back to Vercel's project URL) |
| `INSTAGRAM_ACCESS_TOKEN` | Optional. Turns on the live Instagram reels (see below) |

## What moves, and where it lives

| Piece | Where | Notes |
|---|---|---|
| Opening letterbox + letter-by-letter name | `components/layout/Letterbox.tsx`, `components/hero/CharRise.tsx`, `globals.css` | Pure CSS, plays before hydration. Letterbox once per browser session |
| Hero stage | `components/hero/HeroStage.tsx` | Ken Burns portrait, live timecode, a lower-third cycling through the apps. Dark in both themes |
| Intro film | `components/film/` + `content/film.ts` | Seven scenes drawn in code, one clock, so it plays, pauses, seeks and scrubs like a video. Space/K play-pause, ←/→ seek 5 s, Esc closes. Loaded only when opened. Deep link: `/#intro` |
| Site player | `components/layout/SitePlayer.tsx` | The page as a video: chaptered progress bar at the bottom (desktop), drag to scrub, ▶ scrolls the whole site by itself. Any wheel, touch or scroll key pauses it |
| Themes | `components/layout/ThemeToggle.tsx`, boot script in `app/layout.tsx` | First visit follows the system; the choice is remembered. New theme grows out of the button where View Transitions are supported |
| Pinned app showcase | `components/sections/AppShowcase.tsx` | Desktop; stacked cards on mobile |

Everything respects `prefers-reduced-motion`.

## Content

All copy is data, no copy lives in components:

| File | What |
|---|---|
| `src/content/site.ts` | Name, role, links, hero stats, marquee, chapters (nav + player) |
| `src/content/apps.ts` | The seven apps: copy, stack, role, status, links, screenshots |
| `src/content/film.ts` | Intro film scenes, timings and copy |
| `src/content/web-work.ts` | The "also in production" cards |
| `src/content/skills.ts` | Skill groups (mirrors the resume) |
| `src/content/experience.ts` | Roles, education, freelance (mirrors the resume) |
| `src/content/tech-bytes.ts` | Local reel covers (Instagram fallback), facts, pipeline copy |
| `src/content/resume.ts` | Summary + the content-creation block |

The resume PDF is `public/resume/updated_resume_2_oct.pdf`; update `site.resumePdf` / `site.resumeUpdated` when it changes.

## Instagram reels

The Tech Bytes section shows the latest 5 videos from the Instagram account behind `INSTAGRAM_ACCESS_TOKEN`: hover plays a muted preview, click opens a player with sound. The token stays on the server; the page re-fetches at most once an hour. Without a token, or if the call fails, the section shows the five newest local covers instead.

Getting a token (Instagram API with Instagram Login):

1. The Instagram account must be **Professional** (Creator or Business): Instagram app → Settings → Account type.
2. [developers.facebook.com](https://developers.facebook.com) → Create app → type **Business** → add the **Instagram** product.
3. Instagram → **API setup with Instagram login** → add your account → **Generate token**. It is long-lived (60 days) and carries `instagram_business_basic`.
4. Put it in `.env.local` as `INSTAGRAM_ACCESS_TOKEN=...` and in Vercel → Project → Settings → Environment Variables.
5. Before the 60 days run out (the token must be at least 24 hours old), refresh it and replace the variable with the returned `access_token`:

   ```bash
   curl "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=$INSTAGRAM_ACCESS_TOKEN"
   ```

## Images

Originals live in `assets-src/` (never served). `npm run images` converts them to WebP in `public/images/`:

- `assets-src/apps/<slug>/NN.*` raw phone shots
- `assets-src/apps/<slug>/framed-NN.png` Play-store mockups — the script finds the device bezel and crops the screen out
- `assets-src/apps/<slug>/tablet-NN.*` / `framed-tablet-NN.png` tablet shots
- `assets-src/apps/<slug>/icon.png` launcher icon
- `assets-src/apps/<slug>/_unused/` candidates not on the site (the script skips subfolders)
- `assets-src/content/NN.*` reel covers

To use a shot: move it up out of `_unused/`, run the script, reference `/images/apps/<slug>/NN.webp` in `apps.ts`. Check screenshots for other people's names, numbers and emails before they go in.
