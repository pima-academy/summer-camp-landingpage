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

/** The markup of the section `name` of a built page ("" when missing). */
const sectionOf = (html, name) => between(html, `data-section="${name}"`, "</section>");
const ddmmyyyy = (iso) => iso.split("-").reverse().join("/");

test("each /blog/ card shows a cover or the pale-lime logo block, the date, the title and a summary", { skip }, () => {
  const grid = sectionOf(readBuilt("blog/index.html"), "post-grid");
  const cards = [...grid.matchAll(/<a href="(\/blog\/[^"]+\/)"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.equal(cards.length, published.length);
  for (const [, link, card] of cards) {
    const post = published.find((p) => `/blog/${p.slug}/` === link);
    if (post.cover) assert.match(card, /<img\b[^>]*src="\/_astro\//, `${link}: cover`);
    else assert.match(card, /data-tone="pale-lime"[^>]*>\s*<img\b[^>]*src="\/_astro\/pima-logo-[^"]*"[^>]*data-logo/, `${link}: logo block`);
    assert.match(card, new RegExp(`>${ddmmyyyy(post.date)}</time>`), `${link}: date`);
    assert.equal(text(card.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? ""), post.title, `${link}: title`);
    assert.ok(text(card.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "").length > 20, `${link}: summary`);
  }
});

test("a card's summary is the text before <!--more--> when the post has no description", { skip }, () => {
  const grid = sectionOf(readBuilt("blog/index.html"), "post-grid");
  const card = grid.match(/<a href="\/blog\/chuyen-xe-thien-vi\/"[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? "";
  // The text before <!--more--> is 382 characters: cut after "đều" (177), as " cách" would end at 182.
  assert.equal(
    text(card.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? ""),
    "Sơn là một anh chàng theo học toán tại trường X, hàng ngày tiết học của Sơn thường kết thúc ngẫu nhiên trong khoảng từ 3 giờ đến 4 giờ chiều. Nhà bố mẹ Sơn và nhà ông bà Sơn đều…",
  );
});

test("a post page: one h1 (its title), its date, author when known, cover when present, a link back to /blog/ and the contact section", { skip }, () => {
  for (const post of published) {
    const html = readBuilt(`blog/${post.slug}/index.html`);
    const header = sectionOf(html, "post-header");
    const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]));
    assert.deepEqual(h1s, [post.title], `${post.slug}: h1`);
    assert.match(header, new RegExp(`>${ddmmyyyy(post.date)}</time>`), `${post.slug}: date`);
    if (post.author) assert.ok(text(header).includes(post.author), `${post.slug}: author`);
    assert.equal(/<img\b/.test(header), Boolean(post.cover), `${post.slug}: cover`);
    assert.match(sectionOf(html, "post-body"), /<a href="\/blog\/"/, `${post.slug}: link back to /blog/`);
    assert.ok(sectionOf(html, "contact-section"), `${post.slug}: contact section`);
  }
});

// The posts of the Jekyll site moved in so far (#111, #112), with their date, author and their
// last sentence in the Jekyll site's text.
const JEKYLL_POSTS = [
  ["phat-hien-gian-lan", "25/11/2017", "Nghia Nguyen", "Làm thế nào để phát hiện các công ty giả mạo sổ sách?", "tuy nhiên Benford cũng chưa hoàn toàn giải thích được hiện tượng này."],
  ["chuyen-xe-thien-vi", "27/11/2017", "Nghia Nguyen", "Những chuyến xe thiên vị", "Bạn có thể giúp Sơn giải thích điều này không? Hãy comment bên dưới nhé!"],
  ["tri-an-pima-2018", "12/08/2018", undefined, "Lời tri ân các đơn vị và nhà tài trợ chương trình", "chúc cho các nhà tài trợ luôn phát triển và thành công trên mọi lĩnh vực hoạt động của mình."],
  ["parrondo", "23/08/2018", undefined, "Nghịch lý Parrondo", "Nghĩ đến đây, A mới chợt nhận ra sai lầm của mình, đó là gì, không biết các bạn đã nghĩ ra chưa?"],
  ["end-of-universe", "05/09/2018", undefined, "Truyền thuyết về sự kết thúc của vũ trụ", "Giả sử mỗi bước các thầy tu có thể di chuyển trong vòng 1 giây, liệu bạn có thể tính toán ngày tận diệt của vũ trụ chứ?"],
  ["infty-equal-infty", "17/12/2018", undefined, "Liệu vô cùng có bằng vô cùng?", "Liệu tập X mà Linh đề cập có tồn tại không? Nếu có thì đó là tập gì?"],
  ["best-choices", "21/12/2018", undefined, "Lựa chọn thế nào là tốt nhất?", "Còn bạn, nếu bạn là Duy và Khang, bạn sẽ lựa chọn như thế nào?"],
  // The 6 posts with formulas (#112).
  ["calculus-war", "20/11/2017", "Duy Tran", "Newton và Leibniz - The Calculus War", "những di sản của Newton để lại trong vật lý tạo tiền đề cho thuyết tương đối của Einstein."],
  ["pagerank", "22/11/2017", "Son Luu", "PageRank - Một thuật toán của Google", "tính năng làm cho Google trội hơn hẳn so với các trang tìm kiếm thông tin cùng thời."],
  ["max-speed-animals", "16/12/2017", "Duy Tran", "Công thức xác định tốc độ tối đa của động vật", "với vận tốc vào khoảng 36 km/h thì con người hoàn toàn có thể chạy nhanh hơn khủng long."],
  ["softmax", "29/07/2018", undefined, "Thuật toán One vs. All và Softmax Classification", "Nếu bạn có thể giúp Uyên, bạn sẽ chọn phương pháp nào, và vì sao?"],
  ["which-has-more-elements", "27/11/2018", undefined, "Tập nào nhiều số hơn?", "Theo bạn, bạn thấy ý kiến nào đúng và bạn có đoán được câu trả lời của thầy giáo chứ?"],
  ["perfect-strategy", "02/12/2018", undefined, "Chiến thuật đặt cược hoàn hảo?", "Liệu các bạn có đề xuất chiến thuật nào “có lợi hơn” trong trò chơi này?"],
];

