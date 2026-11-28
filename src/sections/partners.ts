// Rows of the `Partners` section: the partners cleared for the site (issue #130's safe default,
// ĐH KHTN and BioTuring only), each with its role and years.
import type { ImageMetadata } from "astro";
import bioturing from "../assets/images/partner-logo-03.png";
import hcmus from "../assets/images/partner-logo-05.png";

export interface Partner {
  logo: ImageMetadata;
  alt: string;
  name: string;
  role: string;
  years: string;
}

export const partners: Partner[] = [
  {
    logo: hcmus,
    alt: "Logo Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM",
    name: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM",
    role: "Bảo trợ chuyên môn và đồng tổ chức",
    years: "2017–2026",
  },
  {
    logo: bioturing,
    alt: "Logo BioTuring",
    name: "BioTuring",
    role: "Giảng dạy tại trại hè 2023, đồng hành cùng PiMA",
    years: "2023–2026",
  },
];
