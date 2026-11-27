// The brand logo on the site (docs/brand.md, "Logo"): nav and footer use the brand files
// at their widths, undistorted and unrounded; favicon and app icon are the symbol alone.
// The icon files come from scripts/make-icons.mjs.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import { dist, distSkip as skip, readBuilt, root, serveDist, walk } from "./test-lib.mjs";

const html = readBuilt("index.html");
const between = (start, end) => {
  const i = html.indexOf(start);
  const j = html.indexOf(end, i);
  return i < 0 || j < 0 ? "" : html.slice(i, j + end.length);
};
const head = between("<head", "</head>");
/** A built PNG, decoded; null when missing. */
const png = (path) => {
  const file = join(dist, path);
  return existsSync(file) ? PNG.sync.read(readFileSync(file)) : null;
};
/** [r, g, b, a] of pixel (x, y). */
const pixel = (img, x, y) => [...img.data.subarray((y * img.width + x) * 4, (y * img.width + x) * 4 + 4)];
/**
 * The artwork in an icon: the bounding box [left, top, right, bottom] of its "ink" (pixels
 * neither transparent nor white), and the share of the solid ink in PiMA Green (#50b448;
 * the rest are resampled edges).
 */
function ink(img) {
  const box = [img.width, img.height, -1, -1];
  let solid = 0;
  let green = 0;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const [r, g, b, a] = pixel(img, x, y);
      if (a <= 128 || (r > 240 && g > 240 && b > 240)) continue;
      box[0] = Math.min(box[0], x);
      box[1] = Math.min(box[1], y);
      box[2] = Math.max(box[2], x);
      box[3] = Math.max(box[3], y);
      solid++;
      if (a > 200 && Math.abs(r - 80) < 24 && Math.abs(g - 180) < 24 && Math.abs(b - 72) < 24) green++;
    }
  }
  return { box, green: green / solid };
}

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

for (const size of [32, 48]) {
  test(`favicon at ${size} px is the green symbol`, { skip }, () => {
    const href = `/favicon-${size}.png`;
    assert.match(head, new RegExp(`<link rel="icon" href="${href}" sizes="${size}x${size}" type="image/png">`));
    const img = png(href);
    assert.ok(img, `${href} built`);
    assert.deepEqual([img.width, img.height], [size, size]);
    // The symbol alone, edge to edge: with the wordmark under it, it would be narrower than tall.
    const art = ink(img);
    assert.deepEqual(art.box, [0, 0, size - 1, size - 1], "symbol fills the square");
    assert.ok(art.green > 0.4, `PiMA Green (${art.green})`);
  });
}

test("apple-touch-icon is the green symbol on white, 180 px", { skip }, () => {
  assert.match(head, /<link rel="apple-touch-icon" href="\/apple-touch-icon\.png" sizes="180x180">/);
  const img = png("/apple-touch-icon.png");
  assert.ok(img, "apple-touch-icon built");
  assert.deepEqual([img.width, img.height], [180, 180]);
  // iOS fills transparency with black: every pixel is opaque, the corners white.
  for (let i = 3; i < img.data.length; i += 4) assert.equal(img.data[i], 255, "opaque");
  for (const [x, y] of [[0, 0], [179, 0], [0, 179], [179, 179]]) assert.deepEqual(pixel(img, x, y), [255, 255, 255, 255]);
  // The symbol alone, 144 px, centred.
  const art = ink(img);
  assert.deepEqual(art.box, [18, 18, 161, 161], "144 px symbol in the centre");
  assert.ok(art.green > 0.4, `PiMA Green (${art.green})`);
});

test("the old favicon.png and webclip.png are gone", { skip }, () => {
  assert.doesNotMatch(head, /favicon\.png|webclip\.png/);
  assert.equal(existsSync(join(dist, "favicon.png")), false);
  assert.equal(existsSync(join(dist, "webclip.png")), false);
});

test("no old PiMA logo export is left", () => {
  const old = readdirSync(join(root, "src/assets/images")).filter((f) => /^logo-(1|horizontal)[.-]/.test(f));
  assert.deepEqual(old, []);
});

test("pages without a hero share the 1200 × 630 og:image: the horizontal logo on white", { skip }, () => {
  const page = readBuilt("lien-he/index.html");
  const meta = (name) => page.match(new RegExp(`<meta property="${name}" content="([^"]*)"`))?.[1];
  assert.equal(meta("og:image:width"), "1200");
  assert.equal(meta("og:image:height"), "630");
  const img = png(new URL(meta("og:image")).pathname);
  assert.ok(img, "og:image built as a PNG");
  assert.deepEqual([img.width, img.height], [1200, 630]);
  for (const [x, y] of [[0, 0], [1199, 0], [0, 629], [1199, 629]]) assert.deepEqual(pixel(img, x, y), [255, 255, 255, 255]);
  // The logo 600 px wide (205 px tall) in the centre, so a centred square crop keeps it whole.
  const art = ink(img);
  assert.deepEqual(art.box, [300, 213, 899, 417]);
  assert.ok(art.green > 0.4, `PiMA Green (${art.green})`);
});
