import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import ServicesContent from "@/components/services/ServicesContent";

import JsonLd from "@/components/seo/JsonLd";
import ServicesPageHeader from "@/components/services/ServicesPageHeader";
import { getEditablePageMetadata } from "@/lib/page-metadata";
import { fetchServices } from "@/lib/api";
import { buildServicesPageJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("services");
}

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <PageWrapper>
      <JsonLd data={buildServicesPageJsonLd(services)} />
      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesPageHeader />
        </div>
      </div>

      <ServicesContent />
    </PageWrapper>
  );
}

