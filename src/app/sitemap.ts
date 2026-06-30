import type { MetadataRoute } from "next";
import { fetchBlogs, fetchServices } from "@/lib/api";
import { getBlogRouteSlug } from "@/lib/blog-links";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    url: `${SITE_URL}/about`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/aboutus`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/experience`,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/drvideo`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/doctors-talk`,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/reviews`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/blog`,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/services`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/contactus`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/privacy-policy`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/plastic-surgeon-banjarahills`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/before-after`,
    changeFrequency: "monthly",
    priority: 0.7,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, services] = await Promise.all([fetchBlogs(), fetchServices()]);

  return [
    ...staticRoutes,
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...blogs
      .map((blog) => ({ blog, slug: getBlogRouteSlug(blog) }))
      .filter(({ slug }) => Boolean(slug))
      .map(({ blog, slug }) => ({
        url: `${SITE_URL}/blog/${slug}`,
        lastModified: new Date(blog.updated_at ?? blog.published_at),
        changeFrequency: "monthly" as const,
        priority: 0.64,
      })),
  ];
}
