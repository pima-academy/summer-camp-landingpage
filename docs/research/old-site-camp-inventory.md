# Old site camp content inventory, 2016-2023

Research for issue #84 (map #83). Question: what does the old site hold for each camp year (2016, 2017, 2018, 2019, 2021, 2023), in a shape the camp archive page content model can be built on?

**Source.** Repo [`pimavn/pimavn.github.io`](https://github.com/pimavn/pimavn.github.io), branch `master` (the GitHub Pages source, `/` path), commit `2b1a1fa2a62254e46ad8eba9c9fe7f8c6f733076` (2024-10-31, "add 2023"). The other branches (`camp-2021`, two dependabot branches) are behind `master` with no extra commits. Every claim below comes from the front matter in `summer_camps/<year>/*.html`, `_data/organizers.yaml`, `_data/banners.yaml`, `_layouts/*.html`, `_includes/*.html`, and the git tree (`git/trees/HEAD?recursive=1`, which gives each file's size). Live pages were spot-checked on 2026-11-27 only to confirm rendering (`Cannot find field`, `<br>`, disabled links, 404 galleries). Google Drive links were fetched once, unauthenticated, on 2026-11-27.

**Dump.** One file per year in [`old-site-camp-inventory/`](old-site-camp-inventory/): `2016.json` … `2023.json`. Texts are verbatim (Vietnamese, including typos, `<br>` and zero-width spaces). Each title also has a `title_plain` (with `<br>` and zero-width spaces removed). Lecture authors are resolved through `organizers.yaml` (name, aff, info, photo with its size). Every file carries its repo path and byte size, or its Drive URL with the result of the access check. Keys per year: `banner`, `index` (sections, gallery block, preview images), `lectures`, `projects`, `student_papers`, `gallery`, `organizing_team` (kept only as author context, `carry_over: false`), `rendering` (what the layouts add), `files` (counts, bytes, unreferenced files), `notes`.

## Per year

| Year | Banner subtitle | Lectures | Projects | Student papers (authors) | Gallery sections / images | Files in `pdf/<year>/` | Images in `images/<year>/` | Drive links |
|---|---|---|---|---|---|---|---|---|
| 2016 | Mathematical Modelling | 5 | 4 | 5 (15) | 7 / 114 | 14 PDF, 18.0 MB | 120 jpg, 25.3 MB | 0 |
| 2017 | Mathematical and Multidisciplinary Models | 9 (1 without file, 1 GitHub repo) | 3 | 6 (19) | 9 / 116 | 16 PDF, 14.5 MB | 116 jpg, 14.6 MB | 0 |
| 2018 | The Mathematics of Machine Learning | 4 | 4 | 7 (28) | 12 / 217 | 15 PDF, 13.1 MB | 221 jpg, 38.2 MB | 0 |
| 2019 | The Mathematics of Deep Learning | 17 (4 are the 2018 lectures) | 5 | 6 (24) | 10 / 277 | 24 PDF, 35.1 MB | 283 jpg, 112.1 MB | 0 |
| 2021 | The Mathematics of Data Science | 5 (all ZIP) | 8 | 8 (31, all ZIP) | none | 8 PDF + 13 ZIP, 87.4 MB | 3 jpg, 9.7 MB | 0 |
| 2023 | The Mathematics of Bioinformatics | 4 (Drive folders) | 4 (Drive files) | 4 (16, Drive folders) | none | 0 | 3 jpg, 36.7 MB | 12 |
| **Total** | | **44** (40 distinct files) | **28** | **36 (133)** | **38 / 724** | **90 files, 168.0 MB** | **746 jpg, 236.6 MB** | **12** |

Sizes are from the git tree, in MB of 10^6 bytes. Image counts include the banner and index section images; gallery images alone weigh 24.0 / 14.6 / 35.5 / 109.8 MB for 2016-2019.

The 2021 and 2023 banners are outliers: `images/2023/banner.jpg` is 34.2 MB and `images/2021/banner.jpg` is 9.3 MB; every other banner is under 0.7 MB.

## What each page carries

Front matter fields, from `summer_camps/<year>/*.html`:

- **`index.html`** (layout `index-year`): `sections[]` of `{title, description, img, href}`. All years have "Student Papers" and "Lectures and Projects". 2016-2018 also have "Organizing Team". Then `gallery-section` `{title, description, href}` plus `gallery[]` preview `{img, caption}` (4-5 images, the only captions on the site), or `gallery-section.disable: true` (2021, 2023). The descriptions are the same boilerplate every year, except that 2023 says "nhóm 4 người" where the others say "nhóm từ 3 đến 4 người", and 2016-2017 end the lectures text with ",..." where the others use "…".
- **`lectures_and_projects.html`**: `lectures[]` `{title, href, authors[]}`, where authors are ids into `organizers.yaml`; `projects[]` `{title, href, desc}`. **Projects have no authors.**
- **`student_papers.html`**: `papers[]` `{title, href, authors[] {name, school}}`. Campers are written inline and are not in `organizers.yaml`. A paper does not reference its project; the only link between them is the title, which often differs (see below).
- **`gallery.html`** (2016-2019 only): `sections[] {section-name, list[] {img}}`. No image on a gallery page has a caption.
- **`organizing_team.html`**: `teams[] {team-name, list[] of ids}`. Not carried over (map #83).
- **Banner** (`_data/banners.yaml`, key `pima<year>`): `title` (English, e.g. "PiMA Summer Camp 2019"; 2021 and 2023 say "PiMA Virtual Summer Camp"), `subtitle` (the topic), `img`, and for 2018 only a `desc` paragraph. The 2016 and 2017 banners reuse gallery photos (`img7-16.jpg`, `img8-23.jpg`).

What the layouts add beyond the front matter (`_layouts/`, `_includes/`):

- Fixed English headings: the page `title` as h2 ("Lectures and Projects", "Student Papers", "Gallery"), then "Lectures" and "Projects" as h3. Every file link is a button labelled "Link". Index sections end in a "Learn More" button. The browser title is "`<title>` - PiMA `<year>`".
- A lecture author renders as "**name**, aff". The organizer's `info` and photo are not shown on the lectures page. An unresolved id renders as the literal text "Cannot find field *hoang* in *organizers.yaml*" (confirmed on the live 2017 page).
- A lecture's relative `href` is prefixed with `site.url` (`https://pimavn.github.io`). An empty `href` renders a **disabled** button that points to the site root. Project and paper hrefs are output as is.
- Front matter strings are output raw, without Markdown processing: `<br>` becomes a line break, and `d < D` (2021 Isomap/LLE descriptions) stays literal text.
- The gallery lightbox caption is `section-name<br>caption`; images sit in a 3-column table.
- Footer: "Copyright © PiMA 2016-2021" on every year, 2023 included.

## Authors (`organizers.yaml`)

`organizers.yaml` has 47 ids. 34 of them appear as lecture authors, plus `hoang`, which does not resolve. The others (`huyhoang`, `lien`, `minh`, `minhhoang`, `ngoc`, `nhu`, `phu`, `tien`, `trannamdung`, `truonghai`, `tu`, `tuananh`, `vovantoi`) appear only in organizing teams or nowhere. Each entry has `name` and `aff`; some also have `info` (degree or role) and `img` (19 photos in `images/organizers/`, all present, 1.6 MB; `thien.jpg` alone is 0.9 MB).

- **Unresolved id: `hoang`**, on the 2017 lecture "Đồ thị" (`dothithuattoan-minhhoang.pdf`). The intended id is almost certainly `minhhoang` (Phan Minh Hoàng, University of Waterloo), since that entry's photo is `hoang.jpg` and the file name ends in `minhhoang`. This is the only unresolved id in lectures and teams.
- **One person, several ids**, where the affiliation changed over time: `linh` / `linh_2` (Trần Hoàng Bảo Linh, NUS / Yale), `theanh` / `theanh_2` (Vũ Lê Thế Anh, VNUHCM / UIUC), `ngng` / `ngng2` (Nguyễn Nguyễn, VNUHCM / Duke). The 2023 organizing team uses `theanh` while the 2023 lectures use `theanh_2`. An affiliation in `organizers.yaml` is a snapshot and is not tied to a year.
- `tu` (Nguyễn Ngọc Minh Tú) and `tu_2` (Nguyễn Minh Tú) are different people.
- Text noise: `tai` and `tuananh` have a zero-width space at the start of `aff`. `ngoc` has a trailing space inside the quoted name.
- 18 campers named in student papers have the same name as a later lecture author (e.g. Vũ Lê Thế Anh, camper 2016 and lecturer 2017-2023; Nguyễn Trung Nghĩa, camper 2017 and lecturer 2018-2023). At least one is a different person with the same name: Nguyễn Thị Mai Anh, camper 2021 at THPT Chuyên Phan Bội Châu, and `maianh`, lecturer 2017 at MIT. Võ Minh Quân is a camper in both 2019 and 2021, at two different schools. A name alone does not identify a person.

## Files

- **In the repo**: `pdf/` has 90 files, 168.0 MB in all: 77 PDFs and 13 ZIPs. Every one of them is referenced by a page, and no page references a repo path that is missing. The 13 ZIPs are all from 2021: the 5 lectures (38.1 MB) and the 8 student papers (46.8 MB). Their contents are unknown without downloading them. The 2021 projects are single PDFs of about 0.3 MB each. The largest single files are `images/2023/banner.jpg` (34.2 MB), `pdf/2021/lectures-and-projects/linearalgebra.zip` (14.5 MB) and `pdf/2021/student-papers/GaussianMixture.zip` (13.3 MB). None is near GitHub Pages' 100 MB per-file limit, but together PDFs and photos come to about 405 MB.
- **On Google Drive (2023 only)**: 12 links, all public as of 2026-11-27 (HTTP 200, the Drive viewer opens without sign-in). The 4 lectures link to folders: XSTK has 4 PDFs, DSTT 1, CTDLGT 2, Tin Sinh 2. The 4 projects link to single files (`PiMA_2023_DuAn_MoTa_<Project>.pdf`). The 4 student papers link to folders, each holding `BaoCao` (report), `MoTa` (the same project brief) and `Slide` PDFs. The file names seen in each folder are in `2023.json` under `http_check.folder_files_seen`; Drive does not show sizes on the public folder page.
- **External**: the 2017 lecture "Giới thiệu về Python" links to the personal GitHub repo `hoangvanthien/Python-workshop-PiMA-2017` (HTTP 200 today).
- **Images not used**: 2016 has 6 photos in the repo that no page shows. Five are commented out with "TODO: Change the ratio to 3:2" (`img3-2`, `img5-10`, `img5-11`, `img7-1`, `img7-3`), and `img3-6.jpg` is simply missing from the list. 2019 has 3 (`3/02`, `6/24`, `6/34`), plus gaps in the numbering for files that were never committed (e.g. `1/22`, `2/07`). `images/2016/images.txt` and `images/2017/images.txt` are helper lists.
- **Byte-identical images**: in 2018, `4/5.jpg` = `5/5.jpg`, the same photo in "Bên trong lớp học" and "Giao lưu với PGS. Đình Điền". In 2019, `2/01.jpg` = `lectures_and_projects.jpg` (the index section image). No two PDFs are byte-identical.

## Variation between years

- **2016-2019** follow one complete shape: index with gallery preview, lectures and projects as repo PDFs, student papers as repo PDFs, and a sectioned gallery. 2016 gallery sections have English names ("Opening Ceremony", "The Big Game"). 2017 uses Vietnamese names. 2018 and 2019 use Vietnamese names with a number prefix ("1. Khai mạc - Giao lưu với GS. Hồ Tú Bảo (VIASM)"). 2018 and 2019 keep images in numbered subfolders (`images/2018/1/10.jpg`); 2016 and 2017 keep them flat (`img<section>-<n>.jpg`).
- **2019** relists the four 2018 lectures with the 2018 files and a "<br> (2018)" suffix in the title, ahead of its own 13 lectures. A lecture can belong to several years, so a lecture needs an origin year as well as the year that lists it.
- **2021** is a virtual camp: no gallery (`gallery.html` does not exist, `/summer_camps/2021/gallery` is 404, and the index hides the block), and lectures and papers are ZIP bundles, not PDFs.
- **2023** is also virtual: no gallery, no repo files, and every link goes to Drive. Projects link to a brief, papers to a folder (report, brief, slides). One lecture title carries a guest marker, "Tin Sinh học (Khách mời)".
- **Organizing team pages** (not carried over): 2019 and 2021 have `organizing_team.html` but their index does not link it. The 2019 page's front matter says `year: 2018`, so it renders the 2018 banner. Its team lists are identical to 2018, and so are 2021's. The 2023 page lists only `theanh` and `nghia`.
- **Topics**: projects are applied modelling in 2016-2017 and ML/DS/bioinformatics algorithms from 2018 on. Lecture titles recur across years with different files: "Xác suất Thống kê" (2016, 2017, 2021, 2023), "Đại số tuyến tính" (2017, 2018, 2021, 2023), "Tối ưu hóa" (2017, 2018, 2019), "Đồ thị" and "Giới thiệu về toán mô hình" (2016, 2017). The "Support Vector Machine" and "Principal Component Analysis" projects recur in 2018 and 2021. A title does not identify a lecture or project; the file does.

## Problems to handle in the move

- **HTML in titles**: in 2019, the 4 reused lectures "… <br> (2018)" and the project "Conjugate <br> Gradient Descent"; in 2023, the project and the paper "Bulk RNASeq <br/> Quantification". `title_plain` strips these.
- **Zero-width spaces (U+200B)**: 2016 paper titles "​Phân tuyến học sinh vào lớp 6" (first paper) and "​Hệ thống tàu điện ngầm ở TP. HCM" (fifth paper); 2016 author names "Dương Anh Kiệt​" and "Trần Minh Nguyên​"; the `aff` of `tai` and `tuananh`. The two 2016 papers with the same visible title therefore differ as strings.
- **Double spaces** in 3 school names in 2018 ("Trường THPT Chuyên Amsterdam,  Hà Nội" ×2, "Trường THPT Chuyên Quốc Học,  Huế").
- **Missing file**: the 2017 lecture "Tối ưu hóa" (`nhat`) has no `href`, so its disabled button points to the site root. 2018 has a lecture "Tối ưu hóa" by the same author with a file; whether it is the same material is unknown.
- **Unresolved author**: `hoang` in 2017 (see above).
- **Titles repeated within a year**: several groups worked on the same project, so paper titles repeat: 2016 "Phân tuyến học sinh vào lớp 6" ×2 and "Hệ thống tàu điện ngầm ở TP. HCM" ×3; 2017 "Đánh giá thiết bị y sinh" ×3; 2018 "Support Vector Machine" ×2 and "Neural Network" ×3; 2019 "Sentimental Analysis" ×2. Papers need a key other than the title (the file, or an index within the year).
- **Paper title ≠ project title**: 2018 paper "Naive-Bayes" vs project "Naive Bayes"; 2019 paper "Object Detection" vs project "Object Recognition"; 2019 papers "Mạng tích chập và mô hình UNET trong bài toán phân mảng hình ảnh" and "Ứng dụng mạng CNN và kiến trúc UNET trong việc phân tách nền và xe" belong to "Image Segmentation" (file names `1imseg`, `6imseg`); 2017 papers "Phân tuyến xe buýt ở TP. HCM" and "Khảo sát ô nhiễm môi trường nước" presumably belong to "Số lượng xe buýt ở TP. HCM" and "Nước thải ô nhiễm trên sông" (inferred from the topic only). Some projects have no paper: 2016 "Bố trí xe cứu thương" and "Sắp xếp lịch chiếu phim", 2019 "Image Classification". A paper-to-project link would have to be entered by hand.
- **Typos kept verbatim in the dump**: 2023 "mục đíhc", "cá thế dựa dữ liệu"; 2019 CGD "phức tạp của hơn của"; 2019 Object Recognition description begins "Image Recognition là…"; 2021 GLM "mô hỉnh"; 2021 SVM "tìm hiểu hiểu"; 2018 Naive Bayes "PIMA"; 2017 gallery "Vietname Journal of Science"; 2019 gallery section "2. Những buổi học đầu tiên phụ trách" (cut off). Whether to correct them is an editorial decision.
- **School names** vary in format by year. 2016-2019 write "Trường THPT Chuyên …, tỉnh/TP …". 2021 and 2023 drop "Trường" and abbreviate ("Phổ Thông Năng Khiếu, ĐHQG-HCM", "… TPHCM"). Some 2021 entries carry a class prefix ("24 Gettysburg College, Mỹ", "20CNTN - Đại học Khoa học Tự nhiên, ĐHQG-HCM"). Some campers were already university students.
- **English page chrome**: banners, page titles, gallery section names in 2016, and the "Learn More" / "Link" labels are English. The new archive page uses Vietnamese headings (map #83), so none of this text carries over; only titles and descriptions of lectures and projects stay as in the source.
- **Old-site URLs**: every repo file link in the rendered pages resolves to `https://pimavn.github.io`. Every repo file needs a new home before the old site goes offline. The 12 Drive links in 2023 can be reused.
