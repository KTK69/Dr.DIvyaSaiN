import type { Metadata } from "next";
import TestimonialsPageContent from "@/components/testimonials/TestimonialsPageContent";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("reviews");
}

export default function ReviewsPage() {
  return <TestimonialsPageContent />;
}
