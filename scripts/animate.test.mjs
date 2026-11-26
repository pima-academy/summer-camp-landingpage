// Unit tests for the scroll-driven timeline dot (old IX2 "Timeline Circle [Scroll]").
// Scroll position runs 0 % when the dot's top reaches the viewport bottom to 100 % when its
// bottom leaves the viewport top; the dot's progress goes 0 -> 1 between 45 % and 50 %.
// CSS turns the progress into a colour (idle grey -> PiMA Green, see FounderStory.astro).
import { test } from "node:test";
import assert from "node:assert/strict";
import { timelineDotProgress } from "../src/lib/animate.ts";

// A 15 px dot in a 1000 px viewport: scroll position = (1000 - top) / 1015.
const dot = (top) => ({ top, height: 15 });

test("the dot is idle (0) below the 45 % mark", () => {
  assert.equal(timelineDotProgress(dot(1200), 1000), 0);
  assert.equal(timelineDotProgress(dot(600), 1000), 0);
});

test("the dot is done (1) past the 50 % mark", () => {
  assert.equal(timelineDotProgress(dot(450), 1000), 1);
  assert.equal(timelineDotProgress(dot(-500), 1000), 1);
});

test("the dot's progress is linear between 45 % and 50 %", () => {
  // top = 1000 - 0.475 * 1015 = 517.875 -> halfway.
  assert.ok(Math.abs(timelineDotProgress(dot(517.875), 1000) - 0.5) < 1e-9);
});
