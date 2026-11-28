// Checks the built lien-he page in headless Chromium: one dark-green contact block (the shared
// ContactSection opening the page), its channels as links from site.ts, Facebook once, no
// phone number, and no sideways scroll at any width. The shared block on every other page is
// the pale-lime version with an h2. Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { builtHtmlFiles, distSkip as skip, mainOf, readBuilt, serveDist } from "./test-lib.mjs";
import { readFileSync } from "node:fs";

let server, base, browser;

before(async () => {
  if (skip) return;
  server = await serveDist();
  base = `${server.origin}/`;
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.close();
});

async function open(width, path = "lien-he/") {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const res = await page.goto(new URL(path, base).href);
  assert.equal(res.status(), 200, `dist/${path}index.html exists`);
  return page;
}

test("lien-he is one dark-green contact block with the breadcrumb and the h1", { skip }, async () => {
  const page = await open(1440);
  const names = await page.locator("main [data-section]").evaluateAll((els) => els.map((e) => e.dataset.section));
  assert.deepEqual(names, ["contact-section"]);
  const block = page.locator('[data-section="contact-section"]');
  assert.equal(await block.getAttribute("data-tone"), "dark-green");
  assert.equal(await block.getAttribute("id"), "contact-form");
  assert.equal((await block.locator(".kicker").innerText()).trim(), "PiMA ACADEMY > LIÊN HỆ");
  assert.deepEqual(await page.locator("main h1").allInnerTexts(), ["Liên hệ với PiMA"]);
  assert.equal((await block.locator('[data-tone="white"] h2').innerText()).trim(), "Gửi lời nhắn cho PiMA");
  assert.equal(await block.locator("[data-contact-form]").count(), 1);
  assert.equal(await page.title(), "Liên hệ với PiMA Academy");
  await page.close();
});

test("the channels: email, Facebook, LinkedIn and YouTube as links, the address as text", { skip }, async () => {
  const page = await open(1440);
  const rows = page.locator('[data-section="contact-section"] [data-channels] > li');
  assert.equal(await rows.count(), 5);
  const links = await rows.locator("a").evaluateAll((as) => as.map((a) => [a.textContent.trim(), a.getAttribute("href")]));
  assert.deepEqual(links, [
    ["contact@pimavn.com", "mailto:contact@pimavn.com"],
    ["fb.com/pima.academy.vn", "https://www.facebook.com/pima.academy.vn"],
    ["PiMA Academy", "https://www.linkedin.com/company/pima-academy"],
    ["@pimavn", "https://www.youtube.com/@pimavn"],
  ]);
  const address = await rows.nth(4).innerText();
  assert.match(address, /Địa chỉ/);
  assert.match(address, /35 Văn Chung, Phường Tân Bình, Thành phố Hồ Chí Minh, Việt Nam/);
  assert.equal(await rows.nth(4).locator("a").count(), 0);
  // Facebook once on the page body (the footer keeps its own).
  const main = await page.locator("main").innerHTML();
  assert.equal(main.split("facebook.com/pima.academy.vn").length - 1, 1);
  await page.close();
});

test("the channels and the form card stay on the page at every width", { skip }, async () => {
  for (const width of [320, 390, 479, 480, 767, 768, 991, 992, 1440, 1920]) {
    const page = await open(width);
    const m = await page.evaluate(() => {
      const card = document.querySelector('[data-section="contact-section"] [data-tone="white"]').getBoundingClientRect();
      const rows = document.querySelector('[data-section="contact-section"] [data-channels]').getBoundingClientRect();
      return { scrollWidth: document.documentElement.scrollWidth, card: card.right, rows: rows.right, cardTop: card.top, rowsBottom: rows.bottom };
    });
    assert.ok(m.scrollWidth <= width, `${width} px: page is ${m.scrollWidth} px wide`);
    assert.ok(m.card <= width && m.rows <= width, `${width} px: ${JSON.stringify(m)}`);
    // One column at ≤ 991 px: the card after the channels.
    if (width <= 991) assert.ok(m.cardTop >= m.rowsBottom, `${width} px: the card follows the channels`);
    else assert.ok(m.cardTop < m.rowsBottom, `${width} px: the card sits beside the channels`);
    await page.close();
  }
});

test("at 390 px the kicker clears the fixed nav", { skip }, async () => {
  const page = await open(390);
  const gap = await page.evaluate(() => {
    const nav = document.querySelector("header, nav").getBoundingClientRect();
    const kicker = document.querySelector('[data-section="contact-section"] .kicker').getBoundingClientRect();
    return kicker.top - nav.bottom;
  });
  assert.ok(gap >= 16, `kicker starts ${gap} px under the nav`);
  await page.close();
});

test("every other page shows the pale-lime block with an h2 and no breadcrumb", { skip }, () => {
  for (const path of ["index.html", "ve-chung-toi/index.html", "trai-he-toan-hoc-pima/index.html", "khoa-hoc/index.html", "blog/phat-hien-gian-lan/index.html"]) {
    const html = mainOf(readBuilt(path));
    const start = html.indexOf('data-section="contact-section"');
    assert.ok(start > 0, `${path}: contact block`);
    const tag = html.slice(html.lastIndexOf("<section", start), html.indexOf(">", start));
    assert.match(tag, /data-tone="pale-lime"/, path);
    assert.match(tag, /id="contact-form"/, path);
    const block = html.slice(start, html.indexOf("</section>", start));
    assert.match(block, /<h2[^>]*>Liên hệ với PiMA<\/h2>/, path);
    assert.doesNotMatch(block, /<h1/, path);
    assert.doesNotMatch(block, /&gt; liên hệ/i, path);
  }
});

test("no page shows a PiMA phone number", { skip }, () => {
  for (const file of builtHtmlFiles()) {
    const html = readFileSync(file, "utf8");
    assert.doesNotMatch(html, /955 ?1721|tel:\+?84/, file);
  }
});
