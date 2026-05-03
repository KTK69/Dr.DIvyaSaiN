"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function AboutPageHeader() {
  const { content } = useSiteContent();
  const aboutPage = content.aboutPage;
  
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
        {aboutPage.pageDescription}
      </p>
      <h1
        className="text-4xl md:text-5xl font-medium text-(--foreground) max-w-2xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {aboutPage.heading}
      </h1>
      <p className="mt-3 text-base text-(--foreground-muted)">{aboutPage.qualifications}</p>
    </>
  );
}
