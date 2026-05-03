import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import { Play, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import DoctorsTalkPageHeader from "@/components/doctors-talk/DoctorsTalkPageHeader";

export const metadata: Metadata = {
  title: "Doctor's Talk | Articles & Videos by Dr. Divya Sai Narsingam",
  description:
    "Educational articles, clinical insights, and video content by Dr. Divya Sai Narsingam – Plastic & Reconstructive Surgeon at CARE Hospitals, Hyderabad.",
  alternates: {
    canonical: "https://drdivyaplasticsurgeon.com/drvideo",
  },
};

const blogPosts = [
  {
    title: "Understanding Breast Reconstruction After Mastectomy",
    excerpt:
      "A clear overview of the surgical options available for breast reconstruction — from implant-based techniques to autologous flap procedures — and how to choose what's right for you.",
    category: "Reconstructive",
    date: "February 2026",
    readTime: "5 min read",
  },
  {
    title: "What Is Microvascular Surgery and Who Needs It?",
    excerpt:
      "Microvascular surgery involves transferring living tissue from one part of the body to another using a surgical microscope. It is the gold standard for complex reconstruction after trauma or cancer surgery.",
    category: "Reconstructive",
    date: "January 2026",
    readTime: "6 min read",
  },
  {
    title: "Gynecomastia: Causes, Assessment, and Surgical Correction",
    excerpt:
      "Enlarged breast tissue in males is more common than many realise. This article explains the hormonal and pharmacological causes, and when surgery is the appropriate solution.",
    category: "Cosmetic",
    date: "December 2025",
    readTime: "4 min read",
  },
  {
    title: "Scar Revision: Managing Expectations and Understanding Results",
    excerpt:
      "Not all scars can be erased, but they can be significantly improved. Dr. Narsingam explains the principles of scar revision surgery and what realistic outcomes look like.",
    category: "Reconstructive",
    date: "November 2025",
    readTime: "5 min read",
  },
  {
    title: "Abdominoplasty After Pregnancy: A Thoughtful Guide",
    excerpt:
      "Post-pregnancy abdominal changes — loose skin, diastasis recti, persistent fat deposits — are common and can be addressed surgically. This article guides patients on timing, eligibility, and what to expect.",
    category: "Cosmetic",
    date: "October 2025",
    readTime: "6 min read",
  },
  {
    title: "Hand Injuries in the Emergency Setting: A Reconstructive Perspective",
    excerpt:
      "Traumatic hand injuries require timely assessment by a specialist. Dr. Narsingam explains the reconstructive approach to tendon, nerve, and vascular injuries of the hand.",
    category: "Reconstructive",
    date: "September 2025",
    readTime: "7 min read",
  },
];

const videoTopics = [
  "Introduction to Plastic and Reconstructive Surgery",
  "Breast Reconstruction: What to Expect",
  "Scar Management After Surgery",
  "Understanding Body Contouring Procedures",
  "Oncoplastic Surgery: Combining Cancer Care with Reconstruction",
  "Microvascular Surgery Explained",
];

export default function DoctorsTalkPage() {
  return (
    <PageWrapper>
      <div className="pt-28 pb-16 border-b border-(--border) bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DoctorsTalkPageHeader />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        {/* Blog */}
        <section className="mb-20" aria-labelledby="articles-heading">
          <h2
            id="articles-heading"
            className="text-xs font-semibold uppercase tracking-widest text-(--foreground-muted) mb-8"
          >
            Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="glass-card rounded-xl p-6 flex flex-col group hover:border-(--accent-gold) transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      post.category === "Reconstructive"
                        ? "text-(--accent-gold)"
                        : "text-(--accent-blue)"
                    }`}
                  >
                    {post.category}
                  </span>
                </div>
                <h3
                  className="text-base font-medium text-(--foreground) mb-3 group-hover:text-(--accent-gold-light) transition-colors"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {post.title}
                </h3>
                <p className="text-sm text-(--foreground-muted) leading-relaxed flex-1 mb-5">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-(--foreground-subtle)">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {post.date}
                  </span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 text-xs text-(--foreground-subtle) text-center">
            Full articles will be published shortly. Check back soon.
          </p>
        </section>

        {/* Videos */}
        <section aria-labelledby="videos-heading">
          <h2
            id="videos-heading"
            className="text-xs font-semibold uppercase tracking-widest text-(--foreground-muted) mb-8"
          >
            Video Content
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videoTopics.map((topic, i) => (
              <div
                key={topic}
                className="glass-card rounded-xl overflow-hidden group"
              >
                {/* Video thumbnail placeholder */}
                <div className="aspect-video bg-linear-to-br from-(--bg-card) to-(--bg-surface) border-b border-(--border) flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-(--border) flex items-center justify-center group-hover:border-(--accent-gold) transition-colors">
                    <Play
                      size={18}
                      className="text-(--foreground-muted) group-hover:text-(--accent-gold-light) transition-colors ml-0.5"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-(--foreground-subtle) mb-2 block">
                    Episode {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="text-sm font-medium text-(--foreground)"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {topic}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-(--foreground-subtle) text-center">
            Video content coming soon. Subscribe to stay updated.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-16 pt-10 border-t border-(--border) text-center">
          <p className="text-base text-(--foreground-muted) mb-5">
            Have a specific question? The best place to start is a direct
            consultation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-(--accent-gold) text-(--background) text-sm font-medium hover:bg-(--accent-gold-light) transition-colors"
          >
            Book a Consultation <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}

