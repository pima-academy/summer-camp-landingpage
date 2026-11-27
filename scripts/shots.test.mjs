import { test } from "node:test";
import assert from "node:assert/strict";
import { PNG } from "pngjs";
import {
  assertLocalUrl,
  compareShots,
  formatComparison,
  isBlockedRequest,
  parseArgs,
  selectPages,
  shotFileName,
} from "./shots-lib.mjs";

test("no arguments selects every published page of the spec's page table", () => {
  const names = selectPages([]).map((p) => p.name);
  assert.deepEqual(names, [
    "index",
    "ve-chung-toi",
    "khoa-hoc",
    "lien-he",
    "trai-he-toan-hoc-pima",
    "404",
  ]);
});

test("a page is shot at the same URL on base and head", () => {
  const [page] = selectPages(["ve-chung-toi"]);
  assert.equal(page.path, "/ve-chung-toi/");
  const [home] = selectPages(["index"]);
  assert.equal(home.path, "/");
  const [notFound] = selectPages(["404"]);
  assert.equal(notFound.path, "/404.html");
});

test("arguments limit the run, accepting names with .html or slashes", () => {
  const names = selectPages(["lien-he", "ve-chung-toi.html", "/khoa-hoc/"]).map((p) => p.name);
  assert.deepEqual(names, ["lien-he", "ve-chung-toi", "khoa-hoc"]);
});

test("an unknown page name is refused", () => {
  assert.throws(() => selectPages(["style-guide"]), /style-guide/);
});

test("shots are named <page>-<width>-<base|head|diff>.png", () => {
  assert.equal(shotFileName("index", 390, "base"), "index-390-base.png");
  assert.equal(shotFileName("lien-he", 1440, "head"), "lien-he-1440-head.png");
  assert.equal(shotFileName("404", 820, "diff"), "404-820-diff.png");
});

test("with no arguments, every page is compared against origin/dev and the head is built", () => {
  const options = parseArgs([]);
  assert.equal(options.base, "origin/dev");
  assert.equal(options.build, true);
  assert.equal(options.pages.length, 6);
});

test("--base picks another base ref, --no-build reuses the head's dist/, names limit the pages", () => {
  const options = parseArgs(["index", "--base", "spec/56-refactor-brand", "lien-he", "--no-build"]);
  assert.equal(options.base, "spec/56-refactor-brand");
  assert.equal(options.build, false);
  assert.deepEqual(
    options.pages.map((p) => p.name),
    ["index", "lien-he"],
  );
  assert.equal(parseArgs(["--base=HEAD~1"]).base, "HEAD~1");
});

test("a --base without a ref and an unknown flag are refused", () => {
  assert.throws(() => parseArgs(["--base"]), /--base/);
  assert.throws(() => parseArgs(["--base", "--no-build"]), /--base/);
  assert.throws(() => parseArgs(["--nobuild"]), /--nobuild/);
});

/** A PNG of `width` × `height` in one opaque colour, with `marks` ([x, y] pairs) painted black. */
function png(width, height, [r, g, b], marks = []) {
  const image = new PNG({ width, height });
  for (let i = 0; i < width * height; i++) image.data.set([r, g, b, 255], i * 4);
  for (const [x, y] of marks) image.data.set([0, 0, 0, 255], (y * width + x) * 4);
  return PNG.sync.write(image);
}

const WHITE = [255, 255, 255];

test("identical shots differ by 0 %", () => {
  const result = compareShots(png(10, 10, WHITE), png(10, 10, WHITE));
  assert.equal(result.share, 0);
  assert.equal(result.baseHeight, 10);
  assert.equal(result.headHeight, 10);
});

test("a changed pixel counts in the share and is marked in the diff image", () => {
  const result = compareShots(png(10, 10, WHITE), png(10, 10, WHITE, [[3, 4]]));
  assert.equal(result.share, 0.01);
  const diff = PNG.sync.read(result.diff);
  assert.equal(diff.width, 10);
  assert.equal(diff.height, 10);
  const at = (x, y) => Array.from(diff.data.subarray((y * 10 + x) * 4, (y * 10 + x) * 4 + 4));
  assert.notDeepEqual(at(3, 4), at(0, 0));
});

test("when heights differ, the rows only one side has count as different", () => {
  const result = compareShots(png(10, 10, WHITE), png(10, 12, WHITE));
  assert.equal(result.baseHeight, 10);
  assert.equal(result.headHeight, 12);
  assert.equal(result.share, 20 / 120);
  assert.equal(PNG.sync.read(result.diff).height, 12);
});

test("each comparison prints one line: page, width, share, and the heights when they differ", () => {
  assert.equal(
    formatComparison({ page: "index", width: 390, share: 0, baseHeight: 5000, headHeight: 5000 }),
    "index @ 390px: 0.00 % differ",
  );
  assert.equal(
    formatComparison({ page: "lien-he", width: 1440, share: 0.12345, baseHeight: 3000, headHeight: 3120 }),
    "lien-he @ 1440px: 12.35 % differ, height 3000 → 3120 px (+120)",
  );
  assert.equal(
    formatComparison({ page: "404", width: 820, share: 0.5, baseHeight: 900, headHeight: 800 }),
    "404 @ 820px: 50.00 % differ, height 900 → 800 px (-100)",
  );
});

test("only localhost URLs may be opened", () => {
  assert.doesNotThrow(() => assertLocalUrl("http://localhost:4321/"));
  assert.doesNotThrow(() => assertLocalUrl("http://127.0.0.1:5000/lien-he.html"));
  assert.throws(() => assertLocalUrl("https://pimavn.com/"), /localhost/);
  assert.throws(() => assertLocalUrl("http://localhost.evil.com/"), /localhost/);
  assert.throws(() => assertLocalUrl("file:///etc/passwd"), /localhost/);
});

test("requests that could deliver a submission are blocked", () => {
  const get = (url) => ({ url, method: "GET", isNavigation: false });
  assert.equal(isBlockedRequest(get("https://script.google.com/macros/s/abc/exec")), true);
  assert.equal(isBlockedRequest(get("https://script.googleusercontent.com/macros/echo?x=1")), true);
  assert.equal(isBlockedRequest(get("https://webflow.com/api/v1/form/123")), true);
  assert.equal(isBlockedRequest({ url: "https://example.org/anything", method: "POST", isNavigation: false }), true);
  assert.equal(isBlockedRequest({ url: "http://localhost:4321/", method: "POST", isNavigation: false }), true);
});

test("the contact form endpoint given by the caller is blocked", () => {
  const endpoint = "https://forms.example.net/submit";
  assert.equal(isBlockedRequest({ url: endpoint + "?a=1", method: "GET", isNavigation: false }, [endpoint]), true);
});

test("page assets load, but the page cannot navigate away from localhost", () => {
  assert.equal(isBlockedRequest({ url: "https://fonts.gstatic.com/s/x.woff2", method: "GET", isNavigation: false }), false);
  assert.equal(isBlockedRequest({ url: "http://localhost:4321/_astro/a.css", method: "GET", isNavigation: false }), false);
  assert.equal(isBlockedRequest({ url: "http://localhost:4321/lien-he/", method: "GET", isNavigation: true }), false);
  assert.equal(isBlockedRequest({ url: "https://pimavn.com/", method: "GET", isNavigation: true }), true);
});
