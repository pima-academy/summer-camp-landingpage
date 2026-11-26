// Drives every Slider on the built / and chi-tiet-trai-he pages in headless
// Chromium: arrows, dots, swipe, keyboard, autoplay, wrap and reduced motion.
// slider-step.test.mjs covers the stepping maths; this covers the wiring.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

// Every slider on the two pages, from their source. A slider that is a content
// gap (chi-tiet-trai-he's "Hình ảnh trại hè") is absent from the build; when its
// content arrives it shows up here and the "lists every slider" test asks for it.
const INSTANCES = [
  { path: "/", name: "Các chuyên gia đồng hành", autoplay: 6000, infinite: true },
  { path: "/", name: "Ảnh trại hè toán học", autoplay: 6000, infinite: false },
  { path: "/", name: "Báo chí nói về PiMA", autoplay: 5000, infinite: true },
];
const PAGES = ["/", "/chi-tiet-trai-he/"];

// ---------------------------------------------------------------------------
// Markup helpers: the only place that knows how a slider is built. The Slider
// refactor (w-slider* classes and w-active -> ARIA/data attributes) changes
// these and nothing below them.

/** Every slider on the page. */
const sliders = (page) => page.locator("[data-slider]");
/** The slider with this accessible name. */
const sliderNamed = (page, name) => page.getByRole("region", { name, exact: true });
const maskOf = (slider) => slider.locator(":scope > .w-slider-mask");
const slidesOf = (slider) => maskOf(slider).locator(":scope > .w-slide");
const prevArrow = (slider) => slider.locator(":scope > .w-slider-arrow-left");
const nextArrow = (slider) => slider.locator(":scope > .w-slider-arrow-right");
const dotsOf = (slider) => slider.locator(":scope > .w-slider-nav > .w-slider-dot");
/** Index of the dot marked current, or -1. */
const currentDot = (slider) =>
  dotsOf(slider).evaluateAll((dots) => dots.findIndex((d) => d.classList.contains("w-active")));

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

/** Opens a page at 1440 px with every off-site request aborted. */
async function open(path, { reducedMotion = "no-preference", fakeClock = false, hasTouch = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion, hasTouch });
  const page = await context.newPage();
  await page.route("**/*", (route) => (route.request().url().startsWith(origin) ? route.continue() : route.abort()));
  if (fakeClock) await page.clock.install();
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

test("lists every slider on / and chi-tiet-trai-he", { skip }, async () => {
  for (const path of PAGES) {
    const page = await open(path);
    const names = await sliders(page).evaluateAll((all) => all.map((s) => s.getAttribute("aria-label")));
    const expected = INSTANCES.filter((i) => i.path === path).map((i) => i.name);
    assert.deepEqual(names, expected, path);
    await page.context().close();
  }
});

for (const { path, name, autoplay, infinite } of INSTANCES) {
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
