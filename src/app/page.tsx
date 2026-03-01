import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import AboutPreview from "@/components/home/AboutPreview";
import AwardsStrip from "@/components/home/AwardsStrip";
import CTASection from "@/components/home/CTASection";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title:
    "Plastic & Reconstructive Surgeon in Hyderabad | Dr. Divya Sai Narsingam",
  description:
    "Dr. Divya Sai Narsingam – MCh Plastic Surgery. Consultant at CARE Hospitals Gachibowli, Hyderabad. 14+ years experience in reconstructive and cosmetic surgery.",
  alternates: {
    canonical: "https://www.drdivyanarsingam.com",
  },
};

const physicianJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Physician", "LocalBusiness", "MedicalBusiness"],
  name: "Dr. Divya Sai Narsingam",
  jobTitle: "Consultant Plastic & Reconstructive Surgeon",
  description:
    "Board-certified Plastic and Reconstructive Surgeon with over 14 years of clinical experience. Consultant at CARE Hospitals, Gachibowli, Hyderabad.",
  medicalSpecialty: "Plastic and Reconstructive Surgery",
  url: "https://www.drdivyanarsingam.com",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Room No. 205, OPD Building, Old Mumbai Highway, Jayabheri Pine Valley",
    addressLocality: "Gachibowli",
    addressRegion: "Telangana",
    postalCode: "500032",
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
      <CTASection />
    </>
  );
}
