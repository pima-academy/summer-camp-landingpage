// Icons (docs/brand.md, "Icons"; spec #56, "Brand look"): every icon is a Tabler SVG from src/assets/icons/, drawn by the `Icon` primitive in currentColor;
// contact and social icons sit in brand circles; no unused icon file is left behind.
// The dist/ checks need a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { builtHtmlFiles, dist, distSkip as skip, readBuilt, root, walk } from "./test-lib.mjs";

const iconsDir = join(root, "src/assets/icons");
const iconFiles = existsSync(iconsDir) ? readdirSync(iconsDir).filter((f) => f.endsWith(".svg")) : [];
const iconNames = iconFiles.map((f) => f.slice(0, -".svg".length));

const rel = (file) => relative(root, file).split(sep).join("/");
/** Every .astro and .ts file under src/, as [path, text]. */
const aligned = walk(join(root, "src"))
  .map(rel)
  .filter((p) => /\.(astro|ts)$/.test(p))
  .map((p) => [p, readFileSync(join(root, p), "utf8")]);
const iconComponent = "src/components/Icon.astro";
const cataloguePage = "src/pages/catalogue/[...path].astro";

// The old raster and SVG icons (the inventory's icon list), all deleted.
const OLD_ICONS = [
  "fb.png",
  "facebook.png",
  "mail.png",
  "mail-1.png",
  "map-pin.png",
  "map-draw.png",
  "phone.png",
  "phone-telephone.png",
  "book-open.png",
  "oval-love-two.png",
  "gift.png",
  "ellipse.svg",
];

test("src/assets/icons/ holds Tabler SVGs and their MIT licence", () => {
  assert.ok(iconFiles.length > 0, "src/assets/icons/ has SVG files");
  const licence = join(iconsDir, "LICENSE");
  assert.ok(existsSync(licence), "src/assets/icons/LICENSE exists");
  assert.match(readFileSync(licence, "utf8"), /MIT License[\s\S]*Paweł Kuna/);
});

test("every icon file draws in currentColor only, outline icons at stroke 1.5 on 24 px", () => {
  for (const file of iconFiles) {
    const svg = readFileSync(join(iconsDir, file), "utf8");
    assert.match(svg, /viewBox="0 0 24 24"/, `${file}: 24 px grid`);
    for (const [, attr, value] of svg.matchAll(/\b(fill|stroke)="([^"]*)"/g)) {
      assert.ok(["currentColor", "none"].includes(value), `${file}: ${attr}="${value}"`);
    }
    if (file.endsWith("-filled.svg")) assert.match(svg, /<svg[^>]*fill="currentColor"/, `${file}: filled`);
    else assert.match(svg, /<svg[^>]*stroke-width="1.5"/, `${file}: stroke 1.5`);
  }
});

test("no file draws an icon itself: no inline <svg>, no old icon image", () => {
  for (const [path, text] of aligned) {
    if (path === iconComponent) continue;
    assert.doesNotMatch(text, /<svg[\s>]/, `${path} has an inline <svg>: use <Icon>`);
    for (const old of OLD_ICONS) assert.ok(!text.includes(`/${old}`), `${path} imports ${old}: use <Icon>`);
  }
});

test("every icon file is used by a page (the catalogue does not count)", () => {
  const used = aligned
    .filter(([path]) => path !== cataloguePage)
    .flatMap(([, text]) => [...text.matchAll(/<Icon\b[^>]*?\bname="([^"]+)"/g)].map((m) => m[1]))
    .concat(aligned.flatMap(([, text]) => [...text.matchAll(/\bicon:\s*"([^"]+)"/g)].map((m) => m[1])));
  for (const name of iconNames) assert.ok(used.includes(name), `src/assets/icons/${name}.svg is used by no page`);
  for (const name of used) assert.ok(iconNames.includes(name), `<Icon name="${name}"> has no file`);
});

test("no old icon file is left", () => {
  for (const old of OLD_ICONS) assert.equal(existsSync(join(root, "src/assets/images", old)), false, old);
});

/** Published pages (the dev-only gap pages are not built). */
const pages = () => builtHtmlFiles().map((f) => relative(dist, f).split(sep).join("/"));

// KaTeX draws a few maths marks as SVG (the arrow of \vec, a tall bracket in a blog post): part
// of a formula, not an icon. Such an SVG sits right inside a span of KaTeX's own classes, or, for
// a tall delimiter, inside the sized span that follows KaTeX's `pstrut`.
const KATEX_SVG_PARENT =
  /<span class="(?:katex-[\w-]+|svg-align|hide-tail|stretchy)\b[^"]*"[^>]*>$|<span class="pstrut" style="height:[\d.]+em;"><\/span><span style="(?:width|height):[\d.]+em;(?:width|height):[\d.]+em;">$/;

test("every <svg> on a published page is an Icon (or part of a formula)", { skip }, () => {
  for (const page of pages()) {
    const html = readBuilt(page);
    for (const { 0: svg, index } of html.matchAll(/<svg\b[^>]*>/g)) {
      if (page.startsWith("blog/") && KATEX_SVG_PARENT.test(html.slice(Math.max(0, index - 200), index))) continue;
      assert.match(svg, /\bdata-icon="[\w-]+"/, `${page}: ${svg.slice(0, 120)}`);
    }
  }
});

/** The opening tags of the circled icons inside the first element matching `start`…`end`. */
function circles(html, start, end) {
  const i = html.indexOf(start);
  const j = html.indexOf(end, i);
  const part = i < 0 || j < 0 ? "" : html.slice(i, j);
  return [...part.matchAll(/<span\b[^>]*\bdata-circle\b[^>]*>/g)].map((m) => m[0]);
}

test("contact and social icons sit in brand circles", { skip }, () => {
  const home = readBuilt("index.html");
  const lienHe = readBuilt("lien-he/index.html");
  // Footer: Facebook, email, address and LinkedIn.
  assert.equal(circles(home, "<footer", "</footer>").length, 4, "footer circles");
  // ContactSection: email, Facebook, LinkedIn, YouTube and address, on both of its uses.
  assert.equal(circles(home, 'data-section="contact-section"', "</section>").length, 5, "ContactSection circles (home)");
  assert.equal(circles(lienHe, 'data-section="contact-section"', "</section>").length, 5, "ContactSection circles (lien-he)");
});
