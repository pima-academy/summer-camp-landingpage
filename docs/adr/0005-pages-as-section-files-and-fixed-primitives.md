# Pages are ordered lists of section files; primitives are a fixed set

The rebuild extracted a component only when two pages used it, so one-off sections stayed inline and pages grew to 300–500 lines. Under ADR 0004 each file also carries the CSS of the markup it owns, which would roughly double that. An agent asked to change one section would have to find it inside a long page and work out which part of the page's `<style>` belongs to it. So every section becomes its own file holding its markup, text and CSS, a page only lists its sections in order, and a small fixed set of primitives covers the patterns that repeat across sections and carry brand rules.

## Decision

- **Every section is a file**, including sections only one page uses. A page file holds the layout, its SEO data and the ordered list of its sections, and nothing else.
- **Folders** follow one question, "is it a full-width band of a page?":
  - `src/components/`: primitives and widgets (`Section`, `Button`, `Kicker`, `BrandName`, `Icon`, `Accordion`, `Slider`, `ContactForm`, `Marquee`, `ContentGap`…).
  - `src/sections/`: sections used by two or more pages, with their `.ts` data files next to them.
  - `src/sections/<route-slug>/`: sections used by one page, in a folder named after the page's route (`ve-chung-toi`, `khoa-hoc`; the home page uses `home`). When a second page needs one, it moves up to `src/sections/`.
  - `src/layouts/`: `BaseLayout`, `Head`, `Nav` and `Footer`.
  - `src/camp/`: the two camp pages' frozen code (`CampLayout`, `CampFooter`, `VideoLightbox`, their other camp-only components and a copy of the old stylesheets; see ADR 0004, **Exception: camp pages**). Nothing else imports it, and it is not split into section files.
- **Section files** are named in English PascalCase after their content (`Hero.astro`, `Press.astro`, `FoundingStory.astro`).
- **Primitives are a fixed set**:
  - `Section`: replaces the `padding-global > container > padding-section` wrapper that the old markup repeats 47 times. It renders `<section data-section="<name>">`, where `name` is the file name in kebab case (`founding-story`), and takes `width` (`small` | `medium` | `large`), `spacing` (`none` | `small` | `medium` | `large`; `none` for a section whose content sets its own vertical padding), `animate` and `id`. A section's background is set in its own CSS through tokens during the refactor. Brand alignment showed a small fixed set of section backgrounds, so the brand colour PR adds `tone` (`white` | `surface` | `pale-lime` | `dark-green`, default `white`), which sets the background and the text colours that pass WCAG AA on it; sections then drop their own background rules. A card inside a section takes a tone the same way, with the `data-tone` attribute (the founder card on Dark Green).
  - `Button`: `href` and `variant`. The refactor kept the old looks (default, lime, dark green, black, link with icon); brand alignment renamed them by role: `primary` (default), `secondary`, `on-dark`, `link`.
  - `Kicker`: the small uppercase line above a heading, under a short PiMA Green rule; every tagline or breadcrumb above a heading is one. It renders `<p>`, not `<h5>`, so the page's heading outline stays correct. `flush` drops its margins when the parent sets the spacing.
  - `BrandName`: unchanged.
  - `Icon` (added by the icons decision of brand alignment): `name`, `size` (`text` for 1em, or a box of 16, 24, 32, 40 or 48 px), `circle`. Draws one Tabler icon from `src/assets/icons/` in `currentColor`, optionally inside a brand circle; it is the only way to draw an icon.

  A new primitive needs a pattern that repeats in two or more places **and** carries a brand rule (spacing, radius, colour). There is no `Heading`, `Card` or image-wrapper primitive. Headings are plain `h1`–`h6` styled by the base CSS; when a heading must look like another level, its section's CSS sets `font-size: var(--font-size-h3)`. Images use Astro's `Image`.
- **Page text stays inline**, now in the section file next to its markup, which is where an agent or a non-developer looks first. Repeated lists (partners, testimonials, mentors) stay typed arrays in a `.ts` file next to the section, with imported images. There is no Markdown, JSON or content collection for page text.
- **Discoverability**: each file starts with a comment saying what it is and which pages use it. The repo's `CLAUDE.md` gets a short "Building UI" section: the primitives, where files go, tokens from `tokens.css`. A dev-only catalogue page, built like the gap pages, renders every primitive in every variant. A test fails when a primitive is missing from it.
- **Tests** find sections by `data-section`, not by class. Per-page tests that check which sections are present and in what order stay, because they enforce the definition of brand alignment (same sections, same order). Behaviour tests stay (nav, slider, contact form, lightbox, content gaps, current link, animations). Assertions on Webflow markup (`w-slider`, `testimonial7_slide`…) become assertions on behaviour or on ARIA/data state. Tests that compare against `site/` switch to fixed expected values. A test checks that each section's `name` matches its file name.

## Migration

This extends step 2 of ADR 0004's migration. After the tokens PR, the next PR adds `Section`, `Button`, `Kicker` and the catalogue page, used by no page yet. From then on, each page is one PR: split into section files, move its CSS to scoped styles, remove its Webflow classes, fix its tests. Shared sections move to `src/sections/` in the PR of the first page that touches them.

## Considered Options

- **Keep "extract only when two pages use it"**: rejected. Pages stay long, and with scoped CSS each page's `<style>` mixes the rules of all its one-off sections.
- **Split pages into section files first, change the CSS later**: rejected. It doubles the number of PRs and the screenshot checks for each page, for little reduction in risk.
- **A larger primitive set (`Heading`, `Card`, image wrapper)**: rejected. Element styles and tokens already cover headings, the cards differ from place to place, and each extra primitive is one more interface to learn.
- **A Markdown index of components**: rejected. It drifts from the code; header comments and the catalogue page cannot.
- **Page text in Markdown/JSON**: rejected again (see ADR 0003). With one file per section, inline text is already next to its markup.
