// The built camp years of the camp archive page: every `years/<year>.ts`, oldest first, each
// with its gallery albums resolved to photos. Used by src/pages/trai-he-toan-hoc-pima/[year].astro
// (one page per year, and the year pager). Vite-only (`import.meta.glob`), so year files and
// camp-archive.ts never import it.
import type { ImageMetadata } from "astro";
import type { CampYear } from "./camp-archive";

/** A gallery section with its photos, in file-name order. */
export interface Album {
  name?: string;
  /** The album's Drive folder, linked as "Xem cả album". */
  album?: string;
  photos: ImageMetadata[];
}

/** One camp year as its page renders it. */
export interface ArchiveYear {
  y: CampYear;
  albums: Album[];
}

type Modules<T> = Record<string, { default: T }>;

/**
 * The albums of a year: for each gallery section, every photo whose glob key starts with
 * `<base>/<year>/<folder>/`. `photos` is an eager `import.meta.glob` of `<base>/*\/*\/*`.
 */
export function albumsOf(y: CampYear, photos: Modules<ImageMetadata>, base: string): Album[] {
  return (y.gallery ?? []).map((s) => {
    const prefix = `${base}/${y.year}/${s.folder}/`;
    return {
      name: s.name,
      album: s.album,
      photos: Object.keys(photos)
        .filter((path) => path.startsWith(prefix) && !path.slice(prefix.length).includes("/"))
        .sort()
        .map((path) => photos[path].default),
    };
  });
}

const years = import.meta.glob<{ default: CampYear }>("./years/*.ts", { eager: true });
// Gallery photos only: src/assets/camp-archive/<year>/<folder>/<photo>. Covers sit one level up.
const photos = import.meta.glob<{ default: ImageMetadata }>("../../assets/camp-archive/*/*/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
});

/** Every year file's `CampYear`, oldest first. */
export const campYears: CampYear[] = Object.values(years)
  .map((m) => m.default)
  .sort((a, b) => a.year - b.year);

/** Every built year with its albums, oldest first. */
export const archiveYears: ArchiveYear[] = campYears.map((y) => ({ y, albums: albumsOf(y, photos, "../../assets/camp-archive") }));
