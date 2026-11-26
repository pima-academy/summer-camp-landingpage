// Runs apps-script/Code.gs in a Node vm with fake Apps Script globals
// (SpreadsheetApp, ContentService, LockService) and drives it through doPost.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8");

const HEADER = ["Thời điểm", "Trang", "Họ và tên", "Email", "Số điện thoại", "Đơn vị/Tổ chức", "Nội dung"];

/** Loads Code.gs against a fake Sheet; returns doPost and the rows written so far. */
function load(initialRows = []) {
  const rows = initialRows.map((r) => [...r]);
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (row) => rows.push([...row]),
  };
  const context = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheets: () => [sheet] }) },
    ContentService: {
      MimeType: { JSON: "application/json" },
      createTextOutput: (text) => ({ text, setMimeType() { return this; } }),
    },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  const post = (parameter) => JSON.parse(context.doPost({ parameter }).text);
  return { post, rows };
}

const valid = {
  page: "/lien-he/",
  name: "Nguyễn Văn A",
  email: "a@example.com",
  phone: "0909 000 000",
  organization: "Trường THPT X",
  message: "Xin chào PiMA",
};

test("a valid submission writes the header to an empty tab, then one row", () => {
  const { post, rows } = load();
  assert.deepEqual(post(valid), { ok: true });
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[0], HEADER);
  const [time, ...rest] = rows[1];
  assert.ok(time instanceof Date || Object.prototype.toString.call(time) === "[object Date]");
  assert.deepEqual(rest, ["/lien-he/", "Nguyễn Văn A", "a@example.com", "0909 000 000", "Trường THPT X", "Xin chào PiMA"]);
});

test("the header is not written again when the tab already has rows", () => {
  const { post, rows } = load([HEADER]);
  assert.deepEqual(post(valid), { ok: true });
  assert.equal(rows.length, 2);
  assert.equal(rows[1][2], "Nguyễn Văn A");
});

test("optional fields may be missing", () => {
  const { post, rows } = load([HEADER]);
  const { phone, organization, ...rest } = valid;
  assert.deepEqual(post(rest), { ok: true });
  assert.deepEqual(rows[1].slice(4, 6), ["", ""]);
});

test("a missing or blank required field is rejected and nothing is written", () => {
  for (const field of ["name", "email", "message"]) {
    for (const value of [undefined, "", "   "]) {
      const { post, rows } = load([HEADER]);
      const params = { ...valid, [field]: value };
      if (value === undefined) delete params[field];
      assert.deepEqual(post(params), { ok: false }, `${field}=${JSON.stringify(value)}`);
      assert.equal(rows.length, 1);
    }
  }
});

test("an invalid email is rejected", () => {
  const { post, rows } = load([HEADER]);
  assert.deepEqual(post({ ...valid, email: "not-an-email" }), { ok: false });
  assert.equal(rows.length, 1);
});

test("a filled honeypot is dropped silently: ok, but nothing written", () => {
  const { post, rows } = load([HEADER]);
  assert.deepEqual(post({ ...valid, website: "http://spam.example" }), { ok: true });
  assert.equal(rows.length, 1);
});

test("an empty honeypot is accepted", () => {
  const { post, rows } = load([HEADER]);
  assert.deepEqual(post({ ...valid, website: "" }), { ok: true });
  assert.equal(rows.length, 2);
});

test("values starting with = + - @ are written as text, not formulas", () => {
  const { post, rows } = load([HEADER]);
  post({
    ...valid,
    name: "=HYPERLINK(\"http://x\")",
    phone: "+84 90 955 1721",
    organization: "-1+1",
    message: "@SUM(A1)",
  });
  assert.deepEqual(rows[1].slice(2, 7), [
    "'=HYPERLINK(\"http://x\")",
    "a@example.com",
    "'+84 90 955 1721",
    "'-1+1",
    "'@SUM(A1)",
  ]);
});

test("values are trimmed and capped at the form's maxlength", () => {
  const { post, rows } = load([HEADER]);
  post({ ...valid, name: `  ${"a".repeat(300)}  `, message: "b".repeat(6000) });
  assert.equal(rows[1][2].length, 256);
  assert.equal(rows[1][6].length, 5000);
});

test("a request without parameters answers ok: false", () => {
  const { post, rows } = load([HEADER]);
  assert.deepEqual(post({}), { ok: false });
  assert.equal(rows.length, 1);
});
