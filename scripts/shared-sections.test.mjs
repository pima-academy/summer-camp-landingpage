// Checks the shared Impact, Testimonials and Partners sections (spec #131, "Shared sections")
// on the built pages that show them, home and /trai-he-toan-hoc-pima/: the cleared figures with
// their source line, the report card in HTML, one quote at a time, the partners with their roles.
// Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { distSkip as skip, mainOf, readBuilt, sectionOf as sectionOfPage, textOf as text } from "./test-lib.mjs";

const PAGES = ["index.html", "trai-he-toan-hoc-pima/index.html"];

/** The markup of one section of a built page. */
const sectionOf = (page, name) => sectionOfPage(mainOf(readBuilt(page)), name);

for (const page of PAGES) {
  test(`${page}: Impact shows the six cleared figures and their source line`, { skip }, () => {
    const impact = sectionOf(page, "impact");
    assert.ok(impact, "impact section present");
    const figures = [...impact.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((m) => text(m[1]));
    assert.deepEqual(figures, [
      "10 mùa trại hè 2016–2026",
      "200+ trại sinh từ 35+ tỉnh thành",
      "40+ mentor từ các trường đại học",
      "50+ dự án nghiên cứu của học sinh",
      "80+ bài giảng Toán cao cấp và ứng dụng",
      "1.000+ người tham gia các hoạt động của PiMA",
    ]);
    assert.match(text(impact), /Số liệu tháng 10\/2026\./);
    assert.doesNotMatch(text(impact), /hàng đầu/i);
  });

  test(`${page}: Impact's report card is HTML text beside the real cover, linking Issuu`, { skip }, () => {
    const impact = sectionOf(page, "impact");
    const card = impact.match(/<a\b[^>]*href="https:\/\/issuu\.com\/pimavn\/[^"]*"[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? "";
    assert.ok(card, "a link to the report on Issuu");
    assert.match(text(card), /Báo cáo tác động 2016–2024/);
    assert.match(text(card), /Đọc báo cáo/);
    const img = card.match(/<img\b[^>]*>/)?.[0] ?? "";
    assert.match(img, /src="\/_astro\/impact-report-cover\.[^"]*"/, "the cover file");
    assert.doesNotMatch(impact, /pima-impact-report/, "not the old baked-text card image");
  });

  test(`${page}: Testimonials shows one former camper's quote at a time`, { skip }, () => {
    const t = sectionOf(page, "testimonials");
    assert.ok(t, "testimonials section present");
    assert.match(t, /<h2\b[^>]*>Cảm nhận của cựu trại sinh<\/h2>/);
    const slider = t.match(/<div[^>]*data-slider[^>]*>/)?.[0] ?? "";
    assert.match(slider, /data-layout="single"/);
    const quotes = [...t.matchAll(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/g)].map((m) => text(m[1]));
    assert.equal(quotes.length, 6);
    for (const q of quotes) assert.match(q, /^“[\s\S]+”$/, "typographic quotes");
    assert.doesNotMatch(t, /PIMA/);
    // One name style: every name carries the same single class.
    const names = [...t.matchAll(/<span class="([^"]*)"[^>]*>(Đinh Lâm Kiều Phương|Nguyễn Mạc Nam Trung|Nguyễn Trung Nghĩa|Vòng Vĩnh Toàn|Võ Thục Khánh Huyền|Hoàng Ngọc Dung)<\/span>/g)];
    assert.equal(names.length, 6);
    assert.equal(new Set(names.map((m) => m[1])).size, 1);
  });

  test(`${page}: Partners lists ĐH KHTN and BioTuring with their roles and years, no lead`, { skip }, () => {
    const p = sectionOf(page, "partners");
    assert.ok(p, "partners section present");
    assert.match(text(p), /Những đơn vị đã đồng hành cùng PiMA/);
    assert.doesNotMatch(text(p), /Từ các trường đại học danh tiếng|hàng đầu/);
    const rows = [...p.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
    assert.deepEqual(
      rows.map(text),
      [
        "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM Bảo trợ chuyên môn và đồng tổ chức 2017–2026",
        "BioTuring Giảng dạy tại trại hè 2023, đồng hành cùng PiMA 2023–2026",
      ],
    );
    for (const row of rows) assert.match(row, /<img\b[^>]*data-logo/);
  });
}

test("the three shared sections are the same markup on home and the camp page", { skip }, () => {
  // Astro inlines a widget's script where the page first renders it: not part of the section.
  const markup = (page, name) => sectionOf(page, name).replace(/<script\b[\s\S]*?<\/script>/g, "");
  for (const name of ["impact", "testimonials", "partners"]) {
    assert.equal(markup(PAGES[0], name), markup(PAGES[1], name), name);
  }
});
