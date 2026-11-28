// Checks on the built output that content shows at once on load (spec #131, "Site-wide
// removals"): no scroll reveal and no marquee on any page, and the only motion left in the
// site stylesheet answers an action (smooth scroll for in-page links, under no-preference).
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { relative } from "node:path";
import { builtHtmlFiles, dist, distSkip as skip, readBuilt } from "./test-lib.mjs";

const pages = skip ? [] : builtHtmlFiles().map((file) => [relative(dist, file), readBuilt(relative(dist, file))]);
const home = readBuilt("index.html");
const css = skip
  ? ""
  : [...home.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => readBuilt(m[1])).join("\n");

test("no page has a scroll reveal, a marquee or a trust bar", { skip }, () => {
  assert.ok(pages.length > 10, `pages found: ${pages.length}`);
  for (const [path, html] of pages) {
    assert.doesNotMatch(html, /data-animate|is-animated/, `${path}: scroll reveal`);
    assert.doesNotMatch(html, /data-marquee|--marquee-/, `${path}: marquee`);
    assert.doesNotMatch(html, /data-section="trust-bar"/, `${path}: trust bar`);
  }
});

test("the site stylesheet hides nothing on load and has no marquee", { skip }, () => {
  assert.doesNotMatch(css, /\[data-animate|is-animated|data-marquee|@keyframes marquee/);
  // Smooth scroll for in-page links stays, only with no-preference motion.
  assert.match(css, /@media \(prefers-reduced-motion:\s*no-preference\)\s*\{\s*html\s*\{\s*scroll-behavior:\s*smooth/);
});
