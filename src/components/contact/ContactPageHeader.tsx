"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function ContactPageHeader() {
  const { content } = useSiteContent();
  const contactPage = content.contactPage;
  
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
        Appointments
      </p>
      <h1
        className="text-4xl md:text-5xl font-medium text-(--foreground) max-w-2xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {contactPage.heading}
      </h1>
      <p className="mt-4 text-base text-(--foreground-muted) max-w-xl">
        {contactPage.subheading}
      </p>
    </>
  );
}
