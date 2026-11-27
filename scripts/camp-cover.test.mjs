// Checks the camp archive page's cover (src/sections/camp-archive/Cover.astro) in a
// browser: a year held at several campuses shows every campus's cover at once, each with its own
// date block; no cover is cropped. Needs a fresh `npm run build`;
// skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

/** A year held at several campuses. */
const PATH = "/trai-he-toan-hoc-pima/2025/";

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

test("a multi-campus year shows every campus cover, each with its own date block", { skip }, async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(server.origin + PATH, { waitUntil: "load" });
  const campuses = await page.$$eval(".bookcover .campus", (els) =>
    els.map((el) => ({ img: el.querySelectorAll("img").length, campus: el.querySelector("dt")?.textContent, days: el.querySelector(".days")?.textContent })),
  );
  assert.deepEqual(
    campuses.map((c) => c.campus),
    ["TP.HCM", "Hà Nội"],
  );
  for (const c of campuses) {
    assert.equal(c.img, 1, `${c.campus}: one cover`);
    assert.ok(c.days, `${c.campus}: its dates`);
  }
  await page.close();
});

test("no cover is cropped: each frame takes its photo's aspect ratio, at every width", { skip }, async () => {
  const years = [2016, 2017, 2018, 2019, 2021, 2023, 2024, 2025, 2026];
  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ];
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    for (const year of years) {
      await page.goto(server.origin + `/trai-he-toan-hoc-pima/${year}/`, { waitUntil: "load" });
      const covers = await page.$$eval(".bookcover .img", (imgs) =>
        Promise.all(
          imgs.map(async (img) => {
            await img.decode();
            const r = img.getBoundingClientRect();
            return { natural: img.naturalWidth / img.naturalHeight, shown: r.width / r.height };
          }),
        ),
      );
      for (const { natural, shown } of covers) {
        assert.ok(Math.abs(shown / natural - 1) < 0.01, `${year}, ${viewport.width} px: frame ${shown.toFixed(3)} vs photo ${natural.toFixed(3)}`);
      }
    }
    await context.close();
  }
});
