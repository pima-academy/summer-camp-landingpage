// Formulas on the built blog post pages, in headless Chromium (spec #110, #112): KaTeX's
// stylesheet and maths font apply, inline formulas sit in their line of text, display formulas
// are blocks of their own inside the text column, and no page scrolls sideways at 390 px (a wide
// formula scrolls inside its own box). Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

// The posts with formulas; perfect-strategy's display formula is wider than a phone.
const POSTS = ["calculus-war", "pagerank", "max-speed-animals", "softmax", "which-has-more-elements", "perfect-strategy"];

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

/** What the page shows of its formulas, once its fonts have loaded. */
async function measure(slug, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const res = await page.goto(`${server.origin}/blog/${slug}/`);
  assert.equal(res.status(), 200, `/blog/${slug}/ exists`);
  const m = await page.evaluate(async () => {
    await document.fonts.ready;
    const prose = document.querySelector('[data-section="post-body"] .prose');
    const column = prose.getBoundingClientRect();
    const katex = [...prose.querySelectorAll(".katex")];
    const inline = katex.filter((k) => !k.closest(".katex-display"));
    return {
      scrollWidth: document.documentElement.scrollWidth,
      count: katex.length,
      font: katex[0] && getComputedStyle(katex[0]).fontFamily,
      mathFont: document.fonts.check("16px KaTeX_Main"),
      inline: inline.map((k) => ({
        display: getComputedStyle(k).display,
        parent: k.parentElement.tagName,
        withText: k.parentElement.textContent.trim().length > k.textContent.trim().length,
      })),
      display: [...prose.querySelectorAll(".katex-display")].map((d) => {
        const box = d.getBoundingClientRect();
        return {
          parent: d.parentElement === prose,
          display: getComputedStyle(d).display,
          inColumn: box.left >= column.left - 0.5 && box.right <= column.right + 0.5,
          scrolls: getComputedStyle(d).overflowX === "auto",
        };
      }),
    };
  });
  await page.close();
  return m;
}

for (const slug of POSTS) {
  test(`${slug}: formulas typeset in KaTeX's font, inline in the line, display on their own, no sideways scroll`, { skip }, async () => {
    for (const width of [390, 1440]) {
      const m = await measure(slug, width);
      const at = `${slug} at ${width} px`;
      assert.ok(m.count > 0, `${at}: formulas`);
      assert.match(m.font, /^KaTeX_Main\b/, `${at}: KaTeX's stylesheet applies`);
      assert.ok(m.mathFont, `${at}: KaTeX_Main loaded`);
      for (const f of m.inline) {
        assert.equal(f.display, "inline", `${at}: inline formula`);
        assert.ok(["P", "LI"].includes(f.parent) && f.withText, `${at}: inline formula in a line of text`);
      }
      for (const f of m.display) {
        assert.ok(f.parent && f.display === "block", `${at}: display formula is a block of the text`);
        assert.ok(f.inColumn && f.scrolls, `${at}: display formula stays in the column, scrolling`);
      }
      assert.ok(m.scrollWidth <= width, `${at}: page is ${m.scrollWidth} px wide`);
    }
  });
}
