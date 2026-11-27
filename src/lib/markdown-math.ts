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
  position?: { start: { line: number; column: number; offset?: number }; end: { line: number; column: number; offset?: number } };
  data?: Record<string, unknown>;
  properties?: Record<string, unknown>;
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

/** The colour KaTeX paints a command it will not run (an untrusted one) instead of throwing. */
const ERROR_COLOR = "#cc0000";

/**
 * KaTeX's `trust` option, asked before a command that makes a link, an image or raw HTML
 * (`\href`, `\url`, `\includegraphics`, `\htmlClass`…). Untrusted, KaTeX would show the command
 * as red text without throwing; this throws, so the formula fails like one KaTeX cannot parse.
 */
function refuseUntrusted({ command }: { command: string }): never {
  throw new Error(`${command} is not allowed in a formula (links and images go in the text)`);
}

/**
 * rehype-katex with KaTeX's `throwOnError`: rehype-katex only warns on a formula KaTeX cannot
 * parse (and renders it in red), so the first such warning fails the file, and the build.
 * A command KaTeX still shows as red text without throwing (one it rejects before asking
 * `trust`, such as `\url` with a malformed scheme) fails it too.
 * No `macros` object is passed, so none is shared: KaTeX makes a fresh one per formula and a
 * `\newcommand` or `\gdef` applies only inside its own formula.
 */
export function rehypeKatexStrict() {
  const typeset = rehypeKatex({ trust: refuseUntrusted, errorColor: ERROR_COLOR });
  return (tree: Parameters<typeof typeset>[0], file: VFile) => {
    typeset(tree, file);
    const error = file.messages.find((m) => m.source === "rehype-katex");
    if (error) {
      file.fail(`KaTeX cannot typeset a formula: ${error.cause instanceof Error ? error.cause.message : error.reason}`, {
        place: error.place,
        source: "rehype-katex",
      });
    }
    const unsupported = findUnsupported(tree as Node);
    if (unsupported) {
      file.fail(`KaTeX cannot typeset a formula: ${unsupported.command} is not supported`, {
        place: unsupported.place,
        source: "rehype-katex",
      });
    }
  };
}

/**
 * A command KaTeX rendered as red text (its `formatUnsupportedCmd`: an element in the error
 * colour whose text is the command, `\…`), with the nearest source position above it. An
 * author's own `\textcolor{#cc0000}` never shows a backslash, so it is not taken for one.
 */
function findUnsupported(node: Node, place?: Node["position"]): { command: string; place?: Node["position"] } | undefined {
  const here = node.position ?? place;
  const style = node.properties?.style;
  if (typeof style === "string" && style.replace(/\s/g, "").includes(`color:${ERROR_COLOR}`)) {
    const text = textOf(node);
    if (text.startsWith("\\")) return { command: text, place: here };
  }
  for (const child of node.children ?? []) {
    const found = findUnsupported(child, here);
    if (found) return found;
  }
}

/** The text inside a node. */
const textOf = (node: Node): string => node.value ?? (node.children ?? []).map(textOf).join("");

/** The remark plugins for formulas, in order. */
export const mathRemarkPlugins = [remarkMath, remarkDisplayMathLines];

/** The rehype plugins for formulas. */
export const mathRehypePlugins = [rehypeKatexStrict];
