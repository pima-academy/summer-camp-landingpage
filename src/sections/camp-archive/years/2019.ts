// The 2019 camp (spec #93, issue #101): sources are the Jekyll site's summer_camps/2019/
// (lectures_and_projects, student_papers, gallery), _data/organizers.yaml and _data/banners.yaml
// (pimavn/pimavn.github.io @ 2b1a1fa), with mentors from each report's acknowledgements.
// Drive folder 2019/ on "Trại hè PiMA - Lưu trữ"; the four 2018 lectures link their copies in 2018/.
import type { CampYear, FileLink, Person } from "../camp-archive";
import cover from "../../../assets/camp-archive/2019/cover.jpg";

const file = (id: string): string => `https://drive.google.com/file/d/${id}/view`;
const folder = (id: string): string => `https://drive.google.com/drive/folders/${id}`;
const pdf = (id: string): FileLink => ({ label: "PDF", url: file(id) });

// Lecture authors and mentors, resolved from organizers.yaml (the ids the 2019 pages use).
const linh: Person = { name: "Trần Hoàng Bảo Linh", affiliation: "National University of Singapore" };
const nghia: Person = { name: "Nguyễn Trung Nghĩa", affiliation: "VNUHCM University of Science, Vietnam" };
const trung: Person = { name: "Cấn Trần Thành Trung", affiliation: "Caltech" };
const nhat: Person = { name: "Phạm Hoàng Nhật", affiliation: "University of Washington" };
const trong: Person = { name: "Dương Đình Trọng", affiliation: "International University, VNU" };
const theAnh: Person = { name: "Vũ Lê Thế Anh", affiliation: "VNUHCM University of Science, Vietnam" };
const manh: Person = { name: "Phạm Nguyễn Mạnh", affiliation: "Minerva Schools at KGI, USA" };
const duong: Person = { name: "Vương Nguyễn Thùy Dương", affiliation: "Massachusetts Institute of Technology, USA" };
const nguyen: Person = { name: "Nguyễn Nguyễn", affiliation: "VNUHCM University of Science, Vietnam" };
const minhNguyen: Person = { name: "Trần Minh Nguyên", affiliation: "VNUHCM University of Science, Vietnam" };
const thien: Person = { name: "Lê Thiện", affiliation: "Massachusetts Institute of Technology, USA" };
const huy: Person = { name: "Nguyễn Minh Huy", affiliation: "VNUHCM University of Science, Vietnam" };
const phuc: Person = { name: "Lâm Hữu Phúc", affiliation: "University of Rochester, USA" };
const long: Person = { name: "Nguyễn Hồ Thăng Long", affiliation: "VNUHCM University of Science, Vietnam" };
const ngoc: Person = { name: "Phạm Thanh Ngọc", affiliation: "University of California Irvine, USA" };
// Mentors a report names in full who are not in organizers.yaml: no affiliation.
const uyen: Person = { name: "Hà Phương Uyên" };
const binh: Person = { name: "Trần Thanh Bình" };
const hoangDuy: Person = { name: "Phạm Nguyễn Hoàng Duy" };

const ptnk = "Trường Phổ thông Năng khiếu, Đại học Quốc gia TP. HCM";

