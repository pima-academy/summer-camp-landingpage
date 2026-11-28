// Guardrail for ADR 0004's CSS rules: design values come only from src/styles/tokens.css.
// The rules themselves are in scripts/guardrail-lib.mjs; the last tests run them on the repo.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as guardrail from "./guardrail-lib.mjs";
import { root, walk } from "./test-lib.mjs";

const { checkFile, guardrailFiles, inScope, tokenNames } = guardrail;

/** The rule ids a file's text breaks, in order. */
const rules = (path, text) => checkFile(path, text).map((v) => v.rule);

const astro = (css) => `---\n---\n<div class="card">x</div>\n<style>\n${css}\n</style>\n`;

test("a literal hex colour in a component <style> fails", () => {
  assert.deepEqual(rules("src/components/Card.astro", astro(".card { color: #50b448; }")), ["literal-colour"]);
});

test("rgb(), hsl() and named colours fail; var(), transparent and currentColor pass", () => {
  const css = (value) => astro(`.card { border: 1px solid ${value}; }`);
  for (const bad of ["rgba(0, 0, 0, 0.4)", "hsl(120 50% 50%)", "white", "Black", "rebeccapurple"]) {
    assert.deepEqual(rules("src/components/Card.astro", css(bad)), ["literal-colour"], bad);
  }
  for (const good of [
    "var(--color-border)",
    "transparent",
    "currentColor",
    "color-mix(in srgb, currentColor 30%, transparent)",
  ]) {
    assert.deepEqual(rules("src/components/Card.astro", css(good)), [], good);
  }
});

test("type, radius and shadow values must come through var(--…)", () => {
  const check = (decl) => rules("src/components/Card.astro", astro(`.card { ${decl}; }`));
  for (const bad of [
    "font-size: 16px",
    "font-weight: 700",
    "line-height: 1.5",
    "border-radius: 20px",
    "border-top-left-radius: 4px",
    "box-shadow: 0 4px 8px var(--color-shadow)",
    "font: 700 11px/1.3 monospace",
    "font-family: Arial, sans-serif",
    "font-size: calc(var(--font-size-body) * 2)",
    "font-size: max(var(--font-size-h1), 3rem)",
  ]) {
    assert.deepEqual(check(bad), ["not-a-token"], bad);
  }
  for (const good of [
    "font-size: var(--font-size-h2)",
    "font-weight: var(--font-weight-heading) !important",
    "line-height: inherit",
    "border-radius: 0",
    "box-shadow: none",
    "box-shadow: var(--shadow-card), var(--shadow-focus)",
    "font: inherit",
    "font-family: var(--font-family-base)",
    "letter-spacing: var(--letter-spacing-kicker)",
    // The larger (or smaller) of two tokens is still a token: display type never below the h1.
    "font-size: max(var(--font-size-h1), var(--font-size-display-2))",
    "letter-spacing: 0",
    "letter-spacing: normal",
    // The larger (or smaller) of two tokens is still a token value: a display title never below h1.
    "font-size: max(var(--font-size-h1), var(--font-size-display-2))",
    "font-size: min(var(--font-size-h1), var(--font-size-display-2))",
  ]) {
    assert.deepEqual(check(good), [], good);
  }
  assert.deepEqual(check("letter-spacing: -0.01em"), ["not-a-token"]);
});

test("margins, paddings, gaps and offsets take a step of the spacing scale", () => {
  const check = (decl) => rules("src/components/Card.astro", astro(`.card { ${decl}; }`));
  for (const bad of [
    "padding: 1.5rem",
    "padding: 10px 20px",
    "margin-top: 0.7em",
    "margin: 0 auto 1rem",
    "margin-left: -8rem",
    "gap: 16px",
    "row-gap: 3rem",
    "column-gap: 2rem",
    "top: 5rem",
    "inset: 8px auto auto 8px",
    "scroll-padding-top: 4.5rem",
    "padding-left: calc(5% + 4rem)",
    "margin-bottom: calc(var(--space-4) + 10px)",
  ]) {
    assert.deepEqual(check(bad), ["literal-spacing"], bad);
  }
  for (const good of [
    "padding: var(--space-6)",
    "margin: 0 auto var(--space-4)",
    "margin: 0",
    "margin-left: auto",
    "margin-left: calc(-1 * var(--space-32))",
    "gap: var(--space-16) var(--space-12)",
    "padding-left: 5%",
    "inset: 2% auto auto 5%",
    "top: 100%",
    "padding-left: calc(5% + var(--space-16))",
    "padding-left: clamp(0px, calc(50% - var(--space-20)), var(--space-16))",
    "margin-top: calc(var(--space-4) - 1lh)",
    "gap: inherit",
    "width: 40px",
    "max-width: 64rem",
    "outline-offset: 0.125rem",
  ]) {
    assert.deepEqual(check(good), [], good);
  }
});

