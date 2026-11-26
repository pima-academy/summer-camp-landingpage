// Checks the built trai-he-toan-hoc-pima page (#35).
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const skip = existsSync(join(dist, "index.html")) ? false : "dist/ missing: run `npm run build` first";
const pagePath = join(dist, "trai-he-toan-hoc-pima", "index.html");
const html = !skip && existsSync(pagePath) ? readFileSync(pagePath, "utf8") : "";

test("camp page is built with its own title and description", { skip }, () => {
  assert.ok(html, "dist/trai-he-toan-hoc-pima/index.html exists");
  assert.match(html, /<title>Trại hè toán học PiMA[^<]*<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]{50,}"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/pimavn\.com\/trai-he-toan-hoc-pima\/">/);
});

test("camp page has its sections in the old order", { skip }, () => {
  const order = [
    'class="section_camp-header"',
    'class="section_camp-intro"',
    'class="section_impact"',
    'class="section_trust-bar_dark-green"',
    'class="section_camp-activity"',
    'class="section_partners"',
    'class="section_camp-history"',
    'class="section_testimonials"',
    'class="section_summer-camp"',
    'id="contact-form"',
  ].map((s) => [s, html.indexOf(s)]);
  for (const [s, i] of order) assert.ok(i >= 0, `${s} present`);
  const idx = order.map(([, i]) => i);
  assert.deepEqual([...idx].sort((a, b) => a - b), idx, "sections in old order");
  assert.equal(html.match(/class="section_trust-bar_dark-green"/g)?.length, 2, "two trust bars");
  // Testimonials, the second trust bar, SummerCamp and the contact section sit inside
  // section_camp-history, as on the old page.
  const history = html.slice(html.indexOf('class="section_camp-history"'));
  const beforeContact = history.slice(0, history.indexOf('id="contact-form"'));
  assert.doesNotMatch(beforeContact, /<\/section>/, "camp history still open at the contact section");
  assert.match(history.slice(beforeContact.length), /<\/section>/, "camp history closes after it");
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

test("faded-up sections carry data-animate", { skip }, () => {
  for (const cls of ["section_camp-intro", "section_camp-activity", "section_camp-history"]) {
    assert.match(html, new RegExp(`<[a-z]+[^>]*data-animate="fade-up"[^>]*class="${cls}"|<[a-z]+[^>]*class="${cls}"[^>]*data-animate="fade-up"`), cls);
  }
});
