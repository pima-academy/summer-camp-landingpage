// Drives every Slider on the built pages (INSTANCES) in headless
// Chromium: arrows, dots, swipe, keyboard, autoplay, wrap and reduced motion.
// slider-step.test.mjs covers the stepping maths; this covers the wiring.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

// Every slider on the pages, from its source.
const INSTANCES = [
  { path: "/ve-chung-toi/", name: "Các chuyên gia đồng hành", autoplay: 6000, infinite: true },
  { path: "/trai-he-toan-hoc-pima/", name: "Ảnh trại hè toán học", autoplay: 6000, infinite: false },
  { path: "/", name: "Báo chí nói về PiMA", autoplay: 5000, infinite: true },
];
const PAGES = [...new Set(INSTANCES.map((i) => i.path))];

// ---------------------------------------------------------------------------
// Markup helpers: the only place that knows how a slider is built. The Slider
// refactor (#64) moved them from Webflow classes to roles, names and ARIA state.

/** Every slider on the page. */
const sliders = (page) => page.locator("[data-slider]");
/** The slider with this accessible name. */
const sliderNamed = (page, name) => page.getByRole("region", { name, exact: true });
/** The slides: groups named "k / n"; every slide but the shown one is aria-hidden. */
const slidesOf = (slider) => slider.getByRole("group", { name: /^\d+ \/ \d+$/, includeHidden: true });
const maskOf = (slider) => slidesOf(slider).first().locator("xpath=..");
const prevArrow = (slider) => slider.getByRole("button", { name: "Mục trước", exact: true });
const nextArrow = (slider) => slider.getByRole("button", { name: "Mục tiếp theo", exact: true });
const dotsOf = (slider) => slider.getByRole("button", { name: /^Hiện mục \d+ \/ \d+$/ });
/** Index of the dot marked current, or -1. */
const currentDot = (slider) =>
  dotsOf(slider).evaluateAll((dots) => dots.findIndex((d) => d.getAttribute("aria-current") === "true"));

// ---------------------------------------------------------------------------

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

/**
 * Opens a page at 1440 px with every off-site request aborted. With `fakeClock`
 * the page's timers run only on `page.clock.runFor`: clock.install() alone leaves
 * the fake clock flowing in real time, so a slow load would already eat into the
 * autoplay delay before the test starts counting. Pausing it before `goto` makes
 * the page scripts start on a stopped clock.
 */
async function open(path, { reducedMotion = "no-preference", fakeClock = false, hasTouch = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion, hasTouch });
  const page = await context.newPage();
  await page.route("**/*", (route) => (route.request().url().startsWith(origin) ? route.continue() : route.abort()));
  if (fakeClock) {
    const now = Date.now();
    await page.clock.install({ time: now });
    await page.clock.pauseAt(now);
  }
  await page.goto(origin + path, { waitUntil: "load" });
  return page;
}

/** Retries `check` (which throws on failure) until it passes or `ms` runs out. */
async function eventually(check, ms = 2000) {
  const end = Date.now() + ms;
  for (;;) {
    try {
      return await check();
    } catch (e) {
      if (Date.now() > end) throw e;
      await new Promise((ok) => setTimeout(ok, 50));
    }
  }
}

/** Index of the slide whose left edge sits on the mask's (-1 while moving or none). */
const shownSlide = (slider) =>
  slidesOf(slider).evaluateAll((slides) => {
    const mask = slides[0].parentElement.getBoundingClientRect();
    return slides.findIndex((s) => Math.abs(s.getBoundingClientRect().left - mask.left) < 1);
  });

/** Waits until slide `k` is shown and its dot is the current one. */
async function expectAt(slider, k, why) {
  await eventually(async () => {
    assert.equal(await currentDot(slider), k, `${why}: current dot`);
    assert.equal(await shownSlide(slider), k, `${why}: shown slide`);
  });
}

/**
 * Where the first slide is coming in from, read while it moves:
 * "right" for a wrap (next slide comes in as usual), "left" for a rewind.
 */
const firstSlideComesFrom = (slider) =>
  slidesOf(slider).evaluateAll((slides) => {
    const mask = slides[0].parentElement.getBoundingClientRect();
    const dx = slides[0].getBoundingClientRect().left - mask.left;
    return dx > 1 ? "right" : dx < -1 ? "left" : "in place";
  });

test("lists every slider on each page", { skip }, async () => {
  for (const path of PAGES) {
    const page = await open(path);
    const names = await sliders(page).evaluateAll((all) => all.map((s) => s.getAttribute("aria-label")));
    const expected = INSTANCES.filter((i) => i.path === path).map((i) => i.name);
    assert.deepEqual(names, expected, path);
    await page.context().close();
  }
});

