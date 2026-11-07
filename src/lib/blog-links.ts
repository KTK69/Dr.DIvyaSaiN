import type { Blog } from "@/types/content";

const URL_PATTERN = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|\/[A-Za-z0-9][^\s<>"']*)/i;
const TRAILING_PUNCTUATION = /[),.;!?]+$/;
const CANONICAL_SLUG_OVERRIDES: Record<string, string> = {
  "blog-1783155145253": "hernia-repair-with-tummy-tuck",
};

export function normalizeBlogSlug(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    decoded = trimmed;
  }

  return decoded
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBlogRouteSlug(blog: Pick<Blog, "id" | "slug">) {
  const source = normalizeBlogSlug(blog.slug || blog.id);
  return CANONICAL_SLUG_OVERRIDES[source] ?? source;
}

export function isIndexableBlog(blog: Pick<Blog, "id" | "slug" | "title" | "content">) {
  return Boolean(getBlogRouteSlug(blog) && blog.title?.trim() && blog.content?.trim());
}

export function getBlogInternalHref(blog: Pick<Blog, "id" | "slug">) {
  const routeSlug = getBlogRouteSlug(blog);
  return routeSlug ? `/blog/${encodeURIComponent(routeSlug)}` : "/blog";
}

export function getExcerptUrl(excerpt: string) {
  const match = excerpt.match(URL_PATTERN);
  if (!match?.[0]) {
    return null;
  }

  const rawUrl = match[0].replace(TRAILING_PUNCTUATION, "");
  return rawUrl.startsWith("www.") ? `https://${rawUrl}` : rawUrl;
}

export function getBlogCardHref(blog: Pick<Blog, "id" | "slug" | "excerpt">) {
  return getExcerptUrl(blog.excerpt) ?? getBlogInternalHref(blog);
}
