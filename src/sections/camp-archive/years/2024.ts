// The 2024 camp (spec #93, ticket #103): sources the Drive folder "Tài liệu chung" (personal
// accounts, inventory #92) and the text of /chi-tiet-trai-he/; every file copied into the
// Drive folder 2024/ on "Trại hè PiMA - Lưu trữ".
// Authors: full names only where the 2024 sources give them (lecture covers write "Trung Can",
// the exercise sheets and report acknowledgements give the full names); otherwise as on the cover.
import type { CampYear, FileLink, Person } from "../camp-archive";
import cover from "../../../assets/camp-archive/2024/cover.jpg";

const file = (label: FileLink["label"], id: string): FileLink => ({ label, url: `https://drive.google.com/file/d/${id}/view` });
const pdf = (id: string): FileLink => file("PDF", id);

const trung: Person = { name: "Cấn Trần Thành Trung", affiliation: "California Institute of Technology, USA" };
const khangName = "Nguyễn Hoàng Khang";
const linhVoName = "Võ Thị Khánh Linh";
const theAnhName = "Vũ Lê Thế Anh";

const camp: CampYear = {
  year: 2024,
  topic: { vi: "Quy hoạch Tuyến tính", en: "Linear Programming" },
  cover,
  description: [
    "Quy hoạch tuyến tính (Linear Programming) là một lĩnh vực quan trọng của Toán học ứng dụng, chuyên nghiên cứu cách tối ưu hóa một đại lượng (như lợi nhuận, chi phí hoặc tài nguyên) trong điều kiện bị ràng buộc bởi một hệ thống các bất phương trình tuyến tính. Đây là một công cụ mạnh mẽ, được sử dụng rộng rãi trong nhiều lĩnh vực như kinh tế, kỹ thuật, vận tải, logistics, quản trị sản xuất, và cả trong nghiên cứu khoa học dữ liệu.",
    "Về mặt lý thuyết, quy hoạch tuyến tính xây dựng nên các mô hình toán học cho những bài toán ra quyết định trong điều kiện có giới hạn. Ví dụ, làm thế nào để một doanh nghiệp phân bổ nguyên vật liệu sao cho chi phí thấp nhất mà vẫn đáp ứng đủ nhu cầu sản xuất? Hoặc làm sao để tối ưu hóa lịch trình vận chuyển sao cho thời gian giao hàng ngắn nhất mà vẫn sử dụng số xe ít nhất? Từ đó, người ta thiết lập các hàm mục tiêu và các ràng buộc, rồi áp dụng các thuật toán hiệu quả như Simplex hay các phương pháp điểm trong để tìm lời giải tối ưu.",
    "Quy hoạch tuyến tính còn là nền tảng của nhiều phương pháp mở rộng như quy hoạch nguyên, quy hoạch phi tuyến hay quy hoạch động – những công cụ đang được sử dụng trong trí tuệ nhân tạo, học máy, tối ưu hóa hệ thống và phân tích dữ liệu lớn.",
  ],
  programme: [
    "Tiếp thu các kiến thức về đại số tuyến tính, quy hoạch tuyến tính, và mô hình hóa;",
    "Học được các kỹ năng cơ bản về lập trình với Python và soạn thảo văn bản với LaTeX;",
    "Tìm hiểu cách ứng dụng các kiến thức trên vào việc khám phá các tính chất lý thuyết của quy hoạch tuyến tính hoặc mô hình hóa và giải quyết các bài toán trong thực tế;",
    "Vận dụng các kiến thức và kĩ năng để hoàn thành một đề tài nhóm dưới sự hỗ trợ của các mentor đến từ các trường đại học lớn trong và ngoài nước.",
  ],
  // Also on the camp banner in the cover photo ("21 - 28.07.2024, University of Science, VNU-HCM").
  sessions: [{ campus: "TP.HCM", start: "2024-07-21", end: "2024-07-28", venue: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM" }],
  // "PiMA2024- Đề TS & Đáp án.pdf": the exam and its solutions in one PDF.
  entranceExam: [{ title: "Đề tuyển sinh và đáp án", authors: [], files: [pdf("1_baAdO-Ta4d6D-PLjjnp3L4wnhG-nchH")] }],
  lectures: [
    {
      title: "Đại số tuyến tính",
      authors: [
        { name: "Trần Hoàng Bảo Linh", affiliation: "Yale University, USA" },
        { name: "Nghia Nguyen", affiliation: "Rutgers University, USA" },
        trung,
      ],
      files: [pdf("1RsbVkDRADLUZAH1tDZS49Pj2zt0h854P")],
    },
    {
      title: "Giải tích",
      authors: [trung, { name: "Ngọc Phạm", affiliation: "Carnegie Mellon University, USA" }],
      files: [pdf("1yeymzeBggdaSMCEiZxmXVOMMTsDgcF-h")],
    },
    {
      // The two notebooks are files of this lecture; Vũ Lê Thế Anh wrote the scipy one.
      title: "Quy hoạch tuyến tính",
      authors: [
        { name: linhVoName, affiliation: "University of Science, Viet Nam National University Ho Chi Minh City" },
        { name: "Phùng Minh Quân", affiliation: "Hanoi National University of Education" },
        { name: khangName, affiliation: "The University of California, Los Angeles, US" },
        { name: theAnhName },
      ],
      files: [
        pdf("1SoQ_9WRGHRa5gLol9cuaN4sLKvxoJO2P"),
        file("Notebook", "1pTlbeya4TzSD5fhYnJaTHWGs2N_BCToM"),
        file("Notebook", "1MiLp0JMdkZyMjdhCxFkNjjdmHEsbIn4k"),
      ],
    },
    {
      title: "Soạn thảo văn bản bằng LaTeX",
      authors: [{ name: "Long Nguyen" }, { name: "Trần Phan Anh Danh" }],
      files: [file("Slide", "1HKhEcfoPWgHVkTu2pbwHyQhDZAbXJOR7")],
    },
  ],
  exercises: [
    {
      title: "Đại số tuyến tính (bài tập)",
      authors: [{ name: "Đỗ Hoàng Việt" }, { name: "Võ Minh Quân" }],
      files: [pdf("1ZFDXPu32xe1gLUfRXrB9_HF_u11a-D-z")],
    },
    { title: "Quy hoạch tuyến tính (bài tập 1)", authors: [{ name: khangName }], files: [pdf("1uGup8DuOkWS_F60fqIMN1ZlfLgz4hRCF")] },
    {
      title: "Quy hoạch tuyến tính (bài tập 2)",
      authors: [{ name: khangName }, { name: linhVoName }],
      files: [pdf("1QP35VA8d_Hk5CQNvroXkRicjyXTExuRy")],
    },
  ],
  // One topic per group, titled as its report cover (all-caps covers in sentence case). Mentors
  // are the people each report's "Lời cảm ơn" thanks for guiding the group.
  projects: [
    {
      title: "Lý thuyết đối ngẫu và ứng dụng",
      groups: [
        {
          campers: [
            { name: "Nguyễn Đức Nguyên", school: "King’s College London Mathematics School, London, Anh" },
            { name: "Huỳnh Hoàng Yến", school: "THPT Chuyên Quang Trung, Bình Phước" },
            { name: "Nguyễn Hữu Phước", school: "THPT Chuyên Lê Khiết, Quảng Ngãi" },
            { name: "Trần Lê Diễm Quỳnh", school: "THPT Thị xã Quảng Trị, Quảng Trị" },
          ],
          mentors: [{ name: linhVoName }, { name: "Phùng Minh Quân" }],
          files: [pdf("1URZAzwQ_ytJWWCug_Sig16E72BYMx3m6")],
        },
      ],
    },
    {
      title: "Linear Programming for Data Science",
      groups: [
        {
          campers: [
            { name: "Lê Tiến Hợp", school: "Trường THPT Chuyên Phan Bội Châu - Nghệ An" },
            { name: "Trần Bảo Minh", school: "Trường THPT Chuyên Hùng Vương - Bình Dương" },
            { name: "Nguyễn Thị Bảo Tiên", school: "Trường THPT Chuyên Lương Văn Chánh - Phú Yên" },
            { name: "Nguyễn Mai Anh Thư", school: "Trường Phổ Thông Năng Khiếu - ĐHQG TP. Hồ Chí Minh" },
          ],
          mentors: [{ name: "Nguyễn Ngọc Cảnh" }, { name: "Vòng Vĩnh Toàn" }],
          files: [pdf("1xR-coxXE3Z40yocZsBCx8Aw_-Lz9FL8Z")],
        },
      ],
    },
    {
      title: "Tối ưu hóa tổ hợp và quy hoạch tuyến tính nguyên",
      groups: [
        {
          // The report gives the campers' given names only.
          campers: [
            { name: "Quốc Bảo", school: "Trường THPT chuyên Lê Hồng Phong, TP HCM" },
            { name: "Thu Huế", school: "Trường THPT chuyên Lê Hồng Phong, Nam Định" },
            { name: "Ngọc Huy", school: "Trường THPT chuyên Nguyễn Bỉnh Khiêm, Quảng Nam" },
            { name: "Nam Kiệt", school: "Trường THPT chuyên Lê Quý Đôn, Khánh Hòa" },
          ],
          // The cover's "Mentor: Minh Quân" (with his affiliation) and the acknowledgements.
          mentors: [
            { name: "Võ Minh Quân", affiliation: "Đại học bang Illinois tại Urbana–Champaign" },
            { name: "Đỗ Hoàng Việt" },
            { name: "Trần Hoàng Bảo Linh" },
          ],
          files: [pdf("1lkhKQ9TnBe1RcWTKyYv6NNMq2fmtE9ct")],
        },
      ],
    },
    {
      title: "Cân bằng Nash trong Lý thuyết Trò chơi",
      groups: [
        {
          campers: [
            { name: "Hoàng Minh Thư", school: "Trường THPT Gia Định, TPHCM" },
            { name: "Đào Lâm Hoàng", school: "Trường THPT Chuyên Khoa học Tự nhiên, Hà Nội" },
            { name: "Nguyễn Kim Ngân", school: "Trường THPT Gò Công Đông, Tiền Giang" },
            { name: "Lý Trần Thái", school: "Trường Phổ Thông Năng Khiếu, ĐHQG-HCM" },
          ],
          mentors: [{ name: theAnhName }, { name: "Nguyễn Minh Tú" }],
          files: [pdf("1bwa0nvYkd2YPsUkss1hoTD_UJOc9UwmT")],
        },
      ],
    },
    {
      title: "Portfolio Optimization",
      groups: [
        {
          campers: [
            { name: "Nguyễn Hồng Ân", school: "Trường THPT Chuyên Lê Hồng Phong TP.HCM" },
            { name: "Nguyễn Vũ Bách", school: "Trường THPT Phan Đình Phùng, Đắk Lắk" },
            { name: "Nguyễn Trần Thùy Chi", school: "Trường THPT Chuyên ĐH Sư Phạm, Hà Nội" },
            { name: "Huỳnh Tuyết Oanh", school: "Trường THPT Chuyên Lê Quý Đôn, Đà Nẵng" },
          ],
          // The acknowledgements thank "Các anh chị Mentor" without naming them.
          mentors: [],
          files: [pdf("1XepS0rd7QrGhQTRPxiarVvAXToGb-lpN")],
        },
      ],
    },
    {
      title: "Phương pháp điểm trong (Interior Point Method)",
      groups: [
        {
          campers: [
            { name: "Phạm Quốc Bình", school: "Trường THPT Thống Nhất B - Đồng Nai" },
            { name: "Bảo Quý Định Tân", school: "Trường THPT chuyên Lê Quý Đôn - Khánh Hòa" },
            { name: "Nguyễn Trần Hà Phương", school: "Wilbraham and Monson Academy" },
            { name: "Lê Minh Quý", school: "Trường THPT Gia Định" },
          ],
          mentors: [{ name: "Trần Phan Anh Danh" }, { name: khangName }, { name: theAnhName }],
          files: [pdf("1Fp71guQlP0uo54uexASN9Gesb4CMKg8H")],
        },
      ],
    },
  ],
};

export default camp;
