// The end state of the Webflow migration (ADR 0004, #73): global CSS is only the font faces,
// the tokens, the base and the animations, and no source file names a
// Webflow class, `w-node` id, utility wrapper, `--ai-gen-…` variable or `-wf-` token.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { root, walk } from "./test-lib.mjs";

test("global CSS is fonts, tokens, base and animations, in that order", () => {
  const global = readFileSync(join(root, "src/styles/global.css"), "utf8");
  const imports = [...global.matchAll(/@import\s+["']([^"']+)["']/g)].map((m) => m[1]);
  assert.deepEqual(imports, ["./fonts.css", "./tokens.css", "./base.css", "./animations.css"]);
  const sheets = readdirSync(join(root, "src/styles")).sort();
  assert.deepEqual(sheets, ["animations.css", "base.css", "fonts.css", "global.css", "tokens.css"]);
});

/** Source with its comments blanked out: comments may name old classes to explain history. */
const withoutComments = (text) =>
  text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'\w])\/\/.*$/gm, "$1");

/** Webflow and Relume leftovers, as they appear in markup, CSS or scripts. */
const WEBFLOW_NAMES = [
  /(?<![\w-])w-(?:node|nav|dropdown|form|slider|layout|inline-block|button|embed|richtext|dyn|lightbox|tab|input|select|checkbox|radio|clearfix|container|row|col|hidden|list-unstyled|background-video|icon|mod|webflow)[\w-]*/g,
  /(?<![\w-])w--[\w-]+/g,
  /(?<![\w-])(?:padding-global|padding-section-[a-z]+|container-(?:small|medium|large)|margin-(?:xx?small|tiny|small|medium|large|xx?large|custom\d*)|spacer-[a-z]+|text-(?:size|style|weight|align|color)-[a-z-]+|max-width-[a-z]+|utility-[a-z-]+|(?:header|layout|section|timeline|logo|gallery|blog|testimonial|card-row)\d+_[\w-]+)(?![\w-])/g,
  /--ai-gen[\w-]*/g,
  /--_color[\w-]*/g,
  /--[\w-]*-wf-[\w-]*/g,
];

/** Webflow names in one source text. */
const webflowNames = (text) => WEBFLOW_NAMES.flatMap((re) => withoutComments(text).match(re) ?? []);

test("webflowNames finds Webflow classes, ids and variables but not lookalikes or comments", () => {
  assert.deepEqual(webflowNames('<div class="w-layout-grid padding-global" id="w-node-_1-2">'), [
    "w-layout-grid",
    "w-node-_1-2",
    "padding-global",
  ]);
  assert.deepEqual(webflowNames(".a.w--current { color: var(--ai-gen-x); border: var(--color-wf-border); }"), [
    "w--current",
    "--ai-gen-x",
    "--color-wf-border",
  ]);
  assert.deepEqual(webflowNames("<div class=\"header26_component\">"), ["header26_component"]);
  assert.deepEqual(webflowNames("box-shadow: var(--shadow-dropdown); /* old `.w-dropdown` */"), []);
  assert.deepEqual(webflowNames("<!-- was padding-global --><p>x</p>\n// old w-slider\n"), []);
});

test("no source file names a Webflow class, id, utility class or variable", () => {
  const files = walk(join(root, "src"))
    .map((f) => relative(root, f).split(sep).join("/"))
    .filter((path) => /\.(astro|css|ts|mjs|js)$/.test(path));
  assert.ok(files.length > 50, `scans the site sources (${files.length})`);
  const found = files.flatMap((path) =>
    webflowNames(readFileSync(join(root, path), "utf8")).map((name) => `${path}: ${name}`),
  );
  assert.deepEqual(found, []);
});
