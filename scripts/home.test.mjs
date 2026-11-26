// Checks the home page (/) on the built output: section order, hidden content
// gaps, the press slider, images and the in-page #programs link.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, mainOf, readBuilt } from "./test-lib.mjs";

const html = readBuilt("index.html");
const main = mainOf(html);

test("home page sections are in the old order", { skip }, () => {
  // A section file is found by its data-section; the page's own sections (#66) still by class.
  const order = [
    'section_homepage_hero"',
    'data-section="trust-bar"',
    'data-section="partners"',
    'data-section="philosophy"',
    'data-section="impact"',
    'data-section="programs-overview"',
    'section_founding-story"',
    'data-section="milestone"',
    'data-section="team"',
    'data-section="testimonials"',
    'data-section="summer-camp"',
    'section_press"',
    'data-section="contact-section"',
  ];
  const at = order.map((c) => main.indexOf(c));
  assert.ok(at.every((i) => i >= 0), `all sections present: ${order.filter((_, i) => at[i] < 0)}`);
  assert.deepEqual([...at].sort((a, b) => a - b), at, "sections in old order");
  assert.equal(main.match(/data-section="trust-bar"/g)?.length, 2, "two trust bars");
});

test("home page hides its content gaps in production", { skip }, () => {
  assert.doesNotMatch(main, /section_upcoming-events|Sự kiện sắp tới/);
  assert.doesNotMatch(main, /section_news|Thông tin mới nhất/);
  assert.doesNotMatch(main, /No items found/);
});

test("hero and press sections fade up; #programs link has a target", { skip }, () => {
  for (const c of ["section_homepage_hero", "section_founding-story", "section_press"]) {
    const tag = main.match(new RegExp(`<div[^>]*class="${c}"[^>]*>`))?.[0] ?? "";
    assert.match(tag, /data-animate="fade-up"/, `${c} fades up`);
  }
  assert.match(main, /<section[^>]*data-section="contact-section"[^>]*data-animate="fade-up"/, "contact section fades up");
  assert.match(main, /href="#programs"/);
  assert.match(main, /id="programs"/);
  assert.doesNotMatch(html, /style="[^"]*opacity:\s*0/);
});

test("press slider: 5 slides (one quote each), 5 s autoplay, infinite, one slide at a time", { skip }, () => {
  const press = main.slice(main.indexOf('class="section_press"'), main.indexOf('data-section="contact-section"'));
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
  assert.ok(eager.some((i) => /header26_image/.test(i)), "hero is eager");
  assert.ok(eager.some((i) => /alt="Đội ngũ PiMA"/.test(i)), "team photo is eager");
});

test("internal links use the new routes", { skip }, () => {
  assert.doesNotMatch(html, /href="[^"]*\.html"/);
});
