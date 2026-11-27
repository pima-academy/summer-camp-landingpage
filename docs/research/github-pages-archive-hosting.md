# What GitHub Pages allows for the camp archive files and redirects

Research for [#86](https://github.com/pima-academy/summer-camp-landingpage/issues/86), part of map [#83](https://github.com/pima-academy/summer-camp-landingpage/issues/83). Sources read 2026-11-27. Each fact cites the page it comes from; "observed" marks a fact checked with `curl` or the GitHub API on that date rather than read in docs.

## Inputs

- Old site repo `pimavn/pimavn.github.io` at `HEAD` (GitHub API tree, observed): 77 `.pdf` files totalling 83 MB, 798 `.jpg`/`.png` files totalling 244 MB; GitHub reports the repo at 379 MB with history. The ticket's estimate (~90 PDFs, ~168 MB) may count PDFs held elsewhere; the inventory tickets settle the real list.
- 2025/2026 Drive folders: PDFs up to ~16 MB each, notebooks up to ~2 MB.
- This repo (`dev`): ~32 MB tracked. Pages is set to `build_type: workflow` with custom domain `pimavn.com` (GitHub API, observed). The deploy uses `actions/checkout@v4` (defaults), `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`.

## 1. GitHub Pages and repository limits

Source: [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [About large files on GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).

| Limit | Value | Kind |
|---|---|---|
| Published site size | "may be no larger than 1 GB" | hard |
| Source repo size | "recommended limit of 1 GB" (Pages); repos "ideally less than 1 GB, and less than 5 GB is strongly recommended" (general) | guidance |
| File size in git | warning above 50 MiB, "GitHub blocks files larger than 100 MiB"; browser upload max 25 MiB | hard |
| Deployment time | "will timeout if they take longer than 10 minutes" | hard |
| Bandwidth | "soft bandwidth limit of 100 GB per month" | soft |
| Builds | soft limit of 10 builds per hour, which "does not apply if you build and publish your site with a custom GitHub Actions workflow" (our case) | soft |
| Rate limiting | "rate limits may apply", answered with HTTP 429 | soft |
| Use | "not intended for or allowed to be used as a free web-hosting service" | terms |

Against our numbers: 83-168 MB of PDFs + 244 MB of gallery images + ~32 MB of site ≈ 360-450 MB, plus the 2025/2026 files. That fits under 1 GB, but uses roughly half of it, and every later camp year adds to the same budget. No single file comes near 50 MiB.

Pages artifact ([actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact)): one gzip'd tar named `github-pages`, "under 10GB in size (we recommend under 1 GB!)", no symbolic or hard links. The officially supported maximum is 1 GB; above 10 GB Pages will not attempt the deploy.

Astro ([Images guide](https://docs.astro.build/en/guides/images/)): files in `public/` "are always served or copied into the build folder as-is, with no processing", so PDFs placed there land in the artifact at full size. Images in `src/` are transformed and optimized, which shrinks the gallery but "may increase the build time of your project, especially if you have a large number of images"; the image cache can be kept between builds.

## 2. `actions/checkout` and a large repo

Source: [actions/checkout README](https://github.com/actions/checkout).

- `fetch-depth` defaults to 1: "Only a single commit is fetched by default". A large history therefore does not slow the deploy checkout; only the files in the current tree are downloaded. Every developer clone (`git clone` without `--depth`) still downloads the full history, and a file committed once stays in history after it is deleted.
- `lfs` defaults to `false`. With LFS-tracked files and the current workflow, the build sees only pointer files.
- `sparse-checkout` and `filter` exist to narrow what a job fetches, if a job ever needs to skip the archive files.

## 3. Git LFS and Pages

Sources: [About Git Large File Storage](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage), [Git LFS billing](https://docs.github.com/en/billing/concepts/product-billing/git-lfs).

- GitHub states: "Git LFS cannot be used with GitHub Pages sites." Pages does not resolve LFS pointers; a branch-published site would serve the pointer text.
- With our Actions deploy, `actions/checkout` with `lfs: true` would download the real files into the runner, and they would then go into the Pages artifact as ordinary files. This works mechanically but contradicts the documented statement above, and the files still count toward the 1 GB site limit, so LFS saves repo size but not site size.
- Free quota (GitHub Free, personal or organisation): 10 GiB storage and 10 GiB bandwidth per month. Bandwidth counts every LFS download, including GitHub Actions ("If GitHub Actions downloads a 500 MB file that is tracked with Git LFS", it uses the owner's bandwidth) and source archives. At ~400 MB per deploy, about 25 deploys a month would use the free bandwidth. Without a payment method, "Git LFS support is disabled on your account until the next month"; with a $0 budget, LFS "is blocked for the rest of the calendar month".
- LFS per-file max: 2 GB on Free.

## 4. Redirecting the retired URLs

URLs: `/trai-he-toan-hoc-2025/`, `/trai-he-pima-2026/`, `/chi-tiet-trai-he/` to `/trai-he-toan-hoc-pima/<year>/`.

### What GitHub Pages offers

GitHub Pages documents no redirect configuration (no `_redirects`, no `.htaccess`, no status-code control). It serves files, a custom `404.html` ([custom 404 page](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)), and nothing else. An HTTP 301 is not possible on this host; the redirect has to be an HTML page.

### Astro `redirects` config

Source: [Astro routing, Redirects](https://docs.astro.build/en/guides/routing/#redirects), template source [`packages/astro/src/core/routing/3xx.ts`](https://github.com/withastro/astro/blob/main/packages/astro/src/core/routing/3xx.ts).

- For a static build without an adapter, "Astro will output HTML files with the meta refresh tag by default." The status code (301 default) "is not used by the server" in this case.
- The generated page contains `<meta http-equiv="refresh" content="0;url=…">` (delay 0, or 2 seconds when the status is 302), `<meta name="robots" content="noindex">`, `<link rel="canonical" href="<absolute destination>">`, and a fallback link in the body. So the Astro redirect already combines meta refresh, canonical and noindex; no hand-written page is needed.
- A configured redirect takes "lower precedence than an existing page file of the same name", so the camp page files must be deleted for the redirect to apply.
- `@astrojs/sitemap` lists only routes of type `page`: "Only expose pages, not endpoints or redirects" ([sitemap source](https://github.com/withastro/astro/blob/main/packages/integrations/sitemap/src/index.ts)). Redirect URLs drop out of `sitemap-*.xml` with no `filter` needed.
- Static targets only: the three source URLs are fixed paths, each mapped to a fixed year, so `redirects: { "/trai-he-toan-hoc-2025": "/trai-he-toan-hoc-pima/2025/", … }` covers them.

### What each method does for search engines

Sources: [Google: Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [Google: Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google: Site moves with URL changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

| Method | Google's reading |
|---|---|
| Server-side 301/308 | Recommended "whenever possible"; means the page "has permanently moved". Not available on GitHub Pages. |
| Instant meta refresh (delay 0) | "Google Search interprets instant `meta refresh` redirects as permanent redirects." "`meta refresh` redirects may be a viable alternative" when server-side redirects are not possible. This is what Astro emits for the default status. |
| Delayed meta refresh | Interpreted "as temporary redirects". Astro uses this only for status 302. |
| JavaScript redirect | "Only use JavaScript redirects if you can't do server-side or `meta refresh` redirects"; Google "might never see it if rendering of the content failed." |
| `rel="canonical"` alone | "A strong signal", but meant for duplicate pages that are still served; the visitor stays on the old page. A redirect is also "A strong signal that the target of the redirect should become canonical". |

Google's site-move guidance: keep redirects "for as long as possible, generally at least 1 year", update sitemaps and internal links to the new URLs, and "Avoid chaining redirects" (point each old URL at its final destination).

## 5. Hosting files outside the repo

### GitHub Releases assets

Source: [About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases), [About large files](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).

- "Up to 1000 release assets may be associated with a single release." "Each file included in a release must be under 2 GiB." "There is no limit on the total size of a release, nor bandwidth usage." Release assets do not count toward the Pages 1 GB.
- Link form `https://github.com/<owner>/<repo>/releases/download/<tag>/<file>` stays stable while the tag and asset exist; it breaks if the release, tag or repo is renamed or deleted.
- Inline viewing (observed with `curl` on a public release asset): GitHub answers with a 302 to `release-assets.githubusercontent.com`, which returns `content-type: application/octet-stream` and `content-disposition: attachment`. Browsers download the file; a PDF does not open in a tab.

### Repo files served by Pages

- Observed on `pimavn.github.io`: a PDF returns `content-type: application/pdf`, no `content-disposition`, `cache-control: max-age=600`. Browsers open it inline.
- GitHub's repo file view also renders PDFs ("links within PDFs are ignored") and notebooks as static HTML ([Working with non-code files](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files)), but the site must not link to github.com views for visitors.

### Google Drive

Sources: [Share files from Google Drive](https://support.google.com/drive/answer/2494822), [Make someone else the owner](https://support.google.com/drive/answer/2494892), [Delete your Google Account](https://support.google.com/accounts/answer/32046), [Inactive Google Account policy](https://support.google.com/accounts/answer/12418290), [Shared drives (users)](https://support.google.com/a/users/answer/7212025), [Business Starter gets shared drives](https://workspaceupdates.googleblog.com/2024/08/shared-drive-access-business-starter.html), [Link-sharing security update](https://support.google.com/a/answer/10685032).

What a link needs to stay openable by anyone:

1. General access set to **Anyone with the link**: "Anyone on the internet who has the link can open the file without signing in to a Google Account." Role Viewer is enough. A work or school account's admin may block external link sharing.
2. The owner account must keep existing. Deleting a Google Account loses "all the data and content in that account, like emails, files…". A personal account unused for two years may be deleted with "all of its content and data". A file in My Drive belongs to its owner, not to the folder it sits in.
3. Ownership cannot move out of a personal Gmail account to an organisation: "You can't transfer a file from your personal Google account to someone with a work or school account." Personal-to-personal transfer needs the recipient to accept. Transferring a folder does not transfer the files inside ("you still own the files inside"). Moving files into an organisation's storage therefore means copying them, which gives them new file IDs and new links.
4. Shared drives fix the owner problem: "Your organization owns the files in a shared drive, not an individual," and files a departed member added "remain". Shared drives require Google Workspace; Business Starter has them since 2024-09-23 (with reduced admin controls); Education editions have shared-drive creation off by default. Consumer Gmail accounts cannot create one.
5. Old link-shared files may carry a resource key (`resourcekey=` in the URL) since the 2021 link-sharing security update; a link copied without it may not open for people who have not opened the file before. Reuse links from the old site exactly as written.

Inline viewing: the Drive file link (`/file/d/<id>/view`) opens Drive's viewer in the browser, with no sign-in under "Anyone with the link". The owner can remove download/print/copy for viewers in Share > Settings.

### Other free storage

- Cloudflare Pages ([limits](https://developers.cloudflare.com/pages/platform/limits/)): up to 20,000 files on Free, max 25 MiB per file. Would mean moving the whole site off GitHub Pages; out of scope for this map.
- Cloudflare R2 ([pricing](https://developers.cloudflare.com/r2/pricing/)): free tier 10 GB-month of storage, 1M Class A and 10M Class B operations per month, "no charges for egress bandwidth". Needs a Cloudflare account with billing, a bucket made public (custom domain or `r2.dev`), and someone to own uploads.

## 6. Showing a `.ipynb` with nothing installed

| Option | How | Notes |
|---|---|---|
| Render to HTML at build time | `jupyter nbconvert --to html notebook.ipynb` ([nbconvert usage](https://nbconvert.readthedocs.io/en/latest/usage.html)); templates `lab` (default, "very similar to the JupyterLab interactive view"), `classic`, `basic` | Static HTML on our own domain; no third party. Adds Python + nbconvert to the build, or a one-time conversion committed as HTML. Outputs only as saved in the notebook. |
| nbviewer | [nbviewer](https://github.com/jupyter/nbviewer): "Render Jupyter Notebooks as static web pages"; providers url, gist, github, huggingface, local; nbviewer.org is hosted by OVHcloud with Fastly CDN | Needs the notebook at a public URL. Third-party, volunteer-run service; nbviewer.org answered our fetch with HTTP 429, so availability is not guaranteed. |
| Colab | Public GitHub notebooks open at `https://colab.research.google.com/github/<owner>/<repo>/blob/<branch>/<path>.ipynb` "with no required authorization step" ([Colab GitHub demo](https://github.com/googlecolab/colabtools/blob/main/notebooks/colab-github-demo.ipynb)); Colab notebooks "are stored in Google Drive, or can be loaded from GitHub" ([Colab FAQ](https://research.google.com/colaboratory/faq.html)) | Interactive, but running cells needs a Google sign-in (not stated in the docs read; to test). Opening a Drive-hosted `.ipynb` via Colab depends on the Drive sharing rules above. |
| Pages raw file | Link to the `.ipynb` | Browser shows or downloads JSON; not a view. |

## Trade-offs for the file hosting decision

| Option | Size limits | Link stability | Inline viewing | Maintenance owner | Cost |
|---|---|---|---|---|---|
| **Repo (`public/` or `src/`)** | 1 GB site, 100 MiB per file, repo ideally < 1 GB. ~360-450 MB today, grows each year. | Same domain, as stable as our URLs. | PDF opens inline (`application/pdf`); images optimisable by Astro from `src/`. | This repo; every file change is a commit. History keeps deleted files. | Free. |
| **Git LFS** | 2 GB per file; 10 GiB storage, 10 GiB bandwidth/month free; still inside the 1 GB site. | Same domain once deployed. | Same as repo after `lfs: true` checkout. | This repo, plus quota watching. | Free until quota; each deploy downloads all LFS files and counts toward bandwidth; LFS blocked for the month when exceeded. Documented as not usable with Pages. |
| **GitHub Releases** | 2 GiB per file, 1000 assets per release, no total or bandwidth limit. | Stable while tag and asset stay; tied to repo name. | No: served as `attachment` / `octet-stream`, always downloads. | This repo's maintainers; uploads outside git. | Free. |
| **Google Drive, current folders** | 15 GB per personal account (not read here); no per-file concern at our sizes. | Breaks when an owner deletes the file, the account, or the account goes inactive 2 years; files owned by personal Gmail cannot be transferred to an organisation. | Yes, Drive viewer, no sign-in with "Anyone with the link". | Each owning person. | Free. |
| **Google shared drive** | Workspace shared-drive limits (not read here). | Organisation owns files; survive members leaving. Copying files in creates new IDs, so links change once. | Yes, same viewer. | PiMA's Workspace admin. | Needs a Workspace edition with shared drives (Business Starter or above, or Education with creation enabled). |
| **Cloudflare R2** | 10 GB-month free, no egress fees. | Stable while the bucket and domain stay. | Depends on stored content type; not tested. | Whoever holds the Cloudflare account. | Free tier; account needs billing set up. |

Questions the decision weighs:

- Is ~450 MB (and rising) inside a 1 GB Pages site acceptable, or do the gallery and PDFs leave the repo? Optimising the gallery from `src/` lowers the published size, not the repo size.
- Are links to Drive acceptable for 2025/2026 files while they are owned by personal Gmail accounts, or does PiMA have (or create) a Workspace shared drive to copy them into first?
- Do visitors need PDFs to open in the tab? That rules out Releases.
- For notebooks: own-domain static HTML (build-time nbconvert) or a third-party viewer link (nbviewer, Colab)?
