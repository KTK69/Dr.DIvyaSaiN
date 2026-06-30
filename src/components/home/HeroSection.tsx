"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award } from "lucide-react";
import { useSiteContent } from "@/components/site/SiteContentProvider";

const HERO_IMAGE = "/images/img/Dr%20Divya%20Plastic%20Surgeon%20home.jpg";

export default function HeroSection() {
  const { content } = useSiteContent();
  const hero = content.home.hero;
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(59,130,246,0.05) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(184,151,42,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs font-semibold uppercase tracking-widest text-(--accent-gold) mb-5"
            >
              {hero.eyebrow}
            </motion.p>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-medium text-(--foreground) leading-tight mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {hero.title}
              <br />
              <em className="not-italic" style={{ color: "var(--accent-gold-light)" }}>
                {hero.emphasis}
              </em>{" "}
              Care.
            </h1>

            <p className="text-base text-(--foreground-muted) leading-relaxed mb-8 max-w-lg">
              {hero.summary}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={hero.ctaPrimary.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-(--accent-gold) text-(--background) text-sm font-medium hover:bg-(--accent-gold-light) transition-colors duration-200"
              >
                {hero.ctaPrimary.label}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={hero.ctaSecondary.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-(--border) text-(--foreground-muted) text-sm hover:border-(--foreground-muted) hover:text-(--foreground) transition-all duration-200"
              >
                {hero.ctaSecondary.label}
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-(--border)">
              {[
                { value: "14+", label: "Years Experience", highlight: true },
                { value: "9+", label: "Years Specialist", highlight: true },
                { value: "MCh", label: "Plastic Surgery", highlight: false },
              ].map(({ value, label, highlight }) => (
                <div key={label}>
                  <p
                    className={`font-medium ${highlight ? "text-4xl text-(--accent-gold)" : "text-3xl text-(--foreground)"}`}
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {value}
                  </p>
                  <p className={`text-sm mt-1 ${highlight ? "text-(--accent-gold-light)" : "text-(--foreground-muted)"}`}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Doctor card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
              {/* Decorative inner glow */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle, rgba(184,151,42,0.07) 0%, transparent 70%)",
                }}
              />

              {/* Doctor image */}
              <div className="w-full aspect-3/4 max-w-xs mx-auto rounded-xl overflow-hidden border border-(--border) relative mb-6">
                <Image
                  src={HERO_IMAGE}
                  alt="Dr. Divya Sai Narsingam – Plastic & Reconstructive Surgeon, AIG & CARE Hospitals Hyderabad"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              <div className="text-center">
                <h2
                  className="text-xl font-medium text-(--foreground) mb-1"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Dr. Divya Sai Narsingam
                </h2>
                <p className="text-sm text-(--accent-gold-light) mb-1">
                  MBBS, MS, MCh (Plastic Surgery)
                </p>
                <p className="text-xs text-(--foreground-muted)">
                  Consultant · AIG Hospitals, Banjara Hills & CARE Hospitals, Gachibowli
                </p>
              </div>

              {/* Award badge */}
              <div className="mt-6 pt-5 border-t border-(--border) flex items-center gap-3">
                <Award size={16} className="text-(--accent-gold) shrink-0" />
                <p className="text-xs text-(--foreground-muted)">
                  University Topper · MCh Plastic Surgery
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
