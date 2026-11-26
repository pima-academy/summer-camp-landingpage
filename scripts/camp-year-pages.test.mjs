// Checks the built trai-he-toan-hoc-2025 (#36) and trai-he-pima-2026 (#37) pages against
// the spec's page rules. Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, readBuilt } from "./test-lib.mjs";

const pages = [
  // 2025: the 19 old IX2 fade-ups.
  { slug: "trai-he-toan-hoc-2025", title: "Tuyển sinh trại hè toán học PiMA 2025", fadeUps: 19 },
  // 2026: the 2025 IX2 map, 12 sections (CampMentors x2 included) + 6 cards (one info card).
  { slug: "trai-he-pima-2026", title: "Trại hè Toán học và Ứng dụng PiMA 2026", fadeUps: 18 },
];

for (const { slug, title, fadeUps } of pages) {
  const html = readBuilt(`${slug}/index.html`);

  test(`${slug}: built with its own title, a description and camp chrome`, { skip }, () => {
    assert.ok(html, `dist/${slug}/index.html exists`);
    assert.ok(html.includes(`<title>${title}</title>`), `title "${title}"`);
    assert.match(html, /<meta name="description" content="[^"]{50,}"/);
    assert.doesNotMatch(html, /class="nav[ "]/, "camp chrome has no site nav");
    assert.match(html, /Công ty Cổ phần/, "camp footer");
  });

  test(`${slug}: the old fade-ups are data-animate, with no inline opacity:0 or Webflow attributes left`, { skip }, () => {
    assert.equal(html.match(/data-animate="fade-up"/g)?.length ?? 0, fadeUps);
    assert.doesNotMatch(html, /style="[^"]*opacity:\s*0/);
    assert.doesNotMatch(html, /data-w-id|data-wf-|data-record-id|data-copilot/);
  });

  test(`${slug}: header photo columns and mentor logo row are marquees`, { skip }, () => {
    assert.equal(html.match(/data-marquee="y"/g)?.length ?? 0, 2, "header photo columns");
    assert.equal(html.match(/data-marquee="x"/g)?.length ?? 0, 1, "mentor logo row");
    assert.match(html, /header76_image-list-left[^"]*marquee/);
    assert.match(html, /header76_image-list-right[^"]*marquee/);
    assert.match(html, /logo3_component[^"]*marquee/);
  });

  test(`${slug}: video lightbox opens video 8DKLYsikxTs`, { skip }, () => {
    assert.match(
      html,
      /data-video-lightbox-open[^>]*data-video-id="8DKLYsikxTs"|data-video-id="8DKLYsikxTs"[^>]*data-video-lightbox-open/,
    );
    assert.match(html, /<dialog[^>]*data-video-lightbox/);
    assert.doesNotMatch(html, /w-json/);
  });

  test(`${slug}: every image goes through <Image> (no old path, width/height/alt set)`, { skip }, () => {
    const imgs = html.match(/<img\b[^>]*>/g) ?? [];
    assert.ok(imgs.length >= 30, `found ${imgs.length} images`);
    for (const img of imgs) {
      assert.match(img, /src="\/_astro\/[^"]+\.(webp|svg)"/, img);
      assert.match(img, /\swidth="\d+"/, img);
      assert.match(img, /\sheight="\d+"/, img);
      assert.match(img, /\salt(="[^"]*")?[\s>]/, img);
    }
    assert.doesNotMatch(html, /["(]\/?images\//, "no path into the old images/ folder");
    assert.doesNotMatch(html, /["' ]images\/|\/site\//);
  });

  test(`${slug}: Facebook fanpage is pima.academy.vn; no third-party script, stylesheet or font`, { skip }, () => {
    assert.match(html, /href="https:\/\/www\.facebook\.com\/pima\.academy\.vn"/);
    assert.doesNotMatch(html, /facebook\.com\/pima\.vn/);
    const refs = [...html.matchAll(/<(?:script|link)[^>]*(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
    const offsite = refs.filter((u) => /^(https?:)?\/\//.test(u) && !u.startsWith("https://pimavn.com/"));
    assert.deepEqual(offsite, []);
    assert.doesNotMatch(html, /<script[^>]*src="https?:/);
    assert.doesNotMatch(html, /<link[^>]*href="https?:\/\/(?!pimavn\.com)[^"]*"[^>]*rel="stylesheet"/);
    assert.doesNotMatch(html, /webflow\.js|jquery|webfont|finsweet|fonts\.googleapis/i);
  });
}
