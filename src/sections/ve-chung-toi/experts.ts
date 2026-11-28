// Content of the `Experts` section: the six experts (GLOSSARY.md, "Expert") with the title and
// post they had then (report ch. 03, p. 11–12), their activity photo at 904 px and what they
// talked about (p. 13). Only these six until PiMA clears more (#130).
import type { ImageMetadata } from "astro";
import leThien from "../../assets/images/ve-chung-toi/expert-le-thien.jpg";
import lyQuocNgoc from "../../assets/images/ve-chung-toi/expert-ly-quoc-ngoc.jpg";
import phamKimSon from "../../assets/images/ve-chung-toi/expert-pham-kim-son.jpg";
import tranMinhTriet from "../../assets/images/ve-chung-toi/expert-tran-minh-triet.jpg";
import voVanToi from "../../assets/images/ve-chung-toi/expert-vo-van-toi.jpg";
import vuongHy from "../../assets/images/ve-chung-toi/expert-vuong-hy.jpg";

export interface Expert {
  /** Name with academic title. */
  name: string;
  role: string;
  photo: ImageMetadata;
  alt: string;
  /** What the expert talked about at PiMA. */
  topic: string;
}

/** The section lead, report ch. 03 without "hàng đầu". */
export const expertsLead =
  "Từ năm 2016 đến nay, nhiều chuyên gia từ các tổ chức giáo dục và công ty công nghệ trong và ngoài nước đã đồng hành cùng PiMA với vai trò người hướng dẫn, diễn giả khách mời, cố vấn chuyên môn và đơn vị bảo trợ.";

export const experts: Expert[] = [
  {
    name: "GS. TS. Võ Văn Tới",
    role: "Nguyên Trưởng Bộ môn Kĩ thuật Y Sinh, Trường ĐH Quốc tế, ĐHQG-HCM",
    photo: voVanToi,
    alt: "Thầy Võ Văn Tới cầm một thiết bị y sinh, học sinh đứng quanh quan sát",
    topic: "Giới thiệu ngành kĩ thuật y sinh và các thiết bị thí nghiệm",
  },
  {
    name: "PGS. TS. Trần Minh Triết",
    role: "Phó Hiệu trưởng, Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM; Viện trưởng Viện John von Neumann, ĐHQG-HCM",
    photo: tranMinhTriet,
    alt: "Thầy Trần Minh Triết cầm micro thuyết trình trước màn chiếu",
    topic: "Giới thiệu những ứng dụng của trí tuệ nhân tạo",
  },
  {
    name: "PGS. TS. Lý Quốc Ngọc",
    role: "Trưởng Bộ môn Thị giác máy tính và Điều khiển học thông minh, Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM",
    photo: lyQuocNgoc,
    alt: "Thầy Lý Quốc Ngọc giảng bài trước màn chiếu về hệ thống theo dõi vật thể",
    topic: "Ứng dụng của mạng học sâu trong xử lí ảnh",
  },
  {
    name: "ThS. Lê Thiện",
    role: "Nghiên cứu sinh tiến sĩ Học máy, Viện Công nghệ Massachusetts (MIT), Hoa Kỳ",
    photo: leThien,
    alt: "ThS. Lê Thiện giảng bài trước lớp học",
    topic: "Giới thiệu về học máy",
  },
  {
    name: "TS. Phạm Kim Sơn",
    role: "Giám đốc, Công ty BioTuring, Việt Nam",
    photo: phamKimSon,
    alt: "TS. Phạm Kim Sơn cầm micro giảng bài cạnh bảng viết",
    topic: "Các bài toán trong tin sinh học",
  },
  {
    name: "Vương Hy",
    role: "Bộ phận Nghiên cứu và Phát triển, Công ty BioTuring, Việt Nam",
    photo: vuongHy,
    alt: "Vương Hy chỉ lên màn chiếu, học sinh ngồi nghe",
    topic: "Các mô hình toán học trong giải mã gen",
  },
];
