import type { Metadata } from "next";
import ExperienceContent from "@/components/experience/ExperienceContent";
import ExperiencePageHeader from "@/components/experience/ExperiencePageHeader";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("experience");
}

export default function ExperiencePage() {
  return (
    <>
      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExperiencePageHeader />
        </div>
      </div>

      <ExperienceContent />
    </>
  );
}
