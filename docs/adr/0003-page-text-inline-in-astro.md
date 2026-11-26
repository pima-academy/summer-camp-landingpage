---
status: superseded by ADR-0005
---

# Page text stays inline in the `.astro` pages

The rebuild has no CMS or admin UI, and content is edited in the repo's files. That does not mean Markdown or JSON: each page's Vietnamese text stays inline in its `.astro` file, next to the markup pasted from the old site. Moving the text into content files would turn every section into a template that reads data. On a marketing site where almost every section is a one-off, that means rewriting most of the markup, and each slip in the rewrite makes the rebuild drift from the old site. Inline text keeps the new pages close to the old HTML, which is what makes "keep the design" cheap to check.

## Considered Options

- **All text in Markdown/JSON, `.astro` as templates only**: rejected for the rewrite cost and drift risk above.
- **One template for the yearly summer camp pages, with one data file per year**: deferred to the effort that builds the 2027 page. It is a new feature, and the 2025 and 2026 pages differ in structure (two camps vs one, different price markup).

## Consequences

- Repeated lists (partner logos, testimonials, camp mentors) are typed arrays in a `.ts` file next to their component. Their images are `import`ed, so the build still checks them.
- Site-wide facts (phone, email, address, social URLs, nav and footer links) live in one `src/data/site.ts`.
- Content collections are reserved for content that does not exist yet (blog, courses, team).
