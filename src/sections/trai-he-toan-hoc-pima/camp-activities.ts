// The three camp activities of the `CampActivity` section, in the old site's order.
import type { ImageMetadata } from "astro";
import featureLessons from "../../assets/images/camp-feature-2.avif";
import featureTalks from "../../assets/images/camp-feature-3.avif";
import featureProjects from "../../assets/images/camp-feature-1.avif";

export interface CampActivity {
  image: ImageMetadata;
  alt: string;
  title: string;
  text: string;
}

export const campActivities: CampActivity[] = [
  {
    image: featureLessons,
    alt: "Trại sinh trong một buổi học Toán tại trại hè PiMA",
    title: "Các buổi học về Toán cao cấp, các mô hình ứng dụng và kỹ năng lập trình",
    text: "Học sinh được học các môn Toán học nền tảng như đại số tuyến tính, tối ưu hóa, xác suất thống kê cùng lập trình và mô hình ứng dụng, dưới sự hướng dẫn của đội ngũ mentor từ các trường đại học hàng đầu thế giới.",
  },
  {
    image: featureTalks,
    alt: "Buổi tọa đàm cùng diễn giả khách mời tại trại hè PiMA",
    title: "Các buổi tọa đàm cùng diễn giả khách mời",
    text: "Gặp gỡ các chuyên gia để lắng nghe chia sẻ thực tiễn về Toán học trong nghiên cứu và nghề nghiệp STEM, từ đó mở rộng góc nhìn, định hướng học tập và phát triển kỹ năng mềm.",
  },
  {
    image: featureProjects,
    alt: "Trại sinh làm dự án nghiên cứu theo nhóm",
    title: "Hoạt động làm dự án nghiên cứu theo nhóm",
    text: "Trại sinh áp dụng kiến thức đã học vào các bài toán thực tế, đồng thời rèn luyện kỹ năng nghiên cứu, làm việc nhóm, trình bày và quản lý thời gian trong môi trường học thuật chuyên nghiệp.",
  },
];
