// Checks the camp-page freeze (#60) in the build: the 2025/2026 camp pages load only the
// frozen CSS of src/camp/, and no other page loads it. The frozen entry
// (src/camp/styles/camp.css) declares `--camp-frozen`, which marks its bundle.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { relative } from "node:path";
import { builtHtmlFiles, dist, distSkip as skip, readBuilt } from "./test-lib.mjs";

const CAMP_PAGES = ["trai-he-toan-hoc-2025/index.html", "trai-he-pima-2026/index.html"];
const MARKER = "--camp-frozen";

/** The hrefs of a page's <link rel="stylesheet"> tags. */
const stylesheets = (html) =>
  [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)].map((m) => m[0].match(/href="([^"]+)"/)[1]);

/** All CSS a page loads: its linked stylesheets and its inline <style> blocks. */
const cssOf = (html) => [
  ...stylesheets(html).map((href) => readBuilt(href.replace(/^\//, ""))),
  ...[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]),
];

const pages = skip ? [] : builtHtmlFiles().map((f) => relative(dist, f));
const sitePages = pages.filter((p) => !CAMP_PAGES.includes(p));

test("the camp pages load the frozen CSS", { skip }, () => {
  for (const page of CAMP_PAGES) {
    const html = readBuilt(page);
    assert.ok(html, `dist/${page} exists`);
    assert.ok(
      cssOf(html).some((css) => css.includes(MARKER)),
      `${page} loads the frozen CSS`,
    );
  }
});

test("the camp pages link no stylesheet that a site page links", { skip }, () => {
  const siteSheets = new Set(sitePages.flatMap((p) => stylesheets(readBuilt(p))));
  assert.ok(siteSheets.size > 0, "site pages link stylesheets");
  for (const page of CAMP_PAGES) {
    const shared = stylesheets(readBuilt(page)).filter((href) => siteSheets.has(href));
    assert.deepEqual(shared, [], `${page} links a site stylesheet`);
  }
});

test("no site page loads the frozen CSS", { skip }, () => {
  assert.ok(sitePages.length >= 7, `found ${sitePages.length} site pages`);
  for (const page of sitePages) {
    const html = readBuilt(page);
    assert.ok(!cssOf(html).some((css) => css.includes(MARKER)), `${page} loads the frozen CSS`);
  }
});
