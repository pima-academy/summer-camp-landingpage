// Checks Nav and Footer (site chrome) in the built pages: links, current-link state as
// `aria-current`, and no Webflow class left in their markup.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, readBuilt } from "./test-lib.mjs";

const html = readBuilt("index.html");

const between = (page, start, end) => {
  const i = page.indexOf(start);
  const j = page.indexOf(end, i);
  return i < 0 || j < 0 ? "" : page.slice(i, j + end.length);
};
const headerOf = (page) => between(page, "<header", "</header>");
const footerOf = (page) => between(page, "<footer", "</footer>");
const nav = headerOf(html);
const footer = footerOf(html);
const anchors = (s) => [...s.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
const href = (tag) => tag.match(/href="([^"]*)"/)?.[1];
const current = (s) => anchors(s).filter((a) => /aria-current="page"/.test(a));

// Site pages built with BaseLayout (the two frozen camp pages have no Nav and their own footer).
const sitePages = ["index.html", "ve-chung-toi/index.html", "khoa-hoc/index.html", "lien-he/index.html", "trai-he-toan-hoc-pima/index.html", "chi-tiet-trai-he/index.html", "404.html"];

test("nav is the page banner, before <main>, and lists the site links", { skip }, () => {
  assert.ok(nav, "<header> present");
  assert.match(nav, /<nav\b[^>]*id="nav-menu"/);
  assert.ok(html.indexOf("</header>") < html.indexOf("<main"), "header before main");
  const hrefs = anchors(nav).map(href);
  for (const h of ["/", "/ve-chung-toi/", "/trai-he-toan-hoc-pima/", "/khoa-hoc/", "/lien-he/"]) {
    assert.ok(hrefs.includes(h), `nav links to ${h}`);
  }
});

test("the Sự kiện & Blog content gap is not in the production nav", { skip }, () => {
  assert.doesNotMatch(nav, /su-kien-blog|Sự kiện/);
  // 4 top-level items (Trang chủ, Về chúng tôi, Chương trình, Liên hệ) + 2 in the dropdown.
  assert.equal((nav.match(/<li\b/g) ?? []).length, 6);
});

test("only the home links are current on the home page", { skip }, () => {
  assert.ok(current(nav).length >= 1);
  for (const a of current(nav)) assert.equal(href(a), "/");
  assert.deepEqual(current(footer).map(href), ["/"]);
});

test("on a dropdown page its nav link and footer link are current", { skip }, () => {
  const page = readBuilt("khoa-hoc/index.html");
  assert.deepEqual(current(headerOf(page)).map(href), ["/khoa-hoc/"]);
  assert.deepEqual(current(footerOf(page)).map(href), ["/khoa-hoc/"]);
});

test("the menu button and the dropdown toggle expose their state with aria-expanded", { skip }, () => {
  const button = nav.match(/<[^>]*aria-controls="nav-menu"[^>]*>/)?.[0] ?? "";
  assert.match(button, /aria-label="Menu"/);
  assert.match(button, /aria-expanded="false"/);
  const toggle = nav.match(/<[^>]*aria-controls="nav-dropdown-list-\d+"[^>]*>/)?.[0] ?? "";
  assert.match(toggle, /aria-expanded="false"/);
});

test("the dropdown caret is an inline SVG, not an icon font", { skip }, () => {
  const svg = between(nav, 'aria-controls="nav-dropdown-list', "</svg>").match(/<svg\b[^>]*>/)?.[0] ?? "";
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /stroke="currentColor"/);
  assert.doesNotMatch(nav, /w-icon-/);
});

test("nav logo link has an aria-label and a fixed-size image", { skip }, () => {
  const logo = between(nav, '<a href="/"', "</a>");
  assert.match(logo, /aria-label="[^"]+"/);
  assert.match(logo, /<img[^>]*srcset="[^"]* 1x, [^"]* 2x"/);
  assert.match(logo, /<img[^>]*width="117"[^>]*height="40"/);
});

test("footer comes after <main>", { skip }, () => {
  assert.ok(footer, "footer markup present");
  assert.ok(html.indexOf("<footer") > html.indexOf("</main>"));
});

test("footer links: logo, about anchors, products, Facebook, email, LinkedIn", { skip }, () => {
  const tags = anchors(footer);
  const hrefs = tags.map(href);
  assert.equal(hrefs[0], "/", "footer logo links to /");
  assert.match(tags[0], /aria-label="[^"]+"/);
  const about = hrefs.filter((h) => h?.startsWith("/ve-chung-toi/#"));
  assert.deepEqual(about, [
    "/ve-chung-toi/#gioi-thieu",
    "/ve-chung-toi/#tam-nhin-su-menh",
    "/ve-chung-toi/#doi-tac-mang-luoi-nhan-tai",
    "/ve-chung-toi/#cac-tac-dong-tich-cuc",
    "/ve-chung-toi/#cau-chuyen-nha-sang-lap",
    "/ve-chung-toi/#ke-hoach-tuong-lai",
  ]);
  assert.ok(hrefs.includes("/khoa-hoc/"));
  assert.ok(hrefs.includes("/trai-he-toan-hoc-pima/"));
  assert.ok(hrefs.includes("https://www.facebook.com/pima.academy.vn"));
  assert.ok(hrefs.includes("mailto:contact@pimavn.com"));
  const linkedin = tags.find((a) => href(a) === "https://www.linkedin.com/company/pima-academy");
  assert.ok(linkedin, "LinkedIn link");
  assert.match(linkedin, /aria-label="[^"]+"/);
  assert.ok(!hrefs.includes("#"), "no # links left");
});

test("footer shows address, build year and PiMA in headings", { skip }, () => {
  assert.match(footer, /35 Văn Chung, Phường Tân Bình, Thành phố Hồ Chí Minh, Việt Nam/);
  assert.match(footer, new RegExp(`© ${new Date().getFullYear()} PiMA Academy`));
  assert.match(footer, /<h5[^>]*>về <span[^>]*>PiMA<\/span><\/h5>/);
});

const classesIn = (markup) =>
  [...markup.matchAll(/\sclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean);

test("nav and footer markup carry no Webflow class on any site page", { skip }, () => {
  for (const path of sitePages) {
    const page = readBuilt(path);
    for (const [part, markup] of [
      ["header", headerOf(page)],
      ["footer", footerOf(page)],
    ]) {
      assert.ok(markup, `${path}: ${part} present`);
      // Any `w-…`/`w--…` runtime class; no-webflow.test.mjs covers the other Webflow names in src/.
      const old = classesIn(markup).filter((c) => /^w-/.test(c));
      assert.deepEqual([...new Set(old)], [], `${path}: Webflow classes in the ${part}`);
      assert.doesNotMatch(markup, /\sid="w-node-/, `${path}: w-node ids in the ${part}`);
    }
  }
});
