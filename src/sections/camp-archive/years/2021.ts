// The 2021 camp (spec #93, issue #102), held online. Sources: the Jekyll site (pimavn/pimavn.github.io
// at 2b1a1fa, summer_camps/2021/, _data/organizers.yaml, _data/banners.yaml). Its ZIPs (five
// lectures, eight group papers) were unpacked into one folder each in the Drive folder 2021/ on
// "Trại hè PiMA - Lưu trữ", linked as "Thư mục"; a group's folder also holds its topic's brief.
// Dates from issue #89. Mentors: the people each report's acknowledgements name as having
// guided the group, by the full name of that year's lecturers when the report gives part of it.
import type { CampYear, FileLink, Person, ProjectGroup } from "../camp-archive";
import cover from "../../../assets/camp-archive/2021/cover.jpg";

const pdf = (id: string): FileLink => ({ label: "PDF", url: `https://drive.google.com/file/d/${id}/view` });
const folder = (id: string): FileLink => ({ label: "Thư mục", url: `https://drive.google.com/drive/folders/${id}` });

const vnuhcm = "VNUHCM University of Science, Vietnam";
const thu: Person = { name: "Nguyễn Thị Minh Thư", affiliation: "International University - VNU" };
const phuong: Person = { name: "Đinh Lâm Kiều Phương", affiliation: vnuhcm };
const namTrung: Person = { name: "Nguyễn Mạc Nam Trung", affiliation: vnuhcm };
const linh: Person = { name: "Trần Hoàng Bảo Linh", affiliation: "Yale University" };
const nguyen: Person = { name: "Nguyễn Nguyễn", affiliation: "Duke University, USA" };
const trung: Person = { name: "Cấn Trần Thành Trung", affiliation: "Caltech" };
const theAnh: Person = { name: "Vũ Lê Thế Anh", affiliation: "University of Illinois Urbana-Champaign, USA" };
const long: Person = { name: "Nguyễn Hồ Thăng Long", affiliation: vnuhcm };
const thuc: Person = { name: "Lê Duy Thức", affiliation: vnuhcm };
const phuc: Person = { name: "Nguyễn Đình Hoàng Phúc", affiliation: vnuhcm };
const thien: Person = { name: "Lê Thiện", affiliation: "Massachusetts Institute of Technology, USA" };

const ptnk = "Phổ Thông Năng Khiếu, ĐHQG-HCM";

/** The one group of a 2021 topic: its unpacked paper ZIP is the topic's folder. */
const group = (folderId: string, campers: ProjectGroup["campers"], mentors: Person[]): ProjectGroup[] => [
  { campers, mentors, files: [folder(folderId)] },
];

