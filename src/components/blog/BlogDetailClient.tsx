"use client";

import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import RichText from "@/components/ui/RichText";
import { useSiteContent } from "@/components/site/SiteContentProvider";
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

function NotFoundBlock() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 text-center">
      <p
        className="text-5xl font-medium text-(--accent-gold) mb-4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        404
      </p>
      <h1
        className="text-2xl font-medium text-(--foreground) mb-3"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Blog not found
      </h1>
      <p className="text-sm text-(--foreground-muted) mb-6">
        We could not find that article. Explore the latest posts instead.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-(--accent-gold) text-(--background) text-sm font-medium hover:bg-(--accent-gold-light) transition-colors"
      >
        Back to blog
      </Link>
    </div>
  );
}

export default function BlogDetailClient({ slug, serverBlog }: Props) {
  const { content } = useSiteContent();
  const localBlog = content.blog.find((item) => item.slug === slug);
  const blog = localBlog ?? serverBlog ?? null;

  if (!blog) {
    return <NotFoundBlock />;
  }

  const publishedAt = formatDate(blog.published_at);

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
          {blog.title}
        </h1>

        <p className="mt-5 text-base text-(--foreground-muted) leading-relaxed">
          {blog.excerpt}
        </p>

        <div className="relative aspect-video mt-8 rounded-2xl overflow-hidden border border-(--border)">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            unoptimized={blog.image.startsWith("data:") || blog.image.startsWith("blob:")}
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
          />
        </div>

        <RichText
          value={blog.content}
          className="mt-10 max-w-none text-(--foreground-muted) leading-relaxed"
        />
      </article>
    </>
  );
}
