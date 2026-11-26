// Browser pass against `astro dev`: selector liveness, classes in the DOM, #w-node targets,
// computed design values and text/background pairs at four widths.
// Usage: node live.mjs <repo> <static.json> <out.json> <baseUrl>
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const [repo, staticPath, out, base] = process.argv.slice(2);
const require = createRequire(path.join(repo, "package.json"));
const { chromium } = require("playwright");

const PAGES = ["/", "/ve-chung-toi/", "/khoa-hoc/", "/lien-he/", "/trai-he-toan-hoc-pima/", "/trai-he-toan-hoc-2025/",
  "/trai-he-pima-2026/", "/chi-tiet-trai-he/", "/404.html",
  "/detail-blog-event/", "/detail-course/", "/detail-teaching-staff-brief/", "/detail-team/", "/su-kien-blog/"];
const WIDTHS = [390, 600, 820, 1440];
const { rules } = JSON.parse(fs.readFileSync(staticPath, "utf8"));
const selectors = [...new Set(rules.filter((r) => !r.inKeyframes).flatMap((r) => r.selectors))];

const browser = await chromium.launch();
const result = { pages: {} };
for (const p of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // 404.html is only served by the dev server as the 404 route
  const url = p === "/404.html" ? base + "/no-such-page-xyz/" : base + p;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const pr = { url, widths: {} };
  pr.dom = await page.evaluate((selectors) => {
    const strip = (s) => s
      .replace(/:global\(([^()]*(?:\([^()]*\))?[^()]*)\)/g, "$1")
      .replace(/::?(before|after|placeholder|selection|marker|-webkit-[\w-]+|-moz-[\w-]+|-ms-[\w-]+)(\([^)]*\))?/g, "")
      .replace(/:is\(:hover,:focus-within\)/g, "")
      .replace(/::backdrop/g, "").replace(/\[open\]/g, "").replace(/:not\(\.js-ready\)/g, "")
      .replace(/\.(w--open|w--current|w-active|active|is-animated)(?![\w-])/g, "")
      .replace(/:(hover|focus-visible|focus-within|focus|active|visited|link|checked|disabled|invalid|valid|required|placeholder-shown|target)\b/g, "");
    const live = {};
    for (const s of selectors) {
      let q = strip(s).trim() || "*";
      try { live[s] = document.querySelectorAll(q).length; } catch { live[s] = -1; }
    }
    const classes = {};
    for (const el of document.querySelectorAll("body *, body")) for (const c of el.classList) {
      if (/^astro-|^data-astro/.test(c)) continue;
      classes[c] = (classes[c] || 0) + 1;
    }
    const wnodes = [...document.querySelectorAll("[id^='w-node-']")].map((el) => ({
      id: el.id, tag: el.tagName.toLowerCase(), cls: [...el.classList].join(" "),
      parent: [...(el.parentElement?.classList || [])].join(" "),
    }));
    return { live, classes, wnodes };
  }, selectors);
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(150);
    pr.widths[w] = await page.evaluate(() => {
      const label = (el) => {
        const c = [...el.classList].filter((x) => !x.startsWith("astro-")).slice(0, 2).join(".");
        return el.tagName.toLowerCase() + (c ? "." + c : "");
      };
      const sectionOf = (el) => {
        for (let e = el; e && e !== document.body; e = e.parentElement) {
          const s = [...e.classList].find((c) => /^section_|^section-|^navbar|^footer|^nav_/.test(c));
          if (s) return s;
          if (/^(NAV|FOOTER|HEADER)$/.test(e.tagName)) return e.tagName.toLowerCase();
        }
        return "body";
      };
      const visible = (el, cs) => cs.display !== "none" && cs.visibility !== "hidden" && el.getClientRects().length > 0;
      const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [a[0], a[1], a[2], a[3] ?? 1]; };
      const vals = {};
      const add = (k, v, el) => { if (v == null || v === "") return; const key = k + "|" + v; (vals[key] ||= { n: 0, where: {} }).n++; const where = sectionOf(el) + " " + label(el); vals[key].where[where] = (vals[key].where[where] || 0) + 1; };
      const pairs = [];
      for (const el of [document.documentElement, document.body, ...document.querySelectorAll("body *")]) {
        if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|svg|path|g|circle|rect|line|polyline|polygon|defs|clipPath|use)$/i.test(el.tagName)) continue;
        const cs = getComputedStyle(el);
        if (!visible(el, cs)) continue;
        const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (ownText) {
          add("color", cs.color, el); add("font-weight", cs.fontWeight, el); add("font-size", cs.fontSize, el);
          add("line-height", cs.lineHeight === "normal" ? "normal" : (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2), el);
          add("font-family", cs.fontFamily, el); add("letter-spacing", cs.letterSpacing, el);
          add("text-transform", cs.textTransform, el); add("font-style", cs.fontStyle, el);
          // effective background
          let bg = [0, 0, 0, 0], onImage = null;
          const layers = [];
          for (let e = el; e; e = e.parentElement) {
            const s = getComputedStyle(e);
            if (s.backgroundImage !== "none") { onImage = label(e) + " " + s.backgroundImage.slice(0, 40); break; }
            const c = parse(s.backgroundColor);
            if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
          }
          let acc = [255, 255, 255];
          for (const l of layers.reverse()) acc = acc.map((v, i) => v * (1 - l[3]) + l[i] * l[3]);
          const fg = parse(cs.color);
          const fgc = fg ? acc.map((v, i) => v * (1 - fg[3]) + fg[i] * fg[3]) : acc;
          pairs.push({
            fg: fgc.map(Math.round), bg: acc.map(Math.round), onImage, size: parseFloat(cs.fontSize), weight: +cs.fontWeight,
            where: sectionOf(el) + " " + label(el), text: el.textContent.trim().slice(0, 40),
            opacity: (() => { let o = 1; for (let e = el; e; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; })(),
          });
        }
        add("background-color", cs.backgroundColor === "rgba(0, 0, 0, 0)" ? null : cs.backgroundColor, el);
        if (cs.backgroundImage !== "none") add("background-image", cs.backgroundImage.slice(0, 80), el);
        for (const side of ["Top", "Right", "Bottom", "Left"]) {
          if (parseFloat(cs[`border${side}Width`]) > 0 && cs[`border${side}Style`] !== "none") {
            add("border-color", cs[`border${side}Color`], el); add("border-width", cs[`border${side}Width`], el);
          }
        }
        const r = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius];
        if (r.some((x) => x !== "0px")) add("border-radius", [...new Set(r)].join(" "), el);
        if (cs.boxShadow !== "none") add("box-shadow", cs.boxShadow, el);
        for (const k of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "marginTop", "marginBottom", "rowGap", "columnGap"]) {
          const v = cs[k]; if (v && v !== "0px" && v !== "normal" && v !== "auto") add("spacing", v, el);
        }
        if (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) add("outline", cs.outlineColor + " " + cs.outlineWidth, el);
        if (cs.opacity !== "1") add("opacity", cs.opacity, el);
      }
      return { vals, pairs };
    });
  }
  result.pages[p] = pr;
  await page.close();
  console.error("done", p);
}
await browser.close();
fs.writeFileSync(out, JSON.stringify(result));
