// Drives ContactForm in headless Chromium against a MOCKED endpoint.
// Every request is answered by Playwright route interception: pages and assets
// from dist/, the endpoint by the mock, anything else aborted. Nothing reaches
// the network, so no real Apps Script is ever called.
// Runs on every built page that has the form (both variants when present).
// Needs a fresh `npm run build`; skipped when no built page has the form.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, normalize, sep } from "node:path";
import { chromium } from "playwright";
import { contact } from "../src/data/site.ts";
import { buildSkip, builtHtmlFiles, dist } from "./test-lib.mjs";

const ORIGIN = "http://127.0.0.1:9"; // never contacted: every request is routed
const ENDPOINT = "https://contact-endpoint.test/exec"; // reserved .test TLD, mocked

/** One built page per form variant: "section" (textarea) and "lien-he" (single-line message). */
function formPages() {
  const pages = new Map();
  for (const file of builtHtmlFiles()) {
    const html = readFileSync(file, "utf8");
    if (!html.includes("data-contact-form")) continue;
    const variant = /<textarea[^>]*name="message"/.test(html) ? "section" : "lien-he";
    if (pages.has(variant)) continue;
    const rel = file.slice(dist.length).split(sep).join("/");
    pages.set(variant, "/" + rel.replace(/(^|\/)index\.html$/, "$1"));
  }
  return [...pages];
}

function distFile(pathname) {
  let path = decodeURIComponent(pathname);
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(dist, path));
  if (!file.startsWith(dist)) return null;
  return existsSync(file) && statSync(file).isFile() ? file : null;
}

const pages = formPages();
const skip = buildSkip(pages.length > 0, "no built page has ContactForm: run `npm run build` first");

let browser;
before(async () => {
  if (!skip) browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
});

/**
 * Opens `path` with the endpoint set to ENDPOINT (or removed when `endpoint` is "").
 * `respond(route)` answers endpoint requests; `requests` records them.
 */
async function open(path, { respond, endpoint = ENDPOINT } = {}) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const requests = [];
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === ORIGIN && request.method() === "GET") {
      const file = distFile(url.pathname);
      return file ? route.fulfill({ path: file }) : route.fulfill({ status: 404, body: "" });
    }
    if (request.url() === ENDPOINT) {
      requests.push({
        method: request.method(),
        headers: await request.allHeaders(),
        body: new URLSearchParams(request.postData() ?? ""),
      });
      if (respond) return respond(route);
    }
    return route.abort();
  });
  await page.goto(ORIGIN + path);
  await page.evaluate((endpoint) => {
    const form = document.querySelector("[data-contact-form] form");
    if (endpoint) form.setAttribute("action", endpoint);
    else form.removeAttribute("action");
  }, endpoint);
  const form = page.locator("[data-contact-form] form");
  return {
    page,
    requests,
    form,
    wrapper: page.locator("[data-contact-form]"),
    // The success message is a status, the error an alert; the wrapper's data-state says which shows.
    done: page.locator("[data-contact-form] [role=\"status\"]"),
    fail: page.locator("[data-contact-form] [role=\"alert\"]"),
    button: form.locator('input[type="submit"]'),
    close: () => context.close(),
  };
}

const json = (body, status = 200) => (route) =>
  route.fulfill({
    status,
    contentType: "application/json",
    headers: { "access-control-allow-origin": "*" },
    body: JSON.stringify(body),
  });

async function fillValid(form) {
  await form.locator('[name="name"]').fill("Nguyễn Văn A");
  await form.locator('[name="email"]').fill("a@example.com");
  await form.locator('[name="phone"]').fill("0909 000 000");
  await form.locator('[name="organization"]').fill("Trường THPT X");
  await form.locator('[name="message"]').fill("Xin chào PiMA");
}

