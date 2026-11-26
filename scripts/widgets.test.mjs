// The refactored widgets carry no Webflow markup (#64, ADR 0004): no `w-…` class or
// `w-node` id in their markup, styles or scripts; state is ARIA or data attributes.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./test-lib.mjs";

const WIDGETS = ["Slider", "Marquee", "ContactForm"];

for (const name of WIDGETS) {
  test(`${name} has no Webflow class, id or state class`, () => {
    const source = readFileSync(join(root, "src/components", `${name}.astro`), "utf8");
    const found = source.match(/(?<![\w-])w-(?:-|node|[a-z]+)[\w-]*/g) ?? [];
    assert.deepEqual(found, []);
  });
}
