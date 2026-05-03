import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import ServicesContent from "@/components/services/ServicesContent";

import JsonLd from "@/components/seo/JsonLd";
import ServicesPageHeader from "@/components/services/ServicesPageHeader";

export const metadata: Metadata = {
  title: "Plastic Surgery Services Hyderabad | Reconstructive & Cosmetic",
  description:
    "Comprehensive plastic and reconstructive surgery services by Dr. Divya Sai Narsingam at CARE Hospitals, Gachibowli, Hyderabad. Breast reconstruction, onco reconstruction, cosmetic procedures and more.",
  keywords: [
    "plastic surgery services Hyderabad",
    "breast reconstruction Hyderabad",
    "onco reconstruction Hyderabad",
    "cosmetic surgery Gachibowli",
    "microvascular surgery Hyderabad",
    "gynecomastia reduction Hyderabad",
    "tummy tuck Hyderabad",
    "facial plastic surgery Hyderabad",
  ],
  alternates: {
    canonical: "https://drdivyaplasticsurgeon.com/services",
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [],
};

export default function ServicesPage() {
  return (
    <PageWrapper>
      <JsonLd data={servicesJsonLd} />
      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesPageHeader />
        </div>
      </div>

      <ServicesContent />
    </PageWrapper>
  );
}

