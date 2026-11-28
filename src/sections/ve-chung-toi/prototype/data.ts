// PROTOTYPE (throwaway, branch prototype/about-redesign; dev only): the content every Về chúng tôi
// variant shares (issue #125), from the sections decided in #123, the impact report (ch. 02, 03,
// 04, 07, 09, 10) and the cleared figures of the map's Notes (#118). Variants differ in layout
// only, never in facts.
import team from "../../../assets/images/pima-team.png";
import founders from "../../../assets/images/impact-report-no-q-111sdfs.avif";
import reportCover from "../../home/prototype/report-cover.jpg";
import storyFirstClass from "./story-first-class-2016.jpg";
import storyFirstCampers from "./story-first-campers-2016.jpg";
import storyVnu from "./story-vnu-30-years.jpg";
import storyFounder from "./story-founder.jpg";
import voVanToi from "./expert-vo-van-toi.jpg";
import lyQuocNgoc from "./expert-ly-quoc-ngoc.jpg";
import tranMinhTriet from "./expert-tran-minh-triet.jpg";
import vuongHy from "./expert-vuong-hy.jpg";
import leThien from "./expert-le-thien.jpg";
import phamKimSon from "./expert-pham-kim-son.jpg";

export { reportCover };

/** The footer's seven "Về PiMA" anchors, one per section 1–7 (#123). */
export const anchors = {
  intro: "gioi-thieu",
  aims: "tam-nhin-su-menh",
  story: "cau-chuyen-nha-sang-lap",
  milestones: "cac-cot-moc",
  network: "mang-luoi-nhan-tai",
  experts: "chuyen-gia-dong-hanh",
  plans: "ke-hoach-tuong-lai",
} as const;

/** 1. Opening. Report ch. 02, without "tổ chức tiên phong" and "những trường đại học hàng đầu thế giới". */
export const opening = {
  lead: "PiMA (Projects in Mathematics and Applications) là tổ chức giáo dục toán học và ứng dụng, được thành lập năm 2016 bởi các nhà toán học Việt Nam. Với mong muốn mở ra cơ hội tiếp cận toán học theo hướng thực tiễn, PiMA là cầu nối giữa tri thức học thuật và các ứng dụng trong khoa học, công nghệ và đời sống.",
  photo: { src: team, alt: "Thành viên PiMA" },
};

/** 2. Vision, mission, actions. Report ch. 02 in the October 2026 wording, every "hàng đầu" removed. */
export const aims = {
  vision:
    "PiMA hướng đến việc trở thành một tổ chức giáo dục, nghiên cứu toán học và ứng dụng, nơi hội tụ và nuôi dưỡng các tài năng, giúp họ phát huy tối đa tiềm năng và đóng góp tích cực vào sự phát triển bền vững của xã hội.",
  mission:
    "PiMA được thành lập với sứ mệnh phát triển giáo dục toán học tại Việt Nam. Thông qua các chương trình giảng dạy tiên tiến, lấy người học làm trọng tâm, chúng tôi hướng tới việc giúp mọi người không chỉ hiểu sâu hơn về toán mà còn biết cách vận dụng nó để tạo ra những ứng dụng thực tiễn.",
  actions: [
    {
      title: "Ươm mầm tài năng",
      text: "Tìm kiếm, truyền cảm hứng và hỗ trợ các cá nhân có năng lực và đam mê toán học vươn tầm thế giới.",
    },
    {
      title: "Kết nối cộng đồng",
      text: "Xây dựng mạng lưới kết nối giáo dục, nghiên cứu và doanh nghiệp nhằm thúc đẩy việc hợp tác đào tạo và nghiên cứu ứng dụng của toán học tại Việt Nam.",
    },
    {
      title: "Ứng dụng Toán học vào thực tiễn",
      text: "Nghiên cứu các mô hình và thuật toán tối ưu cho trí tuệ nhân tạo, khoa học dữ liệu, tài chính, tin sinh học và nhiều lĩnh vực khác.",
    },
  ],
};

