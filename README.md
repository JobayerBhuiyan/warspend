# Iran War Spend Tracker

Live estimate of U.S. taxpayer spending on military operations. Based on the Pentagon's preliminary estimate of $1 billion per day.

## Features

- **Animated live counter** — Real-time cost ticker (updates every 100ms) using Framer Motion
- **Interactive cost comparison chart** — Visualizes interceptor vs drone costs (Recharts)
- **Auto-updating data** — Fetches from Sanity CMS (revalidates hourly); falls back to static config when Sanity is unconfigured
- **Responsive design** — Mobile-first layout with Tailwind CSS
- **Share & copy link** — One-click sharing
- **Production-ready** — Open Graph, Twitter cards, sitemap, robots.txt

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. (Optional) Set `NEXT_PUBLIC_SITE_URL` to your production URL for correct Open Graph links.
3. Deploy — Vercel auto-detects Next.js.

## Updating Data

### With Sanity CMS (recommended)

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
2. Run Sanity Studio: `npx sanity dev` (or embed Studio in your app).
3. Edit the **Tracker Data** document in Studio — changes appear on the site within 1 hour (or on next deploy).

### Without Sanity (fallback)

Edit `config/trackerData.ts` to change:

- Start date (`START_DATE_ISO`)
- Daily cost estimate
- Equipment costs (THAAD, Patriot, drone)
- Human cost figures
- Stockpile stats
- Other estimates

Redeploy to publish changes.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Sanity CMS (optional)
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
