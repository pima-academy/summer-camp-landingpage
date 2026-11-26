// Static parse of the site's CSS: every rule (file, line, media, selector, decls), custom properties.
// Usage: node static.mjs <repo> <out.json>
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const [repo, out] = process.argv.slice(2);
const require = createRequire(path.join(repo, "package.json"));
const csstree = require("css-tree");

const sources = [];
for (const f of ["fonts.css", "normalize.css", "webflow.css", "pima-website.webflow.css", "animations.css"]) {
  sources.push({ file: `src/styles/${f}`, css: fs.readFileSync(path.join(repo, "src/styles", f), "utf8"), lineOffset: 0 });
}
function walkDir(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walkDir(path.join(d, e.name)) : e.name.endsWith(".astro") ? [path.join(d, e.name)] : []);
}
for (const dir of ["src/components", "src/pages", "src/layouts", "src/gap-pages"]) {
  for (const f of walkDir(path.join(repo, dir))) {
    const txt = fs.readFileSync(f, "utf8");
    for (const m of txt.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)) {
      const lineOffset = txt.slice(0, m.index).split("\n").length - 1;
      sources.push({ file: path.relative(repo, f), css: m[2], lineOffset, global: /is:global/.test(m[1]) });
    }
  }
}

const rules = [];
const customProps = [];
for (const src of sources) {
  const ast = csstree.parse(src.css, { positions: true, parseValue: false, parseCustomProperty: false });
  const ctx = [];
  csstree.walk(ast, {
    enter(node) {
      if (node.type === "Atrule" && node.prelude) ctx.push(`@${node.name} ${csstree.generate(node.prelude)}`);
      if (node.type === "Rule") {
        const sel = csstree.generate(node.prelude);
        const decls = [];
        node.block.children.forEach((d) => {
          if (d.type !== "Declaration") return;
          const value = (typeof d.value === "string" ? d.value : d.value.value ?? csstree.generate(d.value)).trim();
          decls.push({ prop: d.property, value, important: !!d.important });
          if (d.property.startsWith("--")) customProps.push({ name: d.property, value, file: src.file, sel, media: ctx.join(" ") });
        });
        rules.push({
          file: src.file, line: node.loc.start.line + src.lineOffset, media: ctx.filter((c) => c.startsWith("@media")).join(" "),
          inKeyframes: ctx.some((c) => c.includes("keyframes")), sel, selectors: node.prelude.type === "SelectorList"
            ? node.prelude.children.toArray().map((s) => csstree.generate(s)) : [sel], decls,
        });
      }
    },
    leave(node) { if (node.type === "Atrule" && node.prelude) ctx.pop(); },
  });
}
fs.writeFileSync(out, JSON.stringify({ rules, customProps }, null, 1));
console.log(rules.length, "rules,", customProps.length, "custom property declarations,", sources.length, "sources");
