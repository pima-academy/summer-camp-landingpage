// Checks the built ve-chung-toi page: "Về PiMA" anchors, scripted hooks, images.
// Needs a fresh `npm run build`; skipped when the page is not built.
import { test } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, readBuilt } from "./test-lib.mjs";

const html = readBuilt("ve-chung-toi/index.html");

/** The opening tag of the element carrying `id="<id>"`. */
const tagWithId = (id) => html.match(new RegExp(`<[a-z]+\\b[^>]*\\bid="${id}"[^>]*>`))?.[0] ?? "";

test("each 'Về PiMA' footer anchor sits on its section", { skip }, () => {
  const expected = {
    "gioi-thieu": "section_about-header",
    "tam-nhin-su-menh": "about-feature",
    "doi-tac-mang-luoi-nhan-tai": "section_partners",
    "cac-tac-dong-tich-cuc": "section_impact",
    "cau-chuyen-nha-sang-lap": "section_about-timeline",
    "ke-hoach-tuong-lai": "section_about-plan",
  };
  for (const [id, cls] of Object.entries(expected)) {
    assert.match(tagWithId(id), new RegExp(`class="[^"]*\\b${cls}\\b`), `#${id} on .${cls}`);
  }
  // The footer links to them.
  for (const id of Object.keys(expected)) assert.ok(html.includes(`href="/ve-chung-toi/#${id}"`), `footer links #${id}`);
});

test("every founder timeline dot has the scroll colour hook", { skip }, () => {
  const dots = html.match(/<div[^>]*class="timeline1_circle"[^>]*>/g) ?? [];
  assert.equal(dots.length, 6);
  for (const d of dots) assert.match(d, /data-timeline-dot/);
});

test("member university logos slide in from the left", { skip }, () => {
  assert.match(html, /<div[^>]*data-animate="slide-in-left"[^>]*class="logo3_list"|<div[^>]*class="logo3_list"[^>]*data-animate="slide-in-left"/);
});

test("the accordion is the shared component", { skip }, () => {
  assert.equal((html.match(/<div class="layout351_accordion[^"]*" data-accordion-panel/g) ?? []).length, 3);
});

test("every image is processed by Astro, none points into site/", { skip }, () => {
  const imgs = html.match(/<img\b[^>]*>/g) ?? [];
  assert.ok(imgs.length > 20);
  for (const img of imgs) {
    assert.match(img, /src="\/_astro\//, img);
    assert.match(img, /width="\d+"/, img);
    assert.match(img, /height="\d+"/, img);
  }
  assert.doesNotMatch(html, /images\/|site\//);
});

test("no third-party script or font, no Webflow attributes", { skip }, () => {
  assert.doesNotMatch(html, /<script[^>]*src="https?:/);
  assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic|webflow\.js|jquery/i);
  assert.doesNotMatch(html, /data-wf-|data-w-id/);
});
