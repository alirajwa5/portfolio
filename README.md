# Ali Muhammad Rajwa — portfolio

Single-page portfolio: hero, a scroll-pinned showcase of seven mobile apps, web and systems work, skills, an experience timeline, the Tech Bytes content section, the resume, and contact.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (tokens in `src/app/globals.css`)
- Framer Motion for reveals, the pinned app showcase, the drag carousel
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

Deploys on Vercel with no extra config. Set `NEXT_PUBLIC_SITE_URL` to the production domain so Open Graph URLs are absolute (falls back to Vercel's project URL).

## Content

Everything on the page is data, no copy lives in components:

| File | What |
|---|---|
| `src/content/site.ts` | Name, role, links, hero stats, marquee, nav |
| `src/content/apps.ts` | The seven apps: copy, stack, role, status, links, screenshots |
| `src/content/web-work.ts` | The "also in production" cards |
| `src/content/skills.ts` | Skill groups (mirrors the resume) |
| `src/content/experience.ts` | Roles, education, freelance (mirrors the resume) |
| `src/content/tech-bytes.ts` | Reel covers, facts, pipeline copy |
| `src/content/resume.ts` | Summary + the content-creation block |

The resume PDF is `public/resume/updated_resume_2_oct.pdf`; update `site.resumePdf` / `site.resumeUpdated` when it changes.

## Images

Originals live in `assets-src/` (never served). `npm run images` converts them to WebP in `public/images/`:

- `assets-src/apps/<slug>/NN.*` raw phone shots
- `assets-src/apps/<slug>/framed-NN.png` Play-store mockups — the script finds the device bezel and crops the screen out
- `assets-src/apps/<slug>/tablet-NN.*` / `framed-tablet-NN.png` tablet shots
- `assets-src/apps/<slug>/icon.png` launcher icon
- `assets-src/content/NN.*` reel covers

Add a shot, run the script, reference `/images/apps/<slug>/NN.webp` in `apps.ts`.
