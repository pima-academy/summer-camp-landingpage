// Formulas in blog posts (spec #110, #112), through the site's Markdown pipeline: `$…$` is
// inline, `$$…$$` alone on its line(s) is display, a formula KaTeX cannot parse fails, and a
// macro defined in one formula does not reach another.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { mathRehypePlugins, mathRemarkPlugins } from "../src/lib/markdown-math.ts";

const processor = await createMarkdownProcessor({
  remarkPlugins: mathRemarkPlugins,
  rehypePlugins: mathRehypePlugins,
  syntaxHighlight: false,
});
const render = async (markdown) => (await processor.render(markdown)).code;
/** Asserts that rendering `markdown` fails on a formula (the pipeline's own error log muted). */
async function failsOnFormula(markdown) {
  const log = console.error;
  console.error = () => {};
  try {
    await assert.rejects(render(markdown), /KaTeX cannot typeset a formula/, markdown);
  } finally {
    console.error = log;
  }
}
const count = (html, re) => html.match(re)?.length ?? 0;
const DISPLAY = /<span class="katex-display">/g;
const KATEX = /<span class="katex">/g;

test("$…$ and $$…$$ inside a line of text are inline formulas in that line", async () => {
  const html = await render("Tập $\\{1, 2, 3\\}$ và $$\\alpha \\approx 0.85$$ trong câu.");
  assert.equal(count(html, KATEX), 2);
  assert.equal(count(html, DISPLAY), 0);
  assert.match(html, /^<p>Tập <span class="katex">/);
});

test("$$…$$ alone on one line, or fenced on lines of its own, is a display formula, not in a <p>", async () => {
  for (const markdown of ["Trước.\n\n$$x^2 + \\Gamma = z^{k^i}$$ \n\nSau.", "Trước.\n\n$$\nx^2\n$$\n\nSau."]) {
    const html = await render(markdown);
    assert.equal(count(html, DISPLAY), 1, markdown);
    assert.match(html, /<p>Trước\.<\/p>\s*<span class="katex-display">/, markdown);
  }
});

test("$…$ alone in its paragraph stays inline", async () => {
  const html = await render("$n$\n\nSau.");
  assert.equal(count(html, DISPLAY), 0);
  assert.equal(count(html, KATEX), 1);
});

test("a formula KaTeX cannot parse fails the render", async () => {
  await failsOnFormula("Sai: $\\frac{1}{$ ở đây.");
  await failsOnFormula("$$\n\\undefinedmacro x\n$$");
});

test("a macro defined in one formula applies only inside it", async () => {
  assert.equal(count(await render("$\\gdef\\pima{x} \\pima + 1$"), KATEX), 1);
  await failsOnFormula("$\\gdef\\pima{x} \\pima$ rồi $\\pima$");
  // Nor in another post rendered by the same processor.
  await render("$\\gdef\\pimb{x} \\pimb$");
  await failsOnFormula("$\\pimb$");
});

test("a command KaTeX would show as red text (links, images, HTML, untrusted) fails the render", async () => {
  await failsOnFormula("$\\href{https://pimavn.com}{PiMA}$");
  await failsOnFormula("$\\url{https://pimavn.com}$");
  await failsOnFormula("$$\n\\includegraphics{a.png}\n$$");
  await failsOnFormula("$\\htmlClass{x}{y}$");
  // A URL KaTeX rejects before asking whether to trust it.
  await failsOnFormula("$\\url{a b:c}$");
  // A colour the author asks for is fine, even KaTeX's error red.
  assert.equal(count(await render("$\\textcolor{#cc0000}{x}$"), KATEX), 1);
});