for (const { path, name, infinite } of INSTANCES) {
  const where = `${path} "${name}"`;

  test(`${where}: arrows step one slide, dots jump and the current dot is marked`, { skip }, async () => {
    const page = await open(path);
    const slider = sliderNamed(page, name);
    const n = await slidesOf(slider).count();
    assert.ok(n >= 3, "at least three slides");
    assert.equal(await dotsOf(slider).count(), n, "one dot per slide");
    await expectAt(slider, 0, "on load");

    await nextArrow(slider).click();
    await expectAt(slider, 1, "next");
    await nextArrow(slider).click();
    await expectAt(slider, 2, "next again");
    await prevArrow(slider).click();
    await expectAt(slider, 1, "previous");

    await dotsOf(slider).nth(n - 1).click();
    await expectAt(slider, n - 1, "last dot");
    await dotsOf(slider).nth(0).click();
    await expectAt(slider, 0, "first dot");

    // Past the last slide: an infinite slider carries on left, the others rewind.
    await dotsOf(slider).nth(n - 1).click();
    await expectAt(slider, n - 1, "last dot");
    await nextArrow(slider).click();
    assert.equal(await firstSlideComesFrom(slider), infinite ? "right" : "left", "next on the last slide");
    await expectAt(slider, 0, "next on the last slide");
    await page.context().close();
  });
}

for (const { path, name, autoplay, infinite } of INSTANCES.filter((i) => i.autoplay)) {
  const wrap = infinite ? "wraps" : "rewinds";
  test(`${path} "${name}": autoplay steps every ${autoplay} ms and ${wrap} after the last slide`, { skip }, async () => {
    const page = await open(path, { fakeClock: true });
    const slider = sliderNamed(page, name);
    const n = await slidesOf(slider).count();

    await page.clock.runFor(autoplay - 100);
    await expectAt(slider, 0, "before the delay");
    await page.clock.runFor(100);
    await expectAt(slider, 1, "after one delay");
    for (let k = 2; k < n; k++) {
      await page.clock.runFor(autoplay);
      await expectAt(slider, k, `after ${k} delays`);
    }
    await page.clock.runFor(autoplay);
    assert.equal(await firstSlideComesFrom(slider), infinite ? "right" : "left", "autoplay past the last slide");
    await expectAt(slider, 0, "autoplay past the last slide");
    await page.context().close();
  });
}

for (const path of PAGES) {
  test(`${path}: with prefers-reduced-motion: reduce nothing autoplays`, { skip }, async () => {
    const page = await open(path, { reducedMotion: "reduce", fakeClock: true });
    await page.clock.runFor(3 * Math.max(...INSTANCES.map((i) => i.autoplay ?? 0)));
    for (const { name } of INSTANCES.filter((i) => i.path === path)) {
      await expectAt(sliderNamed(page, name), 0, `"${name}"`);
    }
    await page.context().close();
  });
}

/** A one-finger horizontal drag of `dx` px across the middle of the slider's mask. */
async function swipe(page, slider, dx) {
  await maskOf(slider).scrollIntoViewIfNeeded();
  const box = await maskOf(slider).boundingBox();
  const y = Math.round(box.y + box.height / 2);
  const x0 = Math.round(box.x + box.width / 2 - dx / 2);
  const cdp = await page.context().newCDPSession(page);
  const touch = (type, x) =>
    cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });
  await touch("touchStart", x0);
  for (let i = 1; i <= 5; i++) await touch("touchMove", x0 + (dx * i) / 5);
  await touch("touchEnd");
  await cdp.detach();
}

for (const { path, name } of INSTANCES) {
  test(`${path} "${name}": a touch swipe moves one slide`, { skip }, async () => {
    const page = await open(path, { hasTouch: true });
    const slider = sliderNamed(page, name);
    await swipe(page, slider, -200);
    await expectAt(slider, 1, "swipe left");
    await swipe(page, slider, -200);
    await expectAt(slider, 2, "swipe left again");
    await swipe(page, slider, 200);
    await expectAt(slider, 1, "swipe right");
    await page.context().close();
  });
}

/** Focuses the last focusable element before the slider, so the next Tab enters it. */
const focusBefore = (slider) =>
  slider.evaluate((root) => {
    const all = [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')];
    const before = all.filter((el) => root.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING);
    for (const el of before.reverse()) {
      el.focus();
      if (document.activeElement === el) return;
    }
    throw new Error("nothing focusable before the slider");
  });

/** Presses Tab (at most `max` times) until `target` has focus. */
async function tabTo(page, target, what, max = 10) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((el) => el === document.activeElement)) return;
  }
  assert.fail(`${what} not reached with Tab`);
}

for (const { path, name } of INSTANCES) {
  test(`${path} "${name}": arrows and dots are reachable with Tab and work with Enter and Space`, { skip }, async () => {
    const page = await open(path);
    const slider = sliderNamed(page, name);
    await focusBefore(slider);

    await tabTo(page, prevArrow(slider), "previous arrow");
    await tabTo(page, nextArrow(slider), "next arrow", 1);
    await page.keyboard.press("Enter");
    await expectAt(slider, 1, "Enter on next");
    await page.keyboard.press(" ");
    await expectAt(slider, 2, "Space on next");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Enter");
    await expectAt(slider, 1, "Enter on previous");

    await page.keyboard.press("Tab");
    await tabTo(page, dotsOf(slider).nth(1), "current dot", 1);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expectAt(slider, 2, "Enter on the next dot");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press(" ");
    await expectAt(slider, 0, "Space on the first dot");
    await page.context().close();
  });
}
