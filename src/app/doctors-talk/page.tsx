import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import DoctorsTalkPageHeader from "@/components/doctors-talk/DoctorsTalkPageHeader";
import DoctorsTalkContent from "@/components/doctors-talk/DoctorsTalkContent";

export const metadata: Metadata = {
  title: "Doctor's Talk | Articles & Videos by Dr. Divya Sai Narsingam",
  description:
    "Educational articles, clinical insights, and video content by Dr. Divya Sai Narsingam – Plastic & Reconstructive Surgeon at CARE Hospitals, Hyderabad.",
  alternates: {
    canonical: "https://drdivyaplasticsurgeon.com/drvideo",
  },
};

export default function DoctorsTalkPage() {
  return (
    <PageWrapper>
      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DoctorsTalkPageHeader />
        </div>
      </div>

      <DoctorsTalkContent />
    </PageWrapper>
  );
}

