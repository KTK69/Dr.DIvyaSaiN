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
    </div>
  );
}
