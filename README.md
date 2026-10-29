# Kalamkrutha Digital Studio website

This is the album-style website for Kalamkrutha Digital Studio in Guntur, available in English, Telugu (`/te`) and Hindi (`/hi`).

It is built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, next-intl, Framer Motion, animejs, Swiper, Lenis, React Hook Form + Zod, and Resend.

- Design spec: `docs/superpowers/specs/2026-10-17-kalamkrutha-album-site-design.md`
- Requirements status: `docs/REQUIREMENTS-CHECKLIST.md`
- Placeholder images: `public/images/PLACEHOLDERS.md`

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: fill in only the services you use
npm run dev                  # http://localhost:3000
```

## Checks

| Command | What it does |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Vitest unit tests |
| `npm run e2e:install` | One-time install of the Playwright Chromium browser into `C:\Tools\Playwright` |
| `npm run e2e` | Builds the site, then runs the Playwright tests. These cover navigation, every page in all three languages at 10 screen widths, and axe accessibility checks |
| `npm run build` | Production build |

## Content

- **Copy:** the text lives in `messages/en.json`, `te.json` and `hi.json`. The three files must contain the same keys, and a test enforces this.
- **Services, prices and walk-in rates:** these are in `lib/content/services.ts`. Set `pricing.showPrices = false` to replace every price with "Ask on WhatsApp".
- **Stories:** these are in `lib/content/stories.ts`.
- **Business details:** these are in `lib/content/business.ts`.

### Replacing photos

1. Put the new photo in `_source/img/` (or `_source/img/v2/`), using the filename that `scripts/build-images.mjs` expects for it.
2. Run `npm run images`. This writes optimised WebP files to `public/images/` and updates `lib/content/image-manifest.json`.
3. Update the alt text under `Images` in the three message files.
4. If you changed the hero photo, run `npm run icons` to regenerate the social-share image.

Note that `_source/` is not committed to git, so keep a backup of the original photos.

## Environment variables

See `.env.example`. Every variable is optional, and the site works without any of them.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The canonical domain. It defaults to `https://kalamkrutha-studio.vercel.app` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Set it to `true` at launch to let search engines index the site |
| `RESEND_API_KEY`, `ADMIN_EMAIL` | Email notification to the studio for each enquiry |
| `RESEND_FROM_EMAIL` | A sender on a domain verified in Resend. Setting it also turns on customer confirmation emails |
| `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `ADMIN_WHATSAPP_NUMBER` | WhatsApp Cloud API alert for each enquiry |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile spam protection on the form |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4. It loads only after the visitor accepts cookies |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics, which needs no cookies |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console verification |
| `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_YOUTUBE_URL` | Social links in the footer, which appear only when set |

If neither email nor WhatsApp is configured, the contact form doesn't pretend to send. Instead it gives the visitor a WhatsApp link with their enquiry already filled in.

## Deploy (Vercel)

The project is linked to the Vercel project `kalamkrutha-studio`.

```bash
npx vercel          # preview deployment
npx vercel --prod   # production
```

Set environment variables in the Vercel dashboard under Project → Settings → Environment Variables.

### Launch checklist

1. Add the custom domain in Vercel, then set `NEXT_PUBLIC_SITE_URL` to it.
2. Replace the placeholder photos and sample stories, and confirm the prices.
3. Have a native speaker review the Telugu and Hindi text, and have the studio approve the legal pages.
4. Configure Resend, WhatsApp and Turnstile.
5. Set `NEXT_PUBLIC_ALLOW_INDEXING=true`, redeploy, then submit `/sitemap.xml` in Google Search Console.
