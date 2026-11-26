// Checks ADR 0005's page shape for the 404 page and the dev-only gap pages: the page
// file is BaseLayout (404 only; the gap route adds it for gap pages) and an ordered
// list of section components imported from src/sections/, with no markup of its own.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { root, walk } from "./test-lib.mjs";

/** What is wrong with a page file that should only list sections; [] when nothing. */
function pageListProblems(text) {
  const frontmatter = text.match(/^---([\s\S]*?)\n---/)?.[1] ?? "";
  const sections = new Set(
    [...frontmatter.matchAll(/import\s+(\w+)\s+from\s+["'][^"']*\/sections\/[^"']+\.astro["']/g)].map((m) => m[1]),
  );
  const template = text
    .replace(/^---[\s\S]*?\n---/, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?BaseLayout\b[^>]*>/g, "");
  const problems = [];
  for (const [, name] of template.matchAll(/<([A-Za-z][\w.-]*)[^>]*>/g)) {
    if (!sections.has(name)) problems.push(`<${name}> is not a section imported from src/sections/`);
  }
  const loose = template.replace(/<[^>]*>/g, "").trim();
  if (loose) problems.push(`text outside the sections: "${loose.slice(0, 40)}"`);
  return problems;
}

test("a page that lists sections passes; markup or a non-section component fails", () => {
  const ok =
    '---\nimport BaseLayout from "../layouts/BaseLayout.astro";\nimport NotFound from "../sections/404/NotFound.astro";\n---\n\n' +
    '<BaseLayout title="x" noindex>\n  <NotFound />\n</BaseLayout>\n';
  assert.deepEqual(pageListProblems(ok), []);
  assert.deepEqual(pageListProblems("---\n// empty template\n---\n"), []);
  const markup = '---\nimport A from "../sections/a/A.astro";\n---\n<A />\n<div class="spacer-medium"></div>\n';
  assert.match(pageListProblems(markup).join(), /<div> is not a section/);
  const widget = '---\nimport Slider from "../components/Slider.astro";\n---\n<Slider layout="single" />\n';
  assert.match(pageListProblems(widget).join(), /<Slider> is not a section/);
  assert.match(pageListProblems("---\n---\nNo items found.\n").join(), /text outside the sections/);
});

test("the 404 page and every gap page are lists of section files", () => {
  const files = [join(root, "src/pages/404.astro"), ...walk(join(root, "src/gap-pages")).filter((f) => f.endsWith(".astro"))];
  for (const file of files) {
    assert.deepEqual(pageListProblems(readFileSync(file, "utf8")), [], relative(root, file));
  }
});
