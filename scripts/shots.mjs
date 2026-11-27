// npm run shots [-- <page> ...] [--base <ref>] [--no-build]
//
// Compares a base ref with the working tree, page by page. Builds the base ref (default
// origin/dev) in a temporary git worktree and the working tree (unless --no-build), serves each
// dist/ on its own localhost port, and takes full-page screenshots of each page at 390, 820 and
// 1440 px. Writes shots/<page>-<width>-base.png, -head.png and -diff.png (git-ignored) and prints
// the share of differing pixels per page and width, plus the height difference when the page
// heights differ. There is no threshold: the numbers are for the reader, the exit code ignores them.
//
// The base worktree reuses this checkout's node_modules when both package-lock.json files are
// equal, and runs its own `npm ci` otherwise. It is removed afterwards, also on failure.
// Pages come from PAGES in shots-lib.mjs; with no page names, every published page is shot.
//
// Safety (spec #15): only localhost URLs are opened, and every request that could deliver a
// contact form submission is aborted (see isBlockedRequest).

import { spawnSync } from "node:child_process";
import {
  createReadStream,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { assertLocalUrl, compareShots, formatComparison, isBlockedRequest, parseArgs, shotFileName } from "./shots-lib.mjs";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const OUT_DIR = join(ROOT, "shots");
const WIDTHS = [390, 820, 1440];
const VIEWPORT_HEIGHT = 900;

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

/** Runs a command, streaming its output; throws when it fails. */
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`\`${command} ${args.join(" ")}\` failed in ${cwd} (${result.signal ?? `exit ${result.status}`})`);
  }
}

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

/** URLs written next to an "endpoint" key in `<root>/src/data/site.ts` (the contact form endpoint), if any. */
function formEndpointsFromSiteData(root) {
  const file = join(root, "src/data/site.ts");
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => /endpoint/i.test(line))
    .flatMap((line) => line.match(/https?:\/\/[^\s"'`]+/g) ?? []);
}

/** The commit `ref` names; throws when there is none. */
function resolveRef(ref) {
  const commit = spawnSync("git", ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`], { cwd: ROOT, encoding: "utf8" });
  if (commit.status !== 0) throw new Error(`Unknown base ref "${ref}". Fetch it or pass --base <ref>.`);
  return commit.stdout.trim();
}

/** Deletes the base worktree at `dir`, if it exists. */
function removeBaseWorktree(dir) {
  if (!existsSync(dir)) return;
  // Unlink a borrowed node_modules first, so nothing below can reach into this checkout's copy.
  const modules = join(dir, "node_modules");
  if (existsSync(modules) && lstatSync(modules).isSymbolicLink()) unlinkSync(modules);
  const removed = spawnSync("git", ["worktree", "remove", "--force", dir], { cwd: ROOT, stdio: "ignore" });
  if (removed.status !== 0) {
    rmSync(dir, { recursive: true, force: true });
    spawnSync("git", ["worktree", "prune"], { cwd: ROOT, stdio: "ignore" });
  }
}

/** Checks out `sha` in the empty directory `dir` as a git worktree, installs and builds it. */
function buildBase(sha, dir) {
  run("git", ["worktree", "add", "--detach", dir, sha], ROOT);
  const lock = (root) => {
    const file = join(root, "package-lock.json");
    return existsSync(file) ? readFileSync(file, "utf8") : null;
  };
  if (lock(dir) !== null && lock(dir) === lock(ROOT) && existsSync(join(ROOT, "node_modules"))) {
    console.log("Base package-lock.json equals the head's: reusing node_modules");
    symlinkSync(join(ROOT, "node_modules"), join(dir, "node_modules"), "dir");
  } else {
    console.log("Base package-lock.json differs from the head's: running npm ci in the base worktree");
    run("npm", ["ci"], dir);
  }
  run("npm", ["run", "build"], dir);
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
      // "instant": the site sets `scroll-behavior: smooth`, which would leave the page mid-scroll.
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

/** Shoots each page on every side ({ kind, root, dist }), writes the diffs, returns the report lines. */
async function shoot(sides, pages) {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const name of readdirSync(OUT_DIR)) {
    if (pages.some((p) => new RegExp(`^${p.name}-\\d+-(base|head|diff)\\.png$`).test(name))) rmSync(join(OUT_DIR, name));
  }

  const blockedUrls = sides.flatMap((s) => formEndpointsFromSiteData(s.root));
  const servers = await Promise.all(sides.map((s) => serve(s.dist)));
  const browser = await chromium.launch({ headless: true });
  const lines = [];
  try {
    for (const page of pages) {
      const missing = sides.filter((s) => !fileFor(s.dist, page.path)).map((s) => s.kind);
      if (missing.length) {
        lines.push(`${page.name}: not built on ${missing.join(" and ")}, skipped`);
        continue;
      }
      for (const width of WIDTHS) {
        const files = {};
        for (const [i, side] of sides.entries()) {
          files[side.kind] = join(OUT_DIR, shotFileName(page.name, width, side.kind));
          console.log(`${side.kind} ${page.name} @ ${width}px`);
          const url = `http://localhost:${servers[i].address().port}${page.path}`;
          await capture(browser, url, width, files[side.kind], blockedUrls);
        }
        const result = compareShots(readFileSync(files.base), readFileSync(files.head));
        writeFileSync(join(OUT_DIR, shotFileName(page.name, width, "diff")), result.diff);
        lines.push(formatComparison({ page: page.name, width, ...result }));
      }
    }
  } finally {
    await browser.close();
    servers.forEach((s) => s.close());
  }
  return lines;
}

async function main() {
  const { pages, base: ref, build } = parseArgs(process.argv.slice(2));

  if (build) run("npm", ["run", "build"], ROOT);
  if (!existsSync(join(ROOT, "dist"))) throw new Error("No dist/ to compare: run without --no-build");

  const sha = resolveRef(ref);
  const baseDir = mkdtempSync(join(tmpdir(), "pimavn-shots-base-"));
  // Registered before the worktree exists: with a listener, Ctrl-C during a child build lets the
  // child die and this process remove the worktree instead of exiting on the spot.
  const onSignal = (signal) => {
    removeBaseWorktree(baseDir);
    process.exit(signal === "SIGINT" ? 130 : 143);
  };
  process.once("SIGINT", onSignal);
  process.once("SIGTERM", onSignal);
  try {
    console.log(`\nBase: ${ref} (${sha.slice(0, 10)}) in ${baseDir}`);
    buildBase(sha, baseDir);
    const lines = await shoot(
      [
        { kind: "base", root: baseDir, dist: join(baseDir, "dist") },
        { kind: "head", root: ROOT, dist: join(ROOT, "dist") },
      ],
      pages,
    );
    console.log(`\nDifferences between ${ref} (base) and the working tree (head), images in ${OUT_DIR}:`);
    for (const line of lines) console.log(`  ${line}`);
  } finally {
    removeBaseWorktree(baseDir);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
