# Astro for the pimavn.com rebuild

pimavn.com is rebuilt from its Webflow static export on Astro 7, built with npm on Node 24 LTS and deployed to GitHub Pages. Astro's component syntax is a superset of HTML, so Webflow pages move in close to verbatim and are then split into components. It ships no client-side JS by default, and it covers image optimisation, sitemap and the GitHub Pages deploy with official tooling. It is also a framework AI agents know well, which matters because all development is code-only, by a non-front-end developer working mostly through agents. The comparison behind this is on the throwaway branch `research/framework-comparison` (`docs/research/framework-comparison.md`).

## Considered Options

- **Eleventy (now "Build Awesome")**: also zero JS, and its image plugin optimises pasted `<img>` tags without rewriting them. Rejected for weaker component structure, no official sitemap, a much smaller ecosystem, and a rebrand plus v4 major in progress.
- **Next.js static export**: rejected because a hello-world page ships about 570 KB of JS (more than today's `webflow.js`), image optimisation does not work on static export, and every page needs a JSX rewrite.
- **Vite + React SPA**: rejected because pages are empty HTML until JS runs (weakest SEO) and there is no built-in image or sitemap support.

## Consequences

- `astro` is declared with npm's default caret range and held exact by the committed `package-lock.json`; CI installs with `npm ci`. No dependency-update bot. Upgrades happen when there is a reason, and each Astro major (about yearly) is its own issue following Astro's upgrade guide.
- Node 24 LTS is pinned for local and CI alike (`.nvmrc`, `engines`); it is also `withastro/action`'s default.
- Pasted `<img>` tags are not optimised until rewritten to Astro's `<Image>`.
