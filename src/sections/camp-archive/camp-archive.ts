// The content model of the camp archive page (spec #93, "Content model"): one `CampYear` per
// past camp, exported by default from `years/<year>.ts`, rendered at
// /trai-he-toan-hoc-pima/<year>/ by src/pages/trai-he-toan-hoc-pima/[year].astro.
//
// Data rules (spec #93, "Data rules"): only verified data, no placeholders. A field, block or
// item that is missing is left out and not rendered; adding it later is a data-only change.
// Items keep their source order. Text is cleaned (no markup, zero-width characters or double
// spaces) but keeps its wording and language. scripts/camp-archive.test.mjs checks every year
// file against this interface and these rules.
//
// Plain functions of a year (counts, dates) live here too, so the page and the tests share
// them. This file must not use `import.meta.glob` or other Vite-only code: the year-file test
// loads year files in plain Node.
import type { ImageMetadata } from "astro";
import type { ComponentProps } from "astro/types";
import type Icon from "../../components/Icon.astro";

/** Where a session was held. "Trực tuyến" is an online camp (2021). */
export type Campus = "Hà Nội" | "TP.HCM" | "Trực tuyến";

/** The link text of a file. Solutions and notebooks are files of their item, not items. */
export type FileLabel = "PDF" | "Slide" | "Notebook" | "Thư mục" | "Mã nguồn" | "Lời giải";

/**
 * How a file link shows, by label: its link text (Contents) and its icon (Projects, which says
 * "Báo cáo" for a group's PDF, its report).
 */
export const FILE_LINKS: Record<FileLabel, { text: string; icon: ComponentProps<typeof Icon>["name"] }> = {
  PDF: { text: "PDF", icon: "file-text" },
  Slide: { text: "Slide", icon: "presentation" },
  Notebook: { text: "Notebook", icon: "notebook" },
  "Thư mục": { text: "Thư mục", icon: "folder" },
  "Mã nguồn": { text: "Mã nguồn", icon: "braces" },
  "Lời giải": { text: "Lời giải", icon: "file-check" },
};

/**
 * One document link. `url` is a Drive viewer URL on the shared drive "Trại hè PiMA - Lưu trữ",
 * read back with `rclone lsjson`: `https://drive.google.com/file/d/<id>/view` for a file,
 * `https://drive.google.com/drive/folders/<id>` for a folder ("Thư mục"), keeping any
 * `?resourcekey=`. Never "#", never pimavn.github.io, never a file owned by a personal account.
 */
export interface FileLink {
  label: FileLabel;
  url: string;
}

/** A lecturer, author or mentor, named as of that year. No shared registry of people. */
export interface Person {
  name: string;
  /** University, school or company as the year's sources give it. */
  affiliation?: string;
}

/** An entrance exam, lecture, exercise sheet or further reading item. */
export interface DocItem {
  /** The file name's title, without a "Bài giảng N -" prefix. */
  title: string;
  /** In source order; [] when the source names nobody. */
  authors: Person[];
  /**
   * A solution ("Lời giải") or notebook is a file of its item. [] only when the item's file is
   * lost (2017 "Tối ưu hóa", #87): the page shows its title and authors with no link.
   */
  files: FileLink[];
  /** A lecture reused from an earlier camp (2019 reuses 2018's); shown as "(từ trại hè 2018)" and listed first. */
  fromYear?: number;
}

/** A participant of the camp, with the school or university they gave that year (kept as written). */
export interface Camper {
  name: string;
  school: string;
}

/** The three or four campers who worked on one project topic, with what they produced. */
export interface ProjectGroup {
  /** The report's own title, when it differs from the topic's; the page falls back to the topic title. */
  reportTitle?: string;
  /** Only in a year held at several campuses (2025), and then on every group. */
  campus?: Campus;
  campers: Camper[];
  /** [] when the source names none. */
  mentors: Person[];
  /** Report ("PDF"), slides, notebooks, the group's folder… [] when the group has no file. */
  files: FileLink[];
}

/**
 * One problem set for the group projects. Listed only when at least one group reported on it,
 * so `groups` is never empty; within a topic, Hà Nội groups come before TP.HCM groups.
 */
export interface ProjectTopic {
  title: string;
  description?: string;
  /** The topic's brief, linked as "Đọc đề bài". */
  brief?: FileLink;
  groups: ProjectGroup[];
}

/** A member of the camp's team, credited on the page. */
export interface TeamMember {
  /** With the title the source gives ("PGS. TS. Trần Minh Triết"). */
  name: string;
  affiliation?: string;
  /** A square-ish portrait imported in the year file, from src/assets/camp-archive/<year>/team/. */
  photo?: ImageMetadata;
}

/** One team block: "Ban tổ chức", "Cố vấn chuyên môn". */
export interface TeamGroup {
  name: string;
  members: TeamMember[];
}

