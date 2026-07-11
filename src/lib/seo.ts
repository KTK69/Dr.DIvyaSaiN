import type { Metadata } from "next";
import type { cosmeticServices, reconstructiveServices } from "@/lib/doctor-data";
import type { Blog, Service } from "@/types/content";
import type { PageSeoEntry } from "@/lib/site-content";
import { getBlogRouteSlug } from "@/lib/blog-links";
import { contactInfo, doctor, education } from "@/lib/doctor-data";

export type ReconstructiveService = (typeof reconstructiveServices)[number];
export type CosmeticService = (typeof cosmeticServices)[number];
export type ServiceItem = ReconstructiveService | CosmeticService;
export type ServiceCategory = "reconstructive" | "cosmetic";

export const SITE_URL = "https://drdivyaplasticsurgeon.com";
const SITE_LOGO_URL = `${SITE_URL}/images/img/Dr%20Divya%20Logo%20Circle.png`;
const SITE_IMAGE_URL = `${SITE_URL}/images/img/DR%20Divya.jpeg`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const CLINIC_ID = `${SITE_URL}/#clinic`;
const PHYSICIAN_ID = `${SITE_URL}/#physician`;

const SITE_NAME_SUFFIX = "| Dr. Divya Sai Narsingam";
const DEFAULT_SERVICE_IMAGE = "/images/img/about.jpeg";

/* -------------------------------------------------------------------------- */
/*  Utility helpers                                                           */
/* -------------------------------------------------------------------------- */

function categoryLabel(category: ServiceCategory) {
  return category === "reconstructive" ? "Reconstructive Surgery" : "Cosmetic Surgery";
}

function uniqueKeywords(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

/**
 * Strip the site-name suffix so the layout titleTemplate doesn't double it.
 * e.g. "Rhinoplasty in Hyderabad | Dr. Divya Sai Narsingam" → "Rhinoplasty in Hyderabad"
 */
function stripSiteSuffix(title: string): string {
  if (!title) return title;
  // Remove trailing " | Dr. Divya Sai Narsingam" (case-insensitive, with optional whitespace)
  return title.replace(/\s*\|\s*Dr\.?\s*Divya\s+Sai\s+Narsingam\s*$/i, "").trim();
}

/**
 * Truncate text to a target length at a word boundary, appending "…" if truncated.
 * Used for generating meta descriptions from excerpt/content.
 */
function truncateDescription(text: string, maxLen = 155): string {
  if (!text) return "";
  // Strip HTML tags
  const clean = text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  const truncated = clean.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated) + "…";
}

/**
 * Estimate word count from HTML content (used for BlogPosting schema).
 */
function estimateWordCount(html: string): number {
  if (!html) return 0;
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.split(" ").filter(Boolean).length;
}

/* -------------------------------------------------------------------------- */
/*  Site Identity JSON-LD (homepage)                                          */
/* -------------------------------------------------------------------------- */

export function buildSiteIdentityJsonLd() {
  const credentials = doctor.qualifications.split(",").map((item) => item.trim());
  const alumniOf = education.map((item) => ({
    "@type": "CollegeOrUniversity",
    name: item.institution,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: doctor.name,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: SITE_LOGO_URL,
        },
        image: SITE_IMAGE_URL,
      },
      {
        "@type": ["MedicalClinic", "MedicalBusiness"],
        "@id": CLINIC_ID,
        name: `${doctor.name} Plastic & Reconstructive Surgery`,
        url: SITE_URL,
        image: SITE_IMAGE_URL,
        description: doctor.summary,
        telephone: "+919900135489",
        address: {
          "@type": "PostalAddress",
          streetAddress: `${contactInfo.roomNo}, ${contactInfo.street}`,
          addressLocality: contactInfo.area,
          addressRegion: "Telangana",
          postalCode: "500034",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 17.4156,
          longitude: 78.4484,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "16:00",
            closes: "17:00",
          },
        ],
        areaServed: {
          "@type": "City",
          name: "Hyderabad",
        },
        founder: {
          "@id": PHYSICIAN_ID,
        },
        parentOrganization: {
          "@id": ORGANIZATION_ID,
        },
      },
      // LocalBusiness schema for local SEO
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: `${doctor.name} – Plastic & Reconstructive Surgeon`,
        url: SITE_URL,
        image: SITE_IMAGE_URL,
        telephone: "+919900135489",
        priceRange: "₹₹₹",
        address: {
          "@type": "PostalAddress",
          streetAddress: `${contactInfo.roomNo}, ${contactInfo.street}`,
          addressLocality: contactInfo.area,
          addressRegion: "Telangana",
          postalCode: "500034",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 17.4156,
          longitude: 78.4484,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "16:00",
            closes: "17:00",
          },
        ],
        sameAs: [],
      },
      {
        "@type": "Physician",
        "@id": PHYSICIAN_ID,
        name: doctor.name,
        url: SITE_URL,
        image: SITE_IMAGE_URL,
        description: doctor.summary,
        medicalSpecialty: "Plastic and Reconstructive Surgery",
        jobTitle: doctor.title,
        telephone: "+919900135489",
        hasCredential: credentials.map((item) => ({
          "@type": "EducationalOccupationalCredential",
          credentialCategory: item,
        })),
        alumniOf,
        worksFor: {
          "@id": CLINIC_ID,
        },
      },
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*  Services page JSON-LD                                                     */
/* -------------------------------------------------------------------------- */

