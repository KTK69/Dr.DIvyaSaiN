"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function TestimonialsPageHeader() {
  const { content } = useSiteContent();
  const testimonialsPage = content.testimonialsPage;
  
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
        Patient Experiences
      </p>
      <h1
        className="text-4xl md:text-5xl font-medium text-(--foreground) max-w-3xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {testimonialsPage.heading}
      </h1>
      <p className="mt-4 text-base text-(--foreground-muted) max-w-2xl leading-relaxed">
        {testimonialsPage.subheading}
      </p>
    </>
  );
}