/** 3. The founder story as prose, rewritten from report ch. 09 (no "miễn phí", no "Google"; "hàng nghìn" → 1.000+). */
export const story = {
  chapters: [
    {
      title: "Từ một ý tưởng mùa hè",
      paragraphs: [
        "Mùa hè năm 2016, Cấn Trần Thành Trung, khi đó là du học sinh tại Đại học Duke (Hoa Kỳ), dùng học bổng mùa hè của mình cho một dự án: tổ chức một trại hè toán học và ứng dụng tại Việt Nam. Cùng hai người bạn thân là Trần Hoàng Bảo Linh và Lê Việt Hải, Trung sáng lập PiMA (Projects in Mathematics and Applications), một môi trường nơi học sinh không chỉ học toán mà còn dùng toán để giải quyết vấn đề thực tiễn, làm việc nhóm và rèn luyện tư duy nghiên cứu.",
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
    },
    {
      title: "Từ một trại hè đến một tổ chức giáo dục",
      paragraphs: [
        "Ở trại hè, học sinh tham gia dự án thực tế, làm việc nhóm và kết nối với giảng viên, chuyên gia trong nước và quốc tế. Sau hai năm hoạt động, PiMA nhận được sự hỗ trợ của Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM, các mạnh thường quân, phụ huynh cựu trại sinh và một số doanh nghiệp công nghệ.",
        "Năm 2025, PiMA chuyển từ một dự án phi lợi nhuận thành một tổ chức giáo dục: Công ty Cổ phần PiMA Academy. Sự chuyển đổi giúp PiMA hoạt động bền vững hơn, mở rộng quy mô và hợp tác chặt chẽ hơn với doanh nghiệp, tổ chức nghiên cứu và trường đại học.",
        "Đến nay, hơn 1.000 người đã tham gia các hoạt động của PiMA. Nhiều người trong số họ đang học tập, nghiên cứu và làm việc tại MIT, Yale, Meta và nhiều nơi khác.",
      ],
    },
  ],
  quote: "Mỗi tài năng toán học đều có thể vươn xa, nếu được đặt trong một môi trường giáo dục phù hợp.",
  photos: {
    founder: { src: storyFounder, alt: "TS. Cấn Trần Thành Trung", caption: "TS. Cấn Trần Thành Trung, đồng sáng lập PiMA" },
    founders: {
      src: founders,
      alt: "Trần Hoàng Bảo Linh và Cấn Trần Thành Trung",
      caption: "Hai người bạn đồng sáng lập PiMA: Trần Hoàng Bảo Linh (trái) và Cấn Trần Thành Trung (phải)",
    },
    firstClass: { src: storyFirstClass, alt: "Cấn Trần Thành Trung giảng bài trước lớp", caption: "Buổi học đầu tiên của Trại hè PiMA 2016 do Trung giảng dạy" },
    firstCampers: { src: storyFirstCampers, alt: "Trại sinh ngồi trong lớp học", caption: "Những trại sinh đầu tiên của PiMA, 2016" },
    vnu: { src: storyVnu, alt: "TS. Cấn Trần Thành Trung phát biểu tại bục ĐHQG-HCM", caption: "TS. Trung chia sẻ câu chuyện của PiMA tại lễ kỷ niệm 30 năm thành lập ĐHQG-HCM" },
  },
};

/** 4. Milestones: report ch. 04 in full, the 2026 camp (camp archive) and SCUDEM (cleared list). */
export interface Milestone {
  /** Month as "Tháng 8", or undefined for a result known only by year. */
  month?: string;
  text: string;
  /** The camp's topic, in bold italic per docs/brand.md's timeline rule. */
  topic?: string;
}
export const milestoneYears: { year: string; entries: Milestone[] }[] = [
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

/** 5. The talent network. Cleared list (October 2026) and report ch. 07 (text, no names of people). */
export const network = {
  source: "Số liệu tháng 10/2026.",
  headline: { value: "250+", label: "cựu trại sinh, mentor và thành viên ban tổ chức", where: "đang sống tại 11 quốc gia" },
  figures: [
    { value: "250+", label: "thành viên", detail: "cựu trại sinh, mentor và ban tổ chức" },
    { value: "11", label: "quốc gia", detail: "nơi các thành viên đang sống" },
    { value: "500+", label: "học viên Math Modeling", detail: "400+ trên Discord của PiMA" },
    { value: "16.000+", label: "người theo dõi", detail: "trang Facebook của PiMA" },
  ],
  achievements: [
    { value: "8", label: "huy chương Olympic Toán học Quốc tế (IMO)" },
    { value: "17", label: "giải Học sinh giỏi Quốc gia" },
    { value: "5", label: "thủ khoa tốt nghiệp đại học" },
    { value: "1", label: "quán quân Đường lên đỉnh Olympia" },
    { value: "1", label: "huy chương Olympic Tin học châu Á (APIO)" },
  ],
  mentors:
    "Đội ngũ hướng dẫn kết nối, hướng dẫn và đồng hành cùng các thế hệ trại sinh tiếp theo. Mentor bảo đảm chất lượng chuyên môn và mở ra cơ hội kết nối nghề nghiệp cho các bạn trẻ. Phần lớn mentor đã hoặc đang theo học các chương trình cao học và nghiên cứu sinh thuộc lĩnh vực STEM.",
  alumni:
    "Các thành viên hỗ trợ nhau trong học tập, nghiên cứu, cơ hội nghề nghiệp và học bổng du học: hướng dẫn hoàn thiện hồ sơ xin học bổng, viết thư giới thiệu cho các chương trình nghiên cứu và thực tập, giới thiệu phỏng vấn tại các công ty.",
  universities: [
    "MIT",
    "Yale",
    "UCLA",
    "UC Irvine",
    "UIUC",
    "Brown",
    "Rutgers",
    "Northeastern",
    "CUHK",
    "Viện Max Planck",
    "KAIST",
    "NTU",
    "ĐH Paris Cité",
    "ĐH Khoa học Tự nhiên, ĐHQG-HCM",
  ],
  companies: ["Meta", "Netflix", "Amazon", "WorldQuant", "LINE Vietnam", "KMS Technology", "Pendle", "Hamming AI"],
  report: {
    href: "https://issuu.com/pimavn/docs/pima_impact_report_2016-2024_vietnamese_version_",
    title: "Báo cáo tác động 2016–2024",
    text: "Hoạt động của PiMA từ 2016 đến 2024: trại hè, khóa học, cộng đồng và đối tác.",
    cta: "Đọc báo cáo",
  },
};

/** 6. The six experts. Titles and roles from report ch. 03 (p. 11–12), photos and captions from p. 13 (904 px). */
export const expertsLead =
  "Từ năm 2016 đến nay, nhiều chuyên gia từ các tổ chức giáo dục và công ty công nghệ trong và ngoài nước đã đồng hành cùng PiMA với vai trò người hướng dẫn, diễn giả khách mời, cố vấn chuyên môn và đơn vị bảo trợ.";
export const experts = [
  {
    name: "GS. TS. Võ Văn Tới",
    role: "Nguyên Trưởng Bộ môn Kĩ thuật Y Sinh, Trường ĐH Quốc tế, ĐHQG-HCM",
    photo: voVanToi,
    alt: "Thầy Võ Văn Tới cầm một thiết bị y sinh, học sinh đứng quanh quan sát",
    caption: "Giới thiệu ngành kĩ thuật y sinh và các thiết bị thí nghiệm",
  },
  {
    name: "PGS. TS. Trần Minh Triết",
    role: "Phó Hiệu trưởng, Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM; Viện trưởng Viện John von Neumann, ĐHQG-HCM",
    photo: tranMinhTriet,
    alt: "Thầy Trần Minh Triết cầm micro thuyết trình trước màn chiếu",
    caption: "Giới thiệu những ứng dụng của trí tuệ nhân tạo",
  },
  {
    name: "PGS. TS. Lý Quốc Ngọc",
    role: "Trưởng Bộ môn Thị giác máy tính và Điều khiển học thông minh, Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM",
    photo: lyQuocNgoc,
    alt: "Thầy Lý Quốc Ngọc giảng bài trước màn chiếu về hệ thống theo dõi vật thể",
    caption: "Ứng dụng của mạng học sâu trong xử lí ảnh",
  },
  {
    name: "ThS. Lê Thiện",
    role: "Nghiên cứu sinh tiến sĩ Học máy, Viện Công nghệ Massachusetts (MIT), Hoa Kỳ",
    photo: leThien,
    alt: "ThS. Lê Thiện giảng bài trước lớp học",
    caption: "Giới thiệu về học máy",
  },
  {
    name: "TS. Phạm Kim Sơn",
    role: "Giám đốc, Công ty BioTuring, Việt Nam",
    photo: phamKimSon,
    alt: "TS. Phạm Kim Sơn cầm micro giảng bài cạnh bảng viết",
    caption: "Các bài toán trong tin sinh học",
  },
  {
    name: "Vương Hy",
    role: "Bộ phận Nghiên cứu và Phát triển, Công ty BioTuring, Việt Nam",
    photo: vuongHy,
    alt: "Vương Hy chỉ lên màn chiếu, học sinh ngồi nghe",
    caption: "Các mô hình toán học trong giải mã gen",
  },
];

/** 7. Future plans. Report ch. 10, without "hàng đầu"; p. 37's line moves here from Philosophy. */
export const plans = {
  title: "Hướng đến một trung tâm đào tạo và nghiên cứu Toán học ứng dụng tại Việt Nam",
  lead: "Trong 3–5 năm tới, PiMA đặt mục tiêu trở thành trung tâm đào tạo và nghiên cứu Toán học ứng dụng tại Việt Nam, mở rộng hợp tác quốc tế và hướng đến ứng dụng Toán học trong khởi nghiệp và công nghệ.",
  blocks: [
    {
      icon: "braces",
      title: "Mở rộng đào tạo và nghiên cứu",
      items: [
        "Thêm các khóa học chuyên sâu về Toán học và ứng dụng, khoa học dữ liệu, trí tuệ nhân tạo và học máy",
        "Tăng cường chương trình mentorship và hỗ trợ nghiên cứu",
      ],
    },
    {
      icon: "messages",
      title: "Tăng cường hợp tác",
      items: [
        "Hợp tác đào tạo và nghiên cứu ứng dụng với các công ty công nghệ và tài chính để tạo cơ hội việc làm",
        "Phát triển quỹ học bổng PiMA hỗ trợ học viên tài năng",
      ],
    },
    {
      icon: "book",
      title: "Phát triển cộng đồng học thuật",
      items: [
        "Kết nối với giảng viên, cố vấn và doanh nghiệp trong và ngoài nước",
        "Tổ chức hội thảo, tọa đàm và cuộc thi học thuật",
        "Xây dựng diễn đàn và nội dung trực tuyến",
      ],
    },
  ] as const,
  closing: "Học viên là động lực và trọng tâm.",
};
