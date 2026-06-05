import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/ui/PageWrapper";
import JsonLd from "@/components/seo/JsonLd";
import { fetchServiceBySlug, fetchServices } from "@/lib/api";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildUnifiedServiceJsonLd,
  buildUnifiedServiceMetadata,
  SITE_URL,
} from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const services = await fetchServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return buildUnifiedServiceMetadata(service);
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const allServices = await fetchServices();
  const related = allServices.filter((item) => item.slug !== slug).slice(0, 3);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: service.name, url: `${SITE_URL}/services/${service.slug}` },
  ]);

  return (
    <PageWrapper>
      <JsonLd data={buildUnifiedServiceJsonLd(service)} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={buildFaqJsonLd(service.faq)} />

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
                <Link href="/services" className="hover:text-(--foreground-muted)">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-(--accent-gold)">{service.name}</li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
            {service.category === "reconstructive"
              ? "Reconstructive Surgery"
              : "Cosmetic Surgery"}
          </p>
          <h1
            className="text-4xl md:text-5xl font-medium text-(--foreground) max-w-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {service.name}
          </h1>
          <p className="mt-4 text-base text-(--foreground-muted) max-w-2xl">
            {service.summary}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-(--border) mb-8">
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            <p className="text-base leading-relaxed text-(--foreground-muted) mb-8">
              {service.content}
            </p>

            <h2
              className="text-2xl font-medium text-(--foreground) mb-5"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Key treatment highlights
            </h2>
            <ul className="space-y-4 mb-12">
              {service.key_points.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle
                    size={18}
                    className="text-(--accent-gold) mt-0.5 shrink-0"
                  />
                  <span className="text-sm leading-relaxed text-(--foreground-muted)">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <h2
              className="text-2xl font-medium text-(--foreground) mb-5"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {service.faq.map((item) => (
                <details
                  key={item.question}
                  className="glass-card rounded-xl p-5 border border-(--border)"
                >
                  <summary className="cursor-pointer text-sm font-medium text-(--foreground)">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm text-(--foreground-muted) leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <h3
              className="text-lg font-medium text-(--foreground)"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Related services
            </h3>

            {related.map((item) => (
              <Link
                key={item.id}
                href={`/services/${item.slug}`}
                className="glass-card rounded-xl p-5 border border-(--border) block hover:border-(--accent-gold) transition-colors"
              >
                <h4 className="text-sm font-medium text-(--foreground)">
                  {item.name}
                </h4>
                <p className="text-xs text-(--foreground-muted) mt-2 leading-relaxed">
                  {item.summary}
                </p>
              </Link>
            ))}

            <Link
              href="/contactus"
              className="inline-flex items-center gap-2 rounded-lg bg-(--accent-gold) px-5 py-3 text-sm font-medium text-(--background) hover:bg-(--accent-gold-light) transition-colors"
            >
              Book consultation <ArrowRight size={15} />
            </Link>
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
}