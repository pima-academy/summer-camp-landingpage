// Camp archive photo pipeline (spec #93, "Photo pipeline"). Run by hand on originals before
// committing photos under src/assets/camp-archive/<year>/; the build never runs it.
//
// Usage (Node 24, from the repo root):
//
//   node scripts/camp-photos.mjs gallery <originals-folder> <output-folder>
//     Every photo directly inside <originals-folder> (.jpg .jpeg .png .webp .avif .tif .tiff;
//     other files are listed and skipped, subfolders ignored) is written to <output-folder>
//     (created if missing) as a JPEG: at most 1600 px on the long side (never enlarged),
//     quality 80, EXIF orientation applied, metadata stripped. The name is kept, lower-cased
//     and slugged: "Ảnh Lớp Học 01.JPG" -> "anh-lop-hoc-01.jpg".
//     Typical: node scripts/camp-photos.mjs gallery ~/originals/2019/khai-mac \
//                src/assets/camp-archive/2019/khai-mac
//     The originals go to "<year>/6. Hình ảnh/<section>/" on the shared drive (ADR 0006).
//
// Prints each photo's file size and dimensions before and after, and the totals.
// Exits non-zero, writing nothing, when an argument is wrong or two names slug alike.

import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import sharp from "sharp";

const PHOTO_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);
const GALLERY = { longSide: 1600, quality: 80 };

const USAGE = `Usage:
  node scripts/camp-photos.mjs gallery <originals-folder> <output-folder>
See the header comment of scripts/camp-photos.mjs for details.`;

function fail(message) {
  console.error(`camp-photos: ${message}\n\n${USAGE}`);
  process.exit(1);
}

/** "Ảnh Lớp Học 01.JPG" -> "anh-lop-hoc-01.jpg". */
export function slugName(file) {
  const stem = basename(file, extname(file))
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${stem || "photo"}.jpg`;
}

const kb = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`);

/** Decodes `file` with its EXIF orientation applied, as a sharp pipeline ready for crop and resize. */
async function oriented(file) {
  const buffer = await sharp(file).rotate().toBuffer();
  return sharp(buffer);
}

async function report(from, to) {
  const [a, b] = await Promise.all([sharp(from).metadata(), sharp(to).metadata()]);
  const [sa, sb] = [statSync(from).size, statSync(to).size];
  const swap = (a.orientation ?? 1) >= 5;
  const [wa, ha] = swap ? [a.height, a.width] : [a.width, a.height];
  console.log(`${basename(from)}  ${kb(sa)} ${wa}x${ha}  ->  ${basename(to)}  ${kb(sb)} ${b.width}x${b.height}`);
  return [sa, sb];
}

async function gallery(inputDir, outputDir) {
  if (!inputDir || !outputDir) fail("gallery needs an originals folder and an output folder.");
  if (!existsSync(inputDir) || !statSync(inputDir).isDirectory()) fail(`not a folder: ${inputDir}`);
  if (resolve(inputDir) === resolve(outputDir)) fail("the output folder must differ from the originals folder.");

  const entries = readdirSync(inputDir, { withFileTypes: true }).filter((e) => e.isFile());
  const photos = entries.filter((e) => PHOTO_EXTENSIONS.has(extname(e.name).toLowerCase())).map((e) => e.name).sort();
  for (const e of entries) if (!photos.includes(e.name)) console.log(`skipped (not a photo): ${e.name}`);
  if (photos.length === 0) fail(`no photos in ${inputDir}`);

  const byName = new Map();
  for (const name of photos) {
    const out = slugName(name);
    if (byName.has(out)) fail(`"${byName.get(out)}" and "${name}" would both become ${out}; rename one.`);
    byName.set(out, name);
  }

  mkdirSync(outputDir, { recursive: true });
  let [before, afterSize] = [0, 0];
  for (const [out, name] of byName) {
    const from = join(inputDir, name);
    const to = join(outputDir, out);
    const img = await oriented(from);
    await img
      .resize(GALLERY.longSide, GALLERY.longSide, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: GALLERY.quality, mozjpeg: true })
      .toFile(to);
    const [sa, sb] = await report(from, to);
    before += sa;
    afterSize += sb;
  }
  console.log(`${byName.size} photos: ${kb(before)} -> ${kb(afterSize)}`);
}

const [mode, ...args] = process.argv.slice(2);
if (mode === "gallery") await gallery(...args);
else fail(mode ? `unknown mode "${mode}".` : "no mode given.");
