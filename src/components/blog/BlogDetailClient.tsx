"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import RichText from "@/components/ui/RichText";
import { useSiteContent } from "@/components/site/SiteContentProvider";
import { getBlogRouteSlug, normalizeBlogSlug } from "@/lib/blog-links";
import { getBlogDisplayTitle, getBlogPreviewText } from "@/lib/blog-preview";
import { buildBlogJsonLd } from "@/lib/seo";
import type { Blog } from "@/types/content";

interface Props {
  slug: string;
  serverBlog?: Blog | null;
}

function formatDate(value?: string) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BlogDetailClient({ slug, serverBlog }: Props) {
  const { content } = useSiteContent();
  const normalizedSlug = normalizeBlogSlug(slug);
  const localBlog = content.blog.find((item) => getBlogRouteSlug(item) === normalizedSlug);
  const blog = serverBlog ?? localBlog ?? null;

  if (!blog) {
    notFound();
  }

  const publishedAt = formatDate(blog.published_at);
  const displayTitle = getBlogDisplayTitle(blog.title, blog.slug, blog.content);
  const previewText = getBlogPreviewText(blog.excerpt, blog.content);

  return (
    <>
      {!serverBlog && localBlog ? <JsonLd data={buildBlogJsonLd(localBlog)} /> : null}

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {publishedAt ? (
          <p className="text-xs uppercase tracking-widest text-(--foreground-subtle) mb-3">
            {publishedAt}
          </p>
        ) : null}

        <h1
          className="text-4xl md:text-5xl font-medium text-(--foreground) leading-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {displayTitle}
        </h1>

        {previewText ? (
          <p className="mt-5 text-base text-(--foreground-muted) leading-relaxed">
            {previewText}
          </p>
        ) : null}

        {blog.image ? (
          <div className="relative aspect-video mt-8 rounded-2xl overflow-hidden border border-(--border)">
            <Image
              src={blog.image}
              alt={displayTitle}
              fill
              className="object-cover"
              unoptimized={
                blog.image.startsWith("data:") ||
                blog.image.startsWith("blob:") ||
                blog.image.startsWith("/uploads/")
              }
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>
        ) : null}

        <RichText
          value={blog.content}
          className="mt-10 max-w-none text-(--foreground-muted) leading-relaxed"
          demoteHeadings
        />
      </article>
    </>
  );
}
