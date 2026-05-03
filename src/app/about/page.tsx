import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";
import AboutPageHeader from "@/components/about/AboutPageHeader";

export const metadata: Metadata = {
  title: "About Dr. Divya Sai Narsingam | Plastic Surgeon Hyderabad",
  description:
    "Learn about Dr. Divya Sai Narsingam – MCh Plastic Surgery, University Topper, Consultant at CARE Hospitals Gachibowli. 14+ years of reconstructive and cosmetic surgery experience in Hyderabad.",
  keywords: [
    "Dr Divya Sai Narsingam biography",
    "MCh Plastic Surgery Hyderabad",
    "CARE Hospitals plastic surgeon",
    "plastic surgeon Gachibowli",
  ],
  alternates: {
    canonical: "https://drdivyaplasticsurgeon.com/aboutus",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutPageHeader />
        </div>
      </div>

      {/* Dynamic about content (client) */}
      <AboutContent />
    </>
  );
}
