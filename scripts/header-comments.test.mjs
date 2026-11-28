// Checks CLAUDE.md's "Every file starts with a comment saying what it is and which pages use
// it" for the building blocks: every .astro file in src/sections/, src/components/ and
// src/layouts/ opens its frontmatter with a comment.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { headerComment } from "./astro-file.mjs";
import { root, walk } from "./test-lib.mjs";

test("headerComment finds the comment that opens the frontmatter, and only that one", () => {
  assert.match(headerComment("---\n// Hero: the title band. Used by index.\nimport A from './a';\n---\n"), /Hero/);
  assert.match(headerComment("---\n/*\n  Primitive: Section.\n*/\n---\n"), /Primitive/);
  assert.equal(headerComment("---\nimport A from './a';\n// later\n---\n"), "");
  assert.equal(headerComment("<div>no frontmatter</div>\n"), "");
});

test("every section, component and layout file starts with a header comment", () => {
  const files = ["src/sections", "src/components", "src/layouts"]
    .flatMap((dir) => walk(join(root, dir)))
    .filter((f) => f.endsWith(".astro"));
  assert.ok(files.length > 40, `${files.length} files`);
  const missing = files.filter((f) => !headerComment(readFileSync(f, "utf8"))).map((f) => relative(root, f));
  assert.deepEqual(missing, []);
});
