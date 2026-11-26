// People of the `CampMentors` sections on trai-he-toan-hoc-2025 and trai-he-pima-2026
// (same people on both pages), in the old site's order.
import type { ImageMetadata } from "astro";
import canTranThanhTrung from "../assets/images/can-tran-thanh-trung.avif";
import phamKimSon from "../assets/images/pham-kim-son.avif";
import tranMinhTriet from "../assets/images/tran-minh-triet.avif";
import tranThanhLong from "../assets/images/tran-thanh-long.avif";

export interface CampMentor {
  name: string;
  affiliation: string;
  photo: ImageMetadata;
}

/** "Ban tổ chức". */
export const organizers: CampMentor[] = [
  {
    name: "PGS. TS. Trần Minh Triết",
    affiliation: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM",
    photo: tranMinhTriet,
  },
  {
    name: "TS. Cấn Trần Thành Trung",
    affiliation: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM",
    photo: canTranThanhTrung,
  },
];

/** "Cố vấn chuyên môn". */
export const advisors: CampMentor[] = [
  {
    name: "GS. Trần Thanh Long",
    affiliation: "Đại học Warwick, Vương quốc Anh",
    photo: tranThanhLong,
  },
  {
    name: "TS. Phạm Kim Sơn",
    affiliation: "Công ty BioTuring, Việt Nam",
    photo: phamKimSon,
  },
];
