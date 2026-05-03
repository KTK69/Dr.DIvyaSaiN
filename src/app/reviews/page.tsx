import type { Metadata } from "next";
import TestimonialsPage from "@/app/testimonials/page";
import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildStaticPageMetadata(
  "Patient Reviews & Testimonials | Dr. Divya Sai Narsingam",
  "Read patient reviews for reconstructive and cosmetic procedures by Dr. Divya Sai Narsingam at CARE Hospitals, Hyderabad.",
  "/reviews",
);

export default function ReviewsPage() {
  return <TestimonialsPage />;
}