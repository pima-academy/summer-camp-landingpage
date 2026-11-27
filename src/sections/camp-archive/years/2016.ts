// The 2016 camp (spec #93, #98): sources the Jekyll site pimavn/pimavn.github.io at 2b1a1fa
// (summer_camps/2016/, _data/organizers.yaml, _data/banners.yaml) and the reports' title pages
// for mentors. Documents and photo originals in the Drive folder 2016/ on "Trại hè PiMA - Lưu trữ".
// No dates are known for 2016: the session shows campus and venue only.
import type { CampYear, FileLink, Person } from "../camp-archive";
import cover from "../../../assets/camp-archive/2016/cover.jpg";

const pdf = (id: string): FileLink => ({ label: "PDF", url: `https://drive.google.com/file/d/${id}/view` });
const folder = (id: string): string => `https://drive.google.com/drive/folders/${id}`;

// Lecturers and mentors, as organizers.yaml names them.
const quan: Person = { name: "Phạm Tấn Anh Quân", affiliation: "VNUHCM University of Science, Vietnam" };
const linh: Person = { name: "Trần Hoàng Bảo Linh", affiliation: "National University of Singapore" };
const trung: Person = { name: "Cấn Trần Thành Trung", affiliation: "Caltech" };

const ptnk = "Trường Phổ thông Năng khiếu, Đại học Quốc gia TP. HCM";

