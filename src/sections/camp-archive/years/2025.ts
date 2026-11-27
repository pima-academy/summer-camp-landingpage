// The 2025 camp (spec #93, issue #104): sources are the Drive folder "[Public] Tài liệu Trại hè
// PiMA 2025" (copied into 2025/ on "Trại hè PiMA - Lưu trữ"), the 2025 camp page
// (topic, description, programme, sessions) and its team list (both removed in #107), as inventoried
// in docs/research/camp-2025-2026-inventory.md (issue #85). Campers and schools are verbatim
// from the first page of each report. No gallery and no video: no photo or video is confirmed
// as the 2025 camp's.
import type { Camper, CampYear, Campus, FileLink, Person, ProjectGroup } from "../camp-archive";
import coverTphcm from "../../../assets/camp-archive/2025/cover-tphcm.jpg";
import coverHaNoi from "../../../assets/camp-archive/2025/cover-ha-noi.jpg";
import tranMinhTriet from "../../../assets/camp-archive/2025/team/tran-minh-triet.avif";
import canTranThanhTrung from "../../../assets/camp-archive/2025/team/can-tran-thanh-trung.avif";
import tranThanhLong from "../../../assets/camp-archive/2025/team/tran-thanh-long.avif";
import phamKimSon from "../../../assets/camp-archive/2025/team/pham-kim-son.avif";

const file = (id: string): string => `https://drive.google.com/file/d/${id}/view`;
const pdf = (id: string): FileLink => ({ label: "PDF", url: file(id) });

// Lectures 3-5 list one affiliation on the title page, so it is every author's. The other
// title pages list affiliations as a block not tied to authors, so those authors have none.
const pimaTeam = "PiMA Team, Việt Nam";
const ptnk = "Trường Phổ thông Năng khiếu, ĐHQG-TPHCM";

/** A project group: its report, slides, notebook if any, and its Drive folder. */
const group = (
  campus: Campus,
  ids: { folder: string; report: string; slides: string; notebook?: string },
  campers: Camper[],
  extra: { reportTitle?: string; mentors?: Person[] } = {},
): ProjectGroup => ({
  ...(extra.reportTitle ? { reportTitle: extra.reportTitle } : {}),
  campus,
  campers,
  mentors: extra.mentors ?? [],
  files: [
    pdf(ids.report),
    { label: "Slide", url: file(ids.slides) },
    ...(ids.notebook ? [{ label: "Notebook" as const, url: file(ids.notebook) }] : []),
    { label: "Thư mục", url: `https://drive.google.com/drive/folders/${ids.folder}` },
  ],
});

