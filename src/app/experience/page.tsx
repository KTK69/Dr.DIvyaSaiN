import type { Metadata } from "next";
import ExperienceContent from "@/components/experience/ExperienceContent";
import ExperiencePageHeader from "@/components/experience/ExperiencePageHeader";

export const metadata: Metadata = {
  title: "Experience & Academics | Dr. Divya Sai Narsingam",
  description:
    "Academic and professional timeline of Dr. Divya Sai Narsingam – publications, research, conference presentations, and career experience at CARE Hospitals Hyderabad.",
  alternates: {
    canonical: "https://drdivyaplasticsurgeon.com/experience",
  },
};

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
