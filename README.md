# pimavn.com

The PiMA Academy website, rebuilt on [Astro](https://astro.build) from the old Webflow export ([spec #15](https://github.com/pima-academy/summer-camp-landingpage/issues/15)), then restructured into section files with scoped CSS and brought in line with PiMA's brand guidelines ([spec #56](https://github.com/pima-academy/summer-camp-landingpage/issues/56)). No Webflow CSS or class names remain. Decisions are recorded in `docs/adr/`; terms are defined in `GLOSSARY.md`; the brand guidelines for the web are in `docs/brand.md`; how to build UI is in `CLAUDE.md` ("Building UI").

**`site/` is the old site** (the Webflow export). pimavn.com still serves it through GitHub Pages (`.github/workflows/pages.yml`) until the switch-over, a separate effort that deploys the rebuild and then deletes `site/`. Until then, treat `site/` as read-only: an archive, no longer the reference for the look (`docs/brand.md` is).

## Requirements

Node 24 (`.nvmrc`) and npm.

## Commands

```bash
npm ci              # install exactly what package-lock.json pins
npm run dev         # dev server; also serves the content gap pages, framed with "CONTENT GAP" labels
npm run build       # production build into dist/
npm run preview     # serve dist/ locally
npm test            # unit, build and browser checks (scripts/*.test.mjs); some need a fresh build and skip without one
npm run shots       # screenshot origin/dev (base) and the working tree (head) at 390/820/1440, diff them into shots/
```

`npm run shots` builds the base ref in a temporary git worktree and the working tree, then writes `shots/<page>-<width>-base.png`, `-head.png` and `-diff.png` and prints the share of differing pixels per page and width. `--base <ref>` compares against another ref; `npm run shots -- index lien-he` shoots only the pages named; `--no-build` reuses the working tree's `dist/` (the base is always built). Playwright's Chromium is needed once (for `npm test` too): `npx playwright install chromium`.

CI (`.github/workflows/build.yml`, on PRs into `dev`) runs `npm ci`, `npm run build` and `npm test`. With `CI` set, a test that needs the build fails instead of skipping.

## Layout

```
src/
  pages/            routes: each page file is BaseLayout + SEO data + its ordered sections;
                    404.astro, [...gap].astro (gap pages) and catalogue/ (every primitive), both dev only
  sections/         sections used by 2+ pages, with their .ts data files
  sections/<slug>/  sections used by one page (home for /)
  components/       primitives (Section, Button, Kicker, BrandName, Icon, PageTitle) and widgets
                    (Slider, Lightbox, CampYearNav, ContactForm, ContentGap)
  layouts/          BaseLayout, Head, Nav, Footer
  lib/              page and build helpers: current link, slider steps, image widths, gap pages,
                    the blog's Markdown plugins (formulas, figures)
  gap-pages/        pages whose content does not exist yet (served in dev only)
  data/site.ts      site-wide facts: contact details, social links, nav and footer links, form endpoint
  assets/images/    every image used in markup (rendered with astro:assets as WebP)
  assets/icons/     the Tabler SVGs drawn by Icon
  assets/logo/      the ten brand logo files (see docs/brand.md)
  styles/           global CSS: fonts.css, tokens.css (every design value), base.css
public/             favicons and apple-touch-icon (from scripts/make-icons.mjs), robots.txt
apps-script/        Code.gs, the contact form backend (Google Apps Script)
scripts/            tests, the screenshot script, make-icons.mjs, the one-off image migration scripts
site/               the old site, kept until the switch-over
```

## Content gaps

A section, link or page that is empty only because its content does not exist yet is wrapped in `<ContentGap>`: hidden in the production build, framed in `npm run dev`. `grep -r "<ContentGap" src` lists them; [issue #42](https://github.com/pima-academy/summer-camp-landingpage/issues/42) tracks them. Whoever adds the content removes the wrapper in the same commit.

## Contact form

The form posts to a Google Apps Script web app (`apps-script/Code.gs`) that appends a row to a Sheet. The endpoint is `contactFormEndpoint` in `src/data/site.ts`; it stays empty until the script is deployed ([issue #30](https://github.com/pima-academy/summer-camp-landingpage/issues/30)). Test the form only against a mocked endpoint (`scripts/contact-form.test.mjs`), never the real one.
