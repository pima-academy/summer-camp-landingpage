// Drives the built home page in headless Chromium to check the Footer's layout and hover
// states. Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { distSkip as skip, serveDist } from "./test-lib.mjs";

let server, browser;

before(async () => {
  if (skip) return;
  server = await serveDist();
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.close();
});

async function open(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${server.origin}/`);
  return page;
}

// The brand cell is the logo link's grid item: the first child of the footer's top grid.
const brandCell = (page) =>
  page.evaluate(() => {
    const logo = document.querySelector('footer a[aria-label="PiMA, trang chủ"]');
    const cell = logo.parentElement;
    return { cell: cell.getBoundingClientRect().width, row: cell.parentElement.getBoundingClientRect().width };
  });

for (const width of [390, 600, 768, 991, 1440]) {
  test(`at ${width} px the footer's logo-and-name cell spans its row when stacked`, { skip }, async () => {
    const page = await open(width);
    const { cell, row } = await brandCell(page);
    if (width <= 991) assert.ok(Math.abs(cell - row) <= 1, `cell ${cell} px, row ${row} px`);
    else assert.ok(cell < row / 2, `beside the link columns: cell ${cell} px, row ${row} px`);
    await page.close();
  });
}

test("in the footer only links change colour on hover", { skip }, async () => {
  const page = await open(1440);
  const colourOf = (locator) => locator.evaluate((el) => getComputedStyle(el).color);
  const hovered = async (locator) => {
    const before = await colourOf(locator);
    await locator.hover();
    await page.waitForTimeout(300);
    const after = await colourOf(locator);
    await page.mouse.move(0, 0);
    return before !== after;
  };
  const footer = page.locator("footer");
  for (const label of ["Facebook", "Email", "Địa chỉ"]) {
    assert.equal(await hovered(footer.getByText(label, { exact: true })), false, `"${label}" is a label`);
  }
  const address = footer.locator(".contact").last().locator("div > div").last();
  assert.equal(await address.evaluate((el) => el.closest("a")), null, "the address is not a link");
  assert.equal(await hovered(address), false, "the address text");
  assert.equal(await hovered(footer.locator('a[href^="mailto:"]')), true, "the email link");
  assert.equal(await hovered(footer.locator("ul a").first()), true, "a column link");
  await page.close();
});
