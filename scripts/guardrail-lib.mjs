// The CSS guardrail of ADR 0004, as functions: checkFile(path, text) lists the rules a file
// breaks. Used by scripts/guardrail.test.mjs. Not a test file itself (no `.test.` in the name).
import { join, relative, sep } from "node:path";
import { markup, styleBlocks } from "./astro-file.mjs";
import { root as repoRoot, walk } from "./test-lib.mjs";

/**
 * Parses CSS into a tree of nodes: { type: "comment", text } | { type: "atrule", name,
 * prelude, children? } | { type: "rule", selector, children } | { type: "decl", prop, value }.
 * Every node has `line` (1-based, offset by `firstLine`). Tolerant: it never throws.
 */
export function parseCss(css, firstLine = 1) {
  let i = 0;
  const lineAt = (pos) => firstLine + (css.slice(0, pos).match(/\n/g)?.length ?? 0);

  function block() {
    const nodes = [];
    while (i < css.length) {
      while (/\s/.test(css[i] ?? "")) i++;
      if (i >= css.length) break;
      if (css.startsWith("/*", i)) {
        const end = css.indexOf("*/", i + 2);
        const stop = end < 0 ? css.length : end + 2;
        nodes.push({ type: "comment", text: css.slice(i + 2, stop - 2), line: lineAt(i) });
        i = stop;
        continue;
      }
      if (css[i] === "}") {
        i++;
        break;
      }
      const start = i;
      let depth = 0;
      let text = "";
      while (i < css.length) {
        const c = css[i];
        if (c === '"' || c === "'") {
          const end = css.indexOf(c, i + 1);
          const stop = end < 0 ? css.length : end + 1;
          text += css.slice(i, stop);
          i = stop;
          continue;
        }
        if (css.startsWith("/*", i)) {
          const end = css.indexOf("*/", i + 2);
          i = end < 0 ? css.length : end + 2;
          continue;
        }
        if (c === "(") depth++;
        if (c === ")") depth--;
        if (depth <= 0 && (c === ";" || c === "{" || c === "}")) break;
        text += c;
        i++;
      }
      const end = css[i];
      const head = text.trim();
      const line = lineAt(start);
      if (end === "{") {
        i++;
        const children = block();
        if (head.startsWith("@")) {
          const [, name, prelude] = head.match(/^@([\w-]+)\s*([\s\S]*)$/) ?? [, head.slice(1), ""];
          nodes.push({ type: "atrule", name: name.toLowerCase(), prelude: prelude.trim(), children, line });
        } else {
          nodes.push({ type: "rule", selector: head, children, line });
        }
        continue;
      }
      if (end === ";") i++;
      if (!head) continue;
      if (head.startsWith("@")) {
        const [, name, prelude] = head.match(/^@([\w-]+)\s*([\s\S]*)$/) ?? [, head.slice(1), ""];
        nodes.push({ type: "atrule", name: name.toLowerCase(), prelude: prelude.trim(), line });
        continue;
      }
      const colon = head.indexOf(":");
      if (colon > 0) {
        const prop = head.slice(0, colon).trim();
        nodes.push({ type: "decl", prop: prop.startsWith("--") ? prop : prop.toLowerCase(), value: head.slice(colon + 1).trim(), line });
      }
    }
    return nodes;
  }

  return block();
}

// CSS named colours, without `transparent` and `currentColor` (allowed everywhere).
const NAMED = `aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue
blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan
darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen
darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey
darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite
forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink
indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral
lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen
lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta
maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue
mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin
navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen
paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red
rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue
slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white
whitesmoke yellow yellowgreen`.split(/\s+/);

const COLOUR = new RegExp(
  [
    String.raw`#[0-9a-f]{3,8}(?![\w-])`,
    String.raw`(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(`,
    String.raw`(?<![\w-])(?:${NAMED.join("|")})(?![\w-])`,
  ].join("|"),
  "i",
);

/** The first literal colour in a declaration value (strings and url() ignored), or null. */
export function literalColour(value) {
  const bare = value.replace(/"[^"]*"|'[^']*'/g, "").replace(/url\([^)]*\)/gi, "");
  return bare.match(COLOUR)?.[0] ?? null;
}

