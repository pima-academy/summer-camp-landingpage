// Checks Nav and Footer (site chrome) on the built home page.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const indexPath = join(dist, "index.html");
const skip = existsSync(indexPath) ? false : "dist/ missing: run `npm run build` first";
const html = skip ? "" : readFileSync(indexPath, "utf8");

const between = (start, end) => {
  const i = html.indexOf(start);
  const j = html.indexOf(end, i);
  return i < 0 || j < 0 ? "" : html.slice(i, j + end.length);
};
const nav = skip ? "" : between('<div class="nav inverse-nav"', "</nav>");
const footer = skip ? "" : between("<footer", "</footer>");
const anchors = (s) => [...s.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
const href = (tag) => tag.match(/href="([^"]*)"/)?.[1];

test("nav comes before <main> and lists the site links", { skip }, () => {
  assert.ok(nav, "nav markup present");
  assert.ok(html.indexOf("</nav>") < html.indexOf("<main"), "nav before main");
  const hrefs = anchors(nav).map(href);
  for (const h of ["/", "/ve-chung-toi/", "/trai-he-toan-hoc-pima/", "/khoa-hoc/", "/lien-he/"]) {
    assert.ok(hrefs.includes(h), `nav links to ${h}`);
  }
});

test("the Sự kiện & Blog content gap is not in the production nav", { skip }, () => {
  assert.doesNotMatch(nav, /su-kien-blog|Sự kiện/);
  assert.equal((nav.match(/<li class="nav-menu-list-item"/g) ?? []).length, 4);
});

test("only the home links are current on the home page", { skip }, () => {
  const current = anchors(nav).filter((a) => /aria-current="page"/.test(a));
  assert.ok(current.length >= 1);
  for (const a of current) {
    assert.equal(href(a), "/");
    assert.match(a, /w--current/);
  }
  const notCurrent = anchors(nav).filter((a) => href(a) !== "/");
  for (const a of notCurrent) assert.doesNotMatch(a, /w--current|aria-current/);
});

test("nav logo link has an aria-label and a fixed-size image", { skip }, () => {
  const logo = between('<a href="/" class="nav-logo', "</a>");
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
