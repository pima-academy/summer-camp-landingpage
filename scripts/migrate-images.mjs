// One-off image migration (issue #19): copies the originals referenced by the 14
// migrating pages in site/ into src/assets/images/ under lowercase ASCII kebab-case
// names, copies favicon.png and webclip.png to public/, and writes
// scripts/image-map.json (old markup path -> new file name).
// Run: node scripts/migrate-images.mjs, then node scripts/check-image-map.mjs.
// Deleted together with scripts/image-map.json in the switch-over cleanup.
// Done; do not run it again: spec #56 (refactor and brand alignment) deleted or replaced some of
// the files it copies (favicon.png, webclip.png, logo-horizontal.avif, logo-1-green.svg,
// ellipse.svg, fb.png), and a new run would bring them back and rewrite image-map.json.
import { readFileSync, readdirSync, writeFileSync, copyFileSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const SKIPPED_PAGES = new Set(["401.html", "style-guide.html"]);
const PUBLIC_FILES = new Set(["favicon.png", "webclip.png"]);
const oldFiles = new Set(readdirSync(`${root}site/images`));

// Original upload name -> new name, for the cases the generic rule gets wrong.
// Webflow turned "Artboard N@Kx" into "Artboard-NKx". The spec names
// "Artboard 7@3x" -> artboard-7, so the @Kx density suffix is dropped. The @4x
// set (Artboard-24x ... Artboard-74x) keeps "-4x": dropping it would collide with
// Artboard-22x (artboard-2) and Artboard-73x (artboard-7), which are different images.
const DENSITY = /^Artboard-(\d)([234])x$/;

const stemOf = (f) => f.slice(0, f.lastIndexOf("."));
const extOf = (f) => f.slice(f.lastIndexOf(".") + 1).toLowerCase();

function newName(file) {
  const dot = file.lastIndexOf(".");
  let stem = file.slice(0, dot);
  const ext = file.slice(dot + 1).toLowerCase();
  // Webflow appends "_N" on re-upload and leaves a doubled sibling "X_NX.ext"
  // (its 500w variant; "Artboard-73x_1Artboard 7@3x.avif" spells X differently,
  // hence the alphanumeric comparison). Only strip "_N" when that sibling exists.
  const alnum = (s) => s.replace(/[^\p{L}\p{N}]/gu, "");
  const suffix = stem.match(/^(.+)_\d$/);
  if (suffix && [...oldFiles].some((f) => f.startsWith(stem) && alnum(stemOf(f.slice(stem.length))) === alnum(suffix[1]))) {
    stem = suffix[1];
  }
  stem = stem.replace(/\.svg$/, ""); // "Logo.svg.avif": Webflow's svg -> avif conversion
  const density = stem.match(DENSITY);
  if (density) stem = density[2] === "4" ? `Artboard-${density[1]}-4x` : `Artboard-${density[1]}`;
  const kebab = stem
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${kebab}.${ext}`;
}

// Collect refs per tag. The original is the <img> src (or <link> href); every
// srcset entry is a Webflow variant of it (-p-NNN or doubled-name X_1X).
const map = {};
const copied = new Map(); // new name -> original file; refuses two originals with one name
for (const page of readdirSync(`${root}site`).filter((f) => f.endsWith(".html") && !SKIPPED_PAGES.has(f))) {
  const html = readFileSync(`${root}site/${page}`, "utf8");
  for (const [tag] of html.matchAll(/<(img|link)\b[^>]*>/g)) {
    const original = tag.match(/\s(?:src|href)="(images\/[^"]*)"/)?.[1];
    if (!original) continue;
    const file = original.slice("images/".length);
    if (!oldFiles.has(file)) throw new Error(`${page}: src points at a missing file: ${original}`);
    const name = PUBLIC_FILES.has(file) ? file : newName(file);
    // Two old names for one byte-identical file (…_n_1.avif / …_n_2.avif) share one
    // new file; two different files with one new name are a collision.
    if (copied.has(name)) {
      const other = copied.get(name);
      if (other !== file && !readFileSync(`${root}site/images/${other}`).equals(readFileSync(`${root}site/images/${file}`))) {
        throw new Error(`collision: ${other} and ${file} -> ${name}`);
      }
    } else copied.set(name, file);
    const srcset = tag.match(/\ssrcset="([^"]*)"/)?.[1] ?? "";
    const variants = srcset.split(",").map((s) => s.trim().split(/\s+/)[0]).filter(Boolean);
    for (const ref of [original, ...variants]) {
      if (map[ref] && map[ref] !== name) {
        // A variant shared by two originals of one image in different formats
        // (logo_horizontal.png and .avif): keep the one with the variant's extension.
        if (stemOf(map[ref]) !== stemOf(name)) throw new Error(`${ref} maps to both ${map[ref]} and ${name}`);
        if (extOf(ref) !== extOf(name)) continue;
      }
      map[ref] = name;
    }
  }
}

for (const [name, file] of copied) {
  copyFileSync(`${root}site/images/${file}`, PUBLIC_FILES.has(name) ? `${root}public/${name}` : `${root}src/assets/images/${name}`);
}

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(`${root}scripts/image-map.json`, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`${Object.keys(map).length} map keys, ${copied.size - PUBLIC_FILES.size} originals copied to src/assets/images, ${PUBLIC_FILES.size} to public/`);
