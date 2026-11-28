// The brand guidelines in the repo (#74): `docs/brand.md`, the brand palette in tokens.css, the
// logo files, and the CLAUDE.md line that sends every agent to the doc before UI work.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./test-lib.mjs";
import { literalColour, PALETTE_TOKEN, parseCss, tokenNames } from "./guardrail-lib.mjs";

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
    // Palette tokens are the only custom properties that may hold a literal colour.
    .filter((d) => !PALETTE_TOKEN.test(d.prop) && !DEV_ONLY.test(d.prop))
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

/**
 * The tokens as a viewport `width` px wide sees them: the top-level `:root`, then each
 * `@media (max-width: N)` block with N ≥ width, in source order; var() references resolved.
 */
function tokensAt(css, width) {
  const raw = {};
  const take = (rule) => rule.children.filter((n) => n.type === "decl").forEach((n) => (raw[n.prop] = n.value));
  for (const n of parseCss(css)) {
    if (n.type === "rule" && n.selector === ":root") take(n);
    const max = n.type === "atrule" && n.name === "media" ? Number(n.prelude.match(/max-width:\s*(\d+)px/)?.[1]) : NaN;
    if (max >= width) n.children.filter((c) => c.type === "rule" && c.selector === ":root").forEach(take);
  }
  const resolve = (v) => v.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, name) => resolve(raw[name] ?? `<missing ${name}>`));
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, resolve(v)]));
}

test("tokensAt applies the media blocks of a width and resolves var()", () => {
  const css = `:root { --a: 1px; --b: var(--a); }
    @media screen and (max-width: 767px) { :root { --a: 2px; } }`;
  assert.deepEqual(tokensAt(css, 1440), { "--a": "1px", "--b": "1px" });
  assert.deepEqual(tokensAt(css, 390), { "--a": "2px", "--b": "2px" });
});

test("font weight tokens are only the brand's 400, 600, 700, 800 and 900", () => {
  for (const width of [1440, 390]) {
    const weights = Object.entries(tokensAt(tokensCss, width)).filter(([k]) => k.startsWith("--font-weight-"));
    assert.deepEqual(weights.filter(([, v]) => !["400", "600", "700", "800", "900"].includes(v)), [], `at ${width}px`);
  }
});

test("type tokens follow the spec's web scale", () => {
  // Spec #56, "Brand look" → Type: [desktop, ≤ 767 px].
  const scale = {
    "--font-size-h1": ["48px", "32px"],
    "--line-height-h1": ["1.15", "1.15"],
    "--font-weight-h1": ["800", "800"],
    "--font-size-h2": ["36px", "26px"],
    "--line-height-h2": ["1.2", "1.2"],
    "--font-weight-h2": ["800", "800"],
    "--font-size-h3": ["22px", "19px"],
    "--line-height-h3": ["1.3", "1.3"],
    "--font-weight-h3": ["800", "800"],
    "--font-size-body": ["16px", "16px"],
    "--line-height-body": ["1.6", "1.6"],
    "--font-weight-regular": ["400", "400"],
    "--font-size-kicker": ["14px", "14px"],
    "--letter-spacing-kicker": ["0.08em", "0.08em"],
    "--font-weight-extrabold": ["800", "800"],
    "--font-weight-black": ["900", "900"],
    "--font-weight-semibold": ["600", "600"],
    "--font-weight-bold": ["700", "700"],
  };
  for (const [i, width] of [1440, 390].entries()) {
    const tokens = tokensAt(tokensCss, width);
    const got = Object.fromEntries(Object.keys(scale).map((k) => [k, tokens[k]]));
    const want = Object.fromEntries(Object.entries(scale).map(([k, v]) => [k, v[i]]));
    assert.deepEqual(got, want, `at ${width}px`);
  }
});

test("display type tokens follow the camp archive design (spec #93, prototype #89)", () => {
  // The sizes are fluid clamp()s, so desktop and mobile share one declaration.
  const display = {
    "--font-size-display": "clamp(2.75rem, 6.4vw, 6.5rem)",
    "--font-size-display-2": "clamp(1.75rem, 4.2vw, 4rem)",
    "--line-height-display": "1.1",
    "--letter-spacing-display": "-0.025em",
  };
  for (const width of [1440, 390]) {
    const tokens = tokensAt(tokensCss, width);
    assert.deepEqual(Object.fromEntries(Object.keys(display).map((k) => [k, tokens[k]])), display, `at ${width}px`);
  }
});

test("every heading and display line height is 1.1 or more (stacked Vietnamese diacritics)", () => {
  for (const width of [1440, 991, 767, 390]) {
    const low = Object.entries(tokensAt(tokensCss, width))
      .filter(([k]) => /^--line-height-(h\d|display)$/.test(k))
      .filter(([, v]) => !(Number(v) >= 1.1));
    assert.deepEqual(low, [], `at ${width}px`);
  }
});

test("one corner radius: tokens.css declares --radius (12px) and --radius-circle only", () => {
  const radii = [...tokenNames(tokensCss)].filter((k) => k.startsWith("--radius")).sort();
  assert.deepEqual(radii, ["--radius", "--radius-circle"]);
  assert.equal(tokensAt(tokensCss, 1440)["--radius"], "12px");
});

test("base CSS clips every img to its box, so an object-fit: cover crop paints nothing outside it", () => {
  const baseCss = readFileSync(join(root, "src/styles/base.css"), "utf8");
  const img = parseCss(baseCss).find((n) => n.type === "rule" && n.selector === "img");
  const overflow = img?.children.filter((n) => n.type === "decl" && n.prop === "overflow").map((n) => n.value);
  assert.deepEqual(overflow, ["clip"]);
});

test("src/assets/logo/ holds the ten brand logo files", () => {
  const expected = ["horizontal", "stacked"]
    .flatMap((shape) => ["green", "darkgreen", "lime", "black", "white"].map((c) => `pima-logo-${shape}-${c}.png`))
    .sort();
  const dir = join(root, "src/assets/logo");
  assert.deepEqual(existsSync(dir) ? readdirSync(dir).sort() : [], expected);
});
