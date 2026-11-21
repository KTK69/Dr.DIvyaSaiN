"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function TestimonialsPageHeader() {
  const { content } = useSiteContent();
  const testimonialsPage = content.testimonialsPage;
  
  return (
    <>
      <p className="mb-3 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-(--accent-gold) break-words sm:text-xs sm:tracking-widest">
        Patient Experiences
      </p>
      <h1
        className="max-w-3xl break-words text-3xl font-medium leading-tight text-(--foreground) sm:text-4xl md:text-5xl"
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
