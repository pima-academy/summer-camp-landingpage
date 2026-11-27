// Checks the camp archive page's cover (src/sections/camp-archive/Cover.astro) in a
// browser: in a rotating cover the one on show is the only one exposed to assistive technology,
// before and after a turn; a square cover is not cropped. Needs a fresh `npm run build`;
// skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

/** A year held at several campuses, so its cover rotates. */
const PATH = "/trai-he-toan-hoc-pima/2025/";

let server, browser;

before(async () => {
  if (skip) return;
  server = await serveDist();
  const { chromium } = await import("playwright");
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  server?.close();
});

/** For each slide: whether it is on show and whether it is hidden from assistive technology. */
const slides = (page) =>
  page.$$eval(".bookcover .slide", (els) =>
    els.map((el) => ({ active: el.hasAttribute("data-active"), hidden: el.getAttribute("aria-hidden") === "true" })),
  );

test("only the cover on show is exposed to assistive technology, after each turn too", { skip }, async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.clock.install();
  await page.goto(server.origin + PATH, { waitUntil: "load" });
  for (let turn = 0; turn < 3; turn++) {
    const now = await slides(page);
    assert.ok(now.length > 1, "the cover rotates");
    assert.equal(now.filter((s) => s.active).length, 1, `turn ${turn}: one cover on show`);
    for (const [i, s] of now.entries()) assert.equal(s.hidden, !s.active, `turn ${turn}, slide ${i}`);
    await page.clock.runFor(7000);
  }
  await context.close();
});

test("a square cover (2021) is shown whole, its frame as square as the photo", { skip }, async () => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(server.origin + "/trai-he-toan-hoc-pima/2021/", { waitUntil: "load" });
    const { natural, shown } = await page.$eval(".bookcover .img", async (img) => {
      await img.decode();
      const r = img.getBoundingClientRect();
      return { natural: img.naturalWidth / img.naturalHeight, shown: r.width / r.height };
    });
    assert.ok(Math.abs(shown - natural) < 0.01, `${viewport.width} px: frame ${shown.toFixed(3)} vs photo ${natural.toFixed(3)}`);
    await context.close();
  }
});
