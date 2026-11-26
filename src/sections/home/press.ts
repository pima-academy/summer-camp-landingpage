// Press quotes of the home page's `Press` section, in the old site's order.
import type { ImageMetadata } from "astro";
import pressCafeF from "../../assets/images/cafef-plf.avif";
import pressHoaHocTro from "../../assets/images/press-logo-02.png";
import pressTuoiTre from "../../assets/images/press-logo-06.png";
import pressDanTri from "../../assets/images/press-logo-08.avif";
import pressMucTim from "../../assets/images/press-logo-09.png";

export interface PressQuote {
  quote: string;
  /** The article the quote comes from. */
  href: string;
  /** The newspaper's logo and its name as alt text. */
  logo: ImageMetadata;
  alt: string;
}

export const pressQuotes: PressQuote[] = [
  {
    quote:
      "Một trại hè được cựu thí sinh Olympic toán học quốc tế (IMO) và các học sinh giỏi toán quốc gia tổ chức tám năm qua dành cho những học sinh say mê toán học.",
    href: "https://tuoitre.vn/trai-he-dac-biet-cua-nhung-co-cau-tro-me-toan-20240802090941345.htm",
    logo: pressTuoiTre,
    alt: "Tuổi Trẻ",
  },
  {
    quote:
      "Chương trình nhằm giới thiệu toán ứng dụng hiện đại trên đại học cho các bạn học sinh THPT và rèn luyện những kỹ năng mềm khác như làm việc nhóm, nghiên cứu, lập trình. Đến nay, nhiều trại sinh của PiMA đã rất thành đạt, hiện đang làm cho các công ty công nghệ hàng đầu hoặc là nghiên cứu sinh ở các đại học lớn trên thế giới.",
    href: "https://dantri.com.vn/giao-duc/tot-nghiep-thu-khoa-o-my-tien-si-ve-nuoc-day-hoc-theo-de-an-tien-ty-20240615075023833.htm",
    logo: pressDanTri,
    alt: "Dân trí",
  },
  {
    quote:
      "Đây là tầm nhìn chiến lược của một nhà khoa học trẻ yêu quê hương muốn gắn bó và phục vụ những gì tốt đẹp nhất cho đất nước bằng tài năng và sự cống hiến của mình.",
    href: "https://cafef.vn/tien-si-29-tuoi-tot-nghiep-dai-hoc-top-7-the-gioi-ve-viet-nam-lam-viec-188240728085841472.chn",
    logo: pressCafeF,
    alt: "CafeF",
  },
  {
    quote:
      "Chính vì những điều nho nhỏ, đáng yêu như thế, PiMA ngày càng được các bạn teen yêu thích và đón chờ nhiều hơn nữa.",
    href: "https://muctim.tuoitre.vn/nhung-sac-mau-cua-pima-57737.htm",
    logo: pressMucTim,
    alt: "Mực Tím",
  },
  {
    quote:
      "Trại Hè PiMA được nhiều bạn teen yêu thích vì “hô biến” Toán học từ công thức trở thành những bài ứng dụng thực tế hấp dẫn qua các dự án nhóm.",
    href: "https://hoahoctro.tienphong.vn/con-bao-trai-he-dang-do-bo-cung-len-ke-hoach-danh-bay-sau-luoi-post1210491.tpo",
    logo: pressHoaHocTro,
    alt: "Hoa Học Trò",
  },
];