export function buildServicesPageJsonLd(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Plastic Surgery Services",
    url: `${SITE_URL}/services`,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/services/${service.slug}`,
      name: service.name,
      description: service.summary,
    })),
  };
}

/* -------------------------------------------------------------------------- */
/*  Static service metadata (legacy routes)                                   */
/* -------------------------------------------------------------------------- */

export function buildServiceMetadata(
  service: ServiceItem,
  category: ServiceCategory,
  slug: string,
): Metadata {
  const label = categoryLabel(category);
  const pageTitle = `${service.name} in Hyderabad`;
  const desc = `${service.shortDesc} ${label.toLowerCase()} by ${doctor.name} at AIG Hospitals, Banjara Hills & CARE Hospitals, Gachibowli, Hyderabad.`;

  return {
    title: pageTitle,
    description: desc,
    keywords: uniqueKeywords([
      service.name,
      `${service.name} Hyderabad`,
      `${service.name} Banjara Hills`,
      "Dr Divya Sai Narsingam",
      "AIG Hospitals Hyderabad",
      "CARE Hospitals Hyderabad",
    ]),
    alternates: {
      canonical: `${SITE_URL}/services/${slug}`,
    },
    openGraph: {
      type: "article",
      title: `${pageTitle} ${SITE_NAME_SUFFIX}`,
      description: desc,
      url: `${SITE_URL}/services/${slug}`,
      siteName: "Dr. Divya Sai Narsingam",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} ${SITE_NAME_SUFFIX}`,
      description: desc,
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
      name: doctor.name,
      medicalSpecialty: "Plastic and Reconstructive Surgery",
    },
    areaServed: {
      "@type": "City",
      name: "Hyderabad",
    },
    availableAtOrFrom: [
      {
        "@type": "Hospital",
        name: "AIG Hospitals, Banjara Hills",
      },
      {
        "@type": "Hospital",
        name: "CARE Hospitals, Gachibowli",
      },
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*  Breadcrumb & FAQ JSON-LD                                                  */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Static page metadata (with title deduplication)                           */
/* -------------------------------------------------------------------------- */

export function buildStaticPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const canonical = `${SITE_URL}${path}`;
  const cleanTitle = stripSiteSuffix(title);

  return {
    title: cleanTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: `${cleanTitle} ${SITE_NAME_SUFFIX}`,
      description,
      url: canonical,
      siteName: "Dr. Divya Sai Narsingam",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} ${SITE_NAME_SUFFIX}`,
      description,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Editable page metadata (admin-managed, with title deduplication)          */
/* -------------------------------------------------------------------------- */

export function buildEditablePageMetadata(page: PageSeoEntry): Metadata {
  const canonical = `${SITE_URL}${page.canonicalPath}`;
  const cleanTitle = stripSiteSuffix(page.title);

  return {
    title: cleanTitle,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: `${cleanTitle} ${SITE_NAME_SUFFIX}`,
      description: page.description,
      url: canonical,
      siteName: "Dr. Divya Sai Narsingam",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} ${SITE_NAME_SUFFIX}`,
      description: page.description,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Blog metadata (with fallbacks for empty meta_title / meta_description)    */
/* -------------------------------------------------------------------------- */

export function buildBlogMetadata(blog: Blog): Metadata {
  const canonical = `${SITE_URL}/blog/${getBlogRouteSlug(blog)}`;

  // CRITICAL FIX: fallback title and description when meta fields are empty
  const rawTitle = blog.meta_title?.trim()
    ? blog.meta_title
    : blog.title?.trim()
      ? `${blog.title} – ${doctor.name}`
      : `Plastic Surgery Blog – ${doctor.name}`;

  const pageTitle = stripSiteSuffix(rawTitle);

  const metaDescription = blog.meta_description?.trim()
    ? blog.meta_description
    : blog.excerpt?.trim()
      ? truncateDescription(blog.excerpt)
      : `Read about ${blog.title || "plastic surgery"} by ${doctor.name}, Plastic & Reconstructive Surgeon in Hyderabad.`;

  const keywords = blog.meta_keywords && blog.meta_keywords.length > 0
    ? blog.meta_keywords
    : uniqueKeywords([
        blog.title,
        `${blog.title} Hyderabad`,
        blog.category ? `${blog.category} surgery blog` : "",
        "Dr Divya Sai Narsingam blog",
        "plastic surgery blog Hyderabad",
      ]);

  return {
    title: pageTitle,
    description: metaDescription,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: `${pageTitle} ${SITE_NAME_SUFFIX}`,
      description: metaDescription,
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
      title: `${pageTitle} ${SITE_NAME_SUFFIX}`,
      description: metaDescription,
      images: [blog.image],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Blog JSON-LD (enriched with publisher logo, author details, wordCount)    */
/* -------------------------------------------------------------------------- */

export function buildBlogJsonLd(blog: Blog) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || truncateDescription(blog.content || "", 200),
    image: blog.image,
    datePublished: blog.published_at,
    dateModified: blog.updated_at ?? blog.published_at,
    wordCount: estimateWordCount(blog.content),
    mainEntityOfPage: `${SITE_URL}/blog/${getBlogRouteSlug(blog)}`,
    author: {
      "@type": "Person",
      "@id": PHYSICIAN_ID,
      name: doctor.name,
      url: SITE_URL,
      jobTitle: doctor.title,
    },
    publisher: {
      "@type": "Organization",
      name: doctor.name,
      logo: {
        "@type": "ImageObject",
        url: SITE_LOGO_URL,
      },
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Unified service metadata (with title dedup + scoped keywords + OG image)  */
/* -------------------------------------------------------------------------- */

export function buildUnifiedServiceMetadata(service: Service): Metadata {
  const canonical = `${SITE_URL}/services/${service.slug}`;

  // TITLE DEDUP FIX: strip the site name suffix so layout template doesn't double it
  const rawTitle = service.meta_title?.trim()
    ? service.meta_title
    : `${service.name} in Hyderabad`;
  const pageTitle = stripSiteSuffix(rawTitle);

  const metaDescription = service.meta_description?.trim()
    ? service.meta_description
    : `${service.summary} by ${doctor.name} at AIG Hospitals, Banjara Hills & CARE Hospitals, Gachibowli, Hyderabad.`;

  // KEYWORD SCOPING FIX: only include keywords for THIS specific service, not the whole category
  const keywords = service.meta_keywords && service.meta_keywords.length > 0
    ? service.meta_keywords
    : uniqueKeywords([
        service.name,
        `${service.name} Hyderabad`,
        `${service.name} Banjara Hills`,
        `${service.name} cost Hyderabad`,
        `best ${service.name.toLowerCase()} surgeon Hyderabad`,
        "Dr Divya Sai Narsingam",
        "AIG Hospitals Hyderabad",
        "CARE Hospitals Hyderabad",
      ]);

  // OG IMAGE FIX: if using the generic default, use the doctor's professional image instead
  const ogImage = service.image === DEFAULT_SERVICE_IMAGE
    ? SITE_IMAGE_URL
    : service.image;

  return {
    title: pageTitle,
    description: metaDescription,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: `${pageTitle} ${SITE_NAME_SUFFIX}`,
      description: metaDescription,
      url: canonical,
      images: [
        {
          url: ogImage,
          alt: service.name,
          width: 1200,
          height: 630,
        },
      ],
      siteName: "Dr. Divya Sai Narsingam",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} ${SITE_NAME_SUFFIX}`,
      description: metaDescription,
      images: [ogImage],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Unified service JSON-LD (NAP-consistent with both hospitals)              */
/* -------------------------------------------------------------------------- */

export function buildUnifiedServiceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalProcedure", "Service"],
    name: service.name,
    description: service.content,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: {
      "@type": "Physician",
      "@id": PHYSICIAN_ID,
      name: doctor.name,
      medicalSpecialty: "Plastic and Reconstructive Surgery",
    },
    areaServed: {
      "@type": "City",
      name: "Hyderabad",
    },
    availableAtOrFrom: [
      {
        "@type": "Hospital",
        name: "AIG Hospitals, Banjara Hills",
      },
      {
        "@type": "Hospital",
        name: "CARE Hospitals, Gachibowli",
      },
    ],
  };
}
