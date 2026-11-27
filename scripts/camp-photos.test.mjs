// Runs scripts/camp-photos.mjs as a user would, on synthetic photos in a temporary folder.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import sharp from "sharp";
import { root } from "./test-lib.mjs";

const work = mkdtempSync(join(tmpdir(), "camp-photos-"));
after(() => rmSync(work, { recursive: true, force: true }));

const run = (...args) => spawnSync(process.execPath, [join(root, "scripts/camp-photos.mjs"), ...args], { encoding: "utf8" });

/** A noisy photo-like JPEG of the given size, with optional EXIF orientation. */
async function photo(path, width, height, orientation) {
  const noise = Buffer.alloc(width * height * 3);
  for (let i = 0; i < noise.length; i++) noise[i] = (i * 7919) % 251;
  let img = sharp(noise, { raw: { width, height, channels: 3 } });
  if (orientation) img = img.withMetadata({ orientation });
  await img.jpeg({ quality: 95 }).toFile(path);
}

test("gallery mode fits each photo into 1600 px, applies its orientation, strips metadata and slugs its name", async () => {
  const input = join(work, "gallery-in");
  const output = join(work, "gallery-out");
  mkdirSync(input);
  await photo(join(input, "Ảnh Lớp Học 01.JPG"), 3000, 2000, 6); // stored landscape, shown portrait
  await photo(join(input, "small.jpg"), 800, 600);
  writeFileSync(join(input, "notes.txt"), "not a photo");

  const result = run("gallery", input, output);
  assert.equal(result.status, 0, result.stderr);

  assert.deepEqual(readdirSync(output).sort(), ["anh-lop-hoc-01.jpg", "small.jpg"]);
  const big = await sharp(join(output, "anh-lop-hoc-01.jpg")).metadata();
  assert.deepEqual([big.width, big.height], [1067, 1600]);
  assert.equal(big.orientation, undefined);
  assert.equal(big.exif, undefined);
  const small = await sharp(join(output, "small.jpg")).metadata();
  assert.deepEqual([small.width, small.height], [800, 600], "never enlarged");
  assert.match(result.stdout, /anh-lop-hoc-01\.jpg/);
});

test("cover mode fits the photo into 2880 px wide and saves it without chroma subsampling", async () => {
  const input = join(work, "wide-cover.jpg");
  const output = join(work, "covers", "cover.jpg");
  await photo(input, 4000, 1500);

  const result = run("cover", input, output);
  assert.equal(result.status, 0, result.stderr);

  const meta = await sharp(output).metadata();
  assert.deepEqual([meta.width, meta.height], [2880, 1080]);
  assert.equal(meta.chromaSubsampling, "4:4:4");
  assert.equal(meta.exif, undefined);
  assert.match(result.stdout, /cover\.jpg/);
});

test("cover mode crops the box given in pixels of the upright photo before resizing", async () => {
  const input = join(work, "banner.jpg");
  const output = join(work, "banner-cover.jpg");
  await photo(input, 2000, 1000);

  const result = run("cover", input, output, "--crop", "0,200,1600,800");
  assert.equal(result.status, 0, result.stderr);

  const meta = await sharp(output).metadata();
  assert.deepEqual([meta.width, meta.height], [1600, 800], "cropped, never enlarged");
});

test("info mode prints the upright size of each photo, to pick a crop box from", async () => {
  const input = join(work, "sideways.jpg");
  await photo(input, 1200, 900, 6);

  const result = run("info", input);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /sideways\.jpg\s.*\b900x1200\b/);
});

test("a crop box outside the photo is refused and nothing is written", async () => {
  const input = join(work, "small-banner.jpg");
  await photo(input, 1000, 500);

  const result = run("cover", input, join(work, "refused.jpg"), "--crop", "500,0,600,500");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /crop/);
  assert.equal(readdirSync(work).includes("refused.jpg"), false);
});
