// Checks the Lightbox widget (src/components/Lightbox.astro) on the camp archive page in a
// browser: a plate's photo opens its album at that photo and steps through every photo of the
// album, not only the five shown; Esc closes and focus returns to the photo; the cover opens its
// own set (two photos in a multi-campus year, no arrows for one); the open lightbox's text and
// control icons pass WCAG AA. Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

let server, browser;

before(async () => {
  if (skip) return;
  server = await serveDist();
  const { chromium } = await import("playwright");
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  server?.close();
});

async function open(path, width = 1440) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(server.origin + path, { waitUntil: "load" });
  return page;
}

const shown = (page) =>
  page.evaluate(() => {
    const dialog = document.querySelector("dialog[data-lightbox][open]");
    return dialog && { count: dialog.querySelector(".count").textContent, src: dialog.querySelector(".photo").currentSrc || dialog.querySelector(".photo").src };
  });

test("a plate's photo opens its whole album at that photo; Esc closes and returns focus", { skip }, async () => {
  const page = await open("/trai-he-toan-hoc-pima/2016/");
  const plate = page.locator("[data-section=plates] .plate").first();
  const total = Number((await plate.locator(":scope > div > .count").textContent()).match(/\d+/)[0]);
  assert.ok(total > 5, "the first 2016 album has more photos than the plate shows");

  const third = plate.locator("[data-lightbox-open]").nth(3); // "Xem cả album" is the first opener
  await third.click();
  assert.equal((await shown(page)).count, `3 / ${total}`);

  await page.keyboard.press("ArrowRight");
  assert.equal((await shown(page)).count, `4 / ${total}`);
  for (let k = 0; k < 4; k++) await page.click("dialog[open] .prev");
  assert.equal((await shown(page)).count, `${total} / ${total}`, "wraps around to the last photo");
  await page.keyboard.press("ArrowRight");
  assert.equal((await shown(page)).count, `1 / ${total}`);

  await page.keyboard.press("Escape");
  assert.equal(await shown(page), null);
  assert.ok(await third.evaluate((el) => el === document.activeElement), "focus is back on the photo");

  await plate.getByRole("button", { name: "Xem cả album" }).click();
  assert.equal((await shown(page)).count, `1 / ${total}`);
  await page.close();
});

test("the photo fits the screen whole and a click around it closes the lightbox", { skip }, async () => {
  for (const width of [1440, 390]) {
    const page = await open("/trai-he-toan-hoc-pima/2016/", width);
    await page.locator("[data-section=plates] .cell").first().click();
    const img = page.locator("dialog[open] .photo");
    await img.evaluate((el) => el.decode());
    const box = await img.boundingBox();
    const ratio = await img.evaluate((el) => el.naturalWidth / el.naturalHeight);
    assert.ok(box.width <= width && box.y + box.height <= 900, `${width} px: inside the viewport`);
    assert.ok(Math.abs(box.width / box.height - ratio) < 0.02, `${width} px: not cropped`);
    const stage = await page.locator("dialog[open] .stage").boundingBox();
    const [x, y] = box.x - stage.x > 10 ? [stage.x + 2, stage.y + stage.height / 2] : [stage.x + stage.width / 2, stage.y + stage.height - 2];
    await page.mouse.click(x, y);
    assert.equal(await shown(page), null, `${width} px: closed`);
    await page.close();
  }
});

test("the cover opens its own set: both campuses in 2025, one photo without arrows in 2016", { skip }, async () => {
  let page = await open("/trai-he-toan-hoc-pima/2025/");
  await page.locator("[data-section=cover] [data-lightbox-open]").nth(1).click();
  assert.equal((await shown(page)).count, "2 / 2");
  const label = () => page.locator("dialog[open] .label").textContent();
  assert.equal(await label(), "Trại hè PiMA 2025 tại Hà Nội");
  await page.keyboard.press("ArrowRight");
  assert.equal((await shown(page)).count, "1 / 2");
  assert.equal(await label(), "Trại hè PiMA 2025 tại TP.HCM");
  await page.close();

  page = await open("/trai-he-toan-hoc-pima/2016/");
  await page.locator("[data-section=cover] [data-lightbox-open]").click();
  assert.equal((await shown(page)).count, "1 / 1");
  assert.equal(await page.locator("dialog[open] .arrow").count(), 0);
  await page.close();
});

test("the open lightbox's text and control icons pass WCAG AA", { skip }, async () => {
  for (const width of [1440, 390]) {
    const page = await open("/trai-he-toan-hoc-pima/2016/", width);
    await page.locator("[data-section=plates] .cell").first().click();
    await page.addScriptTag({ content: axeSource });
    const violations = await page.evaluate(async () => {
      const { violations } = await window.axe.run({ include: ["dialog[open]"] }, { runOnly: { type: "rule", values: ["color-contrast"] } });
      return violations.flatMap((v) => v.nodes.map((n) => n.target.join(" ")));
    });
    assert.deepEqual(violations, [], `${width} px`);
    // Each control icon against its button's own background (3:1, docs/brand.md "Icons").
    const ratios = await page.$$eval("dialog[open] .control svg", (icons) => {
      const parse = (c) => c.match(/[\d.]+/g).slice(0, 3).map((v) => (c.startsWith("color(") ? Number(v) : v / 255));
      const lum = (rgb) => rgb.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
      return icons.map((icon) => {
        const [hi, lo] = [lum(parse(getComputedStyle(icon).color)), lum(parse(getComputedStyle(icon.parentElement).backgroundColor))].sort((a, b) => b - a);
        return (hi + 0.05) / (lo + 0.05);
      });
    });
    assert.equal(ratios.length, 3);
    for (const r of ratios) assert.ok(r >= 3, `${width} px: icon contrast ${r.toFixed(2)}:1`);
    await page.close();
  }
});
