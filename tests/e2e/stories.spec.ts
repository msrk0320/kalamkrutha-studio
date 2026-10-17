import { expect, test } from "@playwright/test";

test("stories index lists the three stories", async ({ page }) => {
  await page.goto("/stories");
  await expect(page.locator("h1")).toHaveCount(1);
  for (const slug of ["telugu-wedding", "church-wedding", "pre-wedding"]) {
    await expect(page.locator(`main a[href="/stories/${slug}"]`).first()).toBeVisible();
  }
});

test("Telugu story page renders with one h1 and a sample notice", async ({ page }) => {
  const res = await page.goto("/te/stories/church-wedding");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("Grace");
  await expect(page.getByText("నమూనా కథ", { exact: false })).toBeVisible();
});

test("film strip moves to the next photograph", async ({ page }) => {
  await page.goto("/stories/telugu-wedding");
  const strip = page.locator('[aria-roledescription="carousel"]');
  await strip.scrollIntoViewIfNeeded();
  const status = strip.locator("[data-slide-status]");
  await expect(status).toHaveText(/^1 of \d+$/);
  await strip.getByRole("button", { name: "Next photograph" }).click();
  await expect(status).toHaveText(/^2 of \d+$/);
  await expect(strip.locator('button[aria-current="true"]')).toHaveCount(1);
});

test("unknown story returns the localised 404", async ({ page }) => {
  const res = await page.goto("/te/stories/nope");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("ఈ పేజీ ఆల్బమ్‌లో లేదు");
});
