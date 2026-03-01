import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import { reconstructiveServices, cosmeticServices } from "@/lib/doctor-data";
import Link from "next/link";

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
  ],
  alternates: {
    canonical: "https://www.drdivyanarsingam.com/services",
  },
};

export default function ServicesPage() {
  return (
    <PageWrapper>
      <div className="pt-28 pb-16 border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-3">
            Areas of Practice
          </p>
          <h1
            className="text-4xl md:text-5xl font-medium text-[var(--foreground)] max-w-2xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Surgical Services
          </h1>
          <p className="mt-4 text-base text-[var(--foreground-muted)] max-w-2xl">
            Dr. Narsingam offers a comprehensive range of reconstructive and
            cosmetic plastic surgery procedures — each tailored to the
            individual's anatomy, goals, and medical needs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        {/* Reconstructive */}
        <section className="mb-20" aria-labelledby="reconstructive-heading">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1 h-8 rounded-full bg-[var(--accent-gold)]" />
            <h2
              id="reconstructive-heading"
              className="text-2xl font-medium text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Reconstructive Surgery
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reconstructiveServices.map((svc, i) => (
              <ServiceCard
                key={svc.slug}
                name={svc.name}
                shortDesc={svc.shortDesc}
                href={`/services/reconstructive/${svc.slug}`}
                category="reconstructive"
                index={i}
              />
            ))}
          </div>
        </section>

        {/* Cosmetic */}
        <section aria-labelledby="cosmetic-heading">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1 h-8 rounded-full bg-[var(--accent-blue)]" />
            <h2
              id="cosmetic-heading"
              className="text-2xl font-medium text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Cosmetic Surgery
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cosmeticServices.map((svc, i) => (
              <ServiceCard
                key={svc.slug}
                name={svc.name}
                shortDesc={svc.shortDesc}
                href={`/services/cosmetic/${svc.slug}`}
                category="cosmetic"
                index={i}
              />
            ))}
          </div>
        </section>

        <div className="mt-16 pt-10 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--foreground-muted)] mb-4">
            Not sure which procedure is right for you?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-gold)] text-[var(--background)] text-sm font-medium hover:bg-[var(--accent-gold-light)] transition-colors duration-200"
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
