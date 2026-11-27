// The site's fonts in the build: Nunito Sans everywhere, self-hosted. The one exception is KaTeX's
// own maths fonts (spec #110, #112), served from the build (no CDN) and loaded only by blog post
// pages, whose formulas use them. Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { parseCss } from "./guardrail-lib.mjs";
import { builtHtmlFiles, dist, distSkip as skip, walk } from "./test-lib.mjs";

/** The @font-face rules of a stylesheet as { family, urls }. */
function fontFaces(css) {
  return parseCss(css)
    .filter((n) => n.type === "atrule" && n.name === "font-face")
    .map((n) => {
      const decls = Object.fromEntries(n.children.filter((c) => c.type === "decl").map((c) => [c.prop, c.value]));
      return {
        family: decls["font-family"].replace(/^["']|["']$/g, ""),
        urls: [...decls.src.matchAll(/url\(\s*["']?([^"')]+)/g)].map((m) => m[1]),
      };
    });
}

const KATEX_FAMILY = /^KaTeX_[A-Za-z0-9]+$/;
const sheets = walk(join(dist, "_astro")).filter((f) => f.endsWith(".css"));
const facesOf = (file) => fontFaces(readFileSync(file, "utf8"));
const hasKatexFaces = (file) => facesOf(file).some((f) => KATEX_FAMILY.test(f.family));

test("every font face in the build is Nunito Sans or KaTeX's own, served from the build", { skip }, () => {
  const faces = sheets.flatMap(facesOf);
  assert.ok(faces.some((f) => f.family === "Nunito Sans"), "Nunito Sans");
  assert.ok(faces.some((f) => KATEX_FAMILY.test(f.family)), "KaTeX's fonts");
  for (const { family, urls } of faces) {
    assert.ok(family === "Nunito Sans" || KATEX_FAMILY.test(family), `font family ${family}`);
    // A file of the build (KaTeX's faces point at KaTeX's files, Nunito Sans's at its own), or
    // a small font Vite inlined as a data: URI.
    const file = family === "Nunito Sans" ? "nunito-sans-" : `${family}-`;
    for (const url of urls.filter((u) => !u.startsWith("data:font/"))) {
      assert.match(url, /^\/_astro\/[^/]+\.(woff2|woff|ttf)$/, `${family}: ${url}`);
      assert.ok(basename(url).startsWith(file), `${family}: ${url}`);
    }
  }
});

test("every font file in the build is Nunito Sans's or KaTeX's", { skip }, () => {
  const fonts = walk(dist).filter((f) => /\.(woff2?|ttf|otf|eot)$/.test(f));
  for (const font of fonts) assert.match(basename(font), /^(nunito-sans-|KaTeX_)/, relative(dist, font));
});

/** The stylesheets a built page links. */
const linkedSheets = (html) => [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => join(dist, m[1]));

test("only blog post pages load KaTeX's stylesheet, and a post with formulas does", { skip }, () => {
  for (const file of builtHtmlFiles()) {
    const page = `/${relative(dist, file)}`.replace(/index\.html$/, "");
    const katex = linkedSheets(readFileSync(file, "utf8")).some(hasKatexFaces);
    if (katex) assert.match(page, /^\/blog\/[^/]+\/$/, `${page} loads KaTeX's stylesheet`);
    if (page === "/blog/softmax/") assert.ok(katex, "/blog/softmax/ loads KaTeX's stylesheet");
  }
});
