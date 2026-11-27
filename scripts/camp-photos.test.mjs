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
