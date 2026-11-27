// The camp archive page (spec #93): the counts and dates its hero shows, and the year-file
// check. Every src/sections/camp-archive/years/<year>.ts must match the `CampYear` interface
// (src/sections/camp-archive/camp-archive.ts), link only Drive viewer URLs, name gallery folders
// that hold photos, give valid ISO session dates and put `campus` on groups only in a year held
// at several campuses (spec #93, end of "Content model"). The rules live in camp-archive-lib.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { calendarDates, countsSentence } from "../src/sections/camp-archive/camp-archive.ts";
import { loadYearFile, yearProblems } from "./camp-archive-lib.mjs";
import { dist, distSkip, readBuilt, root } from "./test-lib.mjs";

test("the counts sentence of 2019: lectures, topics, and group reports of their campers", () => {
  const camper = { name: "A", school: "B" };
  const group = (n) => ({ campers: Array(n).fill(camper), mentors: [], files: [] });
  const y = {
    lectures: Array(17).fill({ title: "x", authors: [], files: [] }),
    projects: [
      { title: "a", groups: [group(4)] },
      { title: "b", groups: [group(4), group(4)] },
      { title: "c", groups: [group(4)] },
      { title: "d", groups: [group(4), group(4)] },
    ],
  };
  assert.deepEqual(countsSentence(y), [17, " bài giảng, ", 4, " đề tài dự án và ", 6, " báo cáo nhóm của ", 24, " trại sinh."]);
  assert.equal(countsSentence(y).join(""), "17 bài giảng, 4 đề tài dự án và 6 báo cáo nhóm của 24 trại sinh.");
});

test("the counts sentence drops what the year lacks", () => {
  const lectures = Array(3).fill({ title: "x", authors: [], files: [] });
  assert.equal(countsSentence({ lectures }).join(""), "3 bài giảng.");
  const projects = [{ title: "a", groups: [{ campers: [], mentors: [], files: [] }] }];
  assert.equal(countsSentence({ projects }).join(""), "1 đề tài dự án và 1 báo cáo nhóm.");
  assert.deepEqual(countsSentence({}), []);
});

test("calendar dates: day/month to day/month over the year", () => {
  assert.deepEqual(calendarDates("2025-08-02", "2025-08-09"), { days: "02/08 – 09/08", rest: "năm 2025" });
  assert.deepEqual(calendarDates("2019-07-29", "2019-08-09"), { days: "29/07 – 09/08", rest: "năm 2019" });
});

// ---- The year-file check, on fixtures -------------------------------------------------------

/** A photos folder standing in for src/assets/camp-archive/, with <year>/<folder>/ inside. */
const assets = mkdtempSync(join(tmpdir(), "camp-archive-"));
mkdirSync(join(assets, "2030/01-khai-mac"), { recursive: true });
writeFileSync(join(assets, "2030/01-khai-mac/01.jpg"), "");
mkdirSync(join(assets, "2030/02-empty"), { recursive: true });
writeFileSync(join(assets, "2030/02-empty/notes.txt"), "");
writeFileSync(join(assets, "2030/02-empty/01.JPG"), "");

/** An imported image, as the year-file loader stubs it. */
const image = (path) => ({ src: join(assets, path), width: 1, height: 1, format: "jpg" });
const file = (id) => `https://drive.google.com/file/d/${id}/view`;
const folder = (id) => `https://drive.google.com/drive/folders/${id}`;

