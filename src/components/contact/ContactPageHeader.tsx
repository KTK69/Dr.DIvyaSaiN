"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function ContactPageHeader() {
  const { content } = useSiteContent();
  const contactPage = content.contactPage;
  
  return (
    <>
      <p className="mb-4 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-(--accent-gold) break-words sm:text-xs sm:tracking-[0.18em]">
        Appointments
      </p>
      <h1
        className="max-w-3xl break-words text-3xl font-medium leading-tight text-(--foreground) sm:text-5xl md:text-6xl"
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
