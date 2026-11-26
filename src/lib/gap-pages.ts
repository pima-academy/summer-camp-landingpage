// Gap pages for the dev-only route `src/pages/[...gap].astro`. Kept in its own module so
// the route can import it dynamically in dev only: a static glob is expanded at build time
// and would emit the gap pages' images to dist/_astro even though no page uses them.
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

const pages = import.meta.glob<{ default: AstroComponentFactory }>("../gap-pages/**/*.astro", { eager: true });

/** Slug (path under src/gap-pages, without `.astro` or a trailing `/index`) and component. */
export const gapPages = Object.entries(pages).map(([file, mod]) => ({
  slug: file.replace(/^\.\.\/gap-pages\//, "").replace(/(\/index)?\.astro$/, ""),
  Page: mod.default,
}));
