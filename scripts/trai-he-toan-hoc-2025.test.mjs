// Checks the built trai-he-toan-hoc-2025 page (#36) against the spec's page rules.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const pagePath = join(dist, "trai-he-toan-hoc-2025", "index.html");
const skip = existsSync(join(dist, "index.html")) ? false : "dist/ missing: run `npm run build` first";
const html = skip || !existsSync(pagePath) ? "" : readFileSync(pagePath, "utf8");

test("page is built with a specific title, a description and camp chrome", { skip }, () => {
  assert.ok(html, `${pagePath} exists`);
  assert.match(html, /<title>Tuyển sinh trại hè toán học PiMA 2025<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]{50,}"/);
  assert.doesNotMatch(html, /class="nav[ "]/, "camp chrome has no site nav");
  assert.match(html, /Công ty Cổ phần/, "camp footer");
});

test("the 19 old fade-ups are data-animate, with no inline opacity:0 left", { skip }, () => {
  const count = html.match(/data-animate="fade-up"/g)?.length ?? 0;
  assert.equal(count, 19);
  assert.doesNotMatch(html, /style="[^"]*opacity:\s*0/);
  assert.doesNotMatch(html, /data-w-id|data-wf-|data-record-id|data-copilot/);
});

test("header photo columns and mentor logo row are marquees", { skip }, () => {
  assert.equal(html.match(/data-marquee="y"/g)?.length ?? 0, 2);
  assert.equal(html.match(/data-marquee="x"/g)?.length ?? 0, 1);
  assert.match(html, /header76_image-list-left[^"]*marquee/);
  assert.match(html, /header76_image-list-right[^"]*marquee/);
  assert.match(html, /logo3_component[^"]*marquee/);
});

test("video lightbox opens video 8DKLYsikxTs", { skip }, () => {
  assert.match(html, /data-video-id="8DKLYsikxTs"/);
  assert.match(html, /<dialog[^>]*data-video-lightbox/);
  assert.doesNotMatch(html, /w-json/);
});

test("every image is processed by <Image> and has width and height", { skip }, () => {
  const imgs = html.match(/<img\b[^>]*>/g) ?? [];
  assert.ok(imgs.length > 30, `found ${imgs.length} images`);
  for (const img of imgs) {
    assert.match(img, /src="\/_astro\//, img);
    assert.match(img, /\bwidth="\d+"/, img);
    assert.match(img, /\bheight="\d+"/, img);
  }
  assert.doesNotMatch(html, /["(]\/?images\//, "no path into the old images/ folder");
});

test("Facebook fanpage link uses pima.academy.vn; no third-party script", { skip }, () => {
  assert.match(html, /href="https:\/\/www\.facebook\.com\/pima\.academy\.vn\/?"/);
  assert.doesNotMatch(html, /facebook\.com\/pima\.vn/);
  assert.doesNotMatch(html, /<script[^>]*src="https?:/);
  assert.doesNotMatch(html, /<link[^>]*href="https?:\/\/(?!pimavn\.com)[^"]*"[^>]*rel="stylesheet"/);
});
