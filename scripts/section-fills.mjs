// The "a section never paints its own background" rule (docs/brand.md, "Sections, buttons and
// footer"), applied to section files: a band takes Section's `tone`, a card inside it takes a
// tone with `data-tone`. Used by scripts/sections.test.mjs. Not a test file itself.
import { styleBlocks } from "./astro-file.mjs";
import { parseCss } from "./guardrail-lib.mjs";

/**
 * Fills a section may still paint, because they are no tone: small shapes and marks, not a
 * band or a card. Each needs a reason here.
 */
export const SECTION_FILLS = {
  // PiMA Green marks: the timeline axis and dots (Milestone, FounderStory).
  "--color-background-accent": "timeline axis and dots",
  // A founder timeline dot the page has not scrolled to yet.
  "--color-background-timeline-dot-idle": "timeline dot before it is reached",
  // The dev-only "No items found." box of an empty CMS list (content gaps only).
  "--color-background-empty-list": "dev-only empty-list box",
  // The dot between the marquee's claims.
  "--color-marquee-separator": "marquee separator dot",
};

const BACKGROUND = /^background(-color)?$/;

/** The background declarations of a section file that are not an allowed fill, as messages. */
export function sectionFillProblems(path, text) {
  const out = [];
  const visit = (nodes) =>
    nodes.forEach((n) => {
      if (n.type === "decl" && BACKGROUND.test(n.prop)) {
        // Colour tokens only (a mix may take a number, like the timeline dot's progress);
        // literal colours are the guardrail's business.
        const colours = [...n.value.matchAll(/var\(\s*(--color-[\w-]+)/g)].map((m) => m[1]);
        const ok = colours.every((name) => name in SECTION_FILLS);
        if (!ok) out.push(`${path}:${n.line} ${n.prop}: ${n.value} (use Section's tone or data-tone)`);
      }
      if (n.children) visit(n.children);
    });
  for (const { css, line } of styleBlocks(text)) visit(parseCss(css, line));
  return out;
}