// Properties whose value must come through var(--…): the type, radius and shadow tokens.
const TOKEN_PROPS =
  /^(font|font-family|font-size|font-weight|line-height|letter-spacing|box-shadow|text-shadow|border(-(top|bottom|start|end)-(left|right|start|end))?-radius)$/;
const KEYWORDS = /^(inherit|initial|unset|revert|revert-layer)$/i;
// `0` and `none` are no radius / no shadow, `0` and `normal` no extra letter spacing: not design values.
const NONE_PROPS = /(radius|shadow)$/;
const NORMAL_PROPS = /^letter-spacing$/;

// Spacing properties: margins, paddings, gaps and the offsets used as spacing. Their lengths come
// from the spacing scale (--space-…); `0`, `auto`, percentages, viewport units and `lh` (one
// line box) are not design values.
const SPACING_PROPS =
  /^((margin|padding|scroll-margin|scroll-padding|inset)(-[\w-]+)?|gap|row-gap|column-gap|grid-gap|grid-row-gap|grid-column-gap|top|right|bottom|left)$/;
const LENGTH = /(?<![\w.-])-?(\d*\.?\d+)(px|r?em|ch|r?ex|pt|pc|cm|mm|in|q)(?![\w-])/gi;

/** The first literal spacing length in a value (var(--…) references and zero lengths ignored), or null. */
export function literalSpacing(value) {
  const bare = value.replace(/var\(\s*--[\w-]+\s*\)/g, "");
  return [...bare.matchAll(LENGTH)].find((m) => Number(m[1]) !== 0)?.[0] ?? null;
}

/** Whether a value is only var(--…) references (and commas, `!important`) or an allowed keyword. */
export function isTokenValue(prop, value) {
  const v = value.replace(/\s*!important\s*$/i, "").trim();
  if (KEYWORDS.test(v)) return true;
  if (NONE_PROPS.test(prop) && /^(0|none)$/i.test(v)) return true;
  if (NORMAL_PROPS.test(prop) && /^(0|normal)$/i.test(v)) return true;
  let rest = v;
  for (let prev; prev !== rest; ) {
    prev = rest;
    rest = rest.replace(/var\(\s*--[\w-]+\s*(,[^()]*)?\)/g, "");
  }
  return rest !== v && /^[\s,]*$/.test(rest);
}

/**
 * Brand palette tokens (tokens.css): only the role tokens there point at them; every other
 * stylesheet uses a role token (docs/brand.md, "Using these rules").
 */
export const PALETTE_TOKEN = /^--(pima-[\w-]+|black|white|gray-\d|secondary-[\w-]+)$/;

