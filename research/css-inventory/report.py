"""Aggregate static.json + live.json into Markdown sections of the CSS inventory."""
import json, re, sys, os, collections, math, subprocess

S, REPO = sys.argv[1], sys.argv[2]
St = json.load(open(f"{S}/static.json"))
L = json.load(open(f"{S}/" + (sys.argv[3] if len(sys.argv) > 3 else "live.json")))
PAGES = list(L["pages"])
GAP = {"/detail-blog-event/", "/detail-course/", "/detail-teaching-staff-brief/", "/detail-team/", "/su-kien-blog/"}
out = []
w = out.append

# ---------------------------------------------------------------- liveness
live = collections.Counter()
for p in PAGES:
    for s, n in L["pages"][p]["dom"]["live"].items():
        if n > 0: live[s] += n
        elif n < 0: live.setdefault(s, 0)
STATE = re.compile(r"\.(w--open|w--current|w-active|active|is-animated|js-ready)\b")
def rule_live(r):
    return any(live.get(s, 0) > 0 for s in r["selectors"])
rules = [r for r in St["rules"] if not r["inKeyframes"]]
w("## CSS sources and rule liveness\n")
w("A rule is **live** when at least one of its selectors matches an element on at least one of the 14 pages "
  "(9 published + 5 dev-only gap pages), after stripping pseudo-classes/elements and unwrapping `:global()`. "
  "Media queries are ignored for liveness (all are `max-width`, so each applies at some width).\n")
w("| Source | Rules | Live | Dead | Declarations (live) |\n|---|--:|--:|--:|--:|")
byfile = collections.defaultdict(list)
for r in rules: byfile[r["file"]].append(r)
tot = [0, 0, 0, 0]
for f, rs in byfile.items():
    lv = [r for r in rs if rule_live(r)]
    dl = sum(len(r["decls"]) for r in lv)
    w(f"| `{f}` | {len(rs)} | {len(lv)} | {len(rs)-len(lv)} | {dl} |")
    tot = [tot[0]+len(rs), tot[1]+len(lv), tot[2]+len(rs)-len(lv), tot[3]+dl]
w(f"| **Total** | {tot[0]} | {tot[1]} | {tot[2]} | {tot[3]} |\n")
dead_pw = [r for r in byfile["src/styles/pima-website.webflow.css"] if not rule_live(r)]
w(f"Dead rules in `pima-website.webflow.css` ({len(dead_pw)}), by selector kind: " + ", ".join(
    f"{k} {v}" for k, v in collections.Counter(
        "`:root`/element" if not re.search(r"[.#]", r["sel"]) else "`#w-node`" if "#w-node" in r["sel"]
        else "`w-*`" if re.search(r"\.w-", r["sel"]) else "class" for r in dead_pw).most_common()) + ".")
w("")
mq = collections.Counter(r["media"] for r in rules if r["media"])
w("Breakpoints (media queries, rule counts): " + ", ".join(f"`{k.replace('@media ','')}` {v}" for k, v in mq.most_common()) + ".\n")

# ---------------------------------------------------------------- classes
used = collections.Counter(); used_pages = collections.defaultdict(set)
for p in PAGES:
    for c, n in L["pages"][p]["dom"]["classes"].items():
        if c.startswith("w-node-"): continue
        used[c] += n; used_pages[c].add(p)
defined = set(); defined_in = collections.defaultdict(set)
for r in rules:
    for s in r["selectors"]:
        for c in re.findall(r"\.(-?[_a-zA-Z][\w-]*)", s):
            if c.startswith("w-node-"): continue
            defined.add(c); defined_in[c].add(r["file"])
UTIL = re.compile(r"^(padding-|margin-|spacer-|container|max-width-|text-style-|text-size-|text-weight-|text-align-|text-color-|"
                  r"heading-style-|background-|align-|hide-|flex-|grid-gap-|grid-layout|icon-embed-|icon-|utility-|is-|layer|"
                  r"desktop-|mobile-|tablet-|small-container|button$|button-|divider|section$|border-top|secondary-color|text-link$|"
                  r"overflow-|z-index-|pointer-events-)")
AUTO = re.compile(r"^(div-block|text-block|image|heading|paragraph|bold-text|collection-|link-block|tag|next|previous|"
                  r"text-field|textarea|section)-?\d*$|^(collection-item|collection-list|collection-list-wrapper)(-\d+)?$")
OWN = set()
for f, rs in byfile.items():
    if f.endswith(".astro") or f.endswith("animations.css"):
        for r in rs:
            OWN.update(re.findall(r"\.(-?[_a-zA-Z][\w-]*)", r["sel"]))
