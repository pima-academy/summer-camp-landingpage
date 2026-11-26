// The skip rule shared by the tests that read dist/.
import assert from "node:assert/strict";
import test from "node:test";
import { buildSkip } from "./test-lib.mjs";

test("a built test runs", () => {
  assert.equal(buildSkip(true, "dist/ missing", {}), false);
  assert.equal(buildSkip(true, "dist/ missing", { CI: "true" }), false);
});

test("locally, a test that needs a missing build is skipped with the reason", () => {
  assert.equal(buildSkip(false, "dist/ missing", {}), "dist/ missing");
});

test("in CI, a missing build fails instead of skipping", () => {
  assert.throws(() => buildSkip(false, "dist/ missing", { CI: "true" }), /dist\/ missing/);
});
