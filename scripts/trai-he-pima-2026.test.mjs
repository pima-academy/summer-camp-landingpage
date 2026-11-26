// Checks the built trai-he-pima-2026 page (#37) against the spec's page rules.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const file = fileURLToPath(new URL("../dist/trai-he-pima-2026/index.html", import.meta.url));
const skip = existsSync(new URL("../dist/", import.meta.url)) ? false : "dist/ missing: run `npm run build` first";
const html = !skip && existsSync(file) ? readFileSync(file, "utf8") : "";

test("2026 page is built with camp chrome and its own title", { skip }, () => {
  assert.ok(html, "dist/trai-he-pima-2026/index.html exists");
  assert.match(html, /<title>Trại hè Toán học và Ứng dụng PiMA 2026<\/title>/);
  assert.doesNotMatch(html, /class="nav[ "]/, "camp chrome has no site nav");
  assert.match(html, /Công ty Cổ phần/, "camp footer");
});

test("2026 page loads no third-party script, stylesheet or font", { skip }, () => {
  const refs = [...html.matchAll(/<(?:script|link)[^>]*(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  const offsite = refs.filter((u) => /^(https?:)?\/\//.test(u) && !u.startsWith("https://pimavn.com/"));
  assert.deepEqual(offsite, []);
  assert.doesNotMatch(html, /webflow\.js|jquery|webfont|finsweet|fonts\.googleapis/i);
  assert.doesNotMatch(html, /data-w-id|data-wf-/);
});

test("every 2026 image goes through <Image> (no old path, width/height set)", { skip }, () => {
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  assert.ok(imgs.length >= 30, `found ${imgs.length} images`);
  for (const img of imgs) {
    assert.match(img, /src="\/_astro\/[^"]+\.(webp|svg)"/, img);
    assert.match(img, /\swidth="\d+"/, img);
    assert.match(img, /\sheight="\d+"/, img);
    assert.match(img, /\salt(="[^"]*")?[\s>]/, img);
  }
  assert.doesNotMatch(html, /["' ]images\/|\/site\//);
});

test("2026 page gets the 2025 fade-ups and the marquees", { skip }, () => {
  const fades = html.match(/data-animate="fade-up"/g) ?? [];
  // The 2025 IX2 map: 12 sections (CampMentors x2 included) + 6 cards (2026 has one info card).
  assert.equal(fades.length, 18);
  assert.equal((html.match(/data-marquee="y"/g) ?? []).length, 2, "header photo columns");
  assert.equal((html.match(/data-marquee="x"/g) ?? []).length, 1, "mentor logo row");
  assert.doesNotMatch(html, /style="[^"]*opacity:\s*0/);
});

test("2026 page uses the video lightbox and the one Facebook URL", { skip }, () => {
  assert.match(html, /data-video-lightbox-open[^>]*data-video-id="8DKLYsikxTs"|data-video-id="8DKLYsikxTs"[^>]*data-video-lightbox-open/);
  assert.match(html, /href="https:\/\/www\.facebook\.com\/pima\.academy\.vn"/);
  assert.doesNotMatch(html, /facebook\.com\/pima\.vn/);
});
