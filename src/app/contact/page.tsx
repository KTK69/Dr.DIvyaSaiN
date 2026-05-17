import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import AppointmentForm from "@/components/contact/AppointmentForm";
import { MapPin } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import WhatsAppSupportCard from "@/components/contact/WhatsAppSupportCard";
import ContactPageHeader from "@/components/contact/ContactPageHeader";
import CalendlySection from "@/components/contact/CalendlySection";
import LocationCard from "@/components/contact/LocationCard";
import { getEditablePageMetadata } from "@/lib/page-metadata";
import { buildSiteIdentityJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("contact");
}

export default function ContactPage() {
  return (
    <PageWrapper>
      <JsonLd data={buildSiteIdentityJsonLd()} />

      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactPageHeader />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">

        {/* ── Calendly inline booking ──────────────────────────────────────── */}
        <section className="mb-16" aria-labelledby="calendly-heading">
          <CalendlySection />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <AppointmentForm />
          </div>

          {/* Info sidebar */}
          <aside className="space-y-6">
            <WhatsAppSupportCard />

            {/* Location */}
            <LocationCard />

            <div className="glass-card rounded-xl overflow-hidden">
              <div
                className="aspect-4/3 bg-linear-to-br from-(--bg-card) to-(--bg-surface) flex flex-col items-center justify-center"
                aria-label="Clinic location map"
              >
                <div className="text-center">
                  <MapPin size={28} className="mx-auto text-(--foreground-muted) mb-2" />
                  <p className="text-sm text-(--foreground-muted)">Clinic location</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
}

