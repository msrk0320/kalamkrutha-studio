import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import te from "@/messages/te.json";
import { breadcrumbJsonLd, localBusinessJsonLd, serviceJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata, localizedUrl } from "@/lib/seo/metadata";
import { allowIndexing, siteUrl } from "@/lib/seo/site";
import { services } from "@/lib/content/services";
import { stories } from "@/lib/content/stories";

afterEach(() => vi.unstubAllEnvs());

describe("site config", () => {
  it("defaults to the Vercel URL and no indexing", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    expect(siteUrl()).toBe("https://kalamkrutha-studio.vercel.app");
    expect(allowIndexing()).toBe(false);
  });
  it("strips a trailing slash from the configured URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://kalamkrutha.in/");
    expect(siteUrl()).toBe("https://kalamkrutha.in");
  });
});

describe("buildMetadata", () => {
  it("sets canonical and hreflang alternates for a Telugu page", () => {
    const m = buildMetadata({ locale: "te", path: "/services", title: "T", description: "D" });
    expect(String(m.alternates?.canonical)).toBe("https://kalamkrutha-studio.vercel.app/te/services");
    expect(m.alternates?.languages).toEqual({
      en: "https://kalamkrutha-studio.vercel.app/services",
      te: "https://kalamkrutha-studio.vercel.app/te/services",
      hi: "https://kalamkrutha-studio.vercel.app/hi/services",
      "x-default": "https://kalamkrutha-studio.vercel.app/services",
    });
    expect(m.openGraph).toMatchObject({ locale: "te_IN", siteName: "Kalamkrutha Digital Studio", type: "website" });
    expect(m.twitter).toMatchObject({ card: "summary_large_image" });
    expect(m.openGraph?.images).toEqual([
      {
        url: "https://kalamkrutha-studio.vercel.app/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Kalamkrutha Digital Studio – wedding photography and films in Guntur",
      },
    ]);
    expect(m.twitter?.images).toEqual(["https://kalamkrutha-studio.vercel.app/og/og-default.jpg"]);
  });
  it("uses the bare domain for the English home page", () => {
    expect(localizedUrl("en", "/")).toBe("https://kalamkrutha-studio.vercel.app");
    expect(localizedUrl("hi", "/")).toBe("https://kalamkrutha-studio.vercel.app/hi");
  });
  it("blocks indexing until enabled", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    expect(buildMetadata({ locale: "en", path: "/", title: "T", description: "D" }).robots).toMatchObject({
      index: false,
      follow: false,
    });
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    expect(buildMetadata({ locale: "en", path: "/", title: "T", description: "D" }).robots).toMatchObject({
      index: true,
      follow: true,
    });
  });
});

describe("meta copy lengths", () => {
  const pages = ["home", "stories", "services", "about", "contact", "privacy", "terms", "cookies"] as const;
  const fill = (s: string, story: (typeof stories)[number], kind: string) =>
    s.replace("{a}", story.coupleA).replace("{b}", story.coupleB).replace("{place}", story.place).replace("{kind}", kind);

  it.each(pages)("English %s title is 50–60 and description 150–160 characters", (page) => {
    expect(en.Meta[page].title.length, en.Meta[page].title).toBeGreaterThanOrEqual(50);
    expect(en.Meta[page].title.length, en.Meta[page].title).toBeLessThanOrEqual(60);
    expect(en.Meta[page].description.length, en.Meta[page].description).toBeGreaterThanOrEqual(150);
    expect(en.Meta[page].description.length, en.Meta[page].description).toBeLessThanOrEqual(160);
  });

  it.each(stories)("English story $slug title and description fit", (story) => {
    const title = fill(en.Meta.story.title, story, en.Stories.kinds[story.kind]);
    const description = fill(en.Meta.story.description, story, en.Stories.kinds[story.kind].toLowerCase());
    expect(title.length, title).toBeLessThanOrEqual(60);
    expect(title.length, title).toBeGreaterThanOrEqual(40);
    expect(description.length, description).toBeGreaterThanOrEqual(140);
    expect(description.length, description).toBeLessThanOrEqual(165);
  });

  it.each([
    ["te", te],
    ["hi", hi],
  ] as const)("%s titles are 30–70 and descriptions 100–170 characters", (_l, m) => {
    for (const page of pages) {
      expect(m.Meta[page].title.length, m.Meta[page].title).toBeGreaterThanOrEqual(30);
      expect(m.Meta[page].title.length, m.Meta[page].title).toBeLessThanOrEqual(70);
      expect(m.Meta[page].description.length, m.Meta[page].description).toBeGreaterThanOrEqual(100);
      expect(m.Meta[page].description.length, m.Meta[page].description).toBeLessThanOrEqual(170);
    }
  });
});

describe("robots and sitemap", () => {
  it("disallows everything until indexing is enabled", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    expect(robots()).toMatchObject({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://kalamkrutha-studio.vercel.app/sitemap.xml",
    });
  });
  it("lists every page in every language", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://kalamkrutha-studio.vercel.app/hi/stories/pre-wedding");
    expect(urls).toContain("https://kalamkrutha-studio.vercel.app/te/cookie-policy");
    expect(urls).toContain("https://kalamkrutha-studio.vercel.app");
    expect(urls.length).toBe((8 + stories.length) * 3);
  });
});

describe("structured data", () => {
  it("describes the real business without ratings or coordinates", () => {
    const ld = localBusinessJsonLd("en");
    expect(ld).toMatchObject({
      "@type": ["LocalBusiness", "ProfessionalService"],
      name: "Kalamkrutha Digital Studio",
      telephone: "+918885858111",
      email: "kalamkrutha@gmail.com",
      foundingDate: "2016",
      address: { postalCode: "522001", addressLocality: "Guntur", addressCountry: "IN" },
    });
    const json = JSON.stringify(ld);
    expect(json).not.toMatch(/aggregateRating|review|"geo"/);
  });
  it("adds an offer only to services with a shown price", () => {
    const wedding = serviceJsonLd(services.find((s) => s.id === "wedding-photography")!, "Wedding Photography", "en");
    expect(wedding.offers).toMatchObject({ price: 25000, priceCurrency: "INR" });
    const candid = serviceJsonLd(services.find((s) => s.id === "candid-photography")!, "Candid Photography", "en");
    expect(candid.offers).toBeUndefined();
  });
  it("builds breadcrumbs with absolute URLs", () => {
    const b = breadcrumbJsonLd("te", [
      { name: "హోమ్", path: "/" },
      { name: "సేవలు", path: "/services" },
    ]);
    expect(b.itemListElement[1]).toMatchObject({ position: 2, item: "https://kalamkrutha-studio.vercel.app/te/services" });
  });
});
