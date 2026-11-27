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
//   node scripts/camp-photos.mjs cover <original> <output.jpg> [--crop <left>,<top>,<width>,<height>]
//     One photo in, one JPEG out (its folder created if missing): EXIF orientation applied,
//     the optional crop box cut, at most 2880 px wide (never enlarged), a mild unsharp mask
//     (radius 1.1, 58 %), quality 92 without chroma subsampling (4:4:4), metadata stripped.
//     The crop box is in whole pixels of the upright original: left and top of its corner,
//     then its width and height. Use it to cut text baked into an old-site banner
//     (_data/banners.yaml), e.g. 2019's "PIMA 2019"; `info` gives the size to measure from.
//     Prefer a camera original. Run it once per photo: its output is already sharpened, so
//     never feed an output back in. A cover committed as received (2024, 2025 per campus,
//     2026) is processed from a copy, onto its committed path:
//       cp src/assets/camp-archive/2026/cover.jpg /tmp/cover-2026-original.jpg
//       node scripts/camp-photos.mjs cover /tmp/cover-2026-original.jpg src/assets/camp-archive/2026/cover.jpg
//     Typical, from an old-site banner: node scripts/camp-photos.mjs cover \
//       <old-site-clone>/<banner-2019>.jpg src/assets/camp-archive/2019/cover.jpg --crop 0,180,3983,1500
//     (the crop numbers here only show the format; measure the real box on the banner).
//
//   node scripts/camp-photos.mjs info <photo>...
//     Prints each photo's file size and its width x height as shown (EXIF orientation
//     applied), the frame a --crop box is measured in. Writes nothing.
//
// gallery and cover print each photo's file size and dimensions before and after;
// gallery also prints the totals.
// Exits non-zero, writing nothing, when an argument is wrong or two names slug alike.

import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import sharp from "sharp";

const PHOTO_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);
const GALLERY = { longSide: 1600, quality: 80 };
// Unsharp mask of radius 1.1 px and amount 58 % on lightness: libvips' sharpen with one
// slope (m1 = m2 = amount, no flat/jagged threshold) and clamps (y2, y3, in L*) set past
// the L* range so nothing caps the effect, as in an image editor's unsharp mask.
const COVER = { maxWidth: 2880, quality: 92, unsharp: { sigma: 1.1, m1: 0.58, m2: 0.58, x1: 0, y2: 100, y3: 100 } };

const USAGE = `Usage:
  node scripts/camp-photos.mjs gallery <originals-folder> <output-folder>
  node scripts/camp-photos.mjs cover <original> <output.jpg> [--crop <left>,<top>,<width>,<height>]
  node scripts/camp-photos.mjs info <photo>...
See the header comment of scripts/camp-photos.mjs for details.`;

function fail(message) {
  console.error(`camp-photos: ${message}\n\n${USAGE}`);
  process.exit(1);
}

/** "Ảnh Lớp Học 01.JPG" -> "anh-lop-hoc-01.jpg". */
function slugName(file) {
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

/** "<name>  <size> <width>x<height>", the dimensions as the photo is shown (EXIF orientation 5-8 swaps them). */
async function describe(file) {
  const { width, height, orientation = 1 } = await sharp(file).metadata();
  const [w, h] = orientation >= 5 ? [height, width] : [width, height];
  return `${basename(file)}  ${kb(statSync(file).size)} ${w}x${h}`;
}

/** Prints the before and after of one photo; returns both file sizes. */
async function report(from, to) {
  console.log(`${await describe(from)}  ->  ${await describe(to)}`);
  return [statSync(from).size, statSync(to).size];
}

async function info(files) {
  if (files.length === 0) fail("info needs at least one photo.");
  for (const file of files) {
    if (!existsSync(file) || !statSync(file).isFile()) fail(`not a file: ${file}`);
    console.log(await describe(file));
  }
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

/** "--crop 0,120,3983,1400" -> {left, top, width, height}; undefined without --crop. */
function parseCrop(args) {
  const at = args.indexOf("--crop");
  if (at === -1) return undefined;
  const parts = (args[at + 1] ?? "").split(",").map(Number);
  if (parts.length !== 4 || !parts.every((n) => Number.isInteger(n) && n >= 0) || parts[2] === 0 || parts[3] === 0) {
    fail(`--crop takes <left>,<top>,<width>,<height> in whole pixels, got "${args[at + 1] ?? ""}".`);
  }
  args.splice(at, 2);
  const [left, top, width, height] = parts;
  return { left, top, width, height };
}

async function cover(args) {
  const crop = parseCrop(args);
  const [input, output, ...extra] = args;
  if (!input || !output || extra.length) fail("cover needs one photo, one output file and at most --crop.");
  if (!existsSync(input) || !statSync(input).isFile()) fail(`not a file: ${input}`);
  if (resolve(input) === resolve(output)) fail("the output file must differ from the original.");

  let img = await oriented(input);
  if (crop) {
    const { width, height } = await img.metadata();
    if (crop.left + crop.width > width || crop.top + crop.height > height) {
      fail(`the crop box ${crop.left},${crop.top},${crop.width},${crop.height} leaves the ${width}x${height} photo.`);
    }
    img = img.extract(crop);
  }
  mkdirSync(dirname(resolve(output)), { recursive: true });
  await img
    .resize({ width: COVER.maxWidth, withoutEnlargement: true })
    .sharpen(COVER.unsharp)
    .jpeg({ quality: COVER.quality, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(output);
  await report(input, output);
}

const [mode, ...args] = process.argv.slice(2);
if (mode === "gallery") await gallery(...args);
else if (mode === "cover") await cover(args);
else if (mode === "info") await info(args);
else fail(mode ? `unknown mode "${mode}".` : "no mode given.");
