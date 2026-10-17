# Kalamkrutha Album Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Kalamkrutha Digital Studio website as an album-style, photo-first Next.js site in English, Telugu and Hindi, meeting every item in `D:\Sunil\Website Requirements.docx`.

**Architecture:** Next.js App Router with a `[locale]` segment (next-intl, English unprefixed). Page content is Server Components reading typed data from `lib/content/*` and strings from `messages/{en,te,hi}.json`. Client components only for: hero slideshow, scroll reveals, Embla sliders, mobile nav, language switcher, contact form, cookie banner. The contact form posts to a Server Action that validates with the shared Zod schema and fans out to Resend / WhatsApp Cloud API when configured.

**Tech Stack:** Node 26, Next.js 16.4, React 19, TypeScript strict, Tailwind CSS 4, next-intl 4, framer-motion 14, embla-carousel-react 8, react-hook-form 7 + @hookform/resolvers, zod 4, resend, sharp (image script), Vitest + Testing Library, Playwright + @axe-core/playwright.

**Spec:** `docs/superpowers/specs/2026-10-17-kalamkrutha-album-site-design.md`

## Global Constraints

- Name everywhere: **Kalamkrutha Digital Studio**. Never "Maranatha".
- Facts (only these): Opp Bharath Gas, 3/1 Line, Sitaram Nagar-Old, Guntur 522001, Andhra Pradesh · +91 88858 58111 (phone + WhatsApp) · kalamkrutha@gmail.com · Mon–Sun 9:00 am – 9:00 pm · since 2016 · UPI/Paytm.
- Colours: paper `#F5F2ED`, ink `#232323`, accent maroon `#7B1E2B`, muted text must pass 4.5:1 on paper (use `#5E554C`). WhatsApp green `#25D366` only on WhatsApp buttons.
- Fonts via `next/font/google`: Cormorant Garamond (display), Inter (UI/body), Noto Serif Telugu + Noto Sans Telugu, Noto Serif Devanagari + Noto Sans Devanagari.
- Motion: reveals `duration: 0.9, ease: [0.19, 1, 0.22, 1]`; hovers 0.3s; everything respects `prefers-reduced-motion` (use framer-motion `useReducedMotion` / `MotionConfig reducedMotion="user"`).
- No splash gate, no video hero, no scroll hijacking, no fake reviews/ratings/stats/social links.
- Site URL `process.env.NEXT_PUBLIC_SITE_URL ?? "https://kalamkrutha-studio.vercel.app"`. Indexing only when `NEXT_PUBLIC_ALLOW_INDEXING === "true"`.
- Locales `["en","te","hi"]`, default `en`, `localePrefix: "as-needed"`.
- Secrets never imported into client components; server-only modules start with `import "server-only"`.
- No `any`. One `<h1>` per page.
- Next 16: request interception file is `proxy.ts` (not `middleware.ts`); `params` is a Promise; lint via `eslint .` (not `next lint`).

- Before Tasks 1, 3, 6 and 9: pull current docs via context7 for Next.js 16 (`proxy.ts`, async params, flat ESLint), next-intl 4 (proxy + root layout/not-found pattern), framer-motion 14 import path, Embla 8 thumbnails, zod 4 API.
- Email is optional in the form (spec decision) — a deliberate deviation from the docx; record it as such in the checklist.
- `vercel deploy` (Task 12) only after explicit user confirmation.

## Review Focus

1. Telugu/Hindi strings are longer: nav, buttons and hero headline must not overflow at 360px in `te`/`hi` — covered by the overflow sweep in Task 12 run for all three locales.
2. Form submitted when no delivery channel (Resend/WhatsApp) is configured must NOT show "received"; it returns `status: "no-channel"` and shows a prefilled WhatsApp link — test in Task 9.
3. Indian phone input in real formats (`88858 58111`, `+91 8885858111`, `08885858111`, `+91-88858-58111`) must validate and normalise to `+918885858111`; `12345` must fail — test in Task 9.
4. Reduced-motion users: hero slideshow must not auto-advance or Ken-Burns — test in Task 6.
5. Unknown story slug in any locale (`/te/stories/nope`) returns the localised branded 404, not a crash — test in Task 7.

