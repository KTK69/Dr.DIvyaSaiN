import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageWrapper from "@/components/ui/PageWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import JsonLd from "@/components/seo/JsonLd";
import { fetchBlogs } from "@/lib/api";
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
  const blogs = await fetchBlogs();

  return (
    <PageWrapper>
      <JsonLd data={blogListJsonLd} />

      <div className="pt-28 pb-16 border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-3">
            Doctor Insights
          </p>
          <h1
            className="text-4xl md:text-5xl font-medium text-[var(--foreground)] max-w-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Blog and patient education
          </h1>
          <p className="mt-4 text-base text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Practical medical guidance for patients exploring reconstructive and
            cosmetic treatment options.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        <SectionHeading
          eyebrow="Latest Posts"
          title="Evidence-based, patient-first explainers"
          subtitle="These articles are designed to simplify decisions and improve consultation readiness."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {blogs.map((post) => (
            <article
              key={post.id}
              className="glass-card rounded-xl overflow-hidden border border-[var(--border)]"
            >
              <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                <div className="relative aspect-[16/10]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
              <div className="p-5">
                <p className="text-xs uppercase tracking-widest text-[var(--foreground-subtle)] mb-2">
                  {new Date(post.published_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h2
                  className="text-lg font-medium text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)]">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}