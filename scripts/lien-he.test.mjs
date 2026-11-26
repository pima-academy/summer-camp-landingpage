// Checks the built lien-he page in headless Chromium: its sections in the old order, the
// social links stay inside their card at every width (old site: "Youtube" overflowed at
// 820 px and the page scrolled sideways), and the contact facts come from site.ts.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

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

async function open(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const res = await page.goto(new URL("lien-he/", base).href);
  assert.equal(res.status(), 200, "dist/lien-he/index.html exists");
  return page;
}

test("lien-he renders contact facts, social links, trust bar and message form in the old order", { skip }, async () => {
  const page = await open(1440);
  const names = await page.locator("main [data-section]").evaluateAll((els) => els.map((e) => e.dataset.section));
  assert.deepEqual(names, ["contact-facts", "social-links", "trust-bar", "message-form"]);
  assert.equal(await page.locator('[data-section="message-form"]').getAttribute("id"), "contact-form");
  assert.equal(await page.locator('[data-section="message-form"] [data-contact-form]').count(), 1);
  await page.close();
});

test("the social links stay inside their card and the page never scrolls sideways", { skip }, async () => {
  for (const width of [320, 390, 479, 480, 500, 520, 559, 560, 600, 700, 768, 820, 900, 991, 992, 1024, 1100, 1440, 1920]) {
    const page = await open(width);
    const m = await page.evaluate(() => {
      // The card is the box around the heading and the links.
      const section = document.querySelector('[data-section="social-links"]');
      const card = section.querySelector("h2").parentElement.getBoundingClientRect();
      const links = [...section.querySelectorAll("a")].map((e) => {
        const b = e.getBoundingClientRect();
        return { text: e.textContent.trim(), left: b.left, right: b.right };
      });
      return { scrollWidth: document.documentElement.scrollWidth, card: { left: card.left, right: card.right }, links };
    });
    assert.equal(m.links.length, 3);
    assert.ok(m.scrollWidth <= width, `${width} px: page is ${m.scrollWidth} px wide`);
    for (const p of m.links) {
      assert.ok(p.left >= m.card.left - 0.5 && p.right <= m.card.right + 0.5, `${width} px: "${p.text}" link [${p.left}, ${p.right}] leaves card [${m.card.left}, ${m.card.right}]`);
    }
    await page.close();
  }
});

test("contact facts and social links", { skip }, async () => {
  const page = await open(1440);
  const text = await page.locator('[data-section="contact-facts"]').innerText();
  assert.match(text, /fb\.com\/pima\.academy\.vn/);
  assert.match(text, /contact@pimavn\.com/);
  assert.match(text, /35 Văn Chung, Phường Tân Bình, Thành phố Hồ Chí Minh, Việt Nam/);
  const hrefs = await page.locator('[data-section="social-links"] a').evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  assert.deepEqual(hrefs, [
    "https://www.facebook.com/pima.academy.vn",
    "https://www.linkedin.com/company/pima-academy",
    "https://www.youtube.com/@pimavn",
  ]);
  assert.equal(await page.title(), "Liên hệ với PiMA Academy");
  await page.close();
});
