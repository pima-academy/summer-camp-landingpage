// The blog (spec #110): /blog/ lists the non-draft blog posts newest first, each post has a page
// at /blog/<slug>/, drafts are built nowhere, the sitemap lists the blog, the nav links to it
// and the removed gap pages /su-kien-blog/ and /detail-blog-event/ are gone.
// Most tests need a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { builtHtmlFiles, dist, distSkip as skip, readBuilt, root } from "./test-lib.mjs";

const between = (page, start, end) => {
  const i = page.indexOf(start);
  const j = page.indexOf(end, i);
  return i < 0 || j < 0 ? "" : page.slice(i, j + end.length);
};
const anchors = (s) => [...s.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)];
const href = (tag) => tag.match(/href="([^"]*)"/)?.[1];
const text = (html) => html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

test("the main nav shows Blog, linking to /blog/", { skip }, () => {
  const nav = between(readBuilt("index.html"), "<header", "</header>");
  const blog = anchors(nav).find(([, inner]) => text(inner) === "Blog");
  assert.ok(blog, "a nav link reads Blog");
  assert.equal(href(blog[0]), "/blog/");
});

const REMOVED = ["su-kien-blog", "detail-blog-event"];

test("the gap pages /su-kien-blog/ and /detail-blog-event/ are gone, even in dev", () => {
  for (const slug of REMOVED) {
    assert.ok(!existsSync(join(root, "src/gap-pages", `${slug}.astro`)), `src/gap-pages/${slug}.astro`);
    assert.ok(!existsSync(join(root, "src/sections", slug)), `src/sections/${slug}/`);
  }
});

test("no built page links to /su-kien-blog/ or /detail-blog-event/", { skip }, () => {
  for (const file of builtHtmlFiles()) {
    const html = readFileSync(file, "utf8");
    for (const slug of REMOVED) {
      assert.doesNotMatch(html, new RegExp(`href="/${slug}/?"`), `${relative(dist, file)} links to /${slug}/`);
    }
  }
});
