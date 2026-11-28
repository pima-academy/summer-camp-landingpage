// Drives the built khoa-hoc and trai-he-toan-hoc-pima pages in headless Chromium to check
// PageHeader's opening: the breadcrumb kicker above an h1 in display type, never below the h1
// size. Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

let server, browser;

before(async () => {
  if (skip) return;
  server = await serveDist();
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.close();
});

/** Resolves a size token on the page to px. */
const tokenPx = (page, token) =>
  page.evaluate((t) => {
    const probe = document.createElement("div");
    probe.style.width = `var(${t})`;
    document.body.append(probe);
    const px = probe.getBoundingClientRect().width;
    probe.remove();
    return px;
  }, token);

for (const path of ["/khoa-hoc/", "/trai-he-toan-hoc-pima/"]) {
  for (const width of [390, 1440]) {
    test(`${path} at ${width} px opens with the breadcrumb kicker over a display h1`, { skip }, async () => {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(`${server.origin}${path}`);
      const header = page.locator('[data-section="page-header"]');
      const h1 = header.locator("h1");
      const kicker = header.getByText(/academy > chương trình/i);
      const [h1Box, kickerBox] = [await h1.boundingBox(), await kicker.boundingBox()];
      assert.ok(kickerBox.y + kickerBox.height <= h1Box.y, "kicker above the h1");

      const size = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      const weight = await h1.evaluate((el) => getComputedStyle(el).fontWeight);
      const h1Size = await tokenPx(page, "--font-size-h1");
      const display = await tokenPx(page, "--font-size-display-2");
      assert.ok(size >= h1Size - 0.5, `h1 ${size} px is not below the h1 size ${h1Size} px`);
      assert.ok(Math.abs(size - Math.max(h1Size, display)) <= 0.5, `h1 ${size} px is display-2 (${display} px) or the h1 size`);
      assert.equal(weight, "900", "display weight");

      const tone = await header.getAttribute("data-tone");
      assert.equal(tone, "surface", "keeps the surface tone");
      await page.close();
    });
  }
}
