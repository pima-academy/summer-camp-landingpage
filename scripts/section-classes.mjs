// The "class names are local to their file" rule of ADR 0004, applied to section files.
// Used by scripts/sections.test.mjs. Not a test file itself (no `.test.` in the name).
import { parseCss } from "./guardrail-lib.mjs";

/** The class names a CSS text's selectors name (`.a .b:hover` → a, b). */
export function selectorClasses(css) {
  const names = new Set();
  const walk = (nodes) =>
    nodes.forEach((n) => {
      if (n.type === "rule") for (const m of n.selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) names.add(m[1]);
      if (n.children) walk(n.children);
    });
  walk(parseCss(css));
  return names;
}

/** The class names a .astro template sets: `class="…"`, and string literals in `class={…}` / `class:list={…}`. */
export function markupClasses(text) {
  const template = text.replace(/^---[\s\S]*?\n---/, "").replace(/<style\b[\s\S]*?<\/style>/g, "");
  const names = new Set();
  for (const m of template.matchAll(/\bclass="([^"]*)"/g)) m[1].split(/\s+/).filter(Boolean).forEach((c) => names.add(c));
  for (const m of template.matchAll(/\bclass(?::list)?=\{([^}]*)\}/g))
    for (const s of m[1].matchAll(/["'`]([^"'`]*)["'`]/g)) s[1].split(/\s+/).filter(Boolean).forEach((c) => names.add(c));
  return names;
}

/**
 * What breaks the rule in a section file, as messages ([] when none):
 * - a class in the markup that the file's own <style> does not style (a Webflow or utility
 *   class, styled by a global stylesheet);
 * - a class the file styles that a global stylesheet (src/styles/) also styles (the global
 *   rule would still apply: scoping only adds an attribute);
 * - a Webflow `w-node-…` id.
 * `globalClasses` is the set of class names the global stylesheets style.
 */
export function sectionClassProblems(path, text, globalClasses) {
  const styles = [...text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
  const own = selectorClasses(styles);
  const problems = [];
  for (const c of markupClasses(text)) if (!own.has(c)) problems.push(`${path}: class "${c}" is not styled in this file`);
  for (const c of own) if (globalClasses.has(c)) problems.push(`${path}: class "${c}" is also styled by a global stylesheet`);
  for (const m of text.matchAll(/\bid="(w-node-[^"]*)"/g)) problems.push(`${path}: Webflow id "${m[1]}"`);
  return problems;
}
