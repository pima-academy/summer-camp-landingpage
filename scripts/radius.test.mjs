// One corner radius (spec #56, "Brand look" → Shapes; docs/brand.md, Shapes): on every
// brand-aligned page, at 390 and 1440 px, each rounded element has `--radius` (12px) corners
// or is a circle (icon circles, dots), and every photo has `--radius` corners, never a circle.
// Logos (brand, partner, press, university: `img[data-logo]`) are the exception: never rounded.
//
// Adding a page: add its path to PAGES. Needs a fresh `npm run build`; skipped when dist/ is missing (fails in CI).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

const PAGES = ["/", "/ve-chung-toi/", "/khoa-hoc/", "/trai-he-toan-hoc-pima/", "/lien-he/", "/404.html", "/blog/", "/blog/phat-hien-gian-lan/", "/blog/plato-2/"];
const WIDTHS = [390, 1440];

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
 * The corners on the page that are neither square, `--radius` nor a circle, and the photos
 * whose corners are not `--radius`, as "<tag.class>: <radius>" strings. A logo (`data-logo`,
 * and every brand logo file, `pima-logo-…`) must be square instead.
 */
async function offRadius(path, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  await page.goto(server.origin + path, { waitUntil: "load" });
  const off = await page.evaluate(() => {
    const radius = getComputedStyle(document.documentElement).getPropertyValue("--radius").trim();
    const name = (el) => `${el.tagName.toLowerCase()}${el.classList.length ? "." + [...el.classList].join(".") : ""}${el.src ? ` (${el.src.split("/").pop()})` : ""}`;
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      const s = getComputedStyle(el);
      const corners = [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
      const img = el.tagName === "IMG";
      const logo = img && (el.hasAttribute("data-logo") || /\/pima-logo-/.test(el.currentSrc || el.src));
      if (logo) {
        if (corners.some((c) => c !== "0px")) out.push(`${name(el)}: logo rounded ${corners.join(" ")}`);
        continue;
      }
      if (img) {
        if (!corners.every((c) => c === radius)) out.push(`${name(el)}: photo corners ${corners.join(" ")}, not ${radius}`);
        continue;
      }
      const ok = (c) => c === "0px" || c === radius || c === "100%" || c === "50%";
      if (!corners.every(ok)) out.push(`${name(el)}: ${corners.join(" ")}`);
    }
    return out;
  });
  await context.close();
  return off;
}

for (const path of PAGES) {
  for (const width of WIDTHS) {
    test(`${path} at ${width} px uses one radius and rounds every photo`, { skip }, async () => {
      assert.deepEqual(await offRadius(path, width), []);
    });
  }
}
