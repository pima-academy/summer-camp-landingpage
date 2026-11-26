// Unit tests for the scroll-driven timeline dot colour (old IX2 "Timeline Circle [Scroll]").
// Progress runs 0 % when the dot's top reaches the viewport bottom to 100 % when its bottom
// leaves the viewport top; the colour goes rgb(217,218,219) -> black between 45 % and 50 %.
import { test } from "node:test";
import assert from "node:assert/strict";
import { timelineDotColor } from "../src/lib/animate.ts";

// A 15 px dot in a 1000 px viewport: progress = (1000 - top) / 1015.
const dot = (top) => ({ top, height: 15 });

test("the dot is light grey below the 45 % mark", () => {
  assert.equal(timelineDotColor(dot(1200), 1000), "rgb(217, 218, 219)");
  assert.equal(timelineDotColor(dot(600), 1000), "rgb(217, 218, 219)");
});

test("the dot is black past the 50 % mark", () => {
  assert.equal(timelineDotColor(dot(450), 1000), "rgb(0, 0, 0)");
  assert.equal(timelineDotColor(dot(-500), 1000), "rgb(0, 0, 0)");
});

test("the dot blends linearly between 45 % and 50 %", () => {
  // top = 1000 - 0.475 * 1015 = 517.875 -> halfway: (217/2, 218/2, 219/2) rounded.
  assert.equal(timelineDotColor(dot(517.875), 1000), "rgb(109, 109, 110)");
});
