// University logos of the 2025/2026 camp mentor row (old `section_logo3`), for MentorLogos.
// Two `.logo3_list`s per page; 2025 also has UCLA. `node` is the old Webflow element id
// of the `.logo3_wrapper` (see lib/w-node).
import type { ImageMetadata } from "astro";

import ucla from "../assets/images/university-of-california-los-angeles-logo.avif";
import stonyBrook from "../assets/images/large-blob.avif";
import nus from "../assets/images/national-university-of-singapore-logo-wine.avif";
import ntu from "../assets/images/nanyang-technological-university-logo-wine.avif";
import hcmus from "../assets/images/truong-dai-hoc-khoa-hoc-tu-nhien-dai-hoc-quoc-gia-thanh-pho-ho-chi-minh.avif";
import hcmut from "../assets/images/hcmut-official-logo.avif";
import williamMary from "../assets/images/vi-logo.avif";
import hust from "../assets/images/logo-dai-hoc-bach-khoa-ha-noi.avif";
import bonn from "../assets/images/2560px-universitat-bonn.avif";
import fpt from "../assets/images/logo-truong-dai-hoc-fpt.avif";
import usth from "../assets/images/logo-truong-dai-hoc-khoa-hoc-va-cong-nghe-ha-noi.webp";

export interface MentorLogo {
  image: ImageMetadata;
  alt: string;
  node: string;
  /** The old `width` attribute, where there was one (Stony Brook: 84). */
  width?: number;
}

const el = (suffix: string) => `_7d62ac21-ccb5-60c3-492e-1917c5e53${suffix}`;

const logos = {
  ucla: { image: ucla, alt: "Logo Đại học California, Los Angeles (UCLA)", node: el("2fa") },
  stonyBrook: { image: stonyBrook, alt: "Logo Đại học Stony Brook", node: el("2fc"), width: 84 },
  nus: { image: nus, alt: "Logo Đại học Quốc gia Singapore (NUS)", node: el("2fe") },
  ntu: { image: ntu, alt: "Logo Đại học Công nghệ Nanyang (NTU)", node: el("306") },
  hcmus: { image: hcmus, alt: "Logo Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM", node: el("30b") },
  hcmut: { image: hcmut, alt: "Logo Trường Đại học Bách khoa, ĐHQG-HCM", node: el("30f") },
  williamMary: { image: williamMary, alt: "Logo Đại học William & Mary", node: el("302") },
  hust: { image: hust, alt: "Logo Đại học Bách khoa Hà Nội", node: el("304") },
  bonn: { image: bonn, alt: "Logo Đại học Bonn", node: el("30d") },
  fpt: { image: fpt, alt: "Logo Trường Đại học FPT", node: el("300") },
  usth: {
    image: usth,
    alt: "Logo Trường Đại học Khoa học và Công nghệ Hà Nội",
    node: "_836dcdab-4d04-33d7-d37b-52f20b8ed8a4",
  },
} satisfies Record<string, MentorLogo>;

const firstList = [logos.stonyBrook, logos.nus, logos.ntu, logos.hcmus, logos.hcmut, logos.williamMary, logos.hust];
const secondList = [logos.bonn, logos.fpt, logos.usth];

export const mentorLogos2025: MentorLogo[][] = [[logos.ucla, ...firstList], secondList];
export const mentorLogos2026: MentorLogo[][] = [firstList, secondList];
