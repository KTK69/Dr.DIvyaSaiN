import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/ui/PageWrapper";
import { reconstructiveServices } from "@/lib/doctor-data";
import ServiceDetailClient, { type LegacyService } from "@/components/services/ServiceDetailClient";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildServiceJsonLd,
  buildServiceMetadata,
} from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return reconstructiveServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = reconstructiveServices.find((s) => s.slug === slug);
  if (!service) return {};
  return buildServiceMetadata(service, "reconstructive", slug);
}

export default async function ReconstructiveServicePage({ params }: Props) {
  const { slug } = await params;
  const service = reconstructiveServices.find((s) => s.slug === slug);
  if (!service) notFound();

  // related lists are generated client-side by ServiceDetailClient

  const serviceJsonLd = buildServiceJsonLd(service, "reconstructive", slug);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://drdivyaplasticsurgeon.com" },
    { name: "Services", url: "https://drdivyaplasticsurgeon.com/services" },
    { name: "Reconstructive Surgery", url: "https://drdivyaplasticsurgeon.com/services" },
    { name: service.name, url: `https://drdivyaplasticsurgeon.com/services/${slug}` },
  ]);
  const faqJsonLd = buildFaqJsonLd([
    {
      question: `Who is a good candidate for ${service.name}?`,
      answer: `Patients who need functional or form-restoring surgery after trauma, cancer treatment, or congenital concerns may benefit from ${service.name}. A consultation is required to confirm suitability.`,
    },
    {
      question: `How long is recovery after ${service.name}?`,
      answer: `Recovery depends on the procedure complexity, wound healing, and overall health. Dr. Divya Sai Narsingam discusses expected downtime and follow-up during consultation.`,
    },
    {
      question: `Is ${service.name} performed at CARE Hospitals, Gachibowli?`,
      answer: `Yes. Reconstructive procedures are planned and performed in coordination with CARE Hospitals, Gachibowli, Hyderabad.`,
    },
  ]);

  return (
    <PageWrapper>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-xs text-(--foreground-subtle)">
              <li>
                <Link href="/" className="hover:text-(--foreground-muted)">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-(--foreground-muted)"
                >
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-(--accent-gold)">{service.name}</li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
            Reconstructive Surgery
          </p>
          <h1
            className="text-4xl md:text-5xl font-medium text-(--foreground) max-w-2xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {service.name}
          </h1>
          <p className="mt-4 text-base text-(--foreground-muted) max-w-xl">
            {service.shortDesc}
          </p>
        </div>
      </div>
      <ServiceDetailClient slug={slug} serverService={service as LegacyService} />
    </PageWrapper>
  );
}
