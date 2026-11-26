"""Design values in use, distance to the brand, WCAG pairs. Writes css-b.md."""
import json, re, sys, collections, math
S = sys.argv[1]
L = json.load(open(f"{S}/live2.json"))
PAGES = list(L["pages"]); WIDTHS = ["390", "600", "820", "1440"]
out = []; w = out.append

BRAND = {"pima-green": "#50b448", "pima-dark-green": "#275613", "pima-pale-lime": "#d4e889", "black": "#000000",
         "gray-1": "#434343", "gray-2": "#666666", "gray-3": "#999999", "gray-4": "#d9d9d9", "gray-5": "#efefef", "white": "#ffffff",
         "accent-red": "#e9542c", "accent-orange": "#ff9e1d", "accent-yellow": "#f6c545", "accent-sky": "#37b2db",
         "accent-blue": "#3379b8", "accent-pink": "#f99ad3", "accent-purple": "#9e61c8", "accent-brown": "#91632f"}
def rgb(s):
    m = re.match(r"rgba?\(([^)]+)\)", s)
    if not m: return None
    a = [float(x) for x in re.split(r"[ ,/]+", m.group(1).strip()) if x]
    return a[:3], (a[3] if len(a) > 3 else 1.0)
hexs = lambda c: "#%02x%02x%02x" % tuple(round(x) for x in c)
def h2c(h): return [int(h[i:i + 2], 16) for i in (1, 3, 5)]
def lab(c):
    def f(u):
        u /= 255; return ((u + .055) / 1.055) ** 2.4 if u > .04045 else u / 12.92
    r, g, b = map(f, c)
    x, y, z = (r * .4124 + g * .3576 + b * .1805) / .95047, r * .2126 + g * .7152 + b * .0722, (r * .0193 + g * .1192 + b * .9505) / 1.08883
    t = lambda v: v ** (1 / 3) if v > .008856 else 7.787 * v + 16 / 116
    return 116 * t(y) - 16, 500 * (t(x) - t(y)), 200 * (t(y) - t(z))
def de(a, b): return math.dist(lab(a), lab(b))
def nearest(c):
    n, h = min(BRAND.items(), key=lambda kv: de(c, h2c(kv[1])))
    return n, round(de(c, h2c(h)), 1)
def lum(c):
    def f(u):
        u /= 255; return u / 12.92 if u <= .03928 else ((u + .055) / 1.055) ** 2.4
    r, g, b = map(f, c); return .2126 * r + .7152 * g + .0722 * b
def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True); return (la + .05) / (lb + .05)

# aggregate values: key -> {n, where:{}, widths:set, pages:set}
agg = collections.defaultdict(lambda: {"n": 0, "where": collections.Counter(), "pages": set(), "widths": collections.Counter()})
for p in PAGES:
    for wd in WIDTHS:
        for k, v in L["pages"][p]["widths"][wd]["vals"].items():
            a = agg[k]; a["n"] += v["n"]; a["pages"].add(p); a["widths"][wd] += v["n"]
            for wh, n in v["where"].items(): a["where"][wh] += n
def values(prop): return {k.split("|", 1)[1]: v for k, v in agg.items() if k.startswith(prop + "|")}
def top_where(v, k=3): return "; ".join(f"`{x}`" for x, _ in v["where"].most_common(k))
NOTE = ("Counts are element×width occurrences over 14 pages × 4 widths (390, 600, 820, 1440 px, one per Webflow tier), "
        "taken from computed styles of visible elements; text properties count only elements with their own text.")

