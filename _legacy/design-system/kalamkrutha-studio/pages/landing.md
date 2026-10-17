# Landing page overrides (wins over MASTER.md)

MASTER's pure black/white palette and Archivo/Space Grotesk fonts read as a generic design portfolio. A Telugu wedding studio needs warmth, so this page uses a warm dark base with a marigold-gold accent and editorial serif headings.

## Colors
| Role | Hex | Var | Contrast notes |
|---|---|---|---|
| Background | `#0E0B09` | `--bg` | warm near-black |
| Surface | `#17120E` | `--surface` | cards, bands |
| Border | `#2E2620` | `--border` | |
| Text | `#F5EFE6` | `--text` | ~17:1 on bg |
| Muted text | `#B3A796` | `--muted` | ~8.5:1 on bg |
| Accent (gold) | `#D9A441` | `--gold` | ~8.9:1 on bg, OK as text |
| On accent | `#1A1209` | `--on-gold` | ~9:1 on gold |
| Accent deep | `#8E2B1F` | `--kumkum` | decorative only, never text on bg |
| WhatsApp | `#25D366` + text `#06210F` | | |

## Type
- Headings: Playfair Display 500/600 (italic for emphasis words)
- Body/UI: Inter 400/500/600, 16px base, line-height 1.6
- Telugu: Noto Sans Telugu 500 (brand name accent only)

## Rules
- Static HTML/CSS/JS, no build step.
- Motion: CSS transitions + IntersectionObserver fade/rise reveals, 400–600ms ease-out. No parallax or scroll-scrub. Everything static under `prefers-reduced-motion`.
- Every image has width/height; below-fold images lazy-load.
- WhatsApp is the primary CTA. Call is secondary. Mobile has a sticky bottom bar with both.
- Passport/xerox stays a small secondary strip, below the wedding services.
- No invented reviews, ratings or stats.
