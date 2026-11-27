// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://pimavn.com",
  integrations: [sitemap()],
  // PROTOTYPE worktree only: node_modules is a symlink to the main checkout, so Vite must be
  // allowed to serve files from there (the Nunito Sans woff2 files), or the page falls back to
  // the system sans-serif.
  vite: { server: { fs: { allow: ["/home/enoch/pima/1/summer-camp-landingpage"] } } },
});
