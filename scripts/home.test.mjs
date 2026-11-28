// Checks the home page (/): the page file is a list of sections; on the built output,
// section order, hidden content gaps, the press slider, images and the in-page #programs link.
// The built-output tests need a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { blogPosts, distSkip as skip, mainOf, publishedBlogPosts, readBuilt, root, sectionOf as sectionOfPage, textOf } from "./test-lib.mjs";

const html = readBuilt("index.html");
const main = mainOf(html);

/** The markup of the section `name` of the home page ("" when missing). */
const sectionOf = (name) => sectionOfPage(main, name);

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

test("home page has the redesign's eight sections, in order (spec #131)", { skip }, () => {
  const order = [
    "hero",
    "impact",
    "programs-overview",
    "testimonials",
    "partners",
    "press",
    "blog-teaser",
    "contact-section",
  ];
  const sections = [...main.matchAll(/data-section="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(sections, order);
});

test("the removed sections and content gaps are gone from home, even in dev", { skip }, () => {
  assert.doesNotMatch(main, /Sự kiện sắp tới|Thông tin mới nhất|No items found/);
  for (const file of ["FoundingStory", "News", "UpcomingEvents"]) {
    assert.ok(!existsSync(join(root, "src/sections/home", `${file}.astro`)), `src/sections/home/${file}.astro`);
  }
  assert.doesNotMatch(readFileSync(join(root, "src/pages/index.astro"), "utf8"), /ContentGap/);
});

// The press quotes are the outlets' words, quoted unchanged (one of them says "hàng đầu").
test("home says neither “miễn phí” nor “hàng đầu” in its own words, text or meta description", { skip }, () => {
  assert.doesNotMatch(html.replace(sectionOf("press"), ""), /miễn phí|hàng đầu/i);
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
  for (const host of ["tuoitre.vn", "dantri.com.vn", "cafef.vn", "muctim.tuoitre.vn", "hoahoctro.tienphong.vn"]) {
    assert.ok(press.includes(`https://${host}/`), `press link to ${host}`);
  }
});

test("every image is an optimized asset with its size", { skip }, () => {
  const imgs = [...main.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  assert.ok(imgs.length > 0);
  for (const img of imgs) {
    assert.match(img, /src="\/_astro\//, `asset: ${img.slice(0, 120)}`);
    assert.match(img, /\bwidth="\d+"/);
    assert.match(img, /\bheight="\d+"/);
  }
});

test("the hero: dark-green, kicker, the h1, the lead, two buttons, and no photo", { skip }, () => {
  const hero = sectionOf("hero");
  assert.match(hero, /data-tone="dark-green"/);
  assert.match(textOf(hero.match(/<p\b[^>]*class="kicker[^>]*>[\s\S]*?<\/p>/)?.[0] ?? ""), /^PiMA Academy$/i);
  assert.equal(textOf(hero.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ""), "Khám phá những biên giới mới của toán học và ứng dụng");
  assert.match(textOf(hero), /PiMA \(Projects in Mathematics and Applications\) là tổ chức giáo dục toán học và ứng dụng/);
  const links = [...hero.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, href, inner]) => [href, textOf(inner)]);
  assert.deepEqual(links, [
    ["#programs", "Xem các chương trình"],
    ["/ve-chung-toi/", "Về PiMA"],
  ]);
  assert.doesNotMatch(hero, /<img\b/, "the sphere is a CSS mask, not an image");
});

// The expected posts come from the content folder's front matter, not from the page: adding a
// post with a newer `date` changes them, so the teaser passes only if it follows by itself.
test("the blog teaser shows the 3 newest published posts by date, newest first, and links to /blog/", { skip }, () => {
  const teaser = sectionOf("blog-teaser");
  assert.match(teaser, /<h2\b[^>]*>Bài viết mới nhất<\/h2>/);
  const all = [...teaser.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.ok(all.some(([, href, inner]) => href === "/blog/" && textOf(inner) === "Tất cả bài viết"), "Tất cả bài viết → /blog/");
  const cards = all.filter(([, href]) => /^\/blog\/[^/]+\/$/.test(href));
  const newest = publishedBlogPosts().slice(0, 3);
  assert.deepEqual(
    cards.map(([, href]) => href),
    newest.map((p) => `/blog/${p.slug}/`),
  );
  for (const [[, href, card], post] of cards.map((c, i) => [c, newest[i]])) {
    assert.ok(textOf(card).includes(post.title), `${href}: title`);
    assert.match(card, new RegExp(`>${post.date.split("-").reverse().join("/")}</time>`), `${href}: date`);
  }
  // The sample draft is dated after every published post: newest by date, yet never shown.
  const drafts = blogPosts().filter((p) => p.draft === "true");
  for (const d of drafts) assert.ok(!teaser.includes(`/blog/${d.slug}/`), `draft ${d.slug} is not in the teaser`);
});

test("programs: the one-line lead and two cards, each a real photo, h3, three activities and its button", { skip }, () => {
  const programs = sectionOf("programs-overview");
  assert.match(programs, /data-tone="surface"/);
  assert.ok(textOf(programs).includes("PiMA tổ chức hai chương trình chính: trại hè cho học sinh THPT và các khóa học trực tuyến."));
  const cards = [...programs.matchAll(/<article\b[\s\S]*?<\/article>/g)].map((m) => m[0]);
  const expected = [
    ["Trại hè Toán học và Ứng dụng", "/trai-he-toan-hoc-pima/", "Tìm hiểu về trại hè", /alt="Trại sinh và ban tổ chức Trại hè PiMA 2025 tại TP.HCM"/],
    ["Khóa học trực tuyến", "/khoa-hoc/", "Xem các khóa học", /alt="Bảng đen với các công thức toán"/],
  ];
  assert.equal(cards.length, 2);
  for (const [card, [name, href, cta, photo]] of cards.map((c, i) => [c, expected[i]])) {
    assert.equal(textOf(card.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/)?.[1] ?? ""), name);
    assert.match(card, photo, `${name}: photo`);
    assert.equal(card.match(/<li\b/g)?.length, 3, `${name}: three activities`);
    assert.ok([...card.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].some(([, h, t]) => h === href && textOf(t) === cta), `${name}: button`);
  }
  assert.doesNotMatch(programs, /trai-he-toan-hoc\.|khoa-hoc-toan-mo-hinh\./, "no baked-text banner");
});

test("press: the outlet's logo, linking to the article, above its quote in typographic quotes", { skip }, () => {
  const press = sectionOf("press");
  const quotes = [...press.matchAll(/<figure\b[\s\S]*?<\/figure>/g)].map((m) => m[0]);
  assert.equal(quotes.length, 5);
  for (const q of quotes) {
    assert.match(q, /<a\b[^>]*href="https:\/\/[^"]+"[^>]*>\s*<img\b[^>]*data-logo[\s\S]*?<\/a>\s*<blockquote\b/, "logo link above the quote");
    assert.match(textOf(q.match(/<blockquote\b[\s\S]*?<\/blockquote>/)[0]), /^“[^"]+”$/, "typographic quotes, no straight ones");
  }
});

test("internal links use the new routes", { skip }, () => {
  assert.doesNotMatch(html, /href="[^"]*\.html"/);
});