const camp: CampYear = {
  year: 2019,
  topic: { vi: "Toán học trong Học sâu", en: "The Mathematics of Deep Learning" },
  cover,
  sessions: [{ campus: "TP.HCM", start: "2019-07-29", end: "2019-08-09", venue: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM" }],
  lectures: [
    // The 2018 lectures, relisted by the 2019 page with the 2018 files (copies in 2018/).
    { title: "Đại số tuyến tính", fromYear: 2018, authors: [linh, nghia, trung], files: [pdf("1E1GmO5aNRtrjzATt1dJwvXJpvN31d51R")] },
    { title: "Tối ưu hóa", fromYear: 2018, authors: [nhat], files: [pdf("1JcLWdtWl2sOXIwCkPHvrylAfESgbKAkX")] },
    { title: "Giải tích", fromYear: 2018, authors: [trong, linh], files: [pdf("1Tc8-crkzxpUcX-rR6T44ZbDtr0zVIHkp")] },
    { title: "Xác suất và phân phối", fromYear: 2018, authors: [theAnh, linh, manh], files: [pdf("16XxQIdekFWNUi1dL6aWKzTo-2eiw5nBq")] },
    { title: "Vài mạng học sâu và ứng dụng (CNN và RNN)", authors: [duong], files: [pdf("1sc6KS-mCmm9lHViS-QHhMGDebHqu8PUZ")] },
    { title: "Xác suất có điều kiện, Công thức Bayes, Xác suất tiền / hậu nghiệm", authors: [nguyen, linh], files: [pdf("1IEFhVhrceFCNdyGwkfmmlTc87wSKS9vF")] },
    { title: "Ánh xạ tuyến tính", authors: [minhNguyen], files: [pdf("1mPEBop8XAcVLNZLjaoFhMzhy4RMw869a")] },
    { title: "Neural Network", authors: [duong], files: [pdf("1X5GdIvDg_qEBAeHzWKG3G_-88fHmJg71")] },
    { title: "Tối ưu hóa", authors: [thien], files: [pdf("1TlWiLDSixK2QrJFAq_qza3e4cX_DqZ-Q")] },
    { title: "MLE và MAP", authors: [nguyen], files: [pdf("19HItOVd-7bEE64eBnn8ua1BRWnOwYtvt")] },
    { title: "Giới thiệu Máy học", authors: [thien], files: [pdf("1Bfj8Dihx3jm_Tbr3g5_IxJOdcfadvxrM")] },
    { title: "Giải tích hàm đa biến", authors: [huy], files: [pdf("1SYnMLT-0Gi-puybPXmW2UO8NlH5APHTu")] },
    { title: "Giải tích hàm đơn biến", authors: [huy], files: [pdf("1L2wnlmTIaxnkYXFNuTfDe2Mi2TffYjPN")] },
    { title: "Biến ngẫu nhiên", authors: [phuc], files: [pdf("1lqXPxzNx92pKIt1dDLKxV_BvpCjk_Wl1")] },
    { title: "Xác suất và biến cố", authors: [nguyen], files: [pdf("1NcDlL2mQFeWjzh0vRXldx_c_E-4NLg6r")] },
    { title: "Vector và ma trận", authors: [minhNguyen], files: [pdf("1NwlEsqdiB-toQ49vH_EFDLHYhG0KzyFT")] },
    { title: "Không gian vector và cơ sở", authors: [phuc], files: [pdf("1oF9fpKgmjZ36V0FWOh4F-K6DgLL8lBVT")] },
  ],
  // "Image Classification" has no group report, so it is not shown (its brief is on the drive).
  projects: [
    {
      title: "Conjugate Gradient Descent",
      description:
        "Conjugate Gradient Descent (CGD) là một phiên bản phức tạp hơn của Gradient Descent, phỏng theo thuật toán xấp xỉ nghiệm của hệ phương trình tuyến tính. Trong dự án này, chúng ta sẽ tìm hiểu trước CGD cho hàm bậc 2 nhiều biến (quadratic function) và tổng quát hóa ý tưởng này cho một hàm số khả vi bất kì.",
      brief: pdf("1Ox7AVujP7Ec4JDZx7tYW75CvgwXY-kH4"),
      groups: [
        {
          campers: [
            { name: "Huỳnh Ngọc Tân", school: ptnk },
            { name: "Nguyễn Thiện Nhân", school: ptnk },
            { name: "Nguyễn Mạc Nam Trung", school: ptnk },
            { name: "Ngô Nhựt Bảo Trân", school: "Trường THPT Chuyên Thoại Ngọc Hầu, An Giang" },
          ],
          // The report thanks the organizers only.
          mentors: [],
          files: [pdf("1gybnGo4JcshOzCd2nKvG9Y6ezbjZdi9w")],
        },
      ],
    },
    {
      title: "Image Segmentation",
      description:
        "Image Segmentation là một trong những bài toán khá quan trọng và điển hình trong xử lí ảnh. Image Segmentation cùng với object recognition và image classification là nền tảng cho ngành computer vision và mang nhiều ý nghĩa rất quan trọng. Mục tiêu của bài toán này là phân chia bức ảnh ra thành các vùng, trong đó các điểm ảnh thuộc mỗi vùng mang cùng một màu sắc tương ứng với nhãn dán của đối tượng đó, các vùng kề nhau mang màu sắc tương phản khá rõ rệt, tìm được đúng hình dạng của các đối tượng.",
      brief: pdf("1Pdp5vs7mKdZzIdWp9U9MHcyUq4-Th7Ln"),
      groups: [
        {
          reportTitle: "Mạng tích chập và mô hình UNET trong bài toán phân mảng hình ảnh",
          campers: [
            { name: "Nguyễn Hoàng Khang", school: "Trường THPT Chuyên Lê Quý Đôn, Khánh Hòa" },
            { name: "Tạ Quang Khôi", school: "Trường THPT Chuyên Lý Tự Trọng, Cần Thơ" },
            { name: "Hoàng Nghĩa", school: ptnk },
            { name: "Phan Nguyễn Tuấn Kiệt", school: ptnk },
          ],
          // The report also thanks "anh Kèn", a nickname; left out until the user names him.
          mentors: [trung, uyen],
          files: [pdf("1DwTOE3BmFADN2zxFBfWdin-eDDx4JJo0")],
        },
        {
          reportTitle: "Ứng dụng mạng CNN và kiến trúc UNET trong việc phân tách nền và xe",
          campers: [
            { name: "Lê Duy Thức", school: "Trường THPT Chuyên Hùng Vương, Bình Dương" },
            { name: "Phạm Đình Anh Khoa", school: "Trường THPT Chuyên Lê Hồng Phong, TP. HCM" },
            { name: "Lê Bảo Hiệp", school: ptnk },
            { name: "Nguyễn Đại Nghĩa", school: ptnk },
          ],
          mentors: [nguyen, hoangDuy, linh],
          files: [pdf("1cswYYb29emBKG8Q7sgJhyEnY55T_FQe0")],
        },
      ],
    },
    {
      title: "Object Recognition",
      description:
        "Image Recognition là một trong những bài toán khá quan trọng và điển hình trong xử lí ảnh. Object Recognition cùng với image classification và image segmentation là nền tảng cho ngành Thị giác Máy tính (computer vision) và mang nhiều ý nghĩa rất quan trọng. Mục tiêu của bài toán này là xác định (các) đối tượng trong ảnh, trong đó việc xác định được định nghĩa là (1) Xác định vị trí đối tượng và (2) Xác định lớp (class) của đối tượng.",
      brief: pdf("1Y6CmG_qfmyQ3FTCcYGpmMieTc2bmM3Aq"),
      groups: [
        {
          reportTitle: "Object Detection",
          campers: [
            { name: "Nguyễn Đắc Khôi Nguyên", school: "Trường THPT Nguyễn Hữu Huân, TP. HCM" },
            { name: "Trương Minh Hoàng", school: "Northfield Mount Hermon School, MA, USA" },
            { name: "Phạm Nguyễn Hằng Vân", school: "Trường THPT Chuyên Trần Phú, Hải Phòng" },
            { name: "Lê Đình Hải", school: "Trường THPT Chuyên Lê Quý Đôn, Khánh Hòa" },
          ],
          // The report names its mentors by given name only ("anh Thế Anh, anh Long", "chị Thục
          // Như, chị Ngọc"); left empty until the user confirms the full names.
          mentors: [],
          files: [pdf("1oebWsaQY0g7oiiHyI4UNj5x1kjjViN2k")],
        },
      ],
    },
    {
      title: "Sentimental Analysis",
      description:
        "Một trong những tính chất đặc thù của dữ liệu dạng văn bản đó chính là tính chất phụ thuộc của mỗi từ vào các từ trước đó. Giả sử chúng ta có câu ”Tôi thích đọc”, từ tiếp theo khả năng sẽ là ”sách” hoặc ”truyện”, mà không phải là ”thịt bò”. Tính chất này đưa đến cho chúng ta ý tưởng xây dựng một mô hình cho dữ liệu văn bản.",
      brief: pdf("1se_siGBeJaYQledDZw0qQiwfwitLgWd3"),
      groups: [
        {
          campers: [
            { name: "Nguyễn Thị Quỳnh Trang", school: "Trường THPT Chuyên KHTN, Đại học Quốc gia Hà Nội" },
            { name: "Huỳnh Vũ Khôi Nguyên", school: "Trường THPT Chuyên Trần Hưng Đạo, Bình Thuận" },
            { name: "Võ Minh Quân", school: "Trường THPT Chuyên Thăng Long, Đà Lạt" },
            { name: "Hồ Tiến Đức", school: ptnk },
          ],
          mentors: [phuc, binh, duong],
          files: [pdf("1P2PcaPjGST0BwqHZIBpQByjvNmZ1PEpI")],
        },
        {
          campers: [
            { name: "Nguyễn Tài Tuệ", school: ptnk },
            { name: "Nguyễn Hoàng Thuận", school: "Trường THPT Trị An, Đồng Nai" },
            { name: "Nguyễn Phong Phú", school: "Trường THPT Chuyên Nguyễn Đình Chiểu, Sa Đéc" },
            { name: "Nguyễn Kim Phương Trang", school: "Trường THPT Chuyên Lương Văn Chánh, Phú Yên" },
          ],
          mentors: [long, theAnh, ngoc],
          files: [pdf("1uAqs_n1GGOinJilTOOUkDEAsp26VKKK1")],
        },
      ],
    },
  ],
  gallery: [
    { name: "Khai mạc", folder: "01-khai-mac", album: folder("1EQfOzURLTlQr7-Bjki52o1OX4Wtq0oXQ") },
    { name: "Những buổi học đầu tiên", folder: "02-nhung-buoi-hoc-dau-tien", album: folder("1aBJKjVcyT_tzF9UpacO0bNc40hQNNtH6") },
    { name: "Tiệc liên hoan nhỏ", folder: "03-tiec-lien-hoan-nho", album: folder("15PNuO2_q3o6HoEmlMb0gkphZotW51xkM") },
    { name: "Giao lưu với giáo sư Lý Quốc Ngọc", folder: "04-giao-luu-ly-quoc-ngoc", album: folder("1kXgm7qQ_Hm4S-DVtBcAv2bqD4HabUwh7") },
    { name: "Chơi trò chơi giao lưu", folder: "05-tro-choi-giao-luu", album: folder("1GkM9vBqtmrRKMG6GpZdcLnnA3ruD7I-W") },
    { name: "Trò chơi lớn", folder: "06-tro-choi-lon", album: folder("1bgP9r_vIcWphsxOkZkqoQ_61ix035Hf5") },
    { name: "Các trại sinh chuẩn bị thuyết trình", folder: "07-chuan-bi-thuyet-trinh", album: folder("10piUeomiXv06SuW0N85fTKpbgnTrseKT") },
    { name: "Phần thuyết trình của các bạn trại sinh", folder: "08-thuyet-trinh", album: folder("1mvOJZhkmZWmnp6ItujMH1eLynpn8UOti") },
    { name: "Tiệc liên hoan bế mạc", folder: "09-tiec-be-mac", album: folder("14au4ntY7Fgi1JGx8TcNkV-GaJwK5PqTV") },
    { name: "Trao bằng chứng nhận và chụp ảnh lưu niệm", folder: "10-trao-chung-nhan", album: folder("1FPhDv5EegK31oaCc7oBkeE9_WIY0lyCu") },
  ],
};
export default camp;
