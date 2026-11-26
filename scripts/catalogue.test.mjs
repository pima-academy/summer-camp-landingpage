// Checks the dev-only catalogue page (src/pages/catalogue/[...path].astro): it renders every
// primitive in every variant (ADR 0005), and it never reaches the production build.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { dist, distSkip, root } from "./test-lib.mjs";

const components = join(root, "src/components");
const cataloguePage = join(root, "src/pages/catalogue/[...path].astro");

/** The header comment of an .astro file: the first comment in its frontmatter. */
const headerComment = (text) => text.match(/^---\s*\n\s*(\/\*[\s\S]*?\*\/|(?:\/\/.*\n)+)/)?.[1] ?? "";

/** Component names whose header comment starts with "Primitive:". */
const primitives = readdirSync(components)
  .filter((f) => f.endsWith(".astro"))
  .filter((f) => /^(\/\*|\/\/)\s*Primitive:/.test(headerComment(readFileSync(join(components, f), "utf8"))))
  .map((f) => f.slice(0, -".astro".length));

/** The body of a component's `interface Props`. */
const propsOf = (name) =>
  readFileSync(join(components, `${name}.astro`), "utf8").match(/interface Props[^{]*{([\s\S]*?)\n}/)?.[1] ?? "";

/** The string-literal union props of a component, with their values. */
const variantProps = (name) =>
  [...propsOf(name).matchAll(/^\s*(\w+)\??:\s*((?:"[^"]*"\s*\|?\s*)+);/gm)].map(([, prop, union]) => ({
    prop,
    values: [...union.matchAll(/"([^"]*)"/g)].map((m) => m[1]),
  }));

/** The boolean props of a component. */
const booleanProps = (name) => [...propsOf(name).matchAll(/^\s*(\w+)\??:\s*boolean;/gm)].map((m) => m[1]);

const catalogue = existsSync(cataloguePage) ? readFileSync(cataloguePage, "utf8") : "";

test("the primitives of ADR 0005 are marked as primitives", () => {
  for (const name of ["Section", "Button", "Kicker", "BrandName"]) {
    assert.ok(primitives.includes(name), `${name}.astro's header comment starts with "Primitive:"`);
  }
});

test("the variant scan reads Button's variants and Section's boolean prop", () => {
  assert.ok(variantProps("Button").some(({ prop, values }) => prop === "variant" && values.includes("primary")));
  assert.ok(booleanProps("Section").includes("animate"));
});

test("the catalogue page renders every primitive", () => {
  for (const name of primitives) {
    assert.match(catalogue, new RegExp(`<${name}[\\s/>]`), `catalogue renders <${name}>`);
  }
});

test("the catalogue page shows every value of every variant prop and every boolean prop", () => {
  for (const name of primitives) {
    for (const { prop, values } of variantProps(name)) {
      for (const value of values) {
        assert.ok(catalogue.includes(`"${value}"`), `catalogue shows ${name} ${prop}="${value}"`);
      }
    }
    for (const prop of booleanProps(name)) {
      assert.match(catalogue, new RegExp(`\\b${prop}\\b`), `catalogue shows ${name} ${prop}`);
    }
  }
});

test("the catalogue page is not in the production build", { skip: distSkip }, () => {
  assert.ok(!existsSync(join(dist, "catalogue")), "dist/catalogue/ exists");
  const sitemaps = readdirSync(dist).filter((f) => /^sitemap.*\.xml$/.test(f));
  for (const f of sitemaps) assert.doesNotMatch(readFileSync(join(dist, f), "utf8"), /\/catalogue\//, f);
});