w("## Design values in use\n"); w(NOTE + "\n")
# ---- colours
def color_table(prop, title):
    vs = values(prop); rows = collections.defaultdict(lambda: {"n": 0, "alpha": set(), "v": []})
    for s, v in vs.items():
        p = rgb(s)
        if not p: continue
        hx = hexs(p[0]); r = rows[hx]; r["n"] += v["n"]; r["alpha"].add(p[1]); r["v"].append(v)
    w(f"### {title}\n")
    w("| Colour | Alpha | Count | Nearest brand token (ΔE76) | Where (top) |\n|---|---|--:|---|---|")
    for hx, r in sorted(rows.items(), key=lambda kv: -kv[1]["n"]):
        n, d = nearest(h2c(hx))
        tag = "exact" if d < 1 else ("close" if d < 5 else "**off**")
        wh = collections.Counter()
        for v in r["v"]: wh.update(v["where"])
        w(f"| `{hx}` | {', '.join(str(round(a, 2)) for a in sorted(r['alpha']))} | {r['n']} | `--{n}` {d} ({tag}) | " + "; ".join(f"`{x}`" for x, _ in wh.most_common(3)) + " |")
    w("")
    return rows
txt = color_table("color", "Text colours")
bgs = color_table("background-color", "Background colours")
bds = color_table("border-color", "Border colours")
bi = values("background-image")
w("### Background images and gradients\n")
w("| Value (truncated) | Count | Where |\n|---|--:|---|")
for s, v in sorted(bi.items(), key=lambda kv: -kv[1]["n"])[:20]:
    w(f"| `{s[:70]}` | {v['n']} | {top_where(v)} |")
w("")

# ---- typography
w("### Font family, weight, style\n")
for prop in ["font-family", "font-weight", "font-style", "text-transform"]:
    vs = values(prop)
    w(f"- **{prop}**: " + ", ".join(f"`{s}` {v['n']}" for s, v in sorted(vs.items(), key=lambda kv: -kv[1]["n"])))
w("")
fw = values("font-weight")
w("Weights outside the brand set 400/600/700/800/900, where they occur:\n")
for s, v in sorted(fw.items()):
    if s not in {"400", "600", "700", "800", "900"}:
        w(f"- `{s}` ({v['n']}): " + "; ".join(f"`{x}` {n}" for x, n in v["where"].most_common(8)))
w("")
w("### Font sizes per width\n")
w("Distinct computed sizes (px) of text elements; count in brackets.\n")
w("| Width | Sizes |\n|---|---|")
for wd in WIDTHS:
    c = collections.Counter()
    for s, v in values("font-size").items(): c[float(s[:-2])] += v["widths"][wd]
    w(f"| {wd} | " + ", ".join(f"{('%g' % k)} ({n})" for k, n in sorted(c.items()) if n) + " |")
w("")
w("Distinct sizes over all widths: " + str(len(values("font-size"))) + ".\n")
w("### Line heights (ratio to font size)\n")
lh = values("line-height")
w(", ".join(f"`{s}` {v['n']}" for s, v in sorted(lh.items(), key=lambda kv: -kv[1]["n"])) + "\n")
low = [(s, v) for s, v in lh.items() if s != "normal" and float(s) < 1.1]
w("Line heights below 1.1 (the brand floor for uppercase Vietnamese headings), where: " +
  "; ".join(f"`{s}` → {top_where(v, 4)}" for s, v in sorted(low)) + "\n")
ls = values("letter-spacing")
w("Letter spacing: " + ", ".join(f"`{s}` {v['n']}" for s, v in sorted(ls.items(), key=lambda kv: -kv[1]["n"])) + "\n")

# ---- shape
w("### Corner radius\n")
w("Brand: `--radius` 2 mm ≈ 7.6 px, `--radius-s` 1 mm ≈ 3.8 px (print values; the web value is open).\n")
w("| Radius | Count | Where (top) |\n|---|--:|---|")
for s, v in sorted(values("border-radius").items(), key=lambda kv: -kv[1]["n"]):
    w(f"| `{s}` | {v['n']} | {top_where(v)} |")
w("")
w("### Shadows\n")
w("| Box shadow | Count | Where |\n|---|--:|---|")
for s, v in sorted(values("box-shadow").items(), key=lambda kv: -kv[1]["n"]):
    w(f"| `{s}` | {v['n']} | {top_where(v)} |")
