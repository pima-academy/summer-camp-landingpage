// Checks the built trai-he-toan-hoc-pima page (#35).
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, mainOf, readBuilt } from "./test-lib.mjs";

const html = readBuilt("trai-he-toan-hoc-pima/index.html");

test("camp page is built with its own title and description", { skip }, () => {
  assert.ok(html, "dist/trai-he-toan-hoc-pima/index.html exists");
  assert.match(html, /<title>Trại hè toán học PiMA[^<]*<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]{50,}"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/pimavn\.com\/trai-he-toan-hoc-pima\/">/);
});

test("camp page has its sections in the old order", { skip }, () => {
  const order = [
    "page-header",
    "camp-intro",
    "impact",
    "camp-activity",
    "partners",
    "camp-history",
    "testimonials",
    "summer-camp",
    "contact-section",
  ];
  const found = [...html.matchAll(/data-section="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(found, order);
});

test("camp page markup carries no Webflow or utility class and no w-node id", { skip }, () => {
  const main = mainOf(html);
  assert.doesNotMatch(main, /id="w-node-/);
  const classes = new Set([...main.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)));
  const webflow = [...classes].filter((c) =>
    /^(w-|layout\d|section_|padding-|container-|margin-|spacer-|heading-style-|text-style-|text-size-|text-block-|icon-embed-|iconify|content-item-|camp-detail-link)/.test(c),
  );
  assert.deepEqual(webflow, []);
});

test("both 'Định hướng học thuật' blocks stay", { skip }, () => {
  assert.equal(html.match(/Định hướng học thuật, phát triển toàn diện/g)?.length, 2);
});

test("camp history has a card per camp year, 2026 first, each linking its built year page", { skip }, () => {
  const cards = [...html.matchAll(/<div[^>]*class="camp"[^>]*>([\s\S]*?)<\/div>/g)].map((m) => m[1]);
  const years = cards.map((c) => c.match(/<h3[^>]*>(\d{4})<\/h3>/)?.[1]);
  assert.deepEqual(years, ["2026", "2025", "2024", "2023", "2021", "2019", "2018", "2017", "2016"]);
  for (const [i, c] of cards.entries()) {
    const href = c.match(/<a[^>]*href="([^"]*)"[^>]*>\s*Xem chi tiết &gt;\s*<\/a>/)?.[1];
    assert.equal(href, `/trai-he-toan-hoc-pima/${years[i]}/`, years[i]);
    assert.ok(readBuilt(`trai-he-toan-hoc-pima/${years[i]}/index.html`), `${href} is built`);
  }
  assert.match(cards[0], /<p[^>]*>Toán học trong Trí tuệ Nhân tạo - Mathematics in Artificial Intelligence<\/p>/);
  assert.match(cards[1], /<p[^>]*>Toán học trong các Mô hình Tạo sinh - The Mathematics of Generative Models<\/p>/);
  assert.doesNotMatch(html, /href="#"/);
});

test("the page header links every camp archive page, oldest first, so a visitor reaches a year without scrolling", { skip }, () => {
  const header = html.match(/<section[^>]*data-section="page-header"[\s\S]*?<\/section>/)?.[0] ?? "";
  const nav = header.match(/<nav[^>]*aria-label="Các mùa trại"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav, "a 'Các mùa trại' nav inside the page header");
  const links = [...nav.matchAll(/<a[^>]*href="([^"]*)"[^>]*>\s*(\d{4})\s*<\/a>/g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(
    links.map(([, y]) => y),
    ["2016", "2017", "2018", "2019", "2021", "2023", "2024", "2025", "2026"],
  );
  for (const [href, y] of links) {
    assert.equal(href, `/trai-he-toan-hoc-pima/${y}/`);
    assert.ok(readBuilt(`trai-he-toan-hoc-pima/${y}/index.html`), `${href} is built`);
  }
  assert.doesNotMatch(nav, /aria-current/);
});

test("camp page images all go through <Image> and none point into site/", { skip }, () => {
  const srcs = [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(srcs.length > 10, `images found: ${srcs.length}`);
  for (const s of srcs) assert.match(s, /^\/_astro\//, `${s} is an Astro asset`);
  for (const tag of html.match(/<img[^>]*>/g) ?? []) {
    assert.match(tag, /\swidth="\d+"/, `width on ${tag}`);
    assert.match(tag, /\salt(="[^"]*")?[\s>]/, `alt on ${tag}`);
  }
  assert.doesNotMatch(html, /images\//);
});

test("camp page loads no third-party script or font and no Webflow leftovers", { skip }, () => {
  assert.doesNotMatch(html, /<script[^>]*src="https?:/);
  assert.doesNotMatch(html, /<link[^>]*href="https?:\/\/(?!pimavn\.com)[^"]*"[^>]*rel="(stylesheet|preload)"/);
  assert.doesNotMatch(html, /<link[^>]*rel="(stylesheet|preload)"[^>]*href="https?:/);
  assert.doesNotMatch(html, /data-w-id|data-wf-|translate3d\(0, 50px/);
});
