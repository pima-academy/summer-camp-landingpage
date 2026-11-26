// Drives the ve-chung-toi Accordion ("Xuất phát điểm / Tầm nhìn / Sứ mệnh") in headless
// Chromium: one panel open at a time, opened by its button, wide on desktop and the only
// expanded body below 992 px. Finds everything by role, name and aria-expanded.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

const TITLES = ["Xuất phát điểm", "Tầm nhìn", "Sứ mệnh"];

let server, origin, browser;

before(async () => {
  if (skip) return;
  server = await serveDist();
  origin = server.origin;
  const { chromium } = await import("playwright");
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  server?.close();
});

/** Opens /ve-chung-toi/ at `width` with motion reduced (no width/height transitions). */
async function open(width) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.route("**/*", (route) => (route.request().url().startsWith(origin) ? route.continue() : route.abort()));
  await page.goto(origin + "/ve-chung-toi/", { waitUntil: "load" });
  return page;
}

const buttons = (page) => TITLES.map((name) => page.getByRole("button", { name, exact: true }));
/** The panel body a button controls. */
const bodyOf = (page, button) => button.getAttribute("aria-controls").then((id) => page.locator(`#${id}`));
const expanded = (page) => Promise.all(buttons(page).map((b) => b.getAttribute("aria-expanded")));

test("the first panel starts open; a closed panel's button opens it and closes the others", { skip }, async () => {
  const page = await open(1440);
  const [first, second, third] = buttons(page);
  assert.deepEqual(await expanded(page), ["true", "false", "false"], "on load");

  await second.click();
  assert.deepEqual(await expanded(page), ["false", "true", "false"], "after opening Tầm nhìn");
  assert.equal(await (await bodyOf(page, second)).evaluate((el) => el.inert), false, "open body is reachable");
  assert.equal(await (await bodyOf(page, first)).evaluate((el) => el.inert), true, "closed body is inert");

  await second.click();
  assert.deepEqual(await expanded(page), ["false", "true", "false"], "clicking the open panel keeps it open");

  await third.click();
  assert.deepEqual(await expanded(page), ["false", "false", "true"], "after opening Sứ mệnh");
  await page.context().close();
});

test("desktop: the open panel takes the width, closed panels stay narrow", { skip }, async () => {
  const page = await open(1440);
  const [, second] = buttons(page);
  await second.click();
  // The panel is the button's parent; closed panels are 5rem (80 px) wide.
  const widths = await Promise.all(
    buttons(page).map((b) => b.locator("xpath=..").evaluate((el) => el.getBoundingClientRect().width)),
  );
  assert.ok(widths[1] > 500, `open panel is wide: ${widths}`);
  assert.equal(Math.round(widths[0]), 80);
  assert.equal(Math.round(widths[2]), 80);
  await page.context().close();
});

test("below 992 px only the open panel's body has height", { skip }, async () => {
  const page = await open(390);
  const [first, , third] = buttons(page);
  const heights = () =>
    Promise.all(buttons(page).map(async (b) => (await bodyOf(page, b)).evaluate((el) => el.getBoundingClientRect().height)));
  let h = await heights();
  assert.ok(h[0] > 100 && h[1] === 0 && h[2] === 0, `on load: ${h}`);

  await third.click();
  h = await heights();
  assert.ok(h[0] === 0 && h[1] === 0 && h[2] > 100, `after opening Sứ mệnh: ${h}`);
  assert.equal(await first.getAttribute("aria-expanded"), "false");
  await page.context().close();
});
