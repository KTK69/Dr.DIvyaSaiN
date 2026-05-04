import type { Metadata } from "next";
import TestimonialsPage from "@/app/testimonials/page";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("reviews");
}

export default function ReviewsPage() {
  return <TestimonialsPage />;
}
