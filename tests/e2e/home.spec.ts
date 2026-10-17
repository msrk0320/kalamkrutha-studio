import { expect, test } from "@playwright/test";

for (const path of ["/", "/te", "/hi"]) {
  test(`home ${path}: one h1, eager hero, alt text, no overflow`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);

    const heroImg = page.locator("[data-hero] img").first();
    await expect(heroImg).not.toHaveAttribute("loading", "lazy");

    const missingAlt = await page.locator("img").evaluateAll((imgs) =>
      imgs.filter((i) => !(i as HTMLImageElement).alt.trim()).map((i) => (i as HTMLImageElement).src),
    );
    expect(missingAlt).toEqual([]);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("home links every featured story and the WhatsApp CTA", async ({ page }, testInfo) => {
  await page.goto("/");
  for (const slug of ["telugu-wedding", "church-wedding", "pre-wedding"]) {
    await expect(page.locator(`a[href="/stories/${slug}"]`).first()).toBeAttached();
  }
  const heroWhatsApp = page.locator('[data-hero] a[href^="https://wa.me/918885858111"]');
  // On phones the floating WhatsApp button is the only one; in-page green buttons are hidden.
  if (testInfo.project.name === "mobile-360") {
    await expect(heroWhatsApp).toBeHidden();
    await expect(page.locator('a[aria-label][href^="https://wa.me/918885858111"].fixed')).toBeVisible();
  } else {
    await expect(heroWhatsApp).toBeVisible();
  }
});
