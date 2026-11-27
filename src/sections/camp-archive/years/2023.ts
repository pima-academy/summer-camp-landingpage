// The 2023 camp (spec #93, issue #102). Sources: the Jekyll site (pimavn/pimavn.github.io at
// 2b1a1fa, summer_camps/2023/, _data/organizers.yaml, _data/banners.yaml), whose 12 Drive links
// pointed at folders and files of a personal account; those were copied into the Drive folder
// 2023/ on "Trại hè PiMA - Lưu trữ" and the page links the copies. Topic as on the overview
// page and the 2023 project slides; the Jekyll site banner's "The Mathematics of Bioinformatics" and
// "Virtual" label are not used. Dates and venue from issue #89. Mentors: the people each report's
// acknowledgements name as having guided the group.
import type { CampYear, FileLink, Person } from "../camp-archive";
import cover from "../../../assets/camp-archive/2023/cover.jpg";

const pdf = (id: string): FileLink => ({ label: "PDF", url: `https://drive.google.com/file/d/${id}/view` });
const slide = (id: string): FileLink => ({ label: "Slide", url: `https://drive.google.com/file/d/${id}/view` });
const folder = (id: string): FileLink => ({ label: "Thư mục", url: `https://drive.google.com/drive/folders/${id}` });

const vnuhcm = "VNUHCM University of Science, Vietnam";
const danh: Person = { name: "Trần Phan Anh Danh", affiliation: "Nanyang Technological University, Singapore" };
const huyen: Person = { name: "Võ Thục Khánh Huyền", affiliation: "Max Planck Institute for Informatics, Germany" };
const theAnh: Person = { name: "Vũ Lê Thế Anh", affiliation: "University of Illinois Urbana-Champaign, USA" };
const nghia: Person = { name: "Nguyễn Trung Nghĩa", affiliation: vnuhcm };
const toan: Person = { name: "Vòng Vĩnh Toàn", affiliation: vnuhcm };
const tu: Person = { name: "Nguyễn Minh Tú", affiliation: vnuhcm };
const hy: Person = { name: "Vương Hy", affiliation: "BioTuring" };
const thien: Person = { name: "Lê Thiện", affiliation: "Massachusetts Institute of Technology, USA" };

const ptnk = "Phổ Thông Năng Khiếu, TPHCM";

const camp: CampYear = {
  year: 2023,
  topic: { vi: "Toán học và Ứng dụng trong Tin Sinh học", en: "Applied Mathematics in Bioinformatics" },
  cover,
  sessions: [{ campus: "TP.HCM", start: "2023-07-21", end: "2023-07-28", venue: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM" }],
  lectures: [
    { title: "Xác suất Thống kê", authors: [danh, huyen, theAnh], files: [folder("1-uyh1OJ2vy9EhRFkoCur-FyevitpUJRj")] },
    { title: "Đại số tuyến tính", authors: [nghia], files: [folder("1PxMLRPQeMHaspdeCbjLegbPOK6ntZnqa")] },
    { title: "Cấu trúc Dữ liệu và Giải thuật", authors: [toan, tu], files: [folder("1RK6Ht-KvAt794SxAuMVpL3zCLrnbQPkd")] },
    { title: "Tin Sinh học (Khách mời)", authors: [hy, thien], files: [folder("1stYHKQQSH6lx90DDjieSroWa6JNei-Nf")] },
  ],
  projects: [
    {
      title: "Bulk RNASeq Quantification",
      description: "Dự án này nhằm mục đích ước tính mức của các loại protein bằng cách định lượng lượng mRNA của từng loại transcript.",
      brief: pdf("1iirQWfveju-cHl7ZzWdjhL8gDxrr8Y62"),
      groups: [
        {
          campers: [
            { name: "Võ Hoàng An", school: "THPT Chuyên Thái Nguyên, Thái Nguyên" },
            { name: "Nguyễn Yên Giang", school: ptnk },
            { name: "Trần Nguyễn Thanh Danh", school: ptnk },
            { name: "Nguyễn Thị Chi Mai", school: "THPT Chuyên Phan Bội Châu, Nghệ An" },
          ],
          mentors: [nghia, { name: "Võ Thị Khánh Linh" }],
          files: [pdf("1wHV2YxsRXBkTr84jHUqOmGxu5BSX9hvF"), slide("1KO8wVfW8cbyI2th9QicKiFUahawgzOBS")],
        },
      ],
    },
    {
      title: "Rarefaction",
      description: "Dự án này nhằm mục đích ước tính số lượng loại tế bào T trong cá thể dựa dữ liệu quan sát được.",
      brief: pdf("1Dpoj9OURsgxUa-X_4SPltfITnSUHcluH"),
      groups: [
        {
          campers: [
            { name: "Nguyễn Gia Bách", school: "THPT Chuyên Đại học Sư phạm Hà Nội, Hà Nội" },
            { name: "Tào Phương Hồng Ngọc", school: "Chelsea High School, Michigan, USA" },
            { name: "Phùng Minh Quân", school: "THPT Lê Thị Riêng, Bạc Liêu" },
            { name: "Đỗ Lê Tuyết Ly", school: "THPT Chuyên Lê Quý Đôn, Đà Nẵng" },
          ],
          mentors: [danh],
          files: [pdf("1DXGDDvn3w9yUpY6kfyTSo1ceDdaE63-2"), slide("1fYcXXUQv1i1kKm2yc9WC7rfLKK50rZIT")],
        },
      ],
    },
    {
      title: "De Novo Assembly",
      description: "Dự án này nhằm mục đích tái tạo genome gốc dựa vào các đoạn DNA ngắn.",
      brief: pdf("1ZM_8X_7GCeqeq3rSoCDzd3YP57yuPj-p"),
      groups: [
        {
          campers: [
            { name: "Đặng Hữu Quyền", school: "THPT Chuyên Lê Hồng Phong, Nam Định" },
            { name: "Trần Gia Hân", school: ptnk },
            { name: "Hoàng Ngọc Dung", school: "THPT Chuyên Lê Quý Đôn, Khánh Hoà" },
            { name: "Nguyễn Ngọc Cảnh", school: "THPT Xuân Lộc, Đồng Nai" },
          ],
          mentors: [toan, theAnh, hy, { name: "Phạm Thanh Ngọc" }],
          files: [pdf("1j-shfKt7shHNKDv8lwJxsSOHcOsizfn_"), slide("1bqxe8obc6I-RLwQBQ6G1u4XdK2fVkLHX")],
        },
      ],
    },
    {
      title: "Sequence Alignment",
      description: "Dự án này nhằm mục đích tìm vị trí có khả năng cao nhất của một đoạn DNA trong một genome.",
      brief: pdf("1O9EkBe5GABsnFZRmnZJFZa_Pwz9kncz5"),
      groups: [
        {
          campers: [
            { name: "Nguyễn Hoàng Hưng", school: "THPT Bắc Giang, Bắc Giang" },
            { name: "Phạm Phúc Nguyên", school: "THPT Trần Văn Ơn, Bình Dương" },
            { name: "Đỗ Uyên", school: ptnk },
            { name: "Phạm Thị Hoài Thu", school: "THPT Chuyên Lê Hồng Phong, Nam Định" },
          ],
          mentors: [tu, theAnh],
          files: [pdf("1v6TZaD0S13_2fN_PwT5XjzQPoRoTSOSc"), slide("1sR6gPcJFwjE94cIraDFElRdl3n6CMyTR")],
        },
      ],
    },
  ],
};

export default camp;
