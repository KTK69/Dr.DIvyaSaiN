import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import ServicesContent from "@/components/services/ServicesContent";

import JsonLd from "@/components/seo/JsonLd";
import ServicesPageHeader from "@/components/services/ServicesPageHeader";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("services");
}

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

