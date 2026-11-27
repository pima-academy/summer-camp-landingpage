// PROTOTYPE (throwaway, branch prototype/camp-archive-page): the 2019 and 2025 camp years on the
// content model of issue #87, for the camp archive page design prototype (issue #89). Real data
// from the old-site and 2025/2026 inventories. Old-site files have no Drive home yet, so their
// links are "#". Photos: six per 2019 gallery section, resized from the old site.
import type { ImageMetadata } from "astro";
import tranMinhTriet from "../../../assets/images/tran-minh-triet.avif";
import canTranThanhTrung from "../../../assets/images/can-tran-thanh-trung.avif";
import tranThanhLong from "../../../assets/images/tran-thanh-long.avif";
import phamKimSon from "../../../assets/images/pham-kim-son.avif";
import cover2019 from "../../../assets/camp-archive/2019/cover.jpg";
// Temporary: the 2018 old-site banner stands in until the user supplies a 2025 cover.
import cover2025 from "../../../assets/camp-archive/2025/cover-temp-2018-banner.jpg";

export type FileLabel = "PDF" | "Slide" | "Notebook" | "Thư mục" | "Mã nguồn" | "Lời giải";
export interface FileLink { label: FileLabel; url: string }
export interface Person { name: string; affiliation?: string }
export interface DocItem { title: string; authors: Person[]; files: FileLink[]; fromYear?: number }
export type Campus = "Hà Nội" | "TP.HCM" | "Trực tuyến";
export interface Camper { name: string; school: string }
export interface ProjectGroup {
  reportTitle?: string;
  campus?: Campus;
  campers: Camper[];
  mentors: Person[];
  files: FileLink[];
}
export interface ProjectTopic { title: string; description?: string; brief?: FileLink; groups: ProjectGroup[] }
export interface TeamMember { name: string; affiliation?: string; photo?: ImageMetadata }
export interface GallerySection { name?: string; folder: string; total: number }
export interface CampYear {
  year: number;
  topic: { vi: string; en: string };
  description?: string[];
  programme?: string[];
  /** One per camp held that year; start and end as ISO dates. */
  sessions?: { campus?: Campus; start: string; end: string; venue?: string }[];
  cover?: ImageMetadata;
  team?: { name: string; members: TeamMember[] }[];
  entranceExam?: DocItem[];
  lectures?: DocItem[];
  exercises?: DocItem[];
  reading?: DocItem[];
  projects?: ProjectTopic[];
  gallery?: GallerySection[];
  video?: { youtubeId: string };
}

const pdf = (url = "#"): FileLink => ({ label: "PDF", url });
const drive = (id: string): string => `https://drive.google.com/file/d/${id}/view`;
const folder = (id: string): string => `https://drive.google.com/drive/folders/${id}`;

const linh = { name: "Trần Hoàng Bảo Linh", affiliation: "National University of Singapore" };
const nguyen = { name: "Nguyễn Nguyễn", affiliation: "VNUHCM University of Science, Vietnam" };
const duong = { name: "Vương Nguyễn Thùy Dương", affiliation: "Massachusetts Institute of Technology, USA" };
const thien = { name: "Lê Thiện", affiliation: "Massachusetts Institute of Technology, USA" };
const minhNguyen = { name: "Trần Minh Nguyên", affiliation: "VNUHCM University of Science, Vietnam" };
const huy = { name: "Nguyễn Minh Huy", affiliation: "VNUHCM University of Science, Vietnam" };
const phuc = { name: "Lâm Hữu Phúc", affiliation: "University of Rochester, USA" };

const ptnk = "Trường Phổ thông Năng khiếu, Đại học Quốc gia TP. HCM";

