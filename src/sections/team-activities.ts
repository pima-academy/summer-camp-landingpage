// Slides of the Team section's activity slider ("Các chuyên gia đồng hành"), in old-site order.
import type { ImageMetadata } from "astro";
import screenshot27 from "../assets/images/screenshot-27.avif";
import screenshot29 from "../assets/images/screenshot-29.avif";
import screenshot30 from "../assets/images/screenshot-30.avif";
import screenshot31 from "../assets/images/screenshot-31.avif";
import screenshot32 from "../assets/images/screenshot-32.avif";
import screenshot33 from "../assets/images/screenshot-33.avif";

export interface TeamActivity {
  image: ImageMetadata;
  alt: string;
  caption: string;
}

export const teamActivities: TeamActivity[] = [
  {
    image: screenshot29,
    alt: "Thầy Võ Văn Tới cầm một thiết bị y sinh, học sinh đứng quanh quan sát",
    caption: "Thầy Võ Văn Tới giới thiệu ngành kĩ thuật y sinh và các thiết bị thí nghiệm",
  },
  {
    image: screenshot32,
    alt: "Thầy Lý Quốc Ngọc giảng bài trước màn chiếu về hệ thống theo dõi vật thể",
    caption: "Thầy Lý Quốc Ngọc trình bày về ứng dụng của mạng học sâu trong xử lí ảnh",
  },
  {
    image: screenshot31,
    alt: "Thầy Trần Minh Triết cầm micro thuyết trình trước màn chiếu",
    caption: "Thầy Trần Minh Triết giới thiệu về những ứng dụng của trí tuệ nhân tạo",
  },
  {
    image: screenshot30,
    alt: "Mentor Vương Hy chỉ lên màn chiếu, học sinh ngồi nghe",
    caption: "Mentor Vương Hy giới thiệu các mô hình toán học trong giải mã gen",
  },
  {
    image: screenshot27,
    alt: "ThS. Lê Thiện giảng bài trước lớp học",
    caption: "ThS. Lê Thiện giới thiệu về học máy",
  },
  {
    image: screenshot33,
    alt: "TS. Phạm Kim Sơn cầm micro giảng bài cạnh bảng viết",
    caption: "TS. Phạm Kim Sơn giới thiệu về các bài toán trong tin sinh học",
  },
];
