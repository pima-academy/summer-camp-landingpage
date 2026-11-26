# Keep the Webflow CSS and class names

The rebuild carries the old site's stylesheets (`normalize.css`, `webflow.css`, `pima-website.webflow.css`) over as global CSS, with dead rules pruned once in the repo, and keeps every class name, including the Webflow component classes (`w-nav`, `w-dropdown`, `w-slider`, …) and the state classes `webflow.js` used to toggle (`w--open`, `w--current`, `w-active`, …). Small vanilla scripts replace `webflow.js` and set those same state classes, so the CSS stays untouched. Rewriting the styles would mean rebuilding the look rule by rule with no visible gain, and every slip would be a redesign; keeping them makes "keep the design" close to free. A reader seeing `w--open` in a site with no Webflow should know it is deliberate.

## Considered Options

- **Scoped `<style>` per Astro component**: rejected; a hand rewrite of about 1,000 live rules, with a high risk of drift.
- **Tailwind**: rejected for the same reason, plus every page's markup would be rewritten.
- **Splitting the old CSS per component**: deferred; bundling changes cascade order, which causes drift that is hard to spot.

## Consequences

- The old CSS stays global, loaded in the old order: normalize, webflow, site. Edits to existing rules happen in place.
- New CSS goes into scoped `<style>` in the new component (lightbox, 404, form states), or into a global `animations.css` for the decorative animations.
- Pruning runs once and is committed, not run as a build step. It must safelist the state classes the scripts add.
