"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function ExperiencePageHeader() {
  const { content } = useSiteContent();
  const experiencePage = content.experiencePage;
  
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
        Academic & Professional Record
      </p>
      <h1 className="text-4xl md:text-5xl font-medium text-(--foreground) max-w-2xl" style={{ fontFamily: "var(--font-serif)" }}>
        {experiencePage.heading}
      </h1>
      <p className="mt-4 text-base text-(--foreground-muted) max-w-xl">{experiencePage.summary}</p>
    </>
  );
}
