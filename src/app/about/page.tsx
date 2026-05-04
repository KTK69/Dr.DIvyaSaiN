import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";
import AboutPageHeader from "@/components/about/AboutPageHeader";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("about");
}

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutPageHeader />
        </div>
      </div>

      {/* Dynamic about content (client) */}
      <AboutContent />
    </>
  );
}
