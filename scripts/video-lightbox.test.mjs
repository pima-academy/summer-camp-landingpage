// Checks VideoLightbox in a real browser on every built page that uses it.
// Needs a fresh `npm run build`; skipped when no page in dist/ has a lightbox.
// YouTube is never contacted: every request off localhost is aborted and logged.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { builtHtmlFiles, dist, serveDist } from "./test-lib.mjs";

const pages = builtHtmlFiles().filter((f) => readFileSync(f, "utf8").includes("data-video-lightbox"));
const skip = pages.length ? false : "no built page uses VideoLightbox: run `npm run build` first";

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

if (skip) test("VideoLightbox on built pages", { skip }, () => {});

const urlOf =(file) => "/" + relative(dist, file).replace(/index\.html$/, "");

for (const file of pages) {
  const path = urlOf(file);

  test(`${path}: the built HTML has the thumbnail and an empty dialog, no YouTube iframe`, () => {
    const html = readFileSync(file, "utf8");
    assert.doesNotMatch(html, /<iframe/);
    assert.match(html, /<a [^>]*href="https:\/\/www\.youtube\.com\/watch\?v=[\w-]+"[^>]*data-video-lightbox-open/);
    assert.match(html, /<dialog [^>]*data-video-lightbox/);
  });

  test(`${path}: the image-only thumbnail link has an accessible name`, () => {
    const html = readFileSync(file, "utf8");
    const link = html.match(/<a [^>]*data-video-lightbox-open[^>]*>([\s\S]*?)<\/a>/);
    assert.ok(link, "thumbnail link not found");
    const label = link[0].match(/\saria-label="([^"]+)"/)?.[1] ?? link[1].match(/\salt="([^"]+)"/)?.[1];
    assert.ok(label?.trim(), "the link needs an aria-label (or its image a non-empty alt)");
  });

  test(`${path}: opens on click, closes on Esc / x / backdrop, video removed, focus returns`, { skip }, async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const offsite = [];
    await page.route("**/*", (route) => {
      const u = route.request().url();
      if (u.startsWith(origin)) return route.continue();
      offsite.push(u);
      return route.abort();
    });
    await page.goto(origin + path, { waitUntil: "load" });
    await page.waitForTimeout(300);
    assert.deepEqual(offsite, [], "no off-site request before the click");

    const thumb = page.locator("[data-video-lightbox-open]").first();
    const dialog = page.locator("dialog[data-video-lightbox]").first();
    const iframe = dialog.locator("iframe");
    const videoId = (await thumb.getAttribute("href")).split("v=")[1];

    const open = async () => {
      await thumb.click();
      await page.waitForFunction(() => document.querySelector("dialog[data-video-lightbox]")?.open);
      assert.equal(await iframe.count(), 1);
      assert.ok(
        (await iframe.getAttribute("src")).startsWith(`https://www.youtube-nocookie.com/embed/${videoId}`),
        "iframe points at youtube-nocookie",
      );
      assert.ok(page.url().endsWith(path), "the link click did not navigate");
    };
    const assertClosed = async (how) => {
      // The `close` event fires a task after `open` turns false.
      await page.waitForFunction(() => {
        const d = document.querySelector("dialog[data-video-lightbox]");
        return d && !d.open && !d.querySelector("iframe");
      }, null, { timeout: 2000 }).catch(() => {});
      assert.equal(await dialog.evaluate((d) => d.open), false, `dialog closed after ${how}`);
      assert.equal(await iframe.count(), 0, `iframe removed after ${how}`);
      assert.equal(await thumb.evaluate((el) => el === document.activeElement), true, `focus back on thumbnail after ${how}`);
    };

    await open();
    assert.ok(offsite.some((u) => u.includes("youtube-nocookie.com")), "video requested on open");
    await page.keyboard.press("Escape");
    await assertClosed("Esc");

    await open();
    await dialog.getByRole("button").click();
    await assertClosed("x");

    await open();
    await page.mouse.click(20, 880); // dark backdrop, bottom-left corner
    await assertClosed("backdrop click");

    await open();
    const box = await iframe.boundingBox();
    assert.ok(Math.abs(box.width / box.height - 16 / 9) < 0.02, "16:9 frame");
    assert.ok(Math.abs(box.x + box.width / 2 - 720) < 2 && Math.abs(box.y + box.height / 2 - 450) < 2, "frame centred");
    await page.close();
  });
}
