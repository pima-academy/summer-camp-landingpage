// The 2017 camp (spec #93, ticket #99). Sources: the old site (pimavn/pimavn.github.io @ 2b1a1fa:
// summer_camps/2017/, _data/organizers.yaml, _data/banners.yaml), the acknowledgements of the
// group reports (mentors), the 2017 row of the overview page's camp list (topic in Vietnamese)
// and #89 (dates, venue). The paper-to-project pairs were confirmed by the user (2026-11-27).
// Drive folder 2017/ on "Trại hè PiMA - Lưu trữ".
import type { CampYear, FileLink, Person } from "../camp-archive";
import cover from "../../../assets/camp-archive/2017/cover.jpg";

const file = (id: string) => `https://drive.google.com/file/d/${id}/view`;
const folder = (id: string) => `https://drive.google.com/drive/folders/${id}`;
const pdf = (id: string): FileLink => ({ label: "PDF", url: file(id) });

const ptnk = "Trường Phổ thông Năng khiếu, Đại học Quốc gia TP. HCM";
const theAnh: Person = { name: "Vũ Lê Thế Anh" };
const thien: Person = { name: "Hoàng Văn Thiên" };

const camp: CampYear = {
  year: 2017,
  topic: { vi: "Các mô hình toán đa lĩnh vực", en: "Mathematical and Multidisciplinary Models" },
  cover,
  sessions: [{ campus: "TP.HCM", start: "2017-08-03", end: "2017-08-13", venue: "Trường Đại học Quốc tế (IU) TP.HCM" }],
  lectures: [
    { title: "Đại số tuyến tính", authors: [{ name: "Nguyễn Vĩnh Khang", affiliation: "Liberty University, USA" }], files: [pdf("1JSiYlSkKQ5gIEQfbxhzQcILO20Bo6cVg")] },
    // The old site names the author "hoang", an id organizers.yaml lacks; "minhhoang" is meant
    // (the file is dothithuattoan-minhhoang.pdf).
    { title: "Đồ thị", authors: [{ name: "Phan Minh Hoàng", affiliation: "University of Waterloo" }], files: [pdf("1dvzeeaknxeIj8NVwbynZVrxjDDrQMoKs")] },
    { title: "Giải tích một và nhiều biến", authors: [{ name: "Vũ Đức Tài", affiliation: "Hanoi University of Science" }], files: [pdf("17VQb50AL0HIUmLNSizMnppM3nPSxm8Wr")] },
    { title: "Phương trình vi phân", authors: [{ name: "Vũ Lê Thế Anh", affiliation: "VNUHCM University of Science, Vietnam" }], files: [pdf("1WBF9wNl8rNd5zLccna_srSU2QOR9xwjK")] },
    { title: "Giới thiệu về toán mô hình", authors: [{ name: "Cấn Trần Thành Trung", affiliation: "Caltech" }], files: [pdf("1cl96DzISj0engKXm6JHi47iD_tuF-GSB")] },
    { title: "Xác suất thống kê", authors: [{ name: "Phạm Nguyễn Mạnh", affiliation: "Minerva Schools at KGI, USA" }], files: [pdf("1yNt2qhOpT7op3tny4vyZEGS7_psQe65F")] },
    // No file on the old site (#87): title and author only.
    { title: "Tối ưu hóa", authors: [{ name: "Phạm Hoàng Nhật", affiliation: "University of Washington" }], files: [] },
    { title: "Lý thuyết trò chơi", authors: [{ name: "Nguyễn Thị Mai Anh", affiliation: "Massachusetts Institute of Technology, USA" }], files: [pdf("1c6mOgWMJ8dmAVwMIPEe7McGZwB3l8C45")] },
    // The old site linked the lecturer's repo hoangvanthien/Python-workshop-PiMA-2017; its files
    // (the handout main.pdf, notebooks, data) are copied to the drive.
    {
      title: "Giới thiệu về Python",
      authors: [{ name: "Hoàng Văn Thiên", affiliation: "Vietnamese-German University - Frankfurt UAS" }],
      files: [
        pdf("107LTW7DRXUz17qvsZORH23nNrcm_GN3d"),
        { label: "Mã nguồn", url: folder("1COrCxWXTG0dYm5njM97GHiWgCbOgwLdJ") },
      ],
    },
  ],
  // Groups in the old site's paper order within each topic. Mentors: the people each report's
  // acknowledgements thank for guiding the group.
  projects: [
    {
      title: "Đánh giá thiết bị y sinh",
      description:
        "Ở Việt Nam, thiết bị y sinh có tiềm năng rất lớn để phát triển và đầu tư và khoa Kỹ thuật y sinh của đại học Quốc Tế là một trong những đơn vị tiên phong trong lĩnh vực này. Tuy nhiên, quá trình hoàn thiện thiết kế và thử nghiệm kéo dài và rất tốn kém cả về thời gian lẫn kinh phí. Do đó, cần có những mô hình Toán học có thể đánh giá và giúp cho việc đưa ra quyết định tạm ngưng hay tiếp tục hoàn thiện sản phẩm để đưa vào sử dụng, với hai yếu tố quyết định là hiệu quả sử dụng và kinh phí đầu tư.",
      brief: pdf("1qvgFTu9ftdc6vk3YGFOHQV0ivsP3aBOL"),
      groups: [
        {
          campers: [
            { name: "Hồ Đắc Thanh Chương", school: "Trường THPT Chuyên Quốc học Huế" },
            { name: "Nguyễn Duy", school: "Trường THPT Chuyên Thái Bình, tỉnh Thái Bình" },
            { name: "Bùi Trần Thục Như", school: "Trường THPT Gia Định, TP. HCM" },
            { name: "Dương Đình Trọng", school: ptnk },
          ],
          mentors: [{ name: "Quách Mai Bội" }, { name: "Nguyễn Vĩnh Khang" }],
          files: [pdf("1f8ShEr1S65yNy7ssQkoUZ_2c7eKnXXsT")],
        },
        {
          campers: [
            { name: "Trần Dương Việt Hoàng", school: ptnk },
            { name: "Bùi Minh Kiệt", school: ptnk },
            { name: "Hà Nhật Nam", school: "Trường THPT Gia Định, TP. HCM" },
          ],
          mentors: [theAnh, thien],
          files: [pdf("1nfz_dy44UA1b2Ikrz9wMS28Ct18kHf1o")],
        },
        {
          campers: [
            { name: "Võ Minh Thiên Long", school: "Trường THPT Chuyên Lý Tự Trọng, TP. Cần Thơ" },
            { name: "Nguyễn Hưng Quang Khải", school: "Trường THPT Chuyên Lương Văn Chánh" },
            { name: "Nguyễn Hoàng Sơn", school: "Trường THPT Chuyên Đại học Sư Phạm" },
          ],
          // Named with their affiliations under "Mentor" on the report's title page.
          mentors: [
            { name: "Vũ Đức Tài", affiliation: "Đại học Khoa học Tự nhiên Hà Nội" },
            { name: "Phạm Nguyễn Mạnh", affiliation: "Minerva School" },
          ],
          files: [pdf("19nTYRh2ag6KDakY_TdIooW0L1kAxWnCW")],
        },
      ],
    },
    {
      title: "Nước thải ô nhiễm trên sông",
      description:
        "Những năm qua, sự cẩu thả và vô trách nhiệm trong khâu xử lý nước thải độc hại trước khi xả ra sông/biển từ các nhà máy, như các vụ việc Vedan và Formosa, là một trong những nguyên nhân chính làm đầu độc nguồn nước và gây ô nhiễm, ảnh hưởng nghiêm trọng đến môi trường. Hãy sử dụng những mô hình Toán học để giúp bộ Tài Nguyên và Môi Trường về vấn đề này.",
      brief: pdf("1P0TOKcjpWT6uDyqUCBIE9HX8iahInwZw"),
      groups: [
        {
          reportTitle: "Khảo sát ô nhiễm môi trường nước",
          campers: [
            { name: "Nguyễn Tường Duy Bảo", school: "Trường THPT Chuyên Lê Quý Đôn, TP. Đà Nẵng" },
            { name: "Nguyễn Khánh Duy", school: "Trường THPT Nguyễn Hữu Cầu, TP. HCM" },
            { name: "Nguyễn Lý Nhật Quỳnh", school: ptnk },
          ],
          mentors: [{ name: "Phạm Hoàng Nhật" }, { name: "Đỗ Hoàng Gia Phú" }],
          files: [pdf("1hbnUyMhF-REmbOQTL47saA6fFokctgYI")],
        },
      ],
    },
    {
      title: "Số lượng xe buýt ở TP. HCM",
      description:
        "Ở TP. HCM, xe buýt đóng vai trò vô cùng quan trọng để phục vụ nhu cầu đi lại của người dân và ảnh hưởng trực tiếp đến hệ thống giao thông. Tuy nhiên, các đề án để xây dựng một hệ thống hoàn chỉnh vẫn còn nhiều điểm chưa hợp lý và cần cải thiện. Hãy xây dựng những mô hình Toán để giúp sở Giao Thông Vận Tải về vấn đề này.",
      brief: pdf("1rt_y_Uu_JjcBXVYYouXMuyq1N4StDVXr"),
      groups: [
        {
          reportTitle: "Phân tuyến xe buýt ở TP. HCM",
          campers: [
            { name: "Nguyễn Trường Hải", school: "Trường THPT Chuyên Trần Hưng Đạo, tỉnh Bình Thuận" },
            { name: "Tiêu Phát Đạt", school: "Trường Phổ thông Năng Khiếu, Đại học Quốc gia TP. HCM" },
            { name: "Phạm Thanh Ngọc", school: "Trường Quốc tế Anh - Việt, TP. HCM" },
          ],
          mentors: [{ name: "Phan Minh Hoàng" }, { name: "Phan Ngọc Tiên" }, theAnh, thien],
          files: [pdf("1nOQC8RX068kfry1_PmKS7uE8OrWI2ZEJ")],
        },
        {
          campers: [
            { name: "Nguyễn Cao Nhật Long", school: "Trường THPT Chuyên Lê Hồng Phong, TP. HCM" },
            { name: "Nguyễn Trung Nghĩa", school: "Trường THPT Thực hành Sư phạm, TP. HCM" },
            { name: "Lâm Hữu Phúc", school: ptnk },
          ],
          mentors: [{ name: "Cấn Trần Thành Trung" }, { name: "Đinh Lâm Kiều Phương" }],
          files: [pdf("1tSayujCu0sE9e3TUV9LoCF-boW83h4jH")],
        },
      ],
    },
  ],
  // The old site's gallery sections, in its order and photo order; originals in 2017/6. Hình ảnh/.
  gallery: [
    { name: "Khai mạc", folder: "01-khai-mac", album: folder("1sAkYVj2xLoWQcdyyTOXEPJPRVbANUPVP") },
    { name: "Tham quan trường Đại học Quốc tế", folder: "02-tham-quan-truong", album: folder("15BWn4MkR6_nnXwpDM4xKWtdeWUnzWXE6") },
    { name: "Bên trong lớp học", folder: "03-lop-hoc", album: folder("1aktvX0ZnTFfiPsAVDyP0X7j0Q3oSVyBJ") },
    { name: "Buổi giao lưu với thầy Bùi Tá Long (Envim Lab)", folder: "04-giao-luu-bui-ta-long", album: folder("1PrGtqtGoiNOQYdyleGlHLHnmP6UmOjkr") },
    // "Vietname Journal of Science" on the old site: a typo, fixed.
    { name: "Buổi giao lưu với chị Giang Thúy Minh (Vietnam Journal of Science)", folder: "05-giao-luu-giang-thuy-minh", album: folder("1U1p8UN98_ARX1dG1gRNacUgP8g-VuRLH") },
    { name: "Trò chơi lớn", folder: "06-tro-choi-lon", album: folder("1tl3Qq7AILVDLkfs7M0rYIOiHEh3_ymgS") },
    { name: "Làm việc với các dự án", folder: "07-lam-du-an", album: folder("1QTX9wIWr4C5owQdrDsAoHZcmlPm6Ir-E") },
    { name: "Buổi thuyết trình", folder: "08-thuyet-trinh", album: folder("1CeKfHCUaJTSOhJXw45-nCuOpOITZcJhp") },
    { name: "Bế mạc chương trình", folder: "09-be-mac", album: folder("1ZA7UjI2DxXWqqdrPY1S0KyAW-44GNHlS") },
  ],
};

export default camp;
