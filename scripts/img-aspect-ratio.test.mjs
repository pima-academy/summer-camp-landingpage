// Images keep the aspect ratio of their width/height attributes before they load (#41).
// A stylesheet rule `aspect-ratio: auto` on an <img> cancels the ratio the browser derives
// from those attributes, so a lazy image is 0 px tall until it loads and the page jumps.
// Reads the sources only; no build needed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../src/", import.meta.url));

function files(dir, ext) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return files(p, ext);
    return p.endsWith(ext) ? [p] : [];
  });
}

// Classes put on <Image> / <img> anywhere in the components and pages.
const imgClasses = new Set();
for (const file of files(src, ".astro")) {
  for (const [tag] of readFileSync(file, "utf8").matchAll(/<(?:Image|img)\b[^>]*?\/?>/gs)) {
    const cls = tag.match(/\sclass="([^"]*)"/)?.[1];
    if (cls) for (const c of cls.split(/\s+/)) if (c) imgClasses.add(c);
  }
}

// Plain CSS rules (selector, body), including those nested one level in @media.
function rules(css) {
  const out = [];
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of clean.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) out.push([m[1].trim(), m[2]]);
  return out;
}

const targetsImg = (selector) =>
  selector.split(",").some((s) => {
    const last = s.trim().split(/[\s>+~]+/).pop();
    if (/^img(\W|$)/.test(last)) return true;
    return [...last.matchAll(/\.([\w-]+)/g)].some(([, c]) => imgClasses.has(c));
  });

test("the image class scan finds the classes used on <Image>", () => {
  assert.ok(imgClasses.has("header76_image"), "expected header76_image among the img classes");
});

test("no stylesheet rule sets aspect-ratio: auto on an <img>", () => {
  const offenders = [];
  for (const file of files(join(src, "styles"), ".css")) {
    for (const [selector, body] of rules(readFileSync(file, "utf8"))) {
      if (/aspect-ratio\s*:\s*auto\s*(;|$)/.test(body) && targetsImg(selector)) {
        offenders.push(`${file.slice(src.length)}: ${selector}`);
      }
    }
  }
  assert.deepEqual(offenders, []);
});
