// Checks the section-file convention of ADR 0005: every .astro file under src/sections/
// renders the Section primitive with `name` equal to its file name in kebab case
// (src/sections/home/FoundingStory.astro → <Section name="founding-story">), and uses only
// classes it styles itself (ADR 0004), none of them styled by a global stylesheet, and no `w-node` id;
// it paints no background of its own (docs/brand.md: tones only).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { sectionClassProblems, selectorClasses } from "./section-classes.mjs";
import { sectionFillProblems } from "./section-fills.mjs";
import { kebabCase, sectionNameProblem } from "./section-name.mjs";
import { root, walk } from "./test-lib.mjs";

const section = (name) => `---\nimport Section from "../../components/Section.astro";\n---\n\n<Section ${name} spacing="medium">\n  <h2>x</h2>\n</Section>\n`;

test("kebab case of a PascalCase file name", () => {
  assert.equal(kebabCase("Hero"), "hero");
  assert.equal(kebabCase("FoundingStory"), "founding-story");
  assert.equal(kebabCase("FoundingStory"), "founding-story");
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

test("a section file may only use classes it styles itself, none a global stylesheet styles", () => {
  const global = new Set(["button", "heading"]);
  const path = "src/sections/Partners.astro";
  const ok =
    '---\n---\n<Section name="partners" class="band-a"><p class:list={["logos", { x: y }]}>a</p></Section>\n' +
    "<style>\n  .band-a { color: red; }\n  .logos.x img { width: 1px; }\n</style>\n";
  assert.deepEqual(sectionClassProblems(path, ok, global), []);
  const utility = '---\n---\n<Section name="partners"><div class="text-align-center">a</div></Section>\n';
  assert.match(sectionClassProblems(path, utility, global).join(), /"text-align-center" is not styled/);
  const clash = '---\n---\n<Section name="partners"><div class="button">a</div></Section>\n<style>.button { color: red; }</style>\n';
  assert.match(sectionClassProblems(path, clash, global).join(), /"button" is also styled by a global stylesheet/);
  const node = '---\n---\n<Section name="partners"><div id="w-node-_22-1" class="x">a</div></Section>\n<style>.x {}</style>\n';
  assert.match(sectionClassProblems(path, node, global).join(), /Webflow id "w-node-_22-1"/);
});

/** The sections more than one page uses (#65). */
const SHARED = [
  "Partners",
  "Impact",
  "Testimonials",
  "ProgramsOverview",
  "SummerCamp",
  "ContactSection",
  "PageHeader",
];

test("the shared sections live in src/sections/", () => {
  for (const name of SHARED) {
    assert.ok(existsSync(join(root, "src/sections", `${name}.astro`)), `src/sections/${name}.astro`);
    assert.ok(!existsSync(join(root, "src/components", `${name}.astro`)), `src/components/${name}.astro is gone`);
  }
});

test("every section file carries no Webflow class or id", () => {
  const styles = join(root, "src/styles");
  const global = new Set(
    readdirSync(styles)
      .filter((f) => f.endsWith(".css"))
      .flatMap((f) => [...selectorClasses(readFileSync(join(styles, f), "utf8"))]),
  );
  const files = walk(join(root, "src/sections")).filter((f) => f.endsWith(".astro"));
  const problems = files.flatMap((file) => sectionClassProblems(relative(root, file), readFileSync(file, "utf8"), global));
  assert.deepEqual(problems, []);
});

test("a section file paints no background of its own; a card takes a tone with data-tone", () => {
  const file = (css) => `---\n---\n<Section name="x"><div class="card" data-tone="surface">a</div></Section>\n<style>\n${css}\n</style>\n`;
  const path = "src/sections/X.astro";
  for (const bad of [
    ".card { background-color: var(--color-background-surface); }",
    ".card { background: var(--color-background); }",
    "@media (max-width: 767px) { .card { background-color: var(--color-background-pale-lime); } }",
    ".dot { background-color: var(--color-text-accent); }",
  ]) {
    assert.equal(sectionFillProblems(path, file(bad)).length, 1, bad);
  }
  for (const good of [
    ".card { border-radius: var(--radius); }",
    ".axis { background-color: var(--color-background-accent); }",
    ".dot { background-color: color-mix(in srgb, var(--color-background-accent) calc(var(--p) * 100%), transparent); }",
    ".card { background-color: transparent; }",
  ]) {
    assert.deepEqual(sectionFillProblems(path, file(good)), [], good);
  }
});

test("no section file paints a background other than an allowed fill", () => {
  const files = walk(join(root, "src/sections")).filter((f) => f.endsWith(".astro"));
  const problems = files.flatMap((file) => sectionFillProblems(relative(root, file), readFileSync(file, "utf8")));
  assert.deepEqual(problems, []);
});
