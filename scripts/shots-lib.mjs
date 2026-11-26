// Pure helpers for scripts/shots.mjs, kept separate so they can be unit-tested.

// The one place that maps old-site files to rebuild URLs.
// Published pages from the spec's page table (#15); gap pages and dropped pages are not shot.
export const PAGES = [
  { name: "index", oldPath: "/index.html", newPath: "/" },
  { name: "ve-chung-toi", oldPath: "/ve-chung-toi.html", newPath: "/ve-chung-toi/" },
  { name: "khoa-hoc", oldPath: "/khoa-hoc.html", newPath: "/khoa-hoc/" },
  { name: "lien-he", oldPath: "/lien-he.html", newPath: "/lien-he/" },
  { name: "trai-he-toan-hoc-pima", oldPath: "/trai-he-toan-hoc-pima.html", newPath: "/trai-he-toan-hoc-pima/" },
  { name: "trai-he-toan-hoc-2025", oldPath: "/trai-he-toan-hoc-2025.html", newPath: "/trai-he-toan-hoc-2025/" },
  { name: "trai-he-pima-2026", oldPath: "/trai-he-pima-2026.html", newPath: "/trai-he-pima-2026/" },
  { name: "chi-tiet-trai-he", oldPath: "/chi-tiet-trai-he.html", newPath: "/chi-tiet-trai-he/" },
  { name: "404", oldPath: "/404.html", newPath: "/404.html" },
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

/** `<page>_<width padded to 4>_<old|new>.png`, so old/new of one page and width sort together. */
export function shotFileName(pageName, width, side) {
  return `${pageName}_${String(width).padStart(4, "0")}_${side}.png`;
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

// Hosts of the contact form backends: the Apps Script (rebuild) and Webflow's form API (old site).
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
