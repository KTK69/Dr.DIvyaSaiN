import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import AppointmentForm from "@/components/contact/AppointmentForm";
import { MapPin, Clock, Info } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import WhatsAppSupportCard from "@/components/contact/WhatsAppSupportCard";

export const metadata: Metadata = {
  title: "Book Appointment | Dr. Divya Sai Narsingam – CARE Hospitals Hyderabad",
  description:
    "Book a consultation with Dr. Divya Sai Narsingam at CARE Hospitals, Gachibowli, Hyderabad. Plastic & Reconstructive Surgeon – MCh (Plastic Surgery).",
  alternates: {
    canonical: "https://www.drdivyanarsingam.com/contact",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Dr. Divya Sai Narsingam – Plastic & Reconstructive Surgery",
  description:
    "Consultant Plastic & Reconstructive Surgeon at CARE Hospitals, Gachibowli, Hyderabad.",
  url: "https://www.drdivyanarsingam.com",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Room No. 205, OPD Building, Old Mumbai Highway, Jayabheri Pine Valley",
    addressLocality: "Gachibowli",
    addressRegion: "Telangana",
    postalCode: "500032",
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
          <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
            Appointments
          </p>
          <h1
            className="text-4xl md:text-5xl font-medium text-(--foreground) max-w-2xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Book a Consultation
          </h1>
          <p className="mt-4 text-base text-(--foreground-muted) max-w-xl">
            Pick a slot directly from the calendar below, or use the form to
            send a consultation request. Our team will confirm your appointment
            and send any pre-visit instructions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">

        {/* ── Calendly inline booking ──────────────────────────────────────── */}
        <section className="mb-16" aria-labelledby="calendly-heading">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-(--border) flex flex-col sm:flex-row sm:items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                style={{ background: "var(--accent-gold)", color: "var(--background)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <h2
                  id="calendly-heading"
                  className="text-base font-medium text-(--foreground)"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Choose an Available Slot
                </h2>
                <p className="text-xs text-(--foreground-muted) mt-0.5">
                  Instantly book your consultation — select a date &amp; time that works for you.
                </p>
              </div>
            </div>
            <iframe
              src="https://calendly.com/frg-venom45/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0d1117&text_color=e2e8f0&primary_color=b8972a"
              width="100%"
              height="700"
              frameBorder="0"
              title="Book appointment with Dr. Divya Sai Narsingam"
              loading="lazy"
              className="w-full block"
              style={{ minHeight: "700px" }}
            />
          </div>
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
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-(--accent-gold)" />
                <h2
                  className="text-base font-medium text-(--foreground)"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Location
                </h2>
              </div>
              <address className="not-italic text-sm text-(--foreground-muted) leading-relaxed">
                Room No. 205, OPD Building
                <br />
                CARE Hospital
                <br />
                Old Mumbai Highway
                <br />
                Jayabheri Pine Valley
                <br />
                Gachibowli
                <br />
                Hyderabad, Telangana – 500032
              </address>
            </div>

            {/* Map placeholder */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div
                className="aspect-4/3 bg-linear-to-br from-(--bg-card) to-(--bg-surface) flex flex-col items-center justify-center"
                aria-label="Map placeholder – CARE Hospitals Gachibowli"
                role="img"
              >
                <MapPin
                  size={32}
                  className="text-(--accent-gold) opacity-50 mb-2"
                />
                <p className="text-xs text-(--foreground-subtle) text-center px-6">
                  CARE Hospitals, Gachibowli
                  <br />
                  Hyderabad, Telangana
                </p>
              </div>
              <div className="px-6 py-4 border-t border-(--border)">
                <a
                  href="https://maps.google.com/?q=CARE+Hospitals+Gachibowli+Hyderabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-(--accent-gold-light) hover:underline"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-(--accent-gold)" />
                <h2
                  className="text-base font-medium text-(--foreground)"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  OPD Hours
                </h2>
              </div>
              <p className="text-sm text-(--foreground-muted) mb-1">
                Monday – Friday
              </p>
              <p className="text-sm text-(--foreground)">
                As per CARE Hospitals schedule
              </p>
              <p className="text-xs text-(--foreground-subtle) mt-3">
                For specific appointment slots, please submit the form and our
                team will confirm availability.
              </p>
            </div>

            {/* Note */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Info
                  size={16}
                  className="text-(--foreground-muted) mt-0.5 shrink-0"
                />
                <p className="text-xs text-(--foreground-muted) leading-relaxed">
                  For emergencies or urgent surgical referrals, please contact
                  CARE Hospitals directly or visit the emergency department.
                  Appointment requests via this form are for scheduled
                  outpatient consultations only.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
}
