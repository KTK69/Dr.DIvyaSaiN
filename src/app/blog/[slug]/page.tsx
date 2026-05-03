import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/ui/PageWrapper";
import JsonLd from "@/components/seo/JsonLd";
import { fetchBlogBySlug, fetchBlogs } from "@/lib/api";
import { buildBlogJsonLd, buildBlogMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  const blogs = await fetchBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    return {};
  }

  return buildBlogMetadata(blog);
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <PageWrapper>
      <JsonLd data={buildBlogJsonLd(blog)} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <p className="text-xs uppercase tracking-widest text-[var(--foreground-subtle)] mb-3">
          {new Date(blog.published_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>

        <h1
          className="text-4xl md:text-5xl font-medium text-[var(--foreground)] leading-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {blog.title}
        </h1>

        <p className="mt-5 text-base text-[var(--foreground-muted)] leading-relaxed">
          {blog.excerpt}
        </p>

        <div className="relative aspect-[16/9] mt-8 rounded-2xl overflow-hidden border border-[var(--border)]">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
          />
        </div>

        <div className="mt-10 prose prose-invert max-w-none text-[var(--foreground-muted)] leading-relaxed">
          <p>{blog.content}</p>
        </div>
      </article>
    </PageWrapper>
  );
}