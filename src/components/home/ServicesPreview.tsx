"use client";

import { reconstructiveServices, cosmeticServices } from "@/lib/doctor-data";
import ServiceCard from "@/components/ui/ServiceCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Link from "next/link";

export default function ServicesPreview() {
  const previewReconstructive = reconstructiveServices.slice(0, 4);
  const previewCosmetic = cosmeticServices.slice(0, 3);

  return (
    <section
      className="section-padding bg-[var(--bg-surface)] border-y border-[var(--border)]"
      aria-label="Services"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Areas of Practice"
          title="Reconstructive & Cosmetic Surgery"
          subtitle="Dr. Narsingam offers a full spectrum of plastic and reconstructive procedures — each performed with meticulous attention to anatomy, function, and natural outcomes."
        />

        <div className="mb-12">
          <h3
            className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-6"
          >
            Reconstructive Surgery
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {previewReconstructive.map((svc, i) => (
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
        </div>

        <div className="mb-10">
          <h3
            className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-blue)] mb-6"
          >
            Cosmetic Surgery
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewCosmetic.map((svc, i) => (
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
        </div>

        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border)] text-sm text-[var(--foreground-muted)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold-light)] transition-all duration-200"
          >
            View all services
          </Link>
        </div>
      </div>
    </section>
  );
}
