"use client";

import { useSiteContent } from "@/components/site/SiteContentProvider";
import { MapPin } from "lucide-react";

function formatLocation(value: string) {
  return value.replace(/\s*\/\s*/g, "\n");
}

export default function LocationCard() {
  const { content } = useSiteContent();
  const contactPage = content.contactPage;
  const locationAddress =
    contactPage.locationAddress ||
    "Room No. 20, 1st Floor, AIG Hospitals, Banjara Hills, Hyderabad – 500034\nRoom No. 212, Aura Aesthetics & CARE Hospitals, Gachibowli, Hyderabad";
  const addressLines = locationAddress
    .replace(/\s*\/\s*/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const aigAddress =
    addressLines.find((line) => line.toLowerCase().includes("aig")) ||
    "Room No. 20, 1st Floor, AIG Hospitals, Banjara Hills, Hyderabad – 500034";
  const careAddress =
    addressLines.find((line) => line.toLowerCase().includes("care")) ||
    "Room No. 212, Aura Aesthetics & CARE Hospitals, Gachibowli, Hyderabad";
  
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
      <address className="not-italic space-y-4 text-sm text-(--foreground-muted) leading-7">
        <div>
          <p className="mb-1 font-semibold text-(--foreground)">AIG Hospitals, Banjara Hills</p>
          <p>{formatLocation(aigAddress)}</p>
        </div>
        <div>
          <p className="mb-1 font-semibold text-(--foreground)">Aura Aesthetics &amp; CARE Hospitals, Gachibowli</p>
          <p>{formatLocation(careAddress)}</p>
        </div>
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
      <div className="mt-4 flex flex-col gap-2">
        <a
          href="https://www.google.com/maps/search/?api=1&query=AIG+Hospitals+Banjara+Hills+Hyderabad"
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-sm text-(--accent-gold) hover:text-(--foreground) transition-colors"
        >
          Directions to AIG Hospitals
        </a>
        <a
          href="https://www.google.com/maps/search/?api=1&query=CARE+Hospitals+Gachibowli+Hyderabad"
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-sm text-(--accent-gold) hover:text-(--foreground) transition-colors"
        >
          Directions to CARE Hospitals
        </a>
      </div>
    </div>
  );
}
