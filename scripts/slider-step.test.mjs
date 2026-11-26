// Slider movement rules, as webflow.js's slider did them (one slide per page).
// Positions are translateX values in slide widths (-2 = translateX(-200%)).
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialState, step } from "../src/lib/slider-step.ts";

const N = 6;

test("next moves every slide one width left", () => {
  const r = step(initialState, 1, N, false);
  assert.equal(r.state.index, 1);
  assert.deepEqual(r.moves, Array.from({ length: N }, () => ({ to: -1 })));
});

test("selecting the current slide moves nothing", () => {
  const r = step(initialState, 0, N, true);
  assert.equal(r.state.index, 0);
  assert.deepEqual(r.moves, []);
});

test("without infinite, next on the last slide rewinds to the first", () => {
  const r = step({ index: 5, offset: -5, shifted: null }, 6, N, false);
  assert.equal(r.state.index, 0);
  assert.deepEqual(r.moves, Array.from({ length: N }, () => ({ to: 0 })));
});

test("without infinite, previous on the first slide goes to the last", () => {
  const r = step(initialState, -1, N, false);
  assert.equal(r.state.index, 5);
  assert.deepEqual(r.moves, Array.from({ length: N }, () => ({ to: -5 })));
});

test("infinite next on the last slide brings the first in from the right", () => {
  const r = step({ index: 5, offset: -5, shifted: null }, 6, N, true);
  assert.equal(r.state.index, 0);
  assert.equal(r.state.shifted, 5);
  // Slides 0-4 jump one width right of their resting place, then slide to 0.
  for (let k = 0; k < 5; k++) assert.deepEqual(r.moves[k], { from: 1, to: 0 });
  // The old last slide leaves to the left.
  assert.deepEqual(r.moves[5], { from: -5, to: -6 });
});

test("after an infinite wrap, the shifted slide is put back before the next move", () => {
  const wrapped = step({ index: 5, offset: -5, shifted: null }, 6, N, true).state;
  const r = step(wrapped, 1, N, true);
  assert.equal(r.state.index, 1);
  assert.equal(r.state.shifted, null);
  for (let k = 0; k < 5; k++) assert.deepEqual(r.moves[k], { to: -1 });
  assert.deepEqual(r.moves[5], { from: 0, to: -1 });
});

test("infinite previous on the first slide brings the last in from the left", () => {
  const r = step(initialState, -1, N, true);
  assert.equal(r.state.index, 5);
  assert.equal(r.state.shifted, 0);
  assert.deepEqual(r.moves[0], { from: 0, to: 1 });
  for (let k = 1; k < N; k++) assert.deepEqual(r.moves[k], { from: -6, to: -5 });
});
