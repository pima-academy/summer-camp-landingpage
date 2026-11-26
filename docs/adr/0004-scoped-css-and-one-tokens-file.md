# Scoped CSS per component and one tokens file, replacing the Webflow CSS

ADR 0002 kept the Webflow stylesheets and class names because that made "keep the design" free. Brand alignment changes the design, so that reason is gone. What remains is a cost: an agent changing one section has to trace a 5,800-line global file, utility classes (42 % of class uses), `#w-node-…` grid ids and 300 `--ai-gen-…` variables. The site moves to plain CSS scoped to the file that owns the markup, with every design value in one `src/styles/tokens.css`. An agent then reads one file to change a section, and brand alignment becomes mostly a change of token values. The facts behind this are in the CSS inventory on the throwaway branch `research/css-inventory` (`research/css-inventory/report.md`).

## Decision

- **Styles live with their markup.** Each `.astro` component or page holds the style of the markup it renders in its own `<style>`. Global CSS is only `tokens.css`, a small base (reset, default typography for `body`, `h1`–`h6`, `a`), the font faces and `animations.css`. There are no utility classes. Class names only need to make sense inside their file (`.numbers`, not `impact_numbers`).
- **`src/styles/tokens.css` is the only place design values live**, as custom properties named by role, not by colour: `--color-text`, `--color-link`, `--font-weight-heading`, `--font-size-h2`, `--radius-card`. Font sizes that change per breakpoint are redeclared inside media queries in `tokens.css`, so a component writes `var(--font-size-h2)` and never knows about breakpoints.
- **Two phases.** In the refactor, tokens carry today's values exactly, including off-brand ones, and two values that look alike stay two tokens. Spacing stays literal, because 64 mostly irregular values do not make a meaningful scale. In brand alignment, token values move to the brand, the brand palette (`--pima-green`, …) is added for the roles to point at, near-duplicates merge, and a spacing scale replaces the literals. Spacing is the one part of alignment that edits component CSS.
- **Breakpoints** stay desktop-first `max-width` at 991, 767 and 479 px. They are written as literals, because custom properties do not work in `@media`, and documented in `tokens.css`. The few other media queries the old CSS has are kept during the refactor and marked as exceptions in the code.
- **State is an ARIA or data attribute**, not a class: `aria-expanded` for menus and dropdowns, `aria-current="page"` for the current link, `aria-selected` or `data-active` for slider dots. CSS selects on the attribute, so the scripts keep one thing in sync.
- **Guardrail**: a test in `npm test` scans `src/**/*.{astro,css}`, except `tokens.css`, the old Webflow files while they exist, and the camp pages' frozen copy (see **Exception: camp pages**). It fails on a literal colour (other than `transparent` and `currentColor`), on any `font-family`, on `font-weight`, `font-size`, `line-height`, `border-radius` or `box-shadow` not given through `var(--…)`, on an `@media` outside the three breakpoints and the marked exceptions, on an uncommented `:global()`, and on design values in inline `style` (`--marquee-duration` is allowed). Spacing joins the check when the scale lands. The repo's `CLAUDE.md` says that every design value comes from `tokens.css`.

## Migration

The refactor aims to change nothing visible. Small drift is acceptable, since a redesign follows; broken behaviour is not. Each PR compares screenshots of its base branch and its head with `npm run shots` to catch large regressions, and `npm test` runs in CI.

1. **Tokens in place**: create `tokens.css` from the inventory, replace every colour, weight, size, line height, radius and shadow in `pima-website.webflow.css` and `webflow.css` with `var(--…)`, and delete the `--ai-gen-…` and `--_color---…` variables.
2. **One part per PR**: the shared components first (Nav, Footer, ContactForm, Impact…, since one change covers many pages), then each page's inline sections, then the gap pages. Migrating a part removes its old classes and `w-node` ids from the markup, so the old global rules stop matching it and no specificity contest arises. Old rules that no longer match anything are deleted in the same PR, and tests that asserted the old class names are changed in it too.
3. **Base last**: when the old files hold only reset and element typography, that becomes the base and `normalize.css`, `webflow.css` and `pima-website.webflow.css` are deleted. `global.css` keeps its import order until then.

At the end nothing Webflow remains outside the camp pages: no utility classes, no `#w-node` rules (`src/lib/w-node.ts` goes), no `--ai-gen-…` variables, no Relume or auto-generated class names, and the `w-nav`/`w-dropdown`/`w-form`/`w-slider` runtime rules live in their components.

### Exception: camp pages

The 2025 and 2026 camp pages are left out of both phases: they will be redesigned on their own, so refactoring them would be thrown away. Before step 1 they switch to a frozen copy of the old stylesheets (today's literal values, loaded only by them), so token changes never reach them, and they keep their own copy of the camp footer, old logo and PNG icons. The copy, its assets and the `w-node` helper they use are deleted with their redesign, not by this migration.

## Considered Options

- **Tailwind**: rejected. Every page's markup would be rewritten, the long class strings are hard to read for a non-front-end maintainer, and the refactor would fill the markup with arbitrary values like `p-[14.9px]`.
- **Keep global CSS, split per section**: rejected. An agent still has to guess which rules reach an element, and splitting changes cascade order.
- **Rewrite everything in one branch**: rejected. The diff is too large to check and a drift is hard to locate.
- **Write the new base alongside the old CSS from the start**: rejected. Two sets of rules for `h2` would drift.
