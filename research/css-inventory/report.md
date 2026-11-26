# Live CSS inventory and its distance to the brand

Fact base for **Decide the CSS architecture** (#48), from **Inventory the live CSS and its distance to the brand** (#47). It decides nothing.

Measured on `dev` at `0b75017` (2026-11-26). Throwaway branch: not merged.

**Method.** `static.mjs` parses every stylesheet in `src/styles/` and every Astro `<style>` block with css-tree. `live.mjs` opens all 14 pages in `astro dev` (9 published + 5 dev-only gap pages) with Playwright, tests every selector against the DOM, and records computed styles of every visible element at 390, 600, 820 and 1440 px (one width per Webflow tier: ≤479, 480–767, 768–991, ≥992). `report.py` / `report_b.py` aggregate. Brand values come from `~/pima/1/tokens/tokens.css` and `~/pima/1/brand/04-color.md`, `05-typography.md`, `06-graphic-elements.md`. The **tests** and **icons and logos** sections were inventoried by reading the code.

Limits: "live" means a selector matches an element, not that every declaration wins the cascade. Hover/focus/open states are counted as live when the base element exists. Contrast uses ancestor background colours only (a sibling image or colour layer is invisible to it; the one such case found is marked).

## Summary

**Size and dead weight**
- 1,111 rules (908 in `pima-website.webflow.css`, 129 in `webflow.css`, 74 elsewhere). **1,021 live, 90 dead**: 51 in `webflow.css` (lightbox, `w--nav-*-open`, unused Webflow widgets), 35 in `pima-website.webflow.css`. The earlier prune left the big file ~96 % live by rule, so removing dead rules alone does not shrink it much.
- 3,394 declarations in live rules.

**Classes**
- 587 distinct classes on the 14 pages, 5,707 occurrences. **Utilities are 22 % of distinct classes but 42 % of occurrences** (130 classes, 2,410 uses: `margin-bottom` 227, `text-style-gray` 194, `spacer-small` 180, `margin-small` 104, `padding-global` 87…).
- 260 section-specific `block_element` classes (Client-First and Relume: `layout351_*`, `team3_*`, `header76_*`…), 89 hyphen-named components, **49 Webflow auto-names** (`div-block-12`, `text-block-6`, `image-15`, `heading-3`, `bold-text-4`), 17 numbered copies (`icon-embed-xxsmall-5`, `heading-style-h3-2`), 46 `w-*` runtime classes.
- **93 classes in markup style nothing** (72 of them section-specific wrappers such as `section_impact`, `header126_component`); some are test or script hooks.
- 40 classes in selectors never appear (mostly Webflow lightbox and nav-open classes).

**Grid placement by id**
- 95 `#w-node-…` rules target 174 ids; **171 are live**, written by 21 source files (`Footer`, `Milestone`, `ContactForm`, `MentorLogos`, `CampHeaderPhotos`, the camp pages…). Nearly all are `grid-area: span 1 / span N`, `justify-self`, `align-self` or `order`. Most could be expressed as a class or inline grid placement on the grid's own component.
- Webflow symbol instances use compound `#w-node-<instance>.w-node-<symbol>` selectors, so some elements carry `w-node` names as both id and class (2025/2026 camp cards).

**Custom properties**
- 354 declared (312 `--ai-gen-82921b10-…` with a 63-character prefix, 42 `--_color---…`). **137 in use, 211 never referenced.** No property is overridden per breakpoint: responsive sizes are separate variables (`h2-size`, `h2-size-tablet`, `h2-size-mobile-l`…) switched by media-query rules.
- Live colour variables are three ramps (gray 25–950, Relume green 25–900, pale-lime 25–300) plus Relume accents `#05aa53` and `#09ce65`, neither of which is a brand colour.

**Design values in use** (computed, deduplicated)
- Text colours: 13. Background colours: 17. Border colours: 7. Font family: Nunito Sans only.
- **Weights: 400, 700, 600, 300 (608 uses), 500 (492 uses), 800 (16 uses); no 900.** 300 is the whole footer text; 500 is the trust-bar marquee, `heading-style-h5` and two text blocks. Headings h1–h3 are **700** (brand: 800).
- 23 distinct font sizes over four widths (13–18 at each width), from Webflow rem scales (`4.21rem`, `2.37rem`, `1.33rem`…).
- Line heights 1.04 on h1/h2 (brand floor for uppercase Vietnamese: 1.1); 0.40 and 0.42 on two decorative numeral blocks.
- **Radius: `20px` on 1,459 element×width occurrences** (images, cards), plus 16, 12, 8, 4, 19, 99 and 1600 px pills and 100 % circles. Brand: one radius (2 mm ≈ 7.6 px in print) and a small one (1 mm).
- Spacing: 64 distinct values; 16, 8, 32, 10, 20, 12 px are the most common; 49 values (3,801 occurrences) are not multiples of 4 px.
- One shadow (a 1 px ring on camp-page cards). A 3 px magenta (`#e5007e`) outline on 180 occurrences: the dev-only content-gap markers (`ContentGap.astro`), not part of the design.

**Distance to the brand**
- Colours that are exactly brand: `#50b448`, `#d4e889`, black, white, `#d9dadb`/`#f0f1f1` (≈ gray-4/gray-5).
- Close but different: dark green `#2b5314` (brand `#275613`, ΔE 3.3), footer `#3b3b3b` (≈ gray-1 `#434343`), border `#cccccc`, text `#cecfd2`.
- Off-brand: body text `#262628` (1,591 uses; brand ink is `#000`, muted is `#434343`), grays `#85888e`, `#61646c`, `#333741`, `#333333`, `#222222`; greens `#05aa53`, `#09ce65`, `#326212`, `#4ca30d`, `#d0f8ab`; lime tints `#e6f2bc`, `#f2f8db`, `#d9eb99`, `#f7fbeb`, `#fafef5`.
- **WCAG AA: 11 text/background pairs fail** (692 of 3,903 text occurrences): PiMA Green text on white (192), on off-whites, on lime-50 and on the dark footer (200); white on PiMA Green buttons (28); `#05aa53` on white (60); gray `#85888e` in the nav dropdown and footer credit; `#e6f2bc` step numerals on white.
- Icons: 30 shipped, from six sources (BoxIcons, Heroicons, Iconoir, Relume, Webflow icon font, Streamline-style PNGs); 11 are PNGs with green baked in; filled and line styles mixed; social icons in platform colours on `lien-he`. Logos: green only; the horizontal PNG matches the brand artwork; the stacked logo is an off-ratio SVG with a stray frame and a low-res AVIF; favicon/webclip are symbol-only crops.

**Tests**
- Most tests read built `dist/`. **No test references `w-node` ids, `padding-global` or `container-*`.** A class rename breaks the `section_*` order checks (`home` 24 assertions, `camp-page` 16, `khoa-hoc`), Relume classes in `ve-chung-toi` (9) and `camp-year-pages`, the `lien-he` selectors, and the chrome nav slice. Webflow runtime classes (`w-nav-*`, `w-dropdown-*`, `w--open`, `w--current`, `w-form-done/fail`) carry all 9 `nav` tests and most `contact-form` tests, and the scripts in `Nav.astro` and `ContactForm.astro` query the same classes. `frame` requires one stylesheet bundle with `.w-inline-block` before `.footer3_`.

## CSS sources and rule liveness

A rule is **live** when at least one of its selectors matches an element on at least one of the 14 pages (9 published + 5 dev-only gap pages), after stripping pseudo-classes/elements and unwrapping `:global()`. Media queries are ignored for liveness (all are `max-width`, so each applies at some width).

| Source | Rules | Live | Dead | Declarations (live) |
|---|--:|--:|--:|--:|
| `src/styles/normalize.css` | 18 | 16 | 2 | 23 |
| `src/styles/webflow.css` | 129 | 78 | 51 | 283 |
| `src/styles/pima-website.webflow.css` | 908 | 873 | 35 | 2955 |
| `src/styles/animations.css` | 6 | 6 | 0 | 11 |
| `src/components/Accordion.astro` | 9 | 8 | 1 | 20 |
| `src/components/BrandName.astro` | 1 | 1 | 0 | 1 |
| `src/components/CampTeamPhoto.astro` | 2 | 2 | 0 | 2 |
| `src/components/ContactForm.astro` | 2 | 2 | 0 | 7 |
| `src/components/ContentGap.astro` | 4 | 4 | 0 | 24 |
| `src/components/Marquee.astro` | 6 | 6 | 0 | 12 |
| `src/components/MentorLogos.astro` | 3 | 3 | 0 | 3 |
| `src/components/Nav.astro` | 1 | 1 | 0 | 1 |
| `src/components/PageHeader.astro` | 1 | 1 | 0 | 1 |
| `src/components/TrustBar.astro` | 1 | 1 | 0 | 1 |
| `src/components/VideoLightbox.astro` | 12 | 11 | 1 | 37 |
| `src/pages/lien-he.astro` | 3 | 3 | 0 | 8 |
| `src/pages/ve-chung-toi.astro` | 5 | 5 | 0 | 5 |
| **Total** | 1111 | 1021 | 90 | 3394 |

Dead rules in `pima-website.webflow.css` (35), by selector kind: class 30, `#w-node` 3, `w-*` 2.

Breakpoints (media queries, rule counts): `screen and (max-width:767px)` 125, `screen and (max-width:991px)` 94, `screen and (max-width:479px)` 93, `(min-width:768px)` 11, `(prefers-reduced-motion:no-preference)` 6, `screen and (min-width:992px)` 3, `screen and (min-width:480px) and (max-width:991px)` 2, `(prefers-reduced-motion:reduce)` 1, `(min-width:480px)` 1, `(min-width:2086px)` 1, `screen and (min-width:480px) and (max-width:559px)` 1.

## Class usage

Classes found in the rendered DOM of the 14 pages (Playwright, after scripts ran), excluding `w-node-…` (next section). Kinds:
- **utility**: Client-First layout/text utilities (`padding-*`, `margin-*`, `spacer-*`, `container-*`, `max-width-*`, `text-style-*`, `text-size-*`, `heading-style-*`, `background-*`, `is-*` modifiers, `icon-embed-*`, `utility-*`…).
- **section-specific**: Client-First `block_element` names with an underscore (`section_impact`, `impact_*`, Relume `layout351_*`, `team3_*`, `header126_*`…).
- **named-component**: hyphen names that are neither utilities nor auto-named (`nav-link`, `course-listing-card`, `footer-social-link`…).
- **webflow-autonamed**: Webflow default names (`div-block-12`, `text-block-7`, `image-15`, `heading-3`, `bold-text-4`, `paragraph-5`…).
- **webflow-runtime**: `w-*` classes from `webflow.css` and Webflow's JS conventions.
- **rebuild-own**: defined only in Astro component `<style>` blocks or `animations.css`.
- **state/js**: set by scripts (`active`, `js-ready`) or by inlined icon SVG (`iconify*`).

| Kind | Distinct classes | Occurrences | Defined in CSS | Used but not defined |
|---|--:|--:|--:|--:|
| utility | 130 | 2410 | 130 | 0 |
| section-specific | 260 | 1386 | 188 | 72 |
| named-component | 89 | 727 | 77 | 12 |
| webflow-autonamed | 49 | 268 | 48 | 1 |
| webflow-runtime | 46 | 735 | 42 | 4 |
| rebuild-own | 8 | 101 | 8 | 0 |
| state/js | 5 | 80 | 1 | 4 |
| **Total** | 587 | 5707 | 494 | 93 |

### Per page

| Page | utility | section-specific | named-component | webflow-autonamed | webflow-runtime | rebuild-own | state/js | distinct total |
|---|--:|--:|--:|--:|--:|--:|--:|--:|
| `/` | 74 | 95 | 44 | 21 | 40 | 5 | 3 | 282 |
| `/ve-chung-toi/` | 68 | 103 | 46 | 14 | 35 | 5 | 4 | 275 |
| `/khoa-hoc/` | 44 | 24 | 34 | 8 | 27 | 5 | 2 | 144 |
| `/lien-he/` | 40 | 17 | 35 | 8 | 19 | 5 | 2 | 126 |
| `/trai-he-toan-hoc-pima/` | 60 | 67 | 37 | 15 | 31 | 5 | 3 | 218 |
| `/trai-he-toan-hoc-2025/` | 70 | 61 | 10 | 12 | 6 | 4 | 0 | 163 |
| `/trai-he-pima-2026/` | 70 | 61 | 10 | 11 | 6 | 4 | 0 | 162 |
| `/chi-tiet-trai-he/` | 44 | 43 | 26 | 6 | 25 | 1 | 2 | 147 |
| `/404.html` | 35 | 10 | 23 | 2 | 14 | 1 | 2 | 87 |
| `/detail-blog-event/` (gap) | 41 | 19 | 32 | 10 | 32 | 4 | 2 | 140 |
| `/detail-course/` (gap) | 54 | 37 | 44 | 9 | 36 | 4 | 2 | 186 |
| `/detail-teaching-staff-brief/` (gap) | 28 | 10 | 23 | 2 | 13 | 2 | 2 | 80 |
| `/detail-team/` (gap) | 28 | 10 | 23 | 2 | 13 | 2 | 2 | 80 |
| `/su-kien-blog/` (gap) | 46 | 22 | 25 | 7 | 22 | 2 | 2 | 126 |

### Per source file

Distinct classes (of those in the DOM) whose name appears in the file's markup or data, by kind. Static token match, so a class listed in a `.ts` data file counts there.

| File | utility | section-specific | named-component | webflow-autonamed | webflow-runtime | top section prefixes |
|---|--:|--:|--:|--:|--:|---|
| `src/components/Accordion.astro` | 3 | 5 | 0 | 0 | 0 | `layout351` |
| `src/components/AccordionPanel.astro` | 1 | 6 | 0 | 0 | 0 | `layout351` |
| `src/components/BrandName.astro` | 1 | 0 | 1 | 0 | 0 |  |
| `src/components/CampHeaderPhotos.astro` | 0 | 7 | 0 | 0 | 0 | `header76`, `section` |
| `src/components/CampMentors.astro` | 13 | 8 | 1 | 1 | 1 | `team11`, `section`, `team16`, `team1` |
| `src/components/CampTeamPhoto.astro` | 0 | 0 | 1 | 1 | 0 |  |
| `src/components/ContactForm.astro` | 1 | 0 | 5 | 5 | 5 |  |
| `src/components/ContactSection.astro` | 8 | 5 | 3 | 1 | 0 | `form`, `section`, `form7`, `footer` |
| `src/components/ContentGap.astro` | 0 | 0 | 1 | 1 | 0 |  |
| `src/components/Footer.astro` | 21 | 11 | 3 | 1 | 5 | `footer3`, `footer` |
| `src/components/Impact.astro` | 7 | 6 | 1 | 2 | 1 | `impact`, `section`, `impact-report` |
| `src/components/Marquee.astro` | 0 | 3 | 0 | 0 | 0 | `marquee`, `trust-bar` |
| `src/components/MentorLogos.astro` | 10 | 5 | 0 | 1 | 0 | `logo3`, `section` |
| `src/components/Milestone.astro` | 9 | 11 | 1 | 1 | 0 | `timeline20`, `section` |
| `src/components/Nav.astro` | 7 | 0 | 20 | 1 | 11 |  |
| `src/components/PageHeader.astro` | 10 | 2 | 1 | 1 | 0 | `header45`, `section` |
| `src/components/Partners.astro` | 13 | 1 | 2 | 1 | 0 | `section` |
| `src/components/Philosophy.astro` | 16 | 1 | 3 | 1 | 2 | `section` |
| `src/components/ProgramsOverview.astro` | 14 | 1 | 2 | 2 | 1 | `section` |
| `src/components/Slider.astro` | 8 | 5 | 3 | 0 | 12 | `gallery25`, `slider-arrow-icon` |
| `src/components/SummerCamp.astro` | 19 | 9 | 1 | 2 | 5 | `gallery22`, `section` |
| `src/components/Team.astro` | 22 | 14 | 3 | 5 | 9 | `gallery25`, `team5`, `section`, `expert` |
| `src/components/Testimonials.astro` | 10 | 8 | 0 | 1 | 0 | `testimonial18`, `section` |
| `src/components/TrustBar.astro` | 4 | 2 | 0 | 1 | 0 | `section`, `trust-bar` |
| `src/components/VideoLightbox.astro` | 1 | 6 | 0 | 0 | 2 | `layout11`, `video-lightbox`, `section` |
| `src/components/camp-header-photos.ts` | 0 | 3 | 0 | 0 | 0 | `header76`, `section` |
| `src/components/mentor-logos.ts` | 0 | 3 | 0 | 0 | 0 | `logo3`, `section` |
| `src/components/partners.ts` | 0 | 0 | 0 | 1 | 0 |  |
| `src/components/summer-camp-photos.ts` | 0 | 0 | 0 | 1 | 0 |  |
| `src/components/team-activities.ts` | 0 | 0 | 0 | 1 | 0 |  |
| `src/components/testimonials.ts` | 0 | 0 | 0 | 5 | 0 |  |
| `src/gap-pages/detail-blog-event.astro` | 13 | 5 | 2 | 5 | 15 | `blog5`, `section` |
| `src/gap-pages/detail-course.astro` | 24 | 22 | 14 | 4 | 12 | `team3`, `testimonial7`, `gallery1`, `layout243` |
| `src/gap-pages/detail-teaching-staff-brief.astro` | 0 | 0 | 2 | 0 | 0 |  |
| `src/gap-pages/detail-team.astro` | 0 | 0 | 2 | 0 | 0 |  |
| `src/gap-pages/su-kien-blog.astro` | 20 | 12 | 2 | 5 | 9 | `blog5`, `section`, `header45` |
| `src/layouts/BaseLayout.astro` | 0 | 0 | 1 | 0 | 0 |  |
| `src/pages/404.astro` | 8 | 0 | 0 | 0 | 1 |  |
| `src/pages/chi-tiet-trai-he.astro` | 16 | 24 | 2 | 0 | 3 | `section`, `gallery16`, `camp-detail`, `header7` |
| `src/pages/index.astro` | 37 | 25 | 4 | 6 | 13 | `testimonial7`, `section`, `card-row4`, `founding-story` |
| `src/pages/khoa-hoc.astro` | 13 | 4 | 4 | 1 | 10 | `section`, `header64`, `card-row4` |
| `src/pages/lien-he.astro` | 16 | 4 | 9 | 3 | 2 | `form`, `section`, `footer` |
| `src/pages/trai-he-pima-2026.astro` | 48 | 25 | 8 | 10 | 3 | `timeline20`, `layout11`, `section`, `header76` |
| `src/pages/trai-he-toan-hoc-2025.astro` | 48 | 25 | 8 | 11 | 3 | `timeline20`, `layout11`, `section`, `header76` |
| `src/pages/trai-he-toan-hoc-pima.astro` | 18 | 22 | 4 | 2 | 2 | `layout9`, `layout131`, `layout353`, `section` |
| `src/pages/ve-chung-toi.astro` | 30 | 43 | 8 | 4 | 2 | `timeline1`, `header126`, `section`, `layout230` |

### Utility classes in use

| Family | Classes (occurrences) |
|---|---|
| `text-style` | `text-style-gray` 194, `text-style-allcaps` 68, `text-style-green` 63, `text-style-secondary` 60, `text-style-h4` 18, `text-style-white` 17, `text-style-bold` 8, `text-style-tagline` 6, `text-style-lime` 2, `text-style-italic` 1 |
| `margin-bottom` | `margin-bottom` 227 |
| `spacer-small` | `spacer-small` 180 |
| `text-weight` | `text-weight-bold` 71, `text-weight-semibold` 35 |
| `margin-small` | `margin-small` 104 |
| `text-size` | `text-size-medium` 64, `text-size-small` 21, `text-size-regular` 4, `text-size-large` 2 |
| `padding-global` | `padding-global` 87 |
| `utility-margin` | `utility-margin-bottom-0` 69, `utility-margin-bottom-1rem` 13, `utility-margin-top-3rem` 2 |
| `heading-style` | `heading-style-h5` 33, `heading-style-h3` 13, `heading-style-h4` 11, `heading-style-h1` 6, `heading-style-h6` 5, `heading-style-h2` 4, `heading-style-h3-2` 4 |
| `padding-section` | `padding-section-small` 33, `padding-section-medium` 20, `padding-section-tiny` 11, `padding-section-large` 10 |
| `text-align` | `text-align-center` 60, `text-align-left` 1 |
| `spacer-medium` | `spacer-medium` 57 |
| `container-medium` | `container-medium` 56 |
| `margin-xsmall` | `margin-xsmall` 56 |
| `margin-top` | `margin-top` 44 |
| `icon-embed` | `icon-embed-xxsmall` 13, `icon-embed-xxsmall-5` 12, `icon-embed-xsmall-2` 4, `icon-embed-xsmall-4` 3, `icon-embed-medium` 2, `icon-embed-small` 2, `icon-embed-xxsmall-3` 1, `icon-embed-xxsmall-2` 1, `icon-embed-small-2` 1, `icon-embed-small-3` 1 |
| `max-width` | `max-width-large` 36, `max-width-medium` 1, `max-width-large-3` 1 |
| `is-animated` | `is-animated` 36 |
| `container-large` | `container-large` 36 |
| `align-center` | `align-center` 31 |
| `padding-xxlarge` | `padding-xxlarge` 28 |
| `button-label` | `button-label` 24 |
| `margin-xxsmall` | `margin-xxsmall` 24 |
| `margin-medium` | `margin-medium` 19 |
| `button` | `button` 18 |
| `padding-medium` | `padding-medium` 15 |
| `flex-vertical` | `flex-vertical` 14 |
| `background-color` | `background-color-dark` 14 |
| `padding-vertical` | `padding-vertical` 14 |
| `padding-bottom` | `padding-bottom` 14 |
| `margin-tiny` | `margin-tiny` 14 |
| `divider-horizontal` | `divider-horizontal` 14 |
| `border-top` | `border-top` 14 |
| `padding-top` | `padding-top` 14 |
| `button-group` | `button-group` 12, `button-group-3` 2 |
| `padding-custom` | `padding-custom4` 8, `padding-custom5` 4, `padding-custom6` 1 |
| `secondary-color` | `secondary-color` 12 |
| `icon-on` | `icon-on-inverse` 12 |
| `is-center` | `is-center` 10 |
| `spacer-large` | `spacer-large` 10 |
| `hide-mobile` | `hide-mobile-landscape` 10 |
| `container` | `container` 10 |
| `grid-layout` | `grid-layout` 10 |
| `grid-gap` | `grid-gap-md` 4, `grid-gap-xxl` 2, `grid-gap-xs` 2, `grid-gap-lg` 2 |
| `icon-large` | `icon-large` 9 |
| `is-bottom` | `is-bottom-left-previous` 2, `is-bottom-left-next` 2, `is-bottom-previous` 2, `is-bottom-next` 2, `is-bottom` 1 |
| `flex-horizontal` | `flex-horizontal` 8 |
| `flex-gap` | `flex-gap-xs` 6, `flex-gap-sm` 2 |
| `is-no` | `is-no-margin` 7 |
| `is-lime` | `is-lime` 7 |
| `is-black` | `is-black` 7 |
| `margin-large` | `margin-large` 6 |
| `is-fixed` | `is-fixed-width` 6 |
| `mobile-landscape` | `mobile-landscape-1-column` 6 |
| `icon-container` | `icon-container` 6 |
| `is-course` | `is-course` 6 |
| `is-centre` | `is-centre-previous` 3, `is-centre-next` 3 |
| `is-text` | `is-text` 4 |
| `desktop` | `desktop-1-column` 2, `desktop-6-column` 2 |
| `is-dark` | `is-dark-green` 3 |
| `button-social` | `button-social` 3 |
| `text-color` | `text-color-white` 3 |
| `margin-xxlarge` | `margin-xxlarge` 2 |
| `spacer-xlarge` | `spacer-xlarge` 2 |
| `background-lime` | `background-lime` 2 |
| `spacer-tiny` | `spacer-tiny` 2 |
| `small-container` | `small-container` 2 |
| `utility-text` | `utility-text-align-center` 2 |
| `background-gray` | `background-gray` 2 |
| `utility-display` | `utility-display-block` 2 |
| `text-link` | `text-link` 2 |
| `container-small` | `container-small` 2 |
| `is-absolute` | `is-absolute` 2 |
| `utility-page` | `utility-page-wrap` 1, `utility-page-content` 1 |
| `is-right` | `is-right` 1 |
| `is-link` | `is-link` 1 |
| `is-icon` | `is-icon` 1 |
| `is-green` | `is-green` 1 |
| `is-custom` | `is-custom` 1 |
| `container-custom` | `container-custom` 1 |

### Auto-named and numbered duplicates

`bold-text`, `bold-text-3`, `bold-text-4`, `bold-text-5`, `collection-item`, `collection-item-4`, `collection-list`, `collection-list-wrapper-2`, `div-block-10`, `div-block-11`, `div-block-12`, `div-block-13`, `div-block-15`, `div-block-17`, `div-block-20`, `div-block-5`, `div-block-8`, `heading-2`, `heading-3`, `heading-5`, `heading-6`, `image-13`, `image-14`, `image-15`, `image-6`, `image-7`, `link-block`, `next-3`, `paragraph-2`, `paragraph-5`, `previous-2`, `section`, `section-2`, `tag-2`, `text-block-10`, `text-block-11`, `text-block-12`, `text-block-13`, `text-block-14`, `text-block-15`, `text-block-2`, `text-block-3`, `text-block-4`, `text-block-6`, `text-block-7`, `text-block-8`, `text-field`, `text-field-2`, `textarea-2`

Numbered variants of named classes (Webflow's "-2" copies): `button-group-3`, `camp-detail-link-2`, `card-row4_image-2`, `content-item-1`, `content-item-4`, `gallery1_image-2`, `heading-style-h3-2`, `icon-embed-small-2`, `icon-embed-small-3`, `icon-embed-xsmall-2`, `icon-embed-xsmall-4`, `icon-embed-xxsmall-2`, `icon-embed-xxsmall-3`, `icon-embed-xxsmall-5`, `max-width-large-3`, `slider-arrow-2`, `utility-margin-bottom-0`

### Used in markup but not defined in any stylesheet

93 classes: they style nothing, but most are Client-First wrapper/section names kept as hooks (tests, scripts) or for structure. By kind: section-specific 72, named-component 12, state/js 4, webflow-runtime 4, webflow-autonamed 1.

`about-feature`, `about-member-title`, `blog5_component`, `camp-content_content-wrapper`, `camp-detail_certificates_wrapper`, `camp-detail_mentee_wrapper`, `camp-detail_mentor_wrapper`, `camp-docs_content-wrapper`, `camp-topic_text-wrapper`, `card-row4_card-content-top`, `card-row4_image-2`, `contact-form-image`, `contact-form-text-wrapper`, `content-wrapper`, `course-description-component`, `course-detail`, `expert_content-wrapper`, `footer-social-link`, `footer3_details-wrapper`, `footer3_left-wrapper`, `footer3_logo`, `footer_form-info`, `founding-story_image-wrapper`, `header126_component`, `header126_content-left`, `header49_content-left`, `header49_content-right`, `header64_component`, `iconify`, `iconify--bx`, `iconify--heroicons`, `iconify--iconoir`, `image-15`, `impact_content-left`, `impact_highlight-numbers`, `layout11_component`, `layout11_content-left`, `layout131_component`, `layout131_item`, `layout230_component`, `layout243_item-text-wrapper`, `layout351_component`, `layout353_content-right`, `layout9_component`, `layout9_content-left`, `layout9_item-text-wrapper`, `nc-icon-wrapper`, `plan-component`, `program-banner-wrapper`, `read-more-component`, `section_about-action`, `section_about-timeline`, `section_blog-highlight`, `section_blogpost-header`, `section_camp-content`, `section_camp-detail_certificates`, `section_camp-detail_mentee`, `section_camp-docs`, `section_camp-history`, `section_camp-info`, `section_camp-topic`, `section_founding-story`, `section_header76`, `section_homepage_hero`, `section_impact`, `section_news`, `section_partners`, `section_press`, `section_programs-overview`, `section_summer-camp`, `section_team`, `section_upcoming-events`, `team11_list-wrapper`, `team11_title-wrapper`, `team16_component`, `team1_image-wrapper`, `team3_component`, `team3_image-wrapper`, `team3_list-wrapper`, `team3_title-wrapper`, `team5_image-wrapper`, `team5_title-wrapper`, `testimonial18_client-image-wrapper`, `testimonial18_client-info`, `testimonial18_component`, `testimonial7_client`, `testimonial7_client-image-wrapper`, `testimonial7_mask`, `timeline1_component`, `w-dyn-item`, `w-dyn-items`, `w-dyn-list`, `w-lightbox`

### Defined but never used

40 classes appear in selectors but on no element of any page (JS state classes excluded):

- `src/styles/pima-website.webflow.css`: `avatar`, `global-styles`, `image`, `input`, `layout351_vertical-text-styling`, `logo`, `slide`, `textarea`
- `src/styles/webflow.css`: `w--nav-dropdown-list-open`, `w--nav-dropdown-open`, `w--nav-dropdown-toggle-open`, `w--nav-link-open`, `w-lightbox-active`, `w-lightbox-backdrop`, `w-lightbox-caption`, `w-lightbox-close`, `w-lightbox-container`, `w-lightbox-content`, `w-lightbox-control`, `w-lightbox-embed`, `w-lightbox-figure`, `w-lightbox-frame`, `w-lightbox-group`, `w-lightbox-hide`, `w-lightbox-image`, `w-lightbox-img`, `w-lightbox-inactive`, `w-lightbox-item`, `w-lightbox-left`, `w-lightbox-noscroll`, `w-lightbox-right`, `w-lightbox-spinner`, `w-lightbox-strip`, `w-lightbox-tall`, `w-lightbox-thumbnail`, `w-lightbox-thumbnail-image`, `w-lightbox-view`, `w-lightbox-wide`, `w-nav-link`, `w-slider-force-show`

## Grid placement by id (`#w-node-…`)

95 rules in `pima-website.webflow.css` target 174 distinct ids; **171 ids exist in the DOM**, 3 are dead. 0 DOM `w-node` ids have no rule.

54 selectors are compound `#w-node-<instance>.w-node-<symbol>` (Webflow symbol instances): the element carries the symbol's `w-node-…` as a **class** as well as its own id, so these elements (camp-page cards, footers) hold `w-node` names twice.

Declarations in these rules: `grid-area` 64, `justify-self` 19, `align-self` 7, `order` 5, `grid-column` 4, `place-self` 2.

Live ids (element, page, placement; `@media` noted when the rule is breakpoint-specific):

| Element (classes) | Parent | Pages | Placement |
|---|---|---|---|
| `div.event-card-image` (1 ids) | `card_event` | / | align-self: start |
| `div.founding-story_content_left` (1 ids) | `founding-story_content-wrapper` | / | grid-area: span 1 / span 1 / span 1 / span 1 |
| `div.card-row4_image-wrapper` (1 ids) | `w-inline-block` | / | align-self: start |
| `div.footer3_left-wrapper` (2 ids) | `w-layout-grid footer3_top-wrapper` | /, /404.html, /chi-tiet-trai-he/, /detail-blog-event/, /detail-course/, /detail-teaching-staff-brief/, /detail-team/, /khoa-hoc/, /lien-he/, /su-kien-blog/, /trai-he-pima-2026/, /trai-he-toan-hoc-2025/, /trai-he-toan-hoc-pima/, /ve-chung-toi/ | grid-area: span 1 / span 1 / span 1 / span 1<br>screen and (max-width:479px): grid-area: span 1 / span 2 / span 1 / span 2 |
| `div.footer_content_right` (2 ids) | `w-layout-grid footer3_top-wrapper` | /, /404.html, /chi-tiet-trai-he/, /detail-blog-event/, /detail-course/, /detail-teaching-staff-brief/, /detail-team/, /khoa-hoc/, /lien-he/, /su-kien-blog/, /trai-he-pima-2026/, /trai-he-toan-hoc-2025/, /trai-he-toan-hoc-pima/, /ve-chung-toi/ | grid-area: span 1 / span 2 / span 1 / span 2 |
| `div.form-text-field-wrapper` (2 ids) | `div-block-17` | /, /detail-blog-event/, /detail-course/, /khoa-hoc/, /lien-he/, /trai-he-toan-hoc-pima/, /ve-chung-toi/ | grid-area: span 1 / span 2 / span 1 / span 2 |
| `div.w-form` (1 ids) | `form-field-wrapper` | /, /detail-blog-event/, /detail-course/, /khoa-hoc/, /trai-he-toan-hoc-pima/, /ve-chung-toi/ | grid-area: span 1 / span 2 / span 1 / span 2 |
| `div.timeline20_item-content` (6 ids) | `timeline20_item` | /, /trai-he-pima-2026/, /trai-he-toan-hoc-2025/, /ve-chung-toi/ | grid-area: span 1 / span 1 / span 1 / span 1<br>screen and (max-width:767px): order: 9999 |
| `div.timeline20_progress-wrapper` (6 ids) | `timeline20_item` | /, /trai-he-pima-2026/, /trai-he-toan-hoc-2025/, /ve-chung-toi/ | screen and (max-width:479px): grid-area: 1 / 1 / 2 / 2 |
| `div.impact_content-left` (1 ids) | `impact_content-wrapper` | /, /trai-he-toan-hoc-pima/, /ve-chung-toi/ | grid-area: span 1 / span 1 / span 1 / span 1 |
| `div.impact_content-right` (1 ids) | `impact_content-wrapper` | /, /trai-he-toan-hoc-pima/, /ve-chung-toi/ | grid-area: span 1 / span 2 / span 1 / span 2 |
| `div.gallery25_content-left` (1 ids) | `gallery25_component` | /, /ve-chung-toi/ | screen and (max-width:991px): justify-self: auto |
| `div.max-width-medium` (1 ids) | `header7_content` | /chi-tiet-trai-he/ | grid-area: span 1 / span 2 / span 1 / span 2 |
| `div.course-feature-detail` (2 ids) | `w-layout-grid layout243_list` | /detail-course/ | align-self: start |
| `a.course-description-cover.w-inline-block.w-lightbox` (1 ids) | `content-gap` | /detail-course/ | grid-area: span 1 / span 1 / span 1 / span 1 |
| `div.course-listing-image-cover` (1 ids) | `course-listing-card w-inline-block` | /khoa-hoc/ | align-self: start |
| `a.button-social.w-inline-block` (3 ids) | `social-info-wrapper` | /lien-he/ | align-self: center |
| `div.contact-form-image` (1 ids) | `contact-form-image-wrapper` | /lien-he/ | grid-area: span 1 / span 2 / span 1 / span 2; align-self: end |
| `div.form-field-wrapper` (1 ids) | `contact-form-image-wrapper` | /lien-he/ | grid-area: span 1 / span 3 / span 1 / span 3 |
| `div.div-block-20` (1 ids) | `form-field-wrapper` | /lien-he/ | grid-area: span 1 / span 2 / span 1 / span 2 |
| `div.blog5_image-wrapper` (1 ids) | `blog5_featured-item-link` | /su-kien-blog/ | grid-area: span 1 / span 1 / span 1 / span 1 |
| `div.header76_content-left` (2 ids) | `w-layout-grid header76_component` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | justify-self: end<br>screen and (max-width:991px): justify-self: start |
| `div.header76_image-list` (8 ids) | `marquee_group` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 1 / span 1 / span 1 |
| `div.header76_image-wrapper` (24 ids) | `header76_image-list` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 1 / span 1 / span 1 |
| `img.header76_image` (22 ids) | `header76_image-wrapper` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 1 / span 1 / span 1 |
| `div.w-layout-grid.grid-layout.mobile-landscape-1-column.grid-gap-xxl` (1 ids) | `w-layout-grid grid-layout desktop-1-column grid-gap-md` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 1 / span 1 / span 1 |
| `p.utility-margin-bottom-0` (2 ids) | `w-layout-grid grid-layout mobile-landscape-1-column grid-gap-xxl` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 2 / span 1 / span 2<br>screen and (max-width:479px): grid-area: span 1 / span 3 / span 1 / span 3 |
| `div.container.small-container` (1 ids) | `section` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | grid-area: 1 / 2 / 2 / 5<br>screen and (max-width:767px): grid-area: span 1 / span 5 / span 1 / span 5 |
| `div.container.utility-margin-top-3rem` (1 ids) | `section` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 5 / span 1 / span 5 |
| `div.card` (5 ids) | `w-layout-grid grid-layout desktop-6-column grid-gap-xs` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 2 / span 1 / span 2<br>grid-area: span 1 / span 3 / span 1 / span 3<br>screen and (max-width:479px): grid-column: span 6 / span 6<br>screen and (max-width:991px): grid-column: span 3 / span 3 |
| `h3.h4-heading` (5 ids) | `card-body` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 1 / span 1 / span 1 |
| `div.div-block-12` (2 ids) | `w-layout-grid grid-layout mobile-landscape-1-column grid-gap-lg` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 2 / span 1 / span 2; place-self: auto |
| `div.footer_form-info` (1 ids) | `footer_content_right` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 3 / span 1 / span 3 |
| `div.timeline20_item` (10 ids) | `timeline20_list` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | screen and (max-width:767px): justify-self: start |
| `div.div-block-8` (2 ids) | `w-layout-grid grid-layout mobile-landscape-1-column grid-gap-xxl` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | screen and (max-width:479px): grid-area: span 1 / span 3 / span 1 / span 3 |
| `a.layout11_lightbox.w-inline-block.w-lightbox` (2 ids) | `w-layout-grid layout11_content` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | screen and (max-width:479px): grid-area: span 1 / span 1 / span 1 / span 1 |
| `div` (1 ids) | `w-layout-grid grid-layout mobile-landscape-1-column grid-gap-lg` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | screen and (max-width:479px): grid-area: span 1 / span 2 / span 1 / span 2 |
| `ul.flex-horizontal.flex-vertical.flex-gap-sm.utility-margin-bottom-0.w-list-unstyled` (1 ids) | `w-layout-grid grid-layout mobile-landscape-1-column grid-gap-lg` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/ | screen and (max-width:479px): grid-area: span 1 / span 2 / span 1 / span 2 |
| `div.logo3_wrapper` (37 ids) | `logo3_list` | /trai-he-pima-2026/, /trai-he-toan-hoc-2025/, /ve-chung-toi/ | grid-area: span 1 / span 1 / span 1 / span 1; justify-self: center<br>justify-self: center |
| `h3.heading-5` (1 ids) | `card-body` | /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 1 / span 1 / span 1 |
| `h3` (1 ids) | `card-body` | /trai-he-toan-hoc-2025/ | grid-area: span 1 / span 1 / span 1 / span 1 |
| `div.layout9_item` (2 ids) | `w-layout-grid layout9_item-list` | /trai-he-toan-hoc-pima/ | align-self: start |
| `div.layout9_content-left` (1 ids) | `layout9_content-left-wrapper` | /trai-he-toan-hoc-pima/ | grid-area: span 1 / span 2 / span 1 / span 2 |
| `div.layout353_content-right` (1 ids) | `w-layout-grid layout353_component` | /trai-he-toan-hoc-pima/ | grid-area: span 1 / span 1 / span 1 / span 1 |
| `div.timeline1_progress` (1 ids) | `w-layout-grid timeline1_content` | /ve-chung-toi/ | screen and (max-width:767px): grid-area: 2 / 1 / 3 / 2; justify-self: start |

Source files that write `w-node` ids: `src/components/CampHeaderPhotos.astro` (6), `src/components/CampTeamPhoto.astro` (4), `src/components/ContactForm.astro` (4), `src/components/Footer.astro` (6), `src/components/Impact.astro` (3), `src/components/MentorLogos.astro` (4), `src/components/Milestone.astro` (5), `src/components/Team.astro` (1), `src/components/VideoLightbox.astro` (3), `src/components/camp-header-photos.ts` (1), `src/components/mentor-logos.ts` (1), `src/gap-pages/detail-course.astro` (4), `src/gap-pages/su-kien-blog.astro` (1), `src/pages/chi-tiet-trai-he.astro` (1), `src/pages/index.astro` (3), `src/pages/khoa-hoc.astro` (1), `src/pages/lien-he.astro` (6), `src/pages/trai-he-pima-2026.astro` (45), `src/pages/trai-he-toan-hoc-2025.astro` (48), `src/pages/trai-he-toan-hoc-pima.astro` (4), `src/pages/ve-chung-toi.astro` (3).

## Custom properties

354 custom properties are declared (354 declarations; 312 `--ai-gen-…`, 42 `--_…`, 0 other). All `--ai-gen-…` share the prefix `--ai-gen-82921b10-4b39-48f0-b346-808cf4903d29-1746881340164---`, written `--ai·` below.

- Referenced directly by a live rule: **127**; reachable through other variables: 10 more; total in use **137**.
- Referenced only by dead rules: 7. Never referenced at all: 211.
- Referenced but not declared in CSS (set by an inline `style` attribute): `--marquee-duration`.
- Declared more than once (overrides, e.g. per breakpoint or per scope): 0.

In-use variables by family, with resolved values (`→` = resolved; `prop` = where live rules use it directly):

| Family | Variables in use |
|---|---|
| `_color` | `base--black` → `black` (-webkit-text-stroke-color, background-color, color); `base--white` → `white` (background-color, color); `brand--gray` → `#85888e` (color); `brand--light-gray` → `#cecfd2` (border); `brand--pale-lime` → `#d4e889` (background-color, color); `brand--pima-green` → `#50b448` (background-color, color); `gray--100` → `#f0f1f1` (background-color); `gray--200` → `#ececed` (border, border-color); `gray--25` → `#fafafa` (background-color, color); `gray--300` → `#cecfd2` (color); `gray--50` → `#f5f5f6` (background-color); `gray--500` → `#85888e` (color); `gray--600` → `#61646c` (border-top, color); `gray--700` → `#333741` (color); `gray--800` → `#1f242f` (color); `gray--950` → `#0c111d` (color); `green--200` → `#d0f8ab` (border); `green--25` → `#fafef5` (background-image); `green--500-pima-green` → `#50b448` (-webkit-text-stroke-color, color); `green--600` → `#4ca30d`; `green--800` → `#326212` (background-color); `green--900-dark-green` → `#2b5314` (background-color, color); `pale-lime--100` → `#e6f2bc` (background-color, color); `pale-lime--200` → `#d9eb99` (background-color); `pale-lime--25` → `#f7fbeb` (background-color); `pale-lime--300-pale-lime` → `#d4e889` (background-color, border); `pale-lime--50` → `#f2f8db` (background-color) |
| `background-color` | `bg-accent-primary` → `#50b448` (color); `bg-primary` → `#fff` (background-color) |
| `base-typography` | `base-font-size` → `1rem` (font-size); `base-letter-spacing` → `0em` (letter-spacing); `base-line-height` → `1.6rem` (line-height); `base-margin-bottom` → `.7em` (margin-bottom) |
| `border-color` | `border-secondary` → `#26262833` |
| `button` | `button-font` → `"Nunito Sans", sans-serif` (font-family); `button-padding-horizontal` → `1.5em` (padding); `button-padding-vertical` → `1em` (padding); `button-primary-border` → `transparent` (border); `button-primary-border-hover` → `transparent` (border-color); `button-primary-text` → `#fff` (color); `button-radius` → `100rem` (border-bottom-left-radius, border-bottom-right-radius, border-radius, border-top-left-radius, border-top-right-radius); `button-secondary-bg-hover` → `transparent` (background-color) |
| `card` | `card-padding` → `3rem` (padding); `card-padding-mobile-l` → `1.5rem` (padding); `card-padding-mobile-p` → `1.5rem` (padding); `card-padding-tablet` → `2rem` (padding); `card-primary-border` → `#26262833` (border); `card-radius` → `1.25rem` (border-bottom-left-radius, border-bottom-right-radius, border-radius, border-top-left-radius, border-top-right-radius) |
| `container` | `container-padding-horizontal` → `1rem` (padding, padding-left, padding-right); `container-sm-width` → `1000px` (max-width); `container-width` → `1280px` (max-width) |
| `core-accent-color` | `accent-primary` → `#50b448` (background-color, color, outline-color); `accent-primary-hover` → `#4ca30d` (background-color, color); `accent-secondary` → `transparent` (background-color, border) |
| `core-color-tint` | `neutral-inverse-a20` → `#26262833` (box-shadow) |
| `core-neutral-color` | `neutral-inverse` → `#262628`; `neutral-primary` → `#fff` |
| `font` | `body-font` → `"Nunito Sans", sans-serif` (font-family); `button-font` → `"Nunito Sans", sans-serif`; `heading-font` → `"Nunito Sans", sans-serif` (font-family) |
| `gap` | `lg-gap` → `4rem` (grid-column-gap, grid-row-gap); `md-gap` → `3rem` (grid-column-gap, grid-row-gap); `sm-gap` → `2rem` (grid-column-gap, grid-row-gap); `xs-gap` → `1rem` (grid-column-gap, grid-row-gap); `xxl-gap` → `6rem` (grid-column-gap, grid-row-gap); `xxs-gap` → `.5rem` (grid-column-gap, grid-row-gap, padding-bottom, padding-top) |
| `h1-heading` | `h1-letter-spacing` → `-.01em` (letter-spacing); `h1-line-height` → `1.04em` (line-height); `h1-margin-bottom` → `.3em` (margin-bottom); `h1-size` → `4.21rem` (font-size); `h1-size-mobile-p` → `2.15rem` (font-size); `h1-size-tablet` → `3.37rem` (font-size) |
| `h2-heading` | `h2-letter-spacing` → `-.01em` (letter-spacing); `h2-line-height` → `1.04em` (line-height); `h2-margin-bottom` → `.35em` (margin-bottom); `h2-size` → `2.37rem` (font-size); `h2-size-mobile-l` → `1.52rem` (font-size); `h2-size-mobile-p` → `1.21rem` (font-size); `h2-size-tablet` → `1.89rem` (font-size); `h2-weight` → `400` (font-weight) |
| `h4-heading` | `h4-letter-spacing` → `-.01em` (letter-spacing); `h4-line-height` → `1.3em` (line-height); `h4-margin-bottom` → `.5em` (margin-bottom); `h4-size` → `1.33rem` (font-size); `h4-size-mobile-l` → `1.08rem` (font-size); `h4-size-mobile-p` → `.97rem` (font-size); `h4-size-tablet` → `1.2rem` (font-size); `h4-weight` → `400` (font-weight) |
| `h5-heading` | `h5-letter-spacing` → `0em` (letter-spacing); `h5-line-height` → `1.3em` (line-height); `h5-margin-bottom` → `.7em` (margin-bottom); `h5-size` → `1rem` (font-size); `h5-size-mobile-l` → `1rem` (font-size); `h5-size-mobile-p` → `1rem` (font-size); `h5-size-tablet` → `1rem` (font-size); `h5-weight` → `400` (font-weight) |
| `image` | `image-radius` → `1.25rem` (border-radius) |
| `nav-link` | `nav-link-primary` → `#262628` (color) |
| `radius` | `md-radius` → `.5rem` (border-bottom-left-radius, border-bottom-right-radius, border-top-left-radius, border-top-right-radius); `round` → `100rem` (border-radius); `sm-radius` → `.25rem` (border-bottom-left-radius, border-bottom-right-radius, border-top-left-radius, border-top-right-radius) |
| `section` | `section-padding-vertical-mobile-l` → `6rem` (padding-bottom, padding-top); `section-padding-vertical-mobile-p` → `5rem` (padding-bottom, padding-top); `section-padding-vertical-tablet` → `7rem` (padding-bottom, padding-top) |
| `spacing` | `0-5x` → `.5rem` (grid-column-gap, grid-row-gap, margin-top, padding, padding-bottom, padding-left, padding-right, padding-top); `0-75x` → `.75rem` (padding); `1-25x` → `1.25rem` (font-size, padding-top); `1-5x` → `1.5rem` (margin-top); `1x` → `1rem` (margin-bottom, padding-bottom, padding-left, padding-right, padding-top); `2x` → `2rem` (height, margin-top, width); `3x` → `3rem` (height, margin-top, width); `4x` → `4rem` (font-size); `5x` → `5rem`; `6x` → `6rem`; `7x` → `7rem` |
| `tag` | `tag-padding-horizontal` → `.5rem` (grid-column-gap, grid-row-gap); `tag-radius` → `100rem` (border-bottom-left-radius, border-bottom-right-radius, border-top-left-radius, border-top-right-radius); `tag-size` → `.75rem` (font-size) |
| `text-color` | `text-accent-on-inverse` → `#09ce65` (color); `text-accent-on-inverse-hover` → `#09ce6599`; `text-accent-on-primary` → `#05aa53` (color); `text-accent-on-primary-hover` → `#05aa5399`; `text-inverse-primary` → `#fff` (color); `text-on-accent-primary` → `#fff` (color); `text-primary` → `#262628` (color) |
| `text-lg` | `lg-text-size` → `1.13rem` (font-size) |
| `text-link` | `link-inverse-hover` → `#09ce6599` (color); `link-primary` → `#05aa53` (color); `link-primary-hover` → `#05aa5399` (color); `link-secondary` → `#262628` (color) |
| `text-sm` | `sm-text-letter-spacing` → `0em` (letter-spacing); `sm-text-line-height` → `1.6em` (line-height); `sm-text-size` → `.88rem` (font-size); `sm-text-size-mobile-l` → `.88rem` (font-size); `sm-text-size-mobile-p` → `.88rem` (font-size); `sm-text-size-tablet` → `.88rem` (font-size) |

Unused variables by family: `core-color-tint` 44, `card` 23, `input` 17, `_color` 15, `blockquote` 14, `h0-heading` 8, `h3-heading` 8, `h6-heading` 8, `ix` 8, `eyebrow` 7, `button` 7, `text-xl` 6, `text-xxl` 6, `text` 6, `background-color` 5, `text-color` 5, `text-lg` 5, `border-color` 4, `spacing` 3, `core-accent-color` 3, `base-typography` 2, `h1-heading` 2, `text-link` 2, `radius` 2, `container` 1, `gap` 1, `size-grid-gap` 1, `nav-link` 1, `core-neutral-color` 1, `nav` 1, `section` 1, `tag` 1.
## Design values in use

Counts are element×width occurrences over 14 pages × 4 widths (390, 600, 820, 1440 px, one per Webflow tier), taken from computed styles of visible elements; text properties count only elements with their own text.

### Text colours

| Colour | Alpha | Count | Nearest brand token (ΔE76) | Where (top) |
|---|---|--:|---|---|
| `#262628` | 1.0 | 1591 | `--gray-1` 13.3 (**off**) | `section_contact-form label`; `section_impact div`; `section_testimonials div` |
| `#cecfd2` | 1.0 | 724 | `--gray-4` 3.9 (close) | `footer_form-info a.text-style-gray`; `footer_contact div.text-style-gray.text-weight-bold`; `footer_contact a.text-style-gray` |
| `#50b448` | 1.0 | 472 | `--pima-green` 0.0 (exact) | `footer_form-info h5.text-style-allcaps.text-style-green`; `section_impact h4.text-style-h4`; `footer_form-info span` |
| `#d4e889` | 1.0 | 348 | `--pima-pale-lime` 0.0 (exact) | `section_trust-bar_dark-green div.text-block-2`; `section_founding-story h4.text-style-lime.text-style-allcaps`; `section_camp-detail_hero p.text-size-medium.text-style-allcaps` |
| `#000000` | 1.0 | 320 | `--black` 0.0 (exact) | `section_testimonials em`; `section_team16 div.text-size-medium.text-weight-bold`; `section_team16 div.text-size-medium.text-align-center` |
| `#ffffff` | 1.0 | 188 | `--white` 0.0 (exact) | `footer3_details-wrapper div.text-size-small.text-weight-semibold`; `footer3_details-wrapper span`; `section_philosophy a.button.is-dark-green` |
| `#85888e` | 1.0 | 116 | `--gray-3` 7.5 (**off**) | `nav div.text-style-secondary`; `footer3_credit-text div.footer3_credit-text.text-style-gray` |
| `#61646c` | 1.0 | 100 | `--gray-2` 5.0 (**off**) | `section_milestone h3.heading-style-h5`; `section-2 h3.heading-style-h5`; `section_press h3.heading-style-h5` |
| `#05aa53` | 1.0 | 72 | `--pima-green` 13.3 (**off**) | `section_testimonials div.text-weight-semibold`; `section_testimonials strong.bold-text-3`; `section_testimonials strong.bold-text-4` |
| `#e6f2bc` | 1.0 | 32 | `--pima-pale-lime` 21.4 (**off**) | `section_layout11 div.text-block-6` |
| `#333741` | 1.0 | 12 | `--gray-1` 8.7 (**off**) | `section-contact-social div.text-block-14`; `section-contact-social span` |
| `#333333` | 1.0 | 8 | `--gray-1` 7.2 (**off**) | `section_blogpost-read-more div.w-inline-block` |
| `#2b5314` | 1.0 | 4 | `--pima-dark-green` 3.3 (close) | `section_upcoming-events div` |

### Background colours

| Colour | Alpha | Count | Nearest brand token (ΔE76) | Where (top) |
|---|---|--:|---|---|
| `#ffffff` | 1.0 | 528 | `--white` 0.0 (exact) | `section_testimonials div.testimonial18_card`; `section_contact-form input.text-field-2.w-input`; `body body` |
| `#50b448` | 1.0 | 216 | `--pima-green` 0.0 (exact) | `section_milestone div.timeline20_circle`; `section-2 div.timeline20_circle`; `section_milestone div.timeline20_progress-line` |
| `#222222` | 0.4, 1.0 | 152 | `--black` 13.2 (**off**) | `section_team div.w-slider-dot`; `section_summer-camp div.w-slider-dot`; `section_camp-detail_certificates div.w-slider-dot` |
| `#dddddd` | 0.0, 1.0 | 84 | `--gray-4` 1.4 (close) | `body div.nav-container.w-nav`; `section_team div.w-dyn-empty`; `section_upcoming-events div.w-dyn-empty` |
| `#3b3b3b` | 1.0 | 56 | `--gray-1` 3.5 (close) | `footer div.background-color-dark` |
| `#2b5314` | 1.0 | 44 | `--pima-dark-green` 3.3 (close) | `section_trust-bar_dark-green div.section_trust-bar_dark-green`; `section_trust-bar_dark-green div.section_trust-bar_dark-green.is-animated`; `section_philosophy a.button.is-dark-green` |
| `#e6f2bc` | 1.0 | 40 | `--pima-pale-lime` 21.4 (**off**) | `section_contact-form div.section_contact-form`; `section_contact-form div.section_contact-form.is-animated`; `section_header61 header.section_header61.text-color-white` |
| `#d4e889` | 1.0 | 36 | `--pima-pale-lime` 0.0 (exact) | `section_course-detail div.layout60_item-icon-wrapper`; `section_philosophy div.section_philosophy`; `section_upcoming-events div.div-block-5` |
| `#f2f8db` | 1.0 | 32 | `--gray-5` 15.1 (**off**) | `section_testimonials div.section_testimonials`; `section_camp-header header.section_camp-header.is-animated`; `body section.section.background-lime` |
| `#000000` | 0.5, 1.0 | 28 | `--black` 0.0 (exact) | `section_team a.button.is-lime`; `section_summer-camp a.button.is-lime`; `section_news a.button.is-lime` |
| `#f5f5f6` | 1.0 | 28 | `--gray-5` 2.2 (close) | `section_about-action div.layout230_item`; `section_about-plan section.section_about-plan`; `section-contact-social div.contact-social-component` |
| `#fafafa` | 1.0 | 24 | `--white` 1.7 (close) | `section_milestone div.section_milestone`; `section-2 section.section-2.background-gray`; `section_blogpost-read-more a.w-pagination-previous.previous-2` |
| `#d9dadb` | 1.0 | 24 | `--gray-4` 0.7 (exact) | `section_about-timeline div.timeline1_circle` |
| `#f0f1f1` | 1.0 | 8 | `--gray-5` 0.7 (exact) | `section_team div.collection-item.w-dyn-item` |
| `#d9eb99` | 1.0 | 8 | `--pima-pale-lime` 6.6 (**off**) | `body div.div-block-12` |
| `#326212` | 1.0 | 4 | `--pima-dark-green` 7.2 (**off**) | `section_founding-story div.founding-story_content-wrapper` |
| `#f7fbeb` | 1.0 | 4 | `--white` 8.5 (**off**) | `section_camp-detail_mentor div.section_camp-detail_mentor` |

### Border colours

| Colour | Alpha | Count | Nearest brand token (ΔE76) | Where (top) |
|---|---|--:|---|---|
| `#cccccc` | 1.0 | 592 | `--gray-4` 4.6 (close) | `section_contact-form input.text-field-2.w-input`; `section_contact-form input.text-field.w-input`; `section_contact-form textarea.textarea-2.w-input` |
| `#767676` | 1.0 | 112 | `--gray-2` 6.4 (**off**) | `section_contact-form input` |
| `#d0f8ab` | 1.0 | 112 | `--pima-pale-lime` 12.9 (**off**) | `section_camp-history div.layout353_content-item.content-item-1`; `section_camp-history div.layout353_content-item.content-item-4` |
| `#61646c` | 1.0 | 56 | `--gray-2` 5.0 (**off**) | `footer div.border-top` |
| `#ececed` | 1.0 | 52 | `--gray-5` 1.1 (close) | `body div.layout351_accordion`; `body div.layout351_accordion.active`; `body div.layout351_content` |
| `#cecfd2` | 1.0 | 48 | `--gray-4` 3.9 (close) | `section-contact-social a.button-social.w-inline-block` |
| `#d4e889` | 1.0 | 12 | `--pima-pale-lime` 0.0 (exact) | `body div.layout351_accordion`; `body div.layout351_content` |

### Background images and gradients

| Value (truncated) | Count | Where |
|---|--:|---|
| `linear-gradient(rgb(250, 254, 245), rgb(250, 254, 245))` | 28 | `section_camp-history div.layout353_content-item.content-item-1`; `section_camp-history div.layout353_content-item.content-item-4` |

### Font family, weight, style

- **font-family**: `"Nunito Sans", sans-serif` 3987
- **font-weight**: `400` 1156, `700` 1059, `600` 656, `300` 608, `500` 492, `800` 16
- **font-style**: `normal` 3895, `italic` 92
- **text-transform**: `none` 3355, `uppercase` 632

Weights outside the brand set 400/600/700/800/900, where they occur:

- `300` (608): `footer_form-info a.text-style-gray` 376; `footer_contact a.text-style-gray` 104; `footer_contact div.text-style-gray` 64; `footer3_credit-text div.footer3_credit-text.text-style-gray` 56; `footer_form-info a.text-style-gray.w--current` 8
- `500` (492): `section_trust-bar_dark-green div.text-block-2` 336; `section_course-detail div.text-block-13` 48; `section_milestone h3.heading-style-h5` 40; `section-2 h3.heading-style-h5` 40; `section_press h3.heading-style-h5` 20; `body strong.bold-text` 8

### Font sizes per width

Distinct computed sizes (px) of text elements; count in brackets.

| Width | Sizes |
|---|---|
| 390 | 14 (185), 14.08 (10), 15.52 (19), 16 (564), 19.2 (2), 19.36 (42), 20 (5), 21.28 (72), 24 (44), 32 (3), 34.4 (1), 40 (6), 41.6 (18), 60.8 (2), 64 (8) |
| 600 | 12 (5), 14 (180), 14.08 (10), 15.52 (7), 16 (564), 17.28 (12), 19.2 (2), 19.36 (40), 20 (5), 21.28 (72), 24 (44), 24.32 (2), 32 (3), 34.4 (1), 40 (6), 41.6 (18), 60.8 (2), 64 (8) |
| 820 | 14 (148), 14.08 (10), 16 (591), 19.2 (21), 21.28 (72), 24 (43), 30.24 (42), 32 (16), 41.6 (18), 48 (3), 53.92 (1), 60.8 (2), 64 (14) |
| 1440 | 14 (148), 14.08 (10), 16 (651), 19.2 (2), 21.28 (91), 24 (46), 32 (16), 37.92 (42), 41.6 (18), 48 (3), 60.8 (2), 64 (14), 67.36 (1) |

Distinct sizes over all widths: 23.

### Line heights (ratio to font size)

`1.60` 2208, `1.83` 592, `1.30` 480, `1.04` 180, `1.50` 148, `1.20` 144, `1.25` 112, `1.40` 55, `0.40` 32, `1.10` 24, `0.42` 8, `1.00` 4

Line heights below 1.1 (the brand floor for uppercase Vietnamese headings), where: `0.40` → `section_layout11 div.text-block-6`; `0.42` → `section_course-detail div.text-block-11`; `1.00` → `section_upcoming-events div`; `1.04` → `section_partners h2`; `section_impact h2.heading-2`; `section_testimonials h2.text-align-center`; `section_philosophy h2`

Letter spacing: `normal` 3507, `-0.1936px` 82, `-0.416px` 72, `-0.2128px` 55, `-0.3024px` 42, `-0.3792px` 42, `-0.24px` 34, `-0.32px` 32, `-0.192px` 27, `-0.1552px` 26, `-0.16px` 16, `-0.1728px` 12, `-0.4px` 12, `-0.64px` 12, `-0.48px` 6, `-0.2px` 4, `-0.344px` 2, `-0.2432px` 2, `-0.5392px` 1, `-0.6736px` 1

### Corner radius

Brand: `--radius` 2 mm ≈ 7.6 px, `--radius-s` 1 mm ≈ 3.8 px (print values; the web value is open).

| Radius | Count | Where (top) |
|---|--:|---|
| `20px` | 1459 | `section_trust-bar_dark-green img`; `footer_icon-wrapper img`; `section_header76 img.header76_image` |
| `100%` | 420 | `section_testimonials img.testimonial18_customer-image`; `section_milestone div.timeline20_circle`; `section_team div.w-slider-dot` |
| `1600px` | 164 | `nav a.nav-link.nav-link-on-inverse`; `body div.icon-large.icon-container`; `nav div.nav-link.nav-link-on-inverse` |
| `99px` | 164 | `section_contact-form input.text-field-2.w-input`; `section_contact-form input.text-field.w-input`; `section_contact-form input.submit-button.w-button` |
| `12px` | 124 | `section_testimonials div.testimonial18_card`; `section_contact-form textarea.textarea-2.w-input`; `section_camp-history div.layout353_content-item.content-item-1` |
| `16px` | 112 | `section_team img.gallery25_image`; `section_summer-camp img.gallery22_image`; `section_course-detail div.layout60_item-icon-wrapper` |
| `0px 20px` | 48 | `body div.nav-container.w-nav` |
| `4px` | 32 | `section_team div.slider-arrow.is-bottom-left-previous`; `section_team div.slider-arrow.is-bottom-left-next`; `section_summer-camp div.slider-arrow.is-bottom-previous` |
| `19px` | 8 | `section_layout11 img.layout11_lightbox-image` |
| `8px` | 1 | `section_course-detail a.course-description-cover.w-inline-block` |

### Shadows

| Box shadow | Count | Where |
|---|--:|---|
| `rgba(38, 38, 40, 0.2) 0px 0px 0px 1px` | 52 | `body div.card`; `body div.card.w-node-c220ef7e-c1c3-9e83-ac41-23d9bf317d39-57c668ac`; `body div.card.w-node-c220ef7e-c1c3-9e83-ac41-23d9bf317d42-57c668ac` |

### Border widths, outlines, opacity

- **border-width**: `1px` 872, `2px` 112
- **outline**: `rgb(229, 0, 126) 3px` 180
- **opacity**: `0` 314 (scroll-animation start state of not-yet-seen elements), plus ~40 transient values between 0 and 1 (animations mid-flight when measured). No static opacity < 1 on text.

### Spacing steps

Non-zero computed padding (4 sides), margin-top/bottom, row-gap and column-gap, in px. Values ≥ 1 % of occurrences are listed; the rest are counted as the long tail.

2 (154), 4 (662), 5 (328), 8 (1673), 9.6 (568), 10 (1167), 12 (776), 14.9 (168), 16 (3346), 19.5 (178), 20 (818), 24 (629), 30 (178), 32 (1364), 41 (178), 48 (457), 64 (345), 72 (176)

Long tail: 46 more distinct values, 1105 occurrences. Distinct spacing values overall: 64. Values that are not whole multiples of 4 px: 49 distinct, 3801 occurrences.

## Text contrast (WCAG AA)

Every visible text element's colour against its effective background (ancestor background colours alpha-composited over white; stops at the first ancestor with a background image, reported separately). Large text = ≥ 24 px, or ≥ 18.66 px at weight ≥ 700: needs 3:1; other text needs 4.5:1. Element opacity is not applied (most opacity < 1 comes from scroll animations' start state).

### All text/background pairs

| Text | Background | Ratio | Large only? | Count | AA | Where (top) |
|---|---|--:|---|--:|---|---|
| `#ffffff` (white) | `#ffffff` (white) | 1.00 | yes | 4 | false positive: the hero background is a sibling layer (`header7_background-video-wrapper`, PiMA Green + 50 % black overlay ≈ `#285a24`), not an ancestor; on that layer the pair passes | `section_camp-detail_hero h1.heading-style-h1.text-style-white` |
| `#e6f2bc` (pima-pale-lime) | `#ffffff` (white) | 1.18 | yes | 32 | **fail** | `section_layout11 div.text-block-6` |
| `#d4e889` (pima-pale-lime) | `#ffffff` (white) | 1.34 | no | 8 | false positive: the hero background is a sibling layer (`header7_background-video-wrapper`, PiMA Green + 50 % black overlay ≈ `#285a24`), not an ancestor; on that layer the pair passes | `section_camp-detail_hero p.text-size-medium.text-style-allcaps`; `section_camp-detail_hero span` |
| `#50b448` (pima-green) | `#f2f8db` (gray-5) | 2.41 | no | 32 | **fail** | `section_camp-header div.text-style-tagline.text-block-7`; `section_camp-header span`; `body div.text-style-green` |
| `#50b448` (pima-green) | `#f5f5f6` (gray-5) | 2.42 | mixed | 12 | **fail** | `section_course-detail div.text-block-11`; `section_about-plan h4.text-style-green.text-style-allcaps` |
| `#50b448` (pima-green) | `#ffffff` (white) | 2.64 | mixed | 192 | **fail** | `section_impact h4.text-style-h4`; `section_partners h5.text-style-green.text-style-allcaps`; `section_partners span` |
| `#ffffff` (white) | `#50b448` (pima-green) | 2.64 | no | 28 | **fail** | `section_header76 a.button.w-button`; `body a.button.w-button`; `section-2 a.button.w-button` |
| `#05aa53` (pima-green) | `#f5f5f6` (gray-5) | 2.80 | no | 12 | **fail** | `section_course-detail div.text-weight-semibold` |
| `#05aa53` (pima-green) | `#ffffff` (white) | 3.05 | no | 60 | **fail** | `section_testimonials div.text-weight-semibold`; `section_testimonials strong.bold-text-3`; `section_testimonials strong.bold-text-4` |
| `#85888e` (gray-3) | `#3b3b3b` (gray-1) | 3.15 | no | 56 | **fail** | `footer3_credit-text div.footer3_credit-text.text-style-gray` |
| `#50b448` (pima-green) | `#2b5314` (pima-dark-green) | 3.39 | no | 8 | **fail** | `section_about-header div.text-style-tagline.text-block-7`; `section_about-header span` |
| `#85888e` (gray-3) | `#ffffff` (white) | 3.55 | no | 60 | **fail** | `nav div.text-style-secondary` |
| `#50b448` (pima-green) | `#3b3b3b` (gray-1) | 4.25 | no | 200 | **fail** | `footer_form-info h5.text-style-allcaps.text-style-green`; `footer_form-info span`; `footer_form-info h4.text-style-allcaps.text-style-green` |
| `#cecfd2` (gray-4) | `#326212` (pima-dark-green) | 4.66 | no | 4 | pass | `section_founding-story p.text-size-medium.text-style-white` |
| `#d4e889` (pima-pale-lime) | `#326212` (pima-dark-green) | 5.43 | no | 4 | pass | `section_founding-story h4.text-style-lime.text-style-allcaps` |
| `#61646c` (gray-2) | `#fafafa` (white) | 5.67 | no | 80 | pass | `section_milestone h3.heading-style-h5`; `section-2 h3.heading-style-h5` |
| `#61646c` (gray-2) | `#ffffff` (white) | 5.92 | no | 20 | pass | `section_press h3.heading-style-h5` |
| `#d4e889` (pima-pale-lime) | `#2b5314` (pima-dark-green) | 6.68 | no | 336 | pass | `section_trust-bar_dark-green div.text-block-2` |
| `#cecfd2` (gray-4) | `#3b3b3b` (gray-1) | 7.19 | no | 720 | pass | `footer_form-info a.text-style-gray`; `footer_contact div.text-style-gray.text-weight-bold`; `footer_contact a.text-style-gray` |
| `#ffffff` (white) | `#326212` (pima-dark-green) | 7.26 | yes | 4 | pass | `section_founding-story h3.heading-3.text-style-white` |
| `#ffffff` (white) | `#2b5314` (pima-dark-green) | 8.94 | mixed | 16 | pass | `section_philosophy a.button.is-dark-green`; `section_about-header h1.about-title`; `body a.button.is-dark-green` |
| `#2b5314` (pima-dark-green) | `#ffffff` (white) | 8.94 | no | 4 | pass | `section_upcoming-events div` |
| `#333741` (gray-1) | `#f5f5f6` (gray-5) | 10.93 | no | 12 | pass | `section-contact-social div.text-block-14`; `section-contact-social span` |
| `#262628` (gray-1) | `#dddddd` (gray-4) | 11.12 | no | 40 | pass | `section_team div`; `section_course-detail div`; `section_upcoming-events div` |
| `#ffffff` (white) | `#3b3b3b` (gray-1) | 11.20 | no | 112 | pass | `footer3_details-wrapper div.text-size-small.text-weight-semibold`; `footer3_details-wrapper span` |
| `#262628` (gray-1) | `#d4e889` (pima-pale-lime) | 11.29 | yes | 8 | pass | `section_philosophy h2` |
| `#333333` (gray-1) | `#fafafa` (white) | 12.10 | no | 8 | pass | `section_blogpost-read-more div.w-inline-block` |
| `#262628` (gray-1) | `#e6f2bc` (pima-pale-lime) | 12.80 | mixed | 428 | pass | `section_contact-form label`; `section_contact-form div.text-weight-bold`; `section_contact-form div` |
| `#262628` (gray-1) | `#f2f8db` (gray-5) | 13.83 | mixed | 44 | pass | `section_testimonials h2.text-align-center`; `body em`; `body h2.utility-margin-bottom-0` |
| `#262628` (gray-1) | `#f5f5f6` (gray-5) | 13.86 | mixed | 200 | pass | `section_course-detail div.text-block-13`; `section_course-detail h3`; `section_course-detail div.course-mentor-name` |
| `#262628` (gray-1) | `#f7fbeb` (white) | 14.35 | yes | 4 | pass | `section_camp-detail_mentor h2` |
| `#262628` (gray-1) | `#fafafa` (white) | 14.47 | mixed | 112 | pass | `section_milestone p`; `section-2 p`; `section_milestone h2.heading-3.text-align-center` |
| `#262628` (gray-1) | `#ffffff` (white) | 15.10 | mixed | 727 | pass | `section_impact div`; `section_testimonials div`; `section_team div.expert-image-caption` |
| `#000000` (black) | `#d4e889` (pima-pale-lime) | 15.70 | no | 12 | pass | `section_philosophy p.text-size-medium.text-align-center`; `section_founding-story a.button.is-lime` |
| `#000000` (black) | `#e6f2bc` (pima-pale-lime) | 17.79 | no | 16 | pass | `section_header61 p.text-size-medium`; `section_camp-activity p.text-size-medium`; `section_header61 strong` |
| `#000000` (black) | `#f2f8db` (gray-5) | 19.23 | yes | 12 | pass | `section_camp-header h1.heading-style-h1`; `section_blog-header h1.heading-style-h1` |
| `#000000` (black) | `#f5f5f6` (gray-5) | 19.27 | no | 4 | pass | `section_about-plan p.text-size-medium.text-align-center` |
| `#000000` (black) | `#ffffff` (white) | 21.00 | mixed | 248 | pass | `section_testimonials em`; `section_team16 div.text-size-medium.text-weight-bold`; `section_team16 div.text-size-medium.text-align-center` |
| `#ffffff` (white) | `#000000` (black) | 21.00 | no | 24 | pass | `section_team a.button.is-lime`; `section_summer-camp a.button.is-lime`; `section_news a.button.is-lime` |

**13 of 39 pairs are flagged; 2 are false positives (the `chi-tiet-trai-he` hero, see the table), so 11 pairs fail AA**, covering 692 of 3903 text occurrences. The real fails: PiMA Green text on white, off-white, lime-50 and the dark footer; white on PiMA Green (primary buttons); Relume green `#05aa53` on white; gray `#85888e` on white (nav dropdown) and on the footer; PiMA Green on dark green `#2b5314`; and `#e6f2bc` step numbers on white (decorative numerals "1, 2, 3" on the 2025/2026 pages).

### Text over images

84 text occurrences sit on an ancestor with a background image (contrast not computed): `section_camp-history h3.heading-style-h5.text-style-bold` 28; `section_camp-history p` 28; `section_camp-history a.camp-detail-link` 20; `section_camp-history a.camp-detail-link-2` 8
## Icons and logos

Inventory of `src/` + `public/` on `dev` (0b75017). Provenance: every raster/SVG file maps 1:1 to `site/images/*` in `scripts/image-map.json` (Webflow export); inline SVGs are Webflow `w-embed` blocks copied from `site/*.html` (Iconify sets: `bx` = BoxIcons, `heroicons`, `iconoir`; plus Relume/Nucleo snippets). Gap pages (`src/gap-pages/`) are a dev-only route (`src/lib/gap-pages.ts`), not in `dist/`.

Colour key: PiMA Green `#50b448`; brand Dark Green `#275613`; Pale Lime `#d4e889`.

### Icons

| # | Icon | Source / format | Style | Colour (where set) | Used in | Prov. |
|---|---|---|---|---|---|---|
| 1 | Hamburger (3 lines) | inline SVG, `Nav.astro` | line, stroke 1.5, square caps | currentColor → `.icon.icon-on-inverse` `#09ce65` (Relume AI-gen token, off-palette) | Nav (mobile), all site-chrome pages | Webflow/Nucleo |
| 2 | Dropdown caret | **icon font** `webflow-icons` glyph `\e603` (`w-icon-dropdown-toggle`), TTF base64 in `webflow.css` | filled glyph | `.nav-caret.secondary-color` `#85888e` gray | Nav dropdown | Webflow runtime CSS |
| 3–4 | Slider arrow left / right | inline SVG, `Slider.astro` | filled path (arrow drawn as outline shape) | currentColor (`.slider-arrow`, Relume vars) | Team, SummerCamp, index, chi-tiet-trai-he sliders | Relume |
| 5 | Chevron right (link button) | inline SVG, `index.astro` | line, stroke 1.5 | `#50b448` (`.icon-embed-xxsmall`) | index news "is-link is-icon" | Relume |
| 6 | Arrow right | inline SVG `bx` | filled | `#50b448` | `khoa-hoc` course card | BoxIcons |
| 7 | LinkedIn | inline SVG `bx` | filled glyph | footer: `a` colour `#50b448`; lien-he: `#0a66c2` (LinkedIn blue, hard-wired in CSS) | Footer (site), lien-he social pill | BoxIcons |
| 8 | Facebook | inline SVG `bx` | filled glyph | `#1877f2` (FB blue) | lien-he social pill | BoxIcons |
| 9 | YouTube | inline SVG `bx` | filled glyph | `red` | lien-he social pill | BoxIcons |
| 10 | Graduation cap | inline SVG `heroicons` solid | filled | `#50b448`, 3rem | Team heading (index, ve-chung-toi) | Heroicons |
| 11 | Cube | inline SVG `iconoir` | line 1.5, round | `#50b448`, 2.5rem | trai-he-toan-hoc-pima features | Iconoir |
| 12 | Book | inline SVG `iconoir` | line 1.5, round | `#50b448` | trai-he-toan-hoc-pima features | Iconoir |
| 13 | Code braces | inline SVG `bx` | filled (outline-look) | `#50b448`, 3rem | ve-chung-toi values | BoxIcons |
| 14 | Chat bubbles | inline SVG `bx` | filled (outline-look) | `#50b448` | ve-chung-toi values | BoxIcons |
| 15 | Book open | inline SVG `bx` | filled (outline-look) | `#50b448` | ve-chung-toi values | BoxIcons |
| 16 | Check circle | inline SVG | line 1.5 | `.icon` `#05aa53` (Relume token, off-palette) | 2025 + 2026 camp benefit cards | Relume |
| 17 | Sparkle | inline SVG | line 1.5 | `#05aa53` (off-palette) | 2025 + 2026 camp benefit cards | Relume |
| 18 | Close X (lightbox) | **data-URI SVG** in `VideoLightbox.astro` CSS | filled cross + 40% black shadow | white + black **hard-wired in SVG** | 2025 + 2026 video lightbox | Webflow lightbox CSS |
| 19 | Lime dot separator | `ellipse.svg` 8×8 | filled circle | `#D4E889` **hard-wired in SVG** | TrustBar marquee (5 pages) | Webflow export |
| 20 | Facebook | `fb.png` 24×24 raster | line (rounded), monochrome | `#50b448` baked in | Footer (site), ContactSection, lien-he | Webflow export |
| 21 | Mail | `mail.png` 24×24 | line | `#50b448` baked | Footer (both), ContactSection, lien-he | Webflow export |
| 22 | Map pin | `map-pin.png` 24×24 | line | `#50b448` baked; rendered at **58 px** (site footer) and **31 px** (camp footer) → upscaled, size inconsistent with siblings | Footer, ContactSection, lien-he | Webflow export |
| 23 | Phone | `phone.png` 24×24 | line | `#50b448` baked | Footer (camp) | Webflow export |
| 24 | Book open | `book-open.png` 200×200 | line, thick rounded (Streamline-style) | `#50b448` baked | 2025 + 2026 camp | Webflow export |
| 25 | Oval/heart | `oval-love-two.png` 200×200 | line | `#50b448` baked | 2025 + 2026 camp | Webflow export |
| 26 | Gift | `gift.png` 200×200 | line | `#50b448` baked | 2025 + 2026 camp | Webflow export |
| 27 | Folded map | `map-draw.png` 200×200 | line | `#50b448` baked | 2025 + 2026 camp | Webflow export |
| 28 | Facebook | `facebook.png` 200×200 | line | `#50b448` baked | 2025 + 2026 camp contact | Webflow export |
| 29 | Mail | `mail-1.png` 200×200 | line | `#50b448` baked | 2025 + 2026 camp contact | Webflow export |
| 30 | Phone | `phone-telephone.png` 200×200 | line | `#50b448` baked | 2025 + 2026 camp contact | Webflow export |
| — | Dev-only gap pages | inline SVG: pagination prev/next chevrons (Webflow, stroke 1, currentColor) in `detail-blog-event`; `bx` clock, target, atom, globe (`#2b5314` in 5rem pale-lime 16px-radius tile), user, school (`#50b448`) in `detail-course` | mixed | | not shipped | Webflow/BoxIcons |

- **Distinct icons shipped: 30** (16 inline SVG, 1 font glyph, 1 data-URI SVG, 1 SVG file, 11 PNG). Plus 8 in dev-only gap pages → 38 total in `src/`.
- Formats: 11 raster PNG icons with colour baked in (cannot recolour); 18 vector/glyph.
- 6 icon libraries mixed: BoxIcons, Heroicons, Iconoir, Relume, Webflow font, Streamline-style PNGs (inferred from file names/drawing).
- Same concept drawn several times: Facebook ×3 (`fb.png`, `facebook.png`, `bx`), mail ×2, phone ×2, book ×3 (`book-open.png`, `bx`, `iconoir`), map ×2.
- No accordion chevron (ve-chung-toi accordion uses numbers/titles), no play-button icon (video thumbnail is a photo), slider dots are CSS circles.
- Dead: `webflow.css` `.w-lightbox-left/right/close` data-URI arrows (no Webflow JS creates them); the full `webflow-icons` font is embedded for one glyph. `logo-horizontal.avif` is not referenced anywhere.

### Logos

PiMA logos:

| File | Px | Colour | Variant | Where | vs brand set |
|---|---|---|---|---|---|
| `src/assets/images/logo-horizontal.png` | 2375×811 | `#50b548` (≈ `#50b448`) | horizontal (symbol + wordmark) | Nav (`Nav.astro`, height 2.5rem, white bg); 2025 + 2026 camp header (width 139, white bg); og:image fallback (`BaseLayout`, 1200 px PNG, transparent) on pages without `hero` (e.g. lien-he) | **Same artwork** as `pima-logo-horizontal-green.png` (2048×699): alpha mask differs on 0.03% of pixels after scaling; larger export |
| `src/assets/images/logo-1-green.svg` | viewBox 1100×1463 (ratio 0.752) | `#50b448` | stacked, vector (wordmark as paths) | Site footer (width 96 / height 8rem, bg `#3b3b3b`) | Same design as `pima-logo-stacked-green.png` (950×1287, ratio 0.738), different file: vector, extra margin, and a leftover Illustrator "back" frame (`stroke #ffffff`, opacity .5) that draws a faint white box around the symbol on the dark footer |
| `src/assets/images/logo-1.avif` | 149×172 (ratio 0.866) | green | stacked, raster | Camp footer (2025/2026, width 91, `densities [1,2]` but source < 182 px) | Same design, low-res export with wide side padding; soft edges |
| `public/favicon.png` | 32×32 | green, aliased (`#13960f`–`#48b944`) | **symbol only** | `<link rel=icon>` all pages | No symbol-only file in brand set; separating symbol from wordmark is listed under "Không được làm" #4 (`03-logo.md`), conventional for favicons though. Visibly blurry |
| `public/webclip.png` | 256×256 | `#4cb648` (≠ `#50b448`) | symbol only | `apple-touch-icon` | Same as above; slightly off-green |
| `src/assets/images/logo-horizontal.avif` | 2375×811 | green | horizontal | **unused** | duplicate of the PNG |

Third-party logos (not detailed): **19 files** in `src/assets/images/` — 11 university mentor logos (`mentor-logos.ts` → `MentorLogos.astro` marquee on 2025/2026 camp pages; same files reused on `ve-chung-toi`), 2 partner logos (`partners.ts` → `Partners.astro`: BioTuring, HCMUS), 5 press logos (`index.astro`: Tuổi Trẻ, Dân Trí, CafeF, Mực Tím, Hoa Học Trò), 1 partner logo in dev-only `detail-course`.

### Distance to the brand

Logos (`~/pima/1/brand/03-logo.md`):
- Only the **green** colour is used. Missing from the site: `darkgreen`, `lime`, `black`, `white` in both horizontal and stacked. Green on white (nav, camp header) and green on `#3b3b3b` (footer, ≈ black) are both allowed pairings.
- No site file is taken from `assets/logo/` (rule 5). Horizontal PNG is the same artwork; stacked exists only as an off-ratio SVG with an artefact and a low-res AVIF; favicon/webclip are symbol-only crops with no brand-set equivalent.
- Two logos per page (header + footer) on every page; the brand note "one logo per page" is a print recommendation, not a web rule.
- og:image fallback is a transparent horizontal PNG: renders on whatever background the platform uses (black on some), no brand background block.

Icons (`~/pima/1/brand/06-graphic-elements.md` § Icon, guideline p. 16: minimal single-line, monochrome, black/white/PiMA Green per background, optionally inside a coloured circle; no multicolour, emoji, 3D):
- **Close to rule**: the 11 PNGs and iconoir/heroicon/bx icons set to `#50b448` (items 5, 7-footer, 10–15, 20–30) are monochrome PiMA Green. The PNGs are the nearest match to the line style on p. 16.
- **Off colour**: hamburger `#09ce65`, camp card icons `#05aa53` (Relume AI-gen tokens), dropdown caret gray `#85888e`, detail-course `#2b5314` (vs Dark Green `#275613`), lien-he social in platform colours (`#1877f2`, `#0a66c2`, `red`) — breaks "primary colours only" and makes the social row multicolour as a set.
- **Off style**: filled glyphs (BoxIcons social/arrow/values, heroicons cap, slider arrows, font caret) vs the rule's line icons; three stroke weights mixed (1, 1.5, thick PNG strokes); six sources mixed.
- **Social icons**: brand shows FB/phone/web/mail as filled glyph **inside a circle** (green circle on black/dark green, black on white, dark green on lime). Site has bare line PNGs (footer/contact), bare 200 px PNGs (camp pages) and brand-coloured glyphs in gray pills (lien-he) — none match.
- **Hard-wired colour**: 11 PNGs (green baked in, cannot follow background), `ellipse.svg` (`#D4E889`), lightbox close (white/black in data URI). Inline SVGs use `currentColor` and are recolourable.
- **Raster quality**: 24 px PNGs stretched to 31/58 px (map pin); no SVG source for any PNG icon.
## Hard-wired markup in tests

How tests get HTML (`scripts/test-lib.mjs`): every markup test reads the **built `dist/`** output. `readBuilt(path)` = raw file text (regex on the HTML string); `serveDist()` = tiny static HTTP server on `dist/` for Playwright tests; `builtHtmlFiles()` walks `dist/`; `mainOf()` = regex slice of `<main[^>]*>…</main>`. `distSkip` skips when `dist/index.html` is absent, so a refactor must be checked after `npm run build`, or the tests silently skip. No dev server. Two tests parse source directly: `img-aspect-ratio` (`src/**/*.astro` + `src/styles/*.css`) and `content-gap` (`src/gap-pages`, `src/pages`, imports under `src/`). `contact-form` routes `dist/` through Playwright interception itself.

Kinds: (a) Webflow/Client-First utility class, (b) section-specific Webflow/Relume class, (c) Webflow runtime class (`w-*`, `w--*`), (d) element id, (e) data-attr/ARIA/semantic tag structure (survives a class rename), (f) CSS file content.

No test references a `w-node-…` id, `padding-global`, `container-*`, `max-width-*` or `w-layout-*`. The only `heading-style-*` / `text-style-*` hit is one assertion in `chi-tiet-trai-he`.

### Summary

| File | What it tests | Class-coupled assertions | Kinds |
|---|---|---|---|
| test-lib.mjs | helpers: read/serve `dist/` | 0 (`<main[^>]*>` regex) | e |
| shots-lib.mjs | screenshot page table, URL safety | 0 | – |
| animate.test.mjs | unit: timeline dot colour fn | 0 | – |
| animations.test.mjs | fade-up wiring + reduced-motion CSS | 2 + 1 CSS test | b, e, f |
| apps-script.test.mjs | unit: Apps Script `doPost` | 0 | – |
| camp-page.test.mjs | `/trai-he-toan-hoc-pima/` order, nesting, fade-ups, images | 16 | b, d, e |
| camp-year-pages.test.mjs | 2025 + 2026 pages: chrome, fade-ups, marquees, lightbox, images | 5 per page (3 positive, 2 negative), ×2 pages | b, c, e |
| chi-tiet-trai-he.test.mjs | detail page content, gaps hidden, images | 3 positive + 2 tag-structure + 1 negative | a, b, c, e |
| chrome.test.mjs | Nav + Footer markup on home | 5 (nav slice anchor gates 3 tests) | b, c, e |
| contact-form.test.mjs | ContactForm in Chromium, mocked endpoint | 2 selectors, used in ~8 tests ×2 variants | c, e |
| content-gap.test.mjs | gap markers/pages/assets absent from build | 0 | e |
| current-link.test.mjs | unit: `isCurrent` | 0 | – |
| frame.test.mjs | head meta, one stylesheet, CSS order, js-ready | 1 (CSS order markers) + 1 "exactly one stylesheet" | f, e |
| home.test.mjs | home section order, fade-ups, press slider, eager images | 24 positive + 2 negative | b, c, d, e |
| image-widths.test.mjs | unit: `fluidWidths` | 0 | – |
| img-aspect-ratio.test.mjs | no `aspect-ratio:auto` CSS rule on an img class | 1 sentinel + CSS parser | b, f |
| khoa-hoc.test.mjs | `/khoa-hoc/` order, fade-up, gap hidden, images | 4 positive + 1 negative | b, d, e |
| lien-he.test.mjs | social pills fit card (19 widths), contact facts | 4 (3 selectors) | b |
| nav.test.mjs | Nav script: hamburger, dropdown, keyboard, touch, no-JS | all 9 tests; ~7 explicit class asserts + 4 selector constants | b, c, e |
| not-found.test.mjs | 404 page meta, chrome, single h1, button | 3 | a, b, e |
| shots.test.mjs | unit: shots-lib | 0 | – |
| slider-step.test.mjs | unit: slider step math | 0 | – |
| ve-chung-toi.test.mjs | anchors on sections, timeline dots, logos, accordion | 9 | b, d, e |
| video-lightbox.test.mjs | VideoLightbox in Chromium | 0 | e |

### Per-file detail

**animations.test.mjs** (reads `dist/index.html` + its linked CSS)
- `/<div class="nav inverse-nav"[^>]*data-animate="fade-up"/`: (b). Exact class attr, `div` tag, class must precede `data-animate`.
- `/<footer class="footer"[^>]*data-animate="fade-up"/`: (b). Exact class `footer`, class must precede `data-animate`.
- CSS: `html.js-ready [data-animate=fade-up|slide-in-left]` start states only inside `@media (prefers-reduced-motion:no-preference)`; `[data-marquee]{…animation` and `scroll-behavior:smooth` only there: (f). Selectors are data-attr based (e), but the regexes assume minified output (`[data-marquee]{` with no space) and a hand-rolled one-level `@media` parser.

**camp-page.test.mjs** (`dist/trai-he-toan-hoc-pima/index.html`)
- Order + presence: `class="section_camp-header"`, `class="section_camp-intro"`, `class="section_impact"`, `class="section_trust-bar_dark-green"`, `class="section_camp-activity"`, `class="section_partners"`, `class="section_camp-history"`, `class="section_testimonials"`, `class="section_summer-camp"`: (b). Each is an exact whole-attribute match, so adding a second class also breaks it. Plus `id="contact-form"`: (d).
- `class="section_trust-bar_dark-green"` count == 2: (b).
- Nesting: no `</section>` between `class="section_camp-history"` and `id="contact-form"`, and one after: (b) + (e). Asserts that testimonials, the second trust bar, SummerCamp and contact sit inside the camp-history `<section>`.
- Fade-up: `class="section_camp-intro"`, `class="section_camp-activity"`, `class="section_camp-history"` with `data-animate="fade-up"` (either order): (b).
- Survives: `<img` width/alt, `/_astro/` src, no `data-w-id|data-wf-`.

**camp-year-pages.test.mjs** (`trai-he-toan-hoc-2025`, `trai-he-pima-2026`)
- `doesNotMatch /class="nav[ "]/` ("camp chrome has no site nav"): (b), negative. Passes vacuously if `nav` is renamed.
- `/header76_image-list-left[^"]*marquee/`, `/header76_image-list-right[^"]*marquee/`, `/logo3_component[^"]*marquee/`: (b). Relume classes plus a `marquee` class in the same attr.
- `doesNotMatch /w-json/`: (c), negative.
- Survives (e): `data-animate="fade-up"` count (19 / 18), `data-marquee="y"` ×2, `data-marquee="x"` ×1, `data-video-lightbox-open` + `data-video-id`, `<dialog data-video-lightbox`, img attrs, footer text `Công ty Cổ phần`.

**chi-tiet-trai-he.test.mjs**
- `/<h1 class="heading-style-h1 text-style-white">Quy hoạch Tuyến tính- Linear Programming<\/h1>/`: (a). Exact class string.
- `/<h2>Chủ đề<\/h2>/`, `/<h2>Nội dung chương trình<\/h2>/`: (e). Require an `<h2>` with **no attributes**, so adding any class breaks them.
- `<div … class="section_testimonials" … data-animate="fade-up">` (either order): (b), exact attr.
- `class="testimonial18_card"` count == 6: (b), exact attr.
- `!h.includes("w-lightbox")`: (c), negative.
- Survives: `<span…>PiMA</span> academy &gt; …` breadcrumb, gap `>…</h2>` absence, `href="#"` absence, `data-wf-|data-w-id` absence.

**chrome.test.mjs** (`dist/index.html`)
- `between('<div class="nav inverse-nav"', "</nav>")`: (b). The nav slice used by 3 tests. If renamed, `nav` = "" and tests 1–3 fail, except the `doesNotMatch(nav, /Sự kiện/)` half, which passes vacuously.
- `<li class="nav-menu-list-item"` count == 4: (b).
- Current links: `assert.match(a, /w--current/)` and `doesNotMatch(a, /w--current|aria-current/)`: (c). Build-time class from the Nav component.
- `between('<a href="/" class="nav-logo', "</a>")`: (b), and `href` must precede `class`.
- Survives (e): `</nav>` before `<main`, `<footer`…`</footer>` slice, hrefs, `aria-current="page"`, `aria-label`, `<img … srcset 1x/2x width="117" height="40">`, `<h5…>về <span…>PiMA</span></h5>`.

**contact-form.test.mjs** (Playwright, `dist/` via route interception)
- `[data-contact-form] .w-form-done`, `[data-contact-form] .w-form-fail`: (c). Visibility is asserted in almost every test (success, 4 error modes, retry, empty endpoint, validation). `ContactForm.astro`'s script also queries these classes, and `webflow.css` hides them by default.
- Survives (e): `[data-contact-form] form`, `input[type="submit"]`, `[name=name|email|phone|organization|message|website]`, `<textarea name="message">` for variant detection, `getByLabel(...)`, honeypot `closest('[aria-hidden="true"]')` with computed `position:absolute` and ≤1×1 px (depends on CSS behaviour, not class names), ARIA snapshot.

**frame.test.mjs**
- Exactly one `<link rel="stylesheet">` on the home page: (f)/(e). Breaks if CSS is split into several bundles.
- CSS order in that bundle: `@font-face` < `-webkit-text-size-adjust` (normalize) < `.w-inline-block` (webflow.css) < `.footer3_` (pima-website.webflow.css): (f) + (c)/(b) markers. Breaks if `webflow.css`/`.footer3_` rules are removed, renamed or reordered.
- Survives: `<html lang="vi"`, title/meta/canonical/OG, one `<main`, `classList.add("js-ready")`, no `data-wf-|data-w-id`, no third-party host.

**home.test.mjs** (`mainOf(dist/index.html)`)
- Order + presence (13, matched as `${c}"`, so it must be the **last** class in the attr): `section_homepage_hero`, `section_trust-bar_dark-green`, `section_partners`, `section_philosophy`, `section_impact`, `section_programs-overview`, `section_founding-story`, `section_milestone`, `section_team`, `section_testimonials`, `section_summer-camp`, `section_press`, `section_contact-form`: (b).
- `section_trust-bar_dark-green"` count == 2: (b).
- Negative: `section_upcoming-events|Sự kiện sắp tới`, `section_news|Thông tin mới nhất`: (b). Text alternatives keep them meaningful.
- Fade-up: `<div[^>]*class="${c}"[^>]*>` must contain `data-animate="fade-up"` for `section_homepage_hero`, `section_founding-story`, `section_press`, `section_contact-form`: (b), exact attr, `div` tag.
- Press slider: slice from `class="section_press"` to `section_contact-form`; `<div[^>]*class="course-testimonial w-slider"[^>]*>` with `data-autoplay="5000"`, `data-infinite`: (b)+(c)+(e); `testimonial7_slide w-slide` count == 5: (b)+(c); `is-centre-(previous|next)` count == 2: (b) combo class.
- Eager images: one eager `<img>` contains `header26_image`, another `team-image`: (b).
- `href="#programs"` / `id="programs"`: (d). Custom id, survives.
- Survives: img `/_astro/` src + width/height, 2 eager images total, no inline `opacity:0`, no `.html` hrefs.

**img-aspect-ratio.test.mjs** (source parsing, no build)
- Collects classes from literal `class="…"` on `<Image>`/`<img>` in `src/**/*.astro`. Sentinel: `imgClasses.has("header76_image")`: (b). Breaks if renamed.
- Main test: no rule in `src/styles/*.css` with `aspect-ratio:auto` whose last compound targets `img` or one of those classes: (f). Generic, but its regex parser only sees flat rules or rules one level inside `@media`. CSS nesting, `@layer` or `class={…}`/`class:list` would make it miss cases (silent weakening). It is also hard-wired to the `src/styles/` path.

**khoa-hoc.test.mjs**
- Order: `class="section_camp-header"`, `class="section_header64"`, `class="section_trust-bar_dark-green"` (exact attrs, (b)), interleaved with text `>Khóa học</h1>`, intro text, and `id="contact-form"` (d).
- `<header … class="section_header64" … data-animate="fade-up">`: (b) + `<header>` tag (e).
- Negative: `section_programs-overview`: (b). Text `Danh sách các khóa học` and `No items found` back it up.

**lien-he.test.mjs** (Playwright)
- `.contact-social-component` (card rect), `.button-social` (3 pills; rects, hrefs), `.section-contact-info` (innerText): (b). A rename throws on null or locator timeout.
- Survives: no horizontal scroll at 19 widths (CSS behaviour), page title.

**nav.test.mjs** (Playwright, home page)
- Selector constants: `.w-nav-button`, `.w-nav-menu`, `.w-dropdown-toggle`, `.w-dropdown-list`: (c). Used by all 9 tests.
- `/\bw--open\b/` on button class (×2), toggle class, list class: (c).
- `.w-nav-overlay [data-nav-menu-open]` count == 1: (c)+(e).
- `.nav-right > .w-nav-menu` count == 1 (menu returned to place): (b)+(c), direct-child nesting.
- `document.activeElement.matches(".w-dropdown-toggle")`: (c).
- Note: the script in `src/components/Nav.astro` itself queries `.w-nav`, `.w-nav-menu`, `.w-nav-button`, `.w-dropdown*`, `.nav-menu-dropdown-list-wrapper`, toggles `w--open` / `w--nav-*-open`, and builds `.w-nav-overlay#w-nav-overlay-0`. Its no-JS CSS uses `.w-dropdown:is(:hover,:focus-within) > .w-dropdown-list`. Renaming means changing the script, the CSS and the test together.
- Survives (e): `aria-expanded`, `main`, `footer`, `a[href="/ve-chung-toi/"]`, `a[href="/khoa-hoc/"]`, focus/href checks, scroll lock.

**not-found.test.mjs**
- `/<div class="nav[ "]/`: (b). `/<footer[^>]*class="footer/`: (b).
- `/<a href="\/" class="button[^"]*"[^>]*>[^<]+<\/a>/`: (a). `button` utility class, and `href` must precede `class`.
- Main extraction uses `/<main>([\s\S]*)<\/main>/`: `<main>` with **no attributes** (e).
- Survives: title, `noindex`, no canonical/og:url, exactly one heading in `<main>` (an `<h1>`), no `<img>`, sitemap, `astro preview` 404.

**ve-chung-toi.test.mjs**
- Anchor id → class (`class="[^"]*\b${cls}\b`): `gioi-thieu`→`section_about-header`, `tam-nhin-su-menh`→`about-feature`, `doi-tac-mang-luoi-nhan-tai`→`section_partners`, `cac-tac-dong-tich-cuc`→`section_impact`, `cau-chuyen-nha-sang-lap`→`section_about-timeline`, `ke-hoach-tuong-lai`→`section_about-plan`: (b) for the class; the ids are (d) and survive.
- `<div[^>]*class="timeline1_circle"[^>]*>` count == 6, each with `data-timeline-dot`: (b)+(e).
- `class="logo3_list"` with `data-animate="slide-in-left"` (either order): (b).
- `/<div class="layout351_accordion[^"]*" data-accordion-panel/g` count == 3: (b). `class` must be the first attribute, immediately followed by `data-accordion-panel`.
- Survives: footer `href="/ve-chung-toi/#…"`, img attrs, no third-party/Webflow attrs.

**video-lightbox.test.mjs, content-gap, apps-script, animate, current-link, image-widths, slider-step, shots**: no class coupling. They use `data-video-lightbox(-open)`, `dialog`, `aria-label`/`alt`, `data-content-gap`, `CONTENT GAP`, or pure functions.

### Silent weakening on rename
These negative assertions pass vacuously once the class disappears: `class="nav[ "]` absent (camp-year-pages); `section_upcoming-events`, `section_news` (home); `section_programs-overview` (khoa-hoc); `w-lightbox` (chi-tiet); `w-json` (camp-year-pages); and in chrome `doesNotMatch(nav, …)` on an empty slice. `img-aspect-ratio` also goes blind to new CSS syntax (nesting, `@layer`) and to dynamic `class` bindings.

### What survives a class rename
Everything keyed on data attributes (`data-animate`, `data-marquee`, `data-contact-form`, `data-video-lightbox(-open)`, `data-timeline-dot`, `data-accordion-panel`, `data-nav-menu-open`, `data-content-gap`), ARIA (`aria-expanded`, `aria-current`, `aria-label`, `aria-hidden`, roles, `getByLabel`), form `name`/`type` attributes, custom ids (`contact-form`, `programs`, the six `/ve-chung-toi/#…` anchors), hrefs, text content, `<img>` attributes, meta/head tags, and unit tests of `src/lib/*`. It breaks if a rename lands without test updates: every section-order/presence check (home, camp-page, khoa-hoc), the nav and contact-form browser tests (Webflow runtime `w-*` classes shared with the component scripts), the chrome nav slice, the lien-he selectors, ve-chung-toi anchor→class mapping, and `frame`'s single-bundle CSS order check (`.w-inline-block`, `.footer3_`). Several checks also break on changes that are not renames: adding a second class (exact `class="X"` matches; home needs the section class last), reordering attributes (`<a href="/" class="…">`, `<div class="layout351_accordion…" data-accordion-panel`, `class` before `data-animate` in animations), adding attributes to `<h2>`/`<main>`, or splitting the CSS bundle.
