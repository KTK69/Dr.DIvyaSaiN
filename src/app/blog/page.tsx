import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import BlogListingClient from "@/components/blog/BlogListingClient";
import JsonLd from "@/components/seo/JsonLd";
import { buildStaticPageMetadata, SITE_URL } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildStaticPageMetadata(
  "Plastic Surgery Blog | Dr. Divya Sai Narsingam",
  "Clinical insights, patient education, and treatment explainers by Dr. Divya Sai Narsingam.",
  "/blog",
);

const blogListJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Dr. Divya Sai Narsingam Blog",
  url: `${SITE_URL}/blog`,
  description:
    "Articles on reconstructive and cosmetic procedures, recovery, and patient decision-making.",
};

export default async function BlogListingPage() {
  return (
    <PageWrapper>
      <JsonLd data={blogListJsonLd} />
      <BlogListingClient />
    </PageWrapper>
  );
}