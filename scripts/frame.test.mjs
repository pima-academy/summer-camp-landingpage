// Checks the frame (BaseLayout + site metadata) on the built output.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { dist, distSkip as skip, readBuilt } from "./test-lib.mjs";

const html = readBuilt("index.html");

const meta = (attr, name) =>
  html.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`))?.[1] ??
  html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"`))?.[1];

test("home page head has title, description and canonical", { skip }, () => {
  assert.match(html, /<html lang="vi"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.ok(meta("name", "description"), "meta description");
  assert.match(html, /<link rel="canonical" href="https:\/\/pimavn\.com\/">/);
});

test("home page has Open Graph tags with an absolute image at most 1200 px wide", { skip }, () => {
  assert.ok(meta("property", "og:title"));
  assert.ok(meta("property", "og:description"));
  assert.equal(meta("property", "og:url"), "https://pimavn.com/");
  const image = meta("property", "og:image");
  assert.match(image ?? "", /^https:\/\/pimavn\.com\/_astro\/.+\.(png|jpg)$/);
  // 1200 px, or the source width when the hero is narrower (Astro never upscales).
  const width = Number(meta("property", "og:image:width"));
  assert.ok(width > 0 && width <= 1200, `og:image:width ${width}`);
  const file = join(dist, new URL(image).pathname);
  assert.ok(existsSync(file), `og:image file ${file} exists`);
});

test("home page loads favicon, webclip and one site stylesheet", { skip }, () => {
  assert.match(html, /<link rel="icon" href="\/favicon\.png"/);
  assert.match(html, /<link rel="apple-touch-icon" href="\/webclip\.png"/);
  const sheets = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(sheets.length, 1, `one bundled stylesheet, got ${sheets}`);
  const css = readFileSync(join(dist, sheets[0]), "utf8");
  // Old order: fonts, normalize, webflow, pima-website.
  const order = [
    css.indexOf("@font-face"),
    css.indexOf("-webkit-text-size-adjust"), // normalize
    css.indexOf(".w-inline-block"), // webflow.css
    css.indexOf(".footer3_"), // pima-website.webflow.css
  ];
  assert.ok(order.every((i) => i >= 0), `all sheets present: ${order}`);
  assert.deepEqual([...order].sort((a, b) => a - b), order, "sheets in old order");
});

test("home page has one <main> and the js-ready script", { skip }, () => {
  assert.equal(html.match(/<main[\s>]/g)?.length, 1);
  assert.match(html, /classList\.add\("js-ready"\)/);
  assert.doesNotMatch(html, /data-wf-|data-w-id/);
});

test("home page references no third-party host", { skip }, () => {
  // Every src/href in the page must be root-relative, except links out
  // (<a>) and the absolute canonical / og URLs on pimavn.com.
  const refs = [...html.matchAll(/<(?!a\s)(\w+)[^>]*\s(?:src|href)="(https?:)?\/\/([^/"]+)/g)];
  const hosts = refs.map((m) => m[3]).filter((h) => h !== "pimavn.com");
  assert.deepEqual(hosts, []);
});

test("sitemap and robots.txt exist", { skip }, () => {
  assert.ok(existsSync(join(dist, "sitemap-index.xml")));
  const robots = readFileSync(join(dist, "robots.txt"), "utf8");
  assert.match(robots, /Sitemap: https:\/\/pimavn\.com\/sitemap-index\.xml/);
});