---

### Task 1: Scaffold, legacy move, tooling

**Files:**
- Move: `index.html styles.css main.js te/ hi/ i18n/ assets/ design-system/ vercel.json .vercelignore` → `_legacy/`
- Create: Next app at project root (`app/`, `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`), `vitest.config.ts`, `playwright.config.ts`, `.env.example`, `.gitignore`, `tests/unit/smoke.test.ts`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `start`, `lint` (`eslint .`), `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `e2e` (`playwright test`), `images` (Task 4).

- [ ] **Step 1:** `git init` in project root; `.gitignore` includes `node_modules .next .env*.local .superpowers/ _source/ .vercel playwright-report test-results`. Commit spec + plan + research.
- [ ] **Step 2:** Move legacy files listed above into `_legacy/` (keep `research/ _source/ docs/ .vercel/`). Exclude `_legacy` from tsconfig/eslint.
- [ ] **Step 3:** Scaffold with `npx create-next-app@16.4.2 . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm` (into a temp dir and copy in if it refuses a non-empty dir). Install: `next-intl framer-motion embla-carousel-react react-hook-form @hookform/resolvers zod resend server-only`; dev: `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test @axe-core/playwright sharp`.
- [ ] **Step 4:** `tsconfig` `strict: true`, `noUncheckedIndexedAccess: true`.
- [ ] **Step 5:** `next.config.ts`: wrap with `createNextIntlPlugin("./i18n/request.ts")`; `images.formats: ["image/avif","image/webp"]`; `headers()` for `/(.*)`: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and a static CSP (pages stay statically rendered, so no nonce): `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://plausible.io` plus `'unsafe-eval'` only when `NODE_ENV !== "production"`; `connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://plausible.io`; `frame-src https://challenges.cloudflare.com https://www.google.com https://maps.google.com`; `style-src 'self' 'unsafe-inline'`; `img-src 'self' data: blob:`; `font-src 'self'`; `frame-ancestors 'none'`.
- [ ] **Step 5b:** `npm run build && npm start`, load `/` in Playwright, assert zero console CSP violations and that a client component hydrates (temporary button toggles state). Remove the temp button after.
- [ ] **Step 5c:** New `vercel.json` `{ "framework": "nextjs" }` (+ keep `X-Robots-Tag` out; robots handled in Task 10). New `.vercelignore`: `_source/ _legacy/ .superpowers/ research/ docs/ tests/ playwright-report/ test-results/`. Use `npx vercel`, never a global install.
- [ ] **Step 6:** `.env.example` documents: `NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_ALLOW_INDEXING, RESEND_API_KEY, ADMIN_EMAIL, RESEND_FROM_EMAIL, WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID, ADMIN_WHATSAPP_NUMBER, NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_PLAUSIBLE_DOMAIN, GOOGLE_SITE_VERIFICATION, NEXT_PUBLIC_INSTAGRAM_URL, NEXT_PUBLIC_FACEBOOK_URL, NEXT_PUBLIC_YOUTUBE_URL` with one-line comments.
- [ ] **Step 7a:** Playwright browsers install ONLY to `C:\Tools\Playwright` (user hard rule): set `PLAYWRIGHT_BROWSERS_PATH=C:\Tools\Playwright` for `npx playwright install chromium` and in the `e2e` npm script (via `cross-env`) and README.
- [ ] **Step 7:** Vitest (jsdom, `@` alias) + `tests/unit/smoke.test.ts` asserting `1+1===2`; Playwright with projects `mobile-360` (360×800), `tablet-820`, `desktop-1440`, `webServer: npm run build && npm run start`.
- [ ] **Step 8:** Run `npm run lint && npm run typecheck && npm test && npm run build` → all pass.
- [ ] **Step 9:** Commit `chore: scaffold Next.js app, move static site to _legacy`.

### Task 2: Design system

**Files:**
- Create: `app/globals.css` (replace), `lib/fonts.ts`, `components/ui/Button.tsx`, `components/ui/Container.tsx`, `components/ui/Eyebrow.tsx`, `components/ui/CoupleNames.tsx`, `components/motion/Reveal.tsx`, `tests/unit/ui.test.tsx`

