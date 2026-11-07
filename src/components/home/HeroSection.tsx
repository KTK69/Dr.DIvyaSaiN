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
      className="relative flex items-center overflow-hidden pt-28 sm:pt-32 lg:min-h-[min(900px,100vh)] lg:pt-24"
      aria-label="Hero"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(47,107,93,0.1) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(241,223,217,0.7) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-16 xl:gap-24">
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
              className="max-w-3xl text-[clamp(2.5rem,6vw,5.25rem)] font-medium leading-[1.05] tracking-[-0.04em] text-(--foreground) mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {hero.title}
              <br />
              <em className="not-italic" style={{ color: "var(--accent-gold-light)" }}>
                {hero.emphasis}
              </em>{" "}
              Care.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-(--foreground-muted) mb-8 sm:text-lg">
              {hero.summary}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href={hero.ctaPrimary.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-(--accent-gold) px-6 py-3 text-center text-sm font-medium text-(--background) transition-colors duration-200 hover:bg-(--accent-gold-light) sm:w-auto"
              >
                {hero.ctaPrimary.label}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={hero.ctaSecondary.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-(--border) px-6 py-3 text-center text-sm text-(--foreground-muted) transition-all duration-200 hover:border-(--foreground-muted) hover:text-(--foreground) sm:w-auto"
              >
                {hero.ctaSecondary.label}
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 mt-10 max-w-xl border-t border-(--border) pt-6 sm:mt-12 sm:gap-8 sm:pt-8">
              {[
                { value: "14+", label: "Years Experience", highlight: true },
                { value: "9+", label: "Years Specialist", highlight: true },
                { value: "MCh", label: "Plastic Surgery", highlight: false },
              ].map(({ value, label, highlight }) => (
                <div key={label}>
                  <p
                    className={`font-medium ${highlight ? "text-3xl text-(--accent-gold) sm:text-4xl" : "text-2xl text-(--foreground) sm:text-3xl"}`}
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {value}
                  </p>
                  <p className={`mt-1 text-[11px] leading-tight sm:text-sm ${highlight ? "text-(--accent-gold-light)" : "text-(--foreground-muted)"}`}>
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
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <div className="glass-card relative overflow-hidden rounded-2xl p-5 sm:p-8">
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
              <div className="relative mx-auto mb-6 aspect-[4/5] w-full max-w-[22rem] overflow-hidden rounded-xl border border-(--border) sm:aspect-3/4">
                <Image
                  src={HERO_IMAGE}
                  alt="Dr. Divya Sai Narsingam – Plastic & Reconstructive Surgeon at AIG Hospitals, Aura Aesthetics & CARE Hospitals, Hyderabad"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 40vw, 520px"
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
                <p className="mx-auto max-w-sm text-xs leading-relaxed text-(--foreground-muted)">
                  Consultant · AIG Hospitals, Banjara Hills & Aura Aesthetics & CARE Hospitals, Gachibowli
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
