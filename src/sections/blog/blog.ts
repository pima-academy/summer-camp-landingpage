// The published blog posts (spec #110), read by the blog pages: src/pages/blog/index.astro lists
// them, src/pages/blog/[slug].astro gives each a page. A draft (`draft: true`) is left out of both,
// so it has no page and is not in the sitemap. The collection is defined in src/content.config.ts.
import { getCollection, type CollectionEntry } from "astro:content";
import { summaryOf } from "./post-text";

export type Post = CollectionEntry<"blog">;

/** Every non-draft post, newest first (posts of one day by slug). `id` is the slug. */
export async function publishedPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}

/** A post's URL. */
export const postHref = (post: Post) => `/blog/${post.id}/`;

/** A post's summary (its card on /blog/, its page's meta description): see `summaryOf`. */
export const postSummary = (post: Post) => summaryOf({ description: post.data.description, body: post.body });
