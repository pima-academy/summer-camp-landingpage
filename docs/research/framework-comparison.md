# Static-site framework comparison for rebuilding pimavn.com

Research for issue #2 (map: #1). Checked 2026-11-26. The pick itself is made in the follow-up grilling ticket; this file is input to it.

## TL;DR

- **Recommendation: Astro.** Its component files are plain HTML with a small header, so the Webflow markup moves over close to verbatim. It ships **zero JavaScript** unless you ask for it. It has built-in image optimisation, an official sitemap integration, Markdown/JSON content with schema checks, an official GitHub Pages action, and a docs MCP server for AI agents.
- **Runner-up: Eleventy (now branded "Build Awesome").** It also ships zero JS and has the best "paste HTML as-is" image story. It loses on component ergonomics, agent familiarity, the missing official sitemap, and a project in the middle of a rebrand and a v4 major.
- **Not recommended:** Next.js static export (heaviest JS of all candidates, image optimisation is off on GitHub Pages, every HTML page must be rewritten as JSX). Vite + React SPA (pages are empty HTML until JavaScript runs, so SEO and per-page meta are the weakest; React's own docs say this route means building your own framework).

## Context that drives the comparison

Measured in this repo's `site/` on 2026-11-26:

- 15 HTML pages, 14,208 lines. Webflow widgets that depend on `webflow.js` today: navbar (`w-nav`), dropdowns, sliders (`w-slider`), tabs (`w-tabs`), lightbox, forms (`w-form`), plus 142 Webflow Interactions elements (`data-w-id`) and 65 inline `style="..."` attributes (mostly the initial states of interactions, e.g. `opacity:0; transform:translate3d(0, 50px, 0)`).
- JS shipped today on `index.html`: `webflow.js` (268,479 B, 66,865 B gzipped) + jQuery 3.5.1 from a CDN + WebFont loader + a Finsweet config script.
- `site/images`: 18 MB, 186 files. 68 of them are Webflow's own pre-generated `-p-NNN` size variants, referenced from 52 `srcset` attributes. Originals go up to 3.1 MB (`Lớp-học.jpg`).
- GitHub Pages settings (`gh api repos/pima-academy/summer-camp-landingpage/pages`): `build_type: workflow`, `cname: pimavn.com`, `https_enforced: false`. The site is served at the domain root, so no framework needs a `base` path prefix.

Whatever framework is chosen, replacing `webflow.js` (nav, sliders, tabs, lightbox, interactions) and the Webflow form endpoint is work that has to be done anyway. The framework only changes *how* that JS is written and how much runtime comes with it.

## Current versions (npm registry, 2026-11-26)

| Package | Latest | Released | Node required | Weekly downloads |
|---|---|---|---|---|
| `astro` | 7.4.13 | 2026-11-18 | `>=22.23.4` | 12.5 M |
| `next` | 16.4.6 | 2026-11-09 | `>=20.9.0` | 94.7 M |
| `vite` (+ `react` 19.3.1) | 8.3.8 | 2026-11-11 | `^20.19.0 \|\| >=22.12.0` | 285 M |
| `@11ty/eleventy` | 3.1.8 (canary 4.0.0-alpha.12) | 2026-11-03 | `>=18` | 0.27 M |

Source: `https://registry.npmjs.org/<pkg>/latest`, `https://api.npmjs.org/downloads/point/last-week/<pkg>`. Downloads are a rough proxy for ecosystem size and for how much code AI agents have seen; Vite's number includes every tool built on it (Astro itself runs on Vite 8).

Note: this machine has Node v22.18.0, which **Astro 7 refuses to run on** (`Node.js v22.18.0 is not supported by Astro! ... ">=22.23.4"`, observed). CI is unaffected: `withastro/action` defaults to Node 24 (`action.yml`, `node-version` default `"24"`). Locally, Node needs an upgrade.

## Measured: JS shipped by a one-page "hello world"

Same page in each tool (an `<h1>` and a `<p>`, no interactivity), built with default settings on 2026-11-26:

| Tool | HTML contains the text? | JS files loaded by the page | JS size (raw / gzip -9) |
|---|---|---|---|
| Astro 7.4.13 | yes | 0 | 0 |
| Eleventy 3.1.8 | yes | 0 | 0 |
| Vite 8.3 + React 19.3 SPA | **no** (`<body>` holds an empty root `<div>`) | 1 | 219,636 B / 67,700 B |
| Next.js 16.4.6 `output: 'export'` | yes | 6 | 570,131 B / ~171,561 B |
| *Today's Webflow page, for scale* | yes | 4 | `webflow.js` alone 268,479 B / 66,865 B, plus jQuery |

So a blank Next.js page ships about **twice the raw JS of `webflow.js`** before a single slider or menu is added. Astro and Eleventy start at zero and only ship the scripts you write.

## Criteria by candidate

### 1. Static files on GitHub Pages via Actions, custom domain

- **GitHub's rule for the domain:** "If you are publishing from a custom GitHub Actions workflow, no `CNAME` file is created, … any existing `CNAME` file is ignored and is not required." ([GitHub Docs: managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)). The domain is already set in repo settings, so it carries over for every candidate. Astro's guide still tells you to add `public/CNAME` ([Astro: deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)); per GitHub that file is harmless but unnecessary.
- GitHub ships Pages starter workflows for `astro`, `nextjs`, `gatsby`, `hugo`, `jekyll`, `mdbook`, `nuxtjs`, `static` ([actions/starter-workflows/pages](https://github.com/actions/starter-workflows/tree/main/pages)). None for Eleventy or Vite.
- **Astro:** official `withastro/action@v6` (latest v6.1.4, 2026-10-23), "the recommended way to deploy to GitHub Pages" ([Astro docs](https://docs.astro.build/en/guides/deploy/github/)). With a custom domain: "Do not set a value for `base`".
- **Next.js:** `output: 'export'` writes an `out/` folder; Next points to a GitHub Pages template ([Next.js: static exports](https://nextjs.org/docs/app/guides/static-exports)). Unsupported in export: rewrites, redirects, headers, ISR, Server Actions, and "Image Optimization with the default `loader`".
- **Vite:** documented GitHub Pages workflow uploading `./dist` ([Vite: static deploy](https://vite.dev/guide/static-deploy)).
- **Eleventy:** outputs `_site/`; a generic Actions workflow (`npm ci && npx @11ty/eleventy`, upload `_site`) is needed, as there is no official one.

All four pass. Astro is the least work.

### 2. Moving the Webflow HTML/CSS in close to verbatim, then splitting into components

- **Astro:** "Astro component syntax is a superset of HTML." Attributes stay standard kebab-case (`class`, not `className`) and multiple root elements are allowed ([Astro syntax](https://docs.astro.build/en/basics/astro-syntax/)). A Webflow page body can be pasted into `src/pages/<page>.astro` almost unchanged; header/footer get cut out into `.astro` components afterwards. Inline `<script>` blocks are bundled and de-duplicated per page; `is:inline` leaves a script untouched ([Astro: scripts](https://docs.astro.build/en/guides/client-side-scripts/)).
- **Eleventy:** plain `.html` files are valid templates (the hello-world above was a raw `.html` file processed as Liquid). Shared parts become layouts and includes (Nunjucks/Liquid) or WebC components ([Eleventy docs](https://www.11ty.dev/docs/)). CSS/JS/fonts copy through with `addPassthroughCopy` ([Passthrough copy](https://www.11ty.dev/docs/copy/)). The most verbatim option. Its components are less structured (no typed props, several template languages to choose from).
- **Next.js and Vite + React:** markup must become JSX. React's own rules: close every tag, camelCase attributes, `class` becomes `className`, wrap in a single root, and "We recommend using a converter" ([React: writing markup with JSX](https://react.dev/learn/writing-markup-with-jsx)). In this site that touches all 14k lines, and the 65 inline `style` strings must become JS objects. It is doable with a converter, but every page is a rewrite, and visual drift is more likely.

### 3. Little or no client-side JS by default

- **Astro:** renders components to HTML/CSS, "stripping out all client-side JavaScript automatically". JS is opt-in per component through `client:*` directives ([Astro islands](https://docs.astro.build/en/concepts/islands/)). Measured 0 B above.
- **Eleventy:** ships nothing it was not given. Measured 0 B.
- **Next.js:** statically exported pages still load the React runtime and router (measured 570 KB raw). Static generation avoids *some* JS per route ([Next.js: static exports](https://nextjs.org/docs/app/guides/static-exports)), but not the framework baseline.
- **Vite + React SPA:** the whole page is JS (measured 220 KB raw for an empty page). React notes SPAs "can have slower initial load times" ([React: build from scratch](https://react.dev/learn/build-a-react-app-from-scratch)).

### 4. Built-in image optimisation (18 MB of images)

- **Astro:** built in. `<Image />`/`<Picture />` and Markdown images are processed with Sharp at build time for static pages; `layout` generates `srcset`/`sizes` automatically. Only images under `src/` are optimised; `public/` "are always served or copied into the build folder as-is" ([Astro: images](https://docs.astro.build/en/guides/images/)). Migration cost: each `<img src="images/x.jpg" srcset="...">` becomes `<Image src={x} ... />` with an import. The 68 Webflow `-p-NNN` variants can be deleted and regenerated from the originals.
- **Eleventy:** official `@11ty/eleventy-img` (v7.1.1). Its HTML Transform mode rewrites "*any* `<img>` or `<picture>` tags in HTML files as a post-processing step", "compatible with all template syntax"; default formats `webp` + `jpeg` ([Eleventy Image](https://www.11ty.dev/docs/plugins/image/)). This is the best fit for pasted-in HTML: no per-tag rewriting.
- **Next.js:** `next/image` optimisation with the default loader is **not supported** in static export ([Next.js: static exports](https://nextjs.org/docs/app/guides/static-exports)). GitHub's own Next.js Pages workflow sets `static_site_generator: next`, which disables it ("disable server side image optimization", [starter workflow](https://github.com/actions/starter-workflows/blob/main/pages/nextjs.yml)). The options are a paid image CDN through a custom loader, or a third-party build-time plugin.
- **Vite + React:** nothing built in. Needs a third-party Vite plugin.

### 5. Ease for a non-front-end developer working through AI agents

- **Astro:** one file type close to HTML. One way to do pages (files in `src/pages/`), content, images and scripts, all documented. Agent support: official Astro Docs MCP server (`claude mcp add --transport http astro-docs https://mcp.docs.astro.build/mcp`), and `astro dev` auto-backgrounds itself when it detects an AI agent ([Astro: build with AI](https://docs.astro.build/en/guides/build-with-ai/)). Stewardship: the Astro company joined Cloudflare on 2026-01-16; Astro stays MIT-licensed and keeps non-Cloudflare deploy targets ([Astro blog](https://astro.build/blog/joining-cloudflare/), [Cloudflare press release](https://www.cloudflare.com/press/press-releases/2026/cloudflare-acquires-astro-to-accelerate-the-future-of-high-performance-web-development/)). Release pace is fast (7.0 on 2026-06-22, then 7.1 to 7.4 monthly, per [astro.build/blog](https://astro.build/blog/)), so expect a major version roughly yearly.
- **Next.js:** the most popular, so agents know it best. But it is a full-stack framework: most docs and agent habits assume a server (Server Actions, middleware, ISR, default image loader) and fail under `output: 'export'`. That is a trap for someone who cannot tell which advice applies. Has `llms.txt` ([nextjs.org/docs/llms.txt](https://nextjs.org/docs/llms.txt)).
- **Vite + React SPA:** React's docs warn that this route "is often the same as building your own adhoc framework" and lacks routing, data fetching and rendering patterns out of the box ([React: build from scratch](https://react.dev/learn/build-a-react-app-from-scratch)). That is the opposite of what a non-front-end owner needs.
- **Eleventy:** small and stable, but flexible in ways that make agent output inconsistent: around a dozen template languages ([docs](https://www.11ty.dev/docs/)) and no single convention. Far smaller ecosystem (0.27 M weekly downloads vs Astro 12.5 M). No llms.txt or docs MCP found. Project status: Eleventy joined Font Awesome in 2024 and was renamed "Build Awesome" on 2026-03-03; v4 becomes "Build Awesome v4", still open source, funded by a paid "Build Awesome Pro" ([11ty blog: Eleventy is now Build Awesome](https://www.11ty.dev/blog/build-awesome/)). v4 is still alpha (4.0.0-alpha.12). The project is healthy but in transition, which means a near-term major upgrade and docs/naming churn that confuses agents.

### 6. SEO basics: per-page title/meta, sitemap

- **Astro:** per-page `<head>` is plain HTML in the page or layout. Sitemap: official `@astrojs/sitemap` (`npx astro add sitemap`), needs `site` set, emits `sitemap-index.xml` + `sitemap-0.xml` ([Astro sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)).
- **Next.js:** `metadata` export per page; `app/sitemap.ts` generates `sitemap.xml` ([Next.js sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)). Good.
- **Eleventy:** per-page meta via front matter + layout. **No official sitemap plugin**: the usual approach is a hand-written `sitemap.xml` template looping over `collections.all`, or a community plugin.
- **Vite + React SPA:** React 19 hoists `<title>` into `<head>` ([React: title](https://react.dev/reference/react-dom/components/title)), but only after JS runs in the browser. The shipped HTML has the same empty body and default title on every route (measured). Any crawler or link-preview bot that does not execute JS (unverified for Facebook/Zalo specifically) sees an empty page. Sitemap: none built in. **Weakest.**

### 7. Content as Markdown/JSON in the repo, room for a git-based CMS

- **Astro:** content collections load Markdown/MDX/JSON/YAML/TOML with `glob()`/`file()` loaders and validate them with Zod schemas: "If any file violates its collection schema, Astro will provide a helpful error" ([Astro content collections](https://docs.astro.build/en/guides/content-collections/)). Schema errors at build time are a strong guard-rail when agents edit content.
- **Eleventy:** Markdown and JSON/JS data files are native (`_data/`, front matter). No schema validation built in.
- **Next.js:** no built-in content layer; you read files yourself or add a library.
- **Vite + React:** nothing; import JSON or add a Markdown loader plugin.
- **Git-based CMS later:** because content lives as files on GitHub Pages (no server), the CMS has to be server-free on the site side. Pages CMS edits files through GitHub with a `.pages.yml` config and runs separately from the site ([Pages CMS docs](https://pagescms.org/docs/)). Decap CMS needs an auth server for its GitHub backend, Netlify by default ([Decap GitHub backend](https://decapcms.org/docs/github-backend/)). Keystatic in GitHub mode needs an Astro adapter ("Keystatic needs to run serverside code", [Keystatic + Astro](https://keystatic.com/docs/installation-astro)), so it does not fit pure GitHub Pages. This criterion does not separate the candidates: the CMS choice works off the files, whichever framework reads them.

## Scorecard

| Criterion | Astro | Eleventy | Next.js export | Vite + React SPA |
|---|---|---|---|---|
| GitHub Pages + custom domain | ✅ official action | ✅ hand-written workflow | ✅ starter workflow | ✅ documented |
| Webflow HTML in near-verbatim | ✅ HTML superset | ✅ raw HTML | ❌ JSX rewrite | ❌ JSX rewrite |
| Splitting into components | ✅ `.astro` components with props | ⚠️ includes/macros/WebC | ✅ React | ✅ React |
| Default client JS | ✅ 0 B | ✅ 0 B | ❌ ~570 KB raw | ❌ ~220 KB raw |
| Image optimisation | ✅ built in (needs `<Image>` rewrite) | ✅ official, works on raw `<img>` | ❌ off on static export | ❌ none |
| Agent-friendliness / docs | ✅ docs MCP, one way to do things | ⚠️ small, many template languages, rebrand | ⚠️ popular, but server-first advice | ❌ "build your own framework" |
| SEO title/meta + sitemap | ✅ / ✅ official | ✅ / ⚠️ manual | ✅ / ✅ | ❌ / ❌ |
| Markdown/JSON content | ✅ with schema checks | ✅ native | ⚠️ DIY | ❌ DIY |

## Other frameworks considered

Hugo has a GitHub starter workflow and built-in image processing, but uses Go templates and sits outside the npm ecosystem that the JS replacements for Webflow widgets will live in. It is not clearly better than Astro on any criterion, so it was not evaluated further. Gatsby and Nuxt have GitHub starter workflows but ship a React/Vue runtime like Next.js does (not measured here).

## Recommendation, in plain terms

**Pick Astro.** Each page is still an HTML file. You paste a Webflow page in, it works, and you then cut repeated parts (header, footer, sections) into their own files. Nothing is sent to visitors' browsers except the small scripts written to replace the Webflow menu, sliders and animations. Images get resized and converted automatically once each `<img>` is switched to Astro's `<Image>`. Sitemap and deployment are one official add-on and one official GitHub Action. Content goes in Markdown/JSON files, and the build fails with a clear message when a file has a wrong field, which catches agent mistakes early.

What it costs: Node must be upgraded locally (≥ 22.23.4); `<img>` tags need rewriting to `<Image>` to get optimisation; Astro releases a major version about once a year.

**Runner-up: Eleventy.** Choose it if "zero rewriting of the pasted HTML" matters more than anything else. Its image plugin optimises the pasted `<img>` tags as they are. You give up structured components, an official sitemap, the larger ecosystem agents know well, and stability of name and version for the next while (rebrand to Build Awesome, v4 in alpha).

**Avoid Next.js static export and Vite + React SPA** for this site. Both require rewriting every page into JSX and ship more JavaScript than the Webflow site they replace. Next.js loses its image optimisation on GitHub Pages, and a React SPA hands search engines and link previews an empty page.

## Key trade-offs for the grilling ticket

1. **Verbatim HTML vs component ergonomics:** Eleventy keeps pasted HTML most intact; Astro keeps it nearly intact *and* gives real components.
2. **Image pipeline effort:** Eleventy optimises existing `<img>` tags in place; Astro needs `<img>` → `<Image>` rewrites, giving more control and automatic `srcset`.
3. **JS weight:** Astro/Eleventy start at 0 B; Next.js starts above today's `webflow.js`. This decides between the two groups.
4. **Ecosystem and agent familiarity vs project stability:** Next.js is best known but server-first; Astro is well-known, agent-tooled and Cloudflare-backed with yearly majors; Eleventy is small and mid-rebrand.
5. **Framework-independent work:** replacing `webflow.js` behaviours (nav, dropdowns, sliders, tabs, lightbox, 142 interactions) and the Webflow form endpoint is needed whichever framework wins. Plan it separately.

## Method

- Docs fetched on 2026-11-26 from docs.astro.build, nextjs.org (page `lastUpdated: 2026-08-09`), vite.dev, react.dev, 11ty.dev, docs.github.com, keystatic.com, decapcms.org, pagescms.org; versions from the npm registry; GitHub starter workflows and `withastro/action` read through the GitHub API.
- The hello-world builds were run locally in a scratch directory with exact versions `astro@7.4.13` (on Node 24, since Astro rejects Node 22.18), `next@16.4.6` + `react@19.3.1`, `@11ty/eleventy@3.1.8`, and `create-vite@latest` React template (`vite@^8.3.6`, `react@^19.3.1`). JS sizes are the sum of `.js` files referenced by the built `index.html` (Next.js, 6 script tags) or emitted to `dist/` (Vite); gzip sizes use `gzip -9` on the concatenation.
- Site figures come from `site/` at commit `e277a49`.
