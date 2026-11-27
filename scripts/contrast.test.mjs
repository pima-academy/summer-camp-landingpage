// Text contrast (spec #56, "Readability beats the guidelines"): axe-core's `color-contrast` rule
// (WCAG AA: 4.5:1, 3:1 for large text) over every brand-aligned published page, at 390 and
// 1440 px, plus the open "Chương trình" nav dropdown, which is hidden on page load, and 3:1 for
// every icon that is a control's only label (hamburger, caret, slider arrows). No known
// failures are allowed.
//
// Text axe cannot decide (over an image, a gradient or a pseudo-element: its "incomplete"
// results) is listed as a test diagnostic and checked by eye.
//
// Adding a page: add its path to PAGES. Needs a fresh `npm run build`; skipped when dist/ is missing (fails in CI).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

const CAMP_YEARS = [2016, 2017, 2018, 2019, 2021, 2023, 2024, 2025, 2026];
const PAGES = [
  "/", "/ve-chung-toi/", "/khoa-hoc/", "/trai-he-toan-hoc-pima/", "/lien-he/", "/404.html",
  ...CAMP_YEARS.map((year) => `/trai-he-toan-hoc-pima/${year}/`),
  // The blog list, a post page with an author and a cover, one with captioned figures and one
  // with formulas, display and inline (KaTeX).
  "/blog/", "/blog/phat-hien-gian-lan/", "/blog/plato-2/", "/blog/softmax/",
];
const WIDTHS = [390, 1440];

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

/**
 * Opens `path` at `width` with motion reduced (so no section is caught half-faded in), offline
 * apart from the local server, scrolled through once so lazy images load.
 */
async function open(path, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.route("**/*", (route) =>
    route.request().url().startsWith(server.origin) ? route.continue() : route.abort(),
  );
  await page.goto(server.origin + path, { waitUntil: "load" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
    }
    window.scrollTo(0, 0);
  });
  await page.addScriptTag({ content: axeSource });
  return page;
}

/** axe's color-contrast results for the page (or `include`, a selector) as it stands. */
const contrast = (page, include) =>
  page.evaluate(async (include) => {
    const { violations, incomplete } = await window.axe.run(include ? { include: [include] } : document, {
      runOnly: { type: "rule", values: ["color-contrast"] },
    });
    const list = (results) =>
      results.flatMap((r) =>
        r.nodes.map((n) => {
          const d = n.any[0]?.data ?? {};
          const pair = d.fgColor ? `${d.fgColor} on ${d.bgColor} = ${d.contrastRatio}:1 (needs ${d.expectedContrastRatio})` : d.messageKey ?? "";
          return `${n.target.join(" ")}: ${pair}`;
        }),
      );
    return { violations: list(violations), incomplete: list(incomplete) };
  }, include);

for (const path of PAGES) {
  for (const width of WIDTHS) {
    test(`every text pair on ${path} at ${width} px passes WCAG AA`, { skip }, async (t) => {
      const page = await open(path, width);
      const { violations, incomplete } = await contrast(page);
      for (const line of incomplete) t.diagnostic(`check by eye: ${line}`);
      assert.deepEqual(violations, [], `failing pairs on ${path} at ${width} px`);
      await page.context().close();
    });
  }
}

test("every text pair of the open nav dropdown passes WCAG AA", { skip }, async () => {
  for (const width of WIDTHS) {
    const page = await open("/", width);
    if (width < 992) await page.click('[aria-controls="nav-menu"]');
    await page.click('[aria-controls^="nav-dropdown-list-"]');
    await page.waitForTimeout(500);
    const { violations } = await contrast(page, "header");
    assert.deepEqual(violations, [], `failing pairs in the nav at ${width} px`);
    await page.context().close();
  }
});

// Icons that are a control's only label (docs/brand.md, "Icons"): 3:1 against the background
// behind them (WCAG 1.4.11; axe checks text only). Selectors: [path, width, selector].
const CONTROL_ICONS = [
  ["/", 390, '[aria-controls="nav-menu"] svg'],
  ["/", 1440, '[aria-controls^="nav-dropdown-list-"] svg'],
  ["/", 1440, "[data-slider] [role=button] svg"],
  ["/", 390, "[data-slider] [role=button] svg"],
];

test("every icon that is a control's only label has 3:1 against its background", { skip }, async () => {
  for (const [path, width, selector] of CONTROL_ICONS) {
    const page = await open(path, width);
    const pairs = await page.$$eval(selector, (icons) => {
      /** [r, g, b, a] (0–1) of a computed colour: rgb()/rgba() or color(srgb …). */
      const parse = (c) => {
        const n = c.match(/[\d.]+/g).map(Number);
        const srgb = c.startsWith("color(");
        const [r, g, b] = srgb ? n.slice(0, 3) : n.slice(0, 3).map((v) => v / 255);
        return [r, g, b, n[3] ?? 1];
      };
      const lum = ([r, g, b]) =>
        [r, g, b]
          .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
          .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
      return icons
        .filter((icon) => icon.getBoundingClientRect().width > 0)
        .map((icon) => {
          let bg = null;
          for (let e = icon; e && !bg; e = e.parentElement) {
            const c = parse(getComputedStyle(e).backgroundColor);
            if (c[3] > 0) bg = c;
          }
          bg ??= [1, 1, 1, 1];
          const fg = parse(getComputedStyle(icon).color);
          const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
          return { icon: icon.dataset.icon, fg: getComputedStyle(icon).color, ratio: (hi + 0.05) / (lo + 0.05) };
        });
    });
    assert.ok(pairs.length > 0, `${path} at ${width} px: no ${selector}`);
    for (const p of pairs) {
      assert.ok(p.ratio >= 3, `${path} at ${width} px: ${p.icon} (${p.fg}) is ${p.ratio.toFixed(2)}:1`);
    }
    await page.context().close();
  }
});

// Section tones (src/components/Section.astro): a card takes a tone with data-tone wherever it
// sits, so a light card inside a dark-green section has the roles it has on the page itself.
const ROLES = [
  "color",
  "--color-text",
  "--color-text-heading",
  "--color-text-accent",
  "--color-text-muted",
  "--color-link",
  "--color-link-hover",
  "--color-icon-control",
  "--color-icon-circle",
  "--color-icon-circle-glyph",
  "--color-focus-ring",
];

test("a light-tone card inside a dark-green section takes the light text roles", { skip }, async () => {
  const page = await open("/", 1440);
  const found = await page.evaluate((roles) => {
    const read = (el) => {
      const s = getComputedStyle(el);
      return Object.fromEntries(roles.map((r) => [r, (r === "color" ? s.color : s.getPropertyValue(r)).trim()]));
    };
    const card = (tone, parent) => {
      const el = document.createElement("div");
      el.dataset.tone = tone;
      parent.append(el);
      return el;
    };
    const dark = card("dark-green", document.body);
    return Object.fromEntries(
      ["white", "surface", "pale-lime"].map((tone) => [tone, { alone: read(card(tone, document.body)), inDark: read(card(tone, dark)) }]),
    );
  }, ROLES);
  for (const [tone, { alone, inDark }] of Object.entries(found)) {
    assert.deepEqual(inDark, alone, `${tone} card inside dark-green`);
  }
  await page.context().close();
});
