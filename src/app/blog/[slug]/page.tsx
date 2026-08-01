import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import PageWrapper from "@/components/ui/PageWrapper";
import JsonLd from "@/components/seo/JsonLd";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import { fetchBlogBySlug, fetchBlogs } from "@/lib/api";
import { getBlogRouteSlug, normalizeBlogSlug } from "@/lib/blog-links";
import { buildBlogJsonLd, buildBlogMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

const legacyBlogRedirects: Record<string, string> = {
  "natural-vs-artificial-dimples-differences": "natural-vs-artificial-dimples",
};

export async function generateStaticParams() {
  const blogs = await fetchBlogs();
  return blogs
    .map((blog) => getBlogRouteSlug(blog))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeBlogSlug(slug);

  if (legacyBlogRedirects[normalizedSlug]) {
    return {};
  }

  const blog = await fetchBlogBySlug(normalizedSlug);

  if (!blog) {
    return {};
  }

  return buildBlogMetadata(blog);
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const normalizedSlug = normalizeBlogSlug(slug);

  if (legacyBlogRedirects[normalizedSlug]) {
    permanentRedirect(`/blog/${legacyBlogRedirects[normalizedSlug]}`);
  }

  const blog = await fetchBlogBySlug(normalizedSlug);

  if (!blog) {
    notFound();
  }

  const canonicalSlug = getBlogRouteSlug(blog);
  if (canonicalSlug !== normalizedSlug) {
    permanentRedirect(`/blog/${canonicalSlug}`);
  }

  return (
    <PageWrapper>
      <JsonLd data={buildBlogJsonLd(blog)} />
      <BlogDetailClient slug={canonicalSlug} serverBlog={blog} />
    </PageWrapper>
  );
}
