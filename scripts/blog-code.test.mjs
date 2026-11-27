// Code blocks on a built blog post page, in headless Chromium (spec #110, #114): the Jupyter
// introduction's code is highlighted in the brand's code colours, every block has the brand's
// radius, and a line wider than a phone scrolls inside its block, never the page.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

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

/** What the page shows of its code blocks. */
async function measure(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const res = await page.goto(server.origin + POST);
  assert.equal(res.status(), 200, `${POST} exists`);
  const m = await page.evaluate(() => {
    const prose = document.querySelector('[data-section="post-body"] .prose');
    const column = prose.getBoundingClientRect();
    // The token colours a role token resolves to, to compare with what the code shows.
    const probe = document.createElement("span");
    prose.append(probe);
    const role = (name) => {
      probe.style.color = `var(${name})`;
      return getComputedStyle(probe).color;
    };
    const roles = { keyword: role("--color-code-keyword"), string: role("--color-code-string"), comment: role("--color-code-comment") };
    probe.remove();
    const pres = [...prose.querySelectorAll("pre")];
    return {
      scrollWidth: document.documentElement.scrollWidth,
      radius: getComputedStyle(document.documentElement).getPropertyValue("--radius").trim(),
      roles,
      python: pres
        .filter((p) => p.dataset.language === "python")
        .flatMap((p) => [...p.querySelectorAll("span[style]")].map((s) => getComputedStyle(s).color)),
      blocks: pres.map((p) => {
        const box = p.getBoundingClientRect();
        const style = getComputedStyle(p);
        return {
          language: p.dataset.language,
          radius: style.borderTopLeftRadius,
          inColumn: box.left >= column.left - 0.5 && box.right <= column.right + 0.5,
          overflowX: style.overflowX,
          wide: p.scrollWidth > p.clientWidth,
        };
      }),
    };
  });
  await page.close();
  return m;
}

test("the Jupyter introduction's Python is highlighted in the brand's code colours", { skip }, async () => {
  const m = await measure(1440);
  const shown = new Set(m.python);
  for (const [token, colour] of Object.entries(m.roles)) assert.ok(shown.has(colour), `${token} tokens in ${colour}`);
});

test("code blocks have the brand's radius, stay in the column and scroll sideways on their own at 390 px", { skip }, async () => {
  for (const width of [390, 1440]) {
    const m = await measure(width);
    const at = `${POST} at ${width} px`;
    assert.ok(m.blocks.length > 100, `${at}: ${m.blocks.length} code blocks`);
    for (const [k, b] of m.blocks.entries()) {
      assert.equal(b.radius, m.radius, `${at}: block ${k + 1} (${b.language}) radius`);
      assert.ok(b.inColumn, `${at}: block ${k + 1} (${b.language}) in the column`);
      assert.equal(b.overflowX, "auto", `${at}: block ${k + 1} (${b.language}) scrolls`);
    }
    if (width === 390) assert.ok(m.blocks.some((b) => b.wide), `${at}: a block wider than the phone`);
    assert.ok(m.scrollWidth <= width, `${at}: page is ${m.scrollWidth} px wide`);
  }
});
