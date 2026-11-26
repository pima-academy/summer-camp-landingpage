// Slides of the SummerCamp section's photo slider, in old-site order.
import type { ImageMetadata } from "astro";
import traiHe1 from "../assets/images/trai-he-pima-1.avif";
import traiHe2 from "../assets/images/trai-he-pima-2.avif";
import traiHe3 from "../assets/images/trai-he-pima-3.avif";
import traiHe5 from "../assets/images/trai-he-pima-5.avif";
import traiHe6 from "../assets/images/trai-he-pima-6.avif";
import traiHe8 from "../assets/images/trai-he-pima-8.avif";

export interface SummerCampPhoto {
  image: ImageMetadata;
  alt: string;
}

export const summerCampPhotos: SummerCampPhoto[] = [
  { image: traiHe6, alt: "Diễn giả cầm micro trình bày trước màn chiếu tại trại hè PiMA" },
  { image: traiHe5, alt: "Trại sinh chăm chú nghe giảng trong lớp học" },
  { image: traiHe3, alt: "Một trại sinh đứng cạnh standee PiMA" },
  { image: traiHe1, alt: "Ban tổ chức trên sân khấu buổi khai mạc PiMA Summer Camp 2023" },
  { image: traiHe8, alt: "Ảnh tập thể trại sinh PiMA Research Summer Camp 2019" },
  { image: traiHe2, alt: "Trại sinh trình bày về sigmoid neuron trên màn chiếu" },
];
