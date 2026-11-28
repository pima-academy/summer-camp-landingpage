// Content of the `Milestone` section: report ch. 04 in full, the 2026 camp (camp archive) and
// the SCUDEM results of 2024 and 2025 (the cleared list of the map's Notes, #118; no month).

export interface Milestone {
  /** Month as "Tháng 8"; none for a result known only by year. */
  month?: string;
  text: string;
  /** The camp's or course's topic, bold italic per docs/brand.md's timeline rule. */
  topic?: string;
}

export interface MilestoneYear {
  year: string;
  entries: Milestone[];
}

/** Oldest first; one column per year. */
export const milestoneYears: MilestoneYear[] = [
  { year: "2016", entries: [{ month: "Tháng 8", text: "Dự án PiMA được thành lập và tổ chức trại hè đầu tiên:", topic: "Toán mô hình (Mathematical Modeling)" }] },
  { year: "2017", entries: [{ month: "Tháng 8", text: "Trại hè lần thứ hai:", topic: "Các mô hình toán đa lĩnh vực (Mathematical and Multidisciplinary Models)" }] },
  {
    year: "2018",
    entries: [
      { month: "Tháng 2", text: "Workshop đầu tiên:", topic: "Tối ưu hóa (Optimization)" },
      { month: "Tháng 8", text: "Trại hè lần thứ ba:", topic: "Toán học trong Học máy (The Mathematics of Machine Learning)" },
    ],
  },
  {
    year: "2019",
    entries: [
      { month: "Tháng 8", text: "Trại hè lần thứ tư:", topic: "Toán học trong Học sâu (The Mathematics of Deep Learning)" },
      { month: "Tháng 8", text: "PiMA lần đầu xuất hiện trên sóng Đài Truyền hình TP.HCM." },
    ],
  },
  { year: "2021", entries: [{ month: "Tháng 7", text: "Trại hè lần thứ năm:", topic: "Toán học trong Khoa học Dữ liệu (The Mathematics of Data Science)" }] },
  { year: "2023", entries: [{ month: "Tháng 7", text: "Trại hè lần thứ sáu:", topic: "Toán học và Ứng dụng trong Tin Sinh học (Applied Mathematics in Bioinformatics)" }] },
  {
    year: "2024",
    entries: [
      { month: "Tháng 7", text: "Trại hè lần thứ bảy:", topic: "Quy hoạch Tuyến tính (Linear Programming)" },
      { month: "Tháng 10", text: "Podcast đầu tiên: Thành công ở các cuộc thi toán và con đường tương lai." },
      { month: "Tháng 11", text: "Khóa học trực tuyến đầu tiên:", topic: "Toán mô hình (Mathematical Modeling)" },
      { text: "Một đội PiMA dự thi mô hình toán học quốc tế SCUDEM và đạt 1 giải Outstanding." },
    ],
  },
  {
    year: "2025",
    entries: [
      { month: "Tháng 1", text: "Công ty Cổ phần PiMA Academy được thành lập." },
      { month: "Tháng 8", text: "Lần đầu tổ chức trại hè ở cả TP.HCM và Hà Nội." },
      { text: "Năm đội PiMA dự thi SCUDEM, đạt 2 giải Outstanding và 3 giải Meritorious." },
    ],
  },
  { year: "2026", entries: [{ month: "Tháng 8", text: "Trại hè 2026 tại TP.HCM:", topic: "Toán học trong Trí tuệ Nhân tạo (Mathematics in Artificial Intelligence)" }] },
];
