// Webflow grid-placement ids: `w-node-<element>-<page>`. The stylesheet targets these ids
// (`#w-node-…-57c668ac { grid-area … }`), so a component shared by pages that Webflow
// exported separately rebuilds each page's id from the element id and the page id.
export const wNodeId = (element: string, page: string) => `w-node-${element}-${page}`;

/** Webflow page ids of the 2025 and 2026 camp pages. */
export const campPageIds = { 2025: "57c668ac", 2026: "485dbad8" } as const;
