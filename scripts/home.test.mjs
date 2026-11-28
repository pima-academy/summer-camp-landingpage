// Checks the home page (/): the page file is a list of sections; on the built output,
// section order, hidden content gaps, the press slider, images and the in-page #programs link.
// The built-output tests need a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { distSkip as skip, mainOf, readBuilt, root } from "./test-lib.mjs";

const html = readBuilt("index.html");
const main = mainOf(html);

test("the page file is BaseLayout, its SEO data and the ordered list of its sections", () => {
  const page = readFileSync(join(root, "src/pages/index.astro"), "utf8");
  const template = page.replace(/^---[\s\S]*?\n---/, "");
  const elements = [...template.matchAll(/<([a-z][\w-]*)/g)].map((m) => m[1]);
  assert.deepEqual(elements, [], "no HTML element of its own");
  assert.doesNotMatch(template, /\bclass=|w-node/);
  // Components it renders: BaseLayout, sections and ContentGap wrappers (images are SEO data).
  for (const [line, name] of page.matchAll(/^import (\w+) from "[^"]*\.astro";$/gm)) {
    assert.match(line, /"\.\.\/(sections\/|layouts\/BaseLayout\.astro|components\/ContentGap\.astro)/, `${name}`);
  }
});

test("home page sections are in the old order", { skip }, () => {
  const order = [
    'data-section="hero"',
    'data-section="partners"',
    'data-section="philosophy"',
    'data-section="impact"',
    'data-section="programs-overview"',
    'data-section="founding-story"',
    'data-section="milestone"',
    'data-section="team"',
    'data-section="testimonials"',
    'data-section="summer-camp"',
    'data-section="press"',
    'data-section="contact-section"',
  ];
  const at = order.map((c) => main.indexOf(c));
  assert.ok(at.every((i) => i >= 0), `all sections present: ${order.filter((_, i) => at[i] < 0)}`);
  assert.deepEqual([...at].sort((a, b) => a - b), at, "sections in old order");
  assert.equal(main.match(/data-section=/g)?.length, order.length, "no other section");
});

test("home page hides its content gaps in production", { skip }, () => {
  assert.doesNotMatch(main, /data-section="upcoming-events"|Sự kiện sắp tới/);
  assert.doesNotMatch(main, /data-section="news"|Thông tin mới nhất/);
  assert.doesNotMatch(main, /No items found/);
});

test("the in-page #programs link has a target", { skip }, () => {
  assert.match(main, /href="#programs"/);
  assert.match(main, /id="programs"/);
  assert.doesNotMatch(html, /style="[^"]*opacity:\s*0/);
});

test("press slider: 5 slides (one quote each), 5 s autoplay, infinite, one slide at a time", { skip }, () => {
  const press = main.slice(main.indexOf('data-section="press"'), main.indexOf('data-section="contact-section"'));
  const slider = press.match(/<div[^>]*aria-label="Báo chí nói về PiMA"[^>]*>/)?.[0] ?? "";
  assert.match(slider, /data-slider/);
  assert.match(slider, /data-autoplay="5000"/);
  assert.match(slider, /data-infinite/);
  assert.match(slider, /data-layout="single"/);
  assert.equal(press.match(/<h3\b/g)?.length, 5);
  for (const host of ["tuoitre.vn", "dantri.com.vn", "cafef.vn", "muctim.tuoitre.vn", "hoahoctro.tienphong.vn"]) {
    assert.ok(press.includes(`https://${host}/`), `press link to ${host}`);
  }
});

test("every image is an optimized asset; the hero and team photo are eager", { skip }, () => {
  const imgs = [...main.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  assert.ok(imgs.length > 0);
  for (const img of imgs) {
    assert.match(img, /src="\/_astro\//, `asset: ${img.slice(0, 120)}`);
    assert.match(img, /\bwidth="\d+"/);
    assert.match(img, /\bheight="\d+"/);
  }
  const eager = imgs.filter((i) => /loading="eager"/.test(i));
  assert.equal(eager.length, 2, "two eager images");
  assert.ok(eager.some((i) => /alt="Học viên và giảng viên PiMA/.test(i)), "hero is eager");
  assert.ok(eager.some((i) => /alt="Đội ngũ PiMA"/.test(i)), "team photo is eager");
});

test("internal links use the new routes", { skip }, () => {
  assert.doesNotMatch(html, /href="[^"]*\.html"/);
});
