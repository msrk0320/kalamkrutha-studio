# QA, performance and SEO report

Work done against `Kalamkrutha_Complete_Website_QA_SEO_Master_Document.docx` on 2026-10-28. The custom domain, turning indexing on, and the Google Business Profile were left out on purpose and are waiting on the owner.

Every number here was measured. Anything that was not run says so.

## Build and test evidence

| Check | Before (commit 2b5dd33) | After |
|---|---|---|
| `npm run lint` | Pass | Pass |
| `npm run typecheck` | Pass | Pass |
| `npm test` (Vitest) | 84 passed | 84 passed |
| `npm run build` | Pass | Pass |
| `npm run e2e` (Playwright) | 137 passed, 67 skipped | 146 passed, 67 skipped |

The skipped tests are skipped by design: the quality sweep runs only in the 1440px project, and the mobile menu tests run only below 1024px.

## Changes

| Issue | Fix | Files |
|---|---|---|
| The first photo on Services and Stories is the LCP element, but it was lazy-loaded and hidden by the reveal animation until JavaScript ran | The first photo on each page now loads eagerly with `fetchpriority="high"` and is not wrapped in `Reveal` | `components/sections/ServiceDetail.tsx`, `components/sections/StoryCard.tsx`, `components/ui/Photo.tsx`, `app/[locale]/services/page.tsx`, `app/[locale]/stories/page.tsx` |
| `/en/...` redirected with 307 (temporary) | `/en/...` now redirects with 308 (permanent). Language detection on `/` stays temporary | `proxy.ts` |
| A CSP `script-src` violation on `/contact`, from zod's `new Function` probe | `z.config({ jitless: true })` | `lib/validations/contact.ts` |
| framer-motion shipped its full feature set | Switched to `LazyMotion` + `m` with `domAnimation`. Script transfer per page dropped by about 15 KiB | `components/motion/Reveal.tsx`, `components/sections/HeroSlideshow.tsx` |
| The home page h1 was "Life Time Memories", which says nothing about the business or the place | The h1 is now "Wedding photography in Guntur · Since 2016", styled as the small eyebrow. "Life Time Memories" stays as the large visual headline. The Telugu and Hindi wording reuses phrases from those pages' existing titles | `app/[locale]/page.tsx`, `messages/*.json` |
| The viewport sweep left out 320, 430, 1366 and landscape | The sweep now covers the brief's full matrix plus three phone landscape sizes | `tests/e2e/quality.spec.ts` |
| New tests | `/en` returns 308; the first photo on Services and Stories is eager with high priority | `tests/e2e/navigation.spec.ts`, `tests/e2e/pages.spec.ts` |

## Lighthouse

Lighthouse 12.8.2, run locally in Playwright's Chromium, one run per page. Lab data only: there is no field (CrUX) data, because the site is not indexed and has no traffic. The PageSpeed Insights API returned a quota error ("Quota exceeded … Queries per day"), so it could not be used.

### Live site, before (kalamkrutha-studio.vercel.app, 2026-10-28 14:13 IST, simulated throttling)

| Page | Mobile P / A / BP / SEO | Mobile LCP | Desktop P / A / BP / SEO |
|---|---|---|---|
| `/` | 86 / 100 / 100 / 69 | 3.7 s | 99 / 100 / 100 / 69 |
| `/services` | 85 / 100 / 100 / 69 | 4.2 s | 100 / 100 / 100 / 69 |
| `/stories` | 90 / 100 / 100 / 69 | 3.4 s | 100 / 100 / 100 / 69 |
| `/contact` | 95 / 100 / 96 / 66 | 2.9 s | 100 / 100 / 96 / 66 |

The SEO score is capped only by `noindex` and `robots.txt Disallow: /`, both of which are intentional before launch.

### Local production build, before and after (`next start`)

With real (DevTools) throttling, mobile:

| Page | LCP before | LCP after |
|---|---|---|
| `/services` | 5.3 s (the lazy image) | 2.4 s |
| `/stories` | not measured | 1.9 s |
| `/` | 1.9 s (LCP = FCP) | not rerun |
| `/contact` | 1.9 s (LCP = FCP) | not rerun |

With simulated throttling, mobile, median of 3 runs per page, both builds measured the same way (Performance / LCP):

| Page | Original | Updated |
|---|---|---|
| `/` | 81 / 4.89 s | 81 / 4.87 s |
| `/services` | 81 / 4.81 s | 82 / 4.73 s |
| `/stories` | 86 / 4.24 s | 89 / 3.77 s |
| `/contact` | 91 / 3.49 s | 91 / 3.46 s |

Desktop scores are 98–100 on both builds. Best Practices on `/contact` went from 96 to 100 (the CSP issue is gone). `lcp-lazy-loaded` now passes on Services and Stories. This site's own JavaScript dropped by 16 KiB per page.

Simulated mobile scores barely move because Lighthouse estimates them from a model rather than measuring them. A real-throttled trace shows the home and contact text painting at FCP, so the simulated text LCP on those pages is an estimate, not a real delay, and that code was left alone.

The same results are on a dashboard: https://claude.ai/artifact/5869TrbSfwmZ2HTNbC9b3x

## Not changed, and why

- **Oversized images (14–34 KiB each):** the waste comes from Next's fixed image width steps (640, 750, 828…) at Lighthouse's 1.75 device-pixel ratio, not from wrong `sizes` values.
- **Legacy JavaScript (14 KiB):** this is Next's own polyfill chunk.
- **The Google Maps embed on `/contact` (about 470 KiB of third-party script):** it is already `loading="lazy"`, but Chrome's lazy-load distance still loads it on most screens. A click-to-load map would remove the cost, but it changes what visitors see, so it needs the owner's agreement first.

## Blocked, or waiting on the owner

| Item | What is needed |
|---|---|
| Custom domain and turning indexing on | Buy and confirm the domain, set `NEXT_PUBLIC_SITE_URL`, then set `NEXT_PUBLIC_ALLOW_INDEXING=true` |
| Google Search Console | Can only be set up once the domain is live and indexing is on: verify the domain property, submit `/sitemap.xml`, then inspect `/`, `/services` and `/contact` |
| Google Business Profile | Deferred by the owner |
| Field Core Web Vitals | Only available after the site is indexed and has traffic |
| Form delivery in production | Vercel keys: Turnstile, Resend, WhatsApp. The live HTML loads no Turnstile or analytics, so they appear to be unset. Not checked in the Vercel dashboard |
| Content | Real photos, real stories, confirmed prices and hours, a native-speaker review of the Telugu and Hindi (including the new home h1 wording), and the legal-page decisions (retention, advance payment, cancellation, delivery, photo rights) |
| Real devices | All viewport testing was emulated in Chromium |
