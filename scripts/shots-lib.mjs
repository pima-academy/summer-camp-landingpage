// Pure helpers for scripts/shots.mjs, kept separate so they can be unit-tested.

import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

// Published pages from the spec's page table (#15); gap pages and dropped pages are not shot.
// Each page is shot at the same URL on the base build and the head build.
export const PAGES = [
  { name: "index", path: "/" },
  { name: "ve-chung-toi", path: "/ve-chung-toi/" },
  { name: "khoa-hoc", path: "/khoa-hoc/" },
  { name: "lien-he", path: "/lien-he/" },
  { name: "trai-he-toan-hoc-pima", path: "/trai-he-toan-hoc-pima/" },
  { name: "404", path: "/404.html" },
];

/** Pages named on the command line (with or without `.html`), or all pages when none are named. */
export function selectPages(args) {
  if (args.length === 0) return PAGES;
  return args.map((arg) => {
    const name = arg.replace(/\.html$/, "").replace(/^\/+|\/+$/g, "");
    const page = PAGES.find((p) => p.name === name);
    if (!page) {
      throw new Error(`Unknown page "${arg}". Known pages: ${PAGES.map((p) => p.name).join(", ")}`);
    }
    return page;
  });
}

export const DEFAULT_BASE = "origin/dev";

/**
 * Command line of `npm run shots`: page names, `--base <ref>` (or `--base=<ref>`), `--no-build`.
 * Returns `{ pages, base, build }`; throws on an unknown flag or a `--base` without a ref.
 */
export function parseArgs(args) {
  const names = [];
  let base = DEFAULT_BASE;
  let build = true;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--no-build") build = false;
    else if (arg === "--base") {
      base = args[++i];
      if (!base || base.startsWith("--")) throw new Error("--base needs a git ref, e.g. --base origin/dev");
    } else if (arg.startsWith("--base=")) {
      base = arg.slice("--base=".length);
      if (!base) throw new Error("--base needs a git ref, e.g. --base origin/dev");
    } else if (arg.startsWith("--")) throw new Error(`Unknown option ${arg}. Options: --base <ref>, --no-build`);
    else names.push(arg);
  }
  return { pages: selectPages(names), base, build };
}

/** `<page>-<width>-<base|head|diff>.png`: the three images of one page and width sort together. */
export function shotFileName(pageName, width, kind) {
  return `${pageName}-${width}-${kind}.png`;
}

const DIFF_COLOR = [255, 0, 0, 255];

/** The top-left `width` × `height` pixels of a decoded PNG, as RGBA bytes. */
function crop(image, width, height) {
  if (image.width === width && image.height === height) return image.data;
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    image.data.copy(out, y * width * 4, y * image.width * 4, (y * image.width + width) * 4);
  }
  return out;
}

/**
 * Compares two full-page screenshots (PNG buffers). The part both share is compared with
 * pixelmatch; rows or columns only one side has (the pages differ in height) all count as
 * different. Returns `{ share, baseHeight, headHeight, diff }`: `share` is the differing
 * fraction of the larger area (0–1), `diff` a PNG with differing pixels in red.
 */
export function compareShots(basePng, headPng) {
  const base = PNG.sync.read(basePng);
  const head = PNG.sync.read(headPng);
  const width = Math.max(base.width, head.width);
  const height = Math.max(base.height, head.height);
  const overlapWidth = Math.min(base.width, head.width);
  const overlapHeight = Math.min(base.height, head.height);

  const overlapDiff = new PNG({ width: overlapWidth, height: overlapHeight });
  const overlapDiffering = pixelmatch(
    crop(base, overlapWidth, overlapHeight),
    crop(head, overlapWidth, overlapHeight),
    overlapDiff.data,
    overlapWidth,
    overlapHeight,
  );

  const diff = new PNG({ width, height });
  for (let i = 0; i < width * height; i++) diff.data.set(DIFF_COLOR, i * 4);
  for (let y = 0; y < overlapHeight; y++) {
    overlapDiff.data.copy(diff.data, y * width * 4, y * overlapWidth * 4, (y + 1) * overlapWidth * 4);
  }

  const differing = overlapDiffering + (width * height - overlapWidth * overlapHeight);
  return { share: differing / (width * height), baseHeight: base.height, headHeight: head.height, diff: PNG.sync.write(diff) };
}

/** One report line: `index @ 390px: 0.00 % differ`, plus the heights when they differ. */
export function formatComparison({ page, width, share, baseHeight, headHeight }) {
  let line = `${page} @ ${width}px: ${(share * 100).toFixed(2)} % differ`;
  if (baseHeight !== headHeight) {
    const delta = headHeight - baseHeight;
    line += `, height ${baseHeight} → ${headHeight} px (${delta > 0 ? "+" : ""}${delta})`;
  }
  return line;
}

const LOCAL_HOSTS =new Set(["localhost", "127.0.0.1", "[::1]"]);

// Hosts of the contact form backends: the Apps Script, and Webflow's form API (in case a base ref still posts there).
const FORM_HOSTS = ["script.google.com", "script.googleusercontent.com"];
const FORM_URL_PREFIXES = ["https://webflow.com/api/"];

function isLocalUrl(url) {
  try {
    const { protocol, hostname } = new URL(url);
    return (protocol === "http:" || protocol === "https:") && LOCAL_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

/** Throws unless `url` is an http(s) URL on localhost. */
export function assertLocalUrl(url) {
  if (!isLocalUrl(url)) throw new Error(`Refusing to open ${url}: only localhost URLs are allowed`);
}

/**
 * Whether the browser must abort a request: anything that could deliver a contact form
 * submission (form backends, `extraBlockedUrls` such as the endpoint in site.ts, any method
 * other than GET/HEAD) and any main-frame navigation away from localhost.
 */
export function isBlockedRequest({ url, method, isNavigation }, extraBlockedUrls = []) {
  if (method !== "GET" && method !== "HEAD") return true;
  if (isNavigation && !isLocalUrl(url)) return true;
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return true;
  }
  if (FORM_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`))) return true;
  return [...FORM_URL_PREFIXES, ...extraBlockedUrls].some((prefix) => url.startsWith(prefix));
}
