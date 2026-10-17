# Kalamkrutha Digital Studio — Album-style website (rebuild)

Date: 2026-10-17
Status: draft for owner review

## 1. Intent

Kalamkrutha Digital Studio is a neighbourhood photo and video studio in Guntur, Andhra Pradesh (since 2016). Weddings and functions are the high-value side; walk-in passport photos and studio sittings are the everyday side. They have no website, almost no portfolio online, and competitors win on visible work.

The site must make a visitor feel they are **turning the pages of a wedding album**: photographs first, quiet paper-like page, couple stories presented as album spreads. It must turn that feeling into WhatsApp / call / form enquiries.

This is a full restart. The previous static site (dark brown + gold) was rejected by the owner's representative, mainly for its colour scheme.

## 2. Goals

- First screen is a full-bleed photograph slideshow, visible immediately (no splash gate, no blank or blurred first paint).
- Every service on both shop posters is presented (see §6).
- Full English, Telugu and Hindi versions.
- Meets every requirement in `D:\Sunil\Website Requirements.docx` (Next.js App Router, TypeScript, Tailwind, Metadata API, sitemap, robots, JSON-LD, next/image, next/font, WCAG 2.1 AA, Core Web Vitals, security headers, contact form with RHF + Zod + server action + honeypot + rate limit + Turnstile + Resend + WhatsApp, legal pages, error pages, analytics hooks, PWA icons, lint + build pass). A completion checklist against that document is part of the deliverable.
- Uses **Framer Motion** for motion and a **slider library** (owner request; this overrides the doc's "no unnecessary libraries" for these two).

## 3. Non-goals

- No CMS, admin panel, booking calendar, payments or package configurator.
- No blog.
- No custom domain yet.

## 4. Anti-goals (failure even if it works)

- Dark-and-gold or any heavily coloured page chrome competing with the photos.
- Splash/"Enter" gate, autoplaying heavy video hero, scroll-jacking.
- Fake testimonials, ratings, statistics, awards, social profiles or client names presented as real. (Placeholder couple names are allowed only if visibly marked as sample content — see §9.)
- Walk-in passport/xerox content dominating or cheapening the wedding side.
- Navigation that becomes unreadable over light photos.

## 5. Visual direction — "Album Paper" (chosen by owner from 3 mockups)

Based on competitor dissection in `research/02-competitor-sites.md` (Adovasio, House on the Clouds, Vaibhavam).

- **Colours**: page `#F5F2ED` (warm paper), ink text `#232323`, single accent deep maroon `#7B1E2B` (buttons, small highlights, the "&" in couple names). Secondary text a muted warm grey that passes 4.5:1 on paper. Photos carry all other colour. WhatsApp green only on the WhatsApp button itself.
- **Type**: Cormorant Garamond (light/regular, mixed case) for display and headings; Inter for UI, body and small tracked uppercase labels. Telugu: Noto Serif Telugu (headings) + Noto Sans Telugu (body). Hindi: Noto Serif Devanagari + Noto Sans Devanagari. All via `next/font`.
- **Hero**: full-viewport photo crossfade (3 images, slow fade + subtle Ken Burns), short line "Life Time Memories" (from the poster), one line on what they do, primary CTA WhatsApp, secondary "See our stories". First image is the LCP image, not lazy-loaded.
- **Album spreads**: each featured story = couple names in large serif with maroon "&", place/date in small caps, 3–4 prints at mixed sizes and vertical offsets on paper, fading/drifting in on scroll.
- **Motion**: Framer Motion; reveals ~0.8–1s expo-out (`cubic-bezier(0.19,1,0.22,1)`), hovers ~0.3s. All motion disabled/reduced under `prefers-reduced-motion`. No smooth-scroll hijacking.
- **Sliders**: Embla Carousel (builder's pick; small, touch-first, React-friendly) — film-strip slider inside story pages and for service/video highlights.
- Header stays legible over photos (scrim or solid paper header after scroll).

Mockup reference: `.superpowers/brainstorm/13997-1792232267/content/colour-direction.html`, option A.

## 6. Content

### Business facts (from `research/01-business-research.md`; use only these)
- Name: **Kalamkrutha Digital Studio** (owner decision; not "Maranatha …").
- Address: Opp Bharath Gas, 3/1 Line, Sitaram Nagar-Old, Guntur 522001, Andhra Pradesh.
- Phone / WhatsApp: 88858 58111 (+91 8885858111).
- Email: kalamkrutha@gmail.com.
- Hours: Mon–Sun, 9:00 am – 9:00 pm.
- Since 2016. Payments: UPI / Paytm.
- Tagline from poster: "Life Time Memories"; "We shoot all type of function".

### Wedding & event services (poster 1, spelled correctly)
Wedding Photography · Traditional Videography · Candid Photography · Cinematic Videography · Pre-Wedding Photography · Post-Wedding Photography · All types of functions (engagement, birthday, half-saree, newborn and more — from Justdial listing). Plus owner-confirmed: video editing, album design and album making, full-function videos covering the whole ceremony, 3–5 minute candid highlight videos.

"From" prices (published on Justdial): Wedding photography from ₹25,000; Engagement from ₹12,000; Birthday from ₹10,000. Other services: "Ask on WhatsApp".

### Walk-in studio services (poster 2, PATWA rates from 01-05-2022)
- Passport-size photos, 8 copies — ₹120; extra 8 copies — ₹80
- Studio sitting photos, 2 copies, with background change — ₹250
- Matching photos, 2 copies, with background change (6x4 Maxi) — ₹250
- WhatsApp & email transfer — ₹50 extra
- Also: urgent passport photos, photostat, colour xerox (signage).

Presented in a quieter "Walk-in studio" section/strip, visually secondary to weddings.

Prices: owner said show them for now (2026-10-17). Keep all prices in one data file with a single `showPrices` flag so they can be hidden (falling back to "Ask on WhatsApp") without code changes elsewhere; flag "prices need owner confirmation" in the completion report.

### Copy
Professional, specific, no filler. English is the source; Telugu and Hindi are full translations. Existing translations in `i18n/build.py` and `te/`, `hi/` may be mined for terminology.

## 7. Pages (each in en, te, hi)

| Page | Route (en / te / hi) | Content |
|---|---|---|
| Home | `/`, `/te`, `/hi` | Hero slideshow → featured album spreads (3 stories) → services overview → walk-in studio strip → short about → enquiry CTA → footer |
| Stories | `/stories` | Grid/list of story covers |
| Story detail | `/stories/[slug]` | Album layout + Embla slider; 3 stories |
| Services | `/services` | All services with photo, what's included, "from" prices; walk-in section with poster rates |
| About | `/about` | Studio since 2016, what they do, address, hours, map |
| Contact | `/contact` | Form, WhatsApp, call, email, address, hours, map embed |
| Privacy / Terms / Cookies | `/privacy-policy`, `/terms`, `/cookie-policy` | Structured placeholder legal text, clearly marked for owner review |
| 404 | — | Branded, links home/stories/services/contact |

Locale routing: `/` = English (default, no prefix), `/te/...`, `/hi/...`. Language switcher keeps the current page. `hreflang` alternates + `x-default` on every page; `<html lang>` set per locale.

## 8. Lead system

- Fields: name, email (optional? — see note), phone, service interested in (select), event date (optional), message, honeypot.
  - Builder's call: phone required, email optional (Guntur customers book by phone/WhatsApp); doc's email-format validation applies when filled.
- RHF + Zod on client; same Zod schema re-validated in a Server Action.
- Spam: honeypot, in-memory/IP rate limit (note: per-instance on Vercel), Cloudflare Turnstile when `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set.
- Resend admin notification when `RESEND_API_KEY` / `ADMIN_EMAIL` set. Customer confirmation email only when `RESEND_FROM_EMAIL` is set to an address on a verified domain (off by default — without a domain, Resend can only send from `onboarding@resend.dev` to the account owner). Builder's call.
- WhatsApp Cloud API admin alert when `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `ADMIN_WHATSAPP_NUMBER` set; otherwise success screen offers a prefilled `wa.me/918885858111` link.
- If no delivery channel is configured, the form must not pretend success: it shows a message directing the user to WhatsApp/call with their details prefilled.
- Floating WhatsApp button site-wide with prefilled message (localised).

## 9. Images

- All current imagery is AI-generated placeholder (Codex). 23 new images in `_source/img/v2/` (hero ×3, story 1 Telugu Hindu wedding ×4, story 2 church wedding ×4, story 3 pre-wedding ×4, services ×8) plus 7 earlier ones in `_source/img/`.
- Converted to optimised WebP/AVIF in `public/images/`, served via `next/image`.
- `PLACEHOLDERS.md` kept and updated: every file, where it's used, what real photo replaces it.
- Story couple names and dates are sample content; mark them in code/data with a `placeholder: true` flag and note in PLACEHOLDERS.md. No "client testimonial" content.

## 10. SEO / platform

- Site URL from `NEXT_PUBLIC_SITE_URL`, default `https://kalamkrutha-studio.vercel.app`.
- Keep site non-indexed until launch: `robots` disallow + `noindex` controlled by an env flag (e.g. `NEXT_PUBLIC_ALLOW_INDEXING=false`). Turning it on is a one-variable change.
- Metadata API per page per locale; OG image 1200×630; Twitter `summary_large_image`.
- JSON-LD: LocalBusiness (PhotographyBusiness-appropriate type) with the real facts above, WebSite, BreadcrumbList, Service. No ratings/reviews schema.
- Map: Google Maps search-by-address embed (no API key) with an "Open in Maps" link; no `geo` coordinates in JSON-LD until the owner supplies a verified pin (flag in report). Builder's call.
- Social links: none known to be valid. Footer shows social icons only for URLs provided via config/env; none rendered by default.
- Analytics: GA4 / Plausible hooks behind env vars, not hard-coded.
- Hosting: existing Vercel project `kalamkrutha-studio`.

## 11. Existing project

The current folder holds the rejected static site (`index.html`, `styles.css`, `main.js`, `te/`, `hi/`, `i18n/`, `assets/`, `design-system/`). Builder's call: move these into `_legacy/` (not deleted) and scaffold the Next.js app at the project root. Keep `research/`, `_source/`, `docs/`, `.vercel/`.

## 12. Left to the builder

Component breakdown, exact spacing scale, slider variants, animation choreography details, icon set, legal text wording (placeholder), Telugu/Hindi translation wording (must be reviewed by a native speaker before launch — flag in report), story page layout specifics within the album-spread language.

## 13. Done means

`npm run lint` and `npm run build` pass; all pages render in 3 locales at 360–1920px without overflow; Lighthouse-level checks for a11y/SEO sane; requirements checklist (from the docx QA section) filled in with honest status (implemented / env-dependent / placeholder).