const camp: CampYear = {
  year: 2016,
  topic: { vi: "Toán mô hình", en: "Mathematical Modelling" },
  cover,
  sessions: [{ campus: "TP.HCM", venue: "Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM" }],
  lectures: [
    { title: "Xác suất Thống kê", authors: [quan], files: [pdf("128lIXxbTz8PFhNVaHOn2wd4bCYgqz1zX")] },
    { title: "Đồ thị", authors: [{ name: "Hồ Quốc Đăng Hưng", affiliation: "University of Chicago, USA" }], files: [pdf("1PBlcypAD_tRHg_JxF32MF3I2SLbc8_vd")] },
    { title: "Quy hoạch tuyến tính", authors: [linh], files: [pdf("1U8DYhjd2vMkTGFBezGkazwSxlfZPkX0e")] },
    {
      title: "MATLAB và LaTeX",
      authors: [
        { name: "Lê Việt Hải", affiliation: "Pennsylvania State University" },
        { name: "Nguyễn Vĩnh Khang", affiliation: "Liberty University, USA" },
      ],
      files: [pdf("1ejpXgeLV6rKV2KpHJsS-j8Efw5gC2nVx")],
    },
    { title: "Giới thiệu về toán mô hình", authors: [trung], files: [pdf("1U8Oo4B5P0udD12nhCzQXBu0Wa3d8xwWQ")] },
  ],
  // "Bố trí xe cứu thương" and "Sắp xếp lịch chiếu phim" are left out: no group reported on them.
  projects: [
    {
      title: "Phân tuyến cho học sinh vào lớp 6",
      description: "Làm sao để Bộ Giáo Dục có thể đảm bảo các bạn học sinh đều được đi học phù hợp với địa điểm của mình.",
      brief: pdf("11yVKgnmZWwGVzDvRO0dK_YK8cWWP70RT"),
      groups: [
        {
          reportTitle: "Phân tuyến học sinh vào lớp 6",
          campers: [
            { name: "Vũ Lê Thế Anh", school: "Trường Phổ thông Năng Khiếu, Đại học Quốc gia TP. HCM" },
            { name: "Đinh Lâm Kiều Phương", school: "Trường THPT Chuyên Nguyễn Thị Minh Khai, tỉnh Sóc Trăng" },
            { name: "Dương Anh Kiệt", school: "Trường THPT Chuyên Hoàng Lê Kha, tỉnh Tây Ninh" },
          ],
          mentors: [trung],
          files: [pdf("1gHaBAoPgsIlIBft1V67CVznjIqmoLtP1")],
        },
        {
          reportTitle: "Phân tuyến học sinh vào lớp 6",
          campers: [
            { name: "Phan Minh Hoàng", school: "Trường Phổ thông Năng Khiếu, Đại học Quốc gia TP. HCM" },
            { name: "Nguyễn Hoàng Minh Hiếu", school: "Trường THPT Phan Bội Châu, tỉnh Lâm Đồng" },
            { name: "Vũ Hùng", school: "Trường Phổ thông Năng Khiếu, Đại học Quốc gia TP. HCM" },
          ],
          mentors: [],
          files: [pdf("1TnEfX16s6AWbAdeoy3e4Zq_apAIjjDnx")],
        },
      ],
    },
    {
      title: "Thiết kế hệ thống tàu điện ngầm",
      description: "Làm sao để TP. HCM có được một hệ thống tàu điện ngầm như các nước phát triển?",
      brief: pdf("1ZSfT0b0QLdB4TLoUXY1wNNICx4JqExM2"),
      groups: [
        {
          reportTitle: "Hệ thống tàu điện ngầm ở TP. HCM",
          campers: [
            { name: "Võ Hiển Thông", school: ptnk },
            { name: "Phạm Hoàng Nhật", school: "Phillips Academy Andover, USA" },
            { name: "Phan Ngọc Tiên", school: ptnk },
            { name: "Trần Minh Nguyên", school: ptnk },
          ],
          mentors: [linh],
          files: [pdf("1M_brTzDx9WCIMvOzoSl6S46J3uHmA8jB")],
        },
        {
          reportTitle: "Hệ thống tàu điện ngầm ở TP. HCM",
          campers: [
            { name: "Phạm Nguyễn Mạnh", school: ptnk },
            { name: "Hoàng Văn Thiên", school: "Trường THPT Chuyên Lý Tự Trọng, Cần Thơ" },
          ],
          mentors: [],
          files: [pdf("1LZV8A--yt05wwmHX4IU8_sz9K71_Yv6D")],
        },
        {
          reportTitle: "Hệ thống tàu điện ngầm ở TP. HCM",
          campers: [
            { name: "Trần Quốc Cơ", school: "Trường THPT Chuyên Lê Hồng Phong, TP. HCM" },
            { name: "Tạ Thị Phương Liên", school: "Trường THPT Chuyên Lương Thế Vinh, Đồng Nai" },
            { name: "Phan Văn Trường", school: "Trường THPT Chuyên Nguyễn Du, Đak Lak" },
          ],
          mentors: [quan],
          files: [pdf("1C_2emhpDm5Sv86UVJ8VDXfrqr7aKnrt1")],
        },
      ],
    },
  ],
  // The old gallery's English section names, translated; the photos are in file-name order.
  gallery: [
    { name: "Khai mạc", folder: "01-khai-mac", album: folder("1SAXVxSu1ibR_sOBTVhcIhrskYbXHth_X") },
    { name: "Những buổi học đầu tiên", folder: "02-nhung-buoi-hoc-dau-tien", album: folder("1wulFJYay__ueOlv9rlgJ8daLFJtjDG3a") },
    { name: "Phòng máy tính", folder: "03-phong-may-tinh", album: folder("14aLzndNrBFdZ7fJKSpLPKECLk8cj7iQh") },
    { name: "Trò chơi lớn", folder: "04-tro-choi-lon", album: folder("1Eoaug7COLBJItn7XQHFSDvP-dDBqlOco") },
    { name: "Hoạt động nhóm", folder: "05-hoat-dong-nhom", album: folder("1zJnjhgiLiRFe7xq_O3o4Q0-c7j8snGSN") },
    { name: "Buổi thuyết trình", folder: "06-buoi-thuyet-trinh", album: folder("1zGUqQJEV2E0HlVORzYd0B-8a8B0YAes0") },
    { name: "Bế mạc", folder: "07-be-mac", album: folder("1CIOzjhFConYieu76A_nIhn-GChce6Nrg") },
  ],
};

export default camp;
