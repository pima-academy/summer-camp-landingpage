# src/camp: frozen

**Frozen: do not edit anything in this folder.** It is deleted together with the 2025/2026 camp pages' own redesign.

The two camp pages, `src/pages/trai-he-toan-hoc-2025.astro` and `src/pages/trai-he-pima-2026.astro`, keep the look they had when they were frozen (#60, spec #56). They are neither refactored nor aligned with the brand, and their `npm run shots` diff stays at zero. The camp page files are frozen too.

What is here:

- `CampLayout.astro`: the camp pages' layout. Shared `<head>` from `src/layouts/Head.astro`, no Nav, `CampFooter`, and only the frozen CSS.
- `styles/camp.css`: the CSS entry, importing copies of the site's `fonts.css`, `normalize.css`, `webflow.css`, `pima-website.webflow.css` and `animations.css`. Literal values, no tokens. It declares `--camp-frozen` so `scripts/camp-freeze.test.mjs` can tell its bundle apart.
- `CampFooter.astro`: the camp footer (formerly `Footer variant="camp"`).
- Camp-only components and data: `CampHeaderPhotos`, `CampMentors`, `CampTeamPhoto`, `MentorLogos`, `VideoLightbox` and their `.ts` files, `w-node.ts`.
- Frozen copies of site code, so refactoring the originals never reaches the camp pages: `Marquee.astro`, `animate.ts`, `image-widths.ts`.

Imports from outside this folder are limited to `src/assets/images/`, `src/data/site.ts`, `src/components/BrandName.astro` and `src/layouts/Head.astro`.
