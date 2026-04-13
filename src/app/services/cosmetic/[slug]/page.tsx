import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/ui/PageWrapper";
import { cosmeticServices, reconstructiveServices } from "@/lib/doctor-data";
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

  const related = cosmeticServices.filter((s) => s.slug !== slug).slice(0, 3);

  const serviceJsonLd = buildServiceJsonLd(service, "cosmetic", slug);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://www.drdivyanarsingam.com" },
    { name: "Services", url: "https://www.drdivyanarsingam.com/services" },
    { name: "Cosmetic Surgery", url: "https://www.drdivyanarsingam.com/services" },
    { name: service.name, url: `https://www.drdivyanarsingam.com/services/cosmetic/${slug}` },
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

      <div className="pt-28 pb-16 border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-xs text-[var(--foreground-subtle)]">
              <li>
                <Link href="/" className="hover:text-[var(--foreground-muted)]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-[var(--foreground-muted)]"
                >
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--accent-blue)]">{service.name}</li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-blue)] mb-3">
            Cosmetic Surgery
          </p>
          <h1
            className="text-4xl md:text-5xl font-medium text-[var(--foreground)] max-w-2xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {service.name}
          </h1>
          <p className="mt-4 text-base text-[var(--foreground-muted)] max-w-xl">
            {service.shortDesc}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section aria-labelledby="overview-heading">
              <h2
                id="overview-heading"
                className="text-2xl font-medium text-[var(--foreground)] mb-5"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Overview
              </h2>
              <p className="text-base text-[var(--foreground-muted)] leading-relaxed">
                {service.description}
              </p>
            </section>

            <section aria-labelledby="keypoints-heading">
              <h2
                id="keypoints-heading"
                className="text-2xl font-medium text-[var(--foreground)] mb-5"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                What this includes
              </h2>
              <ul className="space-y-3" role="list">
                {service.keyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle
                      size={16}
                      className="text-[var(--accent-blue)] mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-[var(--foreground-muted)] leading-relaxed">
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
                className="text-xl font-medium text-[var(--foreground)] mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Schedule a Consultation
              </h2>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-5">
                Dr. Narsingam believes every aesthetic concern deserves a
                thoughtful, unhurried consultation. She reviews your goals,
                examines your anatomy, and explains realistic outcomes before any
                procedure is recommended.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-gold)] text-[var(--background)] text-sm font-medium hover:bg-[var(--accent-gold-light)] transition-colors"
              >
                Book Consultation <ArrowRight size={15} />
              </Link>
            </section>

            <section className="glass-card rounded-xl p-8" aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="text-xl font-medium text-[var(--foreground)] mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Frequently asked questions
              </h2>
              <div className="space-y-4 text-sm text-[var(--foreground-muted)] leading-relaxed">
                <div>
                  <p className="font-medium text-[var(--foreground)] mb-1">
                    What happens at the first consultation?
                  </p>
                  <p>
                    The consultation includes a discussion of goals, medical
                    history, physical assessment, and a procedure-specific
                    recommendation.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)] mb-1">
                    Will the result look natural?
                  </p>
                  <p>
                    The surgical plan is tailored to the patient's anatomy and
                    expectations so the result remains balanced and natural.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)] mb-1">
                    How do I book a follow-up?
                  </p>
                  <p>
                    Follow-up can be arranged through the contact page or
                    WhatsApp support for quick coordination.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="glass-card rounded-xl p-6">
              <h3
                className="text-base font-medium text-[var(--foreground)] mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Your Surgeon
              </h3>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Dr. Divya Sai Narsingam
              </p>
              <p className="text-xs text-[var(--accent-gold-light)] mt-0.5">
                MCh (Plastic Surgery)
              </p>
              <p className="text-xs text-[var(--foreground-muted)] mt-3 leading-relaxed">
                Consultant at CARE Hospitals, Gachibowli, Hyderabad. 14+ years
                of reconstructive and aesthetic surgery experience.
              </p>
              <Link
                href="/about"
                className="mt-4 inline-flex text-xs text-[var(--foreground-subtle)] hover:text-[var(--accent-gold-light)] transition-colors"
              >
                Full biography →
              </Link>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-4">
                Related Procedures
              </h3>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/services/cosmetic/${r.slug}`}
                      className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1"
                    >
                      <ArrowRight size={11} /> {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--foreground-subtle)] mb-2">
                  Reconstructive services:
                </p>
                {reconstructiveServices.slice(0, 3).map((r) => (
                  <Link
                    key={r.slug}
                    href={`/services/reconstructive/${r.slug}`}
                    className="block text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors py-1"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-3">
                Location
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
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
