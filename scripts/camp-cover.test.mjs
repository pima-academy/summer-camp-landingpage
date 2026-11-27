// Checks the camp archive page's rotating cover (src/sections/camp-archive/Cover.astro) in a
// browser: the cover on show is the only one exposed to assistive technology, before and after
// a turn. Needs a fresh `npm run build`; skipped when dist/ is missing.
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
