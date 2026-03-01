import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import { Play, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Doctor's Talk | Articles & Videos by Dr. Divya Sai Narsingam",
  description:
    "Educational articles, clinical insights, and video content by Dr. Divya Sai Narsingam – Plastic & Reconstructive Surgeon at CARE Hospitals, Hyderabad.",
  alternates: {
    canonical: "https://www.drdivyanarsingam.com/doctors-talk",
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
      <div className="pt-28 pb-16 border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-3">
            Education & Insights
          </p>
          <h1
            className="text-4xl md:text-5xl font-medium text-[var(--foreground)] max-w-2xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Doctor&apos;s Talk
          </h1>
          <p className="mt-4 text-base text-[var(--foreground-muted)] max-w-xl">
            Clinical articles and educational content from Dr. Narsingam —
            helping patients understand their conditions, procedures, and
            options before they walk through the door.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        {/* Blog */}
        <section className="mb-20" aria-labelledby="articles-heading">
          <h2
            id="articles-heading"
            className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-8"
          >
            Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="glass-card rounded-xl p-6 flex flex-col group hover:border-[var(--accent-gold)] transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      post.category === "Reconstructive"
                        ? "text-[var(--accent-gold)]"
                        : "text-[var(--accent-blue)]"
                    }`}
                  >
                    {post.category}
                  </span>
                </div>
                <h3
                  className="text-base font-medium text-[var(--foreground)] mb-3 group-hover:text-[var(--accent-gold-light)] transition-colors"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {post.title}
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed flex-1 mb-5">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-[var(--foreground-subtle)]">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {post.date}
                  </span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 text-xs text-[var(--foreground-subtle)] text-center">
            Full articles will be published shortly. Check back soon.
          </p>
        </section>

        {/* Videos */}
        <section aria-labelledby="videos-heading">
          <h2
            id="videos-heading"
            className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-8"
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
                <div className="aspect-video bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-surface)] border-b border-[var(--border)] flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent-gold)] transition-colors">
                    <Play
                      size={18}
                      className="text-[var(--foreground-muted)] group-hover:text-[var(--accent-gold-light)] transition-colors ml-0.5"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-[var(--foreground-subtle)] mb-2 block">
                    Episode {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="text-sm font-medium text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {topic}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-[var(--foreground-subtle)] text-center">
            Video content coming soon. Subscribe to stay updated.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-16 pt-10 border-t border-[var(--border)] text-center">
          <p className="text-base text-[var(--foreground-muted)] mb-5">
            Have a specific question? The best place to start is a direct
            consultation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-gold)] text-[var(--background)] text-sm font-medium hover:bg-[var(--accent-gold-light)] transition-colors"
          >
            Book a Consultation <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
