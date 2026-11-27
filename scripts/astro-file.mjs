// The parts of an .astro source file, for the tests that read source: its frontmatter, its
// template, its <style> blocks and its header comment. Not a test file itself (no `.test.`).
// Every part keeps the file's line numbers: what is cut out is blanked, newlines kept.

const FRONTMATTER = /^---([\s\S]*?)\n---/;
const STYLE = /<style\b[^>]*>([\s\S]*?)<\/style>/g;
const blank = (s) => s.replace(/[^\n]/g, " ");

/** The code between the opening and closing `---` ("" when there is none). */
export const frontmatter = (text) => text.match(FRONTMATTER)?.[1] ?? "";

/** The file after its frontmatter: markup and <style> blocks (the frontmatter blanked). */
export const template = (text) => text.replace(FRONTMATTER, blank);

/** The template without its <style> blocks (blanked). */
export const markup = (text) => template(text).replace(STYLE, blank);

/** The <style> blocks: [{ css, line }], `line` being the line of the first CSS line. */
export const styleBlocks = (text) =>
  [...text.matchAll(STYLE)].map((m) => ({
    css: m[1],
    line: 1 + (text.slice(0, m.index + m[0].indexOf(">") + 1).match(/\n/g)?.length ?? 0),
  }));

/** The comment that opens the frontmatter (`/* … *\/` or `//` lines), "" when there is none. */
export const headerComment = (text) => text.match(/^---\s*\n\s*(\/\*[\s\S]*?\*\/|(?:\/\/.*\n)+)/)?.[1] ?? "";
