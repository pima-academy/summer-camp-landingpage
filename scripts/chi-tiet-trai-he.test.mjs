// Checks the built chi-tiet-trai-he page (#38): real content present, content gaps hidden,
// images through <Image>, no third-party script or font.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { distSkip as skip, mainOf, readBuilt, root } from "./test-lib.mjs";

const html = () => readBuilt("chi-tiet-trai-he/index.html");
const page = () => readFileSync(join(root, "src/pages/chi-tiet-trai-he.astro"), "utf8");

test("chi-tiet-trai-he's page file is the ordered list of its sections", () => {
  // Components rendered in the page's template, in order (BaseLayout and ContentGap wrappers aside).
  const template = page().split(/^---$/m)[2];
  const used = [...template.matchAll(/<([A-Z]\w*)/g)].map((m) => m[1]);
  assert.deepEqual(
    used.filter((name) => !["BaseLayout", "ContentGap"].includes(name)),
    ["Hero", "Topic", "CampInfo", "ProgramContent", "Mentors", "Campers", "Documents", "Testimonials", "Gallery"],
  );
  assert.ok(!/<[a-z]/.test(template), "the page template has its own markup");
});

test("chi-tiet-trai-he shows its sections in order", { skip }, () => {
  const sections = [...mainOf(html()).matchAll(/<section[^>]*\sdata-section="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(sections, ["hero", "topic", "program-content", "testimonials"]);
});

test("chi-tiet-trai-he is built with a specific title and description", { skip }, () => {
  assert.ok(html(), "dist/chi-tiet-trai-he/index.html missing");
  const h = html();
  assert.match(h, /<title>[^<]*Quy hoạch tuyến tính[^<]*<\/title>/i);
  assert.match(h, /<meta name="description" content="[^"]{50,}"/);
  assert.match(h, /<link rel="canonical" href="https:\/\/pimavn\.com\/chi-tiet-trai-he\/"/);
});

test("chi-tiet-trai-he keeps its real content", { skip }, () => {
  const h = html();
  assert.match(h, /<h1[^>]*>Quy hoạch Tuyến tính- Linear Programming<\/h1>/);
  assert.match(h, /<span[^>]*>PiMA<\/span> academy &gt; chương trình &gt; trại hè 2024/);
  assert.match(h, /<h2>Chủ đề<\/h2>/);
  assert.match(h, /<h2>Nội dung chương trình<\/h2>/);
  assert.match(h, /<section[^>]*data-section="testimonials"[^>]*data-animate="fade-up"/);
  assert.equal((h.match(/alt="Ảnh đại diện của /g) ?? []).length, 6, "six testimonial cards");
});

test("chi-tiet-trai-he hides its content gaps", { skip }, () => {
  const h = html();
  for (const gap of ["Thông tin trại hè", "Đội ngũ hướng dẫn", "Danh sách trại sinh", "Tài liệu", "Hình ảnh trại hè"]) {
    assert.ok(!h.includes(`>${gap}</h2>`), `gap heading "${gap}" is in the production page`);
  }
  assert.ok(!h.includes("w-lightbox"), "an empty lightbox link is in the production page");
  assert.ok(!h.includes('href="#"'), "a # link is in the production page");
});

test("chi-tiet-trai-he images go through <Image> and nothing loads off-site", { skip }, () => {
  const h = html();
  for (const [, src] of h.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)) {
    assert.match(src, /^\/_astro\//, `img src ${src} is not an Astro asset`);
  }
  assert.ok(!/images\//.test(h.replace(/\/_astro\/[^"\s]+/g, "")), "a path into site/images remains");
  assert.ok(!/<script[^>]*\ssrc="https?:/.test(h), "third-party script");
  assert.ok(!/<link[^>]*\shref="https?:\/\/(?!pimavn\.com)/.test(h), "third-party link");
  assert.ok(!/data-wf-|data-w-id/.test(h), "Webflow attributes remain");
});
