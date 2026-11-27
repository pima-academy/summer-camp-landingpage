// The text a blog post shows outside its own page: the card summary on /blog/ and the date in
// dd/mm/yyyy (PostGrid, PostHeader). Plain, erasable TypeScript so `node --test` can import it
// (scripts/blog.test.mjs).

/** The longest summary, in characters, before it is cut at a word and ends in "…". */
const SUMMARY_LENGTH = 180;

/**
 * The card summary of a post, as plain text: its `description`, else the Markdown before
 * `<!--more-->`, else its first paragraph with text (headings and images skipped). Markup is
 * stripped (emphasis, links to their text, images, HTML tags and entities).
 */
export function summaryOf(post: { description?: string; body?: string }): string {
  if (post.description) return cut(post.description.trim());
  const body = post.body ?? "";
  const more = body.indexOf("<!--more-->");
  const source =
    more >= 0
      ? body.slice(0, more)
      : (body
          .split(/\n\s*\n/)
          .filter((block) => !/^\s*#/.test(block))
          .find((block) => plainText(block)) ?? "");
  return cut(plainText(source));
}

/** Markdown to plain text, enough for a summary: one line, markup dropped. */
function plainText(markdown: string): string {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/^\s{0,3}(#{1,6}\s+|>\s?|[-*+]\s+|\d+[.)]\s+)/gm, "")
    .replace(/(\*\*|__|\*|_|`)(\S(?:.*?\S)?)\1/g, "$2")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Cuts `text` at the last word that fits SUMMARY_LENGTH, with an ellipsis. */
function cut(text: string): string {
  if (text.length <= SUMMARY_LENGTH) return text;
  const head = text.slice(0, SUMMARY_LENGTH + 1);
  const end = head.lastIndexOf(" ");
  return `${(end > 0 ? head.slice(0, end) : text.slice(0, SUMMARY_LENGTH)).replace(/[\s.,;:!?…-]+$/, "")}…`;
}

/** A post date as dd/mm/yyyy. Dates from front matter are UTC midnight, so UTC is read. */
export function postDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
}
