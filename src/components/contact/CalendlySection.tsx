"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function CalendlySection() {
  const { content } = useSiteContent();
  const contactPage = content.contactPage;
  
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-7 md:px-8 pt-7 pb-5 border-b border-(--border) flex flex-col sm:flex-row sm:items-center gap-4">
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
          style={{ background: "var(--accent-gold)", color: "var(--background)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div>
          <h2
            id="calendly-heading"
            className="text-xl md:text-2xl font-medium text-(--foreground)"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {contactPage.calendarHeading}
          </h2>
          <p className="text-sm md:text-base text-(--foreground-muted) mt-1 leading-relaxed">
            {contactPage.calendarSubheading}
          </p>
        </div>
      </div>
      <iframe
        src="https://calendly.com/drdivyaplasticsurgeon/30min?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0d1117&text_color=e2e8f0&primary_color=b8972a"
        width="100%"
        height="760"
        frameBorder="0"
        title="Book appointment with Dr. Divya Sai Narsingam"
        loading="lazy"
        className="w-full block"
        style={{ minHeight: "760px" }}
      />
    </div>
  );
}
