// PROTOTYPE (throwaway, branch prototype/home-redesign; dev only): the content every home variant
// shares (issue #124), from the sections decided in #122 and the cleared figures of the map's
// Notes (#118). Variants differ in layout only, never in facts.
import bioturing from "../../../assets/images/partner-logo-03.png";
import hcmus from "../../../assets/images/partner-logo-05.png";
import classroom2018 from "../../../assets/camp-archive/2018/04-ben-trong-lop-hoc/anh-28.jpg";
import whiteboard2018 from "../../../assets/camp-archive/2018/04-ben-trong-lop-hoc/anh-14.jpg";
import talk2019 from "../../../assets/camp-archive/2019/08-thuyet-trinh/anh-015.jpg";
import blackboard2016 from "../../../assets/camp-archive/2016/02-nhung-buoi-hoc-dau-tien/img2-08.jpg";
import discussion2016 from "../../../assets/camp-archive/2016/02-nhung-buoi-hoc-dau-tien/img2-04.jpg";
import group2025 from "../../../assets/camp-archive/2025/cover-tphcm.jpg";
import group2019 from "../../../assets/camp-archive/2019/cover.jpg";
import stockBlackboard from "../../../assets/images/dan-cristian-padure-h3kuhyuce9a-unsplash.avif";
import reportCover from "./report-cover.jpg";
import sphere from "./sphere-mask.png";
import { pressQuotes } from "../press";
import { testimonials as rawTestimonials } from "../../testimonials";

export { reportCover, sphere, stockBlackboard };

export const hero = {
  // Report ch. 02, the slogan.
  title: "Khám phá những biên giới mới của toán học và ứng dụng",
  // Report ch. 02, what PiMA is, without "tiên phong" and "hàng đầu".
  lead: "PiMA (Projects in Mathematics and Applications) là tổ chức giáo dục toán học và ứng dụng, được thành lập năm 2016 bởi các nhà toán học Việt Nam. PiMA là cầu nối giữa tri thức học thuật và các ứng dụng trong khoa học, công nghệ và đời sống.",
  primary: { label: "Xem các chương trình", href: "#programs" },
  secondary: { label: "Về PiMA", href: "/ve-chung-toi/" },
};

/** Separate photos (no baked-in layout), from the camp archive: shown there already. */
export const photos = {
  talk2019: { src: talk2019, alt: "Trại sinh thuyết trình về tích chập tại Trại hè PiMA 2019" },
  classroom2018: { src: classroom2018, alt: "Trại sinh làm bài trên máy tính tại Trại hè PiMA 2018" },
  blackboard2016: { src: blackboard2016, alt: "Buổi học đầu tiên của Trại hè PiMA 2016" },
  discussion2016: { src: discussion2016, alt: "Trại sinh thảo luận trong giờ học, Trại hè PiMA 2016" },
  whiteboard2018: { src: whiteboard2018, alt: "Giảng bài trên bảng trắng tại Trại hè PiMA 2018" },
  group2025: { src: group2025, alt: "Trại sinh và ban tổ chức Trại hè PiMA 2025 tại TP.HCM" },
  group2019: { src: group2019, alt: "Trại sinh và ban tổ chức Trại hè PiMA 2019" },
};

/** Cleared scale figures, as of October 2026. */
export const figures = [
  { value: "10", label: "mùa trại hè", detail: "2016–2026" },
  { value: "200+", label: "trại sinh", detail: "từ 35+ tỉnh thành" },
  { value: "40+", label: "mentor", detail: "từ các trường đại học" },
  { value: "50+", label: "dự án nghiên cứu", detail: "của học sinh" },
  { value: "80+", label: "bài giảng", detail: "Toán cao cấp và ứng dụng" },
  { value: "1.000+", label: "người tham gia", detail: "các hoạt động của PiMA" },
];
export const figuresSource = "Số liệu tháng 10/2026.";

export const report = {
  href: "https://issuu.com/pimavn/docs/pima_impact_report_2016-2024_vietnamese_version_",
  title: "Báo cáo tác động 2016–2024",
  text: "Hoạt động của PiMA từ 2016 đến 2024: trại hè, khóa học, cộng đồng và đối tác.",
  cta: "Đọc báo cáo",
};

export const programsLead = "PiMA tổ chức hai chương trình chính: trại hè cho học sinh THPT và các khóa học trực tuyến.";

export const camp = {
  name: "Trại hè Toán học và Ứng dụng",
  short: "Trại hè",
  text: "Trại hè học thuật 8–10 ngày, học tập và sinh hoạt tập trung, dành cho học sinh THPT trên toàn quốc.",
  activities: [
    "Các buổi học Toán cao cấp, mô hình ứng dụng và lập trình",
    "Tham quan công ty công nghệ và tọa đàm với diễn giả khách mời",
    "Làm dự án nghiên cứu theo nhóm",
  ],
  facts: [{ value: "10", label: "mùa trại từ 2016" }],
  rows: {
    who: "Học sinh THPT trên toàn quốc",
    length: "8–10 ngày",
    format: "Học tập và sinh hoạt tập trung",
    end: "Thuyết trình dự án nghiên cứu nhóm",
  },
  cta: { label: "Tìm hiểu về trại hè", href: "/trai-he-toan-hoc-pima/" },
};

export const course = {
  name: "Khóa học trực tuyến",
  short: "Khóa học",
  text: "Khóa Math Modeling 4 tuần giới thiệu mô hình toán học qua các ví dụ, dành cho học sinh THPT và sinh viên.",
  activities: [
    "Bài giảng bắt đầu từ tình huống cụ thể",
    "Trao đổi và thảo luận trên Discord của PiMA",
    "Cuộc thi PiMA Modelling Challenge cuối khóa",
  ],
  facts: [
    { value: "4", label: "khóa học trực tuyến" },
    { value: "500+", label: "học viên Math Modeling" },
  ],
  rows: {
    who: "Học sinh THPT và sinh viên",
    length: "4 tuần",
    format: "Trực tuyến",
    end: "Cuộc thi PiMA Modelling Challenge",
  },
  cta: { label: "Xem các khóa học", href: "/khoa-hoc/" },
};

/** The six testimonials, "PIMA" fixed to "PiMA". */
export const testimonials = rawTestimonials.map((t) => ({ ...t, role: t.role.map((r) => r.replace("PIMA", "PiMA")) }));

export const partners = [
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

export { pressQuotes };