def kind(c):
    if c.startswith("w-") : return "webflow-runtime"
    if c in ("active", "js-ready") or c.startswith("iconify"): return "state/js"
    if AUTO.match(c): return "webflow-autonamed"
    if UTIL.match(c): return "utility"
    if "_" in c: return "section-specific"
    if c in OWN and c not in defined_in or (c in OWN and all(f.endswith(".astro") or f.endswith("animations.css") for f in defined_in[c])):
        return "rebuild-own"
    return "named-component"
KINDS = ["utility", "section-specific", "named-component", "webflow-autonamed", "webflow-runtime", "rebuild-own", "state/js"]
w("## Class usage\n")
w("Classes found in the rendered DOM of the 14 pages (Playwright, after scripts ran), excluding `w-node-…` (next section). Kinds:\n"
  "- **utility**: Client-First layout/text utilities (`padding-*`, `margin-*`, `spacer-*`, `container-*`, `max-width-*`, `text-style-*`, `text-size-*`, `heading-style-*`, `background-*`, `is-*` modifiers, `icon-embed-*`, `utility-*`…).\n"
  "- **section-specific**: Client-First `block_element` names with an underscore (`section_impact`, `impact_*`, Relume `layout351_*`, `team3_*`, `header126_*`…).\n"
  "- **named-component**: hyphen names that are neither utilities nor auto-named (`nav-link`, `course-listing-card`, `footer-social-link`…).\n"
  "- **webflow-autonamed**: Webflow default names (`div-block-12`, `text-block-7`, `image-15`, `heading-3`, `bold-text-4`, `paragraph-5`…).\n"
  "- **webflow-runtime**: `w-*` classes from `webflow.css` and Webflow's JS conventions.\n"
  "- **rebuild-own**: defined only in Astro component `<style>` blocks or `animations.css`.\n"
  "- **state/js**: set by scripts (`active`, `js-ready`) or by inlined icon SVG (`iconify*`).\n")
kc = collections.Counter(kind(c) for c in used)
ku = collections.Counter();
for c, n in used.items(): ku[kind(c)] += n
w("| Kind | Distinct classes | Occurrences | Defined in CSS | Used but not defined |\n|---|--:|--:|--:|--:|")
for k in KINDS:
    cs = [c for c in used if kind(c) == k]
    w(f"| {k} | {len(cs)} | {ku[k]} | {sum(1 for c in cs if c in defined)} | {sum(1 for c in cs if c not in defined)} |")
w(f"| **Total** | {len(used)} | {sum(used.values())} | {sum(1 for c in used if c in defined)} | {sum(1 for c in used if c not in defined)} |\n")

w("### Per page\n")
w("| Page | " + " | ".join(KINDS) + " | distinct total |\n|---|" + "--:|" * (len(KINDS) + 1))
for p in PAGES:
    cl = {c for c in L["pages"][p]["dom"]["classes"] if not c.startswith("w-node-")}
    cnt = collections.Counter(kind(c) for c in cl)
    w(f"| `{p}`{' (gap)' if p in GAP else ''} | " + " | ".join(str(cnt[k]) for k in KINDS) + f" | {len(cl)} |")
w("")

# per component: static presence of used class tokens in src files
srcfiles = []
for d in ["src/components", "src/layouts", "src/pages", "src/gap-pages"]:
    for root, _, fs in os.walk(os.path.join(REPO, d)):
        srcfiles += [os.path.join(root, f) for f in fs if f.endswith((".astro", ".ts"))]
text = {os.path.relpath(f, REPO): open(f).read() for f in srcfiles}
w("### Per source file\n")
w("Distinct classes (of those in the DOM) whose name appears in the file's markup or data, by kind. "
  "Static token match, so a class listed in a `.ts` data file counts there.\n")
w("| File | " + " | ".join(KINDS[:5]) + " | top section prefixes |\n|---|" + "--:|" * 5 + "---|")
for f in sorted(text):
    t = text[f]
    cs = [c for c in used if re.search(r'(?<![\w-])' + re.escape(c) + r'(?![\w-])', t)]
    if not cs: continue
    cnt = collections.Counter(kind(c) for c in cs)
    pre = collections.Counter(c.split("_")[0] for c in cs if kind(c) == "section-specific")
    w(f"| `{f}` | " + " | ".join(str(cnt[k]) for k in KINDS[:5]) + " | " + ", ".join(f"`{a}`" for a, _ in pre.most_common(4)) + " |")
w("")