for (const [slug, date, author, title, sentence] of JEKYLL_POSTS) {
  test(`the Jekyll site post ${slug} is at /blog/${slug}/ with its title, date${author ? ", author" : ""} and text`, { skip }, () => {
    const html = readBuilt(`blog/${slug}/index.html`);
    const header = text(sectionOf(html, "post-header"));
    assert.ok(header.includes(title), "title");
    assert.ok(header.includes(date), "date");
    if (author) assert.ok(header.includes(author), "author");
    // KaTeX's own layout spans hold a zero-width space (Safari needs one there); the text, none.
    const body = text(sectionOf(html, "post-body").replaceAll('<span class="vlist-s">​</span>', ""));
    assert.ok(body.includes(sentence), "last sentence");
    assert.doesNotMatch(body, /​/, "no zero-width space");
  });
}

// ---- Formulas (#112) --------------------------------------------------------------------------

// The display ($$…$$ on a line of its own) and inline ($…$) formulas of each post with maths,
// counted in the Jekyll site's text: 21 in all.
const FORMULAS = {
  "calculus-war": { display: 1, inline: 0 },
  pagerank: { display: 0, inline: 1 },
  "max-speed-animals": { display: 1, inline: 2 },
  softmax: { display: 2, inline: 8 },
  "which-has-more-elements": { display: 0, inline: 2 },
  "perfect-strategy": { display: 1, inline: 3 },
};

/** A post body's formulas: KaTeX's display blocks and its inline spans (not inside a display). */
function formulas(body) {
  const display = body.match(/<span class="katex-display">/g)?.length ?? 0;
  const all = body.match(/<span class="katex">/g)?.length ?? 0;
  return { display, inline: all - display };
}

for (const [slug, expected] of Object.entries(FORMULAS)) {
  test(`${slug}'s formulas are typeset by KaTeX at build time, display ones on their own line`, { skip }, () => {
    const body = sectionOf(readBuilt(`blog/${slug}/index.html`), "post-body");
    assert.deepEqual(formulas(body), expected);
    // A display formula is a block of its own, never inside a paragraph.
    assert.doesNotMatch(body, /<p>(?:(?!<\/p>)[\s\S])*class="katex-display"/, "display formula inside a <p>");
  });
}

test("no post page shows a raw $ delimiter or a KaTeX error", { skip }, () => {
  for (const { slug } of published) {
    const body = sectionOf(readBuilt(`blog/${slug}/index.html`), "post-body");
    assert.ok(!text(body).includes("$"), `${slug}: raw $`);
    assert.doesNotMatch(body, /katex-error/, `${slug}: KaTeX error`);
  }
});

test("the sitemap lists /blog/ and every non-draft post, and no draft", { skip }, () => {
  const sitemap = readBuilt("sitemap-0.xml");
  assert.match(sitemap, /<loc>https:\/\/pimavn\.com\/blog\/<\/loc>/);
  for (const { slug } of published) assert.match(sitemap, new RegExp(`<loc>https://pimavn\\.com/blog/${slug}/</loc>`));
  for (const { slug } of drafts) assert.doesNotMatch(sitemap, new RegExp(`/blog/${slug}/`));
});

test("every non-draft post has a page, a draft none", { skip }, () => {
  for (const { slug } of published) assert.ok(readBuilt(`blog/${slug}/index.html`), `/blog/${slug}/ built`);
  for (const { slug } of drafts) {
    assert.equal(readBuilt(`blog/${slug}/index.html`), "", `draft /blog/${slug}/ built`);
    assert.ok(!listed().includes(`/blog/${slug}/`), `draft ${slug} listed`);
  }
});
