"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";
import { MapPin } from "lucide-react";

export default function LocationCard() {
  const { content } = useSiteContent();
  const contactPage = content.contactPage;
  
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={16} className="text-(--accent-gold)" />
        <h2
          className="text-base font-medium text-(--foreground)"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {contactPage.locationHeading}
        </h2>
      </div>
      <address className="not-italic text-sm text-(--foreground-muted) leading-relaxed">
        {contactPage.locationAddress || content.footer.contactLocation}
      </address>
    </div>
  );
}