test("inline style carries no literal spacing", () => {
  const page = (attr) => rules("src/pages/x.astro", `---\n---\n<div ${attr}>x</div>\n`);
  assert.deepEqual(page('style="margin-top: 2rem"'), ["inline-style"]);
  assert.deepEqual(page('style="padding: 0"'), []);
});

test("@media must be one of the three breakpoints, a motion query or a marked exception", () => {
  const check = (css) => rules("src/styles/base.css", css);
  for (const good of [
    "@media screen and (max-width: 991px) { a { order: 1; } }",
    "@media (max-width: 767px) { a { order: 1; } }",
    "@media screen and (max-width: 479px) { a { order: 1; } }",
    "@media (prefers-reduced-motion: reduce) { a { transition: none; } }",
    "/* breakpoint-exception: the old 480–991 px fix */\n@media screen and (min-width: 480px) and (max-width: 991px) { a { order: 1; } }",
  ]) {
    assert.deepEqual(check(good), [], good);
  }
  for (const bad of [
    "@media (min-width: 768px) { a { order: 1; } }",
    "@media screen and (max-width: 990px) { a { order: 1; } }",
    "/* an ordinary comment */\n@media (min-width: 992px) { a { order: 1; } }",
  ]) {
    assert.deepEqual(check(bad), ["media-query"], bad);
  }
});

test("a :global() rule needs a comment directly before it", () => {
  const check = (css) => rules("src/components/Card.astro", astro(css));
  assert.deepEqual(check(".card :global(img) { order: 1; }"), ["uncommented-global"]);
  assert.deepEqual(check("/* why */\n.card { order: 1; }\n.card :global(img) { order: 1; }"), ["uncommented-global"]);
  assert.deepEqual(check("/* The slot's images: why. */\n.card :global(img) { order: 1; }"), []);
  assert.deepEqual(check("@media (max-width: 767px) {\n  /* why */\n  :global(html) .card { order: 1; }\n}"), []);
});

test("inline style carries no design values (only the allowed custom properties)", () => {
  const page = (attr) => rules("src/pages/x.astro", `---\nconst d = 3;\n---\n<div ${attr}>x</div>\n`);
  assert.deepEqual(page('style="color: red"'), ["inline-style"]);
  assert.deepEqual(page('style="border-radius: var(--radius-card)"'), ["inline-style"]);
  assert.deepEqual(page("style='--accent: #50b448'"), ["inline-style"]);
  assert.deepEqual(page('style={`--gap: ${d}rem`}'), ["inline-style"]);
  assert.deepEqual(page('style={`--cover-ratio: ${d}; --photo-ratio: ${Math.max(2, d)}`}'), []);
  assert.deepEqual(page('style="display: none"'), []);
});

test("@font-face descriptors are not design values", () => {
  const css = '@font-face { font-family: "Nunito Sans"; font-weight: 700; src: url(x.woff2); }';
  assert.deepEqual(rules("src/styles/fonts.css", css), []);
});

test("var(--…) must name a token of tokens.css (or an allowed inline custom property)", () => {
  const tokens = tokenNames(":root { --color-text: #262628; }\n@media (max-width: 767px) { :root { --font-size-h2: 1rem; } }");
  const check = (css) => checkFile("src/components/Card.astro", astro(css), { tokens }).map((v) => v.rule);
  assert.deepEqual(check(".card { color: var(--color-txet); }"), ["unknown-token"]);
  assert.deepEqual(check(".card { color: var(--color-text); font-size: var(--font-size-h2); }"), []);
  assert.deepEqual(check(".card { aspect-ratio: var(--cover-ratio); }"), []);
});

