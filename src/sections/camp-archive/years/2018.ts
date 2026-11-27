// The 2018 camp (spec #93, issue #100): sources are the old site's summer_camps/2018/
// (lectures_and_projects, student_papers, gallery), _data/organizers.yaml and _data/banners.yaml
// (pimavn/pimavn.github.io @ 2b1a1fa), with mentors from each report's acknowledgements.
// Drive folder 2018/ on "Trại hè PiMA - Lưu trữ". Its four lectures are relisted in 2019.
// The cover is that drive's 04.jpg (file 1xNjudxwWefpIPWM-s_qFZ1TKzC3GmOPh), not the old banner.
import type { CampYear, FileLink, Person } from "../camp-archive";
import cover from "../../../assets/camp-archive/2018/cover.jpg";

const file = (id: string): string => `https://drive.google.com/file/d/${id}/view`;
const folder = (id: string): string => `https://drive.google.com/drive/folders/${id}`;
const pdf = (id: string): FileLink => ({ label: "PDF", url: file(id) });

// Lecture authors and mentors, resolved from organizers.yaml.
const linh: Person = { name: "Trần Hoàng Bảo Linh", affiliation: "National University of Singapore" };
const nghia: Person = { name: "Nguyễn Trung Nghĩa", affiliation: "VNUHCM University of Science, Vietnam" };
const trung: Person = { name: "Cấn Trần Thành Trung", affiliation: "Caltech" };
const nhat: Person = { name: "Phạm Hoàng Nhật", affiliation: "University of Washington" };
const trong: Person = { name: "Dương Đình Trọng", affiliation: "International University, VNU" };
const theAnh: Person = { name: "Vũ Lê Thế Anh", affiliation: "VNUHCM University of Science, Vietnam" };
const manh: Person = { name: "Phạm Nguyễn Mạnh", affiliation: "Minerva Schools at KGI, USA" };
const truongHai: Person = { name: "Nguyễn Trường Hải", affiliation: "VNUHCM University of Science, Vietnam" };
const nhu: Person = { name: "Bùi Trần Thục Như", affiliation: "Fulbright University Vietnam" };

const ptnk = "Trường Phổ thông Năng khiếu, Đại học Quốc gia TP. HCM";

