import { expect, test } from "@playwright/test";

const serviceIds = [
  "wedding-photography",
  "traditional-videography",
  "candid-photography",
  "cinematic-videography",
  "pre-wedding",
  "post-wedding",
  "functions",
  "album-design",
];

test("services page has a section for every service and the walk-in rates", async ({ page }) => {
  await page.goto("/services");
  await expect(page.locator("h1")).toHaveCount(1);
  for (const id of serviceIds) await expect(page.locator(`section#${id}`)).toHaveCount(1);
  const walkIn = page.locator("section#walk-in");
  await expect(walkIn).toContainText("₹120");
  await expect(walkIn).toContainText("₹250");
  await expect(page.locator("section#wedding-photography")).toContainText("₹25,000");
});

for (const path of ["/services", "/stories"]) {
  test(`${path}: the first photograph (the LCP) loads eagerly with high priority`, async ({ page }) => {
    await page.goto(path);
    const first = page.locator("main img").first();
    await expect(first).toHaveAttribute("loading", "eager");
    await expect(first).toHaveAttribute("fetchpriority", "high");
    await expect(page.locator('main img[loading="lazy"]').first()).toBeAttached();
  });
}

for (const locale of ["", "/te", "/hi"]) {
  for (const path of ["/about", "/contact"]) {
    test(`${locale}${path} has one h1 and the studio address`, async ({ page }) => {
      const res = await page.goto(`${locale}${path}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toContainText("522001");
    });
  }
}

test("contact page offers call, WhatsApp, email and a map", async ({ page }) => {
  await page.goto("/contact");
  const main = page.locator("main");
  await expect(main.locator('a[href="tel:+918885858111"]').first()).toBeVisible();
  await expect(main.locator('a[href^="https://wa.me/918885858111"]').first()).toBeVisible();
  await expect(main.locator('a[href="mailto:kalamkrutha@gmail.com"]').first()).toBeVisible();
  await expect(main.locator("iframe[title]")).toHaveAttribute("src", /google\.com\/maps/);
});
