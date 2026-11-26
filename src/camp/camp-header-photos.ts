// Header photo collage of the 2025/2026 camp pages (old `section_header76`), for
// CampHeaderPhotos. Each column is two `.header76_image-list`s of three photos; the
// marquee repeats them. `node`/`imgNode` are the old Webflow element ids (see w-node.ts).
import type { ImageMetadata } from "astro";

import campPhoto1 from "../assets/images/trai-he-pima-1.avif";
import campPhoto2 from "../assets/images/trai-he-pima-2.avif";
import campPhoto4 from "../assets/images/trai-he-pima-4.avif";
import campPhoto5 from "../assets/images/trai-he-pima-5.avif";
import campPhoto6 from "../assets/images/trai-he-pima-6.avif";
import campPhoto7 from "../assets/images/trai-he-pima-7.avif";
import campPhoto8 from "../assets/images/trai-he-pima-8.avif";
import engineering from "../assets/images/thisisengineering-gzdrm7syq0g-unsplash.avif";
import artboard7 from "../assets/images/artboard-7.avif";
import artboard2 from "../assets/images/artboard-2.avif";
import groupPhoto from "../assets/images/481775555-1135445305045604-7304032333989245886-n.avif";
import img6734 from "../assets/images/img-6734.jpg";
import photo528774704 from "../assets/images/528774704-1253966339860166-1751942015170179034-n.jpg";
import photo3a0f691f from "../assets/images/3a0f691f-f27a-437c-ad0a-19ca8a29ec97.jpg";
import photo528602247 from "../assets/images/528602247-1253966253193508-3147679947265190284-n.jpg";
import photo528404284 from "../assets/images/528404284-1253989449857855-5372161073753020928-n.jpg";
import lopHoc from "../assets/images/lop-hoc.jpg";

export interface CampHeaderPhoto {
  image: ImageMetadata;
  /** Element id of the `.header76_image-wrapper`. */
  node: string;
  /** Element id of the img, where the old img had one. */
  imgNode?: string;
}

export interface CampHeaderPhotoList {
  node: string;
  photos: CampHeaderPhoto[];
}

export interface CampHeaderPhotoColumns {
  left: CampHeaderPhotoList[];
  right: CampHeaderPhotoList[];
}

const el = (suffix: string) => `_218a4f3f-1ec3-6b02-c6e7-6cfff48ef3${suffix}`;
const photo = (image: ImageMetadata, node: string, imgNode?: string): CampHeaderPhoto => ({
  image,
  node: el(node),
  imgNode: imgNode && el(imgNode),
});

export const campHeaderPhotos2025: CampHeaderPhotoColumns = {
  left: [
    { node: el("b6"), photos: [photo(campPhoto2, "b7", "b8"), photo(campPhoto7, "b9"), photo(campPhoto4, "bb", "bc")] },
    { node: el("bd"), photos: [photo(campPhoto1, "be", "bf"), photo(engineering, "c0", "c1"), photo(artboard7, "c2", "c3")] },
  ],
  right: [
    { node: el("c5"), photos: [photo(campPhoto5, "c6", "c7"), photo(campPhoto6, "c8", "c9"), photo(campPhoto8, "ca", "cb")] },
    { node: el("cc"), photos: [photo(groupPhoto, "cd", "ce"), photo(artboard2, "cf", "d0"), photo(groupPhoto, "d1", "d2")] },
  ],
};

export const campHeaderPhotos2026: CampHeaderPhotoColumns = {
  left: [
    { node: el("b6"), photos: [photo(img6734, "b7", "b8"), photo(photo528774704, "b9"), photo(photo3a0f691f, "bb", "bc")] },
    { node: el("bd"), photos: [photo(campPhoto1, "be", "bf"), photo(engineering, "c0", "c1"), photo(artboard7, "c2", "c3")] },
  ],
  right: [
    { node: el("c5"), photos: [photo(photo528602247, "c6", "c7"), photo(photo528404284, "c8", "c9"), photo(lopHoc, "ca", "cb")] },
    { node: el("cc"), photos: [photo(groupPhoto, "cd", "ce"), photo(artboard2, "cf", "d0"), photo(groupPhoto, "d1", "d2")] },
  ],
};
