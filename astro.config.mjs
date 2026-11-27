// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://pimavn.com",
  integrations: [sitemap()],
  // The removed camp pages and /chi-tiet-trai-he/ (#107) point to their camp archive pages.
  // Astro builds each as an instant meta refresh with noindex and a canonical link, and the
  // sitemap leaves redirects out (scripts/redirects.test.mjs).
  redirects: {
    "/trai-he-toan-hoc-2025": "/trai-he-toan-hoc-pima/2025/",
    "/trai-he-pima-2026": "/trai-he-toan-hoc-pima/2026/",
    "/chi-tiet-trai-he": "/trai-he-toan-hoc-pima/2024/",
  },
});
