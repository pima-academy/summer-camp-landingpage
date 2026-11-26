// The brand logo on the site (docs/brand.md, "Logo"): nav and footer use the brand files
// at their widths, undistorted and unrounded.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { distSkip as skip, readBuilt, serveDist } from "./test-lib.mjs";

const html = readBuilt("index.html");
const between = (start, end) => {
  const i = html.indexOf(start);
  const j = html.indexOf(end, i);
  return i < 0 || j < 0 ? "" : html.slice(i, j + end.length);
};
// The first <img> of the header / footer: the logo, inside the home link.
const logoImg = (part) => part.match(/<a href="\/"[^>]*>[\s\S]*?(<img\b[^>]*>)/)?.[1] ?? "";

// Brand file, CSS width, and the file's own pixel size (src/assets/logo/).
const nav = { file: "pima-logo-horizontal-green", width: 132, ratio: 699 / 2048 };
const footer = { file: "pima-logo-stacked-green", width: 80, ratio: 1287 / 950 };

test("nav logo is the horizontal green brand file, 132 px wide", { skip }, () => {
  const img = logoImg(between("<header", "</header>"));
  assert.match(img, new RegExp(`src="/_astro/${nav.file}\\.`));
  assert.match(img, /\swidth="132"/);
  assert.match(img, /\salt(="")?[\s>]/, "the link's aria-label names it");
});

test("footer logo is the stacked green brand file, 80 px wide", { skip }, () => {
  const img = logoImg(between("<footer", "</footer>"));
  assert.match(img, new RegExp(`src="/_astro/${footer.file}\\.`));
  assert.match(img, /\swidth="80"/);
  assert.match(img, /\salt(="")?[\s>]/, "the link's aria-label names it");
});

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

for (const width of [390, 1440]) {
  test(`at ${width} px the logos render at their brand widths, undistorted and unrounded`, { skip }, async () => {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto(`${server.origin}/`);
    for (const [where, logo] of [["header", nav], ["footer", footer]]) {
      const img = page.locator(`${where} a[href="/"] img`).first();
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((el) => el.decode());
      const box = await img.boundingBox();
      assert.equal(box.width, logo.width, `${where} logo width`);
      assert.ok(Math.abs(box.height - logo.width * logo.ratio) < 1, `${where} logo height ${box.height} keeps the ratio`);
      assert.equal(await img.evaluate((el) => getComputedStyle(el).borderTopLeftRadius), "0px", `${where} logo not rounded`);
    }
    await page.close();
  });
}
