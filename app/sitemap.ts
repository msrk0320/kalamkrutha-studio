import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { stories } from "@/lib/content/stories";
import { localizedUrl } from "@/lib/seo/metadata";

const staticPaths = ["/", "/stories", "/services", "/about", "/contact", "/privacy-policy", "/terms", "/cookie-policy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...staticPaths, ...stories.map((s) => `/stories/${s.slug}`)];
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : path.startsWith("/stories") || path === "/services" ? 0.8 : 0.5,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)])),
      },
    })),
  );
}
