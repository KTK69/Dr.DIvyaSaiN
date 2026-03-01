import type { Metadata } from "next";
import PageWrapper from "@/components/ui/PageWrapper";
import {
  experience,
  publications,
  research,
  conferences,
  awards,
} from "@/lib/doctor-data";
import { Briefcase, BookOpen, FlaskConical, Mic, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Experience & Academics | Dr. Divya Sai Narsingam",
  description:
    "Academic and professional timeline of Dr. Divya Sai Narsingam – publications, research, conference presentations, and career experience at CARE Hospitals Hyderabad.",
  alternates: {
    canonical: "https://www.drdivyanarsingam.com/experience",
  },
};

export default function ExperiencePage() {
  return (
    <PageWrapper>
      <div className="pt-28 pb-16 border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-3">
            Academic & Professional Record
          </p>
          <h1
            className="text-4xl md:text-5xl font-medium text-[var(--foreground)] max-w-2xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Experience &amp; Academics
          </h1>
          <p className="mt-4 text-base text-[var(--foreground-muted)] max-w-xl">
            A detailed overview of Dr. Narsingam's career, research
            contributions, publications, and academic honours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding space-y-20">
        {/* Career Timeline */}
        <section aria-labelledby="career-heading">
          <div className="flex items-center gap-3 mb-10">
            <Briefcase size={20} className="text-[var(--accent-gold)]" />
            <h2
              id="career-heading"
              className="text-2xl font-medium text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Career Timeline
            </h2>
          </div>
          <div className="relative">
            <div
              className="absolute left-4 top-2 bottom-2 w-px bg-[var(--border)]"
              aria-hidden="true"
            />
            <ol className="space-y-8 pl-12">
              {experience.map((exp) => (
                <li key={exp.role} className="relative">
                  <div
                    className={`absolute -left-8 top-1.5 w-3 h-3 rounded-full border-2 ${
                      exp.current
                        ? "bg-[var(--accent-gold)] border-[var(--accent-gold)]"
                        : "bg-[var(--bg-card)] border-[var(--border)]"
                    }`}
                  />
                  <div className="glass-card rounded-xl p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p
                          className="text-base font-medium text-[var(--foreground)]"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          {exp.role}
                        </p>
                        <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
                          {exp.institution}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {exp.current && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-gold)] bg-opacity-20 text-[var(--accent-gold-light)]">
                            Current
                          </span>
                        )}
                        <span className="text-xs text-[var(--foreground-subtle)] px-3 py-1 rounded-full border border-[var(--border)]">
                          {exp.period}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Publications */}
        <section aria-labelledby="publications-heading">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen size={20} className="text-[var(--accent-gold)]" />
            <h2
              id="publications-heading"
              className="text-2xl font-medium text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Publications
            </h2>
          </div>
          <div className="space-y-5">
            {publications.map((pub, i) => (
              <article
                key={pub.title}
                className="glass-card rounded-xl p-6"
                aria-label={`Publication ${i + 1}`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="text-2xl font-medium text-[var(--accent-gold)] opacity-30 shrink-0"
                    aria-hidden="true"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p
                      className="text-base font-medium text-[var(--foreground)] mb-1"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      &ldquo;{pub.title}&rdquo;
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)] mb-1">
                      {pub.authors}
                    </p>
                    <p className="text-sm text-[var(--accent-gold-light)]">
                      {pub.journal},{" "}
                      <span className="text-[var(--foreground-subtle)]">
                        {pub.citation}
                      </span>
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Research */}
        <section aria-labelledby="research-heading">
          <div className="flex items-center gap-3 mb-8">
            <FlaskConical size={20} className="text-[var(--accent-gold)]" />
            <h2
              id="research-heading"
              className="text-2xl font-medium text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Research Work
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {research.map((r) => (
              <div key={r.title} className="glass-card rounded-xl p-6">
                <p
                  className="text-sm font-medium text-[var(--foreground)] mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {r.title}
                </p>
                <span className="text-xs text-[var(--foreground-subtle)] px-3 py-1 rounded-full border border-[var(--border)]">
                  {r.period}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Conferences */}
        <section aria-labelledby="conferences-heading">
          <div className="flex items-center gap-3 mb-8">
            <Mic size={20} className="text-[var(--accent-gold)]" />
            <h2
              id="conferences-heading"
              className="text-2xl font-medium text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Conference Presentations
            </h2>
          </div>
          <div className="space-y-5">
            {conferences.map((conf) => (
              <div key={conf.event} className="glass-card rounded-xl p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <p
                    className="text-base font-medium text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {conf.event}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--foreground-subtle)]">
                    {conf.year}
                  </span>
                </div>
                <ul className="space-y-2">
                  {conf.presentations.map((pres) => (
                    <li key={pres} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] mt-2 shrink-0" />
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {pres}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section aria-labelledby="awards-exp-heading">
          <div className="flex items-center gap-3 mb-8">
            <Award size={20} className="text-[var(--accent-gold)]" />
            <h2
              id="awards-exp-heading"
              className="text-2xl font-medium text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Awards &amp; Honours
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {awards.map((award) => (
              <div
                key={award.title}
                className="glass-card rounded-xl p-6 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(184,151,42,0.08) 0%, transparent 70%)",
                  }}
                />
                <p
                  className="text-3xl font-medium text-[var(--accent-gold-light)] mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {award.year}
                </p>
                <p className="text-sm font-medium text-[var(--foreground)] mb-1">
                  {award.title}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {award.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