export const camp2019: CampYear = {
  year: 2019,
  topic: { vi: "Toán học trong Học sâu", en: "The Mathematics of Deep Learning" },
  cover: cover2019,
  // From the user (2026-11-27).
  sessions: [{ campus: "TP.HCM", start: "2019-07-29", end: "2019-08-09", venue: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM" }],
  lectures: [
    { title: "Đại số tuyến tính", fromYear: 2018, authors: [linh, { name: "Nguyễn Trung Nghĩa", affiliation: "VNUHCM University of Science, Vietnam" }, { name: "Cấn Trần Thành Trung", affiliation: "Caltech" }], files: [pdf()] },
    { title: "Tối ưu hóa", fromYear: 2018, authors: [{ name: "Phạm Hoàng Nhật", affiliation: "University of Washington" }], files: [pdf()] },
    { title: "Giải tích", fromYear: 2018, authors: [{ name: "Dương Đình Trọng", affiliation: "International University, VNU" }, linh], files: [pdf()] },
    { title: "Xác suất và phân phối", fromYear: 2018, authors: [{ name: "Vũ Lê Thế Anh", affiliation: "VNUHCM University of Science, Vietnam" }, linh, { name: "Phạm Nguyễn Mạnh", affiliation: "Minerva Schools at KGI, USA" }], files: [pdf()] },
    { title: "Vài mạng học sâu và ứng dụng (CNN và RNN)", authors: [duong], files: [pdf()] },
    { title: "Xác suất có điều kiện, Công thức Bayes, Xác suất tiền / hậu nghiệm", authors: [nguyen, linh], files: [pdf()] },
    { title: "Ánh xạ tuyến tính", authors: [minhNguyen], files: [pdf()] },
    { title: "Neural Network", authors: [duong], files: [pdf()] },
    { title: "Tối ưu hóa", authors: [thien], files: [pdf()] },
    { title: "MLE và MAP", authors: [nguyen], files: [pdf()] },
    { title: "Giới thiệu Máy học", authors: [thien], files: [pdf()] },
    { title: "Giải tích hàm đa biến", authors: [huy], files: [pdf()] },
    { title: "Giải tích hàm đơn biến", authors: [huy], files: [pdf()] },
    { title: "Biến ngẫu nhiên", authors: [phuc], files: [pdf()] },
    { title: "Xác suất và biến cố", authors: [nguyen], files: [pdf()] },
    { title: "Vector và ma trận", authors: [minhNguyen], files: [pdf()] },
    { title: "Không gian vector và cơ sở", authors: [phuc], files: [pdf()] },
  ],
  projects: [
    {
      title: "Conjugate Gradient Descent",
      description: "Conjugate Gradient Descent (CGD) là một phiên bản phức tạp hơn của Gradient Descent, phỏng theo thuật toán xấp xỉ nghiệm của hệ phương trình tuyến tính. Trong dự án này, chúng ta sẽ tìm hiểu trước CGD cho hàm bậc 2 nhiều biến (quadratic function) và tổng quát hóa ý tưởng này cho một hàm số khả vi bất kì.",
      brief: pdf(),
      groups: [
        { campers: [{ name: "Huỳnh Ngọc Tân", school: ptnk }, { name: "Nguyễn Thiện Nhân", school: ptnk }, { name: "Nguyễn Mạc Nam Trung", school: ptnk }, { name: "Ngô Nhựt Bảo Trân", school: "Trường THPT Chuyên Thoại Ngọc Hầu, An Giang" }], mentors: [], files: [pdf()] },
      ],
    },
    {
      title: "Image Classification",
      description: "Image Classification là một trong những bài toán khá quan trọng và điển hình trong xử lí ảnh. Image Classification cùng với object recognition và image segmentation là nền tảng cho ngành Thị giác Máy tính (computer vision) và mang nhiều ý nghĩa rất quan trọng. Mục tiêu của bài toán này là phân lớp đối tượng trong ảnh (ví dụ như nhận vào một bức ảnh và cho biết trong ảnh là chó hay mèo).",
      brief: pdf(),
      groups: [],
    },
    {
      title: "Image Segmentation",
      description: "Image Segmentation là một trong những bài toán khá quan trọng và điển hình trong xử lí ảnh. Image Segmentation cùng với object recognition và image classification là nền tảng cho ngành computer vision và mang nhiều ý nghĩa rất quan trọng. Mục tiêu của bài toán này là phân chia bức ảnh ra thành các vùng, trong đó các điểm ảnh thuộc mỗi vùng mang cùng một màu sắc tương ứng với nhãn dán của đối tượng đó, các vùng kề nhau mang màu sắc tương phản khá rõ rệt, tìm được đúng hình dạng của các đối tượng.",
      brief: pdf(),
      groups: [
        { reportTitle: "Mạng tích chập và mô hình UNET trong bài toán phân mảng hình ảnh", campers: [{ name: "Nguyễn Hoàng Khang", school: "Trường THPT Chuyên Lê Quý Đôn, Khánh Hòa" }, { name: "Tạ Quang Khôi", school: "Trường THPT Chuyên Lý Tự Trọng, Cần Thơ" }, { name: "Hoàng Nghĩa", school: ptnk }, { name: "Phan Nguyễn Tuấn Kiệt", school: ptnk }], mentors: [], files: [pdf()] },
        { reportTitle: "Ứng dụng mạng CNN và kiến trúc UNET trong việc phân tách nền và xe", campers: [{ name: "Lê Duy Thức", school: "Trường THPT Chuyên Hùng Vương, Bình Dương" }, { name: "Phạm Đình Anh Khoa", school: "Trường THPT Chuyên Lê Hồng Phong, TP. HCM" }, { name: "Lê Bảo Hiệp", school: ptnk }, { name: "Nguyễn Đại Nghĩa", school: ptnk }], mentors: [], files: [pdf()] },
      ],
    },
    {
      title: "Object Recognition",
      description: "Image Recognition là một trong những bài toán khá quan trọng và điển hình trong xử lí ảnh. Object Recognition cùng với image classification và image segmentation là nền tảng cho ngành Thị giác Máy tính (computer vision) và mang nhiều ý nghĩa rất quan trọng. Mục tiêu của bài toán này là xác định (các) đối tượng trong ảnh, trong đó việc xác định được định nghĩa là (1) Xác định vị trí đối tượng và (2) Xác định lớp (class) của đối tượng.",
      brief: pdf(),
      groups: [
        { reportTitle: "Object Detection", campers: [{ name: "Nguyễn Đắc Khôi Nguyên", school: "Trường THPT Nguyễn Hữu Huân, TP. HCM" }, { name: "Trương Minh Hoàng", school: "Northfield Mount Hermon School, MA, USA" }, { name: "Phạm Nguyễn Hằng Vân", school: "Trường THPT Chuyên Trần Phú, Hải Phòng" }, { name: "Lê Đình Hải", school: "Trường THPT Chuyên Lê Quý Đôn, Khánh Hòa" }], mentors: [], files: [pdf()] },
      ],
    },
    {
      title: "Sentimental Analysis",
      description: "Một trong những tính chất đặc thù của dữ liệu dạng văn bản đó chính là tính chất phụ thuộc của mỗi từ vào các từ trước đó. Giả sử chúng ta có câu ”Tôi thích đọc”, từ tiếp theo khả năng sẽ là ”sách” hoặc ”truyện”, mà không phải là ”thịt bò”. Tính chất này đưa đến cho chúng ta ý tưởng xây dựng một mô hình cho dữ liệu văn bản.",
      brief: pdf(),
      groups: [
        { campers: [{ name: "Nguyễn Thị Quỳnh Trang", school: "Trường THPT Chuyên KHTN, Đại học Quốc gia Hà Nội" }, { name: "Huỳnh Vũ Khôi Nguyên", school: "Trường THPT Chuyên Trần Hưng Đạo, Bình Thuận" }, { name: "Võ Minh Quân", school: "Trường THPT Chuyên Thăng Long, Đà Lạt" }, { name: "Hồ Tiến Đức", school: ptnk }], mentors: [], files: [pdf()] },
        { campers: [{ name: "Nguyễn Tài Tuệ", school: ptnk }, { name: "Nguyễn Hoàng Thuận", school: "Trường THPT Trị An, Đồng Nai" }, { name: "Nguyễn Phong Phú", school: "Trường THPT Chuyên Nguyễn Đình Chiểu, Sa Đéc" }, { name: "Nguyễn Kim Phương Trang", school: "Trường THPT Chuyên Lương Văn Chánh, Phú Yên" }], mentors: [], files: [pdf()] },
      ],
    },
  ],
  gallery: [
    { name: "Khai mạc", folder: "01", total: 28 },
    { name: "Những buổi học đầu tiên", folder: "02", total: 13 },
    { name: "Tiệc liên hoan nhỏ", folder: "03", total: 9 },
    { name: "Giao lưu với giáo sư Lý Quốc Ngọc", folder: "04", total: 16 },
    { name: "Chơi trò chơi giao lưu", folder: "05", total: 19 },
    { name: "Trò chơi lớn", folder: "06", total: 40 },
    { name: "Các trại sinh chuẩn bị thuyết trình", folder: "07", total: 21 },
    { name: "Phần thuyết trình của các bạn trại sinh", folder: "08", total: 110 },
    { name: "Tiệc liên hoan bế mạc", folder: "09", total: 7 },
    { name: "Trao bằng chứng nhận và chụp ảnh lưu niệm", folder: "10", total: 14 },
  ],
};

const team = "PiMA Team, Việt Nam";
const group = (
  campus: Campus,
  folderId: string,
  report: string,
  slides: string,
  campers: Camper[],
  extra: { reportTitle?: string; notebook?: string; mentors?: Person[] } = {},
): ProjectGroup => ({
  campus,
  reportTitle: extra.reportTitle,
  campers,
  mentors: extra.mentors ?? [],
  files: [
    pdf(drive(report)),
    { label: "Slide", url: drive(slides) },
    ...(extra.notebook ? [{ label: "Notebook" as const, url: drive(extra.notebook) }] : []),
    { label: "Thư mục" as const, url: folder(folderId) },
  ],
});
const ptnk25 = "Trường Phổ thông Năng khiếu, ĐHQG-TPHCM";

export const camp2025: CampYear = {
  year: 2025,
  topic: { vi: "Toán học trong các Mô hình Tạo sinh", en: "The Mathematics of Generative Models" },
  cover: cover2025,
  description: [
    "Toán học trong các Mô hình Tạo sinh (The Mathematics of Generative Models) là một chủ đề nằm ở giao điểm giữa Toán học, Khoa học Dữ liệu và Trí tuệ Nhân tạo. Mô hình tạo sinh là những hệ thống có khả năng học từ dữ liệu đã có để tạo ra dữ liệu mới theo yêu cầu của người dùng. Ví dụ điển hình là ChatGPT (tạo văn bản ngôn ngữ tự nhiên) và DALL-E (tạo hình ảnh từ văn bản). Đằng sau sức mạnh của các mô hình này là hệ thống các công cụ toán học và kỹ thuật lập trình sâu sắc. Những kiến thức đó được tích hợp để xử lý dữ liệu và huấn luyện mô hình. Qua đó, các kiến thức như đại số tuyến tính, vi tích phân và xác suất thống kê chính là nền tảng tạo nên trí tuệ của những hệ thống hiện đại này.",
  ],
  programme: [
    "Tiếp thu các kiến thức về đại số tuyến tính, xác suất thống kê và học sâu",
    "Học được các kỹ năng cơ bản về lập trình với Python và soạn thảo văn bản với LaTeX",
    "Tìm hiểu cách ứng dụng các kiến thức trên vào việc khám phá các khía cạnh khác nhau của mô hình tạo sinh và ứng dụng của mô hình trong thực tế",
    "Vận dụng các kiến thức và kĩ năng để hoàn thành một đề tài nhóm dưới sự hỗ trợ của các mentor đến từ các trường đại học lớn trong và ngoài nước.",
  ],
  sessions: [
    { campus: "TP.HCM", start: "2025-08-02", end: "2025-08-09", venue: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM" },
    { campus: "Hà Nội", start: "2025-08-11", end: "2025-08-18", venue: "Viện Nghiên cứu cao cấp về Toán (VIASM)" },
  ],
  team: [
    {
      name: "Ban tổ chức",
      members: [
        { name: "PGS. TS. Trần Minh Triết", affiliation: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM", photo: tranMinhTriet },
        { name: "TS. Cấn Trần Thành Trung", affiliation: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM", photo: canTranThanhTrung },
      ],
    },
    {
      name: "Cố vấn chuyên môn",
      members: [
        { name: "GS. Trần Thanh Long", affiliation: "Đại học Warwick, Vương quốc Anh", photo: tranThanhLong },
        { name: "TS. Phạm Kim Sơn", affiliation: "Công ty BioTuring, Việt Nam", photo: phamKimSon },
      ],
    },
  ],
  entranceExam: [
    { title: "Đề tuyển sinh", authors: [], files: [pdf(drive("1n72NZxaQzjYZGnHTz3Phz7Ioa9Z2CyE4")), { label: "Lời giải", url: drive("1Liz_RJAJF-YetOXJeb3BBNxaBMXJAoEW") }] },
  ],
  lectures: [
    { title: "Đại số tuyến tính", authors: [{ name: "Võ Hoàng An" }, { name: "Đỗ Lê Tuyết Ly" }, { name: "Trần Nguyễn Nam Hưng" }], files: [pdf(drive("1syS1yCPsuXMqm9jbQ7L8VRWpL_SEdOsK"))] },
    { title: "Giải tích hàm nhiều biến", authors: [{ name: "Lê Tiến Hợp" }, { name: "Nguyễn Hoàng Ngọc Hà" }], files: [pdf(drive("1vKsBpL4neQVx0U1f_DqcwWjCqzZBOPfb"))] },
    { title: "Xác suất thống kê cơ bản 1", authors: [{ name: "Nguyễn Thị Vân", affiliation: team }, { name: "Đỗ Lê Tuyết Ly", affiliation: team }], files: [pdf(drive("1g8QBVMCia2F4KZIRe7iBc9-G6a05UPl5"))] },
    { title: "Xác suất thống kê cơ bản 2", authors: [{ name: "Nguyễn Thị Vân", affiliation: team }, { name: "Trần Phan Anh Danh", affiliation: team }], files: [pdf(drive("17KVl0wHskao42wwFGDWANuN4IN_0ckxp"))] },
    { title: "Ước lượng tham số", authors: [{ name: "Đặng Trọng Bảo Thi", affiliation: team }, { name: "Vòng Vĩnh Toàn", affiliation: team }, { name: "Trần Phan Anh Danh", affiliation: team }], files: [pdf(drive("1rMgMqdW-btjahICGy6CfUpfCNzhfhmxH"))] },
    { title: "Suy diễn và Mô hình tạo sinh", authors: [{ name: "Nguyễn Hữu Phước" }, { name: "Tăng Vĩnh Hà" }], files: [pdf(drive("1F9kyohfKCMIkzK4W4iMUjrWph7wkh0QF"))] },
    { title: "Học máy và Học sâu cơ bản", authors: [{ name: "Nguyễn Minh Đức" }, { name: "Nguyễn Mai Anh Thư" }], files: [pdf(drive("1XPXSNbYyxlWz_TRE-nCL34cLU7FztAmo"))] },
    { title: "Các mô hình học sâu", authors: [{ name: "Nguyễn Ngọc Cảnh" }, { name: "Nguyễn Minh Đức" }], files: [pdf(drive("1EeNHdZtemr2OxQRYvCyDjmPCK_F_Yy_Y"))] },
  ],
  exercises: [{ title: "Bài tập về nhà", authors: [], files: [pdf(drive("1N_Annb7f4D56cWEspAjugIpQ-6_J-CpZ"))] }],
  reading: [
    { title: "Đại số tuyến tính", authors: [], files: [pdf(drive("1xpMgD66efwhFvjHkS3oJIa-zKJt8fjad"))] },
    { title: "Vi tích phân", authors: [], files: [pdf(drive("1XzROd7EbwvZ0lWRyDgQZ-d1yOOJtlS2Y"))] },
    { title: "Xác suất Thống kê", authors: [], files: [pdf(drive("1pecEE-6uP612NvY548FwdKk26UdrJklW"))] },
    { title: "Soạn thảo bằng LaTeX", authors: [], files: [pdf(drive("1NWWsgZf3v6UfSkP2Sf7UJ4yS1_oRBlCm"))] },
  ],
  projects: [
    {
      title: "Mô hình khuếch tán",
      groups: [
        group("Hà Nội", "1MC1UOu-aRbHerUjD4_c4YufEd5-5_xlA", "1RS0KZooFJRSQrMR89xaqmGO13f8HZNHe", "1UqYz33WH7B9BFxmWYrpzVII-LEFP9RqP", [{ name: "Đinh Hoàng Phương Thảo", school: "Trường THPT Chuyên Hà Giang, Tuyên Quang" }, { name: "Đinh Nguyễn Bảo Anh", school: "Trường THPT chuyên Lê Quý Đôn, Đà Nẵng" }, { name: "Hồ Xuân Hùng", school: "Trường THPT Chuyên Chu Văn An, Hà Nội" }, { name: "Vũ Đình Minh", school: "Trường THPT Chuyên Chu Văn An, Hà Nội" }]),
        group("TP.HCM", "1VkP4srvoR0M25e4eF0fXsd9Uu94fm6Hk", "1SAYEdc5iymf4o6DioDHMiEZoLlFuK_66", "13l50v-zBdTKAl4OuNrAFPqHtvQ8wKurI", [{ name: "Châu Tấn Phát", school: "Trường THPT chuyên Trần Đại Nghĩa, TPHCM" }, { name: "Nguyễn Hữu Vinh", school: "Trường THPT Gia Định, TPHCM" }, { name: "Ưng Ngọc Bảo Trân", school: ptnk25 }, { name: "Nguyễn Quang Thông", school: "Trường THPT chuyên Lê Hồng Phong, TPHCM" }], { notebook: "1TcGRde6QOxuX898HRXyV5At-sbicB8Sn" }),
      ],
    },
    {
      title: "Mạng đối nghịch - tạo sinh",
      groups: [
        group("Hà Nội", "1ZI6boFJf-mktfYtDP2ZfeP7j1L3vGIrD", "1YivjRSjQTE0HhmS6Tw0nmwZK40rzoPv-", "12ixbkFnCesp67sSo-EiP0tPnOFrEakP6", [{ name: "Nguyễn Văn Khuê", school: "École Polytechnique, Paris" }, { name: "Phạm Mạnh Quân", school: "THPT chuyên Lê Quý Đôn, Đà Nẵng" }, { name: "Lê Nguyễn Bảo Anh", school: "THPT chuyên KHTN, ĐHQG Hà Nội" }], { reportTitle: "Mạng đối nghịch tạo sinh", mentors: [{ name: "Nguyễn Minh Đức", affiliation: "Trường Đại học FPT, Hà Nội" }] }),
        group("TP.HCM", "17YRpFfMN2LccuqMcIxF7O8HoARhigysg", "15ifXhQxG-zHv6UKbhRs2eu-zxhPSWE_d", "1PwWJA3LsgeqaOVuxW6hUuVdSJX65_tWT", [{ name: "Trang Thảo My", school: "Trường THPT Gia Định, TPHCM" }, { name: "Trương Tấn Minh", school: "Trường THPT Chuyên Quang Trung, Bình Phước" }, { name: "Nguyễn Ngọc Quỳnh Thi", school: ptnk25 }], { reportTitle: "Mô hình mạng đối nghịch - tạo sinh" }),
      ],
    },
    {
      title: "Mô hình đồ thị",
      groups: [
        group("Hà Nội", "1nUJrxvGoIDyP_XjiHFmuM0zs9x1tWZnZ", "17orZHqeH27IBWd9QgfYQCBoFy5EZyMQC", "1FtHdf1rA5gV3X11SDzRmVFEVj_Cuaf1W", [{ name: "Nguyễn Hữu Phát Lộc", school: "Trường Đại học Khoa học Tự nhiên - Đại học Quốc gia TP.HCM" }, { name: "Tạ Minh Tuấn", school: "Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội" }, { name: "Hoàng Công Bảo Long", school: "Trường THPT Chuyên Lê Quý Đôn, Đà Nẵng" }, { name: "Lê Xuân Thịnh", school: "Trường THPT chuyên Nguyễn Du, Đăk Lăk" }], { notebook: "1HKTrC143aAgp-yMiqgu0Yv8RTbAvf0cW" }),
        group("TP.HCM", "18GwYS1SpppXn5xLxBWP-E2-1E2vJ99C4", "1oT3tZqNgMmlKJqefNwXQ7ZZ6UMsjbmr0", "1S33OWkIJd4Efrc-NwrsqCRcHx-Crlcvh", [{ name: "Nguyễn Sơn Hải", school: ptnk25 }, { name: "Phạm Phúc Toàn", school: "Trường THPT Chuyên Hoàng Lê Kha, Tây Ninh" }, { name: "Lê Vũ Thiêm Hoàng", school: "Trường THPT Chuyên Hùng Vương, Bình Dương" }, { name: "Phan Hoàng Thanh Dung", school: ptnk25 }]),
      ],
    },
    {
      title: "Mô hình tự hồi quy",
      groups: [
        group("Hà Nội", "1opNr91rEhmAydzZ4aVLxjiEyyxLYL6BA", "1d1ZRGm5s2b1ZTibVXl8_HfFMv-6cGX8L", "1A83eW_1chPsFyJ36GPKbSoemIgS-S_oE", [{ name: "Nguyễn Thùy Dung", school: "THPT Chuyên Bắc Giang" }, { name: "Nguyễn Đăng Sỹ Hoàng", school: "Phổ thông Năng khiếu ĐHQG-HCM" }, { name: "Trương Quang Thái", school: "THPT Chuyên Lào Cai" }]),
        group("TP.HCM", "1Mh82nTb-f9kByZ_Ilu64XplhszI4E6Um", "1BJi0FbINb_zLgbtZh5FNhANM29bDjCF9", "1PDyjbd1P7O8enBfODJmfh11OTvA-j-v_", [{ name: "Vũ Thị Quỳnh Như", school: "Trường THPT Chuyên Huỳnh Mẫn Đạt, Kiên Giang" }, { name: "Phạm Vũ Gia Bảo", school: "Trường THPT Chuyên Lê Quý Đôn, Bà Rịa-Vũng Tàu" }, { name: "Dương Nghiệp Phát", school: "Trường THPT Nguyễn Thị Minh Khai, TPHCM" }, { name: "Nguyễn Xuân Gia Khang", school: "Trường Phổ thông Năng Khiếu, ĐHQG-TPHCM" }], { reportTitle: "Mô hình học sâu tự hồi quy trong tạo sinh âm thanh", notebook: "1lqs-1ZrDFpclDZeZZmHQDiXnnDdCH0rk" }),
      ],
    },
    {
      title: "Tự mã hóa biến phân",
      groups: [
        group("Hà Nội", "1cEodHAk0PyWRJNn58davvU6Wyz-JjF-3", "1-p9PyPRZQghKe8EoYN1EpmQqY8FhKQyW", "1Eqi4E6U-VStKAooSaJ9QL1T_ZMVSW-4l", [{ name: "Nguyễn Trung Tín", school: "Trường THPT Chuyên Bắc Giang" }, { name: "Phạm Hữu Nam", school: "Trường THPT Cẩm Phả" }, { name: "Trịnh Khánh Nam", school: "Trường THPT Chuyên Trần Phú" }]),
        group("TP.HCM", "1oGZL3smePvPeBsrUHOjSnY5NEnQ82NML", "1TcrRu4-IoqaxJEpC7RTefXFH0kM1AGBP", "1ELrTq2MpWeaBSZ5EnMJJTzeg0J4GLWlB", [{ name: "Đỗ Viết Hoàng Long", school: "Trường THPT Chuyên Quang Trung, Bình Phước" }, { name: "Nguyễn Thị Ánh Tuyết", school: "Trường THPT Chuyên Nguyễn Chí Thanh, Đắk Nông" }, { name: "Võ Nguyễn Thành Nhân", school: ptnk25 }, { name: "Nguyễn Đình Minh Huy", school: "Trường THPT Chuyên Nguyễn Du, Đắk Lắk" }], { reportTitle: "Mô hình tự mã hóa biến phân", notebook: "1n30SSqDo9Nu_ds6K10DmIValyvHUWVVn" }),
      ],
    },
    {
      title: "Luồng chuẩn hóa",
      groups: [
        group("TP.HCM", "106zFgEiOlHO-Jbrfsxv-qCBur3nTC3kU", "1MdTNq9F8osMU-oszbEmx46ZsfdeT9muz", "1FDCM7uyiu-6aMcz4JA420PXb226VJqv5", [{ name: "Nguyễn Anh Khoa", school: ptnk25 }, { name: "Nguyễn Minh Khôi", school: "Trường THPT Nguyễn Thị Minh Khai, TPHCM" }, { name: "Nguyễn Thuý Nam Trân", school: ptnk25 }, { name: "Nguyễn Ngọc Khang", school: "Trường THPT Chuyên Lê Quý Đôn, Bà Rịa-Vũng Tàu" }], { reportTitle: "Mô hình luồng chuẩn hóa" }),
      ],
    },
  ],
};

/** #87 amendment: a project topic is shown only when it has at least one group report. */
const shown = (y: CampYear): CampYear => ({ ...y, projects: y.projects?.filter((p) => p.groups.length > 0) });

export const years: Record<string, CampYear> = { "2019": shown(camp2019), "2025": shown(camp2025) };

/** Photos of a 2019 gallery section, loaded by folder (as ADR 0006 plans). */
const photoModules = import.meta.glob<{ default: ImageMetadata }>("../../../assets/camp-archive/*/*/*.jpg", { eager: true });
export function sectionPhotos(year: number, folderName: string): ImageMetadata[] {
  const prefix = `../../../assets/camp-archive/${year}/${folderName}/`;
  return Object.entries(photoModules)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);
}

/** Every block heading, in the fixed order of #87, with whether the year has it. */
export function blocks(y: CampYear): { id: string; title: string; count?: number }[] {
  const all = [
    { id: "chu-de", title: "Chủ đề", has: true },
    { id: "ban-to-chuc", title: "Ban tổ chức", has: !!y.team?.length },
    { id: "de-tuyen-sinh", title: "Đề tuyển sinh", has: !!y.entranceExam?.length },
    { id: "bai-giang", title: "Bài giảng", has: !!y.lectures?.length, count: y.lectures?.length },
    { id: "bai-tap", title: "Bài tập", has: !!y.exercises?.length },
    { id: "tai-lieu-doc-them", title: "Tài liệu đọc thêm", has: !!y.reading?.length },
    { id: "du-an-nhom", title: "Dự án nhóm", has: !!y.projects?.length, count: y.projects?.length },
    { id: "hinh-anh", title: "Hình ảnh", has: !!y.gallery?.length },
  ];
  return all.filter((b) => b.has).map(({ has: _h, ...b }) => b);
}

export const campusCount = (y: CampYear): number =>
  new Set(y.projects?.flatMap((p) => p.groups.map((g) => g.campus)).filter(Boolean)).size;

export const iconFor: Record<FileLabel, "file-text" | "presentation" | "notebook" | "folder" | "braces" | "file-check"> = {
  PDF: "file-text",
  Slide: "presentation",
  Notebook: "notebook",
  "Thư mục": "folder",
  "Mã nguồn": "braces",
  "Lời giải": "file-check",
};
