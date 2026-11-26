// Sample mentors and student quotes of the `CourseDetail` section (gap page /detail-course/),
// kept as on the old site's course template (including its duplicated school name).
import type { ImageMetadata } from "astro";
import avatar from "../../assets/images/artboard-3-4x.avif";
import blankAvatar from "../../assets/images/blank-avatar.png";

export interface Mentor {
  name: string;
  /** Rendered in a <strong> (one sample card on the old site). */
  strong?: boolean;
  role: string;
  school: string;
  photo: ImageMetadata;
}

export const headMentors: Mentor[] = [
  { name: "Nguyễn Hồ Thăng Long", role: "Nghiên cứu sinh Tiến sĩ", school: "Đại học Dublin City", photo: avatar },
];

export const advisors: Mentor[] = [
  {
    name: "TS. Cấn Trần Thành Trung",
    strong: true,
    role: "Giảng viên",
    school: "Trường Đại học Khoa học tự nhiên, ĐHQG-HCMTrường Đại học Khoa học tự nhiên, ĐHQG-HCM",
    photo: avatar,
  },
];

export const mentors: Mentor[] = [
  { name: "Trần Phan Anh Danh", role: "Sinh viên", school: "Đại học Công nghệ Nanyang, Singapore", photo: avatar },
  { name: "Vòng Vĩnh Toàn", role: "Sinh viên", school: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM", photo: avatar },
  { name: "Nguyễn Minh Đức", role: "Sinh viên", school: "Đại học FPT Hà Nội", photo: avatar },
  { name: "Nguyễn Ngọc Cảnh", role: "Sinh viên", school: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM", photo: avatar },
];

export interface CourseQuote {
  quote: string;
  name: string;
  /** Role lines, rendered with <br> between them. */
  role: string[];
  photo: ImageMetadata;
}

export const courseQuotes: CourseQuote[] = [
  {
    quote:
      "“Dù bọn mình chỉ ôn lớp này trong 3 ngày nhưng đã đạt được huy chương bạc ở vòng thi chung kết với 27 đội tham gia, cao hơn những gì bọn mình kỳ vọng ban đầu. Tụi mình muốn cảm ơn các anh chị mentor đã mang tới lớp học này cũng như đã hỗ trợ tụi mình hết mức khi tụi mình có câu hỏi để đạt được kết quả như vậy.”",
    name: "Châu Phúc Khang",
    role: ["Học sinh, Trường Phổ thông Năng khiếu, ĐHQG-HCM", "Học viên Khóa AI Bootcamp (Tập huấn AI)"],
    photo: blankAvatar,
  },
  {
    quote:
      "“Khóa học thật sự rất thú vị, có lúc khá thử thách, nhưng cũng giúp mình hiểu rõ hơn về cách những mô hình AI này hoạt động “đằng sau hậu trường”. Phần thực hành bằng Python là điểm mình thích nhất - vừa học vừa làm, vừa thấy kiến thức dần “vỡ” ra.”",
    name: "Võ Hoàng Nhật Khang",
    role: [
      "Nghiên cứu sinh tiến sĩ (Học bổng toàn phần), Đại học Trí tuệ Nhân tạo Mohamed bin Zayed, UAE",
      "Học viên Khóa Generative AI (AI Tạo sinh)",
    ],
    photo: blankAvatar,
  },
  {
    quote:
      "“Các bài giảng trong khóa học được thiết kế khá hợp lý và dễ hiểu. Mỗi bài giảng đều cung cấp đầy đủ kiến thức cơ bản và có sự liên kết chặt chẽ giữa các chủ đề, giúp học sinh dễ dàng tiếp thu. Mình rất trân trọng sự tận tâm của các mentor trong việc truyền đạt và giải thích các vấn đề phức tạp một cách dễ hiểu, tạo điều kiện cho học sinh có thể nắm vững kiến thức.”",
    name: "Phạm Nguyễn Trung Nghĩa",
    role: ["Giáo viên tự do", "Học viên Khóa Mathematical Modeling (Mô hình hóa Toán học)"],
    photo: blankAvatar,
  },
];
