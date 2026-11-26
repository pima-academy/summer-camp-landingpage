// Shared helpers for scripts/*.test.mjs. Not a test file itself (no `.test.` in the name).
import { createReadStream, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

/** Repo root and the build output, both with a trailing separator. */
export const root = fileURLToPath(new URL("../", import.meta.url));
export const dist = join(root, "dist") + sep;

/**
 * `skip` option for tests that read the build: false when dist/ has been built,
 * else the reason shown by `node --test`.
 */
export const distSkip = existsSync(join(dist, "index.html")) ? false : "dist/ missing: run `npm run build` first";

/** Every file under `dir`, recursively ([] when `dir` does not exist). */
export function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}

/** Every built .html file. */
export const builtHtmlFiles = () => walk(dist).filter((f) => f.endsWith(".html"));

/** A built file's text, by its path under dist/ (e.g. "khoa-hoc/index.html"); "" when missing. */
export function readBuilt(path) {
  const file = join(dist, path);
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

/** The content of the first <main> of a page. */
export const mainOf = (html) => html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] ?? "";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

/** Serves dist/ on 127.0.0.1 (a directory serves its index.html). Resolves to its origin and close(). */
export async function serveDist() {
  const server = createServer((req, res) => {
    let path = normalize(join(dist, decodeURIComponent(new URL(req.url, "http://x").pathname)));
    if (!path.startsWith(dist) && path !== dist.slice(0, -1)) path = "";
    if (path && existsSync(path) && statSync(path).isDirectory()) path = join(path, "index.html");
    if (!path || !existsSync(path)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[extname(path)] ?? "application/octet-stream" });
    createReadStream(path).pipe(res);
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}
