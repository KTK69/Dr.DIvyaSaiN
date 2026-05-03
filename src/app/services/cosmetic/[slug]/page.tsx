import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/ui/PageWrapper";
import { cosmeticServices } from "@/lib/doctor-data";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import ServiceDetailClient, { type LegacyService } from "@/components/services/ServiceDetailClient";
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
  return cosmeticServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = cosmeticServices.find((s) => s.slug === slug);
  if (!service) return {};
  return buildServiceMetadata(service, "cosmetic", slug);
}

export default async function CosmeticServicePage({ params }: Props) {
  const { slug } = await params;
  const service = cosmeticServices.find((s) => s.slug === slug);
  if (!service) notFound();

  // related handled client-side in ServiceDetailClient

  const serviceJsonLd = buildServiceJsonLd(service, "cosmetic", slug);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://drdivyaplasticsurgeon.com" },
    { name: "Services", url: "https://drdivyaplasticsurgeon.com/services" },
    { name: "Cosmetic Surgery", url: "https://drdivyaplasticsurgeon.com/services" },
    { name: service.name, url: `https://drdivyaplasticsurgeon.com/services/${slug}` },
  ]);
  const faqJsonLd = buildFaqJsonLd([
    {
      question: `Who is a good candidate for ${service.name}?`,
      answer: `Patients seeking aesthetic improvement or contour refinement after careful assessment may be candidates for ${service.name}. A consultation is required to confirm suitability.`,
    },
    {
      question: `How long is recovery after ${service.name}?`,
      answer: `Recovery varies by procedure and individual healing, but Dr. Divya Sai Narsingam explains the expected downtime and follow-up during consultation.`,
    },
    {
      question: `Is ${service.name} performed in Hyderabad?`,
      answer: `Yes. Cosmetic procedures are planned in coordination with CARE Hospitals, Gachibowli, Hyderabad.`,
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
                <Link href="/" className="hover:text-(--foreground-muted)">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services" className="hover:text-(--foreground-muted)">Services</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-(--accent-blue)">{service.name}</li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-blue) mb-3">Cosmetic Surgery</p>
          <h1 className="text-4xl md:text-5xl font-medium text-(--foreground) max-w-2xl" style={{ fontFamily: "var(--font-serif)" }}>{service.name}</h1>
          <p className="mt-4 text-base text-(--foreground-muted) max-w-xl">{service.shortDesc}</p>
        </div>
      </div>

      <ServiceDetailClient slug={slug} serverService={service as LegacyService} />
    </PageWrapper>
  );
}
