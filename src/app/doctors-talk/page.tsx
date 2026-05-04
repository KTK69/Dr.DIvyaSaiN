import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import DoctorsTalkPageHeader from "@/components/doctors-talk/DoctorsTalkPageHeader";
import DoctorsTalkContent from "@/components/doctors-talk/DoctorsTalkContent";
import { getEditablePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getEditablePageMetadata("doctorsTalk");
}

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

