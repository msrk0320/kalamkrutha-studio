# Requirements checklist

Checked against `D:\Sunil\Website Requirements.docx` on 2026-10-17. The statuses mean:

- **Done:** implemented and verified by an automated test or a build check.
- **Needs credential:** the code is in place, but it only works once the real key or ID is set in Vercel.
- **Placeholder:** the structure works, but the content must be replaced before launch.
- **Deviation:** a deliberate difference from the document.

## Stack

| Requirement | Status | Notes |
|---|---|---|
| Next.js (latest), App Router, TypeScript, React | Done | Next 16.4.2, React 19.3, TypeScript strict with `noUncheckedIndexedAccess` |
| Tailwind CSS | Done | Tailwind 4, with design tokens in `app/globals.css` |
| React Server Components, minimal `"use client"` | Done | Client components are limited to the hero slideshow, scroll reveal, film strip, nav/menu/language switcher, header shell, contact form, Turnstile, cookie banner, analytics and the error boundary |
| Server Actions | Done | `app/actions/contact.ts` |
| React Hook Form + Zod | Done | One shared schema in `lib/validations/contact.ts`, used on both client and server |
| next/image, next/font | Done | All photos use `next/image` with AVIF/WebP; all fonts use `next/font`, and Indic fonts are not preloaded on English pages |
| Framer Motion and a slider library | Done | These were asked for by the owner. framer-motion handles reveals and the hero crossfade; Embla Carousel powers the story film strip |

## Pages

| Page | Status |
|---|---|
| Home, Stories (plus 3 story pages), Services, About, Contact | Done, in English, Telugu and Hindi |
| Privacy Policy, Terms & Conditions, Cookie Policy | Placeholder: the wording is a structured draft with a visible "Draft" notice and "[To be confirmed by the studio]" markers |
| Custom 404 | Done: branded, localised, with links to Home, Stories, Services and Contact |
| error.tsx and global-error.tsx | Done |

## SEO

| Item | Status | Notes |
|---|---|---|
| Metadata API: unique title and description per page and language | Done | English titles are 50–60 characters and descriptions 150–160, enforced by `tests/unit/seo.test.ts` |
| metadataBase, canonical, hreflang alternates plus x-default | Done | |
| robots | Done | Indexing is blocked until `NEXT_PUBLIC_ALLOW_INDEXING=true`; this is intentional before launch |
| Dynamic sitemap | Done | `app/sitemap.ts` lists 33 URLs with language alternates |
| Open Graph and Twitter (`summary_large_image`), 1200×630 image | Done | The image text is in English for all languages, because the image renderer can't reliably draw Telugu or Hindi |
| JSON-LD | Done | LocalBusiness/ProfessionalService, WebSite, Service and BreadcrumbList; there are no ratings, reviews or coordinates |
| One h1 per page, no skipped heading levels, alt text on every image | Done | Covered by `tests/e2e/quality.spec.ts` on all 33 pages |

## Performance

| Item | Status | Notes |
|---|---|---|
| Hero image not lazy-loaded, preloaded with high fetch priority | Done | Covered by a test |
| Below-the-fold images lazy-loaded with intrinsic dimensions (no layout shift) | Done | |
| All pages statically pre-rendered | Done | 41 static pages at build time |
| Core Web Vitals | Not measured | Run Lighthouse or PageSpeed on the deployed preview |

## Accessibility (WCAG 2.1 AA)

| Item | Status | Notes |
|---|---|---|
| axe WCAG 2.0/2.1 A and AA on every page, at 360px and 1440px | Done | Zero violations |
| Keyboard navigation, skip link, visible focus | Done | Covered by `tests/e2e/navigation.spec.ts` |
| Mobile menu: Escape closes it and focus returns to the toggle | Done | |
| Form labels, `aria-invalid`, `aria-describedby`, focus on the first error and on the result | Done | Covered by `tests/e2e/contact.spec.ts` |
| Respects `prefers-reduced-motion` | Done | No auto-advance or Ken Burns in the hero, and reveals are instant; covered by tests |
| Pause control on the auto-advancing hero | Done | |

## Responsive design

No horizontal overflow at 360, 375, 390, 414, 768, 820, 1024, 1280, 1440 or 1920px, on every page in every language. **Done**, covered by the quality sweep.

## Lead system

| Item | Status | Notes |
|---|---|---|
| Fields: name, phone, email, service, event date, message, honeypot | Done | |
| Email is optional | Deviation | The studio's customers book by phone or WhatsApp. Email is validated whenever it is filled in |
| Server-side validation | Done | |
| Honeypot | Done | A bot that fills it gets a fake success and nothing is sent |
| Rate limiting | Done, with a limit | 5 per 10 minutes per IP, kept in memory. On Vercel each instance has its own memory, so this only limits bursts; Turnstile is the real protection |
| Cloudflare Turnstile | Needs credential | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| Resend admin notification | Needs credential | `RESEND_API_KEY`, `ADMIN_EMAIL` |
| Customer confirmation email | Needs credential and domain | `RESEND_FROM_EMAIL` must be on a domain verified in Resend |
| WhatsApp Cloud API admin alert | Needs credential | `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `ADMIN_WHATSAPP_NUMBER` |
| Fallback when nothing is configured | Done | The form never claims success; it shows a pre-filled WhatsApp link instead. Covered by tests |
| Loading, success and failure states; no double submission | Done | |

## Security

| Item | Status | Notes |
|---|---|---|
| CSP, HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy | Done | Checked on `next start`. The CSP allows inline scripts because the pages are static (there is no per-request nonce) |
| Secrets only in server modules | Done | The notification modules import `server-only` |

## Analytics, PWA, icons

| Item | Status | Notes |
|---|---|---|
| GA4 | Needs credential | `NEXT_PUBLIC_GA_ID`. It loads only after cookie consent, and the banner appears only when GA is configured |
| Plausible | Needs credential | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (cookieless) |
| Google Search Console verification | Needs credential | `GOOGLE_SITE_VERIFICATION` |
| favicon.ico, 192px and 512px icons, apple-touch-icon 180px, manifest.webmanifest | Done | Generated by `npm run icons` |

## Content flags for the studio

1. **Photos:** every photograph is AI-generated placeholder content; see `public/images/PLACEHOLDERS.md`.
2. **Stories:** the three stories (Priya & Ravi, Grace & Samuel, Anjali & Kiran) are sample couples, and the site says so on the page.
3. **Prices:** these come from Justdial and the 2022 window poster, and the studio needs to confirm them. They can be hidden by setting `pricing.showPrices` to `false` in `lib/content/services.ts`.
4. **Translations:** the Telugu and Hindi copy needs a native speaker's review.
5. **Map:** it searches by address and has no confirmed pin, so no coordinates appear in the structured data.
6. **Social links:** there are no icons until the real profile URLs are set as environment variables.
7. **Legal pages:** these are drafts that need the studio's details and, ideally, a legal review.
