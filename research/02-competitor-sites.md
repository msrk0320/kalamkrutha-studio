# Competitor & reference site dissection

Researched 2026-10-17 with REA + Playwright (computed styles, loaded fonts, script globals). Screenshots: session scratchpad `competitors/<site>/`.

## Indian premium studios

| Site | Background | Text | Accent | Fonts | Hero | Notes |
|---|---|---|---|---|---|---|
| Stories by Joseph Radhik (Squarespace) | photo only | #FFF | none | Bodoni (ltc-bodoni-175), Source Sans Pro caps tracked 3px | Full-viewport 3-slide crossfade, 1s `cubic-bezier(.33,0,.2,1)` | Splash "cover" page, one CTA |
| House on the Clouds (Squarespace) | #F0E9E0 cream | #000 / #585A49 olive nav | gold #A18E5E | Adobe Garamond 300, Playfair Display 42px | Full-bleed B&W photo, film grain | Stories listed as couple names + dates; nav illegible over hero |
| Twogether Studios (WP/Elementor) | #FFF | #000 | none, outline buttons | "derivia" caps tracked 4–10px, Spectral, Cormorant italic | Full photo with dark overlay | Marquee "17 YEARS. 700+ WEDDINGS"; boxed layout, press wall feel dated |

## South India (Hyderabad / AP)

| Site | Background | Text | Accent | Fonts | Notes |
|---|---|---|---|---|---|
| Vaibhavam (custom) | dark splash #1A1A1A then cream #F8F5F1 / #FFF bands | #2D1F1A | maroon #7B1E2B, CTA band #3A0C15 | Cormorant Garamond 72/56px, Poppins caps tracked | Services as hover-open "cinematic albums"; WhatsApp prefilled; 8 looping reels; CSS marquees; no libraries. Splash gate hurts speed/SEO |
| RJ Wedding Films (Wix) | #FFF | #303131 | none | Cinzel, Open Sans | Plain carousel, tel only, no WhatsApp |
| Digiart (WP/Elementor, Swiper) | #FFF | #4B4F58 | orange #FF6600 | Noto Serif, Open Sans 12px | Template look, packages page, stats |

No Guntur competitor (Rafee Rey, Dream9, Zakir, Picture Skull) has its own website. No competitor uses Telugu text beyond a logo. Pricing hidden everywhere.

## International album-style (Awwwards)

| Site | Background | Text | Accent | Fonts | Album device | Motion |
|---|---|---|---|---|---|---|
| Avagyan (Next.js) | #FFF | #000 | none | Neue-style grotesk | No hero: first screen is edge-to-edge 3-col portrait grid; mobile 2-col staggered | Lenis, transform 0.8s, tiles reveal on scroll; tile opens story page |
| Tatiana Braoun (Tilda) | #FFF | #000 | burgundy #750B0A, green CTA ~#44594A | Cormorant 80px caps + italic line, Satoshi UI | Huge serif headline + small framed print, then contact-sheet photo bands; "Check your date" modal | GSAP ScrollTrigger, opacity 0.5s |
| Adovasio (Next.js, SOTD Mar 2026) | #F5F2ED warm paper | #232323 | none | BerlingskeSerif 300 display, Inter UI | Full-bleed hero, pinned project card, "Emily & David" names spread with floating B&W prints at mixed sizes, "Featured Weddings" picker | Lenis; reveals 1s `cubic-bezier(0.19,1,0.22,1)`; hovers 0.3s `(.25,.46,.45,.94)` |

## Common patterns

- Photos carry the colour. Backgrounds are paper/cream/white or near-black; at most one muted accent (maroon, gold, burgundy).
- Serif display (Cormorant, Bodoni, Garamond, Berlingske) light weight + small tracked uppercase sans for UI.
- Open on full-bleed imagery immediately; short copy; quiet CTA.
- Work presented as named stories (couple names, place, date), not anonymous galleries.
- Motion is restrained: crossfades, scroll reveals with expo-out easing, marquees, smooth scroll.

## Weak spots to avoid

Splash/enter gates, grey or blurred first screens, nav that disappears over light photos, small body type, boxed layouts, logo walls, very long pages heavy with video on 4G.

## Opportunities for Kalamkrutha

- Instant album-like first screen with real work, no gate.
- Telugu + English headings (no competitor does this).
- Visible starting prices (published on Justdial already).
- WhatsApp with prefilled message.
- Separate, quieter strip for walk-in services (passport, studio sitting) so it doesn't cheapen the wedding side.
