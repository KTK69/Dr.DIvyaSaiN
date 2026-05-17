import type { Metadata } from "next";
import BlogListingPage from "@/app/blog/page";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("blog");
}

export default function BlogsPage() {
  return <BlogListingPage />;
}
