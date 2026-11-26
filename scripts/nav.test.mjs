// Drives the built home page in headless Chromium to check the Nav script
// (mobile collapse + "Chương trình" dropdown). Needs a fresh `npm run build`;
// skipped when dist/ is missing.
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

/** Opens the home page with a tall <main> so the page can scroll. */
async function open({ width, hasTouch = false, javaScriptEnabled = true }) {
  const context = await browser.newContext({ viewport: { width, height: 800 }, hasTouch, javaScriptEnabled });
  const page = await context.newPage();
  await page.goto(base);
  await page.evaluate(() => {
    const filler = document.createElement("div");
    filler.style.height = "4000px";
    document.querySelector("main").append(filler);
  });
  return page;
}

// Found by ARIA wiring, not by class: the menu button controls #nav-menu, the
// "Chương trình" toggle controls its list.
const button = '[aria-controls="nav-menu"]';
const menu = "#nav-menu";
const toggle = '[aria-controls^="nav-dropdown-list-"]';
const list = '[id^="nav-dropdown-list-"]';
const box = (page, selector) => page.locator(selector).boundingBox();
const settle = (page) => page.waitForTimeout(500);

for (const width of [390, 820]) {
  test(`at ${width} px the hamburger opens and closes the menu and locks scrolling`, { skip }, async () => {
    const page = await open({ width });
    assert.equal(await page.isVisible(menu), false, "menu collapsed");
    assert.equal(await page.getAttribute(button, "aria-expanded"), "false");

    await page.click(button);
    await settle(page);
    assert.equal(await page.isVisible(menu), true, "menu shown");
    assert.equal(await page.getAttribute(button, "aria-expanded"), "true");
    const header = await box(page, "header");
    const shown = await box(page, menu);
    assert.ok(Math.abs(shown.y - (header.y + header.height)) <= 1, "menu drops down right under the header");
    const navLink = page.locator(`${menu} a[href="/ve-chung-toi/"]`);
    assert.equal(await navLink.isVisible(), true, "links reachable");

    await page.mouse.move(width / 2, 700);
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => scrollY), 0, "page behind does not scroll");

    await page.click(button);
    await settle(page);
    assert.equal(await page.isVisible(menu), false, "menu closed");
    assert.equal(await page.getAttribute(button, "aria-expanded"), "false");

    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(200);
    assert.ok((await page.evaluate(() => scrollY)) > 0, "page scrolls again");
    await page.context().close();
  });
}

test("a menu opened on mobile is back in the header bar at desktop width", { skip }, async () => {
  const page = await open({ width: 390 });
  await page.click(button);
  await settle(page);
  await page.setViewportSize({ width: 1440, height: 800 });
  await settle(page);
  assert.equal(await page.getAttribute(button, "aria-expanded"), "false", "resizing closes it");
  assert.equal(await page.isVisible(button), false, "no hamburger on desktop");
  const header = await box(page, "header");
  const link = await box(page, `${menu} a[href="/ve-chung-toi/"]`);
  assert.ok(link && link.y >= header.y && link.y + link.height <= header.y + header.height, "links inline in the bar");
  assert.equal(await page.evaluate(() => document.documentElement.style.overflow), "", "scroll unlocked");
  await page.context().close();
});

test("the hamburger works from the keyboard and Esc closes the menu", { skip }, async () => {
  const page = await open({ width: 390 });
  await page.focus(button);
  await page.keyboard.press("Enter");
  await settle(page);
  assert.equal(await page.getAttribute(button, "aria-expanded"), "true");
  await page.keyboard.press("Escape");
  await settle(page);
  assert.equal(await page.getAttribute(button, "aria-expanded"), "false");
  assert.equal(await page.isVisible(menu), false);
  await page.context().close();
});

test("tapping outside the open menu closes it", { skip }, async () => {
  const page = await open({ width: 390, hasTouch: true });
  await page.tap(button);
  await settle(page);
  assert.equal(await page.isVisible(menu), true);
  await page.touchscreen.tap(195, 780); // below the menu, on the transparent overlay
  await settle(page);
  assert.equal(await page.isVisible(menu), false);
  await page.context().close();
});

test("on desktop the dropdown opens on hover and closes on leave", { skip }, async () => {
  const page = await open({ width: 1440 });
  assert.equal(await page.isVisible(list), false);
  assert.equal(await page.getAttribute(toggle, "aria-expanded"), "false");
  await page.hover(toggle);
  await settle(page);
  assert.equal(await page.isVisible(list), true);
  assert.equal(await page.getAttribute(toggle, "aria-expanded"), "true");
  await page.hover(`${list} a[href="/khoa-hoc/"]`);
  assert.equal(await page.isVisible(list), true, "stays open while moving into the list");
  await page.mouse.move(10, 600);
  await settle(page);
  assert.equal(await page.isVisible(list), false);
  assert.equal(await page.getAttribute(toggle, "aria-expanded"), "false");
  await page.context().close();
});

test("on desktop the dropdown opens on keyboard focus and Esc closes it", { skip }, async () => {
  const page = await open({ width: 1440 });
  await page.focus(`${menu} a[href="/ve-chung-toi/"]`);
  await page.keyboard.press("Tab");
  await settle(page);
  assert.equal(await page.isVisible(list), true, "opens when the toggle gets focus");
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute("href")), "/trai-he-toan-hoc-pima/");
  await page.keyboard.press("Escape");
  await settle(page);
  assert.equal(await page.isVisible(list), false);
  assert.equal(await page.evaluate(() => document.activeElement.matches('[aria-controls^="nav-dropdown-list-"]')), true, "focus back on toggle");
  await page.keyboard.press("Enter");
  await settle(page);
  assert.equal(await page.isVisible(list), true, "Enter reopens");
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  await settle(page);
  assert.equal(await page.isVisible(list), false, "closes when focus leaves");
  await page.context().close();
});

test("on touch the dropdown opens on tap and closes on outside tap", { skip }, async () => {
  const page = await open({ width: 390, hasTouch: true });
  await page.tap(button);
  await settle(page);
  await page.tap(toggle);
  await settle(page);
  assert.equal(await page.isVisible(`${list} a[href="/khoa-hoc/"]`), true);
  assert.equal(await page.getAttribute(toggle, "aria-expanded"), "true");
  await page.tap(toggle);
  await settle(page);
  assert.equal(await page.isVisible(list), false, "second tap closes");
  await page.context().close();

  const desk = await open({ width: 1024, hasTouch: true });
  await desk.tap(toggle);
  await settle(desk);
  assert.equal(await desk.isVisible(list), true, "tap opens on a touch desktop");
  await desk.tap("footer");
  await settle(desk);
  assert.equal(await desk.isVisible(list), false, "outside tap closes");
  await desk.context().close();
});

test("with JS off the desktop nav links are plain links", { skip }, async () => {
  const page = await open({ width: 1440, javaScriptEnabled: false });
  await page.click(`${menu} a[href="/ve-chung-toi/"]`, { noWaitAfter: true });
  await page.waitForURL(/\/ve-chung-toi\/$/);
  await page.context().close();
});

test("with JS off the dropdown links show on hover and focus", { skip }, async () => {
  const page = await open({ width: 1440, javaScriptEnabled: false });
  assert.equal(await page.isVisible(list), false);
  await page.hover(toggle);
  assert.equal(await page.isVisible(`${list} a[href="/khoa-hoc/"]`), true, "hover");
  await page.mouse.move(10, 600);
  await page.focus(toggle);
  assert.equal(await page.isVisible(`${list} a[href="/khoa-hoc/"]`), true, "focus");
  await page.context().close();
});
