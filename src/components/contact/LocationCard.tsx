"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";
import { MapPin } from "lucide-react";

function formatLocation(value: string) {
  return value.replace(/\s*\/\s*/g, "\n");
}

export default function LocationCard() {
  const { content } = useSiteContent();
  const contactPage = content.contactPage;
  
  return (
    <div className="glass-card rounded-2xl p-7">
      <div className="flex items-center gap-3 mb-5">
        <MapPin size={18} className="text-(--accent-gold)" />
        <h2
          className="text-xl font-medium text-(--foreground)"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {contactPage.locationHeading}
        </h2>
      </div>
      <address className="not-italic text-base text-(--foreground-muted) leading-8 whitespace-pre-line">
        {formatLocation(contactPage.locationAddress || content.footer.contactLocation)}
      </address>
      <a
        href="tel:+919900135489"
        className="mt-4 inline-flex text-sm text-(--accent-gold) hover:text-(--foreground) transition-colors"
      >
        +91 99001 35489
      </a>
      <div className="mt-5 overflow-hidden rounded-xl border border-(--border)">
        <iframe
          title="AIG Hospitals and CARE Hospitals Hyderabad locations"
          src="https://www.google.com/maps?q=AIG%20Hospitals%20Banjara%20Hills%20Hyderabad&output=embed"
          className="h-52 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href="https://www.google.com/maps/search/?api=1&query=AIG+Hospitals+Banjara+Hills+Hyderabad"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex text-sm text-(--accent-gold) hover:text-(--foreground) transition-colors"
      >
        Get directions
      </a>
    </div>
  );
}
