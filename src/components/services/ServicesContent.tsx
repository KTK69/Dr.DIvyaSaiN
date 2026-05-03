"use client";

import React from "react";
import PageWrapper from "@/components/ui/PageWrapper";
import ServiceCard from "@/components/ui/ServiceCard";
import Link from "next/link";
import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function ServicesContent() {
  const { content } = useSiteContent();
  const services = content.services || [];

  const reconstructive = services.filter((s) => s.category === "reconstructive");
  const cosmetic = services.filter((s) => s.category === "cosmetic");

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        {/* Reconstructive */}
        <section className="mb-20" aria-labelledby="reconstructive-heading">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1 h-8 rounded-full bg-(--accent-gold)" />
            <h2 id="reconstructive-heading" className="text-2xl font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
              Reconstructive Surgery
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reconstructive.map((svc, i) => (
              <ServiceCard key={svc.slug} name={svc.name} shortDesc={svc.summary} href={`/services/${svc.slug}`} category="reconstructive" index={i} />
            ))}
          </div>
        </section>

        {/* Cosmetic */}
        <section aria-labelledby="cosmetic-heading">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1 h-8 rounded-full bg-(--accent-blue)" />
            <h2 id="cosmetic-heading" className="text-2xl font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
              Cosmetic Surgery
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cosmetic.map((svc, i) => (
              <ServiceCard key={svc.slug} name={svc.name} shortDesc={svc.summary} href={`/services/${svc.slug}`} category="cosmetic" index={i} />
            ))}
          </div>
        </section>

        <div className="mt-16 pt-10 border-t border-(--border) text-center">
          <p className="text-sm text-(--foreground-muted) mb-4">Not sure which procedure is right for you?</p>
          <Link href="/contactus" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-(--accent-gold) text-(--background) text-sm font-medium hover:bg-(--accent-gold-light) transition-colors duration-200">
            Book a Consultation
          </Link>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
            {[
              ["Breast Reconstruction", "/services/breast-reconstruction"],
              ["Microvascular Surgery", "/services/microvascular-surgery"],
              ["Gynecomastia Reduction", "/services/gynecomastia-reduction"],
            ].map(([label, href]) => (
              <Link key={href} href={String(href)} className="glass-card rounded-xl p-4 border border-(--border) hover:border-(--accent-gold) transition-colors">
                <p className="text-sm font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>{String(label)}</p>
                <p className="mt-1 text-xs text-(--foreground-subtle)">Open service details</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
