// Text contrast (spec #56, "Readability beats the guidelines"): axe-core's `color-contrast` rule
// (WCAG AA: 4.5:1, 3:1 for large text) over every brand-aligned published page, at 390 and
// 1440 px, plus the open "Chương trình" nav dropdown, which is hidden on page load. No known
// failures are allowed.
//
// Text axe cannot decide (over an image, a gradient or a pseudo-element: its "incomplete"
// results) is listed as a test diagnostic and checked by eye.
//
// Adding a page: add its path to PAGES. The two camp pages are frozen (not brand-aligned)
// and stay out. Needs a fresh `npm run build`; skipped when dist/ is missing (fails in CI).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

/** Every published page except the two frozen camp pages. */
const PAGES = ["/", "/ve-chung-toi/", "/khoa-hoc/", "/trai-he-toan-hoc-pima/", "/lien-he/", "/chi-tiet-trai-he/", "/404.html"];
const WIDTHS = [390, 1440];

const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

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

/**
 * Opens `path` at `width` with motion reduced (so no section is caught half-faded in), offline
 * apart from the local server, scrolled through once so lazy images load.
 */
async function open(path, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.route("**/*", (route) =>
    route.request().url().startsWith(server.origin) ? route.continue() : route.abort(),
  );
  await page.goto(server.origin + path, { waitUntil: "load" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
    }
    window.scrollTo(0, 0);
  });
  await page.addScriptTag({ content: axeSource });
  return page;
}

/** axe's color-contrast results for the page (or `include`, a selector) as it stands. */
const contrast = (page, include) =>
  page.evaluate(async (include) => {
    const { violations, incomplete } = await window.axe.run(include ? { include: [include] } : document, {
      runOnly: { type: "rule", values: ["color-contrast"] },
    });
    const list = (results) =>
      results.flatMap((r) =>
        r.nodes.map((n) => {
          const d = n.any[0]?.data ?? {};
          const pair = d.fgColor ? `${d.fgColor} on ${d.bgColor} = ${d.contrastRatio}:1 (needs ${d.expectedContrastRatio})` : d.messageKey ?? "";
          return `${n.target.join(" ")}: ${pair}`;
        }),
      );
    return { violations: list(violations), incomplete: list(incomplete) };
  }, include);

for (const path of PAGES) {
  for (const width of WIDTHS) {
    test(`every text pair on ${path} at ${width} px passes WCAG AA`, { skip }, async (t) => {
      const page = await open(path, width);
      const { violations, incomplete } = await contrast(page);
      for (const line of incomplete) t.diagnostic(`check by eye: ${line}`);
      assert.deepEqual(violations, [], `failing pairs on ${path} at ${width} px`);
      await page.context().close();
    });
  }
}

test("every text pair of the open nav dropdown passes WCAG AA", { skip }, async () => {
  for (const width of WIDTHS) {
    const page = await open("/", width);
    if (width < 992) await page.click('[aria-controls="nav-menu"]');
    await page.click('[aria-controls^="nav-dropdown-list-"]');
    await page.waitForTimeout(500);
    const { violations } = await contrast(page, "header");
    assert.deepEqual(violations, [], `failing pairs in the nav at ${width} px`);
    await page.context().close();
  }
});
