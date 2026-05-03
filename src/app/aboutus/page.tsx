import type { Metadata } from "next";
import AboutPage from "@/app/about/page";
import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildStaticPageMetadata(
  "About Dr. Divya Sai Narsingam | Plastic Surgeon Hyderabad",
  "Learn about Dr. Divya Sai Narsingam – qualifications, experience, and patient-centered reconstructive and cosmetic surgery practice in Hyderabad.",
  "/aboutus",
);

export default function AboutUsPage() {
  return <AboutPage />;
}