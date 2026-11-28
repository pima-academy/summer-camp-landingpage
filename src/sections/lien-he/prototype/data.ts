// PROTOTYPE (throwaway, #126): the Liên hệ page's content, shared by both variants. Facts come
// from site.ts only (email, address, social links); no phone number (map #118's Notes).
import { contact, social } from "../../../data/site";

export const page = {
  title: "Liên hệ với PiMA",
  lead: "Gửi email, nhắn tin qua Facebook hoặc để lại lời nhắn cho PiMA.",
};

export const email = { label: "Email", value: contact.email, href: contact.emailHref };

export const address = { label: "Địa chỉ", value: contact.address };

/** Facebook was listed twice on the old page (contact facts and social links): now once. */
export const channels = [
  { icon: "brand-facebook-filled", label: "Facebook", value: social.facebook.display, href: social.facebook.href },
  { icon: "brand-linkedin-filled", label: "LinkedIn", value: "PiMA Academy", href: social.linkedin.href },
  { icon: "brand-youtube-filled", label: "YouTube", value: "@pimavn", href: social.youtube.href },
] as const;

export const form = { title: "Gửi lời nhắn cho PiMA", note: "PiMA sẽ phản hồi bạn sớm nhất có thể." };
