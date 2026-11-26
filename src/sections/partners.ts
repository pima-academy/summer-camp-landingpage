// Partner logos of the `Partners` section, in the old site's order.
import type { ImageMetadata } from "astro";
import bioturing from "../assets/images/partner-logo-03.png";
import hcmus from "../assets/images/partner-logo-05.png";

export interface PartnerLogo {
  src: ImageMetadata;
  alt: string;
  /** Rendered CSS width in px (the old <img> had no width: the source's own size). */
  width: number;
}

export const partnerLogos: PartnerLogo[] = [
  { src: bioturing, alt: "Logo BioTuring", width: 164 },
  { src: hcmus, alt: "Logo Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM", width: 163 },
];
