# Redesign content inventory: the impact report against the three pages

Research for issue #120 (map #118). Question: what can the redesigned `/`, `/ve-chung-toi/` and `/lien-he/` draw on from the impact report, and what of it is on the site already?

**Sources.** The impact report `Báo cáo tác động 2016-2024.pdf` (40 pages, InDesign export of 3 September 2025, public on [Issuu](https://issuu.com/pimavn/docs/pima_impact_report_2016-2024_vietnamese_version_)), read with `pdftotext -layout`, `pdfimages -list` and page renders. The site at `origin/dev` (`fcc0321`): `src/pages/index.astro`, `ve-chung-toi.astro`, `lien-he.astro` and the sections they import; `src/assets/camp-archive/`; `src/content/blog/`. The rules applied are the map's Notes in #118 (experts: only the six in `src/sections/team-activities.ts`; no management team; the cleared October 2026 figures replace the report's 2024 figures; no 2027 camp; no phone number; no partnership invitation).

**Page numbers.** "p. N" is the PDF page. The report's printed page number is N − 2 (the cover and its blank back are unnumbered). Image numbers (`#n`) are the `num` column of `pdfimages -list`.

## Summary

- Most of the report is on the site already, much of it word for word: vision, mission, the three actions, the six testimonials, five milestones, the six expert photos, the future plans, the founder story in six steps.
- What the report adds that the site lacks: the camp's goals and three activities as an overview on home or Về chúng tôi (today only on `/trai-he-toan-hoc-pima/`), the Math Modeling course facts (4-week MOOC, PiMA Modelling Challenge 2024), the members' achievements and where they study and work, the alumni network's support, the full milestone list (camp theme per year, first podcast), the partners as events, the media channels.
- Every report figure with a cleared counterpart is superseded. On the site, only `Impact`'s "9" camps is wrong against the cleared list (10 seasons); two of its labels need the cleared wording (see [Figures](#figures-report-vs-cleared-vs-site)).
- Images: three of the four baked-text images (two programme banners, the founder badge, the report card) have a clean way out. The founder badge photo is cut from the report's p. 6 portrait (#11, 893 × 829, clean). The camp banner has many clean camp photos to replace it. The impact report card can use the report's own cover (p. 1, a vector page, renders at any size). **The course banner has no clean photo anywhere**: the report's two course images are screenshots of slides, the archive has camp photos only, and the blog's images are diagrams.

## Chapters

"Use" applies the map's Notes. "Superseded" means the cleared October 2026 list has the same fact with a newer figure or wording.

| Ch. | PDF pp. | What it says | On the site today | Use under the Notes |
|---|---|---|---|---|
| 00 Mục lục | 4–5 | Table of contents; chapter 03 is "Đội ngũ của chúng tôi: Ban sáng lập & Điều hành, Chuyên gia" | — | — |
| 01 Thư ngỏ | 6–7 | Letter from Cấn Trần Thành Trung (Giám đốc Điều hành). Founded 8 years ago; first camp had 15 campers and 4 mentors. "Những thành quả bước đầu": 7 camps, 160+ campers from 33 provinces, 9 courses and talks, 100+ Facebook posts, 23+ researchers and experts, 19 organisations. 2025: from non-profit project to an education organisation, core values kept (learner at the centre, applied thinking, connecting talent). National context: the national talent strategy to 2030, Nghị quyết 57-NQ/TW, the national maths programme 2021–2030, KC.17/25-30. PiMA's aim as a "Vườn ươm nhân tài" (4 bullets). Ends with an appeal to partners. | Not shown. The 2025 transition is in `Milestone` (01/2025) and `FounderStory` step 6. | Usable: "15 campers and 4 mentors" at the first camp (a 2016 fact, no cleared counterpart); the 2025 transition and core values. Superseded: 7 camps, 160 campers, 33 provinces, 100+ posts (cleared: 10 seasons, 200+, 35+, 100+ posts). No cleared counterpart, 2024-era: "23 researchers", "19 organisations", "9 courses and talks": drop or ask. **Not usable:** the closing appeal to partners (a partnership invitation). The national-policy paragraph is the report's framing for partners; nothing in the Notes asks for it. |
| 02 Về chúng tôi | 8–9 | What PiMA is ("tổ chức tiên phong… thành lập năm 2016 bởi các nhà toán học Việt Nam…"); Tầm nhìn (with "hàng đầu"); Sứ mệnh; slogan "Khám phá những biên giới mới của toán học và ứng dụng"; Hành động: Ươm mầm tài năng, Kết nối cộng đồng, Ứng dụng Toán học vào thực tiễn. | All of it. Slogan = `home/Hero` h1. What-PiMA-is = `ve-chung-toi/Intro`. Vision and mission = `ve-chung-toi/VisionMission` (panels 02, 03; panel 03's heading wrongly says "Xuất phát điểm"); mission again in `Philosophy`. Actions = `ve-chung-toi/Actions`, verbatim. | Usable, in the October 2026 wording: the Notes say vision, mission and actions as the report, **without "hàng đầu"**. `VisionMission` panel 02 has "hàng đầu" today and must lose it. |
| 03 Đội ngũ | 10–13 | p. 10: management team (5 people: two co-founders, academic director, engineering lead, operations). pp. 11–12: 18 experts with titles and roles, "sắp xếp theo thứ tự thời gian". p. 13: 8 photos of experts at camp, with captions. | Expert intro paragraph = `Team` lead (verbatim). 6 of the 8 p. 13 photos and captions = `team-activities.ts` (Võ Văn Tới, Lý Quốc Ngọc, Trần Minh Triết, Vương Hy, Lê Thiện, Phạm Kim Sơn). The management list is not on the site. | **Management team: not usable.** Experts: only the six; for them the report adds titles and roles (GS. TS. Võ Văn Tới, PGS. TS. Lý Quốc Ngọc, PGS. TS. Trần Minh Triết, ThS. Lê Thiện, TS. Phạm Kim Sơn, Vương Hy) and headshots, both as of 2024–25. The other 12 experts and the two other p. 13 photos (Trần Nam Dũng, Nguyễn Đình Thúc): not usable until PiMA confirms consent (open question in the Notes). |
| 04 Các cột mốc | 14–15 | "Những tác động tích cực": 1000 learners and experts, 7 camps, 160 campers, 80 lectures, 40 projects, 6 workshops at TP.HCM high schools. Timeline: 08/2016 founding and first camp (Mathematical Modeling); 08/2017 second camp; 02/2018 first workshop (Optimization); 08/2018; 08/2019 (Deep Learning, first on HTV); 07/2021; 07/2023; 07/2024; 10/2024 first podcast; 11/2024 first online course; 01/2025 PiMA Academy JSC; 08/2025 first camp in both TP.HCM and Hà Nội. Each camp with its theme. | `Milestone`: 5 of the 13 entries (08/2016, 02/2018, 11/2024, 01/2025, 08/2025). Numbers: `Impact` (see Figures). | Timeline: usable (dated events, no figures). The camp-theme-per-year entries and the 10/2024 podcast are not on the three pages. Numbers: superseded by the cleared list. Stop before 2026; no 2027. |
| 05.1 Trại hè | 16–19 | Goals: 8–10 days, residential, free, for high-school students nationwide, two goals (advanced maths and applied models; research skills through projects), steer toward STEM. Impact: 7 camps, 160 campers, 40 mentors, 80 lectures, 40 projects. Main activities (3): theory and programming classes; company visits and guest talks; group research projects. Six camper testimonials. Seven closing-day group photos, 2016–2024. | Goals: `SummerCamp` lead says "8 ngày" and "hoàn toàn miễn phí". Activities: only on `/trai-he-toan-hoc-pima/` (`CampActivity`). Testimonials: `Testimonials` has the same six people and quotes. Group photos: the camp archive covers. | Usable: goals and the three activities (wording from the report). Figures superseded (cleared: 10 seasons, 200+ campers, 40+ mentors, 80+ lectures, 50+ projects). The report says 8–10 days, the site says 8: pick one wording. Testimonials stay as they are. |
| 05.2 Khóa học Math Modeling | 20–21 | MOOC "Giới thiệu Mô hình Toán học thông qua các ví dụ – An Example-based Introduction to Mathematical Modeling", 4 weeks, for high-school and university students. 500 sign-ups, 400 on Discord. Lectures from concrete situations; PiMA Modelling Challenge 2024 at the end (teams build a model and present it in a short video). Three learner testimonials. | Only the `ProgramsOverview` banner ("Khóa học Toán Mô Hình") and `Milestone` 11/2024. `/khoa-hoc/` lists the course with a placeholder. | Usable: the course description, its format and the Challenge. Figures: cleared list has 500+ Math Modeling learners (400+ on Discord), 4 online courses, VIASM co-organised with 500 sign-ups: use those. The three learner testimonials: not among "the six alumni testimonials" the Notes keep, and they name the learners; leave out unless PiMA asks. |
| 06 Truyền thông | 22–23 | 14,000 Facebook followers (to 3/2025), 13 online articles, 1 HTV9 bulletin, 8,200 YouTube views (8 expert lectures, 2 podcasts: 10/2024 and 12/2024, ~3,700 views together). | `home/Press`: 5 press quotes with logos (Tuổi Trẻ, Dân trí, CafeF, Mực Tím, Hoa Học Trò). `lien-he/SocialLinks`: Facebook, LinkedIn, YouTube links. No figures. | Facebook figure superseded (16,000+). The other figures (13 articles, 1 HTV9 bulletin, 8,200 views, 2 podcasts) have no cleared counterpart: if used, say "đến 3/2025" or drop them. HTV9 2019 is also a 2019 milestone fact. |
| 07 Mạng lưới nhân tài | 24–27 | 200+ members in 11 countries (alumni, mentors, organisers); where they study and work (MIT, Yale, UCLA, UIUC, ĐHQG-HCM, NTU, Max Planck; Meta, Netflix, Amazon, WorldQuant) with a logo wall; mentors' role; achievements (8 IMO, 1 APIO, 17 national prizes, 1 Olympia champion, 5 valedictorians, "1 giải nhất SCUDEM (Team PiMA)"); 24 named "notable alumni" with current positions; members help each other with scholarship applications, recommendation letters and interview referrals. A paragraph offers partners and investors "cơ hội hợp tác chiến lược". | `ve-chung-toi/MemberUniversities`: 8 logos (UCLA, Stony Brook, NUS, NTU, KHTN, Bách khoa HCM, William & Mary, Bách khoa Hà Nội). `Team` h2 "Kết nối tài năng Việt Nam toàn cầu". Nothing else. | Network size and the where-they-are list: superseded (cleared: 250+ in 11 countries; the cleared list of 14 universities and 8 companies includes every name in the report). Achievements: same numbers as the cleared list, but use the cleared SCUDEM results (2024: 1 Outstanding; 2025: 2 Outstanding, 3 Meritorious) instead of "giải nhất". Mentors' role and the alumni-support paragraph: usable as text. **Not usable:** the 24 named alumni (not among the people the site may show) and the partner/investor paragraph. Note: 5 of `MemberUniversities`' 8 logos (Stony Brook, NUS, Bách khoa HCM, William & Mary, Bách khoa Hà Nội) are in neither the report nor the cleared list; they come only from today's site. |
| 08 Đối tác | 28–29 | Education: ĐH KHTN ĐHQG-HCM ("hỗ trợ tài chính và bảo trợ chuyên môn" 2017–2024), VIASM (co-organised the Math Modeling course). Companies: BioTuring (lectures at the 2023 camp; "tài trợ" the 2024 camp), FPT Software AI Center (hosted the 2024 company visit). Media: 12 outlets (Tạp chí Pi, Mực Tím, Tuổi Trẻ, VTC News, Hoa Học Trò, CafeBiz, Dân Trí, KHTN, Người Đô Thị, SOHA, Dân Việt, HTV9). | `Partners`: 2 logos (BioTuring, KHTN) and a generic lead. `home/Press`: 5 of the 12 outlets. | Partners: use the cleared wording ("as events": KHTN academic sponsorship and co-organiser 2017–2026; BioTuring taught 2023 and companion 2024–2026; FPT Software hosted the 2024 campers at FTown 3; VIASM co-organised the course in 11/2024; ĐH Quốc tế hosted the 2017 camp). The cleared list replaces the report's wording, including its funding words ("hỗ trợ tài chính", "tài trợ"). The report has logos for KHTN, VIASM, BioTuring, FPT (small, see images); none for ĐH Quốc tế. Media outlet list: usable. |
| 09 Câu chuyện nhà sáng lập | 30–35 | Summer 2016: Cấn Trần Thành Trung, then a student at Duke, spent his Duke personal-development summer grant on a free maths camp in Vietnam; co-founded with Trần Hoàng Bảo Linh and Lê Việt Hải. 2014: the gap he saw between US and Vietnamese maths education. The first camp. After two years: support from ĐH KHTN, donors, alumni parents and tech companies. 2025: PiMA Academy. "Hàng nghìn người" took part; alumni at MIT, Yale, Google, Meta. Pp. 33–35: a photo spread (camps, workshops at high schools, Math Open Day). | `ve-chung-toi/FounderStory`: six steps, titles = the report's sub-headings, texts are loose paraphrases with claims not in the report (step 5 "mạng lưới mentor toàn cầu, kết nối với… các trường phổ thông hàng đầu"; step 6 "hợp tác sâu với… trường đại học quốc tế"). `home/FoundingStory`: a panel whose h3 and lead are copies of `ProgramsOverview`'s (wrong text) plus the badge photo. | Usable, and the Notes say the founder story is rewritten from this chapter. Two names to check: Trần Hoàng Bảo Linh is a co-founder in this chapter but sits in the management team of chapter 03 (the site shows him today in the two-founders photo and caption); Lê Việt Hải is named only here. "Hàng nghìn người" → cleared "1,000+". "Google" is in this chapter but not on the cleared list. |
| 10 Kế hoạch tương lai | 36–37 | 3–5 year vision ("trung tâm đào tạo, nghiên cứu Toán học và ứng dụng hàng đầu ở Việt Nam…"); three plan blocks (training and research; partnerships, incl. a PiMA scholarship fund; academic community). P. 37: "Học viên là động lực và trọng tâm." | `ve-chung-toi/FuturePlans` (verbatim in substance). `Philosophy` h2 "Học viên chính là động lực và trọng tâm". | Usable. Open point: the Notes drop "hàng đầu" from the vision; the 3–5 year goal and `FuturePlans`' h2 use it too. |
| 11 Liên hệ | 38–40 | Công ty Cổ phần PiMA Academy; email `contact@pimavn.com`; website `pimavn.com`; Facebook `facebook.com/pima.vn/`. No phone, no address. | `ContactFacts`, `ContactSection`: Facebook `fb.com/pima.academy.vn`, the same email, address from `site.ts`. `site.ts` also has `phone`. | Email: same. Facebook: the report's `pima.vn` is older; the Notes' `pima.academy.vn` wins. Drop `phone` (Notes). |

### Figures: report vs cleared vs site

| Fact | Report (2024–3/2025) | Cleared (10/2026) | Site today |
|---|---|---|---|
| Camps | 7 | 10 seasons (2016–2026) | `Impact`: "9" |
| Campers | 160, from 33 provinces | 200+, from 35+ provinces | `Impact`: "200+" (no provinces) |
| Lectures | 80 | 80+ | `Impact`: "80+" |
| Student projects | 40 | 50+ | `Impact`: "50+" |
| Mentors | 40 | 40+ | — |
| Participants | 1000 learners and experts; "hàng nghìn" | 1,000+ | `Impact`: "1000+" |
| School workshops / talks | 6 workshops | 6 talks at TP.HCM high schools | `Impact`: "6 Workshop…" |
| Online courses | 1 (9 courses and talks in the letter) | 4 | — |
| Math Modeling | 500 sign-ups, 400 on Discord | 500+ learners, 400+ on Discord | — |
| Network | 200+ in 11 countries | 250+ in 11 countries | — |
| Facebook | 14,000 followers, 100+ posts | 16,000+ followers, 100+ posts | — |
| SCUDEM | "1 giải nhất" | 2024: 1 Outstanding; 2025: 2 Outstanding, 3 Meritorious | — |
| Other achievements | 8 IMO, 1 APIO, 17 national, 1 Olympia, 5 valedictorians | same | — |

`Impact`'s "9" is the only number on the site that is wrong against the cleared list; its labels ("Workshop", "Người tham gia") need the cleared wording.

## Images in the report

`pdfimages -list` gives 234 entries: 68 soft masks and 166 images. Of the images, 49 are photos (including 7 screenshots and designed frames, all in the first table); the rest are headshots, logos, icons, the brand graphics, textures and one signature. Repeated icons (p. 18, 21) are counted each time they appear.

**Columns.** *Clean*: no text laid over the photo (text that is part of the scene, such as a banner or a slide on the wall, counts as clean). *Web*: L ≥ 1600 px wide (full-bleed); M 900–1599 (a half-width card, or full width at 1×); S 400–899 (a small card or thumbnail); XS < 400 (avatar or logo only). *People*: ✓ only people the site may show (the six experts, campers in group shots, the founder TS. Cấn Trần Thành Trung); ✗ shows someone else identifiable (management, other experts, a named speaker, close-ups of organisers or mentors); "group" = a crowd of campers with organisers and mentors among them, which is how the camp archive already shows them.

### Event photos

| p. | # | Pixels | Caption or subject | Clean | Web | People |
|---|---|---|---|---|---|---|
| 6 | 11 | 893 × 829 | "TS. Cấn Trần Thành Trung", in doctoral regalia, outdoors | yes | S (just under M) | ✓ founder. Source of `pima-founder.png` |
| 9 | 18 | 904 × 651 | "Hoạt động dự án nhóm ở Trại hè PiMA" | yes | M | group |
| 9 | 19 | 911 × 702 | "Một tiết học lí thuyết ở Trại hè PiMA" (2024, Linear Programming on the screen) | yes | M | group |
| 9 | 20 | 904 × 651 | "PiMA tại Ngày hội Toán học Mở – Math Open Day 2024": two members with PiMA paddles by the standee | yes | M | ✗ two close-ups |
| 13 | 55 | 904 × 534 | "Thầy Võ Văn Tới giới thiệu ngành kĩ thuật y sinh…" | yes | M | ✓ expert. Larger than `screenshot-29.avif` (708 px) |
| 13 | 54 | 640 × 379 | "Thầy Trần Nam Dũng nhận quà cảm ơn từ PiMA" | yes | S | ✗ expert not among the six |
| 13 | 56 | 904 × 536 | "Thầy Lý Quốc Ngọc trình bày về ứng dụng của mạng học sâu…" | yes | M | ✓ expert. Larger than `screenshot-32` |
| 13 | 57 | 904 × 536 | "Thầy Trần Minh Triết giới thiệu về những ứng dụng của trí tuệ nhân tạo" | yes | M | ✓ expert. Larger than `screenshot-31` |
| 13 | 59 | 904 × 535 | "ThS. Lê Thiện giới thiệu về học máy" | yes | M | ✓ expert. Larger than `screenshot-27` |
| 13 | 58 | 904 × 535 | "TS. Phạm Kim Sơn giới thiệu về các bài toán trong tin sinh học" | yes | M | ✓ expert. Larger than `screenshot-33` |
| 13 | 60 | 623 × 368 | "Thầy Nguyễn Đình Thúc giảng bài về dữ liệu và bảo mật" | yes | S | ✗ expert not among the six |
| 13 | 61 | 904 × 529 | "Mentor Vương Hy giới thiệu các mô hình toán học trong giải mã gen" | yes | M | ✓ expert. Larger than `screenshot-30` |
| 14 | 62 | 650 × 418 | Milestone 2016: a class | yes | S | group |
| 14 | 63 | 643 × 416 | Milestone 2018: a lecture (slide "Quy hoạch tuyến tính") | yes | S | ✗ one lecturer, unnamed |
| 15 | 64 | 683 × 413 | Milestone 2019: HTV9 frame of the 2019 opening | **no** (TV caption and channel logo) | S | group |
| 15 | 65 | 673 × 418 | Milestone 2023: group under the PiMA banner | yes | S | group |
| 16 | 66 | 904 × 531 | "Trại sinh PiMA chụp hình lưu niệm với Thầy Trần Minh Triết" | yes | M | ✓ group + expert |
| 17 | 67 | 1110 × 728 | "Mentor giảng bài trong giờ tư vấn" | yes | M | ✗ mentor close-up |
| 17 | 68 | 904 × 534 | "Diễn giả Vân Nguyễn… tham quan trụ sở… FPT Software" | yes | M | ✗ named speaker |
| 17 | 69 | 904 × 593 | "Thuyết trình dự án nhóm" | yes | M | group (campers presenting) |
| 19 | 89 | 904 × 534 | "Trại hè PiMA 2016: Toán mô hình" (closing group) | yes | M | group. Same shot as `camp-archive/2016/cover.jpg` (1100 px) |
| 19 | 90 | 904 × 534 | "Trại hè PiMA 2017…" (group) | yes | M | group |
| 19 | 95 | 904 × 533 | "Trại hè PiMA 2018…" (group) | yes | M | group |
| 19 | 91 | 1032 × 610 | "Trại hè PiMA 2019…" (group) | yes | M | group. Archive cover is 2880 px |
| 19 | 94 | 685 × 667 | "Trại hè PiMA 2021…" (online collage, "Thank you!") | **no** (designed collage with name tags) | S | ✗ named faces. Same as `camp-archive/2021/cover.jpg` |
| 19 | 92 | 904 × 535 | "Trại hè PiMA 2023…" (group) | yes | M | group. Archive cover is 2880 px |
| 19 | 93 | 904 × 531 | "Trại hè PiMA 2024: Quy hoạch Tuyến tính" (group outdoors) | yes | M | group. Archive cover is 1326 px |
| 20 | 96 | 1239 × 710 | "Một trong những video dự thi đạt giải…" (slide "Vị trí mở cửa hàng tiện lợi") | **no** (screenshot of a slide) | M | none |
| 20 | 97 | 1133 × 667 | "Bài giảng buổi 2… trên kênh YouTube" (lecture slide "Định nghĩa ma trận") | **no** (screenshot) | M | none |
| 22 | 107 | 782 × 259 | "Trang Facebook – kênh thông tin chính" | **no** (screenshot) | S | none |
| 23 | 108 | 1332 × 850 | "Trại hè PiMA 2019 trên kênh HTV9" | **no** (TV caption) | M | ✗ one person close-up |
| 23 | 109 | 909 × 521 | "PiMA Podcast tháng 12/2024…" (video call) | **no** (call UI, names) | M | ✗ |
| 30 | 187 | 1080 × 634 | "Hai người bạn thân đồng sáng lập PiMA: Trần Hoàng Bảo Linh (trái) và Cấn Trần Thành Trung (phải)" | yes | M | ✗? shows a co-founder listed in the management team. Same file as `impact-report-no-q-111sdfs.avif`, on the site today |
| 31 | 188 | 874 × 733 | "Buổi học đầu tiên của Trại hè PiMA 2016 do Trung giảng dạy" | yes | S | ✓ founder |
| 31 | 189 | 593 × 389 | "Những bạn trại sinh đầu tiên của PiMA" | yes | S | group |
| 32 | 190 | 904 × 593 | "Trại hè PiMA 2024 diễn ra thành công tốt đẹp" (group) | yes | M | group |
| 32 | 191 | 1243 × 735 | "TS Trung chia sẻ về câu chuyện của PiMA tại lễ kỷ niệm 30 năm thành lập ĐHQG-HCM" | yes (podium sign is in the scene) | M | ✓ founder |
| 33 | 195 | 913 × 1176 | "PiMA tại Ngày hội Toán học Mở – Math Open Day 2019" (portrait) | yes | M | ✗? school students at a fair, not campers |
| 33 | 193 | 912 × 535 | "Trại sinh tham gia trò chơi giải mật thư" | yes | M | group (campers) |
| 33 | 194 | 903 × 563 | "PiMA và các học sinh tại workshop Xác suất Thống kê tại trường THPT Gia Định" | yes | M | ✗? school students, not campers |
| 33 | 192 | 2048 × 1315 | "Một tiết học của các trại sinh PiMA 2018" | yes | **L** | group |
| 34 | 199 | 2048 × 1314 | "Ban tổ chức và trại sinh PiMA 2019" (group, banner "The Mathematics of Deep Learning") | yes | **L** | group |
| 34 | 196 | 904 × 534 | "Workshop Lí thuyết Trò chơi… Phổ thông Năng khiếu" | yes | M | ✗? school students |
| 34 | 197 | 960 × 568 | "…workshop Lí thuyết Đồ thị tại trường THPT Nguyễn Thị Minh Khai" | yes | M | ✗? school students and teachers |
| 34 | 198 | 716 × 960 | "Mentor giảng bài cho trại sinh" (portrait) | yes | S | ✗ mentor close-up |
| 35 | 201 | 904 × 535 | "Một tiết học của trại sinh PiMA 2023" | yes | M | group |
| 35 | 202 | 903 × 564 | "Ban tổ chức Trại hè PiMA 2024" (organisers only) | yes | M | ✗ organisers only |
| 35 | 203 | 913 × 1172 | "Các học sinh tham gia hoạt động của PiMA tại… Math Open Day 2024" (portrait) | yes | M | ✗? school students |
| 35 | 200 | 2048 × 1314 | "Trại sinh PiMA 2024 tại chuyến tham quan trụ sở công ty FPT Software" | yes (FPT sign in the scene) | **L** | group |

"✗?" marks school students who are not campers: not in the allowed set as worded; ask before using.

### Headshots

All are 128–370 px squares (XS, avatar only), most cut out on a transparent mask.

| p. | Who | # |
|---|---|---|
| 10 | Management team: Cấn Trần Thành Trung (#21, 250 × 242), Trần Hoàng Bảo Linh (#27), Vũ Lê Thế Anh (#29), Nguyễn Hồ Thăng Long (#23), Phan Thị Mỹ Linh (#25) | ✓ #21 only (founder); the rest ✗ (management) |
| 11 | Experts: Trần Minh Triết #32 (250), Võ Văn Tới #35 (213), Lý Quốc Ngọc #36 (250), Lê Thiện #40 (**128**, too small for a 2× avatar above 64 px) | ✓ |
| 12 | Experts: Phạm Kim Sơn #42 (211), Vương Hy #50 (259) | ✓ |
| 11–12 | The other 12 experts (#31, #34, #37, #39, #41, #44–47, #49, #51, #52) | ✗ until PiMA confirms |
| 18 | The six testimonial campers (#70–76, ~250) | already on the site as `artboard-*-4x.avif` |
| 21 | Three course learners (#98–100) | ✗ |
| 25–27 | 24 notable alumni (#129–154, ~209–218 px) | ✗ |

Mapping by position on the page, checked against a render of pp. 10–12.

### Graphics, logos, other

- **Brand graphics (clean, no people):** the geodesic sphere line art, p. 1 #0/#1 (2247 × 2196, white on a mask; L) and p. 3 #4/#5 (1384 × 1476); p. 38 #222/#223 (1965 × 2394, pixelated outline). Usable as decoration in place of a photo. The PiMA logos (p. 1 #2, p. 3 #9, p. 8 #14, p. 40 #232) duplicate `src/assets/logo/`.
- **Logos (XS, 97–631 px, on masks):** p. 24, where members study and work (Yale, UIUC, Max Planck, WorldQuant, UCLA, ĐHQG-HCM, NTU, Meta, Netflix, Amazon); p. 28, VIASM (631 × 168), KHTN (348 × 286); p. 29, BioTuring (426 × 170), FPT (448 × 253), and the 12 media outlets. Usable at logo size; official vector files would be sharper.
- **Not for the web:** the signature (p. 7 #12), the quote mark (p. 8 #16), grid textures (p. 3, 36–39), the plan icons (p. 36), the contact icons (p. 38).
- **The cover (p. 1)** is a vector page (title type, sphere art and the green logo). `pdftoppm -r 150 -f 1 -l 1` renders it at 1122 × 1594 px, any larger size on request.

## The baked-text images on the three pages

| Image on the site | Where | What is baked in | Clean replacement | Candidates |
|---|---|---|---|---|
| `src/assets/images/trai-he-toan-hoc.png` (510 × 300) | `ProgramsOverview` (home, Về chúng tôi) | "Trại hè Toán học", the arrow button, the green card. The photo is a girl holding books in black and white; it looks like a stock photo and is not traceable to any PiMA camp. | **Yes, many.** | L: report p. 33 #192 (class 2018), p. 34 #199 (group 2019), p. 35 #200 (group 2024 at FPT Software). Archive: `src/assets/camp-archive/2025/cover-tphcm.jpg` (1920 × 1280), `2025/cover-ha-noi.jpg` (2048 × 1365), `2026/cover.jpg` (2048 × 912), `2019/cover.jpg` (2880 × 1128), `2023/cover.jpg` (2880 × 1008), `2024/cover.jpg` (1326²). Activity shots for a card that is not a group photo: `camp-archive/2016/02-nhung-buoi-hoc-dau-tien/*`, `2018/04-ben-trong-lop-hoc/*`, `2019/08-thuyet-trinh/*` (1100 px and up). |
| `src/assets/images/khoa-hoc-toan-mo-hinh.png` (510 × 300) | `ProgramsOverview` | "Khóa học Toán Mô Hình", the arrow, the card; a stock light bulb over an open book. | **No clean photo exists.** The report's two course images (p. 20 #96, #97) are slide screenshots; the course was online, so the archive has nothing; blog images are diagrams. | Options, none a photo of the course: (a) the report's sphere line art (p. 1 #1, 2247 px) or another brand graphic; (b) `src/assets/images/dan-cristian-padure-h3kuhyuce9a-unsplash.avif` (6000 × 4000, a stock blackboard of formulas, already in the repo for `/chi-tiet-khoa-hoc/`); (c) a cropped p. 20 #97 lecture slide, which is still text; (d) a type-only card. Needs a decision. |
| `src/assets/images/pima-founder.png` (362 × 449) | `home/FoundingStory` | "Đồng sáng lập PiMA" badge, the name "Cấn Trần Thành Trung", a cut-out on a pale-green rounded box. | **Yes.** The source photo itself, uncut. | Report p. 6 #11 (893 × 829, doctoral regalia; by eye the same shot the badge was cut from). Alternatives with context: p. 32 #191 (1243 × 735, speaking at ĐHQG-HCM's 30th anniversary), p. 31 #188 (874 × 733, teaching the first class in 2016). Headshot p. 10 #21 (250 px) for an avatar. Not in the archive or the blog: archive captions do not name him in any photo. |
| `src/assets/images/pima-impact-report.png` (366 × 177) | `Impact` (home, Về chúng tôi, camp page) | "Đọc chi tiết Báo cáo Tác động…", "Báo cáo Tác động 2016-2024", "Tìm hiểu thêm", a small cover thumbnail. | **Yes.** | The report's cover, p. 1, rendered from the PDF (vector; 1122 × 1594 at 150 dpi). The cover's own title is part of the object shown, as on any book cover; the card's text and link become HTML. Alternative: the sphere graphic p. 1 #1. |

## Other findings

- **Larger copies of photos already on the site.** The six expert photos in `team-activities.ts` are ~707 px wide; the report has the same shots at 904 px (p. 13). The 2016 group cover is 1100 px in the archive, 904 px in the report: the archive wins there.
- **Copy defects on the three pages, seen while reading** (may already be in #46): `home/FoundingStory`'s h3 and lead are copies of `ProgramsOverview`'s ("Các chương trình của chúng tôi"); `VisionMission` panel 03 is headed "Xuất phát điểm" instead of "Sứ mệnh"; `Partners`, `ProgramsOverview` and `FoundingStory` share one lead paragraph about partners.
- **Claims on the site with no source in the report or the cleared list:** `FounderStory` steps 5 and 6 (above); 5 of the 8 `MemberUniversities` logos. CafeF, in `home/Press`, is not in the report's media list (which has CafeBiz, a different outlet); the quote links to its article, so it stands on its own source.
- **For PiMA (adds to the Notes' open questions):** whether Trần Hoàng Bảo Linh, a co-founder in chapter 09 and a manager in chapter 03, may appear in the founder story and its photo; whether "hàng đầu" goes from the future plans too; what image the course card gets.
