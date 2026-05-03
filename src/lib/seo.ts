import type { Metadata } from "next";
import type { cosmeticServices, reconstructiveServices } from "@/lib/doctor-data";
import type { Blog, Service } from "@/types/content";

export type ReconstructiveService = (typeof reconstructiveServices)[number];
export type CosmeticService = (typeof cosmeticServices)[number];
export type ServiceItem = ReconstructiveService | CosmeticService;
export type ServiceCategory = "reconstructive" | "cosmetic";

export const SITE_URL = "https://drdivyaplasticsurgeon.com";

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
      canonical: `${SITE_URL}/services/${slug}`,
    },
    openGraph: {
      type: "article",
      title: `${service.name} in Hyderabad | Dr. Divya Sai Narsingam`,
      description: `${service.shortDesc} ${label.toLowerCase()} by Dr. Divya Sai Narsingam at CARE Hospitals, Gachibowli, Hyderabad.`,
      url: `${SITE_URL}/services/${slug}`,
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
    url: `${SITE_URL}/services/${slug}`,
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

export function buildStaticPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const canonical = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: "Dr. Divya Sai Narsingam",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildBlogMetadata(blog: Blog): Metadata {
  const canonical = `${SITE_URL}/blog/${blog.slug}`;

  return {
    title: blog.meta_title,
    description: blog.meta_description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: blog.meta_title,
      description: blog.meta_description,
      url: canonical,
      images: [
        {
          url: blog.image,
          alt: blog.title,
        },
      ],
      siteName: "Dr. Divya Sai Narsingam",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.meta_title,
      description: blog.meta_description,
      images: [blog.image],
    },
  };
}

export function buildBlogJsonLd(blog: Blog) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.image,
    datePublished: blog.published_at,
    dateModified: blog.updated_at ?? blog.published_at,
    mainEntityOfPage: `${SITE_URL}/blog/${blog.slug}`,
    author: {
      "@type": "Person",
      name: "Dr. Divya Sai Narsingam",
    },
    publisher: {
      "@type": "Organization",
      name: "Dr. Divya Sai Narsingam",
    },
  };
}

export function buildUnifiedServiceMetadata(service: Service): Metadata {
  const canonical = `${SITE_URL}/services/${service.slug}`;

  return {
    title: service.meta_title,
    description: service.meta_description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: service.meta_title,
      description: service.meta_description,
      url: canonical,
      images: [
        {
          url: service.image,
          alt: service.name,
        },
      ],
      siteName: "Dr. Divya Sai Narsingam",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: service.meta_title,
      description: service.meta_description,
      images: [service.image],
    },
  };
}

export function buildUnifiedServiceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalProcedure", "Service"],
    name: service.name,
    description: service.content,
    url: `${SITE_URL}/services/${service.slug}`,
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