/** Violations ({ rule, line, message }) of one declaration; `known`: custom properties that exist. */
function checkDecl(node, known) {
  const out = [];
  const at = { line: node.line, message: `${node.prop}: ${node.value}` };
  if (literalColour(node.value)) out.push({ rule: "literal-colour", ...at });
  else if (TOKEN_PROPS.test(node.prop) && !isTokenValue(node.prop, node.value)) out.push({ rule: "not-a-token", ...at });
  else if (SPACING_PROPS.test(node.prop) && literalSpacing(node.value)) out.push({ rule: "literal-spacing", ...at });
  if ([...node.value.matchAll(/var\(\s*(--[\w-]+)/g)].some(([, name]) => PALETTE_TOKEN.test(name))) {
    out.push({ rule: "palette-token", ...at });
  }
  if (known) {
    for (const [, name] of node.value.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (!known.has(name)) out.push({ rule: "unknown-token", ...at });
    }
  }
  return out;
}

/** The custom properties a stylesheet declares (anywhere, e.g. tokens.css with its @media). */
export function tokenNames(css) {
  const names = new Set();
  const walk = (nodes) =>
    nodes.forEach((n) => {
      if (n.type === "decl" && n.prop.startsWith("--")) names.add(n.prop);
      if (n.children) walk(n.children);
    });
  walk(parseCss(css));
  return names;
}

// The three breakpoints (desktop-first), with or without `screen and`.
const BREAKPOINT = /^(screen\s+and\s+)?\(\s*max-width:\s*(991|767|479)px\s*\)$/i;
// A media query about motion only (no width).
const MOTION = /^\(\s*prefers-reduced-motion:\s*(reduce|no-preference)\s*\)$/i;
/** The marker comment, directly before an @media, that makes it an allowed exception. */
export const MEDIA_EXCEPTION = "breakpoint-exception:";

/** Violations ({ rule, line, message }) in a parsed CSS tree. */
function checkNodes(nodes, known) {
  const out = [];
  nodes.forEach((node, k) => {
    const before = nodes[k - 1];
    if (node.type === "decl") out.push(...checkDecl(node, known));
    if (node.type === "atrule" && node.name === "font-face") return;
    if (node.type === "atrule" && node.name === "media") {
      const marked = before?.type === "comment" && before.text.includes(MEDIA_EXCEPTION);
      if (!BREAKPOINT.test(node.prelude) && !MOTION.test(node.prelude) && !marked) {
        out.push({ rule: "media-query", line: node.line, message: `@media ${node.prelude}` });
      }
    }
    if (node.type === "rule" && node.selector.includes(":global(") && before?.type !== "comment") {
      out.push({ rule: "uncommented-global", line: node.line, message: node.selector });
    }
    if (node.children) out.push(...checkNodes(node.children, known));
  });
  return out;
}

/** Custom properties an inline `style` may set: per-instance values, not design values. */
export const INLINE_STYLE_ALLOWED = ["--marquee-duration", "--marquee-copies"];
// Properties that carry a design value in inline style, whatever their value.
const DESIGN_PROPS = /^(color|background(-color|-image)?|border(-[\w-]+)?|outline(-color)?|fill|stroke)$/;

/** Violations in the inline `style` attributes of an .astro file's markup (astro-file.mjs). */
function checkInlineStyles(markup) {
  const out = [];
  const attrs = /\sstyle=(?:"([^"]*)"|'([^']*)'|\{\s*`([^`]*)`\s*\}|\{\s*"([^"]*)"\s*\})/g;
  for (const m of markup.matchAll(attrs)) {
    const line = 1 + (markup.slice(0, m.index).match(/\n/g)?.length ?? 0);
    const style = m[1] ?? m[2] ?? m[3] ?? m[4];
    for (const decl of style.replace(/\$\{[^}]*\}/g, "x").split(";")) {
      const colon = decl.indexOf(":");
      if (colon < 0) continue;
      const prop = decl.slice(0, colon).trim().toLowerCase();
      const value = decl.slice(colon + 1).trim();
      const bad = prop.startsWith("--")
        ? !INLINE_STYLE_ALLOWED.includes(prop)
        : literalColour(value) ||
          TOKEN_PROPS.test(prop) ||
          DESIGN_PROPS.test(prop) ||
          (SPACING_PROPS.test(prop) && literalSpacing(value));
      if (bad) out.push({ rule: "inline-style", line, message: decl.trim() });
    }
  }
  return out;
}

/** Files the guardrail never checks: the tokens themselves. */
const SKIPPED = [/^src\/styles\/tokens\.css$/];

/** Whether the guardrail checks a file (path relative to the repo root, `/` separators). */
export const inScope = (path) =>
  /^src\/.*\.(astro|css)$/.test(path) && !SKIPPED.some((re) => re.test(path));

/** Every file the guardrail checks, relative to the repo root (`/` separators), sorted. */
export function guardrailFiles(root = repoRoot) {
  return walk(join(root, "src"))
    .map((f) => relative(root, f).split(sep).join("/"))
    .filter(inScope)
    .sort();
}

/**
 * Every rule a file (path relative to the repo root, `/` separators) breaks. With `tokens` (the
 * names in tokens.css, from tokenNames), a var(--…) that names nothing is an `unknown-token`.
 */
export function checkFile(path, text, { tokens } = {}) {
  const sheets = path.endsWith(".astro") ? styleBlocks(text) : [{ css: text, line: 1 }];
  const known = tokens && new Set([...tokens, ...INLINE_STYLE_ALLOWED, ...sheets.flatMap((s) => [...tokenNames(s.css)])]);
  const found = sheets.flatMap((s) => checkNodes(parseCss(s.css, s.line), known));
  if (path.endsWith(".astro")) {
    found.push(...checkInlineStyles(markup(text)));
  }
  return found;
}
