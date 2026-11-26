// Checks that content gaps never reach the production build.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { basename, extname, join, relative } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
const gapPages = join(root, "src/gap-pages");
const skip = existsSync(join(dist, "index.html")) ? false : "dist/ missing: run `npm run build` first";

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

// Gap page slugs as the dev route serves them: path under src/gap-pages without extension.
const gapSlugs = existsSync(gapPages)
  ? walk(gapPages)
      .filter((f) => extname(f) === ".astro")
      .map((f) => relative(gapPages, f).slice(0, -".astro".length).replace(/(^|\/)index$/, ""))
  : [];

test("no built file carries a content gap marker", { skip }, () => {
  const text = walk(dist).filter((f) => /\.(html|css|js|xml)$/.test(f));
  for (const f of text) {
    const body = readFileSync(f, "utf8");
    assert.ok(!body.includes("CONTENT GAP"), `${relative(dist, f)} contains "CONTENT GAP"`);
    assert.ok(!body.includes("data-content-gap"), `${relative(dist, f)} contains data-content-gap`);
  }
});

test("no gap page is built or listed in the sitemap", { skip }, () => {
  const sitemaps = readdirSync(dist).filter((f) => /^sitemap.*\.xml$/.test(f));
  const xml = sitemaps.map((f) => readFileSync(join(dist, f), "utf8")).join("\n");
  for (const slug of gapSlugs) {
    assert.ok(!existsSync(join(dist, slug, "index.html")), `gap page /${slug}/ was built`);
    assert.ok(!xml.includes(`https://pimavn.com/${slug}/`), `sitemap lists gap page /${slug}/`);
  }
});

test("gap pages are only reachable through the dev route", () => {
  const pages = join(root, "src/pages");
  for (const slug of gapSlugs) {
    const name = basename(slug);
    assert.ok(
      !existsSync(join(pages, `${slug}.astro`)) && !existsSync(join(pages, slug, "index.astro")),
      `${name} is both a gap page and a published page`,
    );
  }
});
