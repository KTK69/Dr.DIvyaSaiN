"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { useSiteContent } from "@/components/site/SiteContentProvider";
import { getBlogCardHref } from "@/lib/blog-links";
import { getBlogDisplayTitle, getBlogPreviewText } from "@/lib/blog-preview";
import type { Blog } from "@/types/content";
import type { SiteContent } from "@/lib/site-content";

type BlogListingClientProps = {
  serverBlogs: Blog[];
  serverBlogPage: SiteContent["blogPage"];
  serverUpdatedAt: string;
};

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

function isNewerOrEqual(incoming: string | null, baseline: string) {
  if (!incoming) {
    return false;
  }
  return incoming >= baseline;
}

export default function BlogListingClient({
  serverBlogs,
  serverBlogPage,
  serverUpdatedAt,
}: BlogListingClientProps) {
  const { content, lastSyncedAt, contentReady } = useSiteContent();

  const useClientSnapshot =
    contentReady && isNewerOrEqual(lastSyncedAt, serverUpdatedAt);
  const blogs = useClientSnapshot ? content.blog : serverBlogs;
  const blogPage = useClientSnapshot ? content.blogPage : serverBlogPage;

  return (
    <>
      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-3">
            Doctor Insights
          </p>
          <h1
            className="text-4xl md:text-5xl font-medium text-(--foreground) max-w-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {blogPage.heading}
          </h1>
          <p className="mt-4 text-base text-(--foreground-muted) max-w-2xl leading-relaxed">
            {blogPage.subheading}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        <SectionHeading
          eyebrow="Latest Posts"
          title="Evidence-based, patient-first explainers"
          subtitle="These articles are designed to simplify decisions and improve consultation readiness."
        />

        {blogs.length === 0 ? (
          <p className="mt-10 text-sm text-(--foreground-muted)">
            No articles published yet. Please check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {blogs.map((post) => {
              const href = getBlogCardHref(post);
              const displayTitle = getBlogDisplayTitle(post.title, post.slug, post.content);
              const previewText = getBlogPreviewText(post.excerpt, post.content);

              return (
                <article
                  key={post.id}
                  className="glass-card rounded-xl overflow-hidden border border-(--border)"
                >
                  <Link href={href} aria-label={`Read ${displayTitle}`}>
                    {post.image ? (
                      <div className="relative aspect-16/10">
                        <Image
                          src={post.image}
                          alt={displayTitle}
                          fill
                          className="object-cover"
                          unoptimized={
                            post.image.startsWith("data:") ||
                            post.image.startsWith("blob:") ||
                            post.image.startsWith("/uploads/")
                          }
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-16/10 items-center justify-center bg-(--bg-surface) px-6 text-center">
                        <span className="text-xs uppercase tracking-[0.24em] text-(--foreground-subtle)">
                          No cover image yet
                        </span>
                      </div>
                    )}
                  </Link>
                  <div className="p-5">
                    {post.published_at ? (
                      <p className="text-xs uppercase tracking-widest text-(--foreground-subtle) mb-2">
                        {formatDate(post.published_at)}
                      </p>
                    ) : null}
                    <h2
                      className="text-lg font-medium text-(--foreground)"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      <Link href={href}>{displayTitle}</Link>
                    </h2>
                    {previewText ? (
                      <p className="mt-3 text-sm leading-relaxed text-(--foreground-muted)">
                        {previewText}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
