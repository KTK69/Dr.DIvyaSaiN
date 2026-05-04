"use client";

import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { useSiteContent } from "@/components/site/SiteContentProvider";
import { ArrowRight, PlayCircle, Quote, Star } from "lucide-react";

function extractYouTubeId(url: string) {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  if (/^[A-Za-z0-9_-]{6,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function getYouTubeEmbedUrl(url?: string) {
  if (!url) {
    return null;
  }

  const id = extractYouTubeId(url);
  if (!id) {
    return null;
  }

  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
}

export default function TestimonialsContent() {
  const { content } = useSiteContent();
  const videoSection = content.testimonialsPage.video;
  const writtenSection = content.testimonialsPage.written;
  const testimonials = content.testimonials || [];
  const embedUrl = getYouTubeEmbedUrl(videoSection.youtubeUrl);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding space-y-20">
      <section aria-labelledby="video-testimonial-heading">
        <SectionHeading
          eyebrow={videoSection.eyebrow}
          title={videoSection.title}
          subtitle={videoSection.subtitle}
        />

        <div className="glass-card rounded-2xl overflow-hidden border border-(--border)">
          <div className="aspect-video bg-black relative">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={videoSection.videoTitle || "Video testimonial"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <p className="text-sm text-(--foreground-muted)">Video unavailable</p>
                <p className="mt-2 text-xs text-(--foreground-subtle)">
                  Add a YouTube URL in the admin panel to enable playback.
                </p>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-(--border)">
            <div className="flex items-start gap-3">
              <PlayCircle size={18} className="text-(--accent-gold) mt-0.5 shrink-0" />
              <div>
                <h2
                  className="text-lg font-medium text-(--foreground)"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {videoSection.videoTitle}
                </h2>
                <p className="mt-2 text-sm text-(--foreground-muted) leading-relaxed">
                  {videoSection.videoNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="written-testimonials-heading">
        <SectionHeading
          eyebrow={writtenSection.eyebrow}
          title={writtenSection.title}
          subtitle={writtenSection.subtitle}
        />

        {testimonials.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {testimonials.map((item, index) => (
              <article
                key={item.id || `${item.patient_name}-${item.procedure}-${index}`}
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
                    {item.patient_name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-(--foreground-subtle)">
                    {item.procedure}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-(--foreground-muted)">No testimonials added yet.</p>
        )}
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
              Patient stories should only be published after consent is obtained.
              Video and written testimonials can be added here once approved and
              verified for clinical and ethical compliance.
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
  );
}
