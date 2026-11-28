// The skip rule shared by the tests that read dist/, and the markup helpers the page tests share.
import assert from "node:assert/strict";
import test from "node:test";
import { buildSkip, sectionOf, textOf } from "./test-lib.mjs";

test("a built test runs", () => {
  assert.equal(buildSkip(true, "dist/ missing", {}), false);
  assert.equal(buildSkip(true, "dist/ missing", { CI: "true" }), false);
});

test("locally, a test that needs a missing build is skipped with the reason", () => {
  assert.equal(buildSkip(false, "dist/ missing", {}), "dist/ missing");
});

test("in CI, a missing build fails instead of skipping", () => {
  assert.throws(() => buildSkip(false, "dist/ missing", { CI: "true" }), /dist\/ missing/);
});

const page = [
  '<main><section data-section="hero" data-tone="dark-green"><h1>A</h1></section>',
  '<section data-section="impact"><div><section class="inner">x</section></div><p>B &amp; C</p></section>',
  '<section data-section="contact-section"><h2>D</h2></section></main><footer>F</footer>',
].join("\n");

test("sectionOf returns one section's whole element, nested sections included, and stops at its end", () => {
  assert.equal(sectionOf(page, "hero"), '<section data-section="hero" data-tone="dark-green"><h1>A</h1></section>');
  assert.equal(
    sectionOf(page, "impact"),
    '<section data-section="impact"><div><section class="inner">x</section></div><p>B &amp; C</p></section>',
  );
  assert.equal(sectionOf(page, "contact-section"), '<section data-section="contact-section"><h2>D</h2></section>');
});

test("sectionOf is empty for a section the page does not have", () => {
  assert.equal(sectionOf(page, "press"), "");
});

test("textOf drops tags, reads entities back and collapses whitespace", () => {
  assert.equal(textOf('<p>B &amp; C</p>\n  <span>&lt;3 &quot;x&quot; &#39;y&#39;</span> '), `B & C <3 "x" 'y'`);
  assert.equal(textOf(sectionOf(page, "impact")), "x B & C");
});
