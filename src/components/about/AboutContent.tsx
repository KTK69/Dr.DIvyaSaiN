"use client";

import React from "react";
import Image from "next/image";
import PageWrapper from "@/components/ui/PageWrapper";
import { GraduationCap, Award, Stethoscope, Quote, Briefcase, BookOpen, FlaskConical, Mic } from "lucide-react";
import { useSiteContent } from "@/components/site/SiteContentProvider";

const ABOUT_PORTRAIT = "/images/img/about.jpeg";

export default function AboutContent() {
  const { content } = useSiteContent();
  const { about } = content;
  const { experience: experienceItems, publications, research, conferences } = content.experience;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        {/* Summary */}
        <section className="mb-20" aria-labelledby="summary-heading">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2
                id="summary-heading"
                className="text-2xl font-medium text-(--foreground) mb-5"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Professional Summary
              </h2>
              <p className="text-base text-(--foreground-muted) leading-relaxed mb-5">
                {about.bio}
              </p>
              <p className="text-base text-(--foreground-muted) leading-relaxed">
                Throughout her career, Dr. Narsingam has worked across premier
                institutions in Hyderabad and Bangalore — from MNJ Institute of
                Oncology to NIMS Hyderabad — building expertise across the full
                spectrum of plastic surgery. Her surgical philosophy centres on
                natural results, functional restoration, and patient-centred
                care.
              </p>
            </div>
            <div>
              {/* Doctor photo */}
              <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden border border-(--border) mb-6">
                <Image
                  src={ABOUT_PORTRAIT}
                  alt="Dr. Divya Sai Narsingam – Plastic & Reconstructive Surgeon, CARE Hospitals Hyderabad"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-xs text-(--foreground-subtle) uppercase tracking-widest mb-1">
                    Current Position
                  </p>
                  <p className="text-sm text-(--foreground)">{about.currentPosition}</p>
                  <p className="text-xs text-(--accent-gold-light) mt-0.5">
                    CARE Hospitals, Gachibowli, Hyderabad
                  </p>
                </div>
                <div className="border-t border-(--border) pt-4">
                  <p className="text-xs text-(--foreground-subtle) uppercase tracking-widest mb-1">
                    Experience
                  </p>
                  <p className="text-sm text-(--foreground)">{about.experienceSummary}</p>
                </div>
                <div className="border-t border-(--border) pt-4">
                  <p className="text-xs text-(--foreground-subtle) uppercase tracking-widest mb-1">
                    Highest Qualification
                  </p>
                  <p className="text-sm text-(--foreground)">{about.qualifications}</p>
                  <p className="text-xs text-(--foreground-muted) mt-0.5">{about.education?.[0]?.institution}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Philosophy */}
        <section className="mb-20" aria-labelledby="philosophy-heading">
          <h2
            id="philosophy-heading"
            className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-6"
          >
            Clinical Philosophy
          </h2>
          <div className="glass-card rounded-2xl p-10 relative">
            <Quote size={40} className="text-(--accent-gold) opacity-20 mb-4" />
            <blockquote>
              <p
                className="text-xl md:text-2xl text-(--foreground) leading-relaxed italic max-w-3xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {about.philosophy}
              </p>
            </blockquote>
          </div>
        </section>

        {/* Education */}
        <section className="mb-20" aria-labelledby="education-heading">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap size={20} className="text-(--accent-gold)" />
            <h2
              id="education-heading"
              className="text-2xl font-medium text-(--foreground)"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Education
            </h2>
          </div>
          <div className="space-y-4">
            {about.education?.map((edu) => (
              <div
                key={edu.degree}
                className="glass-card rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="shrink-0 w-2 h-2 rounded-full bg-(--accent-gold) mt-1 hidden sm:block" />
                <div className="flex-1">
                  <p className="text-base font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
                    {edu.degree}
                  </p>
                  <p className="text-sm text-(--foreground-muted) mt-0.5">{edu.institution}</p>
                  {edu.note && (
                    <p className="text-xs text-(--accent-gold-light) mt-1">{edu.note}</p>
                  )}
                </div>
                <div className="shrink-0">
                  <span className="text-xs text-(--foreground-subtle) px-3 py-1 rounded-full border border-(--border)">{edu.period}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clinical Expertise */}
        <section className="mb-20" aria-labelledby="expertise-heading">
          <div className="flex items-center gap-3 mb-8">
            <Stethoscope size={20} className="text-(--accent-gold)" />
            <h2
              id="expertise-heading"
              className="text-2xl font-medium text-(--foreground)"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Clinical Expertise
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {about.expertise?.map((item) => (
              <div key={item} className="glass-card rounded-xl p-5 flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-(--accent-gold) mt-2 shrink-0" />
                <p className="text-sm text-(--foreground-muted) leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section className="mb-20" aria-labelledby="awards-heading">
          <div className="flex items-center gap-3 mb-8">
            <Award size={20} className="text-(--accent-gold)" />
            <h2
              id="awards-heading"
              className="text-2xl font-medium text-(--foreground)"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Awards &amp; Honours
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {about.awards?.map((award) => (
              <div key={award.title} className="glass-card rounded-xl p-6 text-center">
                <p className="text-2xl font-medium text-(--accent-gold-light) mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                  {award.year}
                </p>
                <p className="text-sm font-medium text-(--foreground) mb-1">{award.title}</p>
                <p className="text-xs text-(--foreground-muted)">{award.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Career Timeline */}
        <section className="mb-20" aria-labelledby="career-heading">
          <div className="flex items-center gap-3 mb-10">
            <Briefcase size={20} className="text-(--accent-gold)" />
            <h2 id="career-heading" className="text-2xl font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
              Career Timeline
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-(--border)" aria-hidden="true" />
            <ol className="space-y-8 pl-12">
              {experienceItems.map((exp, index) => (
                <li key={`${exp.role}-${exp.institution}-${exp.period}-${index}`} className="relative">
                  <div
                    className={`absolute -left-8 top-1.5 w-3 h-3 rounded-full border-2 ${
                      exp.current ? "bg-(--accent-gold) border-(--accent-gold)" : "bg-(--bg-card) border-(--border)"
                    }`}
                  />
                  <div className="glass-card rounded-xl p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
                          {exp.role}
                        </p>
                        <p className="text-sm text-(--foreground-muted) mt-0.5">{exp.institution}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {exp.current && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-(--accent-gold) bg-opacity-20 text-(--accent-gold-light)">Current</span>
                        )}
                        <span className="text-xs text-(--foreground-subtle) px-3 py-1 rounded-full border border-(--border)">{exp.period}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Publications */}
        <section className="mb-20" aria-labelledby="publications-heading">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen size={20} className="text-(--accent-gold)" />
            <h2 id="publications-heading" className="text-2xl font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
              Publications
            </h2>
          </div>
          <div className="space-y-5">
            {publications.map((pub, i) => (
              <article key={pub.title} className="glass-card rounded-xl p-6" aria-label={`Publication ${i + 1}`}>
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-medium text-(--accent-gold) opacity-30 shrink-0" aria-hidden="true" style={{ fontFamily: "var(--font-serif)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-base font-medium text-(--foreground) mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                      &ldquo;{pub.title}&rdquo;
                    </p>
                    <p className="text-sm text-(--foreground-muted) mb-1">{pub.authors}</p>
                    <p className="text-sm text-(--accent-gold-light)">{pub.journal}, <span className="text-(--foreground-subtle)">{pub.citation}</span></p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Research */}
        <section className="mb-20" aria-labelledby="research-heading">
          <div className="flex items-center gap-3 mb-8">
            <FlaskConical size={20} className="text-(--accent-gold)" />
            <h2 id="research-heading" className="text-2xl font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
              Research Work
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {research.map((r) => (
              <div key={r.title} className="glass-card rounded-xl p-6">
                <p className="text-sm font-medium text-(--foreground) mb-2" style={{ fontFamily: "var(--font-serif)" }}>{r.title}</p>
                <span className="text-xs text-(--foreground-subtle) px-3 py-1 rounded-full border border-(--border)">{r.period}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Conference Presentations */}
        <section className="mb-20" aria-labelledby="conferences-heading">
          <div className="flex items-center gap-3 mb-8">
            <Mic size={20} className="text-(--accent-gold)" />
            <h2 id="conferences-heading" className="text-2xl font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
              Conference Presentations
            </h2>
          </div>
          <div className="space-y-5">
            {conferences.map((conf) => (
              <div key={conf.event} className="glass-card rounded-xl p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <p className="text-base font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>{conf.event}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full border border-(--border) text-(--foreground-subtle)">{conf.year}</span>
                </div>
                <ul className="space-y-2">
                  {conf.presentations.map((pres) => (
                    <li key={pres} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-(--accent-gold) mt-2 shrink-0" />
                      <p className="text-sm text-(--foreground-muted)">{pres}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
