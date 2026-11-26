// The brand guidelines in the repo (#74): `docs/brand.md`, the brand palette in tokens.css, the
// logo files, and the CLAUDE.md line that sends every agent to the doc before UI work.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./test-lib.mjs";
import { literalColour, parseCss, tokenNames } from "./guardrail-lib.mjs";

const tokensCss = readFileSync(join(root, "src/styles/tokens.css"), "utf8");

/** Each custom property of the top-level `:root` block with its value. */
function rootTokens(css) {
  const rule = parseCss(css).find((n) => n.type === "rule" && n.selector === ":root");
  return Object.fromEntries(rule.children.filter((n) => n.type === "decl").map((n) => [n.prop, n.value]));
}

test("tokens.css holds the PiMA palette", () => {
  const tokens = rootTokens(tokensCss);
  const palette = {
    "--pima-green": "#50b448",
    "--pima-dark-green": "#275613",
    "--pima-pale-lime": "#d4e889",
    "--black": "#000000",
    "--gray-1": "#434343",
    "--gray-2": "#666666",
    "--gray-3": "#999999",
    "--gray-4": "#d9d9d9",
    "--gray-5": "#efefef",
    "--white": "#ffffff",
    "--secondary-red": "#e9542c",
    "--secondary-orange": "#ff9e1d",
    "--secondary-yellow": "#f6c545",
    "--secondary-sky-blue": "#37b2db",
    "--secondary-blue": "#3379b8",
    "--secondary-pink": "#f99ad3",
    "--secondary-purple": "#9e61c8",
    "--secondary-brown": "#91632f",
  };
  for (const [name, value] of Object.entries(palette)) {
    assert.equal(tokens[name]?.toLowerCase(), value, name);
  }
});

/** Palette tokens: the only custom properties in tokens.css that may hold a literal colour. */
const PALETTE = /^--(pima-|black$|white$|gray-\d$|secondary-)/;
/** The dev-only content-gap marker is not part of the site's look. */
const DEV_ONLY = /^--(color|font)-content-gap/;

/** Every custom property declared in tokens.css (every `:root`, media blocks included). */
function allTokenDecls(css) {
  const out = [];
  const visit = (nodes) => {
    for (const n of nodes) {
      if (n.type === "decl" && n.prop.startsWith("--")) out.push(n);
      if (n.children) visit(n.children);
    }
  };
  visit(parseCss(css));
  return out;
}

test("every colour in tokens.css outside the palette points at a palette token", () => {
  const literal = allTokenDecls(tokensCss)
    .filter((d) => !PALETTE.test(d.prop) && !DEV_ONLY.test(d.prop))
    .filter((d) => literalColour(d.value))
    .map((d) => `${d.prop}: ${d.value}`);
  assert.deepEqual(literal, []);
});

/** The `--token` names a Markdown text mentions, in order of first mention. */
const docTokens = (md) => [...new Set(md.match(/(?<![\w-])--[a-z][a-z0-9]*(?:-[a-z0-9]+)*/g) ?? [])];

test("docTokens finds each --token once and skips dashes", () => {
  assert.deepEqual(docTokens("Use `--pima-green` -- or --gray-1, then `--pima-green` again."), [
    "--pima-green",
    "--gray-1",
  ]);
});

test("every --token named in docs/brand.md exists in tokens.css", () => {
  const path = join(root, "docs/brand.md");
  assert.ok(existsSync(path), "docs/brand.md is missing");
  const named = docTokens(readFileSync(path, "utf8"));
  assert.ok(named.length > 0, "docs/brand.md names no token");
  const declared = tokenNames(tokensCss);
  assert.deepEqual(named.filter((name) => !declared.has(name)), []);
});

test("CLAUDE.md's Building UI section starts by sending agents to docs/brand.md", () => {
  const claude = readFileSync(join(root, "CLAUDE.md"), "utf8");
  const section = claude.split(/^## Building UI\n+/m)[1] ?? "";
  assert.equal(
    section.split("\n")[0],
    "- Before any UI work (a new section or component, or a style change), read `docs/brand.md`.",
  );
});

/** The `@font-face` rules of a stylesheet as "<weight> <style> <subset>" strings, sorted. */
function fontFaces(css) {
  return parseCss(css)
    .filter((n) => n.type === "atrule" && n.name === "font-face")
    .map((n) => {
      const d = Object.fromEntries(n.children.filter((c) => c.type === "decl").map((c) => [c.prop, c.value]));
      const subset = d.src.match(/nunito-sans-([a-z]+)-\d+-normal/)?.[1];
      return `${d["font-weight"]} ${d["font-style"]} ${subset}`;
    })
    .sort();
}

test("fonts.css loads Nunito Sans 400, 600, 700, 800 and 900 upright, Latin and Vietnamese", () => {
  const fontsCss = readFileSync(join(root, "src/styles/fonts.css"), "utf8");
  const expected = ["400", "600", "700", "800", "900"]
    .flatMap((w) => ["latin", "vietnamese"].map((s) => `${w} normal ${s}`))
    .sort();
  assert.deepEqual(fontFaces(fontsCss), expected);
});

test("src/assets/logo/ holds the ten brand logo files", () => {
  const expected = ["horizontal", "stacked"]
    .flatMap((shape) => ["green", "darkgreen", "lime", "black", "white"].map((c) => `pima-logo-${shape}-${c}.png`))
    .sort();
  const dir = join(root, "src/assets/logo");
  assert.deepEqual(existsSync(dir) ? readdirSync(dir).sort() : [], expected);
});