w("### Utility classes in use\n")
uc = sorted((c for c in used if kind(c) == "utility"), key=lambda c: -used[c])
fam = collections.defaultdict(list)
for c in uc: fam[re.match(r"^[a-z]+(-[a-z]+)?", c).group(0) if not c.startswith(("text-", "heading-", "max-", "icon-", "padding-section")) else "-".join(c.split("-")[:2])].append(c)
w("| Family | Classes (occurrences) |\n|---|---|")
for k, cs in sorted(fam.items(), key=lambda kv: -sum(used[c] for c in kv[1])):
    w(f"| `{k}` | " + ", ".join(f"`{c}` {used[c]}" for c in cs) + " |")
w("")
w("### Auto-named and numbered duplicates\n")
w(", ".join(f"`{c}`" for c in sorted(c for c in used if kind(c) == "webflow-autonamed")) + "\n")
dup = sorted(c for c in used if re.search(r"-\d+$", c) and kind(c) != "webflow-autonamed" and not c.startswith("w-col"))
w("Numbered variants of named classes (Webflow's \"-2\" copies): " + ", ".join(f"`{c}`" for c in dup) + "\n")
w("### Used in markup but not defined in any stylesheet\n")
und = sorted(c for c in used if c not in defined)
w(f"{len(und)} classes: they style nothing, but most are Client-First wrapper/section names kept as hooks (tests, scripts) or for structure. "
  "By kind: " + ", ".join(f"{k} {v}" for k, v in collections.Counter(kind(c) for c in und).most_common()) + ".\n")
w(", ".join(f"`{c}`" for c in und) + "\n")
w("### Defined but never used\n")
du = sorted(c for c in defined if c not in used and not STATE.match("." + c))
by = collections.defaultdict(list)
for c in du: by[", ".join(sorted(defined_in[c]))].append(c)
w(f"{len(du)} classes appear in selectors but on no element of any page (JS state classes excluded):\n")
for f, cs in by.items(): w(f"- `{f}`: " + ", ".join(f"`{c}`" for c in cs))
w("")

# ---------------------------------------------------------------- w-node
w("## Grid placement by id (`#w-node-…`)\n")
wn_rules = [r for r in rules if "#w-node" in r["sel"]]
dom_ids = collections.defaultdict(list)
for p in PAGES:
    for x in L["pages"][p]["dom"]["wnodes"]:
        dom_ids[x["id"]].append((p, x))
ids_in_css = collections.defaultdict(list)
for r in wn_rules:
    for s in r["selectors"]:
        for i in re.findall(r"#(w-node-[\w-]+)", s): ids_in_css[i].append(r)
live_ids = [i for i in ids_in_css if i in dom_ids]
w(f"{len(wn_rules)} rules in `pima-website.webflow.css` target {len(ids_in_css)} distinct ids; "
  f"**{len(live_ids)} ids exist in the DOM**, {len(ids_in_css)-len(live_ids)} are dead. "
  f"{sum(1 for i in dom_ids if i not in ids_in_css)} DOM `w-node` ids have no rule.\n")
comp = sum(1 for r in wn_rules for x in r["selectors"] if ".w-node-" in x)
w(f"{comp} selectors are compound `#w-node-<instance>.w-node-<symbol>` (Webflow symbol instances): the element carries the symbol's `w-node-…` as a **class** as well as its own id, so these elements (camp-page cards, footers) hold `w-node` names twice.\n")
decl_kinds = collections.Counter()
for r in wn_rules:
    for d in r["decls"]: decl_kinds[d["prop"]] += 1
w("Declarations in these rules: " + ", ".join(f"`{k}` {v}" for k, v in decl_kinds.most_common()) + ".\n")
w("Live ids (element, page, placement; `@media` noted when the rule is breakpoint-specific):\n")
w("| Element (classes) | Parent | Pages | Placement |\n|---|---|---|---|")
grp = collections.defaultdict(lambda: {"pages": set(), "place": set(), "ids": set()})
for i in live_ids:
    p0, x = dom_ids[i][0]
    nw = lambda t: " ".join(c for c in t.split() if not c.startswith("w-node-"))
    cl = nw(x["cls"]); key = (x["tag"] + ("." + cl.replace(" ", ".") if cl else ""), nw(x["parent"]))
    g = grp[key]; g["ids"].add(i)
    for p, _ in dom_ids[i]: g["pages"].add(p)
    for r in ids_in_css[i]:
        g["place"].add((r["media"].replace("@media ", "") + ": " if r["media"] else "") + "; ".join(f"{d['prop']}: {d['value']}" for d in r["decls"]))
for (el, par), g in sorted(grp.items(), key=lambda kv: sorted(kv[1]["pages"])):
    el = re.sub(r"\.?w-node-[\w-]+", "", el)
    w(f"| `{el}` ({len(g['ids'])} ids) | `{par}` | {', '.join(sorted(g['pages']))} | " + "<br>".join(sorted(g["place"])) + " |")
