import { expect, test } from "@playwright/test";

test.describe("mobile menu", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, "mobile only");

  test("opens with the keyboard and closes with Escape, returning focus", async ({ page }) => {
    await page.goto("/services");
    const toggle = page.getByRole("button", { name: "Open navigation menu" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Stories" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
  });
});

test("language switcher keeps the current page", async ({ page, viewport }) => {
  await page.goto("/services");
  if ((viewport?.width ?? 0) < 1024) await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.getByRole("link", { name: "తెలుగు" }).first().click();
  await expect(page).toHaveURL(/\/te\/services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "te");
});

test("/en URLs redirect permanently to the unprefixed URL", async ({ request }) => {
  const res = await request.get("/en/services", { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers()["location"]).toMatch(/\/services$/);
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("every footer link resolves", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page
    .locator("footer a[href^='/']")
    .evaluateAll((as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!))]);
  expect(hrefs.length).toBeGreaterThan(5);
  for (const href of hrefs) {
    const res = await request.get(href.split("#")[0]!);
    expect(res.status(), href).toBeLessThan(400);
  }
});
