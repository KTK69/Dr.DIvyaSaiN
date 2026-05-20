"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function ContactPageHeader() {
  const { content } = useSiteContent();
  const contactPage = content.contactPage;
  
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-(--accent-gold) mb-4">
        Appointments
      </p>
      <h1
        className="text-5xl md:text-6xl font-medium text-(--foreground) max-w-3xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {contactPage.heading}
      </h1>
      <p className="mt-5 text-lg md:text-xl text-(--foreground-muted) max-w-2xl leading-relaxed">
        {contactPage.subheading}
      </p>
    </>
  );
}
