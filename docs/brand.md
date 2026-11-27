# Brand guidelines

How PiMA looks on this site: naming, colour, type, shapes, logo, icons, photos and data graphics. Every rule names its colour, weight, size or radius by token; the values live only in `src/styles/tokens.css`.

## Using these rules

- Colours below are brand palette tokens (`--pima-green`, `--gray-1`, …). Component CSS uses role tokens such as `--color-text`, and each role token points at a palette token in `tokens.css`. When no role token fits, add one there that points at the palette, named by its role.
- Readability decides every conflict: a pair that fails the contrast rule is replaced, whatever another rule says.
- PiMA Green carries the brand. Every page shows it, as a fill (see [PiMA Green](#pima-green)).

## Naming

| Write | Instead of |
|---|---|
| PiMA (lowercase `i`) | PIMA, Pima, P.I.M.A |
| PiMA Academy | Pima academy |
| Trại hè PiMA, in full Trại hè Toán học và Ứng dụng PiMA | "PiMA camp" in Vietnamese text |

Text that CSS uppercases (kickers, the marquee) would turn PiMA into PIMA, so wrap the name in the `BrandName` component there.

## Colour

### Palette

| Token | Role |
|---|---|
| `--pima-green` | PiMA Green, the brand colour. Fills: buttons, kicker rules, timeline, logo, decorative icons |
| `--pima-dark-green` | Dark Green. Headings and big numbers on light backgrounds, dark sections, table headers |
| `--pima-pale-lime` | Pale Lime. Light sections, buttons and accents on Dark Green, table group rows |
| `--black` | Body text, footer background, secondary button |
| `--gray-1` | Secondary text: captions, nav links |
| `--gray-2` | Secondary text on white only |
| `--gray-3` | Text on black only; too light for text on any light background |
| `--gray-4` | Rules and hairlines, chart tracks, footer text on black |
| `--gray-5` | The `surface` section tone, alternate table rows, "other" in charts |
| `--white` | Page background, text on dark backgrounds |

Secondary colours, for charts, tables and infographics only (a category, a metric, an activity type), never for a section, heading, button or other large area: `--secondary-red`, `--secondary-orange`, `--secondary-yellow`, `--secondary-sky-blue`, `--secondary-blue`, `--secondary-pink`, `--secondary-purple`, `--secondary-brown`.

### Contrast

- Every text pair meets WCAG AA: 4.5:1, or 3:1 for large text (24 px and up, or 18.66 px and up at bold).
- An icon that is a control's only label (hamburger, slider arrows, lightbox close, dropdown caret) meets 3:1 against its background.
- Check the ratio of any pair outside the table below before using it. `scripts/contrast.test.mjs` checks every text pair of every aligned page at 390 and 1440 px.

### Text pairs that pass

| Background | Text | Headings and accents |
|---|---|---|
| `--white` | `--black`; `--gray-1` or `--gray-2` for secondary text | `--pima-dark-green` |
| `--gray-5` | `--black`; `--gray-1` | `--pima-dark-green` |
| `--pima-pale-lime` | `--black`; `--gray-1` | `--pima-dark-green` |
| `--pima-green` | `--black` | `--black` |
| `--pima-dark-green` | `--white` | `--pima-pale-lime` |
| `--black` | `--white`; `--gray-4` | `--pima-green`, `--pima-pale-lime` |

### PiMA Green

PiMA Green appears as a fill: buttons, kicker rules, the timeline, the logo, decorative icons, icon circles on black, and the footer's column headings on black. As text it is too light on white, `--gray-5` and Pale Lime, and white text on it is too light as well. So green text on a light background is `--pima-dark-green`, and text on a PiMA Green fill is `--black`.

## Sections, buttons and footer

`Section` takes a `tone`, which sets the background and the passing text colours on it. A section whose background is none of these takes the nearest one. A section never sets its own background, and neither does a card: a card with a fill of its own takes one of the four tones with the `data-tone` attribute (`surface` cards on white, `white` cards on Pale Lime, the founder card on `dark-green`). Every tone declares the full set of text, link, icon and focus roles, so a card reads as its tone wherever it sits (a Pale Lime tag on the dark-green cover keeps black text). Only small marks that are no tone keep a fill of their own, from a role token: the timeline's axis and dots, the marquee's separator dot. `scripts/sections.test.mjs` checks.

| `tone` | Background | Text | Used for |
|---|---|---|---|
| `white` (default) | `--white` | `--black`, headings `--pima-dark-green` | most sections |
| `surface` | `--gray-5` | `--black`, headings `--pima-dark-green` | milestones |
| `pale-lime` | `--pima-pale-lime` | `--black`, headings `--pima-dark-green` | philosophy, testimonials, contact |
| `dark-green` | `--pima-dark-green` | `--white`, accents `--pima-pale-lime` | marquee, founder card |

`Button` takes a `variant`. Every button has `--radius` corners and `--font-weight-bold` text.

| `variant` | Look | On |
|---|---|---|
| `primary` | `--pima-green` fill, `--black` text; `--pima-dark-green` fill, `--white` text on hover | `white`, `surface`, `pale-lime` |
| `secondary` | `--black` fill, `--white` text | `white`, `surface`, `pale-lime` |
| `on-dark` | `--pima-pale-lime` fill, `--black` text | `dark-green` |
| `link` | text with a chevron icon, in the surrounding text colour | any tone |

The footer is a `--black` band: column headings `--pima-green`, text and links `--gray-4`, logo as in [Placement](#placement).

## Typography

- Nunito Sans is the only font. `body` sets it with `--font-family-base` and every element inherits it, so component CSS never sets a font family.
- Five weights, each with a font face in `src/styles/fonts.css` (the browser fakes a weight that has none, so no other weight is used):
  - `--font-weight-regular`: body text, captions.
  - `--font-weight-semibold`: labels, nav links, light emphasis.
  - `--font-weight-bold`: buttons, the marquee, small labels.
  - `--font-weight-extrabold`: h1–h3, kickers, dates and names, strong emphasis.
  - `--font-weight-black`: big numbers, display type.
- Hierarchy comes from size, weight and colour.

| Role | Size | Line height | Weight | Colour |
|---|---|---|---|---|
| h1 | `--font-size-h1` | `--line-height-h1` | `--font-weight-h1` (extrabold) | `--pima-dark-green` |
| h2 | `--font-size-h2` | `--line-height-h2` | `--font-weight-h2` (extrabold) | `--pima-dark-green` |
| h3 | `--font-size-h3` | `--line-height-h3` | `--font-weight-h3` (extrabold) | `--black`, `--white` on dark |
| Body | `--font-size-body` | `--line-height-body` | regular | `--black` |
| Kicker | `--font-size-kicker` | `--line-height-kicker` | extrabold, uppercase, `--letter-spacing-kicker` | `--black`, under a short `--pima-green` rule aligned with the block |
| Big numbers | `--font-size-big-number` | | `--font-weight-black` | `--pima-dark-green` |
| Display (big type that is not a heading level, such as the camp archive page's topic) | `--font-size-display-2` (the topic), or the larger `--font-size-display` (unused so far) | `--line-height-display` | `--font-weight-black`, `--letter-spacing-display` | the text role of its tone (`--white` on the dark-green hero) |
| Dates, names (milestones, testimonials) | `--font-size-body` | | extrabold | `--pima-dark-green` |
| Marquee | `--font-size-marquee` | | bold, uppercase, `--letter-spacing-marquee` | `--white` on `--pima-dark-green` |
| Nav links | | | semibold | `--gray-1` |
| Captions and small text (form fields, tags, the footer credit) | `--font-size-small` | | regular | `--gray-1` for captions |

- Size tokens that change per breakpoint are redeclared in `tokens.css`; a component writes the token once. Headings take the role of their level from base CSS, so a section's `h1`, `h2` or `h3` sets no size or weight of its own. An `h4` takes the h3 role; an `h5` is a bold label at body size. A heading that is not a heading to the eye (a date, a big number, a quote, display type) sets the tokens of its role. Any other size maps to the nearest role.
- Small uppercase lines right above a heading (a tagline, a breadcrumb such as "PiMA academy > giới thiệu") are kickers: use the `Kicker` component. The footer's column headings take the kicker's size, weight and tracking in `--pima-green`, without the rule.
- Headings are in sentence case. Uppercase is for short labels: kickers, the marquee.
- Vietnamese stacks diacritics (Ồ, Ộ, Ẫ). Headings and display type keep a line height of 1.1 or more, so the marks are neither clipped nor touching the line above.
- Figures that line up or change (stats, tables, dates, counters) use `font-variant-numeric: tabular-nums`.

## Spacing

- Every margin, padding, gap and offset used as spacing is a step of the spacing scale: `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-5`, `--space-6`, `--space-8`, `--space-10`, `--space-12`, `--space-16`, `--space-20`, `--space-24`, `--space-28`, `--space-32`. A step's number is its size in 4 px units, so `--space-4` is 16 px. Fewer, regular steps keep the rhythm of the page even.
- A value between two steps takes the nearest one, the larger on a tie. Negative spacing is `calc(-1 * var(--space-32))` and the like.
- `0`, `auto`, percentages (the 5 % page gutter) and layout widths (`max-width` of a column) are not spacing.
- Neither is the size of a thing: a box, a column or a rule takes a size token named for its role (`--size-portrait-small`, `--width-toc-number`, `--border-width-rule-accent`), never a step of the spacing scale. A rule's colour is a border role (`--color-border-rule-accent`), not a background one.
- A section's vertical padding comes from `Section`'s `spacing`; a kicker brings its own margins (`--space-3` above and below, `--space-3` between rule and text); `<Kicker flush>` drops the margins above and below when its parent sets the spacing.
- Letter spacing is a type value: `--letter-spacing-heading` (h1, h2, h4), `--letter-spacing-display`, `--letter-spacing-kicker`, `--letter-spacing-marquee`, `--letter-spacing-tag`.

## Shapes

- One corner radius, `--radius`, for buttons, cards, panels, inputs, tags, menus and every photo and video, portraits and avatars included. Base CSS gives every `img` `--radius`.
- Square corners for full-width bands (sections, the marquee, the footer), rules and dividers (the kicker rule too), chart bars and legend swatches.
- The only other radius token, `--radius-circle`, is for shapes that are not photos: icon circles, the timeline's and the marquee's dots, the slider's dots and arrows.
- Logos (PiMA's, partners', newspapers', universities') are never rounded or cropped: the logo's `img` carries `data-logo`, which base CSS keeps square, and a logo in a fixed box takes `object-fit: contain`.
- `scripts/radius.test.mjs` checks every aligned page: `--radius` or a circle on any rounded element, `--radius` on every photo, square logos.

## Logo

The logo is the PiMA symbol (a snub dodecahedron) with the wordmark "PiMA ACADEMY", in two versions:

- **Horizontal**, symbol left of the wordmark: the default, wherever there is width.
- **Stacked**, symbol above the wordmark: narrow or square slots.

Each comes in five colours. The files are `src/assets/logo/pima-logo-<version>-<colour>.png`, version `horizontal` or `stacked`, colour `green`, `darkgreen`, `lime`, `black` or `white`: transparent, tightly cropped PNGs. Use only these files. The logo's `alt` is "PiMA Academy", or empty when a text label already names the link.

### Colour by background

| Background | Logo colour |
|---|---|
| `--white` | `green` (default), `black` |
| `--black` | `green`, `white` |
| `--pima-green` | `white`, `black` |
| `--pima-dark-green` | `white`, `lime` |
| `--pima-pale-lime` | `darkgreen` |
| `--secondary-blue`, `--secondary-sky-blue`, `--secondary-red`, `--secondary-orange` | `white` |
| `--secondary-yellow` | `black` |

Prefer the green logo; where the background is not green, prefer black or white.

### Placement

| Where | File | Width |
|---|---|---|
| Site nav (white) | `pima-logo-horizontal-green.png` | 132 px |
| Site footer (black) | `pima-logo-stacked-green.png` | 80 px |
| Favicon (32 and 48 px) and `apple-touch-icon` (180 px, on white) | the symbol alone, cropped from `pima-logo-stacked-green.png` | |
| og:image fallback for pages without a hero | 1200 × 630, `pima-logo-horizontal-green.png` centred on white | |

`scripts/make-icons.mjs` makes the favicon, the app icon and the og:image fallback from these files; run it again after a logo file changes.

### Keep the logo intact

- Set the width only; the height follows (`height: auto`). The logo keeps its proportions: no stretching, rotating or skewing. The rule is about the source and the result: the component passes only `width` to Astro's `Image`, which also writes the matching `height` attribute (the file's own aspect ratio, so the browser reserves the space), and base CSS's `height: auto` keeps the drawn logo undistorted. That emitted `height` is intended.
- Use the five colours only, flat: no other colour, gradient, shadow or outline.
- On a photo, place it over a calm, even area or inside a colour block, never over a busy area.
- Keep symbol and wordmark together, and show the wordmark as the image, never retyped as text. The favicon and app icon are the one exception: the symbol alone.
- Leave clear space around it at least the height of the "P" in the wordmark.

## Icons

- Tabler Icons only, as SVG files copied into `src/assets/icons/` (no icon package, MIT licence kept there), except the Facebook glyph: Font Awesome's `facebook-f` (CC BY 4.0, credited in the file), since Tabler's filled one is too heavy. Every icon is drawn by the `Icon` component in `currentColor`. Only the icons in use are in the folder; one icon per concept (one Facebook, one mail, one book …).
- Content icons use Tabler's line set at stroke 1.5 on a 24 px grid and stand bare, without a circle. Contact and social icons use Tabler's filled brand and contact glyphs inside a circle.
- One colour per icon: no multicolour icons, emoji or 3D icons.
- Colour by role:
  - Decorative icon next to text: `--pima-green` on white is allowed (it is not text).
  - Icon that is a control's only label: `--black` or `--pima-dark-green` on light backgrounds, `--pima-green` or `--white` on dark ones (3:1, see [Contrast](#contrast)).
- Circle and glyph pairs:

| Background | Circle | Glyph |
|---|---|---|
| `--black` | `--pima-green` | `--black` |
| `--white` | `--black` | `--white` |
| `--pima-dark-green` | `--pima-pale-lime` | `--pima-dark-green` |
| `--pima-pale-lime` | `--pima-dark-green` | `--pima-pale-lime` |

`<Icon circle>` takes the pair from `--color-icon-circle` and `--color-icon-circle-glyph`: the white pair is the default (also on `--gray-5`), `Section`'s pale-lime and dark-green tones and the footer re-point them. A small separator mark (the marquee's dot) is a CSS shape coloured from a token, not an icon file.

## Photos

- Subjects that fit: classes (lectures, students working, whiteboards full of formulas), activities outside class, portraits of students and mentors teaching or presenting, objects (materials, merch, notebooks), wide shots of rooms and halls, group photos.
- Quality over quantity: one good photo beats a grid of weak ones. Leave out photos that are dark, blurred, shaken, out of focus or without a clear subject.
- Use the photos PiMA supplies; never generate or borrow one.
- Every photo has `--radius` corners and fills its frame with `object-fit: cover`, never stretched. Images go through Astro's `Image`.
- A caption sits right under its photo in `--gray-1`: who, doing what, which camp year.

## Tables

- Header row: `--pima-dark-green` fill, `--white` bold text, left-aligned (numeric columns right-aligned).
- Group rows: `--pima-pale-lime` fill, bold text.
- Data rows: `--white`, separated by `--gray-4` horizontal rules; alternate rows may be `--gray-5`.
- Numeric columns are right-aligned with `tabular-nums`.
- The caption goes under the table: small, `--gray-1`, centred.
- A schedule may colour activity types with secondary colours; its frame stays `--pima-dark-green` or `--pima-green`.

## Charts

- Category colours, in order: `--black`, `--pima-dark-green`, `--pima-green`, `--pima-pale-lime`, `--gray-5` (for "other"). Past five categories, or to single out one point, add `--secondary-orange`, `--secondary-blue`, `--secondary-purple`, `--secondary-red`.
- A single-series bar chart is `--pima-green`. A chart of several metrics gives each metric one secondary colour, with its track a lighter mix of that colour and `--white`.
- Bars run horizontally with the value at the end of the bar, on a thin tick axis. Parts of a whole are one 100 % stacked bar with a legend.
- Light swatches (`--pima-pale-lime`, `--gray-5`) in a legend on white get a thin `--black` border.
- The chart title goes under the chart: small, `--gray-1`, centred.
- Length or area is proportional to the value, and the chart states what the values are based on.
- An org chart puts the top level in `--pima-dark-green` boxes with `--white` text and lower levels in `--pima-pale-lime` boxes or boxes outlined in `--pima-green`, joined by thin lines.

## Stat tiles

A grid of tiles with `--radius` corners, alternating `--pima-green`, `--pima-dark-green` and `--pima-pale-lime` fills. Each tile holds a big number at `--font-weight-black` and a label of one or two lines, in the passing text colour of its fill (see [Text pairs that pass](#text-pairs-that-pass)).

## Timeline

- A thin `--pima-green` axis with `--pima-green` dots for the milestones.
- Each date label is extrabold `--pima-dark-green`, with a short description under it; a topic name in it may be bold italic.
- Photos on a timeline have `--radius` corners and alternate above and below the axis.
