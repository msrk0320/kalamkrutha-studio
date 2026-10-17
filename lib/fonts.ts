import {
  Cormorant_Garamond,
  Inter,
  Noto_Sans_Devanagari,
  Noto_Sans_Telugu,
  Noto_Serif_Devanagari,
  Noto_Serif_Telugu,
} from "next/font/google";
import type { Locale } from "@/i18n/locales";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// Indic fonts are not preloaded so English pages never download them.
const teluguSerif = Noto_Serif_Telugu({
  subsets: ["telugu"],
  weight: ["300", "500"],
  variable: "--font-telugu-serif",
  display: "swap",
  preload: false,
});
const teluguSans = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500"],
  variable: "--font-telugu-sans",
  display: "swap",
  preload: false,
});
const devanagariSerif = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["300", "500"],
  variable: "--font-devanagari-serif",
  display: "swap",
  preload: false,
});
const devanagariSans = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500"],
  variable: "--font-devanagari-sans",
  display: "swap",
  preload: false,
});

const byLocale: Record<Locale, string[]> = {
  en: [],
  te: [teluguSerif.variable, teluguSans.variable],
  hi: [devanagariSerif.variable, devanagariSans.variable],
};

export function fontVariables(locale: Locale): string {
  return [display.variable, sans.variable, ...byLocale[locale]].join(" ");
}
