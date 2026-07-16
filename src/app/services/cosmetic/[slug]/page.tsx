import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/ui/PageWrapper";
import JsonLd from "@/components/seo/JsonLd";
import ServiceDetailClient from "@/components/services/ServiceDetailClient";
import { fetchServices } from "@/lib/api";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildUnifiedServiceJsonLd,
  buildUnifiedServiceMetadata,
} from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await fetchServices();
  return services
    .filter((service) => service.category === "cosmetic")
    .map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const services = await fetchServices();
  const service = services.find((entry) => entry.slug === slug && entry.category === "cosmetic");
  return service ? buildUnifiedServiceMetadata(service) : {};
}

export default async function CosmeticServicePage({ params }: Props) {
  const { slug } = await params;
  const services = await fetchServices();
  const service = services.find((entry) => entry.slug === slug && entry.category === "cosmetic");
  if (!service) notFound();

  const serviceJsonLd = buildUnifiedServiceJsonLd(service);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://drdivyaplasticsurgeon.com" },
    { name: "Services", url: "https://drdivyaplasticsurgeon.com/services" },
    { name: "Cosmetic Surgery", url: "https://drdivyaplasticsurgeon.com/services" },
    { name: service.name, url: `https://drdivyaplasticsurgeon.com/services/cosmetic/${slug}` },
  ]);
  const faqJsonLd = buildFaqJsonLd(
    (service.faq ?? []).map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

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
          <p className="mt-4 text-base text-(--foreground-muted) max-w-xl">{service.summary}</p>
        </div>
      </div>

      <ServiceDetailClient slug={slug} serverService={service} />
    </PageWrapper>
  );
}
