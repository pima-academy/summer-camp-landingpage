// Checks the Vietnamese 404 page on the built output, and that `astro preview`
// serves it for unknown routes (the dev-only [...gap].astro catch-all must not
// swallow them). Needs a fresh `npm run build`; skipped when dist/ is missing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import { dist, distSkip as skip, readBuilt, root } from "./test-lib.mjs";

const html = readBuilt("404.html");
const main = html.match(/<main>([\s\S]*)<\/main>/)?.[1] ?? "";

test("404 page has a Vietnamese title and is noindex", { skip }, () => {
  assert.match(html, /<title>Không tìm thấy trang<\/title>/);
  assert.match(html, /<meta name="robots" content="noindex">/);
  // Served at any missing URL, so a canonical pointing at /404 would be wrong.
  assert.doesNotMatch(html, /rel="canonical"/);
  assert.doesNotMatch(html, /property="og:url"/);
});

test("404 page has the site chrome, one heading, one line and a button home", { skip }, () => {
  assert.match(html, /<div class="nav[ "]/, "nav");
  assert.match(html, /<footer[^>]*class="footer/, "footer");
  const headings = [...main.matchAll(/<h[1-6][\s>]/g)];
  assert.equal(headings.length, 1, "one heading in <main>");
  assert.match(main, /<h1[^>]*>Không tìm thấy trang<\/h1>/);
  assert.match(main, /<a href="\/" class="button[^"]*"[^>]*>[^<]+<\/a>/);
  assert.doesNotMatch(main, /<img/, "no illustration");
  assert.doesNotMatch(html, /Page Not Found|doesn&#x27;t exist/);
});

test("404 page is not in the sitemap", { skip }, () => {
  const maps = readdirSync(dist).filter((f) => /^sitemap.*\.xml$/.test(f));
  assert.ok(maps.length > 0);
  for (const f of maps) assert.doesNotMatch(readBuilt(f), /404/, f);
});

const freePort = () =>
  new Promise((resolve) => {
    const s = createServer().listen(0, "127.0.0.1", () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });

test("astro preview serves the 404 page for unknown routes", { skip, timeout: 60_000 }, async () => {
  const port = await freePort();
  const astro = join(root, "node_modules", ".bin", "astro");
  // --ignore-lock: without it, Astro 7 refuses to start when another preview
  // holds the lock and may detach as a background server that outlives kill().
  const proc = spawn(astro, ["preview", "--ignore-lock", "--host", "127.0.0.1", "--port", String(port)], {
    cwd: root,
    stdio: "ignore",
  });
  try {
    const base = `http://127.0.0.1:${port}`;
    let res;
    for (let i = 0; i < 100 && !res; i++) {
      res = await fetch(`${base}/khong-co-trang-nay/`).catch(() => undefined);
      if (!res) await new Promise((r) => setTimeout(r, 200));
    }
    assert.ok(res, "preview server answered");
    assert.equal(res.status, 404);
    assert.match(await res.text(), /<title>Không tìm thấy trang<\/title>/);
  } finally {
    proc.kill();
  }
});
