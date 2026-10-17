import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { allowIndexing, siteUrl } from "./site";

export const ogImage = {
  path: "/og/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "Kalamkrutha Digital Studio – wedding photography and films in Guntur",
};

const ogLocale: Record<Locale, string> = { en: "en_IN", te: "te_IN", hi: "hi_IN" };

/** Absolute URL of `path` in `locale` (English is unprefixed). */
export function localizedUrl(locale: Locale, path: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const rest = path === "/" ? "" : path;
  return `${siteUrl()}${prefix}${rest}`;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = localizedUrl(locale, path);
  const languages = Object.fromEntries([
    ...routing.locales.map((l) => [l, localizedUrl(l, path)]),
    ["x-default", localizedUrl(routing.defaultLocale, path)],
  ]);
  const index = allowIndexing();
  const image = `${siteUrl()}${ogImage.path}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      siteName: "Kalamkrutha Digital Studio",
      locale: ogLocale[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      title,
      description,
      images: [{ url: image, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}
