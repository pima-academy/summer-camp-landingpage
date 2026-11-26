// Checks the home page (/) on the built output: section order, hidden content
// gaps, the press slider, images and the in-page #programs link.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const indexPath = join(dist, "index.html");
const skip = existsSync(indexPath) ? false : "dist/ missing: run `npm run build` first";
const html = skip ? "" : readFileSync(indexPath, "utf8");
const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] ?? "";

test("home page sections are in the old order", { skip }, () => {
  const order = [
    "section_homepage_hero",
    "section_trust-bar_dark-green",
    "section_partners",
    "section_philosophy",
    "section_impact",
    "section_programs-overview",
    "section_founding-story",
    "section_milestone",
    "section_team",
    "section_testimonials",
    "section_summer-camp",
    "section_press",
    "section_contact-form",
  ];
  const at = order.map((c) => main.indexOf(`${c}"`));
  assert.ok(at.every((i) => i >= 0), `all sections present: ${order.filter((_, i) => at[i] < 0)}`);
  assert.deepEqual([...at].sort((a, b) => a - b), at, "sections in old order");
  assert.equal(main.match(/section_trust-bar_dark-green"/g)?.length, 2, "two trust bars");
});

test("home page hides its content gaps in production", { skip }, () => {
  assert.doesNotMatch(main, /section_upcoming-events|Sự kiện sắp tới/);
  assert.doesNotMatch(main, /section_news|Thông tin mới nhất/);
  assert.doesNotMatch(main, /No items found/);
});

test("hero and press sections fade up; #programs link has a target", { skip }, () => {
  for (const c of ["section_homepage_hero", "section_founding-story", "section_press", "section_contact-form"]) {
    const tag = main.match(new RegExp(`<div[^>]*class="${c}"[^>]*>`))?.[0] ?? "";
    assert.match(tag, /data-animate="fade-up"/, `${c} fades up`);
  }
  assert.match(main, /href="#programs"/);
  assert.match(main, /id="programs"/);
  assert.doesNotMatch(html, /style="[^"]*opacity:\s*0/);
});

test("press slider: 5 slides, 5 s autoplay, infinite, centre arrows", { skip }, () => {
  const press = main.slice(main.indexOf('class="section_press"'), main.indexOf("section_contact-form"));
  const slider = press.match(/<div[^>]*class="course-testimonial w-slider"[^>]*>/)?.[0] ?? "";
  assert.match(slider, /data-autoplay="5000"/);
  assert.match(slider, /data-infinite/);
  assert.equal(press.match(/testimonial7_slide w-slide/g)?.length, 5);
  assert.equal(press.match(/is-centre-(previous|next)/g)?.length, 2);
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
  assert.ok(eager.some((i) => /team-image/.test(i)), "team photo is eager");
});

test("internal links use the new routes", { skip }, () => {
  assert.doesNotMatch(html, /href="[^"]*\.html"/);
});