const camp: CampYear = {
  year: 2021,
  topic: { vi: "Toán học trong Khoa học Dữ liệu", en: "The Mathematics of Data Science" },
  cover,
  sessions: [{ campus: "Trực tuyến", start: "2021-07-26", end: "2021-08-08" }],
  lectures: [
    { title: "Đại số tuyến tính", authors: [thu, phuong, namTrung, linh], files: [folder("1Ir5-eeOIAMdsy-MCDNqSf6_M7v2KQuLl")] },
    { title: "Giải tích - Vi tích phân", authors: [nguyen, trung], files: [folder("1fV-1ybC-bL7X3F3u9RRa1vS6cR69ZmOl")] },
    { title: "Xác suất Thống kê", authors: [thu, namTrung, theAnh], files: [folder("1oov99Sy2CnIBxe2ADyZ5_zoPownFdKzx")] },
    { title: "Python và LaTeX", authors: [long, thuc, phuc], files: [folder("1xECzanOvLurDeO_lJrdO-9y3lK7VogG9")] },
    { title: "Khoa học Dữ liệu", authors: [thien, linh, trung, theAnh], files: [folder("1Q42jdcNxkCH9_K6YN2tZfqeQksouoQiU")] },
  ],
  projects: [
    {
      title: "Gaussian Mixture Models",
      description:
        "Gaussian mixture model (GMM) là mô hình xác suất miêu tả các quần thể con của một tập dữ liệu không gắn nhãn. GMM được phát biểu lần đầu bởi Karl Pearson vào năm 1894. Về sau, với sự phát triển và phổ biến của maximum likelihood estimation, mô hình này được nghiên cứu và ứng dụng trong các bài toán như phân cụm dữ liệu (clustering), nhận dạng chữ viết tay (handwriting recognition), phân đoạn hình ảnh (image segmentation). Trong dự án này, chúng ta sẽ tìm hiểu về ứng dụng của GMM trong clustering và cách cập nhật các tham số của phân phối Gaussian và các cụm dữ liệu với thuật toán expectation maximization (EM algorithm).",
      brief: pdf("1Kpot2_SN-65v4DjJS1bkV4mbUYt2HTUZ"),
      groups: group(
        "1y0K9DRmMp9Ns86MDbnJBW3Qohf-z-gLL",
        [
          { name: "Châu Đăng Minh", school: "Trường Đại học Bách Khoa, ĐHQG-HCM" },
          { name: "Nguyễn Đức Triều", school: "THPT Chuyên Hà Nội - Amsterdam, Hà Nội" },
          { name: "Nguyễn Minh Tú", school: ptnk },
          { name: "Huỳnh Tiến Dũng", school: "THPT Chuyên Bảo Lộc, Lâm Đồng" },
        ],
        [{ name: "Phạm Thanh Ngọc" }, long, theAnh],
      ),
    },
    {
      title: "Generalized Linear Model",
      description:
        "Generalized Linear Model (GLM) là những mô hình thống kê nâng cao tổng quát hóa từ mô hình Hồi quy Tuyến tính (Linear Regression, LR). GLM được phát minh bởi John Nelder và Robert Wedderburn vào năm 1972. Mô hình này được dùng rất nhiều trong các bài toán hồi quy và phân lớp dữ liệu. Trong dự án này, ta sẽ tìm hiểu về cấu trúc của GLM và áp dụng vào bài toán thực tế thông qua việc chọn mô hình, ước lượng tham số trong mô hình, dự đoán kết quả và đánh giá.",
      brief: pdf("1OiRfcOocikewal2JSlcEsNu6iC-L4SVR"),
      groups: group(
        "1xXlTO7giq-MH-QZva_NpLpZPrZLCFsdQ",
        [
          { name: "Nguyễn Tư Thành Nhân", school: "Trường Đại học Công nghệ Thông tin, ĐHQG-HCM" },
          { name: "Nguyễn Thị Mai Anh", school: "THPT Chuyên Phan Bội Châu, Nghệ An" },
          { name: "Bùi Nguyễn Đức Tân", school: ptnk },
          { name: "Châu Thanh Văn", school: ptnk },
        ],
        [namTrung, theAnh],
      ),
    },
    {
      title: "Isomap",
      description:
        "Manifold Learning (“Học đa tạp”) là tên một nhóm các thuật toán giảm chiều dữ liệu không giám sát với điểm chung là bắt đầu với giả thiết các điểm dữ liệu trong không gian D chiều đều nằm trên một manifold (đa tạp) d chiều với d < D, và sử dụng các tính chất cục bộ (local properties) của manifold để tìm ra biểu diễn d chiều của các điểm dữ liệu ban đầu. Thuật toán Isomap (Isometric mapping - “Ánh xạ đẳng cự”) là một thuật toán Manifold Learning với mục tiêu bảo toàn khoảng cách địa lý (geodesic distance) giữa mọi cặp điểm trong input data, tận dụng hình dạng hình học của manifold.",
      brief: pdf("1Qy6rbzHw26_yboonbdu83mr3__ONHZ4a"),
      groups: group(
        "1TbkI2STAD2Xa7NuYrKBYnKKQqmuaQ6-K",
        [
          { name: "Phan Chí Thọ", school: "THPT Chuyên Lê Hồng Phong, TPHCM" },
          { name: "Võ Thị Khánh Linh", school: "THPT Chuyên Nguyễn Bỉnh Khiêm, Quảng Nam" },
          { name: "Nguyễn Xuân Minh", school: "THPT Chuyên Trần Đại Nghĩa, TPHCM" },
          { name: "Dương Lê Đình Thuận", school: "20CNTN - Đại học Khoa học Tự nhiên, ĐHQG-HCM" },
        ],
        [linh, nguyen],
      ),
    },
    {
      title: "Locally Linear Embedding",
      description:
        "Manifold Learning (“Học đa tạp”) là tên một nhóm các thuật toán giảm chiều dữ liệu không giám sát với điểm chung là bắt đầu với giả thiết các điểm dữ liệu trong không gian D chiều đều nằm trên một manifold (đa tạp) d chiều với d < D, và sử dụng các tính chất cục bộ (local properties) của manifold để tìm ra biểu diễn d chiều của các điểm dữ liệu ban đầu. Thuật toán Locally Linear Embedding (“Phép nhúng tuyến tính địa phương/cục bộ”) là một thuật toán Manifold Learning với mục tiêu bảo toàn các quan hệ tuyến tính giữa các điểm gần nhau, lợi dụng tính chất tuyến tính cục bộ của manifolds.",
      brief: pdf("1Uvnk5rdm_TaCAu75hu4nXpH0B06u55sf"),
      groups: group(
        "1Wt2zsOAuzsAFWDhSnyKetSObx0KBXTRR",
        [
          { name: "Đặng Đức Trường", school: "THPT Chuyên Lê Hồng Phong, TPHCM" },
          { name: "Phạm Duy Tùng", school: "Đại học Bách khoa Hà Nội" },
          { name: "Phan Hoàng Quân", school: ptnk },
          { name: "Mai Kiến Quốc", school: "THPT Chuyên Lê Hồng Phong, TP.HCM" },
        ],
        [linh, phuong, nguyen, thu],
      ),
    },
    {
      title: "Mean Shift",
      description:
        "Mean shift là một ý tưởng thuật toán được phát minh bởi Fukunaga và Hostetler vào năm 1975. Thuật toán này và các phiên bản hoàn thiện hơn của nó thường được ứng dụng vào các bài toán: phân cụm dữ liệu (clustering), phân mảng hình ảnh (image segmentation), dò theo đối tượng hình ảnh (object tracking). Trong dự án này, chúng ta sẽ tìm hiểu cơ sở lý thuyết và ứng dụng cụ thể của mean shift.",
      brief: pdf("1Gpstt0jXFBVniy-9dAQfme4-9lOdYmbU"),
      groups: group(
        "16J28ynBHj2LoNWJ8_jzC7UZAgXJdTcZX",
        [
          { name: "Nguyễn Lương Thắng", school: ptnk },
          { name: "Nguyễn Nhật Nam", school: "THPT Chuyên Hùng Vương, Bình Dương" },
          { name: "Huỳnh Quỳnh Anh", school: ptnk },
          { name: "Trần Hoài An", school: "THPT Hoàng Lê Kha, Tây Ninh" },
        ],
        [trung, long, theAnh],
      ),
    },
    {
      title: "Principal Component Analysis",
      description:
        "Thuật toán Principal Component Analysis (“Phân tích chiều chính”) là một trong những thuật toán giảm chiều dữ liệu không giám sát được phát minh sớm nhất mà vẫn được dùng rộng rãi tới ngày nay. Mục tiêu của PCA là tìm một phép chiếu trên không gian ít chiều sao cho hình chiếu của dữ liệu mới qua phép chiếu này có các tính chất tối ưu nhất định.",
      brief: pdf("1ZH0tHOqW4xflujm9z-5o3cRxwhlmpzOp"),
      groups: group(
        "1wlDP_6Mv4Tzjb5kurxk0JNB1OWpkf7vr",
        [
          { name: "Dương Quang Thành", school: "24 Gettysburg College, Mỹ" },
          { name: "Hoàng Huyền Trang", school: "THPT Chuyên Tuyên Quang, Tuyên Quang" },
          { name: "Trần Phan Anh Danh", school: ptnk },
        ],
        [linh, thu, phuong],
      ),
    },
    {
      title: "Spectral Clustering",
      description:
        "Mô hình Spectral Clustering trong Machine Learning được phổ biến bởi Shi, Malik (2000) và Ng, Jordan, Weiss (2002). Mô hình này lấy ý tưởng từ việc biểu diễn dữ liệu dưới dạng đồ thị và sử dụng thông tin về dữ liệu thông qua các ma trận đặc biệt từ đồ thị đó. Trong dự án này, chúng ta sẽ tìm hiểu về thuật toán Spectral Clustering.",
      brief: pdf("1c1kwZuHoUI6_4AQhzTQffEwvKfoGEUnf"),
      groups: group(
        "1RHbIoaPq2bJF1ghLVPKy13we2doVbRLw",
        [
          { name: "Võ Minh Quân", school: "THPT Chuyên Hùng Vương, Bình Dương" },
          { name: "Vũ Phan Thăng Long", school: "École Polytechnique, Pháp" },
          { name: "Vòng Vĩnh Toàn", school: "THPT Chuyên Hùng Vương, Bình Dương" },
          { name: "Nguyễn Bá Khôi Nguyên", school: "Đại học Khoa học Tự nhiên, ĐHQG-HCM" },
        ],
        // The report thanks "các anh chị mentor" without naming anyone.
        [],
      ),
    },
    {
      title: "Support Vector Machine",
      description:
        "Support Vector Machine (SVM) là mô hình học có giám sát được phát minh bởi Vladimir Naumovich Vapnik và Alexey Yakovlevich Chervonenkis năm 1963. Mô hình này được dùng chủ yếu là trong bài toán phân lớp (classification) dữ liệu. Trong dự án này, các bạn sẽ tìm hiểu về SVM và các biến thể của nó áp dụng trong bài toán phân lớp nhị phân sử dụng một siêu phẳng phân tách.",
      brief: pdf("1BQDv8lSx0iUk26dwFkOFb31J3W3XPX7g"),
      groups: group(
        "1rApPbWL_9csXAaLz49SSCTfVBdiuVr9S",
        [
          { name: "Phan Trường Trí", school: "THPT Chuyên Bạc Liêu, Bạc Liêu" },
          { name: "Phạm Tiến Sơn", school: "Đại học Bách khoa Hà Nội" },
          { name: "Vũ Đình Bách", school: "Đại học Bách Khoa Hà Nội" },
          { name: "Hoàng Khánh Linh", school: ptnk },
        ],
        [theAnh, phuc],
      ),
    },
  ],
};

export default camp;
