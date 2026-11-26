import assert from "node:assert/strict";
import { test } from "node:test";
import { fluidWidths } from "../src/lib/image-widths.ts";

test("a source wider than 2000 px gets the five standard widths", () => {
  assert.deepEqual(fluidWidths({ width: 4096 }), [500, 800, 1080, 1600, 2000]);
});

test("a narrower source is capped and keeps its own width as the largest candidate", () => {
  assert.deepEqual(fluidWidths({ width: 1022 }), [500, 800, 1022]);
  assert.deepEqual(fluidWidths({ width: 366 }), [366]);
});

test("a source exactly on a standard width is not listed twice", () => {
  assert.deepEqual(fluidWidths({ width: 800 }), [500, 800]);
  assert.deepEqual(fluidWidths({ width: 2000 }), [500, 800, 1080, 1600, 2000]);
});
