"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/components/site/SiteContentProvider";

export default function AboutPreview() {
  const { content } = useSiteContent();
  const about = content.home.aboutPreview;
  return (
    <section className="section-padding" aria-label="About Dr. Narsingam">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Quote card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card rounded-2xl p-10 relative">
              <div
                className="absolute top-6 left-6 text-6xl leading-none text-(--accent-gold) opacity-20"
                aria-hidden="true"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                &ldquo;
              </div>
              <blockquote className="relative">
                <p
                  className="text-xl text-(--foreground) leading-relaxed italic mb-6"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {about.quote}
                </p>
                <footer className="flex items-center gap-3">
                  <div className="w-8 h-px bg-(--accent-gold)" aria-hidden="true" />
                  <cite className="text-sm not-italic text-(--accent-gold-light)">
                    Dr. Divya Sai Narsingam
                  </cite>
                </footer>
              </blockquote>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-4">
              Your Doctor
            </p>
            <h2
              className="text-3xl md:text-4xl font-medium text-(--foreground) mb-5"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Board-Certified.
              <br />
              Clinically Experienced.
            </h2>
            <p className="text-base text-(--foreground-muted) leading-relaxed mb-6">
              {about.summary}
            </p>
            <p className="text-base text-(--foreground-muted) leading-relaxed mb-8">
              She currently practises as a Consultant at AIG Hospitals, Banjara Hills and CARE Hospitals, Gachibowli — two of Hyderabad&apos;s leading private healthcare institutions.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {about.highlights.map(({ title, desc }) => (
                <div key={title} className="p-4 rounded-lg bg-(--bg-card) border border-(--border)">
                  <p className="text-sm font-medium text-(--foreground) mb-1">{title}</p>
                  <p className="text-xs text-(--foreground-muted)">{desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-(--accent-gold-light) hover:gap-3 transition-all duration-200"
            >
              Read full biography <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
