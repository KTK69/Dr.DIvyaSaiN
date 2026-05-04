import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import JsonLd from "@/components/seo/JsonLd";
import TestimonialsPageHeader from "@/components/testimonials/TestimonialsPageHeader";
import TestimonialsContent from "@/components/testimonials/TestimonialsContent";

export const metadata: Metadata = {
  title: "Testimonials & Video Reviews | Dr. Divya Sai Narsingam",
  description:
    "Read patient testimonials and watch video reviews for reconstructive and cosmetic plastic surgery with Dr. Divya Sai Narsingam at CARE Hospitals, Hyderabad.",
  keywords: [
    "plastic surgery testimonials Hyderabad",
    "video testimonials plastic surgeon",
    "breast reconstruction testimonials",
    "gynecomastia surgery reviews",
    "tummy tuck reviews Hyderabad",
    "onco reconstruction patient stories",
    "microvascular surgery outcomes",
    "facial plastic surgery reviews",
    "Dr Divya Sai Narsingam testimonials",
  ],
  alternates: {
    canonical: "https://drdivyaplasticsurgeon.com/reviews",
  },
};

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

