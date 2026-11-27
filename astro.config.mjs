// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import { mathRehypePlugins, mathRemarkPlugins } from "./src/lib/markdown-math.ts";
import rehypeFigures from "./src/lib/rehype-figures.ts";

export default defineConfig({
  site: "https://pimavn.com",
  integrations: [sitemap()],
  // Blog posts (src/content/blog/, ADR 0007) go through remark/rehype.
  markdown: {
    processor: unified({
      // Formulas: `$…$` and `$$…$$` typeset by KaTeX at build time (#112).
      remarkPlugins: [...mathRemarkPlugins],
      rehypePlugins: [
        ...mathRehypePlugins,
        // Body images as figures opening the post's Lightbox (#113).
        rehypeFigures,
      ],
    }),
  },
  // The removed camp pages and /chi-tiet-trai-he/ (#107) point to their camp archive pages.
  // Astro builds each as an instant meta refresh with noindex and a canonical link, and the
  // sitemap leaves redirects out (scripts/redirects.test.mjs).
  redirects: {
    "/trai-he-toan-hoc-2025": "/trai-he-toan-hoc-pima/2025/",
    "/trai-he-pima-2026": "/trai-he-toan-hoc-pima/2026/",
    "/chi-tiet-trai-he": "/trai-he-toan-hoc-pima/2024/",
  },
});
