// Checks the built khoa-hoc page (/khoa-hoc/): sections in the old order, the CMS course
// list hidden as a content gap, no stale address, images only from the Astro pipeline.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, mainOf, readBuilt } from "./test-lib.mjs";

const html = readBuilt("khoa-hoc/index.html");
const main = mainOf(html);

test("khoa-hoc has a specific title, description and canonical", { skip }, () => {
  assert.match(html, /<title>Khóa học Toán ứng dụng - PiMA Academy<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]{50,}"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/pimavn\.com\/khoa-hoc\/">/);
});

test("khoa-hoc renders header, intro, trust bar and contact form in the old order", { skip }, () => {
  const order = [
    'data-section="page-header"',
    ">Khóa học</h1>",
    'class="section_header64"',
    "Khóa học Toán ứng dụng tại PiMA được thiết kế",
    'data-section="trust-bar"',
    'id="contact-form"',
  ].map((s) => main.indexOf(s));
  assert.ok(order.every((i) => i >= 0), `all sections present: ${order}`);
  assert.deepEqual([...order].sort((a, b) => a - b), order, "sections in order");
});

test("khoa-hoc intro fades up like the other sections", { skip }, () => {
  assert.match(main, /<header[^>]*(data-animate="fade-up"[^>]*class="section_header64"|class="section_header64"[^>]*data-animate="fade-up")/);
});

test("khoa-hoc hides the CMS course list in production", { skip }, () => {
  assert.doesNotMatch(main, /section_programs-overview/);
  assert.doesNotMatch(main, /Danh sách các khóa học/);
  assert.doesNotMatch(main, /No items found/);
});

test("khoa-hoc shows the unified address only", { skip }, () => {
  assert.doesNotMatch(html, /Phường 13/);
  assert.match(html, /35 Văn Chung, Phường Tân Bình/);
});

test("khoa-hoc images all come from the Astro pipeline", { skip }, () => {
  const srcs = [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(srcs.length > 0);
  for (const src of srcs) assert.match(src, /^\/_astro\//, src);
  assert.doesNotMatch(html, /["'(]\/?(site|images)\//);
});