/** A valid one-campus year with every block. */
const oneCampus = () => ({
  year: 2030,
  topic: { vi: "Toán học trong Học sâu", en: "The Mathematics of Deep Learning" },
  cover: image("2030/cover.jpg"),
  description: ["Một đoạn."],
  programme: ["Một mục."],
  sessions: [{ campus: "TP.HCM", start: "2030-07-29", end: "2030-08-09", venue: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM" }],
  team: [{ name: "Ban tổ chức", members: [{ name: "TS. A", affiliation: "B", photo: image("2030/team/a.jpg") }, { name: "C" }] }],
  entranceExam: [{ title: "Đề tuyển sinh", authors: [], files: [{ label: "PDF", url: file("1a") }, { label: "Lời giải", url: file("1b") }] }],
  lectures: [
    { title: "Đại số tuyến tính", fromYear: 2029, authors: [{ name: "A", affiliation: "B" }], files: [{ label: "PDF", url: file("1c") }] },
    { title: "Giải tích", authors: [{ name: "A" }], files: [{ label: "Slide", url: `${file("1d")}?resourcekey=0-abc_D` }] },
  ],
  exercises: [{ title: "Bài tập", authors: [], files: [{ label: "Thư mục", url: folder("1e") }] }],
  reading: [{ title: "LaTeX", authors: [], files: [{ label: "PDF", url: file("1f") }] }],
  projects: [
    {
      title: "Image Segmentation",
      description: "Mô tả.",
      brief: { label: "PDF", url: file("1g") },
      groups: [{ reportTitle: "Báo cáo", campers: [{ name: "A", school: "B" }], mentors: [{ name: "C" }], files: [{ label: "Notebook", url: file("1h") }] }],
    },
    { title: "Chỉ có tên", groups: [{ campers: [], mentors: [], files: [{ label: "PDF", url: file("1i") }] }] },
  ],
  gallery: [{ name: "Khai mạc", folder: "01-khai-mac", album: folder("1j") }],
  video: { youtubeId: "8DKLYsikxTs" },
});

/** A valid two-campus year: one cover per campus, a campus on every group. */
const twoCampuses = () => ({
  year: 2030,
  topic: { vi: "Mô hình Tạo sinh", en: "Generative Models" },
  covers: [
    { image: image("2030/cover-tphcm.jpg"), campus: "TP.HCM" },
    { image: image("2030/cover-ha-noi.jpg"), campus: "Hà Nội" },
  ],
  sessions: [
    { campus: "TP.HCM", start: "2030-08-02", end: "2030-08-09" },
    { campus: "Hà Nội", start: "2030-08-11", end: "2030-08-18", venue: "VIASM" },
  ],
  projects: [
    {
      title: "Mô hình khuếch tán",
      groups: [
        { campus: "Hà Nội", campers: [{ name: "A", school: "B" }], mentors: [], files: [{ label: "PDF", url: file("2a") }] },
        { campus: "TP.HCM", campers: [{ name: "C", school: "D" }], mentors: [], files: [{ label: "PDF", url: file("2b") }] },
      ],
    },
  ],
});

const check = (y, file = "2030.ts") => yearProblems(y, { file, assetsDir: assets });

test("a complete one-campus year and a two-campus year pass", () => {
  assert.deepEqual(check(oneCampus()), []);
  assert.deepEqual(check(twoCampuses()), []);
  assert.deepEqual(check({ year: 2030, topic: { vi: "A", en: "B" }, cover: image("2030/cover.jpg") }), [], "only the required fields");
});

test("a field the interface does not have, a missing field or a wrong type is reported with its path", () => {
  const y = oneCampus();
  y.lecture = [];
  y.topic = { vi: "A" };
  y.lectures[1].authors = "A";
  y.projects[0].groups[0].campers[0] = { name: "A" };
  const problems = check(y).join("\n");
  assert.match(problems, /^lecture: not a field of CampYear/m);
  assert.match(problems, /^topic\.en: missing/m);
  assert.match(problems, /^lectures\[1\]\.authors: not a list/m);
  assert.match(problems, /^projects\[0\]\.groups\[0\]\.campers\[0\]\.school: missing/m);
});

test("the year matches the file name", () => {
  assert.match(check(oneCampus(), "2031.ts").join(), /year: 2030 in 2031\.ts/);
});

test("every file link is a Drive viewer URL", () => {
  for (const url of [
    "#",
    "https://pimavn.github.io/assets/2019/lecture.pdf",
    "https://drive.google.com/open?id=1a",
    "https://drive.google.com/file/d/1a/view?usp=sharing",
    "https://docs.google.com/presentation/d/1a/edit",
  ]) {
    const y = oneCampus();
    y.lectures[0].files[0].url = url;
    assert.match(check(y).join(), /lectures\[0\]\.files\[0\]\.url: .* is not a Drive viewer URL/, url);
  }
  const y = oneCampus();
  y.gallery[0].album = "#";
  y.projects[0].brief.url = "#";
  assert.equal(check(y).length, 2);
});

test("a file label outside the list is reported", () => {
  const y = oneCampus();
  y.reading[0].files[0].label = "Pdf";
  assert.match(check(y).join("\n"), /reading\[0\]\.files\[0\]\.label: "Pdf" is not one of/);
});

test("an item with no file passes: it shows its title and authors with no link (2017 'Tối ưu hóa', #87)", () => {
  const y = oneCampus();
  y.lectures[0].files = [];
  assert.deepEqual(check(y), []);
});

test("every gallery folder exists and holds photos", () => {
  const y = oneCampus();
  y.gallery.push({ folder: "02-empty" }, { folder: "03-missing" });
  const problems = check(y).join("\n");
  assert.match(problems, /gallery\[1\]\.folder: .*2030\/02-empty\/ holds no photo/);
  assert.match(problems, /gallery\[2\]\.folder: .*2030\/03-missing\/ holds no photo/);
});

test("sessions have valid ISO dates in the year, start and end together, start first", () => {
  const cases = [
    [{ start: "2030-02-30", end: "2030-03-01" }, /sessions\[0\]\.start: "2030-02-30" is not an ISO date/],
    [{ start: "30/07/2030", end: "2030-08-01" }, /sessions\[0\]\.start: "30\/07\/2030" is not an ISO date/],
    [{ start: "2030-07-29" }, /sessions\[0\]: start and end come together/],
    [{ start: "2030-08-09", end: "2030-07-29" }, /sessions\[0\]: ends before it starts/],
    [{ start: "2029-07-29", end: "2029-08-09" }, /sessions\[0\]\.start: not in 2030/],
    [{ campus: "Hồ Chí Minh" }, /sessions\[0\]\.campus: "Hồ Chí Minh" is not one of/],
  ];
  for (const [session, problem] of cases) {
    const y = oneCampus();
    y.sessions = [{ campus: "TP.HCM", ...session }];
    assert.match(check(y).join("\n"), problem, JSON.stringify(session));
  }
  const noDates = oneCampus();
  noDates.sessions = [{ campus: "TP.HCM", venue: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM" }];
  assert.deepEqual(check(noDates), [], "a session without dates (2016)");
});

test("campus appears on groups only in a year held at several campuses, and then on every group", () => {
  const one = oneCampus();
  one.projects[0].groups[0].campus = "TP.HCM";
  assert.match(check(one).join(), /projects\[0\]\.groups\[0\]\.campus: only in a year held at several campuses/);
  const two = twoCampuses();
  delete two.projects[0].groups[1].campus;
  assert.match(check(two).join(), /projects\[0\]\.groups\[1\]\.campus: missing in a year held at several campuses/);
  const elsewhere = twoCampuses();
  elsewhere.projects[0].groups[1].campus = "Trực tuyến";
  assert.match(check(elsewhere).join(), /projects\[0\]\.groups\[1\]\.campus: "Trực tuyến" is not a campus of the year's sessions/);
});

test("a cover is required: one, or one per campus in a year held at several campuses", () => {
  const none = oneCampus();
  delete none.cover;
  assert.match(check(none).join(), /cover: missing/);
  const both = twoCampuses();
  both.cover = image("2030/cover.jpg");
  assert.match(check(both).join(), /cover: give either cover or covers/);
  const single = twoCampuses();
  single.cover = single.covers[0].image;
  delete single.covers;
  assert.match(check(single).join(), /cover: a year held at several campuses has one cover per campus \(covers\)/);
  const short = twoCampuses();
  short.covers.pop();
  assert.match(check(short).join(), /covers: no cover for Hà Nội/);
  const covers = oneCampus();
  covers.covers = [{ image: covers.cover, campus: "TP.HCM" }];
  delete covers.cover;
  assert.match(check(covers).join(), /covers: only for a year held at several campuses/);
  const outside = oneCampus();
  outside.cover = image("2029/cover.jpg");
  assert.match(check(outside).join(), /cover: .* is not in src\/assets\/camp-archive\/2030\//);
});

test("a project topic has at least one group", () => {
  const y = oneCampus();
  y.projects[0].groups = [];
  assert.match(check(y).join(), /projects\[0\]\.groups: empty/);
});

test("text is clean: no markup, zero-width characters, double or edge spaces, no empty string", () => {
  const cases = [
    ["Toán  học", /double space/],
    ["Toán​ học", /zero-width/],
    ["<b>Toán</b>", /markup/],
    [" Toán", /space at an edge/],
    ["", /empty/],
  ];
  for (const [text, problem] of cases) {
    const y = oneCampus();
    y.lectures[1].title = text;
    assert.match(check(y).join(), new RegExp(`lectures\\[1\\]\\.title: .*${problem.source}`), JSON.stringify(text));
  }
});

// ---- The year files --------------------------------------------------------------------------

const yearsDir = join(root, "src/sections/camp-archive/years");
const yearFiles = existsSync(yearsDir) ? readdirSync(yearsDir).filter((f) => f.endsWith(".ts")).sort() : [];

test("years/ holds only <year>.ts files", () => {
  for (const f of existsSync(yearsDir) ? readdirSync(yearsDir) : []) assert.match(f, /^\d{4}\.ts$/, `years/${f}`);
});

for (const f of yearFiles) {
  test(`years/${f} is a valid camp year`, async () => {
    const y = await loadYearFile(join(yearsDir, f));
    assert.deepEqual(yearProblems(y, { file: f }), []);
  });
}

test("the build has a camp archive page for each year file and no other", { skip: distSkip }, () => {
  const built = readdirSync(join(dist, "trai-he-toan-hoc-pima"), { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(dist, "trai-he-toan-hoc-pima", e.name, "index.html")))
    .map((e) => `${e.name}.ts`)
    .sort();
  assert.deepEqual(built, yearFiles);
});

test("an item with no file shows its title and authors, with no link and no dotted leader (2017 'Tối ưu hóa')", { skip: distSkip }, () => {
  const html = readBuilt("trai-he-toan-hoc-pima/2017/index.html");
  const entries = [...html.matchAll(/<li[^>]*class="entry[^"]*"[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  const entry = entries.find((e) => e.includes("Tối ưu hóa"));
  assert.ok(entry, "no 'Tối ưu hóa' entry");
  assert.match(entry, /Phạm Hoàng Nhật/);
  assert.doesNotMatch(entry, /<a |class="leader/);
  // Its neighbours keep their links.
  assert.ok(entries.filter((e) => e.includes("<a ")).length >= 8);
});

test("a YouTube id is 11 characters", () => {
  const y = oneCampus();
  y.video = { youtubeId: "https://youtu.be/8DKLYsikxTs" };
  assert.match(check(y).join(), /video\.youtubeId: .* is not a YouTube id/);
});
