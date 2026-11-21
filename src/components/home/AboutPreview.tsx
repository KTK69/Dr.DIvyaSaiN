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
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-4">
              Your Doctor
            </p>
            <h2
              className="text-3xl md:text-4xl font-medium text-(--foreground)"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Specialist care, shaped around you
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-(--foreground-muted) leading-relaxed">
              {about.summary}
            </p>

            <Link
              href="/aboutus"
              className="mt-7 inline-flex items-center gap-2 text-sm text-(--accent-gold-light) hover:gap-3 transition-all duration-200"
            >
              Read full biography <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
