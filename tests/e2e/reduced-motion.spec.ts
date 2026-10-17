import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("revealed photographs become visible with reduced motion", async ({ page }) => {
  await page.goto("/services");
  const target = page.locator("section#candid-photography img").first();
  await target.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      target.evaluate((el) => {
        let o = 1;
        for (let n: HTMLElement | null = el as HTMLElement; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
        return o;
      }),
    )
    .toBe(1);
});