const camp: CampYear = {
  year: 2018,
  topic: { vi: "Toán học trong Học máy", en: "The Mathematics of Machine Learning" },
  cover,
  sessions: [{ campus: "TP.HCM", start: "2018-07-30", end: "2018-08-08", venue: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM" }],
  lectures: [
    { title: "Đại số tuyến tính", authors: [linh, nghia, trung], files: [pdf("1E1GmO5aNRtrjzATt1dJwvXJpvN31d51R")] },
    { title: "Tối ưu hóa", authors: [nhat], files: [pdf("1JcLWdtWl2sOXIwCkPHvrylAfESgbKAkX")] },
    { title: "Giải tích", authors: [trong, linh], files: [pdf("1Tc8-crkzxpUcX-rR6T44ZbDtr0zVIHkp")] },
    { title: "Xác suất và phân phối", authors: [theAnh, linh, manh], files: [pdf("16XxQIdekFWNUi1dL6aWKzTo-2eiw5nBq")] },
  ],
  projects: [
    {
      title: "Neural Network",
      description:
        "Năm 1958, Frank Rosenblatt mô tả thuật toán perceptron, tiền thân của neural network. Trải qua hơn nửa thế kỉ phát triển, với biết bao thăng trầm, hiện nay neural network là một trong những mô hình phổ biến nhất của trí tuệ nhân tạo và máy học, cơ sở của các thành tựu trong học sâu (deep learning). Ở dự án này, các bạn sẽ sử dụng các kiến thức toán đã được học để nghiên cứu về mạng nơron có nhiều lớp (multilayer perceptron).",
      brief: pdf("1Dy59LfUbUhCZ8MXXxy6Yg-Iaj8CyoWPO"),
      groups: [
        {
          campers: [
            { name: "Lại Ngọc Tân", school: "Trường THPT Chuyên Trần Phú, Hải Phòng" },
            { name: "Hà Phương Uyên", school: "Trường THPT Chuyên Phan Ngọc Hiển, Cà Mau" },
            { name: "Phạm Nguyễn Hoàng Duy", school: "Trường THPT Chuyên Nguyễn Thị Minh Khai, Sóc Trăng" },
            { name: "Nguyễn Trung Kiên", school: ptnk },
          ],
          mentors: [nghia, nhat, nhu, theAnh, linh],
          files: [pdf("1dZWyu47PhpgX3qA7HVAv0vccPA_kkDos")],
        },
        {
          campers: [
            { name: "Phạm Anh Tuấn", school: ptnk },
            { name: "Nguyễn Hồ Thăng Long", school: "Trường THPT Gia Định, TP. HCM" },
            { name: "Tạ Lê Ngọc Sáng", school: "Trường THPT Chuyên Amsterdam, Hà Nội" },
            { name: "Nguyễn Quốc Hoàn", school: "Trường THPT Chuyên Nguyễn Du, Đắk Lắk" },
          ],
          // The report names its mentors by given name only ("anh Trọng, chị Minh, anh Nhật,
          // anh Thế Anh"); left empty until the user confirms the full names.
          mentors: [],
          files: [pdf("18VkuZgVNwImc4-SzbnAgRhw1J7Sw4YR2")],
        },
        {
          campers: [
            { name: "Hoàng Quốc Thái", school: "University of Washington, USA" },
            { name: "Nguyễn Nhật Minh Khôi", school: "Trường THPT Chuyên Hoàng Lê Kha, Tây Ninh" },
            { name: "Trần Gia Phong", school: ptnk },
            { name: "Phan Thị Mỹ Linh", school: "Trường THPT Gia Định, TP. HCM" },
          ],
          mentors: [],
          files: [pdf("18fowlyIBIuanOHnPx8YUlzuJJht55znD")],
        },
      ],
    },
    {
      title: "Support Vector Machine",
      description:
        "Support Vector Machines (SVMs) là những mô hình học có giám sát được phát minh bởi Vladimir Naumovich Vapnik và Alexey Yakovlevich Chervonenkis năm 1963. Mô hình này được dùng rất nhiều trong bài toán phân lớp dữ liệu (được áp dụng trong cả bài toán phân loại lẫn hồi quy). Ở phiên bản gốc, SVMs là một mô hình nhị phân gồm một hệ điểm dữ liệu (được gắn nhãn 1 hoặc −1) biểu diễn trên một không gian nhiều chiều, SVMs hỗ trợ xây dựng một siêu phẳng để phân hệ dữ liệu trên thành hai lớp (mỗi lớp tương ứng với một nhãn). Không chỉ dừng lại ở bài toán phân lớp, SVMs yêu cầu các điểm dữ liệu nằm càng xa siêu phẳng càng tốt.",
      brief: pdf("1Y8exMe3er-P_Zl5kgPtAkMkaMtCBRrl2"),
      groups: [
        {
          campers: [
            { name: "Phạm Quốc Việt", school: "Trường THPT Chuyên Amsterdam, Hà Nội" },
            { name: "Nguyễn Hà Minh", school: "Trường THPT Nguyễn Bỉnh Khiêm, Gia Lai" },
            { name: "Nguyễn Đình Bảo Ngọc", school: ptnk },
            { name: "Nguyễn Huy Anh", school: "Campbell County Comprehensive High School, USA" },
          ],
          mentors: [theAnh, trong],
          files: [pdf("1y8lDbQf2p9bnAnhNOghUm4A4G5RktrvI")],
        },
        {
          campers: [
            { name: "Nguyễn Minh Hải", school: "Trường THPT Chuyên Quốc Học, Huế" },
            { name: "Trần Minh Thảo", school: "Trường THPT Phạm Văn Đồng, Quảng Ngãi" },
            { name: "Trần Thanh Thiện", school: ptnk },
            { name: "Đắc Tùng Dương", school: "Trường THPT Chuyên Khoa Học Tự Nhiên, Hà Nội" },
          ],
          mentors: [linh],
          files: [pdf("1MQ8tUeS9CtFLjTnguk_rQ02k4rEQ9wgh")],
        },
      ],
    },
    {
      title: "Principal Component Analysis",
      description:
        "Principal Component Analysis (PCA) là một trong những kỹ thuật làm giảm số chiều (dimension reduction) của không gian dữ liệu đang xét, rất thông dụng trong thống kê (statistics), học máy (machine learning), hay lý thuyết thông tin (information theory). Công cụ chính để xây dựng phương pháp này là ma trận và cơ sở tương ứng với vector riêng trong Đại số Tuyến tính. Ý tưởng chính là biểu diễn lại các vector dữ liệu trong một cơ sở con thích hợp (cơ sở ứng với các giá trị riêng lớn nhất) để chỉ cần lưu lại những thông tin trọng yếu của toàn bộ dữ liệu. Trong dự án này, các bạn sẽ tìm hiểu nền tảng lý thuyết của PCA và áp dụng công cụ này vào một dữ liệu cụ thể.",
      brief: pdf("16ntE6temlqQj-ntt6s0FgUkOaH6czyiO"),
      groups: [
        {
          campers: [
            { name: "Trần Thanh Bình", school: ptnk },
            { name: "Võ Thục Khánh Huyền", school: "Trường THPT Chuyên Lê Quý Đôn, Quảng Trị" },
            { name: "Lê Quang Kỳ", school: "Trường THPT Chuyên Hoàng Lê Kha, Tây Ninh" },
            { name: "Đỗ Nhật Hoàng", school: ptnk },
          ],
          mentors: [trung],
          files: [pdf("1O_BhQabWVjbkrtkNFYFv_9AT4s_ZDJKq")],
        },
      ],
    },
    {
      title: "Naive Bayes",
      description:
        "Được nghiên cứu rộng rãi từ thập niên 50, Naive Bayes là một phương pháp phân loại bắt nguồn từ lí thuyết Bayes và điều giả sử rằng các sự kiện trong điểm dữ liệu đều phân biệt. Phương pháp này nổi tiếng về việc có mô hình đơn giản và tương đối hiệu quả với những vấn đề mà ta không có quá nhiều dữ liệu. Trong trại hè PiMA, các bạn sẽ được học về Naive Bayes và cách áp dụng phương pháp này cho mục đích phân loại.",
      brief: pdf("1FjqxXFRvxGdfIqFlgmHIFQcVRVOPBt2Z"),
      groups: [
        {
          campers: [
            { name: "Nguyễn Nguyễn", school: ptnk },
            { name: "Huỳnh Phạm Phương Mai", school: "Trường THPT Chuyên Lê Hồng Phong, TP. HCM" },
            { name: "Nguyễn Tấn Đạt", school: "Trường THPT Chuyên Sư Phạm, Hà Nội" },
            { name: "Nguyễn An Trường", school: "Trường THPT Chuyên Nguyễn Tất Thành, Kon Tum" },
          ],
          mentors: [manh, truongHai, nhat],
          files: [pdf("1p4ms5wvPfVrQ5G4WJOkbeNKgHQtzKGCz")],
        },
      ],
    },
  ],
  gallery: [
    { name: "Khai mạc - Giao lưu với GS. Hồ Tú Bảo (VIASM)", folder: "01-khai-mac", album: folder("1y0cEYk8KWH1FAZsYC8Chy2Mod_hdyP1y") },
    { name: "Buổi học Đại số Tuyến tính do mentor Nguyễn Trung Nghĩa phụ trách", folder: "02-buoi-hoc-dai-so-tuyen-tinh", album: folder("1jk5n2Q5M0ebXnh6MWOaymiVm5NxkfVht") },
    { name: "Trò chơi nhỏ sau buổi học đầu tiên", folder: "03-tro-choi-nho", album: folder("1DCMKgiqwN07lTlqEyPj2p4twIb9YvOPd") },
    { name: "Bên trong lớp học", folder: "04-ben-trong-lop-hoc", album: folder("1llmF91jgm_SPLDxKr3f8Xxl6Fw66l1a1") },
    { name: "Giao lưu với PGS. Đình Điền", folder: "05-giao-luu-dinh-dien", album: folder("1z7OrYANDEczDpjcRNK4TMyi81tBZiXDa") },
    { name: "Giao lưu với PGS. Nguyễn Đức Hoàng Hà", folder: "06-giao-luu-nguyen-duc-hoang-ha", album: folder("1kedzk-PcXtv2ey2FJEL-HkF0c5RX5csv") },
    { name: "Giao lưu với GS. Lý Quốc Ngọc", folder: "07-giao-luu-ly-quoc-ngoc", album: folder("1N1VqzD1f3PdhWvj8DSYfz-PL7gBBs3kE") },
    { name: "Giao lưu với PGS. Nguyễn Minh Triết", folder: "08-giao-luu-nguyen-minh-triet", album: folder("1eOQkSqfZhpBUsWQhdT24-L2ckFUAGoYd") },
    { name: "Sau giờ học", folder: "09-sau-gio-hoc", album: folder("10_1sUEAMhk0GTePkvvlp5MFIu4V38JCf") },
    { name: "Trò chơi lớn", folder: "10-tro-choi-lon", album: folder("1VZMcvAkDYU1Xx5K0nKmst-NizPbF8gUT") },
    { name: "Thuyết trình", folder: "11-thuyet-trinh", album: folder("1PjnTS3GwlugIycwLb2s-wnoZCU7cJUiA") },
    { name: "Bế mạc", folder: "12-be-mac", album: folder("1COo54SO7Xd_IeJXeoOtxSSTiBAzNBDZN") },
  ],
};
export default camp;
