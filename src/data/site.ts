// Site-wide facts: the one source read by Nav, Footer, lien-he, the 404 page
// and ContactForm. Visible text stays in Vietnamese.

export interface Link {
  label: string;
  href: string;
  /** Points at a gap page (src/gap-pages/): Nav renders it as an inline content gap, dev only. */
  gap?: boolean;
}

export interface Dropdown {
  label: string;
  items: Link[];
}

export type NavItem = Link | Dropdown;

export interface FooterColumn {
  heading: string;
  links: Link[];
}

export const contact = {
  email: "contact@pimavn.com",
  emailHref: "mailto:contact@pimavn.com",
  address: "35 Văn Chung, Phường Tân Bình, Thành phố Hồ Chí Minh, Việt Nam",
} as const;

export const social = {
  facebook: { href: "https://www.facebook.com/pima.academy.vn", display: "fb.com/pima.academy.vn" },
  linkedin: { href: "https://www.linkedin.com/company/pima-academy" },
  youtube: { href: "https://www.youtube.com/@pimavn" },
} as const;

/** Anchor ids of the ve-chung-toi sections the "Về PiMA" footer links point at. */
export const aboutAnchors = {
  intro: "gioi-thieu",
  visionMission: "tam-nhin-su-menh",
  partners: "doi-tac-mang-luoi-nhan-tai",
  impact: "cac-tac-dong-tich-cuc",
  founderStory: "cau-chuyen-nha-sang-lap",
  futurePlans: "ke-hoach-tuong-lai",
} as const;

const about = (id: string) => `/ve-chung-toi/#${id}`;

/** Main nav, in old-site order; "Blog" replaced the old site's "Sự kiện & Blog" gap page (#110). */
export const navItems: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/ve-chung-toi/" },
  {
    label: "Chương trình",
    items: [
      { label: "Trại hè Toán học", href: "/trai-he-toan-hoc-pima/" },
      { label: "Khóa học", href: "/khoa-hoc/" },
    ],
  },
  { label: "Blog", href: "/blog/" },
  { label: "Liên hệ", href: "/lien-he/" },
];

/** Link columns of the site footer. Headings are lowercase as in the old markup (CSS uppercases them). */
export const footerColumns: FooterColumn[] = [
  {
    heading: "về pima",
    links: [
      { label: "Giới thiệu", href: about(aboutAnchors.intro) },
      { label: "Tầm nhìn & Sứ mệnh", href: about(aboutAnchors.visionMission) },
      { label: "Đối tác & Mạng lưới nhân tài", href: about(aboutAnchors.partners) },
      { label: "Các tác động tích cực", href: about(aboutAnchors.impact) },
      { label: "Câu chuyện của nhà sáng lập", href: about(aboutAnchors.founderStory) },
      { label: "Kế hoạch tương lai", href: about(aboutAnchors.futurePlans) },
    ],
  },
  {
    heading: "sản phẩm",
    links: [
      { label: "Khóa học", href: "/khoa-hoc/" },
      { label: "Trại hè toán học", href: "/trai-he-toan-hoc-pima/" },
    ],
  },
];

/**
 * Contact form backend: the web app URL (`https://script.google.com/macros/s/<id>/exec`) of
 * apps-script/Code.gs. Deployed in #30; if it is ever emptied, ContactForm shows its error state.
 * Keep the URL on the same line as the word "endpoint": `npm run shots` blocks it from that line.
 */
export const contactFormEndpoint = "https://script.google.com/macros/s/AKfycbwqii7LIdqEVjz7wZETZ-29TNgf2KAnwfBIYCXnZt7uu0aJEuKoKw2qrPZFWJBiV6Z7lQ/exec";
