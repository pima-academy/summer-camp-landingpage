// Checks the section-file convention of ADR 0005: every .astro file under src/sections/
// renders the Section primitive with `name` equal to its file name in kebab case
// (src/sections/home/FoundingStory.astro → <Section name="founding-story">).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { kebabCase, sectionNameProblem } from "./section-name.mjs";
import { root, walk } from "./test-lib.mjs";

const section = (name) => `---\nimport Section from "../../components/Section.astro";\n---\n\n<Section ${name} spacing="medium">\n  <h2>x</h2>\n</Section>\n`;

test("kebab case of a PascalCase file name", () => {
  assert.equal(kebabCase("Hero"), "hero");
  assert.equal(kebabCase("FoundingStory"), "founding-story");
  assert.equal(kebabCase("TrustBar"), "trust-bar");
  assert.equal(kebabCase("FAQ"), "faq");
  assert.equal(kebabCase("PressFAQ"), "press-faq");
  assert.equal(kebabCase("Camp2025Photos"), "camp2025-photos");
});

test("a section file whose Section name matches its file name passes", () => {
  assert.equal(sectionNameProblem("src/sections/home/FoundingStory.astro", section('name="founding-story"')), null);
});

test("a wrong name, a missing name or no Section fails", () => {
  const path = "src/sections/home/FoundingStory.astro";
  assert.match(sectionNameProblem(path, section('name="story"')), /"story".*"founding-story"/);
  assert.match(sectionNameProblem(path, section("")), /founding-story/);
  assert.match(sectionNameProblem(path, section("name={name}")), /founding-story/);
  assert.match(sectionNameProblem(path, "---\n---\n<div class=\"story\">x</div>\n"), /does not render <Section/);
  const onlyInComment = '---\n// Renders <Section name="founding-story"> later.\n---\n<div>x</div>\n';
  assert.match(sectionNameProblem(path, onlyInComment), /does not render <Section/);
  assert.match(sectionNameProblem(path, section('name="founding-story"') + section('name="founding-story"')), /renders 2/);
});

test("every section file renders Section with its kebab-case file name", () => {
  const files = walk(join(root, "src/sections")).filter((f) => f.endsWith(".astro"));
  for (const file of files) {
    const path = relative(root, file);
    assert.equal(sectionNameProblem(path, readFileSync(file, "utf8")), null, path);
  }
});
