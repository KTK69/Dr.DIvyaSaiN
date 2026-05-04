import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import AboutPreview from "@/components/home/AboutPreview";
import AwardsStrip from "@/components/home/AwardsStrip";
import BeforeAfterGallery from "@/components/home/BeforeAfterGallery";
import CTASection from "@/components/home/CTASection";
import JsonLd from "@/components/seo/JsonLd";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("home");
}

const physicianJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Physician", "LocalBusiness", "MedicalBusiness"],
  name: "Dr. Divya Sai Narsingam",
  jobTitle: "Consultant Plastic & Reconstructive Surgeon",
  description:
    "Board-certified Plastic and Reconstructive Surgeon with over 14 years of clinical experience. Consultant at CARE Hospitals, Gachibowli, Hyderabad.",
  medicalSpecialty: "Plastic and Reconstructive Surgery",
  url: "https://drdivyaplasticsurgeon.com",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Room No. 20, 1st Floor, AIG Hospitals",
    addressLocality: "Banjara Hills",
    addressRegion: "Telangana",
    postalCode: "500034",
    addressCountry: "IN",
  },
  worksFor: {
    "@type": "Hospital",
    name: "CARE Hospitals",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Old Mumbai Highway, Jayabheri Pine Valley",
      addressLocality: "Gachibowli, Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500032",
      addressCountry: "IN",
    },
  },
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "MS Ramaiah Medical College, Bangalore",
    },
    {
      "@type": "EducationalOrganization",
      name: "Gandhi Medical College, Secunderabad",
    },
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "MCh (Plastic Surgery)",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "MS (General Surgery)",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "MBBS",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={physicianJsonLd} />
      <HeroSection />
      <AwardsStrip />
      <AboutPreview />
      <ServicesPreview />
      <BeforeAfterGallery />
      <CTASection />
    </>
  );
}