**Interfaces:**
- Produces:
  - Tailwind v4 `@theme` tokens: `--color-paper #F5F2ED`, `--color-paper-deep #ECE6DD`, `--color-ink #232323`, `--color-muted #5E554C`, `--color-maroon #7B1E2B`, `--color-maroon-hover #651722`, `--color-line #D9D1C5`, `--color-whatsapp #25D366`; `--font-display`, `--font-sans` bound to next/font variables; per-locale overrides via `:lang(te)` / `:lang(hi)`.
  - `fontVariables(locale: Locale): string` from `lib/fonts.ts` (class string for `<html>`). Cormorant + Inter `subsets: ["latin"]`, preloaded; Noto Telugu families `subsets: ["telugu"]` and Noto Devanagari `subsets: ["devanagari"]` with `preload: false` so English pages don't download Indic fonts.
  - `<Button href? variant="primary"|"outline"|"whatsapp"|"ghost" size="md"|"lg">` renders `Link`/`a`/`button`; visible `focus-visible` ring maroon 2px offset 2px; min target 44px.
  - `<Container size="default"|"wide"|"bleed">` (max 1200 / 1440 / none, gutter 16px mobile, 32px md).
  - `<Eyebrow>` small tracked uppercase Inter 12px `tracking-[0.28em]` muted.
  - `<CoupleNames a b />` display serif, maroon italic "&".
  - `<Reveal delay? y=24>` client wrapper: `whileInView` fade+rise once, `viewport.margin "-10% 0px"`, global easing.

- [ ] **Step 1:** Test: Button with `variant="whatsapp"` has class containing `bg-whatsapp`; Button with `href` renders `<a>`; CoupleNames renders "&" inside an element with `text-maroon`.
- [ ] **Step 2:** Run `npm test` → FAIL (modules missing).
- [ ] **Step 3:** Implement the files above. `body` background paper, ink text, Inter 17px/1.6. Headings display serif weight 300–500.
- [ ] **Step 4:** `npm test` → PASS. Commit `feat: design tokens, fonts, base UI`.

