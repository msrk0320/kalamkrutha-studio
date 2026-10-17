import { expect, test } from "@playwright/test";

for (const locale of ["", "/te", "/hi"]) {
  for (const path of ["/privacy-policy", "/terms", "/cookie-policy"]) {
    test(`${locale}${path} renders with one h1 and the draft notice`, async ({ page }) => {
      const res = await page.goto(`${locale}${path}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("[data-draft-notice]")).toBeVisible();
    });
  }
}

test("unknown paths show the branded 404 with a way home", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("This page is not in the album");
  await expect(page.locator("main").getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  await expect(page.locator("header")).toBeVisible();
});

test("unknown Hindi path shows the Hindi 404", async ({ page }) => {
  const res = await page.goto("/hi/kuch-nahi");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("यह पेज एल्बम में नहीं है");
});

test("no cookie banner when analytics is not configured", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-cookie-banner]")).toHaveCount(0);
});
