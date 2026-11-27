# 2025 and 2026 camp content inventory

Research for issue #85 (map #83). Question: what do the 2025 and 2026 camps have to carry onto their camp archive pages, from the Drive folders and from the camp pages being removed?

**Sources.**

- Google Drive, read on 2026-11-27 through the Google Drive connector (read-only): [`[Public] Tài liệu Trại hè PiMA 2025`](https://drive.google.com/drive/folders/1C3cRO9e8vHsutvGTPPIVZkMRZAneRnFU) and [`[Public] Tài liệu Trại hè PiMA 2026`](https://drive.google.com/drive/folders/1hpka8hYJ4QzhDoQ8nxTpIblqY1FxHl4S). Every folder was listed with its metadata (size, owner, `visibility`). Permissions were read on both roots and on one report. Every report and every lecture was downloaded to read its first page (`pdftotext -bbox`, which gives each word's position, so the footnote markers ∗ † ‡ § could be matched to the right names).
- The camp pages on branch `dev` at `6c1f6a0`: `src/pages/trai-he-toan-hoc-2025.astro`, `src/pages/trai-he-pima-2026.astro`, and `src/camp/` (`camp-mentors.ts`, `camp-header-photos.ts`, `mentor-logos.ts`, `VideoLightbox.astro`, `CampTeamPhoto.astro`, `CampLayout.astro`). The overview page's topic list is `src/sections/trai-he-toan-hoc-pima/camp-topics.ts`.

**Dump.** One file per year in [`camp-2025-2026-inventory/`](camp-2025-2026-inventory/): `2025.json` and `2026.json`. Vietnamese text is verbatim, typos and `<br />` included. Keys: `counts`, `sharing_summary`, `notes`, `lectures` (number, title, title on the title page, authors, affiliations, date, file), `projects` (title, campus, folder, title and date on the report, campers with schools, slides / report / notebooks), `other_documents` (entrance exam, exercises, reading), `camp_page` (`keep` and `drop`, with repo paths and line numbers), and `files` (every file and folder: path in the folder tree, id, type, MIME type, size, owner, sharing, view URL, plus a Colab URL for notebooks).

## Per year

| Year | Lectures | Projects | Campers listed on reports | Entrance exam | Exercises | Other | Files / folders | Size |
|---|---|---|---|---|---|---|---|---|
| 2025 | 8 PDFs | 11 (5 HN, 6 HCM) | 41 names (see below) | exam + solutions | 1 sheet | 4 reading documents | 41 / 18 | 106.8 MB |
| 2026 | 4 PDFs + 1 practical folder | 6 (no campus split) | 23 | exam only | 4 sheets (one per lecture 1-4) | 18 files of notebooks, data, `uv` project files and two guides in lecture 5 | 42 / 18 | 57.3 MB |

Sizes are in MB of 10^6 bytes, from Drive's `fileSize`. Folder counts include the root.

## Topic names for the overview page

`camp-topics.ts` writes each topic as "Vietnamese - English". From each page's hero text (`<em>` in the first paragraph):

- **2025**: `Toán học trong các Mô hình Tạo sinh - The Mathematics of Generative Models`. The page description and the topic paragraph say the same. The big heading drops "các" ("Toán học trong Mô hình Tạo sinh").
- **2026**: `Toán học trong Trí tuệ Nhân tạo - Mathematics in Artificial Intelligence`. The project slides say the same ("PiMA 2026: Toán học trong Trí tuệ Nhân tạo"). The English part does not follow the old "The Mathematics of …" pattern. It is kept as the source writes it.

## Sharing and ownership

- **Nothing is restricted.** All 83 files and 36 folders have `visibility: anyoneWithLink` with role `reader`. `get_file_permissions` on both roots and on one report confirms this. A `visibility != 'anyoneWithLink'` search under the 2025 root returns nothing. Every file can be linked from the archive page as it is.
- **Owners are spread across personal accounts.** 2025: `danh.tran@pimavn.com` owns 31 files. `toanvv.ti.1922@gmail.com` owns the 8 lectures. `danhtran1604@gmail.com` owns the exercise sheet and the root folder. `ducido.w@gmail.com` owns one report. 2026: `danh.tran@pimavn.com` owns 20 files and `toan.vong@pimavn.com` owns 4. The rest belong to `toanvv.ti.1922@gmail.com` (10), `dunghoang0401237@gmail.com` (5) and `daolamhoang120807@gmail.com` (3). A link breaks if its owner deletes the file or the account. 18 of the 42 files in 2026 and 10 of the 41 in 2025 sit outside the `pimavn.com` domain.
- **The 2025 root has 37 writer accounts.** Every file under it inherits them, so any of these accounts can edit, move or delete files. The 2026 root has only its owner and the public link.

## Lectures

- **2025** (`2. Bài giảng/Slide bài giảng/`, file name `[PiMA-2025] Bài giảng N - <title>.pdf`): 1 Đại số tuyến tính, 2 Giải tích hàm nhiều biến, 3 Xác suất thống kê cơ bản 1, 4 Xác suất thống kê cơ bản 2, 5 Ước lượng tham số, 6 Suy diễn và Mô hình tạo sinh, 7 Học máy và Học sâu cơ bản, 8 Các mô hình học sâu. Every title page names its authors, 2 or 3 per lecture, and 14 people in all. The title page lists affiliations as a block and does not tie each one to an author. Three title-page titles differ from the file names: lecture 2 is "Bài giảng giải tích", lecture 6 "Mô hình tạo sinh và suy diễn", and lecture 7 "Học sâu cơ bản". Lecture 8 is 16.6 MB, over the connector's 10 MB download limit, so its authors come from Drive's text snippet of the title page. `Tài liệu đọc thêm/` holds 4 reading documents: Đại số tuyến tính, Vi tích phân, Xác suất Thống kê, Soạn thảo bằng LaTeX.
- **2026** (`2. Bài giảng/`, file names without extension): 1 Đại số tuyến tính, 2 Giải tích nhiều biến, 3 Xác suất, 4 Trí tuệ Nhân tạo: Học máy (file name `4- …`, no space). Lectures 1-4 each name their authors: 1, 1, 2 and 2. Lectures 1 and 2 say "PiMA 2026" but are dated "Ngày 3 tháng 8 năm 2025". Lecture 5, "Lập trình Học máy", is a folder: a setup README, `Kmeans/` and `Linear_Regression/` notebooks with their data, and a `Student handout/` that repeats the student notebooks with `uv` project files. No file in it names an author.
- Both 2026 lecture-4 authors have the same names as 2025 campers. Nguyễn Minh Đức, the "(Mentor)" on a 2025 report, also co-wrote 2025 lectures 7 and 8. As the old-site inventory found, a name alone does not identify a person.

## Group projects

Each project folder holds `Slides`, `Report` and, sometimes, a notebook. The campers' names and schools come from the first page of the report. Both are in the JSON, verbatim. A title differs between the folder and the report title page, so both are recorded.

**2025.** There are 11 folders named `<topic> (HN|HCM)`. Mô hình khuếch tán, Mạng đối nghịch - tạo sinh, Mô hình đồ thị, Mô hình tự hồi quy and Tự mã hóa biến phân ran at both campuses. Luồng chuẩn hóa ran in HCM only. Reports are dated 31/8 to 16/9/2025. Only 4 projects have a `Notebook.ipynb`: Mô hình đồ thị (HN), Mô hình khuếch tán (HCM), Mô hình tự hồi quy (HCM) and Tự mã hóa biến phân (HCM). The reports list 41 names: 18 for HN and 23 for HCM, 3 or 4 per group. Four of them are not plainly campers:

- "Nguyễn Minh Đức (Mentor)", Trường Đại học FPT, Hà Nội, on Mạng đối nghịch - tạo sinh (HN), is a mentor.
- Three authors have a university affiliation, which the reports do not explain: Nguyễn Văn Khuê (École Polytechnique, Paris) on the same report, and Nguyễn Hữu Phát Lộc (ĐH KHTN, ĐHQG TP.HCM) and Tạ Minh Tuấn (ĐH Công nghệ, ĐHQG HN) on Mô hình đồ thị (HN).

Ask the user whether these four appear as campers.

**2026.** There are 6 folders, one per topic, with no campus suffix: Cây quyết định, Mô hình Markov ẩn, Học tăng cường, Máy vector hỗ trợ, Perceptron nhiều lớp and Phân tích thành phần chính. The reports list 23 campers, 3 or 4 per group, all high-school students. Three title pages carry a group number ("NHÓM 1" to "NHÓM 3"). Two projects have notebooks: Máy vector hỗ trợ has one, and Phân tích thành phần chính has two in a `Notebooks/` subfolder. Two anomalies:

- **Học tăng cường has no file named `Report`.** Its file named `Notebook` is a 27-page LaTeX PDF. Its title page is a report title page (subtitle "Bài toán Máy Đánh bạc Nhiều tay", with the campers and their schools), so it is the report, and the project has no notebook.
- **Campus is unknown.** The folders do not say, and the 2026 camp page has one camp card with no campus name and the 2025 dates. `campus` is `null` in the dump.

## Camp pages: keep or drop

Both pages share one structure (line numbers are in `camp_page` in the JSON).

**Keep (academic content):**

- **Topic**: the hero text, heading and English subtitle, and the 4-item "Nội dung chương trình" list (`src/pages/<page>.astro`). The 2025 topic paragraph is kept. **The 2026 topic paragraph is the 2025 text about generative models, copied unchanged**, so it is not carried over. A 2026 description has to come from the user.
- **Team**: "Ban tổ chức" (PGS. TS. Trần Minh Triết, TS. Cấn Trần Thành Trung) and "Cố vấn chuyên môn" (GS. Trần Thanh Long, TS. Phạm Kim Sơn), each with an affiliation and a photo. They are the same four people on both pages (`src/camp/camp-mentors.ts`, photos in `src/assets/images/`). The mentor-university logo row (`src/camp/mentor-logos.ts`: 11 logos in 2025 with UCLA, 10 in 2026) is optional. It names universities, not people.
- **Photos**: the header collage (`src/camp/camp-header-photos.ts`) has 8 camp photos per page. 2025 shows `trai-he-pima-{1,2,4,5,6,7,8}.avif` and the group photo `481775555-…avif`. 2026 shows `img-6734.jpg`, four Facebook-export JPEGs, `lop-hoc.jpg`, `trai-he-pima-1.avif` and the same group photo. The collage also holds a stock photo (`thisisengineering-…-unsplash.avif`) and two illustrations (`artboard-2.avif`, `artboard-7.avif`), which are not camp photos. **No file records which camp year a photo shows.** The 2026 page predates the August 2026 camp (it still carries 2025 dates), so its photos are probably from 2025 or earlier. The `trai-he-pima-*` photos are also on the overview page (`src/sections/summer-camp-photos.ts`). The og:image is the page's `hero` (`481775555-…` for 2025, `img-6734.jpg` for 2026).
- **Video**: YouTube `8DKLYsikxTs` (`VideoLightbox`) appears on both pages with different thumbnails (`503130863-…jpg` for 2025, `poster-optimized-4000.png` for 2026). It cannot be a video of the 2026 camp.
- **Camps held**, as facts if the archive page shows them. 2025: TP.HCM, 02-09/08/2025, ĐH Khoa học Tự nhiên, ĐHQG-HCM, and Hà Nội, 11-18/08/2025, VIASM (worded "Thời gian dự kiến" on the page). 2026: nothing reliable.

**Drop (recruitment):**

- "Đăng ký ngay" and "Ứng tuyển ngay" buttons (`https://qual.pimavn.com/apply`).
- "Quyền lợi tham gia trại hè" (5 cards).
- "Quy trình tuyển sinh": Đối tượng, Số lượng tuyển, the deadline and the timeline.
- "Kinh phí tham gia".
- "Thông tin liên hệ": fanpage, email and hotlines with names. Also the PiMA team photo next to the list (`pima-team.png`, also used by `src/sections/Philosophy.astro`).
- The recruitment title and meta description of the 2025 page ("Tuyển sinh trại hè toán học PiMA 2025").

## What differs from the old-site years (2016-2023)

From [`old-site-camp-inventory.md`](old-site-camp-inventory.md) (branch `research/old-site-camp-inventory`):

- **Projects and student papers are one thing.** The old site keeps `projects` (title, brief, no authors) apart from `student_papers` (title, authors with schools), linked only by a title that often differs. In 2025-2026 each project folder holds the report (the student paper), its slides and sometimes a notebook, and the campers belong to that one project. Neither year has a project brief or description text.
- **More document kinds**: entrance exam (both years, with solutions in 2025), exercise sheets, reading documents (2025), notebooks, and a code-and-data practical session (2026 lecture 5). The old site has none of these. The "one fixed set of blocks" in map #83 already lists entrance exam and exercises. Notebooks and reading documents need a place in the content model.
- **Two campuses in 2025.** Five topics ran in both HN and HCM, so a project title repeats within the year. A project needs `campus` (or the folder) as part of its key. The old site already had repeated paper titles (2016-2019).
- **Lecture authors are plain names** on the title page. Old-site authors are `organizers.yaml` ids that resolve to a name and an affiliation each. 2025-2026 give no per-author affiliation and use no ids.
- **Every file is on Drive and public by link.** None is in the repo: 83 files, 164 MB. 2023 is the only old-site year that also links to Drive, with 12 links.
- **No gallery.** Neither Drive folder has photos. The camp pages give 8 collage photos each, of uncertain year, and one video. The old site has 38 gallery sections and 724 images for 2016-2019, and no gallery for 2021 and 2023.
- **Team**: the camp pages carry organizers and advisors with photos. The old site's organizing-team pages are not carried over (map #83), but the archive page's team block can take these four people.
- **Language**: page text, folder names and file names are Vietnamese. The topic is bilingual, as in `camp-topics.ts`. The old site had English chrome.

## Missing or to confirm with the user

- The status of the four non-camper names on the 2025 reports (one mentor, three with university affiliations).
- The 2026 campus (or campuses) and dates. The 2026 camp page carries only 2025 information.
- A 2026 topic description, since the page repeats 2025's.
- The camp year of each collage photo and of the video. Photos of the 2025 and 2026 camps beyond these.
- Authors of 2026 lecture 5 (Lập trình Học máy).
- Whether exercises, reading documents, notebooks and the lecture-5 data files are shown on the archive page.
- Whether to move files out of personal accounts, or tighten the 2025 root's 37 writers, before the archive page links them.
