// Tables in a built blog post, in headless Chromium (spec #110): a cell is left-aligned, unless
// its Markdown column is aligned (`---:`, `:-:`), which the pipeline writes as `align="…"`; that
// alignment wins (docs/brand.md › Tables: numeric columns are right-aligned).
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

// A published post with a table, so its prose styles are on the page.
const POST = "/blog/introduction-to-jupyter-and-python/";

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

test("a table cell is left-aligned unless its column is aligned in the Markdown", { skip }, async () => {
  const page = await browser.newPage();
  const res = await page.goto(server.origin + POST);
  assert.equal(res.status(), 200, `${POST} exists`);
  const align = await page.evaluate(() => {
    const prose = document.querySelector('[data-section="post-body"] .prose');
    // The HTML the Markdown pipeline makes for `| a | b | c |` over `|---|---:|:-:|`.
    prose.insertAdjacentHTML(
      "beforeend",
      '<table id="t"><thead><tr><th>a</th><th align="right">b</th><th align="center">c</th></tr></thead>' +
        '<tbody><tr><td>1</td><td align="right">2</td><td align="center">3</td></tr></tbody></table>',
    );
    return [...document.querySelectorAll("#t th, #t td")].map((c) => getComputedStyle(c).textAlign);
  });
  await page.close();
  const left = (a) => a === "left" || a === "start";
  assert.ok(left(align[0]) && left(align[3]), `plain cells: ${align[0]}, ${align[3]}`);
  assert.deepEqual([align[1], align[4]], ["right", "right"], "right-aligned column");
  assert.deepEqual([align[2], align[5]], ["center", "center"], "centred column");
});
