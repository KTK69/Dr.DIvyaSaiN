import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import JsonLd from "@/components/seo/JsonLd";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
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

  return (
    <PageWrapper>
      {blog ? <JsonLd data={buildBlogJsonLd(blog)} /> : null}
      <BlogDetailClient slug={slug} serverBlog={blog} />
    </PageWrapper>
  );
}