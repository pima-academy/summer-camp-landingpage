// Slides of the `Testimonials` section, in the old site's order.
import type { ImageMetadata } from "astro";
import avatar2 from "../assets/images/artboard-2-4x.avif";
import avatar3 from "../assets/images/artboard-3-4x.avif";
import avatar4 from "../assets/images/artboard-4-4x.avif";
import avatar5 from "../assets/images/artboard-5-4x.avif";
import avatar6 from "../assets/images/artboard-6-4x.avif";
import avatar7 from "../assets/images/artboard-7-4x.avif";

export interface Testimonial {
  quote: string;
  name: string;
  /** Role lines (the camp year, then what they do now), one line each. */
  role: string[];
  avatar: ImageMetadata;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Qua việc học các kỹ năng như mô hình hóa một bài toán thực tế, làm việc nhóm và trình bày project, em cảm nhận rõ hơn về sự đa dạng, mật thiết của toán trong nhiều lĩnh vực khác nhau cũng như việc học Toán lý thuyết không phải là cách duy nhất để theo đuổi toán.",
    name: "Đinh Lâm Kiều Phương",
    role: ["Trại sinh PiMA 2016", "Kỹ sư Học máy, Nhật Bản"],
    avatar: avatar2,
  },
  {
    quote:
      "PiMA ảnh hưởng rất nhiều đến mình về quyết định chọn ngành học. Mình được mentor truyền cảm hứng rất nhiều về việc học toán trong trại và qua project nhóm mình làm. Đó cũng là động lực giúp mình mong muốn học sâu hơn về Toán.",
    name: "Nguyễn Mạc Nam Trung",
    role: ["Trại sinh PiMA 2019", "Học viên thạc sĩ Toán học, ĐH Paris Cité, Pháp"],
    avatar: avatar5,
  },
  {
    quote:
      "Một trong những điều mình cực kì ấn tượng ở PiMA chính là sự gắn kết và tinh thần chia sẻ kiến thức, vì thế mình mong muốn được quay lại PiMA để được cùng xây dựng tinh thần ấy lan toả.",
    name: "Nguyễn Trung Nghĩa",
    role: ["Trại sinh PiMA 2017", "NCS tiến sĩ Toán học, ĐH Rutgers, Hoa Kỳ"],
    avatar: avatar3,
  },
  {
    quote:
      "Kỷ niệm đáng nhớ nhất là những office hour căng não, nơi mà mọi người tự do thể hiện suy nghĩ của mình về các bài toán, và em cũng được kết thêm nhiều bạn mới. Bên cạnh đó, những giờ bonding đến tận khuya cùng với BTC và trại sinh cũng rất vui nữa, em được chơi những trò mà đó giờ chắc chỉ mới được chơi lần đầu trong PiMA.",
    name: "Vòng Vĩnh Toàn",
    role: ["Trại sinh PiMA 2021", "SV năm ba ngành Khoa học Máy tính, Trường ĐH Khoa học tự nhiên, ĐHQG-HCM"],
    avatar: avatar6,
  },
  {
    quote:
      "PiMA thật sự là một trại hè đáng nhớ nhất trong cuộc đời mình, mặc dù kiến thức nhiều và khó nữa, nhưng các anh chị hướng dẫn rất tận tâm với in ra từng tập tài liệu cho bọn mình rất chu đáo.",
    name: "Võ Thục Khánh Huyền",
    role: ["Trại sinh PiMA 2018", "NCS tiến sĩ Khoa học Máy tính, Viện Max Planck, Đức"],
    avatar: avatar4,
  },
  {
    quote:
      "Tám ngày làm trại sinh tại PiMA là khoảng thời gian tuyệt vời nhất trong mùa hè của em. Em đã có những niềm vui, những buổi thức đêm ‘làm nghiên cứu’ ly kỳ hấp dẫn. Và PiMA cho em thấy rằng đây không chỉ là trại hè khoa học đơn thuần, mà còn là nơi giúp em tìm được thế mạnh của bản thân, làm quen với những người bạn, người anh, người chị rất giỏi. Em rất trân trọng những trải nghiệm và cơ hội có được tại đây.",
    name: "Hoàng Ngọc Dung",
    role: ["Trại sinh PiMA 2023", "SV năm hai ngành Hệ thống nhúng và IoT, Trường ĐH Sư phạm Kỹ thuật, TPHCM"],
    avatar: avatar7,
  },
];
