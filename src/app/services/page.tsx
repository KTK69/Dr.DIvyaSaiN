import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import { reconstructiveServices, cosmeticServices } from "@/lib/doctor-data";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

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
    canonical: "https://www.drdivyanarsingam.com/services",
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [...reconstructiveServices, ...cosmeticServices].map((svc, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: svc.name,
    url: `https://www.drdivyanarsingam.com/services/${index < reconstructiveServices.length ? "reconstructive" : "cosmetic"}/${svc.slug}`,
  })),
};

export default function ServicesPage() {
  return (
    <PageWrapper>
      <JsonLd data={servicesJsonLd} />
      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
            Areas of Practice
          </p>
          <h1
            className="text-4xl md:text-5xl font-medium text-(--foreground) max-w-2xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Surgical Services
          </h1>
          <p className="mt-4 text-base text-(--foreground-muted) max-w-2xl">
            Dr. Narsingam offers a comprehensive range of reconstructive and
            cosmetic plastic surgery procedures — each tailored to the
            individual's anatomy, goals, and medical needs.
          </p>
          <p className="mt-3 text-sm text-(--foreground-subtle) max-w-2xl leading-relaxed">
            Explore the individual procedure pages below for deeper information,
            related concerns, and consultation guidance for each service.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        {/* Reconstructive */}
        <section className="mb-20" aria-labelledby="reconstructive-heading">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1 h-8 rounded-full bg-(--accent-gold)" />
            <h2
              id="reconstructive-heading"
              className="text-2xl font-medium text-(--foreground)"
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
            <span className="w-1 h-8 rounded-full bg-(--accent-blue)" />
            <h2
              id="cosmetic-heading"
              className="text-2xl font-medium text-(--foreground)"
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

        <div className="mt-16 pt-10 border-t border-(--border) text-center">
          <p className="text-sm text-(--foreground-muted) mb-4">
            Not sure which procedure is right for you?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-(--accent-gold) text-(--background) text-sm font-medium hover:bg-(--accent-gold-light) transition-colors duration-200"
          >
            Book a Consultation
          </Link>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
            {[
              ["Breast Reconstruction", "/services/reconstructive/breast-reconstruction"],
              ["Microvascular Surgery", "/services/reconstructive/microvascular-surgery"],
              ["Gynecomastia Reduction", "/services/cosmetic/gynecomastia-reduction"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="glass-card rounded-xl p-4 border border-(--border) hover:border-(--accent-gold) transition-colors"
              >
                <p className="text-sm font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
                  {label}
                </p>
                <p className="mt-1 text-xs text-(--foreground-subtle)">
                  Open service details
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
