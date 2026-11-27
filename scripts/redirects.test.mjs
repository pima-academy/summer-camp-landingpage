// Checks the redirects of the removed camp pages and /chi-tiet-trai-he/ (#107) in the build:
// each old URL is an instant meta refresh to its camp archive page, with noindex and a
// canonical link to the target, and stays out of the sitemap.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, readBuilt } from "./test-lib.mjs";

const REDIRECTS = [
  { from: "trai-he-toan-hoc-2025", to: "/trai-he-toan-hoc-pima/2025/" },
  { from: "trai-he-pima-2026", to: "/trai-he-toan-hoc-pima/2026/" },
  { from: "chi-tiet-trai-he", to: "/trai-he-toan-hoc-pima/2024/" },
];

for (const { from, to } of REDIRECTS) {
  test(`/${from}/ redirects to ${to}`, { skip }, () => {
    const html = readBuilt(`${from}/index.html`);
    assert.ok(html, `dist/${from}/index.html missing`);
    assert.match(html, new RegExp(`<meta http-equiv="refresh" content="0;url=${to}"`));
    assert.match(html, /<meta name="robots" content="noindex">/);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://pimavn\\.com${to}"`));
  });
}

test("no redirected URL is in the sitemap", { skip }, () => {
  const sitemap = readBuilt("sitemap-0.xml");
  assert.ok(sitemap, "dist/sitemap-0.xml missing");
  assert.match(sitemap, /<loc>https:\/\/pimavn\.com\/trai-he-toan-hoc-pima\/2024\/<\/loc>/);
  for (const { from } of REDIRECTS) assert.doesNotMatch(sitemap, new RegExp(`/${from}/`));
});
