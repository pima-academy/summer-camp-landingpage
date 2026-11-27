# 2024 camp content inventory

Research for issue #92 (map #83). Question: what does the 2024 camp have to carry onto its camp archive page?

**Sources.** The reorganised Drive folder [Tài liệu chung](https://drive.google.com/drive/folders/1RYiyfEmLyUEHL-zqhwAy_kQ2aZt_Rhfw) (tree in #91), read on 2026-11-27 through the Google Drive connector (file metadata, permissions, and a search for `visibility != 'anyoneWithLink'` under the root). Each file was also downloaded once without signing in; every download's byte count matches Drive's `fileSize`. Cover pages were read with `pdftotext`, notebooks as JSON. The existing page: `src/pages/chi-tiet-trai-he.astro`, `src/sections/chi-tiet-trai-he/*.astro` and `src/sections/trai-he-toan-hoc-pima/camp-topics.ts` at `origin/dev`.

**Dump.** [`camp-2024-inventory/2024.json`](camp-2024-inventory/2024.json). Text is verbatim (Vietnamese, original capitalisation). Keys: `summary`, `sharing_summary`, `owners`, `folders`, `files` (path, id, type, size, owner, sharing, dates, view URL, pages), `entrance_exam`, `lectures`, `exercises`, `projects` (title, campers with schools, mentors), `existing_page` (kept text and content gaps), `missing_vs_2025`.

## Counts

| Folder | Files | Size |
|---|---|---|
| `1. Đề tuyển sinh` | 0 (exam pending, the user uploads it later) | 0 |
| `2. Bài giảng` | 4 PDF + 2 `.ipynb` | 2.47 MB |
| `3. Bài tập` | 3 PDF | 1.33 MB |
| `4. Dự án nhóm` | 6 PDF, one per group | 4.84 MB |
| **Total** | **15 files** | **8.63 MB** |

MB are 10^6 bytes. The largest file is `Nhóm 4 - Game Theory.pdf` (1.03 MB).

## Sharing and owners

- **Nothing is restricted.** The root and all 19 items under it are "anyone with the link: reader", inherited from the root (no item disables inheritance). The search for anything else returns nothing. The root is also shared with 25 named accounts (24 writers, 1 reader).
- **Owners are personal accounts:** `khang.nguyenhoang.vn` (9 files and the root), `cantranthanhtrung` (projects 1, 2, 4, 5, 6 and the folder `4. Dự án nhóm`), `danhtran1604` (the LaTeX lecture), `iamnmt03` (the three folders made on 2026-11-27). `pima.vn@gmail.com` and `contact@pimavn.com` are writers only. #86's warning applies: the links survive only while these accounts do.
- The two notebooks' view URLs open in Colab (`colab.research.google.com/drive/<id>`). Drive stores them as `application/octet-stream`.

## Lectures (`2. Bài giảng`)

| File | Cover title | Authors (affiliation as printed) | Date |
|---|---|---|---|
| `Đại số tuyến tính.pdf` (64 p.) | ĐẠI SỐ TUYẾN TÍNH | Linh Tran (Yale), Nghia Nguyen (Rutgers), Trung Can (Caltech) | none |
| `Giải tích.pdf` (36 p.) | VI TÍCH PHÂN | Trung Cấn (Caltech), Ngọc Phạm (Carnegie Mellon) | 19/7/2024 |
| `Quy hoạch tuyến tính.pdf` (22 p.) | QUY HOẠCH TUYẾN TÍNH | Linh Vo (University of Science, VNU-HCM), Quan Phung (Hanoi National University of Education), Khang Nguyen (UCLA) | 23/7/2024 |
| `Soạn thảo văn bản bằng LaTeX.pdf` (63 p., slides) | Seminar topic: Introduction to a Typesetting System | Long Nguyen, Danh Tran | July 23, 2024 |
| `Thuật_toán_đơn_hình.ipynb` | (no title; first heading "1. Biểu diễn Quy hoạch tuyến tính") | none stated | |
| `Giải_các_bài_toán_quy_hoạch_tuyến_tính_bằng_scipy.ipynb` | (no title; first heading "1. Sử dụng scipy và ví dụ") | Vũ Lê Thế Anh ("Được biên soạn bởi … nhằm phục vụ cho Trại hè Toán học và Ứng dụng PiMA 2024") | updated 23/07/2024 |

Author names on the lecture covers are written without diacritics and in given-name-first order ("Linh Tran"), except the calculus notes ("Trung Cấn"). The file name "Giải tích" differs from the cover title "Vi tích phân". The LaTeX lecture is the only English document and the only slide deck.

## Exercises (`3. Bài tập`)

| File | Cover title | Authors |
|---|---|---|
| `Đại số tuyến tính (bài tập).pdf` (4 p.) | Bài tập Đại số Tuyến tính | Đỗ Hoàng Việt, Võ Minh Quân |
| `Quy hoạch tuyến tính (bài tập 1).pdf` (2 p.) | Bài tập Quy hoạch tuyến tính 1 | Nguyễn Hoàng Khang |
| `Quy hoạch tuyến tính (bài tập 2).pdf` (2 p.) | Bài tập Quy hoạch tuyến tính 2 | Nguyễn Hoàng Khang, Võ Thị Khánh Linh |

No exercise sheet for calculus.

## Group projects (`4. Dự án nhóm`)

Six groups of four, 24 campers. Every cover carries "Projects in Mathematics and Applications", the title, a date and four names, each tied to a school by a footnote mark (∗ † ‡ §). Mentors are named in the "Lời cảm ơn" section, not on the cover, except for group 3. Full camper and school lists are in `2024.json`.

| Group (file topic) | Cover title | Date | Campers | Mentors named |
|---|---|---|---|---|
| 1 (Duality) | LÝ THUYẾT ĐỐI NGẪU VÀ ỨNG DỤNG | 8/8/2024 | Nguyễn Đức Nguyên, Huỳnh Hoàng Yến, Nguyễn Hữu Phước, Trần Lê Diễm Quỳnh | Võ Thị Khánh Linh, Phùng Minh Quân |
| 2 (Data Science) | LINEAR PROGRAMMING FOR DATA SCIENCE | 8/8/2024 | Lê Tiến Hợp, Trần Bảo Minh, Nguyễn Thị Bảo Tiên, Nguyễn Mai Anh Thư | Nguyễn Ngọc Cảnh, Vòng Vĩnh Toàn |
| 3 (Combinatorics) | Tối ưu hóa tổ hợp và quy hoạch tuyến tính nguyên | 28/9/2024 | Quốc Bảo, Thu Huế, Ngọc Huy, Nam Kiệt | cover: "Mentor: Minh Quân" (UIUC); thanks: Võ Minh Quân, Đỗ Hoàng Việt, Trần Hoàng Bảo Linh |
| 4 (Game Theory) | Cân bằng Nash trong Lý thuyết Trò chơi | 9/8/2024 | Hoàng Minh Thư, Đào Lâm Hoàng, Nguyễn Kim Ngân, Lý Trần Thái | Vũ Lê Thế Anh, Nguyễn Minh Tú |
| 5 (Portfolio Optimization) | PORTFOLIO OPTIMIZATION | 8/8/2024 | Nguyễn Hồng Ân, Nguyễn Vũ Bách, Nguyễn Trần Thùy Chi, Huỳnh Tuyết Oanh | none ("Các anh chị Mentor") |
| 6 (Interior Point Method) | Phương pháp điểm trong / Interior Point Method | 8/8/2024 | Phạm Quốc Bình, Bảo Quý Định Tân, Nguyễn Trần Hà Phương, Lê Minh Quý | Trần Phan Anh Danh, Nguyễn Hoàng Khang, Vũ Lê Thế Anh |

Schools: mostly Vietnamese high schools (THPT chuyên and others, from Hà Nội to Đồng Nai), plus two abroad: King's College London Mathematics School (group 1) and Wilbraham and Monson Academy (group 6).

## Existing page `/chi-tiet-trai-he/`

Real content, to carry over:

- **Topic** ("Chủ đề"): three paragraphs on what linear programming is. They sit in one `<p>` joined by `<br>`, and the first break holds a zero-width joiner (U+200D), a Webflow leftover.
- **Programme** ("Nội dung chương trình"): four items (linear algebra, LP and modelling; Python and LaTeX; applying them to LP theory or real problems; a group project with mentors), in one `<p>` joined by `<br>`.
- **Topic name**: hero h1 "Quy hoạch Tuyến tính- Linear Programming" (missing space before the hyphen). `camp-topics.ts` has "Quy hoạch Tuyến tính - Linear Programming". SEO title "Quy hoạch tuyến tính | Trại hè toán học PiMA 2024" and a description.

Content gaps (headings with nothing under them, each wrapped in `ContentGap`): "Thông tin trại hè", "Đội ngũ hướng dẫn", "Danh sách trại sinh", "Tài liệu" (sub-headings only, no links), and "Hình ảnh trại hè" (6 placeholder images). The page also shows the shared `Testimonials` section, which is not 2024 content. The page is published but nothing links to it.

The Drive folder now fills the "Danh sách trại sinh" and "Tài liệu" gaps. "Đội ngũ hướng dẫn" can be partly filled from lecture and exercise authors and project acknowledgements, but no team list exists. "Thông tin trại hè" (dates, venue) and the gallery have no source.

## Missing compared with 2025

- **Entrance exam**: pending; `1. Đề tuyển sinh` is empty until the user uploads it.
- **Project material**: one report PDF per group. No slides, no notebooks, no per-project folder with a `Report.pdf`.
- **Photos**: none in the Drive folder, and only placeholders on the page.
- **Campus split**: none; 2024 is one flat set of lectures, exercises and projects.
- **Team list**: no organizers or advisors document.

## Surprises

- **Group 3's cover gives given names only** ("Quốc Bảo", "Thu Huế", "Ngọc Huy", "Nam Kiệt") and its mentor as "Minh Quân". Its date, 28/9/2024, is seven weeks after the others (8-9/8/2024). It is also the only report owned by `khang.nguyenhoang` instead of `cantranthanhtrung`, uploaded on 2024-09-28. It looks like a later revision. Full names would have to come from another source, such as the 2024 camper list.
- **Two people called Minh Quân**: group 1 thanks Phùng Minh Quân (the "Quan Phung" of the LP lecture, Hanoi National University of Education). Group 3 thanks Võ Minh Quân (co-author of the linear algebra exercises), and its cover puts its "Minh Quân" at UIUC. The old-site inventory (#84) lists a Võ Minh Quân as a camper in 2019 and 2021.
- **Several organizers appear under two spellings**: "Trung Can" / "Trung Cấn" / Cấn Trần Thành Trung, "Khang Nguyen" / Nguyễn Hoàng Khang, "Linh Vo" / Võ Thị Khánh Linh, "Danh Tran" / Trần Phan Anh Danh. Group 6 thanks "các nhà sáng lập của trại hè, anh Cấn Trần Thành Trung, anh Trần Hoàng Bảo Linh, anh Lê Việt Hải".
- The cover titles mix languages and cases: two are in English and all caps (groups 2, 5), three are in Vietnamese (groups 1, 3, 4; group 1 in all caps), and only group 6 gives both a Vietnamese and an English title.
