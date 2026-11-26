// npm run shots [-- <page> ...] [--no-build]
//
// Builds the rebuild, serves dist/ (new) and site/ (old) on two localhost ports, and saves
// full-page screenshots of each page at 390, 820 and 1440 px into shots/ (git-ignored).
// Pages come from PAGES in shots-lib.mjs; with no page names, every published page is shot.
//
// Safety (spec #15): only localhost URLs are opened, and every request that could deliver a
// contact form submission is aborted (see isBlockedRequest).

import { spawnSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { assertLocalUrl, isBlockedRequest, selectPages, shotFileName } from "./shots-lib.mjs";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const OUT_DIR = join(ROOT, "shots");
const WIDTHS = [390, 820, 1440];
const VIEWPORT_HEIGHT = 900;
const SIDES = [
  { side: "old", dir: join(ROOT, "site"), pathOf: (page) => page.oldPath },
  { side: "new", dir: join(ROOT, "dist"), pathOf: (page) => page.newPath },
];

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

/** The file a URL path maps to inside `dir` (`/x/` → `x/index.html`), or null if outside or missing. */
function fileFor(dir, urlPath) {
  let path = decodeURIComponent(urlPath.split("?")[0]);
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(dir, path));
  if (file !== dir && !file.startsWith(dir + sep)) return null;
  if (existsSync(file) && statSync(file).isDirectory()) return fileFor(dir, urlPath.split("?")[0] + "/");
  return existsSync(file) ? file : null;
}

function serve(dir) {
  const server = createServer((req, res) => {
    const file = fileFor(dir, req.url ?? "/");
    if (!file) {
      res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
      return;
    }
    res.writeHead(200, { "content-type": CONTENT_TYPES[extname(file).toLowerCase()] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

/** URLs written next to an "endpoint" key in src/data/site.ts (the contact form endpoint), if any. */
function formEndpointsFromSiteData() {
  const file = join(ROOT, "src/data/site.ts");
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => /endpoint/i.test(line))
    .flatMap((line) => line.match(/https?:\/\/[^\s"'`]+/g) ?? []);
}

/** Scroll to the bottom in steps so lazy images load and fade-ups play, then wait for them to settle. */
async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((ok) => setTimeout(ok, ms));
    // Lazy images off the scroll path (hidden slides) would otherwise never load.
    for (const img of document.querySelectorAll('img[loading="lazy"]')) img.loading = "eager";
    for (let i = 0; i < 200; i++) {
      const before = window.scrollY;
      // "instant": the rebuild has `scroll-behavior: smooth`, which would animate these.
      window.scrollBy({ top: Math.round(window.innerHeight * 0.7), behavior: "instant" });
      await pause(150);
      if (window.scrollY === before) break;
    }
    await Promise.race([
      Promise.all(
        Array.from(document.images, (img) =>
          img.complete
            ? null
            : new Promise((ok) => {
                img.addEventListener("load", ok, { once: true });
                img.addEventListener("error", ok, { once: true });
              }),
        ),
      ),
      pause(15000),
    ]);
    await pause(1500); // fade-ups run 1000 ms
    window.scrollTo({ top: 0, behavior: "instant" });
    await pause(500);
  });
  await page.evaluate(() => document.fonts.ready);
}

async function capture(browser, url, width, file, blockedUrls) {
  assertLocalUrl(url);
  const context = await browser.newContext({
    viewport: { width, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: 1,
    serviceWorkers: "block",
  });
  try {
    const page = await context.newPage();
    await page.route("**/*", (route) => {
      const request = route.request();
      const isNavigation = request.isNavigationRequest() && request.frame() === page.mainFrame();
      const blocked = isBlockedRequest({ url: request.url(), method: request.method(), isNavigation }, blockedUrls);
      if (blocked) console.log(`  blocked ${request.method()} ${request.url()}`);
      return blocked ? route.abort("blockedbyclient") : route.continue();
    });
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await settle(page);
    await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
  } finally {
    await context.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const pages = selectPages(args.filter((a) => !a.startsWith("--")));

  if (!args.includes("--no-build")) {
    const build = spawnSync("npm", ["run", "build"], { cwd: ROOT, stdio: "inherit" });
    if (build.status !== 0) process.exit(build.status ?? 1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  for (const name of readdirSync(OUT_DIR)) {
    if (pages.some((p) => name.startsWith(`${p.name}_`))) rmSync(join(OUT_DIR, name));
  }

  const blockedUrls = formEndpointsFromSiteData();
  const servers = await Promise.all(SIDES.map((s) => serve(s.dir)));
  const browser = await chromium.launch({ headless: true });
  const missing = [];
  let saved = 0;
  try {
    for (const page of pages) {
      for (const [i, { side, dir, pathOf }] of SIDES.entries()) {
        if (!fileFor(dir, pathOf(page))) {
          missing.push(`${side} ${page.name}`);
          continue;
        }
        const url = `http://localhost:${servers[i].address().port}${pathOf(page)}`;
        for (const width of WIDTHS) {
          const file = join(OUT_DIR, shotFileName(page.name, width, side));
          console.log(`${side} ${page.name} @ ${width}px`);
          await capture(browser, url, width, file, blockedUrls);
          saved++;
        }
      }
    }
  } finally {
    await browser.close();
    servers.forEach((s) => s.close());
  }
  console.log(`\nSaved ${saved} screenshots to ${OUT_DIR}`);
  if (missing.length) console.log(`Not built yet (skipped): ${missing.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
