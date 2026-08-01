import PageWrapper from "@/components/ui/PageWrapper";
import AboutContent from "@/components/about/AboutContent";
import AboutPageHeader from "@/components/about/AboutPageHeader";

export default function AboutPageContent() {
  return (
    <PageWrapper>
      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutPageHeader />
        </div>
      </div>

      <AboutContent />
    </PageWrapper>
  );
}
