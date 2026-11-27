// Checks the built ve-chung-toi page: section order, "Về PiMA" anchors, scripted hooks, images.
// Needs a fresh `npm run build`; skipped when the page is not built.
import { test } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, mainOf, readBuilt } from "./test-lib.mjs";

const html = readBuilt("ve-chung-toi/index.html");

/** The opening tag of the element carrying `id="<id>"`. */
const tagWithId = (id) => html.match(new RegExp(`<[a-z]+\\b[^>]*\\bid="${id}"[^>]*>`))?.[0] ?? "";

/** The part of the page from `data-section="<name>"` up to the next section file. */
const sectionHtml = (name) => {
  const from = html.indexOf(`data-section="${name}"`);
  if (from < 0) return "";
  const next = html.indexOf("data-section=", from + 1);
  return html.slice(from, next < 0 ? undefined : next);
};

test("ve-chung-toi sections are in the old order", { skip }, () => {
  const order = [
    "header",
    "intro",
    "vision-mission",
    "programs-overview",
    "impact",
    "actions",
    "milestone",
    "trust-bar",
    "partners",
    "philosophy",
    "team",
    "member-universities",
    "founder-story",
    "future-plans",
    "contact-section",
  ];
  const at = order.map((name) => html.indexOf(`data-section="${name}"`));
  assert.ok(at.every((i) => i >= 0), `all sections present: ${order.filter((_, i) => at[i] < 0)}`);
  assert.deepEqual([...at].sort((a, b) => a - b), at, "sections in old order");
  assert.equal(html.match(/data-section=/g)?.length, order.length, "no other section");
});

test("each 'Về PiMA' footer anchor sits on its section", { skip }, () => {
  const expected = {
    "gioi-thieu": "header",
    "tam-nhin-su-menh": "vision-mission",
    "doi-tac-mang-luoi-nhan-tai": "partners",
    "cac-tac-dong-tich-cuc": "impact",
    "cau-chuyen-nha-sang-lap": "founder-story",
    "ke-hoach-tuong-lai": "future-plans",
  };
  for (const [id, name] of Object.entries(expected)) {
    assert.match(tagWithId(id), new RegExp(`data-section="${name}"`), `#${id} on ${name}`);
  }
  // The footer links to them.
  for (const id of Object.keys(expected)) assert.ok(html.includes(`href="/ve-chung-toi/#${id}"`), `footer links #${id}`);
});

test("every founder timeline dot has the scroll colour hook", { skip }, () => {
  assert.equal(sectionHtml("founder-story").match(/data-timeline-dot/g)?.length, 6);
});

test("member university logos slide in from the left, the second copy is hidden", { skip }, () => {
  const logos = sectionHtml("member-universities");
  assert.equal(logos.match(/data-animate="slide-in-left"/g)?.length, 1);
  assert.equal(logos.match(/aria-hidden="true"/g)?.length, 1);
  assert.equal(logos.match(/<img\b/g)?.length, 16);
});

test("the vision and mission accordion has three panels", { skip }, () => {
  assert.equal(sectionHtml("vision-mission").match(/<div[^>]*\bdata-accordion-panel\b/g)?.length, 3);
});

test("no Webflow class or w-node id in the page's main content", { skip }, () => {
  const main = mainOf(html);
  assert.doesNotMatch(main, /id="w-node-/);
  assert.doesNotMatch(main, /class="[^"]*\b(w-[a-z-]+|padding-global|container-(medium|large)|padding-section-[a-z]+|margin-(bottom|top)|spacer-[a-z]+|text-size-[a-z]+|text-style-[a-z]+|max-width-[a-z]+|layout\d+_[a-z-]+|header\d+_[a-z-]+|timeline1_[a-z-]+|logo3_[a-z-]+|section_about-[a-z-]+)\b/);
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
