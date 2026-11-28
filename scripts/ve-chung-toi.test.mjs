// Checks the built ve-chung-toi page: section order and ids, the "Về PiMA" footer anchors,
// the content rules of the redesign (spec #131), images.
// Needs a fresh `npm run build`; skipped when the page is not built.
import { test } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, mainOf, readBuilt } from "./test-lib.mjs";

const html = readBuilt("ve-chung-toi/index.html");

/** The opening tag of the element carrying `id="<id>"`. */
const tagWithId = (id) => html.match(new RegExp(`<[a-z]+\\b[^>]*\\bid="${id}"[^>]*>`))?.[0] ?? "";

/** The page's sections in order (spec #131, "Về chúng tôi"), each with its id. */
const SECTIONS = [
  ["opening", "gioi-thieu"],
  ["vision-mission", "tam-nhin-su-menh"],
  ["founder-story", "cau-chuyen-nha-sang-lap"],
  ["milestone", "cac-cot-moc"],
  ["talent-network", "mang-luoi-nhan-tai"],
  ["experts", "chuyen-gia-dong-hanh"],
  ["future-plans", "ke-hoach-tuong-lai"],
  ["contact-section", "contact-form"],
];

test("ve-chung-toi has the redesign's eight sections in order", { skip }, () => {
  const order = SECTIONS.map(([name]) => name);
  const at = order.map((name) => html.indexOf(`data-section="${name}"`));
  assert.ok(at.every((i) => i >= 0), `all sections present: ${order.filter((_, i) => at[i] < 0)}`);
  assert.deepEqual([...at].sort((a, b) => a - b), at, "sections in order");
  assert.equal(html.match(/data-section=/g)?.length, order.length, "no other section");
});

test("each section carries its id", { skip }, () => {
  for (const [name, id] of SECTIONS) {
    assert.match(tagWithId(id), new RegExp(`data-section="${name}"`), `#${id} on ${name}`);
  }
});

test("the footer's 'Về PiMA' column is the seven links, each landing on its section", { skip }, () => {
  // Spec #131, "Footer 'Về PiMA'": one link per section 1–7, in page order.
  const expected = [
    ["Giới thiệu", "gioi-thieu", "opening"],
    ["Tầm nhìn &amp; Sứ mệnh", "tam-nhin-su-menh", "vision-mission"],
    ["Câu chuyện nhà sáng lập", "cau-chuyen-nha-sang-lap", "founder-story"],
    ["Các cột mốc", "cac-cot-moc", "milestone"],
    ["Mạng lưới nhân tài", "mang-luoi-nhan-tai", "talent-network"],
    ["Chuyên gia đồng hành", "chuyen-gia-dong-hanh", "experts"],
    ["Kế hoạch tương lai", "ke-hoach-tuong-lai", "future-plans"],
  ];
  const footer = html.slice(html.lastIndexOf("<footer"));
  const links = [...footer.matchAll(/<a\b[^>]*href="\/ve-chung-toi\/#([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => [
    m[2].replace(/<[^>]+>/g, "").trim(),
    m[1],
  ]);
  assert.deepEqual(
    links,
    expected.map(([label, id]) => [label, id]),
  );
  for (const [, id, name] of expected) {
    assert.match(tagWithId(id), new RegExp(`data-section="${name}"`), `#${id} lands on ${name}`);
  }
});

/** The part of the page from `data-section="<name>"` up to the next section. */
const sectionHtml = (name) => {
  const from = html.indexOf(`data-section="${name}"`);
  if (from < 0) return "";
  const next = html.indexOf("data-section=", from + 1);
  return html.slice(from, next < 0 ? undefined : next);
};

test("the page makes none of the claims the redesign drops", { skip }, () => {
  const main = mainOf(html);
  for (const phrase of [/hàng đầu/i, /Google/, /tiên phong/i, /miễn phí/i, /hỗ trợ toàn bộ chi phí/i]) {
    assert.doesNotMatch(main, phrase);
  }
});

test("the talent network names places without logos or a count", { skip }, () => {
  const network = sectionHtml("talent-network");
  // One image only: the impact report's cover on the report card.
  assert.equal(network.match(/<img\b/g)?.length, 1);
  assert.match(network, /href="https:\/\/issuu\.com\/pimavn\//);
  for (const name of ["MIT", "Viện Max Planck", "ĐH Khoa học Tự nhiên, ĐHQG-HCM", "Hamming AI"]) {
    assert.ok(network.includes(`>${name}</span>`), name);
  }
  assert.equal(network.match(/class="name"/g)?.length, 22);
});

test("the experts are the six cleared experts, in cards, no slider", { skip }, () => {
  const experts = sectionHtml("experts");
  const names = [...experts.matchAll(/<h3\b[^>]*>([^<]+)<\/h3>/g)].map((m) => m[1]);
  assert.deepEqual(names, [
    "GS. TS. Võ Văn Tới",
    "PGS. TS. Trần Minh Triết",
    "PGS. TS. Lý Quốc Ngọc",
    "ThS. Lê Thiện",
    "TS. Phạm Kim Sơn",
    "Vương Hy",
  ]);
  assert.equal(experts.match(/<img\b/g)?.length, 6);
  assert.doesNotMatch(html, /data-slider|Đội ngũ của/);
});

test("the timeline has a column per year, 2016 to 2026, and SCUDEM carries no month", { skip }, () => {
  const timeline = sectionHtml("milestone");
  const years = [...timeline.matchAll(/class="year"[^>]*>(\d{4})</g)].map((m) => m[1]);
  assert.deepEqual(years, ["2016", "2017", "2018", "2019", "2021", "2023", "2024", "2025", "2026"]);
  assert.match(timeline, /Kéo ngang để xem tiếp\./);
  for (const entry of timeline.match(/<li\b[^>]*>(?:(?!<li\b)[\s\S])*?SCUDEM[\s\S]*?<\/li>/g) ?? []) {
    assert.doesNotMatch(entry, /class="month"/, entry);
  }
  assert.equal(timeline.match(/SCUDEM/g)?.length, 2);
});

test("no Webflow class or w-node id in the page's main content", { skip }, () => {
  const main = mainOf(html);
  assert.doesNotMatch(main, /id="w-node-/);
  assert.doesNotMatch(main, /class="[^"]*\b(w-[a-z-]+|padding-global|container-(medium|large)|padding-section-[a-z]+|margin-(bottom|top)|spacer-[a-z]+|text-size-[a-z]+|text-style-[a-z]+|max-width-[a-z]+|layout\d+_[a-z-]+|header\d+_[a-z-]+|timeline1_[a-z-]+|logo3_[a-z-]+|section_about-[a-z-]+)\b/);
});

test("every image is processed by Astro, none points into site/", { skip }, () => {
  const imgs = html.match(/<img\b[^>]*>/g) ?? [];
  assert.ok(imgs.length > 10);
  for (const img of imgs) {
    assert.match(img, /src="\/_astro\//, img);
    assert.match(img, /width="\d+"/, img);
    assert.match(img, /height="\d+"/, img);
  }
  assert.doesNotMatch(html, /images\/|site\//);
});

test("no third-party script or font, no Webflow attributes", { skip }, () => {
  assert.doesNotMatch(html, /<script[^>]*src="https?:/);
  assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic|webflow\.js|jquery/i);
  assert.doesNotMatch(html, /data-wf-|data-w-id/);
});