for (const [variant, path] of pages) {
  describe(`ContactForm (${variant}, ${path})`, { skip }, () => {
    test("success: 'Đang gửi…' while sending, then the form hides and the success message shows", async () => {
      let release;
      const held = new Promise((ok) => (release = ok));
      const f = await open(path, {
        respond: async (route) => {
          await held;
          return json({ ok: true })(route);
        },
      });
      try {
        await fillValid(f.form);
        await f.button.click();
        await f.page.waitForFunction(() => document.querySelector('[data-contact-form] input[type="submit"]').value === "Đang gửi…");
        assert.equal(await f.wrapper.getAttribute("data-state"), "sending");
        assert.equal(await f.form.isVisible(), true);
        assert.equal(await f.done.isVisible(), false);
        assert.equal(await f.fail.isVisible(), false);
        release();
        await f.done.waitFor({ state: "visible" });
        assert.equal(await f.wrapper.getAttribute("data-state"), "done");
        assert.equal(await f.form.isVisible(), false);
        assert.equal(await f.fail.isVisible(), false);
        assert.equal((await f.done.innerText()).trim(), "Lời nhắn của bạn đã được gửi đi!");

        assert.equal(f.requests.length, 1);
        const [req] = f.requests;
        assert.equal(req.method, "POST");
        // CORS simple request: form-urlencoded, no custom headers.
        assert.match(req.headers["content-type"], /^application\/x-www-form-urlencoded/);
        assert.deepEqual(Object.fromEntries(req.body), {
          page: path,
          name: "Nguyễn Văn A",
          email: "a@example.com",
          phone: "0909 000 000",
          organization: "Trường THPT X",
          message: "Xin chào PiMA",
          website: "",
        });
      } finally {
        await f.close();
      }
    });

    for (const [name, respond] of [
      ["{ ok: false }", json({ ok: false })],
      ["HTTP 500", json({ ok: true }, 500)],
      ["network error", (route) => route.abort("failed")],
      ["non-JSON answer", (route) => route.fulfill({ status: 200, headers: { "access-control-allow-origin": "*" }, body: "<html>" })],
    ]) {
      test(`error (${name}): the error message with email and phone, form and values kept`, async () => {
        const f = await open(path, { respond });
        try {
          await fillValid(f.form);
          await f.button.click();
          await f.fail.waitFor({ state: "visible" });
          assert.equal(await f.wrapper.getAttribute("data-state"), "fail");
          const text = await f.fail.innerText();
          assert.ok(text.includes(contact.email), text);
          assert.ok(text.includes(contact.phone), text);
          assert.equal(await f.form.isVisible(), true);
          assert.equal(await f.done.isVisible(), false);
          assert.equal(await f.form.locator('[name="message"]').inputValue(), "Xin chào PiMA");
          assert.equal(await f.button.inputValue(), "Gửi yêu cầu");
        } finally {
          await f.close();
        }
      });
    }

    test("error then retry: the error hides and success shows", async () => {
      let answer = { ok: false };
      const f = await open(path, { respond: (route) => json(answer)(route) });
      try {
        await fillValid(f.form);
        await f.button.click();
        await f.fail.waitFor({ state: "visible" });
        answer = { ok: true };
        await f.button.click();
        await f.done.waitFor({ state: "visible" });
        assert.equal(await f.wrapper.getAttribute("data-state"), "done");
        assert.equal(await f.fail.isVisible(), false);
        assert.equal(f.requests.length, 2);
      } finally {
        await f.close();
      }
    });

    test("empty endpoint: the error message, no request sent", async () => {
      const f = await open(path, { endpoint: "" });
      try {
        await fillValid(f.form);
        await f.button.click();
        await f.fail.waitFor({ state: "visible" });
        assert.equal(f.requests.length, 0);
        assert.equal(await f.form.isVisible(), true);
      } finally {
        await f.close();
      }
    });

    test("required fields and email type are validated before sending", async () => {
      const f = await open(path, { respond: json({ ok: true }) });
      try {
        for (const field of ["name", "email", "message"]) {
          assert.equal(await f.form.locator(`[name="${field}"]`).getAttribute("required"), "", `${field} required`);
        }
        for (const field of ["phone", "organization"]) {
          assert.equal(await f.form.locator(`[name="${field}"]`).getAttribute("required"), null, `${field} optional`);
        }
        assert.equal(await f.form.locator('[name="email"]').getAttribute("type"), "email");
        assert.equal(await f.form.locator('[name="phone"]').getAttribute("type"), "tel");

        await f.button.click(); // all empty
        await fillValid(f.form);
        await f.form.locator('[name="email"]').fill("not-an-email");
        await f.button.click();
        await f.page.waitForTimeout(300);
        assert.equal(f.requests.length, 0);
        assert.equal(await f.wrapper.getAttribute("data-state"), null);
        assert.equal(await f.fail.isVisible(), false);
        assert.equal(await f.done.isVisible(), false);
        assert.equal(await f.form.locator('[name="email"]').evaluate((el) => el.validity.valid), false);
      } finally {
        await f.close();
      }
    });

    test("every visible field has a label; the honeypot is hidden from users and screen readers", async () => {
      const f = await open(path);
      try {
        for (const [field, label] of [
          ["name", "Họ và tên (*)"],
          ["email", "Email (*)"],
          ["phone", "Số điện thoại"],
          ["organization", "Đơn vị/Tổ chức"],
          ["message", "Nội dung liên hệ (*)"],
        ]) {
          assert.equal(await f.page.getByLabel(label, { exact: true }).getAttribute("name"), field);
        }

        const honeypot = f.form.locator('[name="website"]');
        assert.equal(await honeypot.count(), 1);
        // Clipped to at most 1x1 px (a visually-hidden box) and not part of the layout flow.
        const box = await honeypot.evaluate((el) => {
          const wrapper = el.closest('[aria-hidden="true"]');
          const r = wrapper.getBoundingClientRect();
          return { w: r.width, h: r.height, position: getComputedStyle(wrapper).position };
        });
        assert.ok(box.w <= 1 && box.h <= 1, JSON.stringify(box));
        assert.equal(box.position, "absolute");
        assert.equal(await honeypot.getAttribute("tabindex"), "-1");
        assert.equal(await honeypot.evaluate((el) => el.closest('[aria-hidden="true"]') !== null), true);
        const tree = await f.form.ariaSnapshot();
        assert.doesNotMatch(tree, /website/i, tree);
        // Tabbing from the last field goes to the submit button, not the honeypot.
        await f.form.locator('[name="message"]').focus();
        await f.page.keyboard.press("Tab");
        assert.equal(await f.page.evaluate(() => document.activeElement?.getAttribute("type")), "submit");
      } finally {
        await f.close();
      }
    });
  });
}

test("ContactForm pages found in dist/", { skip }, () => {
  assert.ok(pages.length > 0);
});