w("")
src_wn = {f: len(re.findall(r"w-node|wNodeId", t)) for f, t in text.items() if re.search(r"w-node|wNodeId", t)}
w("Source files that write `w-node` ids: " + ", ".join(f"`{f}` ({n})" for f, n in sorted(src_wn.items())) + ".\n")

# ---------------------------------------------------------------- custom properties
w("## Custom properties\n")
defs = {}
for cp in St["customProps"]: defs.setdefault(cp["name"], []).append(cp)
VAR = re.compile(r"var\(\s*(--[\w-]+)")
refs_live = collections.Counter(); refs_dead = collections.Counter(); ref_where = collections.defaultdict(set)
for r in rules:
    lv = rule_live(r)
    for d in r["decls"]:
        if d["prop"].startswith("--"): continue
        for v in VAR.findall(d["value"]):
            (refs_live if lv else refs_dead)[v] += 1
            if lv: ref_where[v].add(d["prop"])
def deps(n, seen=None):
    seen = seen or set()
    for cp in defs.get(n, []):
        for v in VAR.findall(cp["value"]):
            if v not in seen: seen.add(v); deps(v, seen)
    return seen
reach = set(refs_live)
for n in list(refs_live): reach |= deps(n)
def resolve(n, depth=0):
    if n not in defs or depth > 20: return None
    v = defs[n][0]["value"]
    def sub(m):
        inner = m.group(0)[4:-1].split(",", 1)
        r = resolve(inner[0].strip(), depth + 1)
        return r if r is not None else (inner[1].strip() if len(inner) > 1 else m.group(0))
    for _ in range(10):
        nv = re.sub(r"var\(\s*--[\w-]+\s*(,[^()]*)?\)", sub, v)
        if nv == v: break
        v = nv
    return v
short = lambda n: re.sub(r"^--ai-gen-[0-9a-f-]+---", "--ai·", n)
w(f"{len(defs)} custom properties are declared ({sum(len(v) for v in defs.values())} declarations; "
  f"{sum(1 for n in defs if n.startswith('--ai-gen'))} `--ai-gen-…`, {sum(1 for n in defs if n.startswith('--_'))} `--_…`, "
  f"{sum(1 for n in defs if not n.startswith(('--ai-gen', '--_')))} other). "
  f"All `--ai-gen-…` share the prefix `--ai-gen-82921b10-4b39-48f0-b346-808cf4903d29-1746881340164---`, written `--ai·` below.\n")
w(f"- Referenced directly by a live rule: **{len(refs_live)}**; reachable through other variables: {len(reach)-len(refs_live)} more; total in use **{len(reach)}**.")
w(f"- Referenced only by dead rules: {len([n for n in refs_dead if n not in reach])}. Never referenced at all: {len([n for n in defs if n not in reach and n not in refs_dead])}.")
w(f"- Referenced but not declared in CSS (set by an inline `style` attribute): " + (", ".join(f"`{short(n)}`" for n in sorted(set(refs_live) - set(defs))) or "none") + ".")
overrides = [n for n, v in defs.items() if len(v) > 1]
w(f"- Declared more than once (overrides, e.g. per breakpoint or per scope): {len(overrides)}" + (": " + ", ".join(f"`{short(n)}` ({', '.join(sorted(set((c['media'] or c['sel'])[:40] for c in defs[n])))})" for n in overrides[:30]) if overrides else "") + ".\n")
fam = collections.defaultdict(list)
for n in reach:
    if n not in defs: continue
    f = re.sub(r"--.*$", "", short(n).replace("--ai·", "").replace("--_", "_").lstrip("-")) or short(n)
    fam[f].append(n)
w("In-use variables by family, with resolved values (`→` = resolved; `prop` = where live rules use it directly):\n")
w("| Family | Variables in use |\n|---|---|")
for f, ns in sorted(fam.items()):
    items = []
    for n in sorted(ns):
        rv = resolve(n); items.append(f"`{n.replace('--_color---', '') if n.startswith('--_') else short(n).split('--')[-1]}` → `{rv}`" + (f" ({', '.join(sorted(ref_where[n]))})" if ref_where[n] else ""))
    w(f"| `{f}` | " + "; ".join(items) + " |")
w("")
unused_fam = collections.Counter(re.sub(r"--.*$", "", short(n).replace("--ai·", "").replace("--_", "_").lstrip("-")) for n in defs if n not in reach)
w("Unused variables by family: " + ", ".join(f"`{k}` {v}" for k, v in unused_fam.most_common()) + ".\n")
json.dump({"reach": sorted(reach)}, open(f"{S}/vars.json", "w"))

open(f"{S}/css-a.md", "w").write("\n".join(out))
print("ok", len(out))
