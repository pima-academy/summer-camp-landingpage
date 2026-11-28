// Content of the `FounderStory` section: the founder story as prose, rewritten from report
// ch. 09 (no "miễn phí", no "Google", "hàng nghìn người" as 1.000+), and its photos (report
// p. 6, 30–32; the co-founders photo from the old page).
import type { ImageMetadata } from "astro";
import founders from "../../assets/images/impact-report-no-q-111sdfs.avif";
import firstCampers from "../../assets/images/ve-chung-toi/story-first-campers-2016.jpg";
import firstClass from "../../assets/images/ve-chung-toi/story-first-class-2016.jpg";
import founder from "../../assets/images/ve-chung-toi/story-founder.jpg";
import vnu from "../../assets/images/ve-chung-toi/story-vnu-30-years.jpg";

export interface StoryPhoto {
  src: ImageMetadata;
  alt: string;
  caption: string;
}

export interface Chapter {
  title: string;
  paragraphs: string[];
  /** Photos shown after the chapter: one wide, or two as a pair. */
  photos?: StoryPhoto[];
}

/** The founder's portrait in the sticky aside. */
export const portrait: StoryPhoto = {
  src: founder,
  alt: "TS. Cấn Trần Thành Trung",
  caption: "TS. Cấn Trần Thành Trung, đồng sáng lập PiMA",
};

/** The line under the portrait, from ch. 09. */
export const quote = "Mỗi tài năng toán học đều có thể vươn xa, nếu được đặt trong một môi trường giáo dục phù hợp.";

export const chapters: Chapter[] = [
  {
    title: "Từ một ý tưởng mùa hè",
    paragraphs: [
      "Mùa hè năm 2016, Cấn Trần Thành Trung, khi đó là du học sinh tại Đại học Duke (Hoa Kỳ), dùng học bổng mùa hè của mình cho một dự án: tổ chức một trại hè toán học và ứng dụng tại Việt Nam. Cùng hai người bạn thân là Trần Hoàng Bảo Linh và Lê Việt Hải, Trung sáng lập PiMA (Projects in Mathematics and Applications), một môi trường nơi học sinh không chỉ học toán mà còn dùng toán để giải quyết vấn đề thực tiễn, làm việc nhóm và rèn luyện tư duy nghiên cứu.",
    ],
    photos: [
      {
        src: founders,
        alt: "Trần Hoàng Bảo Linh và Cấn Trần Thành Trung",
        caption: "Hai người bạn đồng sáng lập PiMA: Trần Hoàng Bảo Linh (trái) và Cấn Trần Thành Trung (phải)",
      },
    ],
  },
  {
    title: "Một câu hỏi từ năm 2014",
    paragraphs: [
      "Năm 2014, khi bắt đầu học đại học tại Mỹ, Trung nhận ra sự khác biệt giữa hai hệ thống giáo dục. Sinh viên ở Mỹ được khuyến khích ứng dụng toán học vào khoa học dữ liệu, tài chính định lượng, trí tuệ nhân tạo và nhiều lĩnh vực công nghệ cao. Học sinh Việt Nam có nền tảng toán học tốt nhưng chủ yếu tập trung vào giải bài tập và thi cử, ít có cơ hội nghiên cứu và làm việc trong môi trường thực tế.",
      "Trung đặt câu hỏi: làm thế nào để học sinh Việt Nam không chỉ giỏi toán mà còn dùng toán để tạo ra những ứng dụng trong thực tế? Câu trả lời là một trại hè toán học và ứng dụng, nơi học sinh học toán qua nghiên cứu thực tế, các bài giảng chuyên sâu và làm việc nhóm cùng đội ngũ hướng dẫn.",
    ],
  },
  {
    title: "Học bổng cá nhân cho trại hè đầu tiên",
    paragraphs: [
      "Một trại hè toán học cần giảng viên, tài liệu, cơ sở vật chất và một đội ngũ tổ chức, và một dự án mới khó tìm được nguồn tài trợ. Trung dùng học bổng phát triển cá nhân tại Đại học Duke để chi trả cho trại hè đầu tiên. Trung và các bạn tự thiết kế chương trình giảng dạy, liên hệ giảng viên và tìm sự hỗ trợ từ cộng đồng. Tháng 8/2016, Trại hè PiMA đầu tiên diễn ra.",
    ],
    photos: [
      { src: firstClass, alt: "Cấn Trần Thành Trung giảng bài trước lớp", caption: "Buổi học đầu tiên của Trại hè PiMA 2016 do Trung giảng dạy" },
      { src: firstCampers, alt: "Trại sinh ngồi trong lớp học", caption: "Những trại sinh đầu tiên của PiMA, 2016" },
    ],
  },
  {
    title: "Từ một trại hè đến một tổ chức giáo dục",
    paragraphs: [
      "Ở trại hè, học sinh tham gia dự án thực tế, làm việc nhóm và kết nối với giảng viên, chuyên gia trong nước và quốc tế. Sau hai năm hoạt động, PiMA nhận được sự hỗ trợ của Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM, các mạnh thường quân, phụ huynh cựu trại sinh và một số doanh nghiệp công nghệ.",
      "Năm 2025, PiMA chuyển từ một dự án phi lợi nhuận thành một tổ chức giáo dục: Công ty Cổ phần PiMA Academy. Sự chuyển đổi giúp PiMA hoạt động bền vững hơn, mở rộng quy mô và hợp tác chặt chẽ hơn với doanh nghiệp, tổ chức nghiên cứu và trường đại học.",
      "Đến nay, hơn 1.000 người đã tham gia các hoạt động của PiMA. Nhiều người trong số họ đang học tập, nghiên cứu và làm việc tại MIT, Yale, Meta và nhiều nơi khác.",
    ],
    photos: [
      {
        src: vnu,
        alt: "TS. Cấn Trần Thành Trung phát biểu tại bục ĐHQG-HCM",
        caption: "TS. Trung chia sẻ câu chuyện của PiMA tại lễ kỷ niệm 30 năm thành lập ĐHQG-HCM",
      },
    ],
  },
];
