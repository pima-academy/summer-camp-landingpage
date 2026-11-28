// Drives ContactForm in headless Chromium against a MOCKED endpoint.
// Every request is answered by Playwright route interception: pages and assets
// from dist/, the endpoint by the mock, anything else aborted. Nothing reaches
// the network, so no real Apps Script is ever called.
// Runs on the Liên hệ page and home (the block's two uses); every page with the form has the
// one version.
// Needs a fresh `npm run build`; skipped when no built page has the form.
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, normalize, sep } from "node:path";
import { chromium } from "playwright";
import { buildSkip, builtHtmlFiles, dist } from "./test-lib.mjs";

const ORIGIN = "http://127.0.0.1:9"; // never contacted: every request is routed
const ENDPOINT = "https://contact-endpoint.test/exec"; // reserved .test TLD, mocked

/** The built pages with the form; every one must be the same single version (a multi-line message). */
function formFiles() {
  const files = new Map();
  for (const file of builtHtmlFiles()) {
    const html = readFileSync(file, "utf8");
    if (!html.includes("data-contact-form")) continue;
    const rel = file.slice(dist.length).split(sep).join("/");
    files.set("/" + rel.replace(/(^|\/)index\.html$/, "$1"), html);
  }
  return files;
}

const files = formFiles();
// Both uses of the block: the Liên hệ page (dark-green) and the band on every other page.
const pages = ["/lien-he/", "/"].filter((p) => files.has(p));

function distFile(pathname) {
  let path = decodeURIComponent(pathname);
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(dist, path));
  if (!file.startsWith(dist)) return null;
  return existsSync(file) && statSync(file).isFile() ? file : null;
}

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
    again: page.getByRole("button", { name: "Gửi lời nhắn khác" }),
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

for (const path of pages) {
  describe(`ContactForm (${path})`, { skip }, () => {
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
        assert.equal(await f.done.getByRole("heading", { level: 3 }).innerText(), "Đã gửi lời nhắn");
        assert.match(await f.done.innerText(), /Cảm ơn bạn đã liên hệ với PiMA\./);

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
      test(`error (${name}): the error message with the email and no phone, above the button, form and values kept`, async () => {
        const f = await open(path, { respond });
        try {
          await fillValid(f.form);
          await f.button.click();
          await f.fail.waitFor({ state: "visible" });
          assert.equal(await f.wrapper.getAttribute("data-state"), "fail");
          const text = await f.fail.innerText();
          assert.equal(text.trim(), "Chưa gửi được lời nhắn. Bạn vui lòng thử lại, hoặc gửi email cho PiMA tại contact@pimavn.com.");
          assert.equal(await f.fail.locator("a").getAttribute("href"), "mailto:contact@pimavn.com");
          const [alert, button] = [await f.fail.boundingBox(), await f.button.boundingBox()];
          assert.ok(alert.y + alert.height <= button.y, `alert ${JSON.stringify(alert)} above button ${JSON.stringify(button)}`);
          assert.equal(await f.form.isVisible(), true);
          assert.equal(await f.done.isVisible(), false);
          assert.equal(await f.form.locator('[name="message"]').inputValue(), "Xin chào PiMA");
          assert.equal(await f.button.inputValue(), "Gửi lời nhắn");
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
          ["name", "Họ và tên"],
          ["email", "Email"],
          ["phone", "Số điện thoại (không bắt buộc)"],
          ["organization", "Đơn vị hoặc tổ chức (không bắt buộc)"],
          ["message", "Nội dung"],
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

for (const path of pages) {
  describe(`ContactForm layout and sent state (${path})`, { skip }, () => {
    test("sent: 'Gửi lời nhắn khác' brings back an empty form", async () => {
      const f = await open(path, { respond: json({ ok: true }) });
      try {
        await fillValid(f.form);
        await f.button.click();
        await f.done.waitFor({ state: "visible" });
        await f.again.click();
        await f.form.waitFor({ state: "visible" });
        assert.equal(await f.wrapper.getAttribute("data-state"), null);
        assert.equal(await f.done.isVisible(), false);
        for (const field of ["name", "email", "phone", "organization", "message"]) {
          assert.equal(await f.form.locator(`[name="${field}"]`).inputValue(), "", field);
        }
        assert.equal(await f.page.evaluate(() => document.activeElement?.getAttribute("name")), "name");
      } finally {
        await f.close();
      }
    });

    test("fields: 48 px tall, no placeholders, two per row (one ≤ 479 px), a visible focus ring", async () => {
      for (const width of [1440, 820, 390]) {
        const f = await open(path);
        try {
          await f.page.setViewportSize({ width, height: 900 });
          const boxes = {};
          for (const field of ["name", "email", "phone", "organization", "message"]) {
            const el = f.form.locator(`[name="${field}"]`);
            assert.equal(await el.getAttribute("placeholder"), null, `${field} placeholder`);
            boxes[field] = await el.boundingBox();
          }
          for (const field of ["name", "email", "phone", "organization"]) {
            assert.equal(Math.round(boxes[field].height), 48, `${width} px: ${field} is ${boxes[field].height} px tall`);
          }
          assert.ok(boxes.message.height > 48, `${width} px: the message box takes several lines`);
          if (width > 479) {
            assert.equal(boxes.name.y, boxes.email.y, `${width} px: name and email side by side`);
            assert.equal(boxes.phone.y, boxes.organization.y, `${width} px: phone and organisation side by side`);
            assert.ok(Math.abs(boxes.message.width - (boxes.email.x + boxes.email.width - boxes.name.x)) < 1, `${width} px: message across both`);
          } else {
            assert.ok(boxes.email.y > boxes.name.y && boxes.organization.y > boxes.phone.y, `${width} px: one column`);
          }
          await f.form.locator('[name="name"]').focus();
          await f.page.keyboard.press("Tab");
          const ring = await f.form.locator('[name="email"]').evaluate((el) => getComputedStyle(el).outlineStyle);
          assert.notEqual(ring, "none", `${width} px: focus ring`);
        } finally {
          await f.close();
        }
      }
    });
  });
}

test("one version of the form: every page with it has the multi-line message box", { skip }, () => {
  for (const [path, html] of files) assert.match(html, /<textarea[^>]*name="message"/, path);
});

test("ContactForm pages found in dist/", { skip }, () => {
  assert.ok(pages.length > 0);
});
