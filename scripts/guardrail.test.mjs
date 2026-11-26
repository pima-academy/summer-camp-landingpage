// Guardrail for ADR 0004's CSS rules: design values come only from src/styles/tokens.css.
// The rules themselves are in scripts/guardrail-lib.mjs; the last tests run them on the repo.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { checkFile, guardrailFiles, inScope, tokenNames, WEBFLOW_FILES } from "./guardrail-lib.mjs";
import { root } from "./test-lib.mjs";

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
    "letter-spacing: -0.01em",
    "padding: 1.5rem",
  ]) {
    assert.deepEqual(check(good), [], good);
  }
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
  assert.deepEqual(page('style={`--marquee-duration: ${d}s; --marquee-copies: ${Math.max(2, d)}`}'), []);
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
  assert.deepEqual(check(".card { animation-duration: var(--marquee-duration); }"), []);
});

test("the guardrail skips tokens.css and the frozen camp files", () => {
  for (const path of [
    "src/styles/tokens.css",
    "src/camp/styles/webflow.css",
    "src/camp/CampFooter.astro",
    "src/pages/trai-he-toan-hoc-2025.astro",
    "src/pages/trai-he-pima-2026.astro",
    "src/lib/animate.ts",
  ]) {
    assert.equal(inScope(path), false, path);
  }
  for (const path of ["src/components/Nav.astro", "src/styles/global.css", "src/pages/index.astro"]) {
    assert.equal(inScope(path), true, path);
  }
});

test("in the Webflow files only the old one-off media queries are allowed", () => {
  const css = "@media (min-width: 768px) { a { color: #fff; font-size: 1rem; } }";
  for (const path of WEBFLOW_FILES) {
    assert.deepEqual(rules(path, css), ["literal-colour", "not-a-token"], path);
  }
  assert.deepEqual(rules("src/styles/animations.css", css), ["media-query", "literal-colour", "not-a-token"]);
});

// The repo itself: every file in scope passes.
const tokens = tokenNames(readFileSync(join(root, "src/styles/tokens.css"), "utf8"));
for (const path of guardrailFiles()) {
  test(`${path} takes every design value from tokens.css`, () => {
    const found = checkFile(path, readFileSync(join(root, path), "utf8"), { tokens });
    assert.deepEqual(found.map((v) => `${path}:${v.line} ${v.rule}: ${v.message}`), []);
  });
}
