// Unit tests for the build-time active-link rule used by Nav and Footer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { isCurrent } from "../src/lib/current-link.ts";

test("a link is current when its path equals the page path", () => {
  assert.equal(isCurrent("/", "/"), true);
  assert.equal(isCurrent("/ve-chung-toi/", "/ve-chung-toi/"), true);
});

test("trailing slashes and index.html do not matter", () => {
  assert.equal(isCurrent("/ve-chung-toi/", "/ve-chung-toi"), true);
  assert.equal(isCurrent("/khoa-hoc/", "/khoa-hoc/index.html"), true);
  assert.equal(isCurrent("/", "/index.html"), true);
});

test("other pages are not current", () => {
  assert.equal(isCurrent("/", "/ve-chung-toi/"), false);
  assert.equal(isCurrent("/ve-chung-toi/", "/"), false);
  assert.equal(isCurrent("/khoa-hoc/", "/khoa-hoc-2/"), false);
  assert.equal(isCurrent("/", "/404"), false);
});

test("links to an anchor on the page are not the page itself", () => {
  assert.equal(isCurrent("/ve-chung-toi/#gioi-thieu", "/ve-chung-toi/"), false);
});

test("external and non-http links are never current", () => {
  assert.equal(isCurrent("https://www.facebook.com/pima.academy.vn", "/"), false);
  assert.equal(isCurrent("mailto:contact@pimavn.com", "/"), false);
});
