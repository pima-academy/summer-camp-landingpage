// Checks the decorative-animation wiring on the built output (#24).
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, readBuilt } from "./test-lib.mjs";

const html = readBuilt("index.html");
const css = skip
  ? ""
  : [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)]
      .map((m) => readBuilt(m[1]))
      .join("\n");

// Top-level blocks of a minified stylesheet: [prelude, body] pairs (one level of nesting).
function mediaBlocks(sheet, query) {
  const blocks = [];
  let i = 0;
  while ((i = sheet.indexOf("@media", i)) !== -1) {
    const open = sheet.indexOf("{", i);
    let depth = 1;
    let j = open + 1;
    for (; depth; j++) {
      if (sheet[j] === "{") depth++;
      else if (sheet[j] === "}") depth--;
    }
    const prelude = sheet.slice(i, open);
    if (prelude.replace(/\s/g, "").includes(query)) blocks.push(sheet.slice(open + 1, j - 1));
    i = j;
  }
  return blocks;
}

test("nav and site footer fade up", { skip }, () => {
  assert.match(html, /<header\b[^>]*data-animate="fade-up"/);
  assert.match(html, /<footer\b[^>]*data-animate="fade-up"/);
});

test("the page runs the animation script", { skip }, () => {
  assert.match(html, /<script type="module"[^>]*>/);
});

test("hidden start states exist only under js-ready and no-preference motion", { skip }, () => {
  const hiding = /html\.js-ready \[data-animate=(?:"|')?(fade-up|slide-in-left)/g;
  const inMotionBlocks = mediaBlocks(css, "(prefers-reduced-motion:no-preference)").join("\n");
  const everywhere = [...css.matchAll(hiding)].length;
  assert.ok(everywhere >= 2, "fade-up and slide-in-left start states present");
  assert.equal([...inMotionBlocks.matchAll(hiding)].length, everywhere, "all inside no-preference");
  assert.match(inMotionBlocks, /\[data-marquee\]\{[^}]*animation/, "marquee only moves with no-preference");
  assert.match(inMotionBlocks, /scroll-behavior:smooth/, "smooth scroll only with no-preference");
  assert.doesNotMatch(
    css.replace(/@media[^{]*no-preference\)[^{]*\{(?:[^{}]|\{[^}]*\})*\}/g, ""),
    /scroll-behavior:smooth|\[data-marquee\]\{[^}]*animation/,
  );
});
