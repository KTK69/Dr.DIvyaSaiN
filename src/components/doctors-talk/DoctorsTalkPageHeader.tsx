"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function DoctorsTalkPageHeader() {
  const { content } = useSiteContent();
  const doctorTalkPage = content.doctorTalkPage;
  
  return (
    <>
      <p className="mb-3 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-(--accent-gold) break-words sm:text-xs sm:tracking-widest">
        Education & Insights
      </p>
      <h1
        className="max-w-2xl break-words text-3xl font-medium leading-tight text-(--foreground) sm:text-4xl md:text-5xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {doctorTalkPage.heading}
      </h1>
      <p className="mt-4 text-base text-(--foreground-muted) max-w-xl">
        {doctorTalkPage.subheading}
      </p>
    </>
  );
}
