// Content of the `Impact` section: the cleared scale figures (the map's Notes, #118) and the
// impact report card.
import cover from "../assets/images/impact-report-cover.jpg";

export interface Figure {
  /** The big number, Vietnamese number format ("1.000+"). */
  value: string;
  /** What is counted, bold under the number. */
  label: string;
  /** The muted line under the label. */
  detail: string;
}

/** Cleared scale figures, as of October 2026. */
export const figures: Figure[] = [
  { value: "10", label: "mùa trại hè", detail: "2016–2026" },
  { value: "200+", label: "trại sinh", detail: "từ 35+ tỉnh thành" },
  { value: "40+", label: "mentor", detail: "từ các trường đại học" },
  { value: "50+", label: "dự án nghiên cứu", detail: "của học sinh" },
  { value: "80+", label: "bài giảng", detail: "Toán cao cấp và ứng dụng" },
  { value: "1.000+", label: "người tham gia", detail: "các hoạt động của PiMA" },
];

/** The figures' source line, shown beside the heading. */
export const figuresSource = "Số liệu tháng 10/2026.";

/** The impact report: p. 1 of the PDF at 150 dpi as the cover (Về chúng tôi reuses the file). */
export const report = {
  href: "https://issuu.com/pimavn/docs/pima_impact_report_2016-2024_vietnamese_version_",
  cover,
  title: "Báo cáo tác động 2016–2024",
  text: "Hoạt động của PiMA từ 2016 đến 2024: trại hè, khóa học, cộng đồng và đối tác.",
  cta: "Đọc báo cáo",
};
