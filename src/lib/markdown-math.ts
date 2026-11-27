// Formulas in blog posts (spec #110, #112): the remark and rehype plugins that typeset `$…$`
// (inline) and `$$…$$` (display) with KaTeX at build time, for the unified Markdown processor in
// astro.config.mjs. Plain, erasable TypeScript so `node --test` can import it
// (scripts/markdown-math.test.mjs).
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import type { VFile } from "vfile";

// The few mdast / hast shapes the plugins touch.
interface Node {
  type: string;
  value?: string;
  children?: Node[];
  position?: { start: { offset?: number } };
  data?: Record<string, unknown>;
}

/**
 * A `$$…$$` formula alone on its line(s) is a display formula, as on the Jekyll site and in the
 * author guide. remark-math reads it as inline maths unless the `$$` fences sit on lines of
 * their own, so a paragraph that is only one `$$…$$` becomes a display (`math`) node, the same
 * node remark-math makes for a fenced block. A single-`$` formula alone in its paragraph stays
 * inline.
 */
export function remarkDisplayMathLines() {
  return (tree: Node, file: VFile) => {
    const source = String(file.value);
    const visit = (node: Node) => {
      node.children?.forEach((child, i, siblings) => {
        const only = child.type === "paragraph" && child.children?.length === 1 ? child.children[0] : undefined;
        const start = only?.position?.start.offset;
        if (only?.type === "inlineMath" && start !== undefined && source.startsWith("$$", start)) {
          siblings[i] = { ...displayMath(only.value ?? ""), position: child.position };
        } else {
          visit(child);
        }
      });
    };
    visit(tree);
  };
}

/** A display formula node, shaped as remark-math's own (mdast-util-math `enterMathFlow`). */
function displayMath(value: string): Node {
  const code = {
    type: "element",
    tagName: "code",
    properties: { className: ["language-math", "math-display"] },
    children: [{ type: "text", value }],
  };
  return { type: "math", value, data: { hName: "pre", hChildren: [code] } };
}

/**
 * rehype-katex with KaTeX's `throwOnError`: rehype-katex only warns on a formula KaTeX cannot
 * parse (and renders it in red), so the first such warning fails the file, and the build.
 * No options are passed, so no `macros` object is shared: KaTeX makes a fresh one per formula
 * and a `\newcommand` or `\gdef` applies only inside its own formula.
 */
export function rehypeKatexStrict() {
  const typeset = rehypeKatex();
  return (tree: Parameters<typeof typeset>[0], file: VFile) => {
    typeset(tree, file);
    const error = file.messages.find((m) => m.source === "rehype-katex");
    if (error) {
      file.fail(`KaTeX cannot typeset a formula: ${error.cause instanceof Error ? error.cause.message : error.reason}`, {
        place: error.place,
        source: "rehype-katex",
      });
    }
  };
}

/** The remark plugins for formulas, in order. */
export const mathRemarkPlugins = [remarkMath, remarkDisplayMathLines];

/** The rehype plugins for formulas. */
export const mathRehypePlugins = [rehypeKatexStrict];