test("the guardrail skips tokens.css and files other than .astro and .css", () => {
  for (const path of ["src/styles/tokens.css", "src/lib/image-widths.ts"]) {
    assert.equal(inScope(path), false, path);
  }
  for (const path of ["src/components/Nav.astro", "src/styles/global.css", "src/pages/index.astro"]) {
    assert.equal(inScope(path), true, path);
  }
});

test("CSS outside tokens.css uses role tokens, never the brand palette", () => {
  const check = (decl) => rules("src/components/Card.astro", astro(`.card { ${decl}; }`));
  for (const bad of [
    "color: var(--pima-dark-green)",
    "background-color: var(--pima-green)",
    "border: 1px solid var(--gray-4)",
    "color: var(--black)",
    "fill: var(--white)",
    "background: color-mix(in srgb, var(--secondary-blue) 20%, transparent)",
    "--accent: var(--pima-pale-lime)",
  ]) {
    assert.deepEqual(check(bad), ["palette-token"], bad);
  }
  for (const good of ["color: var(--color-text)", "background-color: var(--color-background-accent)", "border-color: var(--color-border)"]) {
    assert.deepEqual(check(good), [], good);
  }
});

test("every stylesheet gets every rule: no file is allowed its old media queries", () => {
  assert.equal("WEBFLOW_FILES" in guardrail, false, "no Webflow-file exemption left");
  const css = "@media (min-width: 768px) { a { color: #fff; font-size: 1rem; } }";
  for (const path of ["src/styles/base.css", "src/styles/global.css"]) {
    assert.deepEqual(rules(path, css), ["media-query", "literal-colour", "not-a-token"], path);
  }
});

test("the guardrail checks every .astro and .css file in src/ except tokens.css", () => {
  const all = walk(join(root, "src"))
    .map((f) => f.slice(root.length).split("\\").join("/"))
    .filter((path) => /\.(astro|css)$/.test(path));
  assert.deepEqual(guardrailFiles(), all.filter((path) => path !== "src/styles/tokens.css").sort());
  assert.ok(guardrailFiles().includes("src/styles/base.css"), "base.css is checked");
});

test("packageStylesheets finds a stylesheet imported from a package, not a relative one", () => {
  const { packageStylesheets } = guardrail;
  assert.deepEqual(packageStylesheets('---\nimport "katex/dist/katex.min.css";\nimport "../styles/x.css";\n---'), ["katex/dist/katex.min.css"]);
  assert.deepEqual(packageStylesheets('@import "./tokens.css";\n@import "some-lib/theme.css";'), ["some-lib/theme.css"]);
  assert.deepEqual(packageStylesheets('@import url("@scope/pkg/a.css");'), ["@scope/pkg/a.css"]);
  assert.deepEqual(packageStylesheets('src: url("@fontsource/nunito-sans/files/x.woff2");'), []);
});

// A package's stylesheet is outside src/, so the guardrail cannot check it: each one is allowed
// by name, in the files listed. KaTeX's own (its maths fonts) is the one there is.
test("a stylesheet from a package is imported only where PACKAGE_STYLESHEETS allows it", () => {
  const { PACKAGE_STYLESHEETS, packageStylesheets } = guardrail;
  assert.deepEqual(PACKAGE_STYLESHEETS, { "katex/dist/katex.min.css": ["src/sections/blog/PostBody.astro"] });
  const found = walk(join(root, "src"))
    .map((f) => f.slice(root.length).split("\\").join("/"))
    .filter((path) => /\.(astro|css|ts|mjs|js)$/.test(path))
    .flatMap((path) => packageStylesheets(readFileSync(join(root, path), "utf8")).map((sheet) => [path, sheet]));
  for (const [path, sheet] of found) {
    assert.ok(PACKAGE_STYLESHEETS[sheet]?.includes(path), `${path} imports ${sheet}`);
  }
  assert.deepEqual(found, [["src/sections/blog/PostBody.astro", "katex/dist/katex.min.css"]]);
});

// The repo itself: every file in scope passes.
const tokens = tokenNames(readFileSync(join(root, "src/styles/tokens.css"), "utf8"));
for (const path of guardrailFiles()) {
  test(`${path} takes every design value from tokens.css`, () => {
    const found = checkFile(path, readFileSync(join(root, path), "utf8"), { tokens });
    assert.deepEqual(found.map((v) => `${path}:${v.line} ${v.rule}: ${v.message}`), []);
  });
}