const camp: CampYear = {
  year: 2025,
  topic: { vi: "Toán học trong các Mô hình Tạo sinh", en: "The Mathematics of Generative Models" },
  covers: [
    { image: coverTphcm, campus: "TP.HCM" },
    { image: coverHaNoi, campus: "Hà Nội" },
  ],
  description: [
    "Toán học trong các Mô hình Tạo sinh (The Mathematics of Generative Models) là một chủ đề nằm ở giao điểm giữa Toán học, Khoa học Dữ liệu và Trí tuệ Nhân tạo. Mô hình tạo sinh là những hệ thống có khả năng học từ dữ liệu đã có để tạo ra dữ liệu mới theo yêu cầu của người dùng. Ví dụ điển hình là ChatGPT (tạo văn bản ngôn ngữ tự nhiên) và DALL-E (tạo hình ảnh từ văn bản).",
    "Đằng sau sức mạnh của các mô hình này là hệ thống các công cụ toán học và kỹ thuật lập trình sâu sắc. Những kiến thức đó được tích hợp để xử lý dữ liệu và huấn luyện mô hình. Qua đó, các kiến thức như đại số tuyến tính, vi tích phân và xác suất thống kê chính là nền tảng tạo nên trí tuệ của những hệ thống hiện đại này.",
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
    {
      title: "Đề tuyển sinh",
      authors: [],
      files: [pdf("1u6jtcZtQZFdN15puHk1XCPp5WSsrMaxA"), { label: "Lời giải", url: file("1HFstiiUDB-I8gGqe0O978leQ4k0kC4bm") }],
    },
  ],
  lectures: [
    { title: "Đại số tuyến tính", authors: [{ name: "Võ Hoàng An" }, { name: "Đỗ Lê Tuyết Ly" }, { name: "Trần Nguyễn Nam Hưng" }], files: [pdf("1yyzW2aCScLe2Lpgb4PaLEQnzqFZXthrP")] },
    { title: "Giải tích hàm nhiều biến", authors: [{ name: "Lê Tiến Hợp" }, { name: "Nguyễn Hoàng Ngọc Hà" }], files: [pdf("1RHuesdQGLR-1XTeCHgnQQ1uqRvYoKcoZ")] },
    { title: "Xác suất thống kê cơ bản 1", authors: [{ name: "Nguyễn Thị Vân", affiliation: pimaTeam }, { name: "Đỗ Lê Tuyết Ly", affiliation: pimaTeam }], files: [pdf("1sHrZmKYis0YIpQWRt6ng58tb12Mf-Aeq")] },
    { title: "Xác suất thống kê cơ bản 2", authors: [{ name: "Nguyễn Thị Vân", affiliation: pimaTeam }, { name: "Trần Phan Anh Danh", affiliation: pimaTeam }], files: [pdf("1feytTZksj8RPtgQdWgvQSY5KkvG3_sRk")] },
    {
      title: "Ước lượng tham số",
      authors: [{ name: "Đặng Trọng Bảo Thi", affiliation: pimaTeam }, { name: "Vòng Vĩnh Toàn", affiliation: pimaTeam }, { name: "Trần Phan Anh Danh", affiliation: pimaTeam }],
      files: [pdf("1E6Yg0JHgJ8l-T7_s9brvuWxL04BQHcCY")],
    },
    { title: "Suy diễn và Mô hình tạo sinh", authors: [{ name: "Nguyễn Hữu Phước" }, { name: "Tăng Vĩnh Hà" }], files: [pdf("1t9ifZxJrykgIY7QYJsN8nCYOg5MEJaD4")] },
    { title: "Học máy và Học sâu cơ bản", authors: [{ name: "Nguyễn Minh Đức" }, { name: "Nguyễn Mai Anh Thư" }], files: [pdf("1zQUiKfYzTfHJspOswx284oY-L2qd6Wl6")] },
    { title: "Các mô hình học sâu", authors: [{ name: "Nguyễn Ngọc Cảnh" }, { name: "Nguyễn Minh Đức" }], files: [pdf("1LWEXHpHEFfg3io8Fikj3gyUNlaKkOBYA")] },
  ],
  exercises: [{ title: "Bài tập về nhà", authors: [], files: [pdf("1lL8hnhFYe0MkbogwiKokekDn3JJAa6_Y")] }],
  reading: [
    { title: "Đại số tuyến tính", authors: [], files: [pdf("1nLOej-bZuNP0oH1NZ6OVYC1dmK7gjvqV")] },
    { title: "Vi tích phân", authors: [], files: [pdf("1GBqV5FDmynuLbrwnNd85vOEUiAYcOp0j")] },
    { title: "Xác suất Thống kê", authors: [], files: [pdf("1pftjr6a4W3C3M3RH7akFIH_hXZvK72zO")] },
    { title: "Soạn thảo bằng LaTeX", authors: [], files: [pdf("1oCkDTJhisXd8JSdX8s_jldop1AZfCqCO")] },
  ],
  // One topic per project folder name, Hà Nội groups first. The year folder holds no brief or
  // description of a topic.
  projects: [
    {
      title: "Mô hình khuếch tán",
      groups: [
        group(
          "Hà Nội",
          { folder: "1vRNdmeYKVosPhRlbHTgkejo9VWn9Z05H", report: "16q6cEwLJipNCWx_seAxdNT8MmxXJssw3", slides: "1TQ-Ek-7G-GZPpPsl3Pzm7yioYo9RtVaA" },
          [
            { name: "Đinh Hoàng Phương Thảo", school: "Trường THPT Chuyên Hà Giang, Tuyên Quang" },
            { name: "Đinh Nguyễn Bảo Anh", school: "Trường THPT chuyên Lê Quý Đôn, Đà Nẵng" },
            { name: "Hồ Xuân Hùng", school: "Trường THPT Chuyên Chu Văn An, Hà Nội" },
            { name: "Vũ Đình Minh", school: "Trường THPT Chuyên Chu Văn An, Hà Nội" },
          ],
        ),
        group(
          "TP.HCM",
          { folder: "1uI-M55_WjNQTCV5Ry7FzLcEwhZ6H9GqF", report: "1Y_L80ntyHi6PuKm4pj3yr9fdohkoddt9", slides: "1iN7FBP6xkfHgKfdz1XuX-kADtcQ4B03N", notebook: "1D6Sw2H6wEsTBmeN2iJkTA4nq90EnvPrW" },
          [
            { name: "Châu Tấn Phát", school: "Trường THPT chuyên Trần Đại Nghĩa, TPHCM" },
            { name: "Nguyễn Hữu Vinh", school: "Trường THPT Gia Định, TPHCM" },
            { name: "Ưng Ngọc Bảo Trân", school: ptnk },
            { name: "Nguyễn Quang Thông", school: "Trường THPT chuyên Lê Hồng Phong, TPHCM" },
          ],
        ),
      ],
    },
    {
      title: "Mạng đối nghịch - tạo sinh",
      groups: [
        // "Nguyễn Minh Đức (Mentor)" on the report is the group's mentor; the other three
        // authors, one of them with a university, are campers (issue #104).
        group(
          "Hà Nội",
          { folder: "1dJLgSODmrQRrhfl_Xs_aSZu__XQmqomY", report: "1PFSS89Czat7BLufEqHnN_agTg60RTnzJ", slides: "1yizPhlfoDnv5Jg8UIBvpFmx4czaq39Zt" },
          [
            { name: "Nguyễn Văn Khuê", school: "École Polytechnique, Paris" },
            { name: "Phạm Mạnh Quân", school: "THPT chuyên Lê Quý Đôn, Đà Nẵng" },
            { name: "Lê Nguyễn Bảo Anh", school: "THPT chuyên KHTN, ĐHQG Hà Nội" },
          ],
          { reportTitle: "Mạng đối nghịch tạo sinh", mentors: [{ name: "Nguyễn Minh Đức", affiliation: "Trường Đại học FPT, Hà Nội" }] },
        ),
        group(
          "TP.HCM",
          { folder: "1GfUnb5HPuTGfR2-HDUa2DPuab8QMVcBe", report: "11NJ2mLtB83l62JlJeMWdnWQCDqkVu1rA", slides: "1VoIyTQQjMd79haA4a2yR0QujAY3VA9B2" },
          [
            { name: "Trang Thảo My", school: "Trường THPT Gia Định, TPHCM" },
            { name: "Trương Tấn Minh", school: "Trường THPT Chuyên Quang Trung, Bình Phước" },
            { name: "Nguyễn Ngọc Quỳnh Thi", school: ptnk },
          ],
          { reportTitle: "Mô hình mạng đối nghịch - tạo sinh" },
        ),
      ],
    },
    {
      title: "Mô hình đồ thị",
      groups: [
        // Two authors give a university; they are campers (issue #104).
        group(
          "Hà Nội",
          { folder: "1QFuBsveudnKA20hftW27LqR17eNtBYDS", report: "1YKEFGp1-ucZCFu6ZKWVw7S5JsZ5GP5Xu", slides: "1fWQfX2fIofR2lNLb3_aZ99LWwdRTSTLI", notebook: "1AFXwl68YTZNpcp3_68QqQrDDgL-3s6fo" },
          [
            { name: "Nguyễn Hữu Phát Lộc", school: "Trường Đại học Khoa học Tự nhiên - Đại học Quốc gia TP.HCM" },
            { name: "Tạ Minh Tuấn", school: "Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội" },
            { name: "Hoàng Công Bảo Long", school: "Trường THPT Chuyên Lê Quý Đôn, Đà Nẵng" },
            { name: "Lê Xuân Thịnh", school: "Trường THPT chuyên Nguyễn Du, Đăk Lăk" },
          ],
        ),
        group(
          "TP.HCM",
          { folder: "1a7LRrZHuAKu_tGK6G7Tral9nTsSNip7P", report: "13Nrgzkh7iHYflMZzunyIKp8goaqriUHU", slides: "1KmhIlmJlKRJXtkRaGvdJw4nfzQ4UUIE0" },
          [
            { name: "Nguyễn Sơn Hải", school: ptnk },
            { name: "Phạm Phúc Toàn", school: "Trường THPT Chuyên Hoàng Lê Kha, Tây Ninh" },
            { name: "Lê Vũ Thiêm Hoàng", school: "Trường THPT Chuyên Hùng Vương, Bình Dương" },
            { name: "Phan Hoàng Thanh Dung", school: ptnk },
          ],
        ),
      ],
    },
    {
      title: "Mô hình tự hồi quy",
      groups: [
        group(
          "Hà Nội",
          { folder: "15vW4ZKzkyM8aHKWSsB1oFtvawEMZp_yV", report: "1shYSFZjdAj6dsIoG_SbhBxvPpjn4cNEg", slides: "1IE42AZj36AScUKFMdVur0pBnotjI5bkT" },
          [
            { name: "Nguyễn Thùy Dung", school: "THPT Chuyên Bắc Giang" },
            { name: "Nguyễn Đăng Sỹ Hoàng", school: "Phổ thông Năng khiếu ĐHQG-HCM" },
            { name: "Trương Quang Thái", school: "THPT Chuyên Lào Cai" },
          ],
        ),
        group(
          "TP.HCM",
          { folder: "10xc0nyuddxHUQiKncnPvy55l8zsp7Asc", report: "1I2pXvdCJH8JamqVRepZJeoKuIlD9sz9b", slides: "15FnT2Z41Pdz0ZfjgO_T-G017ypJVoAJ6", notebook: "1rDXf6pdPfMNflqnMpzcfumj7A8J1Lq4h" },
          [
            { name: "Vũ Thị Quỳnh Như", school: "Trường THPT Chuyên Huỳnh Mẫn Đạt, Kiên Giang" },
            { name: "Phạm Vũ Gia Bảo", school: "Trường THPT Chuyên Lê Quý Đôn, Bà Rịa-Vũng Tàu" },
            { name: "Dương Nghiệp Phát", school: "Trường THPT Nguyễn Thị Minh Khai, TPHCM" },
            { name: "Nguyễn Xuân Gia Khang", school: "Trường Phổ thông Năng Khiếu, ĐHQG-TPHCM" },
          ],
          { reportTitle: "Mô hình học sâu tự hồi quy trong tạo sinh âm thanh" },
        ),
      ],
    },
    {
      title: "Tự mã hóa biến phân",
      groups: [
        group(
          "Hà Nội",
          { folder: "1UBIbWA-xZU20sw5YwT23gXkqB7gi9uh4", report: "1uSPjIwBopVH32V5bcFg76MGyRLFFHzVx", slides: "1Ja8JvQuueOFRPxgtwZVWlrZzUKIKHckj" },
          [
            { name: "Nguyễn Trung Tín", school: "Trường THPT Chuyên Bắc Giang" },
            { name: "Phạm Hữu Nam", school: "Trường THPT Cẩm Phả" },
            { name: "Trịnh Khánh Nam", school: "Trường THPT Chuyên Trần Phú" },
          ],
        ),
        group(
          "TP.HCM",
          { folder: "1t3CftJvgdF9XxjhPZyVbps2ykLb87CxP", report: "1HbX7iA_4d9UEbTFV7cPm4bGsFaOosKaC", slides: "19YWgaHrdy7cvnG_Ozl05dVPbiEeNLjN2", notebook: "1NmSsRcE93n3Qy3e6ZZ-E8Ge1_Gdley8k" },
          [
            { name: "Đỗ Viết Hoàng Long", school: "Trường THPT Chuyên Quang Trung, Bình Phước" },
            { name: "Nguyễn Thị Ánh Tuyết", school: "Trường THPT Chuyên Nguyễn Chí Thanh, Đắk Nông" },
            { name: "Võ Nguyễn Thành Nhân", school: ptnk },
            { name: "Nguyễn Đình Minh Huy", school: "Trường THPT Chuyên Nguyễn Du, Đắk Lắk" },
          ],
          { reportTitle: "Mô hình tự mã hóa biến phân" },
        ),
      ],
    },
    {
      title: "Luồng chuẩn hóa",
      groups: [
        group(
          "TP.HCM",
          { folder: "1nged8FCsz2aZonMYZb1Iptbyf7CyhKdh", report: "1oZBVsobmZRp2S-gZvqv4Wa7tqiJsMaof", slides: "1vSPBlhE5P3zMKN8wBe4CKMkq2GknTHAp" },
          [
            { name: "Nguyễn Anh Khoa", school: ptnk },
            { name: "Nguyễn Minh Khôi", school: "Trường THPT Nguyễn Thị Minh Khai, TPHCM" },
            { name: "Nguyễn Thuý Nam Trân", school: ptnk },
            { name: "Nguyễn Ngọc Khang", school: "Trường THPT Chuyên Lê Quý Đôn, Bà Rịa-Vũng Tàu" },
          ],
          { reportTitle: "Mô hình luồng chuẩn hóa" },
        ),
      ],
    },
  ],
};

export default camp;
