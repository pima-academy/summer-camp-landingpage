# Camp archive documents live on a PiMA shared drive; photos live in the repo

The camp archive pages link about 190 documents (old-site PDFs and ZIPs, 2023-2026 Drive files, notebooks; ~340 MB) and show about 750 photos (~240 MB). They were scattered: the old site's repo (`pimavn.github.io`, going offline), Drive folders owned by personal accounts (all of 2024, a quarter of 2025, close to half of 2026), and a few `pimavn.com` accounts. Every document now lives in one Google shared drive, "Trại hè PiMA - Lưu trữ", which PiMA's Workspace owns whoever uploads, and the pages link its Drive viewer URLs. Photos are the exception: Drive does not serve images reliably for embedding, so the repo keeps resized copies and the drive keeps the originals.

## Decision

- **Documents** (PDF, slides, notebooks, folders) are files of the shared drive, never of this repo. A year's data file holds their Drive URLs (`/file/d/<id>/view`, `/drive/folders/<id>`).
- **Layout**: the drive's root holds one folder per year (`2016` … `2026`). Each year folder is shared "Anyone with the link: Viewer" once, so every file inside is public without sharing it file by file. Inside: `1. Đề tuyển sinh`, `2. Bài giảng`, `3. Bài tập`, `4. Dự án nhóm/<project>/` (report, slides, notebooks), and `5. Tài liệu đọc thêm`, `6. Hình ảnh` when the year has them. No empty folders.
- **Moving in**: files still owned by a personal account are copied into the drive, and their links change; the page links the copy. Old-site files are uploaded from the old repo. The 2021 ZIPs are unpacked into a folder each, linked with the label "Thư mục".
- **Notebooks** link to the `.ipynb` on the drive (Drive preview, "Open with Colab"). There is no build-time conversion.
- **Photos**: originals go in `<year>/6. Hình ảnh` on the drive. The repo keeps copies resized to at most 1600 px on the long side in `src/assets/camp-archive/<year>/<section>/`, and Astro generates the responsive sizes. Each old-site year banner becomes that year's `cover` photo, resized the same way.

## Considered Options

- **Everything in the repo (`public/`)**: one domain and stable links, but about 580 MB of a 1 GB Pages site, growing every year, and every file stays in git history forever.
- **Git LFS**: GitHub states it cannot be used with Pages, still counts toward the 1 GB, and every deploy uses the monthly LFS bandwidth.
- **GitHub Releases**: no size limit, but assets are served as attachments, so a PDF never opens in the tab.
- **A folder in an organisation account's My Drive**: in My Drive the uploader owns each file, and a personal account's file cannot be transferred to a Workspace account, so uploads from a personal account would recreate the problem. A shared drive owns its files whoever uploads them.