/**
 * One album of photos. The photos are not listed: the page loads every photo of
 * src/assets/camp-archive/<year>/<folder>/ (resized by `scripts/camp-photos.mjs gallery`), in
 * file-name order; the first is the plate's large photo.
 */
export interface GallerySection {
  /** The album's name in Vietnamese ("Khai mạc"). */
  name?: string;
  /** The folder's name under src/assets/camp-archive/<year>/ ("01-khai-mac"). */
  folder: string;
  /** The Drive folder of the album's originals (`<year>/6. Hình ảnh/<section>/`), linked as "Xem cả album". */
  album?: string;
}

/**
 * One camp held that year: a campus, or the online camp. `start` and `end` are ISO dates
 * ("2025-08-02") and come together; a session with no known dates (2016) has neither and shows
 * campus and venue only.
 */
export type Session = { campus?: Campus; venue?: string } & ({ start: string; end: string } | { start?: never; end?: never });

/**
 * The cover photo: one `cover`, or for a year held at several campuses one cover per campus
 * (`covers`, in the order of `sessions`), which the hero crossfades every 7 s. Covers live in
 * src/assets/camp-archive/<year>/ (`cover.jpg`, or `cover-<campus>.jpg`), made by
 * `scripts/camp-photos.mjs cover`.
 */
export type Cover = { cover: ImageMetadata; covers?: never } | { covers: { image: ImageMetadata; campus: Campus }[]; cover?: never };

/** One past camp. The page shows its blocks in this order; a missing block is not rendered. */
export type CampYear = Cover & {
  year: number;
  /** The camp's topic; `en` is shown under `vi`. */
  topic: { vi: string; en: string };
  /** "Lời giới thiệu": paragraphs. */
  description?: string[];
  /** "Nội dung chương trình": list items. */
  programme?: string[];
  /** One per camp held that year, in date order. Several campuses make a multi-campus year. */
  sessions?: Session[];
  /** Credits: only for years whose sources list a team. */
  team?: TeamGroup[];
  entranceExam?: DocItem[];
  /** Numbered on the page; `fromYear` lectures first. */
  lectures?: DocItem[];
  exercises?: DocItem[];
  /** "Tài liệu đọc thêm". */
  reading?: DocItem[];
  projects?: ProjectTopic[];
  gallery?: GallerySection[];
  /** A YouTube video of that year's camp; only once its year is confirmed. */
  video?: { youtubeId: string };
};

/** The campuses of a year's sessions, in order, without repeats. */
export function campuses(y: Pick<CampYear, "sessions">): Campus[] {
  return [...new Set((y.sessions ?? []).flatMap((s) => (s.campus ? [s.campus] : [])))];
}

/** A year held at more than one campus (2025): groups show their campus, covers alternate. */
export const isMultiCampus = (y: Pick<CampYear, "sessions">): boolean => campuses(y).length > 1;

/** The cover photos of a year, first one first, each with its campus in a multi-campus year. */
export function coversOf(y: Cover): { image: ImageMetadata; campus?: Campus }[] {
  return y.covers ?? [{ image: y.cover }];
}

/**
 * The counts sentence of the hero and the SEO description, as text and numbers in order, so
 * the hero can set the numbers large: [17, " bài giảng, ", 4, " đề tài dự án và ", 6,
 * " báo cáo nhóm của ", 24, " trại sinh."]. [] when the year has no lecture and no project.
 */
export function countsSentence(y: Pick<CampYear, "lectures" | "projects">): (string | number)[] {
  const groups = (y.projects ?? []).flatMap((p) => p.groups);
  const campers = groups.reduce((n, g) => n + g.campers.length, 0);
  const parts: (string | number)[][] = [];
  if (y.lectures?.length) parts.push([y.lectures.length, " bài giảng"]);
  if (y.projects?.length) parts.push([y.projects.length, " đề tài dự án"]);
  if (groups.length) parts.push(campers ? [groups.length, " báo cáo nhóm của ", campers, " trại sinh"] : [groups.length, " báo cáo nhóm"]);
  const joined = parts.flatMap((part, i) => [...part, i === parts.length - 1 ? "." : i === parts.length - 2 ? " và " : ", "]);
  // Merge neighbouring text pieces: [17, " bài giảng", ", "] → [17, " bài giảng, "].
  return joined.reduce<(string | number)[]>((out, piece) => {
    const last = out.length - 1;
    if (typeof piece === "string" && typeof out[last] === "string") out[last] += piece;
    else out.push(piece);
    return out;
  }, []);
}

/** A session's dates as a calendar block: "02/08 – 09/08" over "năm 2025". */
export function calendarDates(start: string, end: string): { days: string; rest: string } {
  const [sy, sm, sd] = start.split("-");
  const [, em, ed] = end.split("-");
  return { days: `${sd}/${sm} – ${ed}/${em}`, rest: `năm ${sy}` };
}
