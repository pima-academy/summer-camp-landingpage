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
    "trust-bar",
    "camp-activity",
    "partners",
    "camp-history",
    "testimonials",
    "trust-bar",
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

test("'Xem chi tiết' links are content gaps rendered as plain text", { skip }, () => {
  assert.equal(html.match(/Xem chi tiết &gt;/g)?.length, 7);
  assert.doesNotMatch(html, /href="#"/);
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

test("the page's own sections fade up", { skip }, () => {
  for (const name of ["camp-intro", "camp-activity", "camp-history"]) {
    assert.match(html, new RegExp(`<section[^>]*data-section="${name}"[^>]*data-animate="fade-up"`), name);
  }
});
