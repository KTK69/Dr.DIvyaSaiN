import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import AppointmentForm from "@/components/contact/AppointmentForm";
import { MapPin, Clock, Info } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import WhatsAppSupportCard from "@/components/contact/WhatsAppSupportCard";
import ContactPageHeader from "@/components/contact/ContactPageHeader";
import CalendlySection from "@/components/contact/CalendlySection";
import LocationCard from "@/components/contact/LocationCard";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("contact");
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Dr. Divya Sai Narsingam – Plastic & Reconstructive Surgery",
  description:
    "Consultant Plastic & Reconstructive Surgeon at AIG Hospitals, Banjara Hills, Hyderabad.",
  url: "https://drdivyaplasticsurgeon.com",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Room No. 20, 1st Floor, AIG Hospitals",
    addressLocality: "Banjara Hills",
    addressRegion: "Telangana",
    postalCode: "500034",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "17.4403",
    longitude: "78.3489",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
};

export default function ContactPage() {
  return (
    <PageWrapper>
      <JsonLd data={localBusinessJsonLd} />

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

            {/* Map placeholder */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div
                className="aspect-4/3 bg-linear-to-br from-(--bg-card) to-(--bg-surface) flex flex-col items-center justify-center"
                aria-label="Map placeholder – AIG Hospitals Banjara Hills"
              >
                <div className="text-center">
                  <MapPin size={28} className="mx-auto text-(--foreground-muted) mb-2" />
                  <p className="text-sm text-(--foreground-muted)">Location Map</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
}

