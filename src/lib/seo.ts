import type { Metadata } from "next";
import type { cosmeticServices, reconstructiveServices } from "@/lib/doctor-data";

export type ReconstructiveService = (typeof reconstructiveServices)[number];
export type CosmeticService = (typeof cosmeticServices)[number];
export type ServiceItem = ReconstructiveService | CosmeticService;
export type ServiceCategory = "reconstructive" | "cosmetic";

const SITE_URL = "https://www.drdivyanarsingam.com";

function categoryLabel(category: ServiceCategory) {
  return category === "reconstructive" ? "Reconstructive Surgery" : "Cosmetic Surgery";
}

function categoryKeywords(category: ServiceCategory) {
  return category === "reconstructive"
    ? [
        "reconstructive surgeon Hyderabad",
        "plastic surgeon Gachibowli",
        "breast reconstruction Hyderabad",
        "onco reconstruction Hyderabad",
        "microvascular surgery Hyderabad",
        "hand surgery Hyderabad",
      ]
    : [
        "cosmetic surgeon Hyderabad",
        "plastic surgery Gachibowli",
        "breast augmentation Hyderabad",
        "breast reduction Hyderabad",
        "tummy tuck Hyderabad",
        "gynecomastia reduction Hyderabad",
      ];
}

export function buildServiceMetadata(
  service: ServiceItem,
  category: ServiceCategory,
  slug: string,
): Metadata {
  const label = categoryLabel(category);
  return {
    title: `${service.name} in Hyderabad | Dr. Divya Sai Narsingam`,
    description: `${service.shortDesc} ${label.toLowerCase()} by Dr. Divya Sai Narsingam at CARE Hospitals, Gachibowli, Hyderabad.`,
    keywords: [
      service.name,
      `${service.name} Hyderabad`,
      `${service.name} Gachibowli`,
      "Dr Divya Sai Narsingam",
      "CARE Hospitals Hyderabad",
      ...categoryKeywords(category),
    ],
    alternates: {
      canonical: `${SITE_URL}/services/${category}/${slug}`,
    },
    openGraph: {
      type: "article",
      title: `${service.name} in Hyderabad | Dr. Divya Sai Narsingam`,
      description: `${service.shortDesc} ${label.toLowerCase()} by Dr. Divya Sai Narsingam at CARE Hospitals, Gachibowli, Hyderabad.`,
      url: `${SITE_URL}/services/${category}/${slug}`,
      siteName: "Dr. Divya Sai Narsingam",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} in Hyderabad | Dr. Divya Sai Narsingam`,
      description: `${service.shortDesc} ${label.toLowerCase()} by Dr. Divya Sai Narsingam at CARE Hospitals, Gachibowli, Hyderabad.`,
    },
  };
}

export function buildServiceJsonLd(
  service: ServiceItem,
  category: ServiceCategory,
  slug: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalProcedure", "Service"],
    name: service.name,
    description: service.description,
    url: `${SITE_URL}/services/${category}/${slug}`,
    provider: {
      "@type": "Physician",
      name: "Dr. Divya Sai Narsingam",
      medicalSpecialty: "Plastic and Reconstructive Surgery",
    },
    areaServed: {
      "@type": "City",
      name: "Hyderabad",
    },
    availableAtOrFrom: {
      "@type": "Hospital",
      name: "CARE Hospitals, Gachibowli",
    },
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqJsonLd(
  questions: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
