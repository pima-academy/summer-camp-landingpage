// The 2026 camp (spec #93, issue #105): sources are the Drive folder "[Public] Tài liệu Trại hè
// PiMA 2026" (inventory #85, docs/research/camp-2025-2026-inventory.md), copied into the folder
// 2026/ on "Trại hè PiMA - Lưu trữ", and the removed 2026 camp page (topic, programme).
// Campers and schools are from the first page of each report; mentors are the people a report's
// acknowledgements name as having guided the group. Session from the user (spec #93).
import type { CampYear, FileLink } from "../camp-archive";
import cover from "../../../assets/camp-archive/2026/cover.jpg";

const file = (label: FileLink["label"], id: string): FileLink => ({ label, url: `https://drive.google.com/file/d/${id}/view` });
const pdf = (id: string) => file("PDF", id);
const slide = (id: string) => file("Slide", id);
const notebook = (id: string) => file("Notebook", id);

/** Lecture authors: the title pages give "PiMA" as the affiliation of every author. */
const pima = (name: string) => ({ name, affiliation: "PiMA" });

const ptnk = "Trường Phổ thông Năng khiếu, ĐHQG-HCM";

const camp: CampYear = {
  year: 2026,
  topic: { vi: "Toán học trong Trí tuệ Nhân tạo", en: "Mathematics in Artificial Intelligence" },
  cover,
  // Written for the archive: the 2026 camp page reused the 2025 description word for word.
  // The second paragraph names the six project topics below.
  description: [
    "Toán học trong Trí tuệ Nhân tạo (Mathematics in Artificial Intelligence) là chủ đề tìm hiểu nền tảng toán học đằng sau các hệ thống trí tuệ nhân tạo. Học máy (Machine Learning), nhánh trung tâm của trí tuệ nhân tạo, nghiên cứu cách xây dựng những mô hình tự rút ra quy luật từ dữ liệu thay vì được lập trình sẵn từng quy tắc. Nhờ đó, máy tính phân loại được thư rác, nhận dạng chữ viết tay, gợi ý nội dung phù hợp cho người dùng hay chơi cờ ở trình độ cao.",
    "Mỗi mô hình học máy là một đối tượng toán học. Dữ liệu được biểu diễn bằng vector và ma trận của đại số tuyến tính. Quá trình huấn luyện là một bài toán tối ưu, được giải bằng đạo hàm và gradient của giải tích nhiều biến. Xác suất giúp mô hình xử lý sự bất định của dữ liệu và đưa ra dự đoán. Các mô hình kinh điển như cây quyết định, máy vector hỗ trợ, perceptron nhiều lớp, phân tích thành phần chính, mô hình Markov ẩn và học tăng cường đều được xây dựng từ những công cụ này.",
    "Khi nắm được phần toán học này, người học giải thích được vì sao một mô hình hoạt động, khi nào mô hình cho kết quả sai và cần thay đổi điều gì để cải thiện mô hình.",
  ],
  programme: [
    "Tiếp thu các kiến thức về đại số tuyến tính, xác suất thống kê và trí tuệ nhân tạo.",
    "Học được các kỹ năng cơ bản về lập trình với Python và soạn thảo văn bản với LaTeX.",
    "Tìm hiểu cách ứng dụng các kiến thức trên vào việc khám phá những khía cạnh ứng dụng của toán học trong các chủ đề trí tuệ nhân tạo.",
    "Vận dụng các kiến thức và kĩ năng để hoàn thành một đề tài nhóm dưới sự hỗ trợ của các mentor đến từ các trường đại học lớn trong và ngoài nước.",
  ],
  sessions: [{ campus: "TP.HCM", start: "2026-08-01", end: "2026-08-09", venue: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM" }],
  entranceExam: [{ title: "Đề tuyển Trại sinh Trại hè PiMA 2026", authors: [], files: [pdf("1ebTtevFUhDbDAbaYGKB0hzrDdYuRxqIy")] }],
  lectures: [
    { title: "Đại số tuyến tính", authors: [pima("Nguyễn Trần Hà Phương")], files: [pdf("1yV5W3YaGaRTd7YCE6i5A_Cmn6h4osAGS")] },
    { title: "Giải tích nhiều biến", authors: [pima("Ngô Xuân Thuỷ")], files: [pdf("1i8daUnUO0rkVV99LZhfO5Pp3AL7eRXSq")] },
    { title: "Xác suất", authors: [pima("Nguyễn Gia Khánh"), pima("Nguyễn Đức Nguyên")], files: [pdf("1Xz0UlS7ITjifB1LQW5orXLGmEEREMgEH")] },
    { title: "Trí tuệ Nhân tạo: Học máy", authors: [pima("Châu Tấn Phát"), pima("Nguyễn Thị Ánh Tuyết")], files: [pdf("1z5yWnXqUnyeaXvU9Osdcwjhomp3Bm6B6")] },
    // A practical session of notebooks and data; no file in it names an author.
    { title: "Lập trình Học máy", authors: [], files: [{ label: "Thư mục", url: "https://drive.google.com/drive/folders/1HD6RquCIQsKPIxlVNVyt2nbFdDOICZmK" }] },
  ],
  exercises: [
    { title: "Đại số tuyến tính", authors: [], files: [pdf("13a42uIN0u1gEdx5-UwP6peXzVOg_yPXS")] },
    { title: "Giải tích nhiều biến", authors: [], files: [pdf("1e5WWpg7EzjcLtR98ZZOxLX1zt5Yd9XuV")] },
    { title: "Xác suất", authors: [], files: [pdf("1kUx81Pqdlgy8bpVwffTtW1T8OGG2eaXg")] },
    { title: "Trí tuệ Nhân tạo: Học máy", authors: [], files: [pdf("1cgDmkPAHQrMG8_TAncg3HHmnQCNmL9wY")] },
  ],
  projects: [
    {
      title: "Cây quyết định",
      groups: [
        {
          reportTitle: "Decision Tree",
          campers: [
            { name: "Lê Nguyễn Minh Khôi", school: "Trường THPT Chuyên Trần Đại Nghĩa" },
            { name: "Nguyễn Đức Nhân", school: "Trường Phổ Thông Năng Khiếu" },
            { name: "Lê Hoàng Mai Linh", school: "Trường THPT Bỉm Sơn" },
            { name: "Đoàn Nhật Anh", school: "Trường THPT Chuyên Hùng Vương" },
          ],
          // The report thanks "anh Lâm Hoàng và chị Ngọc Dung"; full names confirmed by the user.
          mentors: [{ name: "Đào Lâm Hoàng" }, { name: "Hoàng Ngọc Dung" }],
          files: [pdf("1YRfDVwRerGf4t4dDTBSanmMFTIhzHxMv"), slide("17L48gue-Bw0CkWj3LJiFPoEC5bXlaO_h")],
        },
      ],
    },
    {
      title: "Mô hình Markov ẩn",
      groups: [
        {
          campers: [
            { name: "Bùi Minh Triết", school: "Trường Phổ thông Năng khiếu, ĐHQG TPHCM" },
            { name: "Nguyễn Công Diễm Hằng", school: "Trường Phổ thông Năng khiếu, ĐHQG TPHCM" },
            { name: "Lâm Gia Phúc Nguyên", school: "Trường Phổ thông Năng khiếu, ĐHQG TPHCM" },
            { name: "Hoàng Văn Quyền", school: "Trường THCS - THPT Đông Du" },
          ],
          mentors: [{ name: "Ngô Xuân Thuỷ" }],
          files: [pdf("1xaBl0TSGJSXn6pf_hmiRWaNJqEWVpsMO"), slide("1D3SsCKGXnO2JGIqF2hR8CkmWUi97cDYD")],
        },
      ],
    },
    {
      title: "Học tăng cường",
      groups: [
        {
          reportTitle: "Học Tăng cường — Bài toán Máy Đánh bạc Nhiều tay",
          campers: [
            { name: "Phan Chung Nhân", school: "Trường THPT Chuyên Nguyễn Đình Chiểu, Đồng Tháp" },
            { name: "Đinh Tiến Hưng", school: ptnk },
            { name: "Lê Xuân Trọng", school: "Trường THPT Chuyên Hùng Vương, TP.HCM" },
            { name: "Vũ Hoàng Yến", school: ptnk },
          ],
          // Mentor from the user; the report does not name one.
          mentors: [{ name: "Nguyễn Ngọc Cảnh" }],
          files: [pdf("1sPVy28MKVa5y--j4avYicHZps1Cs8A5e"), slide("1DSyUEbtM3Lq1MJmE_iPTnUQYKF-2q6yw")],
        },
      ],
    },
    {
      title: "Máy vector hỗ trợ",
      groups: [
        {
          campers: [
            { name: "Đoàn Thiên An", school: "Trường THPT Chuyên Trần Đại Nghĩa" },
            { name: "Lưu Trọng Phúc", school: "Trường THPT Chuyên Phan Bội Châu" },
            { name: "Trần Như Ý", school: "Trường THPT Chuyên Nguyễn Du" },
            { name: "Nguyễn Thụy Xuân An", school: "Trường Phổ thông Năng khiếu, ĐHQG-TPHCM" },
          ],
          mentors: [{ name: "Đặng Trọng Bảo Thi" }, { name: "Nguyễn Trần Hà Phương" }],
          files: [pdf("1epk_-kUjDHDeMpS8c9MvJPt4sVG0pwx3"), slide("13pzKAUGhQerinTV4_5G1AOTaErgNYikT"), notebook("1O0HWcqNCbC7-WJaqVFATscbtJ9FF1TEJ")],
        },
      ],
    },
    {
      title: "Perceptron nhiều lớp",
      groups: [
        {
          campers: [
            { name: "Nguyễn Phương Chi", school: "Trường THPT Vũng Tàu, TP.HCM" },
            { name: "Trần Tùng Anh Khoa", school: "Trường THPT chuyên Đại học Sư phạm Hà Nội" },
            { name: "Hà Quốc Thịnh", school: "Trường Phổ thông Năng khiếu, ĐHQG - HCM" },
            { name: "Giang Huỳnh Minh Thư", school: "Trường Phổ thông Năng khiếu, ĐHQG - HCM" },
          ],
          mentors: [{ name: "Châu Tấn Phát" }, { name: "Nguyễn Thị Ánh Tuyết" }],
          files: [pdf("1D4iGuWfSqwk3iCX1QnepGI34C3sX2o25"), slide("1jA0yAdSNHePUs6QTbHBU2nPoqm3HTTg8")],
        },
      ],
    },
    {
      title: "Phân tích thành phần chính",
      groups: [
        {
          campers: [
            { name: "Phạm Phương Thảo", school: "Trường Phổ thông Năng khiếu, Đại học Quốc gia Thành phố Hồ Chí Minh" },
            { name: "Đặng Anh Quân", school: "Trường Phổ thông Năng khiếu, Đại học Quốc gia Thành phố Hồ Chí Minh" },
            { name: "Vũ Khôi Nguyên", school: "Trường THPT Chuyên Lam Sơn" },
          ],
          // Mentors from the user; the report does not name them.
          mentors: [{ name: "Nguyễn Gia Khánh" }, { name: "Nguyễn Đức Nguyên" }],
          files: [pdf("1dmXQEv-3IR59HFP0F4TawhEIRbZPMrF1"), slide("14-JZICxevmOaTDNutf23HX7MqfK6Mm_Z"), notebook("1ixISGFm_HPF9T06s1zrRrf22ya7iBShj"), notebook("1Z1y8ZU8tEJqlUy5zV8SSosQxEivsMl0O")],
        },
      ],
    },
  ],
};

export default camp;