### Task 3: Internationalisation

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts`, `proxy.ts`, `messages/en.json`, `messages/te.json`, `messages/hi.json`, `app/[locale]/layout.tsx`, `app/[locale]/page.tsx` (temporary stub), `tests/unit/messages.test.ts`
- Delete: scaffolded `app/layout.tsx`/`app/page.tsx` only if replaced by `[locale]` layout (keep a root `app/layout.tsx` that only returns children if next-intl docs require it for not-found).

**Interfaces:**
- Produces: `routing` (`locales: ["en","te","hi"]`, `defaultLocale: "en"`, `localePrefix: "as-needed"`), `type Locale = "en"|"te"|"hi"`, `Link, redirect, usePathname, useRouter, getPathname` from `i18n/navigation.ts`. Message namespaces: `Meta, Nav, Hero, Home, Stories, Services, WalkIn, About, Contact, Form, Footer, Legal, NotFound, Error, Cookie, Common`.
- `[locale]/layout.tsx`: validates locale (`hasLocale` → `notFound()`), `setRequestLocale`, `<html lang={locale} className={fontVariables(locale)}>`, `NextIntlClientProvider`, `generateStaticParams` for 3 locales.

- [ ] **Step 1:** Test `messages.test.ts`: recursively collect key paths of `en.json`; assert `te.json` and `hi.json` have exactly the same key set and no empty string values.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Write full English copy for all namespaces (professional, specific; poster wording "Life Time Memories", "We shoot all types of functions"); write full Telugu and Hindi translations (mine terminology from `_legacy/i18n/build.py`). Implement routing files and layout. `proxy.ts` matcher excludes `api|_next|_vercel|.*\\..*`.
- [ ] **Step 4:** Run tests → PASS; `npm run build`; visit `/`, `/te`, `/hi` in dev → correct `lang`.
- [ ] **Step 5:** Commit `feat: en/te/hi routing and messages`.

### Task 4: Content data and images

**Files:**
- Create: `lib/content/business.ts`, `lib/content/services.ts`, `lib/content/stories.ts`, `lib/content/images.ts`, `lib/format.ts`, `scripts/build-images.mjs`, `public/images/**`, `public/images/PLACEHOLDERS.md`, `tests/unit/content.test.ts`

**Interfaces:**
- Produces:
  - `business` const: `{ name, phoneDisplay: "+91 88858 58111", phoneE164: "+918885858111", whatsapp: "918885858111", email, address: { street: "Opp Bharath Gas, 3/1 Line, Sitaram Nagar-Old", locality: "Guntur", region: "Andhra Pradesh", postalCode: "522001", country: "IN" }, hours: { opens: "09:00", closes: "21:00", days: all 7 }, foundingYear: 2016, payments: ["UPI","Paytm"], social: { instagram?, facebook?, youtube? } (from env, undefined when unset) }`.
  - `type ServiceId = "wedding-photography"|"traditional-videography"|"candid-photography"|"cinematic-videography"|"pre-wedding"|"post-wedding"|"functions"|"album-design"`; `type WalkInId = "passport"|"passport-extra"|"studio-sitting"|"matching-photos"|"digital-transfer"`.
  - `services: Service[]` `{ id, image: ImageKey, priceFrom?: number }` — wedding-photography 25000; functions lists engagement 12000 & birthday 10000 via `subPrices`; others undefined. Copy lives in messages `Services.items.<id>.{title,summary,includes[]}`.
  - `walkIn: WalkInItem[]` `{ id, price }` = passport 120, passport-extra 80, studio-sitting 250, matching-photos 250, digital-transfer 50.
  - `pricing.showPrices: boolean = true`; `formatPrice(amount: number, locale: Locale): string` → `"₹25,000"` (en-IN grouping) for all locales; `priceLabel(amount: number|undefined, locale): string|null` returns null when `!showPrices` or amount undefined.
  - `stories: Story[]` `{ slug: "telugu-wedding"|"church-wedding"|"pre-wedding", placeholder: true, coupleA, coupleB, place, dateLabelKey, cover: ImageKey, images: ImageKey[] }` (names: Priya & Ravi, Grace & Samuel, Anjali & Kiran; places Guntur / Guntur / Kondaveedu).
  - `images: Record<ImageKey, { src: string; width: number; height: number; altKey: string }>`; alt text in messages `Images.<key>`.
- `scripts/build-images.mjs`: reads `_source/img/*.png` and `_source/img/v2/*.png`, writes `public/images/<name>.webp` max 2400px long edge, quality 78, and prints width/height JSON used to fill `lib/content/images.ts`.

- [ ] **Step 1:** Tests: every `services[].id` has `Services.items.<id>.title` in all three message files; every story image key exists in `images`; `formatPrice(25000,"te") === "₹25,000"`; `priceLabel(120,"en")` non-null and `null` when `showPrices` mocked false; every `ImageKey` has an `Images.<key>` alt string in all locales.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Wait for/verify Codex output in `_source/img/v2/` (23 files: hero-1..3, s1-*, s2-*, s3-*, svc-*); if any are missing, regenerate those with `codex exec` using the prompt in the session scratchpad. Run `npm run images`, fill data files, write PLACEHOLDERS.md (file, used where, replace-with) including the sample couple names.
- [ ] **Step 4:** Run tests → PASS. Commit `feat: content data and optimised placeholder images`.

### Task 5: Header, navigation, footer, floating WhatsApp

**Files:**
- Create: `components/layout/Header.tsx` (server), `components/navigation/MobileNav.tsx` (client), `components/navigation/LanguageSwitcher.tsx` (client), `components/navigation/NavLinks.tsx`, `components/layout/Footer.tsx`, `components/layout/FloatingWhatsApp.tsx`, `lib/whatsapp.ts`, `tests/unit/whatsapp.test.ts`, `tests/e2e/navigation.spec.ts`
- Modify: `app/[locale]/layout.tsx` (skip link, Header, `<main id="main">`, Footer, FloatingWhatsApp)

**Interfaces:**
- Produces: `whatsappUrl(text: string): string` → `https://wa.me/918885858111?text=<encodeURIComponent(text)>`.
- Header: logo wordmark (Cormorant), links Stories / Services / About / Contact, LanguageSwitcher (EN / తెలుగు / हिन्दी, keeps current path via `usePathname` + `Link locale=`), primary CTA WhatsApp. Over the hero (`data-hero` on home) it is transparent with a top gradient scrim and white text; after 80px scroll or on other pages it is paper with a bottom hairline (`--color-line`). Active link `aria-current="page"`.
- MobileNav: button `aria-label` from messages, `aria-expanded`, full-screen paper sheet, focus trapped, Escape closes and returns focus to the button, body scroll locked.
- Footer: wordmark + one-line description, nav, services list (links to `/services#<id>`), contact (tel/mailto/WhatsApp/address/hours), social only for defined URLs, legal links, `© {year} Kalamkrutha Digital Studio`.

- [ ] **Step 1:** Unit test `whatsappUrl("Hi there")` → `https://wa.me/918885858111?text=Hi%20there`.
- [ ] **Step 2:** E2E: at 360px open menu by keyboard, `Escape` closes and focus returns to the toggle; on `/services` clicking తెలుగు lands on `/te/services`; skip link moves focus to `#main`; every footer link returns status < 400.
- [ ] **Step 3:** Run → FAIL; implement; run → PASS.
- [ ] **Step 4:** Commit `feat: header, mobile nav, language switcher, footer`.

### Task 6: Home page

**Files:**
- Create: `components/sections/HeroSlideshow.tsx` (client), `components/sections/AlbumSpread.tsx`, `components/sections/ServicesOverview.tsx`, `components/sections/WalkInStrip.tsx`, `components/sections/AboutTeaser.tsx`, `components/sections/EnquiryCta.tsx`, `tests/unit/hero.test.tsx`, `tests/e2e/home.spec.ts`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `stories`, `services`, `walkIn`, `images`, `priceLabel`, `Reveal`, `Button`, `CoupleNames`, `whatsappUrl`.
- `HeroSlideshow({ slides: ImageKey[]; intervalMs?: 6000 })`: full-viewport (`100svh`) stack, `next/image fill sizes="100vw"`, first slide `priority` + `fetchPriority="high"`, others lazy; crossfade 1.6s, Ken Burns scale 1→1.06 over interval; pauses on hover/focus and when tab hidden; dots are buttons with labels; when `useReducedMotion()` is true: no auto-advance, no scale. Overlay: Eyebrow "Guntur · Since 2016", `<h1>` "Life Time Memories" (localised), one-line sub, CTA WhatsApp + outline "See our stories".
- `AlbumSpread({ story, align: "left"|"right" })`: CoupleNames + place/date eyebrow, 3–4 prints in a 12-col grid with differing spans/vertical offsets (mobile: 2-col staggered), each print in `Reveal` with staggered delay, link to `/stories/<slug>`.
- Section order: Hero → 3 AlbumSpreads (alternating) → ServicesOverview (8 services, image + title + "from" price) → WalkInStrip (paper-deep band, compact price list) → AboutTeaser → EnquiryCta.

- [ ] **Step 1:** Unit test: render HeroSlideshow with `useReducedMotion` mocked `true`, advance fake timers 20s → still first slide active (`aria-hidden="false"` on slide 0). With it `false` → slide 1 active after 6s.
- [ ] **Step 2:** E2E: home has exactly one `h1`; hero `img` has no `loading="lazy"`; all `img` have non-empty `alt`; no horizontal overflow (`scrollWidth <= innerWidth`) in en/te/hi.
- [ ] **Step 3:** Run → FAIL; implement; run → PASS. Visually check 360/820/1440 screenshots.
- [ ] **Step 4:** Commit `feat: album-style home page`.

### Task 7: Stories

**Files:**
- Create: `app/[locale]/stories/page.tsx`, `app/[locale]/stories/[slug]/page.tsx`, `components/sections/StoryCard.tsx`, `components/sliders/FilmStrip.tsx` (client), `tests/e2e/stories.spec.ts`

**Interfaces:**
- `FilmStrip({ images: ImageKey[]; label: string })`: Embla main viewport + thumbnail strip synced; prev/next buttons with labels; arrow-key support; `aria-roledescription="carousel"`, slides `aria-label="n of N"`; Embla `loop: false` when reduced motion `duration` minimal.
- Story detail: `<h1>` = couple names, placeholder notice line (`Stories.sampleNotice`) visible small text, album spread of all images, FilmStrip, CTA. `generateStaticParams` = locales × slugs; unknown slug → `notFound()`.

- [ ] **Step 1:** E2E: `/stories` lists 3 cards; `/te/stories/church-wedding` 200 with one `h1`; FilmStrip next button changes active thumbnail; `/te/stories/nope` → 404 with localised NotFound heading.
- [ ] **Step 2:** Run → FAIL; implement; run → PASS. Commit `feat: stories list, detail, film-strip slider`.

### Task 8: Services, About, Contact (page shell)

**Files:**
- Create: `app/[locale]/services/page.tsx`, `app/[locale]/about/page.tsx`, `app/[locale]/contact/page.tsx`, `components/sections/ServiceDetail.tsx`, `components/sections/WalkInTable.tsx`, `components/sections/MapEmbed.tsx`, `components/sections/ContactDetails.tsx`, `tests/e2e/pages.spec.ts`

**Interfaces:**
- Services: each service section `id={service.id}` with image, title (h2), summary, includes list, price label or "Ask on WhatsApp"; poster note "We shoot all types of functions"; owner-confirmed extras (video editing, album design & making, full-function videos, 3–5 min candid highlights) appear in the relevant includes. Walk-in section h2 with `WalkInTable` (also lists urgent passport photos, photostat, colour xerox without prices) and note "Rates as displayed at the studio".
- MapEmbed: lazy iframe `https://www.google.com/maps?q=<encoded full address>&output=embed`, `title` attr, plus "Open in Google Maps" link `https://www.google.com/maps/search/?api=1&query=<encoded>`.
- Contact page renders ContactDetails + MapEmbed + `<ContactForm/>` slot (Task 9).

- [ ] **Step 1:** E2E: `/services#passport` section exists and shows "₹120"; every service id from data has an element on `/services`; `/about` and `/contact` one `h1` each in all locales.
- [ ] **Step 2:** Run → FAIL; implement; run → PASS. Commit `feat: services, about, contact pages`.

### Task 9: Lead system

**Files:**
- Create: `lib/validations/contact.ts`, `lib/server/rate-limit.ts`, `lib/server/turnstile.ts`, `lib/server/notify-email.ts`, `lib/server/notify-whatsapp.ts`, `lib/server/email-templates.ts`, `app/actions/contact.ts`, `components/forms/ContactForm.tsx` (client), `components/forms/Turnstile.tsx` (client), `tests/unit/contact-schema.test.ts`, `tests/unit/rate-limit.test.ts`, `tests/unit/contact-action.test.ts`, `tests/e2e/contact.spec.ts`

**Interfaces:**
- `contactSchema` (zod): `name` trim min 2 max 80; `phone` string → normalised E.164 India (`/^(?:\+?91|0)?[6-9]\d{9}$/` after stripping spaces/dashes) output `+91XXXXXXXXXX`; `email` optional, empty→undefined, else valid email; `service` enum of `ServiceId | WalkInId | "other"`; `eventDate` optional ISO date string; `message` trim min 10 max 2000; `website` (honeypot) must be `""`. Error messages are message keys (`Form.errors.*`) resolved client-side.
- `type ContactResult = { status: "ok" } | { status: "invalid"; fieldErrors: Record<string,string> } | { status: "rate-limited" } | { status: "captcha-failed" } | { status: "no-channel"; whatsappUrl: string } | { status: "error"; whatsappUrl: string }`.
- `submitContact(prev: ContactResult|null, formData: FormData): Promise<ContactResult>` in `app/actions/contact.ts` (`"use server"`). Order: honeypot filled → return `{status:"ok"}` silently without sending; rate limit by IP from `headers()` (`x-forwarded-for` first value) → 5 per 10 min (`rateLimit(key, {limit:5, windowMs:600000}): { allowed: boolean }`, in-memory Map); Turnstile verify when `TURNSTILE_SECRET_KEY` set (`verifyTurnstile(token, ip): Promise<boolean>` POST `https://challenges.cloudflare.com/turnstile/v0/siteverify`); zod parse; send via each configured channel with `Promise.allSettled`; ≥1 fulfilled → `ok`; none configured → `no-channel`; all failed → `error`. `whatsappUrl` prefilled with name/phone/service/message.
- `sendAdminEmail(data)` uses Resend `from: process.env.RESEND_FROM_EMAIL ?? "Kalamkrutha Website <onboarding@resend.dev>"`, `to: ADMIN_EMAIL`, HTML table template; `sendCustomerEmail` only when `RESEND_FROM_EMAIL` and `data.email` set. `sendWhatsAppAlert(data)` POST `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages` text body "New Inquiry\n\nName: …\nPhone: …\nEmail: …\nService: …\nMessage: …".
- ContactForm: RHF + zodResolver(contactSchema) client-side, `useActionState(submitContact)`, submit disabled + spinner while pending, `aria-invalid` + `aria-describedby` per field, focus first invalid field on error, focus the status region (`role="status"`, `tabIndex=-1`) on result; success text exactly "Thank you, your message has been received." (localised); honeypot field visually hidden, `tabIndex=-1`, `autoComplete="off"`.

- [ ] **Step 1:** Schema tests: phone `"88858 58111"`, `"+91 8885858111"`, `"08885858111"`, `"+91-88858-58111"` → `"+918885858111"`; `"12345"` fails; name `"A"` fails; message 9 chars fails; email `""` → passes as undefined, `"bad@"` fails; honeypot `"x"` fails.
- [ ] **Step 2:** Rate-limit test: 5 allowed, 6th blocked, allowed again after window (fake timers).
- [ ] **Step 3:** Action tests (mock `next/headers`, `fetch`, `resend`): no env channels → `no-channel` with wa.me URL; RESEND configured & send resolves → `ok`; send rejects and WhatsApp unset → `error`; honeypot filled → `ok` and no send called; Turnstile secret set + verify false → `captcha-failed`.
- [ ] **Step 4:** Run → FAIL; implement; run → PASS.
- [ ] **Step 5:** E2E: submit empty form → inline errors, focus on name; valid submit (no env) → no-channel message with WhatsApp link, not the thank-you text.
- [ ] **Step 6:** Commit `feat: contact form with server validation, spam protection, notifications`.

### Task 10: SEO, structured data, icons, analytics

**Files:**
- Create: `lib/seo/site.ts`, `lib/seo/metadata.ts`, `lib/seo/jsonld.ts`, `components/seo/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/[locale]/opengraph-image.tsx`, `app/icon.png` (512), `app/apple-icon.png` (180), `app/favicon.ico`, `public/icons/icon-192.png`, `public/icons/icon-512.png`, `components/analytics/Analytics.tsx`, `tests/unit/seo.test.ts`
- Modify: every page to export `generateMetadata` via helper; layout adds JsonLd + Analytics.

**Interfaces:**
- `siteUrl(): string`; `allowIndexing(): boolean`.
- `buildMetadata({ locale, path, titleKey, descriptionKey }): Promise<Metadata>` → `title`, `description`, `alternates.canonical = absolute(localisedPath)`, `alternates.languages = { en, te, hi, "x-default": en }`, `openGraph { type:"website", url, siteName, locale: en_IN|te_IN|hi_IN, images 1200×630 with alt }`, `twitter { card:"summary_large_image" }`, `robots: allowIndexing() ? index : { index:false, follow:false }`. `metadataBase` in layout; `viewport.themeColor "#F5F2ED"`; `verification.google` from env.
- `localBusinessJsonLd(locale)`: `@type: ["LocalBusiness","ProfessionalService"]`, name, url, telephone, email, address, openingHoursSpecification, foundingDate "2016", priceRange "₹₹", paymentAccepted, `sameAs` only defined socials; no geo, no rating. Plus `websiteJsonLd`, `breadcrumbJsonLd(items)`, `serviceJsonLd(service, locale)` (offers only when price shown).
- `sitemap()` = all static routes + story slugs × 3 locales with `alternates.languages`; `robots()` disallows all when `!allowIndexing()`, else allow + sitemap URL.
- OG image: paper background, hero photo left, wordmark + localised tagline right, 1200×630. Render `/te/opengraph-image` once; if Satori garbles Telugu/Devanagari conjuncts, use English text for all locales' OG images.
- Analytics: GA4 script only if `NEXT_PUBLIC_GA_ID` and cookie consent granted; Plausible if `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (cookieless, no consent needed).

- [ ] **Step 1:** Tests: `buildMetadata({locale:"te",path:"/services",...})` canonical ends `/te/services` and languages has 4 keys; English titles 50–60 chars and descriptions 150–160 chars for every page (te/hi: titles 30–70, descriptions 100–170, since script lengths differ) (loop over a page table); `robots()` disallow `/` when flag unset; sitemap contains `/hi/stories/pre-wedding`; JSON-LD has no `aggregateRating` and telephone `+918885858111`.
- [ ] **Step 2:** Run → FAIL; implement (generate icons from the wordmark with `sharp` in `scripts/build-icons.mjs`); run → PASS.
- [ ] **Step 3:** Commit `feat: metadata, sitemap, robots, JSON-LD, icons, analytics hooks`.

### Task 11: Legal, cookies, error pages

**Files:**
- Create: `app/[locale]/privacy-policy/page.tsx`, `app/[locale]/terms/page.tsx`, `app/[locale]/cookie-policy/page.tsx`, `components/sections/LegalDocument.tsx`, `components/layout/CookieBanner.tsx` (client), `app/[locale]/not-found.tsx`, `app/[locale]/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx` (root fallback), `tests/e2e/legal-errors.spec.ts`

**Interfaces:**
- Legal pages: structured sections (data collected via form, purpose, channels Resend/WhatsApp, retention, rights, contact) with a visible "Draft — to be reviewed by the studio" notice; no invented legal claims.
- CookieBanner renders only when `NEXT_PUBLIC_GA_ID` set; stores consent in `localStorage` (try/catch), exposes `consent` via a tiny context consumed by Analytics.
- not-found: branded, h1, links Home/Stories/Services/Contact + WhatsApp. error.tsx: client, reset button + WhatsApp link. global-error: own `<html><body>`, plain styles.

- [ ] **Step 1:** E2E: three legal pages 200 in all locales with one h1; `/does-not-exist` shows branded 404 with Home link; banner absent when GA env unset.
- [ ] **Step 2:** Run → FAIL; implement; run → PASS. Commit `feat: legal pages, cookie consent, error boundaries`.

### Task 12: QA sweep, requirements checklist, deploy preview

**Files:**
- Create: `tests/e2e/quality.spec.ts`, `docs/REQUIREMENTS-CHECKLIST.md`, `README.md`

**Interfaces:**
- `quality.spec.ts` iterates every route × locale at 360/375/390/414/768/820/1024/1280/1440/1920: status 200, no horizontal overflow, exactly one h1, no heading level skip, all `img[alt]` non-empty, axe (`wcag2a, wcag2aa`) zero violations, no console errors.

- [ ] **Step 1:** Write quality spec; run `npm run e2e` → fix every failure until PASS.
- [ ] **Step 2:** `npm run lint && npm run typecheck && npm test && npm run build` → all PASS; check response headers on `npm start` with `curl -I`.
- [ ] **Step 3:** Fill `docs/REQUIREMENTS-CHECKLIST.md`: every item from the docx QA + phase list with status Implemented / Env-dependent (needs credential) / Placeholder, plus flags: prices need owner confirmation, Telugu/Hindi need native review, map pin unverified, photos and couple names are placeholders, rate limit is per-instance.
- [ ] **Step 4:** `README.md`: local commands, env vars, deploy steps, how to enable indexing, how to swap images (`npm run images`).
- [ ] **Step 5:** Deploy preview: `vercel deploy` (not `--prod`) to project `kalamkrutha-studio`; record URL. Commit `chore: QA sweep, checklist, README`.
