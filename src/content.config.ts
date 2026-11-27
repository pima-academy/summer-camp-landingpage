// Content collections (ADR 0007). `blog`: one blog post per Markdown file in src/content/blog/,
// either `<slug>/index.md` with its images next to it or `<slug>.md`; the slug (the folder or file
// name) is the post's URL, /blog/<slug>/. The author guide, src/content/blog/README.md, is not a
// post. A front matter field missing or of the wrong type fails the build.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: ["*.md", "*/index.md", "!README.md"] }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      author: z.string().optional(),
      /** An image next to the post, e.g. `./cover.jpg`. */
      cover: image().optional(),
      /** The card's summary; without it, the text before `<!--more-->` or the first paragraph. */
      description: z.string().optional(),
      /** `true` keeps the post off the site: no page, not listed, not in the sitemap. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
