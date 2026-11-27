# Blog posts are Markdown files in the repo, published by pull request

The blog replaces the old site's empty "Sự kiện & Blog" page and takes in the 19 posts of the Jekyll site (2017-2019). Posts carry mathematical formulas, and adding one must take no more than uploading a Markdown file. So a post is Markdown in this repo, rendered at build time, and published through a pull request on GitHub; there is no CMS.

## Decision

- **One folder per post**: `src/content/blog/<slug>/index.md` with its images next to it (a post without images may be a single `<slug>.md`). The slug is the URL: `/blog/<slug>/`, no date in it. Images stay in the repo, resized by Astro, as the camp archive photos do (ADR 0006).
- **Front matter** is checked by a content collection schema: `title` and `date` required; `author`, `cover`, `description`, `draft` optional. A wrong field fails the build.
- **Math** is `$…$` inline and `$$…$$` display, rendered to HTML at build time with KaTeX (remark-math, rehype-katex). No script runs in the browser, and a formula KaTeX cannot parse fails the build.
- **Images** use Markdown syntax; the title becomes the caption (`![alt](./a.jpg "Caption")`) and a click opens the Lightbox, the post's images forming one set.
- **Publishing**: the author uploads the folder on GitHub ("Add file → Upload files") into a new branch and opens a pull request. CI builds it, and a merge publishes it. Before the switch-over posts go to `dev` like code; after it they go straight to `main`, so a post never waits for a release, and `main` is merged back into `dev` after each release.
- **Migration**: the Jekyll site's posts keep their text; only syntax changes (HTML images to Markdown with captions, kramdown's inline `$$` to `$`, `feature-img` to `cover`, the embedded Jupyter notebook converted once to Markdown). No redirects from the Jekyll site or from `/su-kien-blog/`.
- **A post's downloadable source file** (the Jupyter post's `.ipynb`, 88 KB) goes in `public/blog/<slug>/` and is linked from the post, so it is served at `/blog/<slug>/<file>` next to the page. This is an exception to ADR 0006, where documents live on the shared drive: a file that is the post's own source belongs with the post, is small, and is reviewed in the same pull request. Larger documents (slides, datasets) still go on the drive.

## Considered Options

- **A git-backed CMS (Decap, Pages CMS)**: a form instead of a file, but one more login and config to keep alive, for authors who already use GitHub.
- **Keep the Jekyll site for the blog**: two sites, two looks, and a repo that is going offline.
- **MathJax or KaTeX in the browser**: what the Jekyll site did; a script on every post, formulas that jump in after load, and errors nobody sees until a reader does.
- **Images on the shared drive**: Drive does not serve images reliably for embedding (ADR 0006).
- **Posts through `dev` after the switch-over**: one flow for everything, but a post would wait for the next release.
