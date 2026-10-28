import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// One sweep over every route in every language; runs once (desktop project) and sets widths itself.
test.skip(({ viewport }) => viewport?.width !== 1440, "sweep runs in a single project");
test.describe.configure({ mode: "parallel" });

const paths = [
  "/",
  "/stories",
  "/stories/telugu-wedding",
  "/stories/church-wedding",
  "/stories/pre-wedding",
  "/services",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/cookie-policy",
];
const locales = ["", "/te", "/hi"];
// The QA brief's device matrix, plus phone landscape.
const viewports = [
  [320, 568], [360, 640], [375, 667], [390, 844], [414, 896], [430, 932],
  [667, 375], [844, 390], [932, 430],
  [768, 1024], [820, 1180], [1024, 768], [1280, 800], [1366, 768], [1440, 900], [1920, 1080],
] as const;

async function headingProblems(page: Page) {
  return page.evaluate(() => {
    const levels = [...document.querySelectorAll("main h1, main h2, main h3, main h4, main h5, main h6")].map((h) =>
      Number(h.tagName[1]),
    );
    const skips: string[] = [];
    levels.reduce((prev, cur) => {
      if (cur > prev + 1) skips.push(`h${prev}→h${cur}`);
      return cur;
    }, 1);
    return skips;
  });
}

for (const locale of locales) {
  for (const path of paths) {
    const url = `${locale}${path === "/" && locale ? "" : path}` || "/";

    test(`quality ${url}`, async ({ page }) => {
      test.setTimeout(120_000);
      const consoleErrors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text());
      });
      page.on("pageerror", (e) => consoleErrors.push(e.message));

      const res = await page.goto(url);
      expect(res?.status(), url).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await headingProblems(page), "heading levels").toEqual([]);

      const missingAlt = await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.filter((i) => !i.hasAttribute("alt")).map((i) => (i as HTMLImageElement).src),
        );
      expect(missingAlt, "images without alt").toEqual([]);

      for (const [width, height] of viewports) {
        await page.setViewportSize({ width, height });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `horizontal overflow at ${width}×${height}`).toBeLessThanOrEqual(0);
      }

      for (const width of [360, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .exclude("iframe")
          .analyze();
        const violations = axe.violations.map(
          (v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`,
        );
        expect(violations, `axe at ${width}px`).toEqual([]);
      }

      expect(consoleErrors, "console errors").toEqual([]);
    });
  }
}
