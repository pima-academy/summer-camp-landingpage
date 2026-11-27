// The text a blog post shows outside its own page: the card summary on /blog/ and the date in
// dd/mm/yyyy (PostGrid, PostHeader). Plain, erasable TypeScript so `node --test` can import it
// (scripts/blog.test.mjs).

/** The longest summary, in characters, before it is cut at a word and ends in "…". */
const SUMMARY_LENGTH = 180;

/**
 * The card summary of a post, as plain text: its `description`, else the Markdown before
 * `<!--more-->`, else its first paragraph with text (headings and images skipped). Markup is
 * stripped (emphasis, links to their text, images, HTML tags and entities) and formulas read as
 * plain text (`$\alpha \approx 0.85$` → "α ≈ 0.85").
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

/** Markdown to plain text, enough for a summary: one line, markup dropped, formulas as text. */
function plainText(markdown: string): string {
  // Formulas are set aside first, so the markup pass leaves their `_` and `*` alone.
  const formulas: string[] = [];
  const text = markdown
    .replace(/\$\$([^$]+)\$\$|\$([^$]+)\$/g, (_, display, inline) => `\u0000${formulas.push(formulaText(display ?? inline)) - 1}\u0000`)
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
    .replace(/&quot;/g, '"');
  return text
    .replace(/\u0000(\d+)\u0000/g, (_, i) => formulas[Number(i)])
    .replace(/\s+/g, " ")
    .trim();
}

// TeX commands a summary shows as their symbol; any other command shows its name.
const TEX_SYMBOLS: Record<string, string> = {
  dots: "…", ldots: "…", cdots: "⋯", alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε",
  theta: "θ", lambda: "λ", mu: "μ", pi: "π", sigma: "σ", phi: "φ", omega: "ω", Gamma: "Γ",
  Delta: "Δ", Sigma: "Σ", Omega: "Ω", approx: "≈", le: "≤", leq: "≤", ge: "≥", geq: "≥",
  neq: "≠", ne: "≠", times: "×", cdot: "·", infty: "∞", rightarrow: "→", to: "→", in: "∈",
  sum: "∑", vert: "|", mid: "|",
};

/** A TeX formula as plain text: `\{ \}` as braces, known commands as symbols, grouping braces dropped. */
function formulaText(tex: string): string {
  return tex
    .replace(/\\\{/g, "\u0001")
    .replace(/\\\}/g, "\u0002")
    .replace(/\\([A-Za-z]+)/g, (_, name) => TEX_SYMBOLS[name] ?? (/^(mathrm|text|mathbf|mathit|left|right)$/.test(name) ? "" : name))
    .replace(/\\[,;:! ]/g, " ")
    .replace(/[{}]/g, "")
    .replace(/\u0001/g, "{")
    .replace(/\u0002/g, "}")
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

/** A post date as yyyy-mm-dd, for `<time datetime>`. */
export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);
