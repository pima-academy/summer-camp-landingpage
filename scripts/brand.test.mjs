// The brand guidelines in the repo (#74): `docs/brand.md`, the brand palette in tokens.css, the
// logo files, and the CLAUDE.md line that sends every agent to the doc before UI work.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./test-lib.mjs";
import { parseCss } from "./guardrail-lib.mjs";

const tokensCss = readFileSync(join(root, "src/styles/tokens.css"), "utf8");

/** Each custom property of the top-level `:root` block with its value. */
function rootTokens(css) {
  const rule = parseCss(css).find((n) => n.type === "rule" && n.selector === ":root");
  return Object.fromEntries(rule.children.filter((n) => n.type === "decl").map((n) => [n.prop, n.value]));
}

test("tokens.css holds the PiMA palette", () => {
  const tokens = rootTokens(tokensCss);
  const palette = {
    "--pima-green": "#50b448",
    "--pima-dark-green": "#275613",
    "--pima-pale-lime": "#d4e889",
    "--black": "#000000",
    "--gray-1": "#434343",
    "--gray-2": "#666666",
    "--gray-3": "#999999",
    "--gray-4": "#d9d9d9",
    "--gray-5": "#efefef",
    "--white": "#ffffff",
    "--secondary-red": "#e9542c",
    "--secondary-orange": "#ff9e1d",
    "--secondary-yellow": "#f6c545",
    "--secondary-sky-blue": "#37b2db",
    "--secondary-blue": "#3379b8",
    "--secondary-pink": "#f99ad3",
    "--secondary-purple": "#9e61c8",
    "--secondary-brown": "#91632f",
  };
  for (const [name, value] of Object.entries(palette)) {
    assert.equal(tokens[name]?.toLowerCase(), value, name);
  }
});
