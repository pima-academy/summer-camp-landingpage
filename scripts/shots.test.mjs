import { test } from "node:test";
import assert from "node:assert/strict";
import { assertLocalUrl, isBlockedRequest, selectPages, shotFileName } from "./shots-lib.mjs";

test("no arguments selects every published page of the spec's page table", () => {
  const names = selectPages([]).map((p) => p.name);
  assert.deepEqual(names, [
    "index",
    "ve-chung-toi",
    "khoa-hoc",
    "lien-he",
    "trai-he-toan-hoc-pima",
    "trai-he-toan-hoc-2025",
    "trai-he-pima-2026",
    "chi-tiet-trai-he",
    "404",
  ]);
});

test("a page maps its old file to its rebuild URL", () => {
  const [page] = selectPages(["ve-chung-toi"]);
  assert.equal(page.oldPath, "/ve-chung-toi.html");
  assert.equal(page.newPath, "/ve-chung-toi/");
  const [home] = selectPages(["index"]);
  assert.equal(home.oldPath, "/index.html");
  assert.equal(home.newPath, "/");
});

test("arguments limit the run, accepting old file names too", () => {
  const names = selectPages(["lien-he", "ve-chung-toi.html"]).map((p) => p.name);
  assert.deepEqual(names, ["lien-he", "ve-chung-toi"]);
});

test("an unknown page name is refused", () => {
  assert.throws(() => selectPages(["style-guide"]), /style-guide/);
});

test("old and new shots of the same page and width sort next to each other, widths in ascending order", () => {
  const names = [];
  for (const page of ["lien-he", "index"]) {
    for (const width of [1440, 390, 820]) {
      for (const side of ["old", "new"]) names.push(shotFileName(page, width, side));
    }
  }
  assert.deepEqual(names.sort(), [
    "index_0390_new.png",
    "index_0390_old.png",
    "index_0820_new.png",
    "index_0820_old.png",
    "index_1440_new.png",
    "index_1440_old.png",
    "lien-he_0390_new.png",
    "lien-he_0390_old.png",
    "lien-he_0820_new.png",
    "lien-he_0820_old.png",
    "lien-he_1440_new.png",
    "lien-he_1440_old.png",
  ]);
});

test("only localhost URLs may be opened", () => {
  assert.doesNotThrow(() => assertLocalUrl("http://localhost:4321/"));
  assert.doesNotThrow(() => assertLocalUrl("http://127.0.0.1:5000/lien-he.html"));
  assert.throws(() => assertLocalUrl("https://pimavn.com/"), /localhost/);
  assert.throws(() => assertLocalUrl("http://localhost.evil.com/"), /localhost/);
  assert.throws(() => assertLocalUrl("file:///etc/passwd"), /localhost/);
});

test("requests that could deliver a submission are blocked", () => {
  const get = (url) => ({ url, method: "GET", isNavigation: false });
  assert.equal(isBlockedRequest(get("https://script.google.com/macros/s/abc/exec")), true);
  assert.equal(isBlockedRequest(get("https://script.googleusercontent.com/macros/echo?x=1")), true);
  assert.equal(isBlockedRequest(get("https://webflow.com/api/v1/form/123")), true);
  assert.equal(isBlockedRequest({ url: "https://example.org/anything", method: "POST", isNavigation: false }), true);
  assert.equal(isBlockedRequest({ url: "http://localhost:4321/", method: "POST", isNavigation: false }), true);
});

test("the contact form endpoint given by the caller is blocked", () => {
  const endpoint = "https://forms.example.net/submit";
  assert.equal(isBlockedRequest({ url: endpoint + "?a=1", method: "GET", isNavigation: false }, [endpoint]), true);
});

test("page assets load, but the page cannot navigate away from localhost", () => {
  assert.equal(isBlockedRequest({ url: "https://fonts.gstatic.com/s/x.woff2", method: "GET", isNavigation: false }), false);
  assert.equal(isBlockedRequest({ url: "http://localhost:4321/_astro/a.css", method: "GET", isNavigation: false }), false);
  assert.equal(isBlockedRequest({ url: "http://localhost:4321/lien-he/", method: "GET", isNavigation: true }), false);
  assert.equal(isBlockedRequest({ url: "https://pimavn.com/", method: "GET", isNavigation: true }), true);
});
