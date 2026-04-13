import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/ui/PageWrapper";
import { reconstructiveServices, cosmeticServices } from "@/lib/doctor-data";
import { CheckCircle, ArrowRight } from "lucide-react";
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

  const related = reconstructiveServices
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  const serviceJsonLd = buildServiceJsonLd(service, "reconstructive", slug);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://www.drdivyanarsingam.com" },
    { name: "Services", url: "https://www.drdivyanarsingam.com/services" },
    { name: "Reconstructive Surgery", url: "https://www.drdivyanarsingam.com/services" },
    { name: service.name, url: `https://www.drdivyanarsingam.com/services/reconstructive/${slug}` },
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            <section aria-labelledby="overview-heading">
              <h2
                id="overview-heading"
                className="text-2xl font-medium text-(--foreground) mb-5"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Overview
              </h2>
              <p className="text-base text-(--foreground-muted) leading-relaxed">
                {service.description}
              </p>
            </section>

            <section aria-labelledby="keypoints-heading">
              <h2
                id="keypoints-heading"
                className="text-2xl font-medium text-(--foreground) mb-5"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                What this includes
              </h2>
              <ul className="space-y-3" role="list">
                {service.keyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle
                      size={16}
                      className="text-(--accent-gold) mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-(--foreground-muted) leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="glass-card rounded-xl p-8"
              aria-labelledby="consultation-heading"
            >
              <h2
                id="consultation-heading"
                className="text-xl font-medium text-(--foreground) mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Schedule a Consultation
              </h2>
              <p className="text-sm text-(--foreground-muted) leading-relaxed mb-5">
                Every surgical plan at CARE Hospitals begins with a thorough
                consultation. Dr. Narsingam takes time to understand your
                condition, review your imaging, and explain all available
                options — before any decision is made.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-(--accent-gold) text-(--background) text-sm font-medium hover:bg-(--accent-gold-light) transition-colors"
              >
                Book Consultation <ArrowRight size={15} />
              </Link>
            </section>

            <section className="glass-card rounded-xl p-8" aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="text-xl font-medium text-(--foreground) mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Frequently asked questions
              </h2>
              <div className="space-y-4 text-sm text-(--foreground-muted) leading-relaxed">
                <div>
                  <p className="font-medium text-(--foreground) mb-1">
                    What happens at the first consultation?
                  </p>
                  <p>
                    The consultation includes history taking, examination,
                    discussion of treatment goals, and a plan tailored to your
                    condition.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-(--foreground) mb-1">
                    Can I see similar cases before surgery?
                  </p>
                  <p>
                    The team can discuss typical outcomes and expected recovery
                    patterns for similar reconstructive cases during the visit.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-(--foreground) mb-1">
                    Do I need a referral?
                  </p>
                  <p>
                    A referral is helpful in complex cases, but you may also
                    book directly through the contact page.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="glass-card rounded-xl p-6">
              <h3
                className="text-base font-medium text-(--foreground) mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Your Surgeon
              </h3>
              <p className="text-sm font-medium text-(--foreground)">
                Dr. Divya Sai Narsingam
              </p>
              <p className="text-xs text-(--accent-gold-light) mt-0.5">
                MCh (Plastic Surgery)
              </p>
              <p className="text-xs text-(--foreground-muted) mt-3 leading-relaxed">
                Consultant at CARE Hospitals, Gachibowli, Hyderabad. 14+ years
                of reconstructive and aesthetic surgery experience.
              </p>
              <Link
                href="/about"
                className="mt-4 inline-flex text-xs text-(--foreground-subtle) hover:text-(--accent-gold-light) transition-colors"
              >
                Full biography →
              </Link>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3
                className="text-xs font-semibold uppercase tracking-widest text-(--foreground-muted) mb-4"
              >
                Related Procedures
              </h3>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/services/reconstructive/${r.slug}`}
                      className="text-sm text-(--foreground-muted) hover:text-(--foreground) transition-colors flex items-center gap-1"
                    >
                      <ArrowRight size={11} /> {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3
                className="text-xs font-semibold uppercase tracking-widest text-(--foreground-muted) mb-3"
              >
                Location
              </h3>
              <p className="text-sm text-(--foreground-muted) leading-relaxed">
                Room No. 205, OPD Building,
                <br />
                CARE Hospital, Old Mumbai Highway,
                <br />
                Gachibowli, Hyderabad – 500032
              </p>
            </div>
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
}
