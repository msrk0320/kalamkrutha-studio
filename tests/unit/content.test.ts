import { afterEach, describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import te from "@/messages/te.json";
import { business } from "@/lib/content/business";
import { images, type ImageKey } from "@/lib/content/images";
import { pricing, services, walkIn } from "@/lib/content/services";
import { stories } from "@/lib/content/stories";
import { formatPrice, priceLabel } from "@/lib/format";

const all = { en, te, hi };

describe("services", () => {
  it.each(Object.entries(all))("every service has copy in %s", (_l, m) => {
    for (const s of services) expect(m.Services.items[s.id].title).toBeTruthy();
  });
  it.each(Object.entries(all))("every walk-in item has copy in %s", (_l, m) => {
    for (const w of walkIn) expect(m.WalkIn.items[w.id].title).toBeTruthy();
  });
  it("uses the published prices", () => {
    expect(services.find((s) => s.id === "wedding-photography")?.priceFrom).toBe(25000);
    expect(Object.fromEntries(walkIn.map((w) => [w.id, w.price]))).toEqual({
      passport: 120,
      "passport-extra": 80,
      "studio-sitting": 250,
      "matching-photos": 250,
      "digital-transfer": 50,
    });
  });
});

describe("stories", () => {
  it("only reference known images", () => {
    for (const s of stories) for (const k of [s.cover, ...s.images]) expect(images[k]).toBeDefined();
  });
  it("are all flagged as placeholders", () => {
    expect(stories.every((s) => s.placeholder)).toBe(true);
  });
});

describe("images", () => {
  it.each(Object.entries(all))("every image has alt text in %s", (_l, m) => {
    for (const key of Object.keys(images) as ImageKey[]) expect(m.Images[key]).toBeTruthy();
  });
  it("have real dimensions", () => {
    for (const img of Object.values(images)) {
      expect(img.width).toBeGreaterThan(500);
      expect(img.height).toBeGreaterThan(500);
      expect(img.src).toMatch(/^\/images\/.+\.webp$/);
    }
  });
});

describe("business", () => {
  it("holds the studio's real contact details", () => {
    expect(business.phoneE164).toBe("+918885858111");
    expect(business.whatsapp).toBe("918885858111");
    expect(business.address.postalCode).toBe("522001");
  });
});

describe("prices", () => {
  afterEach(() => {
    pricing.showPrices = true;
  });
  it("formats rupees with Indian grouping in every locale", () => {
    expect(formatPrice(25000, "en")).toBe("₹25,000");
    expect(formatPrice(25000, "te")).toBe("₹25,000");
    expect(formatPrice(120, "hi")).toBe("₹120");
  });
  it("returns no label when prices are hidden or unknown", () => {
    expect(priceLabel(120, "en")).toBe("₹120");
    expect(priceLabel(undefined, "en")).toBeNull();
    pricing.showPrices = false;
    expect(priceLabel(120, "en")).toBeNull();
  });
});