w("")
w("### Border widths, outlines, opacity\n")
for prop in ["border-width", "outline", "opacity"]:
    w(f"- **{prop}**: " + ", ".join(f"`{s}` {v['n']}" for s, v in sorted(values(prop).items(), key=lambda kv: -kv[1]["n"])))
w("")
w("### Spacing steps\n")
w("Non-zero computed padding (4 sides), margin-top/bottom, row-gap and column-gap, in px. Values ≥ 1 % of occurrences are listed; "
  "the rest are counted as the long tail.\n")
sp = collections.Counter()
for s, v in values("spacing").items(): sp[round(float(s[:-2]), 1)] += v["n"]
tot = sum(sp.values())
main = sorted(k for k, n in sp.items() if n / tot >= .01)
w(", ".join(f"{('%g' % k)} ({sp[k]})" for k in main) + "\n")
w(f"Long tail: {len(sp) - len(main)} more distinct values, {sum(n for k, n in sp.items() if k not in main)} occurrences. "
  f"Distinct spacing values overall: {len(sp)}. Values that are not whole multiples of 4 px: "
  f"{sum(1 for k in sp if k % 4)} distinct, {sum(n for k, n in sp.items() if k % 4)} occurrences.\n")

# ---- WCAG
w("## Text contrast (WCAG AA)\n")
w("Every visible text element's colour against its effective background (ancestor background colours alpha-composited over white; "
  "stops at the first ancestor with a background image, reported separately). Large text = ≥ 24 px, or ≥ 18.66 px at weight ≥ 700: needs 3:1; "
  "other text needs 4.5:1. Element opacity is not applied (most opacity < 1 comes from scroll animations' start state).\n")
pairs = collections.defaultdict(lambda: {"n": 0, "where": collections.Counter(), "pages": set(), "text": set(), "large": set(), "img": 0})
img = collections.Counter()
for p in PAGES:
    for wd in WIDTHS:
        for x in L["pages"][p]["widths"][wd]["pairs"]:
            if x["onImage"]:
                img[x["where"]] += 1; continue
            large = x["size"] >= 24 or (x["size"] >= 18.66 and x["weight"] >= 700)
            k = (hexs(x["fg"]), hexs(x["bg"]))
            a = pairs[k]; a["n"] += 1; a["where"][x["where"]] += 1; a["pages"].add(p); a["large"].add(large)
            if len(a["text"]) < 3: a["text"].add(x["text"][:30])
rows = []
for (fg, bg), a in pairs.items():
    r = ratio(h2c(fg), h2c(bg))
    need = 3 if a["large"] == {True} else 4.5
    rows.append((r, fg, bg, a, need))
w("### All text/background pairs\n")
w("| Text | Background | Ratio | Large only? | Count | AA | Where (top) |\n|---|---|--:|---|--:|---|---|")
for r, fg, bg, a, need in sorted(rows, key=lambda x: x[0]):
    ok = "pass" if r >= need else ("**fail**" if r < 3 or need == 4.5 and not (True in a["large"] and r >= 3) else "**fail (small)**")
    if r < need and True in a["large"] and r >= 3: ok = "**fail for small text**, pass for large"
    w(f"| `{fg}` ({nearest(h2c(fg))[0]}) | `{bg}` ({nearest(h2c(bg))[0]}) | {r:.2f} | {'yes' if a['large'] == {True} else 'no' if a['large'] == {False} else 'mixed'} | {a['n']} | {ok} | {top_where(a)} |")
w("")
fails = [x for x in rows if x[0] < x[4]]
w(f"**{len(fails)} of {len(rows)} pairs fail AA** somewhere, covering {sum(x[3]['n'] for x in fails)} of {sum(x[3]['n'] for x in rows)} text occurrences.\n")
w("### Text over images\n")
w(f"{sum(img.values())} text occurrences sit on an ancestor with a background image (contrast not computed): " +
  "; ".join(f"`{k}` {n}" for k, n in img.most_common(12)) + "\n")

open(f"{S}/css-b.md", "w").write("\n".join(out)); print("ok")
