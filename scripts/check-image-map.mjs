// Verifies the image migration (issue #19) against the old Webflow markup in site/.
// Run: node scripts/check-image-map.mjs. Exits non-zero on any failure.
// Deleted together with scripts/image-map.json in the switch-over cleanup.
// Out of date since spec #56: the refactor and brand alignment deleted or replaced files the
// map points at (favicon.png, webclip.png, logo-horizontal.avif, logo-1-green.svg, ellipse.svg,
// fb.png) and added og-fallback.png, so this check no longer passes. It is kept, unrun, as the
// record of the #19 migration until the switch-over cleanup deletes it; image-map.json is not a
// list of the current assets.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const root = new URL("..", import.meta.url).pathname;
const SKIPPED_PAGES = new Set(["401.html", "style-guide.html"]);
const PUBLIC_FILES = new Set(["favicon.png", "webclip.png"]);
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9]+$/;

const failures = [];
const fail = (msg) => failures.push(msg);
const md5 = (path) => createHash("md5").update(readFileSync(path)).digest("hex");

const pages = readdirSync(`${root}site`).filter((f) => f.endsWith(".html") && !SKIPPED_PAGES.has(f));
const map = JSON.parse(readFileSync(`${root}scripts/image-map.json`, "utf8"));
const assetDir = `${root}src/assets/images`;
const assets = readdirSync(assetDir).filter((f) => f !== ".keep");

// 1. Every image reference in the 14 pages is a key of the map.
//    Groups: each <img> (src + srcset) must map to a single new name.
const refs = new Set();
for (const page of pages) {
  const html = readFileSync(`${root}site/${page}`, "utf8");
  for (const [tag] of html.matchAll(/<(img|link)\b[^>]*>/g)) {
    const group = [];
    for (const [, attr, value] of tag.matchAll(/\s(src|srcset|href)="([^"]*)"/g)) {
      const urls = attr === "srcset" ? value.split(",").map((s) => s.trim().split(/\s+/)[0]) : [value];
      group.push(...urls.filter((u) => u.startsWith("images/")));
    }
    for (const ref of group) {
      refs.add(ref);
      if (!(ref in map)) fail(`${page}: ${ref} missing from image-map.json`);
    }
    // Same image; only the format may differ (logo-horizontal.png / .avif share variants).
    const stems = new Set(group.filter((r) => r in map).map((r) => map[r].replace(/\.[^.]+$/, "")));
    if (stems.size > 1) fail(`${page}: one tag maps to several images: ${group.join(" ")}`);
  }
}
for (const key of Object.keys(map)) if (!refs.has(key)) fail(`map key not referenced by any page: ${key}`);

// 2. Map values: kebab-case, and each one exists exactly where it should.
const values = new Set(Object.values(map));
for (const name of values) {
  if (!KEBAB.test(name)) fail(`not lowercase ASCII kebab-case: ${name}`);
  if (PUBLIC_FILES.has(name)) continue;
  if (!assets.includes(name)) fail(`mapped file missing from src/assets/images: ${name}`);
}
for (const name of assets) if (!values.has(name)) fail(`unmapped file in src/assets/images: ${name}`);

// 3. Each asset is a byte-identical copy of the old file its src points at,
//    and no old file is copied twice (no collisions, no duplicates).
const sourceOf = new Map(); // new name -> old src key whose file exists on disk
for (const [key, name] of Object.entries(map)) {
  if (existsSync(`${root}site/${key}`) && md5(`${root}site/${key}`) === md5(PUBLIC_FILES.has(name) ? `${root}public/${name}` : `${assetDir}/${name}`)) {
    sourceOf.set(name, key);
  }
}
for (const name of values) if (!sourceOf.has(name)) fail(`${name} is not a byte copy of any old file mapped to it`);
const hashes = assets.map((n) => md5(`${assetDir}/${n}`));
if (new Set(hashes).size !== hashes.length) fail("two files in src/assets/images are identical");

// 4. Ticket-specific expectations.
const expect = (key, name) => map[key] === name || fail(`${key} should map to ${name}, got ${map[key]}`);
expect("images/Artboard-73x_1.avif", "artboard-7.avif");
expect("images/Artboard-73x_1Artboard-73x.avif", "artboard-7.avif");
expect("images/Lớp-học.jpg", "lop-hoc.jpg");
for (const f of PUBLIC_FILES) if (!existsSync(`${root}public/${f}`)) fail(`public/${f} missing`);

// 5. site/ unchanged.
try {
  execFileSync("git", ["diff", "--quiet", "HEAD", "--", "site"], { cwd: root });
} catch {
  fail("site/ has changes");
}

console.log(`${pages.length} pages, ${refs.size} distinct image references, ${Object.keys(map).length} map keys, ${assets.length} files in src/assets/images`);
if (failures.length) {
  console.error(failures.map((f) => `FAIL ${f}`).join("\n"));
  process.exit(1);
}
console.log("OK");
