// Checks ADR 0005's page shape: a page file in src/pages/ (and a dev-only gap page in
// src/gap-pages/) is BaseLayout, its SEO data and an ordered list of section components
// imported from src/sections/, optionally wrapped in ContentGap. No markup, text or <style>
// of its own: styles live in the file that owns the markup, site-wide rules in src/styles/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { frontmatter, template } from "./astro-file.mjs";
import { root, walk } from "./test-lib.mjs";

/** Wrappers a page may use around its sections, by the file they are imported from. */
const WRAPPERS = /\/(layouts\/BaseLayout|components\/ContentGap)\.astro$/;

/** What is wrong with a page file that should only list sections; [] when nothing. */
function pageListProblems(text) {
  const imports = [...frontmatter(text).matchAll(/import\s+(\w+)\s+from\s+["']([^"']+\.astro)["']/g)];
  const allowed = new Set(imports.filter(([, , from]) => /\/sections\//.test(from) || WRAPPERS.test(from)).map(([, name]) => name));
  const body = template(text).replace(/<!--[\s\S]*?-->/g, "");
  const problems = [];
  for (const [, name] of body.matchAll(/<([A-Za-z][\w.-]*)[^>]*>/g)) {
    if (!allowed.has(name)) problems.push(`<${name}> is neither a section imported from src/sections/ nor BaseLayout or ContentGap`);
  }
  const loose = body.replace(/<style\b[\s\S]*?<\/style>/g, "").replace(/<[^>]*>/g, "").trim();
  if (loose) problems.push(`text outside the sections: "${loose.slice(0, 40)}"`);
  return problems;
}

test("a page that lists sections passes; markup, <style> or a non-section component fails", () => {
  const ok =
    '---\nimport BaseLayout from "../layouts/BaseLayout.astro";\nimport ContentGap from "../components/ContentGap.astro";\n' +
    'import NotFound from "../sections/404/NotFound.astro";\n---\n\n' +
    '<BaseLayout title="x" noindex>\n  <ContentGap name="x: y">\n    <NotFound />\n  </ContentGap>\n</BaseLayout>\n';
  assert.deepEqual(pageListProblems(ok), []);
  assert.deepEqual(pageListProblems("---\n// empty template\n---\n"), []);
  const markup = '---\nimport A from "../sections/a/A.astro";\n---\n<A />\n<div class="spacer-medium"></div>\n';
  assert.match(pageListProblems(markup).join(), /<div> is neither a section/);
  const widget = '---\nimport Slider from "../components/Slider.astro";\n---\n<Slider layout="single" />\n';
  assert.match(pageListProblems(widget).join(), /<Slider> is neither a section/);
  assert.match(pageListProblems("---\n---\nNo items found.\n").join(), /text outside the sections/);
  const style = '---\nimport A from "../sections/a/A.astro";\n---\n<A />\n<style>\n  :global(html) { scroll-padding-top: 0; }\n</style>\n';
  assert.match(pageListProblems(style).join(), /<style> is neither a section/);
});

/**
 * Page files left out: the two frozen camp pages, the dev-only catalogue (it shows the
 * primitives, not sections) and the dev-only gap route (it renders each gap page, which is
 * checked itself).
 */
const NOT_SECTION_LISTS = [
  "src/pages/trai-he-toan-hoc-2025.astro",
  "src/pages/trai-he-pima-2026.astro",
  "src/pages/catalogue/[...path].astro",
  "src/pages/[...gap].astro",
];

const files = [...walk(join(root, "src/pages")), ...walk(join(root, "src/gap-pages"))]
  .filter((f) => f.endsWith(".astro"))
  .map((f) => relative(root, f).split(sep).join("/"))
  .filter((path) => !NOT_SECTION_LISTS.includes(path));

test("the page files under test include every site page", () => {
  for (const page of ["index", "ve-chung-toi", "khoa-hoc", "lien-he", "trai-he-toan-hoc-pima", "chi-tiet-trai-he", "404"]) {
    assert.ok(files.includes(`src/pages/${page}.astro`), page);
  }
});

for (const path of files) {
  test(`${path} is a list of section files`, () => {
    assert.deepEqual(pageListProblems(readFileSync(join(root, path), "utf8")), []);
  });
}
