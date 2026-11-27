// The year-file check of the camp archive page (spec #93, end of "Content model"), used by
// scripts/camp-archive.test.mjs. Not a test file itself (no `.test.` in the name).
//
// `yearProblems(y)` checks one `CampYear` (src/sections/camp-archive/camp-archive.ts) at run
// time, since nothing else type-checks the year files: every field is one the interface has,
// with the right type; every link is a Drive viewer URL; gallery folders hold photos; sessions
// have valid ISO dates; covers and group campuses follow the year's campuses; text is clean.
// `loadYearFile(path)` imports a year file in plain Node, with every image import stubbed.
import { existsSync, readdirSync } from "node:fs";
import { registerHooks } from "node:module";
import { join, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { root } from "./test-lib.mjs";

/** src/assets/camp-archive/, where each year's cover, team and gallery photos live. */
export const assetsDir = join(root, "src/assets/camp-archive");

const CAMPUSES = ["Hà Nội", "TP.HCM", "Trực tuyến"];
const LABELS = ["PDF", "Slide", "Notebook", "Thư mục", "Mã nguồn", "Lời giải"];
/** An image an import can name. */
const PHOTO = /\.(jpe?g|png|webp|avif)$/i;
/** A gallery photo the page's `import.meta.glob` finds: lower-case extensions only, as camp-photos.mjs writes them. */
const GALLERY_PHOTO = /\.(jpe?g|png|webp|avif)$/;
const DRIVE = /^https:\/\/drive\.google\.com\/(file\/d\/[\w-]+\/view|drive\/folders\/[\w-]+)(\?resourcekey=[\w-]+)?$/;

// ---- A small schema: each check takes (value, path, problems, context) ------------------------

const q = (v) => JSON.stringify(v);

const text = (v, at, out) => {
  if (typeof v !== "string") return out.push(`${at}: not a string`);
  if (!v) return out.push(`${at}: empty`);
  if (/[​-‍⁠﻿]/.test(v)) out.push(`${at}: ${q(v)} has a zero-width character`);
  if (/<\/?[a-z][^>]*>|&[a-z]+;/i.test(v)) out.push(`${at}: ${q(v)} has markup`);
  if (/ {2}/.test(v)) out.push(`${at}: ${q(v)} has a double space`);
  if (v !== v.trim()) out.push(`${at}: ${q(v)} has a space at an edge`);
};
const oneOf = (values) => (v, at, out) => {
  if (!values.includes(v)) out.push(`${at}: ${q(v)} is not one of ${values.join(", ")}`);
};
const integer = (v, at, out) => {
  if (!Number.isInteger(v)) out.push(`${at}: not an integer`);
};
const driveUrl = (v, at, out) => {
  if (typeof v !== "string" || !DRIVE.test(v)) out.push(`${at}: ${q(v)} is not a Drive viewer URL (https://drive.google.com/file/d/<id>/view or /drive/folders/<id>)`);
};
const image = (v, at, out) => {
  if (typeof v !== "object" || v === null || typeof v.src !== "string") out.push(`${at}: not an imported image`);
};
const isoDate = (v, at, out) => {
  const ok = typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && new Date(`${v}T00:00:00Z`).toISOString().startsWith(v);
  if (!ok) out.push(`${at}: ${q(v)} is not an ISO date (YYYY-MM-DD)`);
  return ok;
};
const youtubeId = (v, at, out) => {
  if (typeof v !== "string" || !/^[\w-]{11}$/.test(v)) out.push(`${at}: ${q(v)} is not a YouTube id (11 characters)`);
};

/** A list of `item`; `nonEmpty` reports []. */
const list = (item, { nonEmpty = false } = {}) => (v, at, out, ctx) => {
  if (!Array.isArray(v)) return out.push(`${at}: not a list`);
  if (nonEmpty && v.length === 0) out.push(`${at}: empty`);
  v.forEach((x, i) => item(x, `${at}[${i}]`, out, ctx));
};

/** An object with `fields` (a key ending in "?" is optional) and no other key. */
const shape = (name, fields) => (v, at, out, ctx) => {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return out.push(`${at || name}: not an object`);
  const known = new Map(Object.entries(fields).map(([k, check]) => [k.replace(/\?$/, ""), { check, optional: k.endsWith("?") }]));
  const path = (k) => (at ? `${at}.${k}` : k);
  for (const k of Object.keys(v)) if (!known.has(k)) out.push(`${path(k)}: not a field of ${name}`);
  for (const [k, { check, optional }] of known) {
    if (v[k] === undefined) {
      if (!optional) out.push(`${path(k)}: missing`);
    } else check(v[k], path(k), out, ctx);
  }
};

// ---- The CampYear interface ------------------------------------------------------------------

const fileLink = shape("FileLink", { label: oneOf(LABELS), url: driveUrl });
const person = shape("Person", { name: text, "affiliation?": text });
const docItem = shape("DocItem", {
  title: text,
  authors: list(person),
  // [] for an item whose file is lost: it shows title and authors, no link (2017 "Tối ưu hóa").
  files: list(fileLink),
  "fromYear?": (v, at, out, ctx) => {
    integer(v, at, out);
    if (Number.isInteger(v) && v >= ctx.year) out.push(`${at}: ${v} is not before ${ctx.year}`);
  },
});
const docs = list(docItem, { nonEmpty: true });
const campus = oneOf(CAMPUSES);
const session = shape("Session", { "campus?": campus, "start?": isoDate, "end?": isoDate, "venue?": text });
const group = shape("ProjectGroup", {
  "reportTitle?": text,
  "campus?": campus,
  campers: list(shape("Camper", { name: text, school: text })),
  mentors: list(person),
  files: list(fileLink),
});
const topic = shape("ProjectTopic", { title: text, "description?": text, "brief?": fileLink, groups: list(group, { nonEmpty: true }) });
const member = shape("TeamMember", { name: text, "affiliation?": text, "photo?": image });
const gallery = shape("GallerySection", { "name?": text, folder: text, "album?": driveUrl });

const campYear = shape("CampYear", {
  year: integer,
  topic: shape("topic", { vi: text, en: text }),
  "cover?": image,
  "covers?": list(shape("covers item", { image, campus }), { nonEmpty: true }),
  "description?": list(text, { nonEmpty: true }),
  "programme?": list(text, { nonEmpty: true }),
  "sessions?": list(session, { nonEmpty: true }),
  "team?": list(shape("TeamGroup", { name: text, members: list(member, { nonEmpty: true }) }), { nonEmpty: true }),
  "entranceExam?": docs,
  "lectures?": docs,
  "exercises?": docs,
  "reading?": docs,
  "projects?": list(topic, { nonEmpty: true }),
  "gallery?": list(gallery, { nonEmpty: true }),
  "video?": shape("video", { youtubeId }),
});

// ---- Rules across fields ---------------------------------------------------------------------

/** Session dates: start and end together, start first, both in the camp's year. */
function sessionProblems(y, out) {
  (Array.isArray(y.sessions) ? y.sessions : []).forEach((s, i) => {
    const at = `sessions[${i}]`;
    if ((s.start === undefined) !== (s.end === undefined)) return out.push(`${at}: start and end come together`);
    if (s.start === undefined) return;
    const valid = isoDate(s.start, "", []) && isoDate(s.end, "", []);
    if (!valid) return;
    if (s.end < s.start) out.push(`${at}: ends before it starts`);
    for (const k of ["start", "end"]) if (!s[k].startsWith(`${y.year}-`)) out.push(`${at}.${k}: not in ${y.year}`);
  });
}

/** The year's campuses (from its sessions): covers and group campuses follow them. */
function campusProblems(y, assets, out) {
  const campuses = [...new Set((Array.isArray(y.sessions) ? y.sessions : []).map((s) => s.campus).filter(Boolean))];
  const several = campuses.length > 1;
  // Covers: one `cover`, or one per campus in `covers` for a year held at several campuses.
  if (y.cover !== undefined && y.covers !== undefined) out.push("cover: give either cover or covers, not both");
  else if (y.cover === undefined && y.covers === undefined) out.push("cover: missing (a year has one cover, or one per campus in covers)");
  else if (several && y.covers === undefined) out.push("cover: a year held at several campuses has one cover per campus (covers)");
  else if (!several && y.covers !== undefined) out.push("covers: only for a year held at several campuses; give one cover");
  if (several && Array.isArray(y.covers)) {
    for (const c of campuses) if (!y.covers.some((cover) => cover?.campus === c)) out.push(`covers: no cover for ${c}`);
  }
  const yearDir = join(assets, String(y.year)) + sep;
  const covers = Array.isArray(y.covers) ? y.covers.map((c, i) => [`covers[${i}].image`, c?.image]) : [["cover", y.cover]];
  for (const [at, img] of covers) {
    if (typeof img?.src === "string" && !img.src.startsWith(yearDir)) {
      out.push(`${at}: ${q(img.src)} is not in src/assets/camp-archive/${y.year}/`);
    }
  }
  // Group campuses: on every group of a year held at several campuses, on none otherwise.
  (Array.isArray(y.projects) ? y.projects : []).forEach((p, i) =>
    (Array.isArray(p?.groups) ? p.groups : []).forEach((g, j) => {
      const at = `projects[${i}].groups[${j}].campus`;
      if (!several && g.campus !== undefined) out.push(`${at}: only in a year held at several campuses`);
      if (several && g.campus === undefined) out.push(`${at}: missing in a year held at several campuses`);
      if (several && g.campus !== undefined && CAMPUSES.includes(g.campus) && !campuses.includes(g.campus)) {
        out.push(`${at}: ${q(g.campus)} is not a campus of the year's sessions (${campuses.join(", ")})`);
      }
    }),
  );
}

/** Every gallery folder is src/assets/camp-archive/<year>/<folder>/ and holds at least one photo. */
function galleryProblems(y, assets, out) {
  (Array.isArray(y.gallery) ? y.gallery : []).forEach((s, i) => {
    if (typeof s?.folder !== "string" || !s.folder) return;
    const dir = join(assets, String(y.year), s.folder);
    const photos = existsSync(dir) ? readdirSync(dir).filter((f) => GALLERY_PHOTO.test(f)) : [];
    if (photos.length === 0) out.push(`gallery[${i}].folder: ${relative(root, dir).split(sep).join("/")}/ holds no photo`);
  });
}

/**
 * Everything wrong with one year file's `CampYear`, as "path: problem" lines; [] when nothing.
 * `file` is the year file's name ("2019.ts"); `assetsDir` stands in for src/assets/camp-archive/.
 */
export function yearProblems(y, { file, assetsDir: assets = assetsDir } = {}) {
  const out = [];
  campYear(y, "", out, { year: y?.year });
  if (typeof y !== "object" || y === null) return out;
  if (file && `${y.year}.ts` !== file) out.push(`year: ${y.year} in ${file}`);
  sessionProblems(y, out);
  campusProblems(y, assets, out);
  galleryProblems(y, assets, out);
  return out;
}

// ---- Loading a year file in Node -------------------------------------------------------------

let hooked = false;

/**
 * Imports a year file (or any module of camp-archive data) in plain Node and returns its
 * default export. Image imports become `{ src: <absolute path>, width, height, format }` (the
 * shape of Astro's ImageMetadata, sizes 0); extensionless relative imports resolve to `.ts`.
 */
export async function loadYearFile(path) {
  if (!hooked) {
    hooked = true;
    registerHooks({
      resolve(specifier, context, next) {
        try {
          return next(specifier, context);
        } catch (error) {
          if (!/^\.\.?\//.test(specifier) || /\.\w+$/.test(specifier)) throw error;
          return next(`${specifier}.ts`, context);
        }
      },
      load(url, context, next) {
        if (!PHOTO.test(new URL(url).pathname)) return next(url, context);
        const src = fileURLToPath(url);
        if (!existsSync(src)) throw new Error(`${src}: imported image not found`);
        const format = src.split(".").pop().toLowerCase();
        return { format: "module", shortCircuit: true, source: `export default ${q({ src, width: 0, height: 0, format })};` };
      },
    });
  }
  return (await import(pathToFileURL(path).href)).default;
}
