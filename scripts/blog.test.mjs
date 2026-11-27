// The blog (spec #110): /blog/ lists the non-draft blog posts newest first, each post has a page
// at /blog/<slug>/, drafts are built nowhere, the sitemap lists the blog, the nav links to it
// and the removed gap pages /su-kien-blog/ and /detail-blog-event/ are gone.
// Most tests need a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { postDate, summaryOf } from "../src/sections/blog/post-text.ts";
import { builtHtmlFiles, dist, distSkip as skip, mainOf, readBuilt, root } from "./test-lib.mjs";

// ---- Card summary and date ------------------------------------------------------------------

test("a post's summary is its description when it has one", () => {
  assert.equal(summaryOf({ description: "Mô tả ngắn.", body: "Đoạn đầu.\n\n<!--more-->\n\nSau." }), "Mô tả ngắn.");
});

test("else the text before <!--more-->, as plain text", () => {
  const body = "Một **chữ đậm**, _nghiêng_ và [liên kết](https://pimavn.com).\n\n- Mục một\n- Mục hai\n\n&nbsp;- Lời thoại\n\n<!--more-->\n\nSau.";
  assert.equal(summaryOf({ body }), "Một chữ đậm, nghiêng và liên kết. Mục một Mục hai - Lời thoại");
});

test("else the first paragraph with text, after any heading or image", () => {
  assert.equal(summaryOf({ body: "\n## Tiêu đề\n\nĐoạn đầu\ntiếp theo.\n\nĐoạn hai." }), "Đoạn đầu tiếp theo.");
  assert.equal(summaryOf({ body: '![Ảnh](./a.jpg "Chú thích")\n\nĐoạn đầu <em>nhấn</em>.\n\nĐoạn hai.' }), "Đoạn đầu nhấn.");
});

test("a long summary is cut at a word to at most 180 characters, ending in an ellipsis", () => {
  const summary = summaryOf({ body: "Toán học và ứng dụng. ".repeat(20) });
  assert.ok(summary.length <= 181, `${summary.length} characters`);
  assert.match(summary, /^Toán học và ứng dụng\. Toán .*[^\s.]…$/);
  assert.ok("Toán học và ứng dụng. ".repeat(20).startsWith(summary.slice(0, -1)));
});

test("a post's date reads dd/mm/yyyy", () => {
  assert.equal(postDate(new Date("2017-11-25")), "25/11/2017");
  assert.equal(postDate(new Date("2019-07-01")), "01/07/2019");
});

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

// ---- The posts, read from the content folder ------------------------------------------------

const content = join(root, "src/content/blog");

/** The scalar fields of a post's front matter (enough YAML for `key: value` lines). */
function frontMatter(file) {
  const yaml = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  return Object.fromEntries(
    [...yaml.matchAll(/^(\w+):\s*(.*?)\s*$/gm)].map(([, key, value]) => [key, value.replace(/^(["'])(.*)\1$/, "$2")]),
  );
}

/** Every post: `<slug>/index.md` or `<slug>.md` (not the author guide, README.md). */
const posts = (existsSync(content) ? readdirSync(content, { withFileTypes: true }) : [])
  .map((e) =>
    e.isDirectory()
      ? { slug: e.name, file: join(content, e.name, "index.md") }
      : { slug: e.name.replace(/\.md$/, ""), file: join(content, e.name) },
  )
  .filter(({ file }) => file.endsWith(".md") && !file.endsWith("README.md") && existsSync(file))
  .map(({ slug, file }) => ({ slug, ...frontMatter(file) }));
const published = posts.filter((p) => p.draft !== "true").sort((a, b) => b.date.localeCompare(a.date));
const drafts = posts.filter((p) => p.draft === "true");

test("the content folder holds at least the 7 text-only Jekyll site posts and a draft", () => {
  assert.ok(published.length >= 7, `${published.length} published posts`);
  assert.ok(drafts.length >= 1, "a draft sample post");
});

/** The post links of /blog/, in page order, each once. */
const listed = () => [
  ...new Set(
    anchors(mainOf(readBuilt("blog/index.html")))
      .map(([a]) => href(a))
      .filter((h) => /^\/blog\/[^/]+\/$/.test(h)),
  ),
];

test("/blog/ lists exactly the non-draft posts, newest first, each linking to /blog/<slug>/", { skip }, () => {
  assert.deepEqual(listed(), published.map((p) => `/blog/${p.slug}/`));
});

test("every non-draft post has a page, a draft none", { skip }, () => {
  for (const { slug } of published) assert.ok(readBuilt(`blog/${slug}/index.html`), `/blog/${slug}/ built`);
  for (const { slug } of drafts) {
    assert.equal(readBuilt(`blog/${slug}/index.html`), "", `draft /blog/${slug}/ built`);
    assert.ok(!listed().includes(`/blog/${slug}/`), `draft ${slug} listed`);
  }
});
