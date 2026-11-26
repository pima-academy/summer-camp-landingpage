// Build-time active-link rule for Nav and Footer (Webflow's `w--current`).
// Plain, erasable TypeScript so `node --test` can import it directly.

/** "/ve-chung-toi/index.html", "/ve-chung-toi" and "/ve-chung-toi/" all become "/ve-chung-toi". */
function normalize(path: string): string {
  const trimmed = path.replace(/index\.html$/, "").replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/**
 * Whether `href` points at the page being built (`pathname` = `Astro.url.pathname`).
 * Only root-relative links without a fragment can be current: an anchor link
 * points at a section, not at the page.
 */
export function isCurrent(href: string, pathname: string): boolean {
  if (!href.startsWith("/") || href.includes("#")) return false;
  return normalize(href) === normalize(pathname);
}
