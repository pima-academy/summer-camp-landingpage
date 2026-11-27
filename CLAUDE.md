# PiMA Summer Camp Landing Page

## Language

- All repo documentation (this file, `docs/`, ADRs, `GLOSSARY.md`, GitHub issues and PR bodies) is written in English.
- Website content in `site/` stays in Vietnamese. Don't translate it.

## Building UI

- Before any UI work (a new section or component, or a style change), read `docs/brand.md`.
- Every design value (colour, font family, weight, size, line height, letter spacing, radius, shadow, spacing) comes from `src/styles/tokens.css` as `var(--…)`; `scripts/guardrail.test.mjs` fails on a literal anywhere else. Margins, paddings, gaps and offsets take a step of the spacing scale (`--space-1` … `--space-32`, the number is 4 px units); `0`, `auto` and percentages are not spacing.
- Type: `h1`–`h5` take their brand role from `src/styles/base.css`; a section sets no heading size or weight of its own unless the heading is not a heading to the eye (a date, a big number). One radius, `--radius`, photos and avatars included (`--radius-circle` only for icon circles and dots); a logo's `img` takes `data-logo` and stays square.
- Colour: component CSS uses role tokens (`--color-text`, `--color-text-heading`, `--color-text-accent`, `--color-text-muted`, `--color-link`, …), never palette tokens (the guardrail fails on one) or a background of its own for a section or card (`scripts/sections.test.mjs` checks). A section's background comes from `Section`'s `tone`, which re-points the text roles on the dark-green tone. `scripts/contrast.test.mjs` runs axe-core's `color-contrast` (WCAG AA) over every aligned page at 390 and 1440 px and checks 3:1 for every icon that is a control's only label; it allows no failure.
- Primitives (`src/components/`): `Section` (the frame of every section: `name`, `width` `small`/`medium`/`large`, `spacing` `none`/`small`/`medium`/`large`, `tone` `white`/`surface`/`pale-lime`/`dark-green`, `animate`, `id`; a card inside a section takes a tone with `data-tone`), `Button` (`href`, `variant`: `primary`, `secondary`, `on-dark`, `link`), `Kicker` (the uppercase line under a short PiMA Green rule above a heading, a `<p>`; every tagline or breadcrumb above a heading is one; `flush` drops its margins), `BrandName` ("PiMA" inside uppercased text), `Icon` (`name`, `size` `text`/`16`/`24`/`32`/`40`/`48`, `circle`: one Tabler SVG from `src/assets/icons/` in `currentColor`, contact and social icons in a brand circle; the only way to draw an icon, `scripts/icons.test.mjs` checks). See them all at `/catalogue/` in `npm run dev` (dev only, `src/pages/catalogue/[...path].astro`). A new primitive needs a pattern repeated in 2+ places **and** carrying a brand rule; mark it with a `Primitive:` header comment and add it to the catalogue (`scripts/catalogue.test.mjs` checks).
- Where files go (ADR 0005): a page file in `src/pages/` is `BaseLayout` + SEO data + its ordered sections. A section used by one page lives in `src/sections/<route-slug>/` (`home` for `/`), one used by 2+ pages in `src/sections/`, both with their `.ts` data files next to them. Primitives and widgets in `src/components/`; `BaseLayout`, `Nav`, `Footer` in `src/layouts/`.
- Every section file is English PascalCase (`FoundingStory.astro`) and renders through `<Section name="founding-story">`, the file name in kebab case (`scripts/sections.test.mjs` checks). Tests find sections by `data-section`.
- Styles live in the `<style>` of the file that owns the markup; no utility classes. Every file starts with a comment saying what it is and which pages use it (`scripts/header-comments.test.mjs` checks sections, components and layouts).

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `pima-academy/summer-camp-landingpage`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five default triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
