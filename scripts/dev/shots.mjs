// Dev helper: full-page screenshots of given paths at given widths (reduced motion so reveals are visible).
// Usage: node scripts/dev/shots.mjs <outDir> <baseUrl> <path,...> <width,...>
import { chromium } from "@playwright/test";
const [outDir, base, paths, widths] = process.argv.slice(2);
const browser = await chromium.launch();
for (const w of widths.split(",").map(Number)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 800 : 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const p of paths.split(",")) {
    await page.goto(base + p, { waitUntil: "load" });
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 400) { await page.mouse.wheel(0, 400); await page.waitForTimeout(120); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    const name = `${outDir}/${(p.replace(/\//g, "_") || "_home")}-${w}.png`;
    await page.screenshot({ path: name, fullPage: true });
    console.log(name);
  }
  await ctx.close();
}
await browser.close();
