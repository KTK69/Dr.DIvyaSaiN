import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import JsonLd from "@/components/seo/JsonLd";
import TestimonialsPageHeader from "@/components/testimonials/TestimonialsPageHeader";
import TestimonialsContent from "@/components/testimonials/TestimonialsContent";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("testimonials");
}

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Testimonials & Video Reviews",
  url: "https://drdivyaplasticsurgeon.com/reviews",
  description:
    "Patient testimonials and video reviews for reconstructive and cosmetic plastic surgery in Hyderabad.",
  about: [
    "Breast Reconstruction",
    "Onco Reconstruction",
    "Microvascular Surgery",
    "Tummy Tuck",
    "Gynecomastia Reduction",
    "Facial Plastic Surgery",
  ],
};

export default function TestimonialsPage() {
  return (
    <PageWrapper>
      <JsonLd data={pageJsonLd} />

      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsPageHeader />
        </div>
      </div>

      <TestimonialsContent />
    </PageWrapper>
  );
}

