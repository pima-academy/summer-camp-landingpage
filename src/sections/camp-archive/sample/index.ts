// DEV-ONLY SAMPLE (see sample.ts): the sample years with their albums, as the page renders
// them. Loaded only by src/pages/trai-he-toan-hoc-pima/[year].astro in `npm run dev`.
import type { ImageMetadata } from "astro";
import { albumsOf, type ArchiveYear } from "../camp-years";
import sample from "./sample";

const photos = import.meta.glob<{ default: ImageMetadata }>("./*/*/*.jpg", { eager: true });

export const sampleYears: ArchiveYear[] = sample.map((y) => ({ y, albums: albumsOf(y, photos, ".") }));
