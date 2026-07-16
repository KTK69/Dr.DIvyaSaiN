"use client";

import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSiteContent } from "@/components/site/SiteContentProvider";
import RichText from "@/components/ui/RichText";
import type { Service } from "@/types/content";

interface Props {
  slug: string;
  serverService?: Service | null;
}

export default function ServiceDetailClient({ slug, serverService }: Props) {
  const { content } = useSiteContent();
  const services: Service[] = (content.services as Service[]) || [];

  const service = services.find((s) => s.slug === slug) || serverService || undefined;
  if (!service) return null;

  const related: Service[] = services.filter((s) => s.slug !== slug && s.category === service.category).slice(0, 3);
  const reconstructive: Service[] = services.filter((s) => s.category === "reconstructive").slice(0, 3);
  const keyPoints = service.key_points ?? [];
  const faqItems = service.faq ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="text-2xl font-medium text-(--foreground) mb-5" style={{ fontFamily: "var(--font-serif)" }}>
              Overview
            </h2>
            <RichText
              value={service.content}
              className="text-base text-(--foreground-muted) leading-relaxed"
            />
          </section>

          <section aria-labelledby="keypoints-heading">
            <h2 id="keypoints-heading" className="text-2xl font-medium text-(--foreground) mb-5" style={{ fontFamily: "var(--font-serif)" }}>
              What this includes
            </h2>
            <ul className="space-y-3" role="list">
              {keyPoints.map((point: string) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-(--accent-blue) mt-0.5 shrink-0" />
                  <span className="text-sm text-(--foreground-muted) leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card rounded-xl p-8" aria-labelledby="consultation-heading">
            <h2 id="consultation-heading" className="text-xl font-medium text-(--foreground) mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              Schedule a Consultation
            </h2>
            <p className="text-sm text-(--foreground-muted) leading-relaxed mb-5">
              Dr. Narsingam believes every aesthetic concern deserves a thoughtful, unhurried consultation. She reviews your goals, examines your anatomy, and explains realistic outcomes before any procedure is recommended.
            </p>
            <Link href="/contactus" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-(--accent-gold) text-(--background) text-sm font-medium hover:bg-(--accent-gold-light) transition-colors">
              Book Video Consultation <ArrowRight size={15} />
            </Link>
          </section>

          <section className="glass-card rounded-xl p-8" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-xl font-medium text-(--foreground) mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Frequently asked questions
            </h2>
            <div className="space-y-4 text-sm text-(--foreground-muted) leading-relaxed">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <p className="font-medium text-(--foreground) mb-1">{item.question}</p>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-base font-medium text-(--foreground) mb-4" style={{ fontFamily: "var(--font-serif)" }}>Your Surgeon</h3>
            <p className="text-sm font-medium text-(--foreground)">Dr. Divya Sai Narsingam</p>
            <p className="text-xs text-(--accent-gold-light) mt-0.5">MCh (Plastic Surgery)</p>
            <p className="text-xs text-(--foreground-muted) mt-3 leading-relaxed">Consultant at AIG Hospitals, Banjara Hills & CARE Hospitals, Gachibowli, Hyderabad. 14+ years of reconstructive and aesthetic surgery experience.</p>
            <Link href="/about" className="mt-4 inline-flex text-xs text-(--foreground-subtle) hover:text-(--accent-gold-light) transition-colors">Full biography →</Link>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--foreground-muted) mb-4">Related Procedures</h3>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/services/${r.category === 'reconstructive' ? 'reconstructive' : 'cosmetic'}/${r.slug}`} className="text-sm text-(--foreground-muted) hover:text-(--foreground) transition-colors flex items-center gap-1">
                    <ArrowRight size={11} /> {r.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-(--border)">
              <p className="text-xs text-(--foreground-subtle) mb-2">Reconstructive services:</p>
              {reconstructive.map((r) => (
                <Link key={r.slug} href={`/services/reconstructive/${r.slug}`} className="block text-sm text-(--foreground-muted) hover:text-(--foreground) transition-colors py-1">{r.name}</Link>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--foreground-muted) mb-3">Location</h3>
            <p className="text-sm text-(--foreground-muted) leading-relaxed">
              Room No. 20, 1st Floor,<br/>
              AIG Hospitals, Banjara Hills,<br/>
              Hyderabad – 500034
              <br/><br/>
              Room No 212<br/>
              CARE Hospitals — Gachibowli, Hyderabad
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
