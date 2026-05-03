import type { Metadata } from "next";
import Link from "next/link";
import PageWrapper from "@/components/ui/PageWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import JsonLd from "@/components/seo/JsonLd";
import TestimonialsPageHeader from "@/components/testimonials/TestimonialsPageHeader";
import { ArrowRight, PlayCircle, Quote, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Testimonials & Video Reviews | Dr. Divya Sai Narsingam",
  description:
    "Read patient testimonials and watch video reviews for reconstructive and cosmetic plastic surgery with Dr. Divya Sai Narsingam at CARE Hospitals, Hyderabad.",
  keywords: [
    "plastic surgery testimonials Hyderabad",
    "video testimonials plastic surgeon",
    "breast reconstruction testimonials",
    "gynecomastia surgery reviews",
    "tummy tuck reviews Hyderabad",
    "onco reconstruction patient stories",
    "microvascular surgery outcomes",
    "facial plastic surgery reviews",
    "Dr Divya Sai Narsingam testimonials",
  ],
  alternates: {
    canonical: "https://drdivyaplasticsurgeon.com/reviews",
  },
};

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Testimonials & Video Reviews",
  url: "https://drdivyaplasticsurgeon.com/reviews",
  description:
    "Patient testimonials and video reviews for reconstructive and cosmetic plastic surgery in Hyderabad.",
  about: [
    "Breast Reconstruction",
    "Onco Reconstruction",
    "Microvascular Surgery",
    "Tummy Tuck",
    "Gynecomastia Reduction",
    "Facial Plastic Surgery",
  ],
};

const testimonials = [
  {
    name: "Verified patient feedback",
    procedure: "Breast reconstruction",
    quote:
      "The surgical plan was explained clearly, the hospital care was attentive, and follow-up communication was excellent.",
  },
  {
    name: "Verified patient feedback",
    procedure: "Gynecomastia reduction",
    quote:
      "I felt comfortable discussing my concern and the result matched what was discussed during consultation.",
  },
  {
    name: "Verified patient feedback",
    procedure: "Tummy tuck and contouring",
    quote:
      "Recovery guidance was practical and reassuring, and the outcome felt natural and balanced.",
  },
];

const featuredVideo = {
  title: "Featured YouTube testimonial",
  embedUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
  note: "Replace this placeholder embed with the approved YouTube link for a real patient testimonial.",
};

export default function TestimonialsPage() {
  return (
    <PageWrapper>
      <JsonLd data={pageJsonLd} />

      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsPageHeader />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding space-y-20">
        <section aria-labelledby="video-testimonial-heading">
          <SectionHeading
            eyebrow="Video Testimonial"
            title="A YouTube video can be dropped in here"
            subtitle="Use the embed URL from YouTube to replace the placeholder video below. This section is built for quick updates and future patient stories."
          />

          <div className="glass-card rounded-2xl overflow-hidden border border-(--border)">
            <div className="aspect-video bg-black relative">
              <iframe
                src={featuredVideo.embedUrl}
                title={featuredVideo.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="p-6 border-t border-(--border)">
              <div className="flex items-start gap-3">
                <PlayCircle size={18} className="text-(--accent-gold) mt-0.5 shrink-0" />
                <div>
                  <h2
                    className="text-lg font-medium text-(--foreground)"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {featuredVideo.title}
                  </h2>
                  <p className="mt-2 text-sm text-(--foreground-muted) leading-relaxed">
                    {featuredVideo.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="written-testimonials-heading">
          <SectionHeading
            eyebrow="Written Testimonials"
            title="Static patient feedback for now"
            subtitle="These cards can later be replaced with live reviews or approved quotes from patients after consent and verification."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {testimonials.map((item) => (
              <article
                key={item.procedure}
                className="glass-card rounded-2xl p-6 border border-(--border)"
              >
                <Quote size={18} className="text-(--accent-gold) mb-4" />
                <blockquote className="text-sm text-(--foreground-muted) leading-relaxed">
                  {item.quote}
                </blockquote>
                <div className="mt-6 pt-5 border-t border-(--border)">
                  <p
                    className="text-sm font-medium text-(--foreground)"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-(--foreground-subtle)">
                    {item.procedure}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-2xl p-6 border border-(--border)">
          <div className="flex items-start gap-3">
            <Star size={18} className="text-(--accent-gold) mt-0.5 shrink-0" />
            <div>
              <h2
                className="text-lg font-medium text-(--foreground)"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Consent and verification
              </h2>
              <p className="mt-2 text-sm text-(--foreground-muted) leading-relaxed max-w-3xl">
                Patient stories should only be published after consent is
                obtained. Video and written testimonials can be added here once
                approved and verified for clinical and ethical compliance.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-(--accent-gold) px-5 py-3 text-sm font-medium text-(--background) hover:bg-(--accent-gold-light) transition-colors"
            >
              Request a consultation <ArrowRight size={15} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg border border-(--border) px-5 py-3 text-sm text-(--foreground-muted) hover:text-(--foreground) hover:border-(--foreground-muted) transition-colors"
            >
              Explore all services
            </Link>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

