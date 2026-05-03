"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function ServicesPageHeader() {
  const { content } = useSiteContent();
  const servicesPage = content.servicesPage;
  
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
        Areas of Practice
      </p>
      <h1
        className="text-4xl md:text-5xl font-medium text-(--foreground) max-w-2xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {servicesPage.heading}
      </h1>
      <p className="mt-4 text-base text-(--foreground-muted) max-w-2xl">
        {servicesPage.subheading}
      </p>
    </>
  );
}
